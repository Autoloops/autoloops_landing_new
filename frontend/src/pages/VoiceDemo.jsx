import React, { useEffect, useState } from 'react';
import VoiceCapture from '../components/voice/VoiceCapture';

const VoiceDemo = () => {
  const [clip, setClip] = useState(null);

  useEffect(() => {
    return () => {
      if (clip?.url) URL.revokeObjectURL(clip.url);
    };
  }, [clip]);

  const handleComplete = ({ blob, mimeType, durationMs }) => {
    setClip((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return {
        url: URL.createObjectURL(blob),
        mimeType,
        durationMs,
        size: blob.size,
      };
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-white">
      <h1 className="mb-8 font-mono text-sm uppercase tracking-[0.14em] text-white/55">
        Voice capture
      </h1>
      <VoiceCapture onRecordingComplete={handleComplete} />
      {clip && (
        <div className="mt-10 w-full max-w-sm space-y-3">
          <p className="font-mono text-xs text-white/55" data-testid="voice-demo-meta">
            {clip.mimeType} · {(clip.durationMs / 1000).toFixed(1)}s · {clip.size} bytes
          </p>
          <audio
            controls
            src={clip.url}
            className="w-full"
            data-testid="voice-demo-playback"
          />
        </div>
      )}
    </div>
  );
};

export default VoiceDemo;
