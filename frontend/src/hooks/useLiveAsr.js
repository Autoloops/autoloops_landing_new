import { useCallback, useEffect, useRef, useState } from 'react';

const GRANT_URL = 'https://asr.autoloops.ai/api/grant';
const DG_QUERY =
  'model=nova-3&encoding=linear16&sample_rate=16000&channels=1&interim_results=true&punctuate=true&smart_format=false&language=multi';
const QW_QUERY =
  'encoding=linear16&sample_rate=16000&channels=1&interim_results=true&punctuate=true&language=multi&endpointing=800';
const CLOSE_WAIT_MS = 1000;
const FRAME_SAMPLES = 320;
const VAD_RMS = 0.015;
const VAD_VOICED_FRAMES = 3;
const VAD_QUIET_FRAMES = 12;
const MIN_RESP_MS = 120;

const WORKLET_SOURCE = `
class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetRate = 16000;
    this.frameSize = ${FRAME_SAMPLES};
    this.ratio = sampleRate / this.targetRate;
    this.src = [];
    this.readPos = 0;
    this.pending = [];
  }
  process(inputs) {
    const input = inputs[0] && inputs[0][0];
    if (input && input.length) {
      for (let i = 0; i < input.length; i++) this.src.push(input[i]);
    }
    const last = this.src.length - 1;
    let guard = 0;
    while (this.readPos <= last && guard < 20000) {
      guard++;
      const i0 = Math.min(Math.floor(this.readPos), last);
      const frac = this.readPos - i0;
      const s1 = this.src[Math.min(i0 + 1, last)];
      this.pending.push(this.src[i0] + (s1 - this.src[i0]) * frac);
      this.readPos += this.ratio;
      if (this.pending.length >= this.frameSize) {
        const frame = this.pending.splice(0, this.frameSize);
        const pcm = new Int16Array(this.frameSize);
        for (let i = 0; i < this.frameSize; i++) {
          const x = Math.max(-1, Math.min(1, frame[i]));
          pcm[i] = x < 0 ? x * 0x8000 : x * 0x7fff;
        }
        this.port.postMessage(pcm.buffer, [pcm.buffer]);
      }
    }
    const drop = Math.max(0, Math.floor(this.readPos) - 1);
    if (drop > 0) {
      this.src.splice(0, drop);
      this.readPos -= drop;
    }
    return true;
  }
}
registerProcessor('pcm-capture', PcmCaptureProcessor);
`;

function emptyPane() {
  return {
    committed: '',
    interim: '',
    connectMs: null,
    ttftMs: null,
    respMs: null,
    respMed: null,
    wordCount: 0,
    finalizeMs: null,
    totalMs: null,
    status: 'idle',
    error: null,
  };
}

function initMetrics() {
  return {
    lastLen: { dg: 0, qw: 0 },
    respHistory: { dg: [], qw: [] },
    pendingOnset: { dg: 0, qw: 0 },
    vad: { voicedRun: 0, quietRun: 99 },
  };
}

function frameRms(buffer) {
  const samples = new Int16Array(buffer);
  if (!samples.length) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const x = samples[i] / 32768;
    sum += x * x;
  }
  return Math.sqrt(sum / samples.length);
}

function medianOf(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function withQuery(base, query) {
  if (!base) return '';
  return base.includes('?') ? `${base}&${query}` : `${base}?${query}`;
}

function paneText(pane) {
  return `${pane.committed} ${pane.interim}`.trim();
}

function wordCountOf(pane) {
  const text = paneText(pane);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function describeStartError(err) {
  const name = err?.name;
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Microphone permission was denied.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No microphone found.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Microphone is already in use.';
  }
  if (name === 'SecurityError') {
    return 'Microphone requires HTTPS or localhost.';
  }
  return err?.message || 'Could not start recording.';
}

function transcriptFromMessage(raw) {
  let msg = raw;
  if (typeof raw === 'string') {
    try {
      msg = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!msg || typeof msg !== 'object') return null;
  if (msg.type === 'Metadata') return { kind: 'metadata' };
  if (msg.type && msg.type !== 'Results') return null;
  const transcript = msg.channel?.alternatives?.[0]?.transcript;
  if (typeof transcript !== 'string') return null;
  return {
    kind: 'results',
    transcript,
    isFinal: Boolean(msg.is_final),
  };
}

function floatsToPcm16(frame) {
  const pcm = new Int16Array(frame.length);
  for (let i = 0; i < frame.length; i += 1) {
    const x = Math.max(-1, Math.min(1, frame[i]));
    pcm[i] = x < 0 ? x * 0x8000 : x * 0x7fff;
  }
  return pcm.buffer;
}

function createResampler(srcRate, onFrame) {
  const ratio = srcRate / 16000;
  let src = [];
  let readPos = 0;
  let pending = [];
  return (input) => {
    for (let i = 0; i < input.length; i += 1) src.push(input[i]);
    const last = src.length - 1;
    let guard = 0;
    while (readPos <= last && guard < 20000) {
      guard += 1;
      const i0 = Math.min(Math.floor(readPos), last);
      const frac = readPos - i0;
      const s1 = src[Math.min(i0 + 1, last)];
      pending.push(src[i0] + (s1 - src[i0]) * frac);
      readPos += ratio;
      if (pending.length >= FRAME_SAMPLES) {
        onFrame(floatsToPcm16(pending.splice(0, FRAME_SAMPLES)));
      }
    }
    const drop = Math.max(0, Math.floor(readPos) - 1);
    if (drop > 0) {
      src = src.slice(drop);
      readPos -= drop;
    }
  };
}

function openSocketSafe(url, protocols) {
  try {
    return new WebSocket(url, protocols);
  } catch (err) {
    console.warn('WebSocket subprotocol failed, retrying without', err);
    return new WebSocket(url);
  }
}

export function useLiveAsr() {
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [deepgram, setDeepgram] = useState(emptyPane);
  const [qwen, setQwen] = useState(emptyPane);

  const sessionRef = useRef(0);
  const phaseRef = useRef(phase);
  const socketsRef = useRef({ dg: null, qw: null });
  const audioRef = useRef({
    stream: null,
    ctx: null,
    source: null,
    worklet: null,
    processor: null,
    mute: null,
    workletUrl: null,
  });
  const paneRef = useRef({ dg: emptyPane(), qw: emptyPane() });
  const timesRef = useRef({
    startedAt: 0,
    firstFrameAt: { dg: 0, qw: 0 },
    closeAt: { dg: 0, qw: 0 },
  });
  const metricsRef = useRef(initMetrics());
  const sendingRef = useRef(false);
  const tickRef = useRef(null);

  phaseRef.current = phase;

  const setPane = useCallback((key, patch) => {
    const next = { ...paneRef.current[key], ...patch };
    next.wordCount = wordCountOf(next);
    paneRef.current[key] = next;
    if (key === 'dg') setDeepgram(next);
    else setQwen(next);
  }, []);

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const sendFrame = useCallback((buffer) => {
    if (!sendingRef.current) return;
    const { vad, pendingOnset } = metricsRef.current;
    if (frameRms(buffer) > VAD_RMS) {
      vad.voicedRun += 1;
      if (vad.voicedRun === VAD_VOICED_FRAMES && vad.quietRun >= VAD_QUIET_FRAMES) {
        const onsetAt = Date.now() - (VAD_VOICED_FRAMES - 1) * 20;
        pendingOnset.dg = onsetAt;
        pendingOnset.qw = onsetAt;
      }
      if (vad.voicedRun >= VAD_VOICED_FRAMES) vad.quietRun = 0;
    } else {
      vad.voicedRun = 0;
      vad.quietRun += 1;
    }
    ['dg', 'qw'].forEach((key) => {
      const ws = socketsRef.current[key];
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      if (!timesRef.current.firstFrameAt[key]) {
        timesRef.current.firstFrameAt[key] = Date.now();
      }
      try {
        ws.send(buffer.slice(0));
      } catch (err) {
        console.warn('ASR frame send failed', key, err);
      }
    });
  }, []);

  const stopAudio = useCallback(() => {
    sendingRef.current = false;
    const audio = audioRef.current;
    if (audio.worklet) {
      try {
        audio.worklet.port.onmessage = null;
        audio.worklet.disconnect();
      } catch {
        // ignore
      }
    }
    if (audio.processor) {
      try {
        audio.processor.onaudioprocess = null;
        audio.processor.disconnect();
      } catch {
        // ignore
      }
    }
    if (audio.source) {
      try {
        audio.source.disconnect();
      } catch {
        // ignore
      }
    }
    if (audio.mute) {
      try {
        audio.mute.disconnect();
      } catch {
        // ignore
      }
    }
    if (audio.ctx && audio.ctx.state !== 'closed') {
      audio.ctx.close().catch(() => {});
    }
    if (audio.stream) {
      audio.stream.getTracks().forEach((track) => track.stop());
    }
    if (audio.workletUrl) {
      URL.revokeObjectURL(audio.workletUrl);
    }
    audioRef.current = {
      stream: null,
      ctx: null,
      source: null,
      worklet: null,
      processor: null,
      mute: null,
      workletUrl: null,
    };
  }, []);

  const closeSockets = useCallback(() => {
    ['dg', 'qw'].forEach((key) => {
      const ws = socketsRef.current[key];
      socketsRef.current[key] = null;
      if (!ws) return;
      try {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      } catch {
        // ignore
      }
    });
  }, []);

  const teardown = useCallback(() => {
    clearTick();
    stopAudio();
    closeSockets();
  }, [closeSockets, stopAudio]);

  const handleSocketMessage = useCallback((key, event) => {
    const parsed = transcriptFromMessage(event.data);
    if (!parsed) return;
    const pane = paneRef.current[key];
    const now = Date.now();

    if (parsed.kind === 'metadata') {
      const closeAt = timesRef.current.closeAt[key];
      setPane(key, {
        finalizeMs: closeAt ? now - closeAt : pane.finalizeMs,
        totalMs: timesRef.current.startedAt ? now - timesRef.current.startedAt : pane.totalMs,
      });
      return;
    }

    const patch = {};
    if (parsed.transcript && pane.ttftMs == null && timesRef.current.firstFrameAt[key]) {
      patch.ttftMs = now - timesRef.current.firstFrameAt[key];
    }

    if (parsed.isFinal) {
      patch.committed = `${pane.committed} ${parsed.transcript}`.trim();
      patch.interim = '';
    } else {
      patch.interim = parsed.transcript;
    }

    const stats = metricsRef.current;
    const nextLen = paneText({
      committed: patch.committed ?? pane.committed,
      interim: patch.interim ?? pane.interim,
    }).length;
    if (nextLen > stats.lastLen[key]) {
      const onsetAt = stats.pendingOnset[key];
      if (onsetAt && now - onsetAt >= MIN_RESP_MS) {
        patch.respMs = now - onsetAt;
        stats.respHistory[key].push(patch.respMs);
        stats.pendingOnset[key] = 0;
      }
      stats.lastLen[key] = nextLen;
    }

    setPane(key, patch);
  }, [setPane]);

  const openSocket = useCallback((key, url, protocols) => {
    const openedAt = Date.now();
    const ws = openSocketSafe(url, protocols);
    socketsRef.current[key] = ws;
    setPane(key, { status: 'connecting', error: null });

    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      if (socketsRef.current[key] !== ws) return;
      setPane(key, { status: 'live', connectMs: Date.now() - openedAt, error: null });
    };

    ws.onmessage = (event) => {
      if (socketsRef.current[key] !== ws) return;
      handleSocketMessage(key, event);
    };

    ws.onerror = () => {
      if (socketsRef.current[key] !== ws) return;
      setPane(key, { status: 'error', error: 'Connection failed.' });
    };

    ws.onclose = (event) => {
      if (socketsRef.current[key] !== ws) return;
      socketsRef.current[key] = null;
      const pane = paneRef.current[key];
      if (pane.status === 'live' && phaseRef.current === 'recording') {
        setPane(key, {
          status: 'error',
          error: event.reason ? `Disconnected (${event.reason})` : 'Disconnected.',
        });
      }
    };

    return ws;
  }, [handleSocketMessage, setPane]);

  const attachScriptProcessor = useCallback((ctx, source, mute) => {
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    const resample = createResampler(ctx.sampleRate, sendFrame);
    processor.onaudioprocess = (event) => {
      if (!sendingRef.current) return;
      resample(event.inputBuffer.getChannelData(0));
    };
    source.connect(processor);
    processor.connect(mute);
    mute.connect(ctx.destination);
    audioRef.current.processor = processor;
    audioRef.current.source = source;
    audioRef.current.mute = mute;
    sendingRef.current = true;
  }, [sendFrame]);

  const startAudio = useCallback(async (ctx, stream, session) => {
    const source = ctx.createMediaStreamSource(stream);
    const mute = ctx.createGain();
    mute.gain.value = 0;
    audioRef.current.source = source;
    audioRef.current.mute = mute;

    try {
      const workletUrl = URL.createObjectURL(
        new Blob([WORKLET_SOURCE], { type: 'application/javascript' }),
      );
      audioRef.current.workletUrl = workletUrl;
      await ctx.audioWorklet.addModule(workletUrl);
      if (session !== sessionRef.current) return;

      const worklet = new AudioWorkletNode(ctx, 'pcm-capture');
      source.connect(worklet);
      worklet.connect(mute);
      mute.connect(ctx.destination);
      audioRef.current.worklet = worklet;
      sendingRef.current = true;
      worklet.port.onmessage = (event) => {
        if (session !== sessionRef.current) return;
        sendFrame(event.data);
      };
    } catch (err) {
      console.warn('AudioWorklet unavailable, using ScriptProcessor', err);
      if (session !== sessionRef.current) return;
      attachScriptProcessor(ctx, source, mute);
    }
  }, [attachScriptProcessor, sendFrame]);

  const start = useCallback(async () => {
    teardown();
    const session = sessionRef.current + 1;
    sessionRef.current = session;
    paneRef.current = { dg: emptyPane(), qw: emptyPane() };
    timesRef.current = { startedAt: 0, firstFrameAt: { dg: 0, qw: 0 }, closeAt: { dg: 0, qw: 0 } };
    metricsRef.current = initMetrics();
    setDeepgram(emptyPane());
    setQwen(emptyPane());
    setError(null);
    setElapsedMs(0);
    setPhase('recording');
    setPane('dg', { status: 'connecting' });
    setPane('qw', { status: 'connecting' });

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      setPhase('idle');
      setError('This browser does not support audio capture.');
      return;
    }

    let ctx;
    try {
      ctx = new AudioCtx({ sampleRate: 16000 });
    } catch {
      ctx = new AudioCtx();
    }
    audioRef.current.ctx = ctx;

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (session !== sessionRef.current) return;

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('This browser does not support microphone recording.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (session !== sessionRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      audioRef.current.stream = stream;

      const grantRes = await fetch(GRANT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!grantRes.ok) {
        throw new Error(`Grant failed (${grantRes.status}).`);
      }
      const grant = await grantRes.json();
      if (session !== sessionRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const dgCreds = grant.deepgram || {};
      const qwCreds = grant.qwen || {};
      if (!dgCreds.url || !dgCreds.access_token || !qwCreds.url || !qwCreds.token) {
        throw new Error('Grant response was missing credentials.');
      }

      openSocket(
        'dg',
        withQuery(dgCreds.url, `${DG_QUERY}&access_token=${encodeURIComponent(dgCreds.access_token)}`),
        ['bearer', dgCreds.access_token],
      );
      openSocket('qw', withQuery(qwCreds.url, QW_QUERY), ['token', qwCreds.token]);

      timesRef.current.startedAt = Date.now();
      tickRef.current = setInterval(() => {
        if (!timesRef.current.startedAt) return;
        setElapsedMs(Date.now() - timesRef.current.startedAt);
      }, 200);

      await startAudio(ctx, stream, session);
    } catch (err) {
      if (session !== sessionRef.current) return;
      console.error('Live ASR start failed', err);
      teardown();
      setPhase('idle');
      setError(describeStartError(err));
    }
  }, [openSocket, setPane, startAudio, teardown]);

  const stop = useCallback(async () => {
    if (phaseRef.current !== 'recording') return;
    const liveSession = sessionRef.current;
    sessionRef.current += 1;
    sendingRef.current = false;
    clearTick();
    stopAudio();

    const now = Date.now();
    ['dg', 'qw'].forEach((key) => {
      timesRef.current.closeAt[key] = now;
      const ws = socketsRef.current[key];
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: 'CloseStream' }));
        } catch {
          // ignore
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, CLOSE_WAIT_MS));
    if (sessionRef.current !== liveSession + 1) return;

    const endedAt = Date.now();
    const total = timesRef.current.startedAt ? endedAt - timesRef.current.startedAt : null;
    ['dg', 'qw'].forEach((key) => {
      const pane = paneRef.current[key];
      setPane(key, {
        status: pane.status === 'error' ? 'error' : 'done',
        interim: '',
        committed: paneText(pane),
        respMed: medianOf(metricsRef.current.respHistory[key]),
        totalMs: pane.totalMs ?? total,
      });
    });

    closeSockets();
    setElapsedMs(total || 0);
    setPhase('done');
  }, [closeSockets, setPane, stopAudio]);

  const reset = useCallback(() => {
    sessionRef.current += 1;
    teardown();
    paneRef.current = { dg: emptyPane(), qw: emptyPane() };
    metricsRef.current = initMetrics();
    setDeepgram(emptyPane());
    setQwen(emptyPane());
    setError(null);
    setElapsedMs(0);
    setPhase('idle');
  }, [teardown]);

  useEffect(() => () => {
    sessionRef.current += 1;
    teardown();
  }, [teardown]);

  return {
    phase,
    error,
    elapsedMs,
    deepgram,
    qwen,
    start,
    stop,
    reset,
    displayText: {
      dg: paneText(deepgram),
      qw: paneText(qwen),
    },
  };
}
