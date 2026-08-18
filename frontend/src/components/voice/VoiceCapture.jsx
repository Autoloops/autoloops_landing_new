import React from 'react';
import { Mic } from 'lucide-react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const VoiceCapture = ({
  onRecordingComplete,
  maxDurationMs = 60000,
  className = '',
}) => {
  const { status, error, elapsedMs, isRecording, isRequesting, toggle } =
    useVoiceRecorder({ onRecordingComplete, maxDurationMs });

  const label = isRecording
    ? 'Stop recording'
    : isRequesting
      ? 'Waiting for microphone'
      : 'Start recording';

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={isRequesting}
        aria-label={label}
        aria-pressed={isRecording}
        data-testid="voice-capture-button"
        className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
          isRecording
            ? 'bg-red-500 text-white'
            : status === 'error'
              ? 'bg-white/10 text-red-400 hover:bg-white/15'
              : 'bg-white text-ink hover:bg-white/90'
        } ${isRequesting ? 'cursor-wait opacity-70' : ''}`}
      >
        {isRecording && (
          <span
            className="absolute inset-0 animate-ping rounded-full bg-red-500/40"
            aria-hidden="true"
          />
        )}
        <Mic className="relative h-6 w-6" strokeWidth={1.75} />
      </button>
      {isRecording && (
        <p
          className="font-mono text-xs tabular-nums text-white/55"
          data-testid="voice-capture-elapsed"
        >
          {formatElapsed(elapsedMs)}
        </p>
      )}
      {error && (
        <p
          className="max-w-xs text-center text-sm text-red-400"
          data-testid="voice-capture-error"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceCapture;
