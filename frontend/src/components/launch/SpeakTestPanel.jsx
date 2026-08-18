import React from 'react';
import { useLiveAsr } from '../../hooks/useLiveAsr';

function formatClock(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatMeta(pane, isDone) {
  if (pane.error) return pane.error;
  if (pane.status === 'connecting') return 'connecting';
  const parts = [];
  if (pane.ttftMs != null) parts.push(`${pane.ttftMs} ms ttft`);
  else if (pane.connectMs != null && !isDone) parts.push(`${pane.connectMs} ms conn`);
  if (isDone && pane.finalizeMs != null) parts.push(`${pane.finalizeMs} ms fin`);
  if (isDone && pane.wordCount > 0) parts.push(`${pane.wordCount}w`);
  if (isDone && pane.totalMs != null) parts.push(`${(pane.totalMs / 1000).toFixed(1)}s`);
  return parts.join(' · ');
}

function ModelMark({ src, size = 16 }) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

const SpeakTestPanel = () => {
  const {
    phase,
    error,
    elapsedMs,
    deepgram,
    qwen,
    start,
    stop,
    reset,
    displayText,
  } = useLiveAsr();

  const isRecording = phase === 'recording';
  const isDone = phase === 'done';
  const showLive = isRecording || isDone;
  const dgMeta = formatMeta(deepgram, isDone);
  const qwMeta = formatMeta(qwen, isDone);

  return (
    <div className="flex flex-col justify-center px-7 py-8">
      <div className="border border-[#141414] bg-[#fbfaf7]">
        <div className="flex items-center justify-between border-b border-[#141414] px-4 py-3.5 font-jetbrains">
          <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14px] text-[#888]">
            <span className="inline-flex items-center gap-2 font-bold text-[#141414]">
              <ModelMark src="/assets/logos/deepgram.svg" size={20} />
              Deepgram Nova-3
            </span>
            <span>v/s</span>
            <span className="inline-flex items-center gap-2 font-bold text-[#141414]">
              <ModelMark src="/assets/logos/qwen.svg" size={20} />
              Qwen3-ASR-1.7B
            </span>
          </span>
          {isRecording && (
            <span className="launch-blink text-[11px] text-[#b3261e]">
              ● rec {formatClock(elapsedMs)}
            </span>
          )}
        </div>

        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-3.5 px-4 py-9">
            <button
              type="button"
              onClick={start}
              data-testid="speak-and-test"
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-none border-0 bg-[#141414] px-7 py-3.5 font-jetbrains text-xs font-bold tracking-[0.06em] text-[#fbfaf7] hover:bg-[#0d7a3f]"
            >
              <span className="h-2 w-2 rounded-full bg-[#ff5c5c]" aria-hidden="true" />
              SPEAK AND TEST
            </button>
            <span className="font-jetbrains text-[10px] text-[#888]">
              speak a sentence — both models transcribe it in parallel
            </span>
            {error && (
              <span className="max-w-xs text-center font-jetbrains text-[10px] text-[#b3261e]">
                {error}
              </span>
            )}
          </div>
        )}

        {showLive && (
          <>
            <div className="border-b border-[#141414] px-4 py-3.5">
              <div className="mb-1.5 flex justify-between gap-3 font-jetbrains text-[9.5px] text-[#888]">
                <span className="inline-flex items-center gap-1.5">
                  <ModelMark src="/assets/logos/deepgram.svg" size={13} />
                  01 / deepgram nova-3
                </span>
                {dgMeta && <span className="text-right">{dgMeta}</span>}
              </div>
              <p className="m-0 min-h-5 text-[12.5px] leading-[1.65] text-[#444]">
                {displayText.dg}
                {isRecording && <span className="launch-blink-fast">▍</span>}
              </p>
            </div>
            <div className="border-b border-[#141414] bg-[rgba(13,122,63,.05)] px-4 py-3.5">
              <div className="mb-1.5 flex justify-between gap-3 font-jetbrains text-[9.5px] text-[#0d7a3f]">
                <span className="inline-flex items-center gap-1.5">
                  <ModelMark src="/assets/logos/qwen.svg" size={13} />
                  02 / qwen3-asr-1.7b · autoloops
                </span>
                {qwMeta && (
                  <span className={`text-right ${isDone ? 'font-bold' : ''}`}>{qwMeta}</span>
                )}
              </div>
              <p className="m-0 min-h-5 text-[12.5px] leading-[1.65] text-[#141414]">
                {displayText.qw}
                {isRecording && (
                  <span className="launch-blink-fast text-[#0d7a3f]">▍</span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 font-jetbrains text-[9.5px] text-[#888]">
              {isRecording ? (
                <span className="launch-blink">listening…</span>
              ) : (
                <span />
              )}
              {isRecording ? (
                <button
                  type="button"
                  onClick={stop}
                  data-testid="stop-and-transcribe"
                  className="cursor-pointer rounded-none border-0 bg-[#b3261e] px-3 py-1.5 font-jetbrains text-[9.5px] font-bold text-[#fbfaf7] hover:bg-[#8f1e18]"
                >
                  ■ STOP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={reset}
                  className="cursor-pointer rounded-none border border-[#141414] bg-transparent px-3 py-1.5 font-jetbrains text-[9.5px] font-bold text-[#141414] hover:bg-[#141414] hover:text-[#fbfaf7]"
                >
                  ↺ RECORD AGAIN
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpeakTestPanel;
