class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetRate = 16000;
    this.frameSize = 320;
    this.ratio = sampleRate / this.targetRate;
    this.src = [];
    this.readPos = 0;
    this.pending = [];
  }

  process(inputs) {
    const input = inputs[0] && inputs[0][0];
    if (input && input.length) {
      for (let i = 0; i < input.length; i += 1) {
        this.src.push(input[i]);
      }
    }

    const last = this.src.length - 1;
    while (this.readPos <= last) {
      const i0 = Math.floor(this.readPos);
      if (i0 > last) break;
      const frac = this.readPos - i0;
      const s0 = this.src[i0];
      const s1 = this.src[Math.min(i0 + 1, last)];
      this.pending.push(s0 + (s1 - s0) * frac);
      this.readPos += this.ratio;

      if (this.pending.length >= this.frameSize) {
        const frame = this.pending.splice(0, this.frameSize);
        const pcm = new Int16Array(this.frameSize);
        for (let i = 0; i < this.frameSize; i += 1) {
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
