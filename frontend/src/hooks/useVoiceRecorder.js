import { useCallback, useEffect, useRef, useState } from 'react';

const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
];

function pickSupportedMimeType() {
  if (typeof MediaRecorder === 'undefined') return '';
  if (typeof MediaRecorder.isTypeSupported !== 'function') return '';
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function describeMediaError(err) {
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
  if (name === 'OverconstrainedError') {
    return 'No microphone matches the requested settings.';
  }
  return err?.message || 'Could not start recording.';
}

export function useVoiceRecorder({
  onRecordingComplete,
  maxDurationMs = 60000,
} = {}) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const onCompleteRef = useRef(onRecordingComplete);
  const maxDurationRef = useRef(maxDurationMs);
  const statusRef = useRef(status);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const mimeTypeRef = useRef('');
  const startedAtRef = useRef(0);
  const maxTimerRef = useRef(null);
  const tickRef = useRef(null);
  const stoppingRef = useRef(false);
  const discardedRef = useRef(false);
  const startGenerationRef = useRef(0);

  onCompleteRef.current = onRecordingComplete;
  maxDurationRef.current = maxDurationMs;
  statusRef.current = status;

  const clearTimers = useCallback(() => {
    if (maxTimerRef.current != null) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    if (tickRef.current != null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // ignore
      }
    });
    streamRef.current = null;
  }, []);

  const finalize = useCallback((shouldDeliver) => {
    clearTimers();
    const chunks = chunksRef.current;
    const mimeType = mimeTypeRef.current || chunks[0]?.type || 'audio/webm';
    const durationMs = startedAtRef.current ? Date.now() - startedAtRef.current : 0;
    chunksRef.current = [];
    mimeTypeRef.current = '';
    startedAtRef.current = 0;
    recorderRef.current = null;
    stoppingRef.current = false;
    releaseStream();
    setElapsedMs(0);

    if (discardedRef.current) return;

    setStatus('idle');

    if (!shouldDeliver || chunks.length === 0) return;

    const blob = new Blob(chunks, { type: mimeType });
    if (blob.size === 0) return;

    onCompleteRef.current?.({
      blob,
      mimeType: blob.type || mimeType,
      durationMs,
    });
  }, [clearTimers, releaseStream]);

  const stop = useCallback(() => {
    if (stoppingRef.current) return;
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      if (streamRef.current) {
        finalize(false);
      }
      return;
    }
    stoppingRef.current = true;
    clearTimers();
    try {
      recorder.stop();
    } catch {
      finalize(true);
    }
  }, [clearTimers, finalize]);

  const start = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setError('This browser does not support microphone recording.');
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      setStatus('error');
      setError('This browser does not support audio recording.');
      return;
    }
    if (statusRef.current === 'recording' || statusRef.current === 'requesting') {
      return;
    }

    const generation = ++startGenerationRef.current;
    setError(null);
    setStatus('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      if (discardedRef.current || generation !== startGenerationRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        if (discardedRef.current) return;
        clearTimers();
        releaseStream();
        recorderRef.current = null;
        stoppingRef.current = false;
        setStatus('error');
        setError('Recording failed.');
      };

      recorder.onstop = () => {
        finalize(true);
      };

      recorder.start();
      startedAtRef.current = Date.now();
      setElapsedMs(0);
      setStatus('recording');

      tickRef.current = setInterval(() => {
        if (startedAtRef.current) {
          setElapsedMs(Date.now() - startedAtRef.current);
        }
      }, 200);

      const cap = maxDurationRef.current;
      if (cap > 0) {
        maxTimerRef.current = setTimeout(() => {
          stop();
        }, cap);
      }
    } catch (err) {
      if (discardedRef.current || generation !== startGenerationRef.current) {
        return;
      }
      releaseStream();
      setStatus('error');
      setError(describeMediaError(err));
    }
  }, [clearTimers, finalize, releaseStream, stop]);

  const toggle = useCallback(() => {
    if (statusRef.current === 'requesting') return;
    if (statusRef.current === 'recording') {
      stop();
      return;
    }
    start();
  }, [start, stop]);

  useEffect(() => {
    discardedRef.current = false;
    return () => {
      discardedRef.current = true;
      startGenerationRef.current += 1;
      clearTimers();
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.onstop = null;
          recorder.stop();
        } catch {
          // ignore
        }
      }
      recorderRef.current = null;
      releaseStream();
    };
  }, [clearTimers, releaseStream]);

  return {
    status,
    error,
    elapsedMs,
    isRecording: status === 'recording',
    isRequesting: status === 'requesting',
    toggle,
    start,
    stop,
  };
}
