export class AudioRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private recognition: any = null;
  private recognizedTranscript: string = '';
  private animFrameId: number | null = null;
  private isCalibrated: boolean = false;
  private noiseFloor: number = 20;
  private calibrationSamples: number[] = [];
  private activeVocalMs: number = 0;
  private lastFrameTime: number = 0;
  private acousticWords: number = 0;

  async startRecording(
    onAudioLevel?: (level: number) => void,
    onLiveWords?: (transcript: string, wordCount: number) => void
  ): Promise<void> {
    this.audioChunks = [];
    this.recognizedTranscript = '';
    this.isCalibrated = false;
    this.noiseFloor = 20;
    this.calibrationSamples = [];
    this.activeVocalMs = 0;
    this.acousticWords = 0;
    this.lastFrameTime = performance.now();

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // 1. Web Audio API for frequency spectrum, mic volume & calibrated voice activity
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.75;
    this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
    this.sourceNode.connect(this.analyser);

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const processAudio = (now: number) => {
      if (!this.analyser || !this.stream?.active) return;

      const deltaMs = this.lastFrameTime ? Math.min(now - this.lastFrameTime, 100) : 16;
      this.lastFrameTime = now;

      this.analyser.getByteFrequencyData(dataArray as any);

      // Focus on human vocal tract formant range (bins 2 to 32, approx 150 Hz - 3500 Hz)
      let vocalSum = 0;
      let count = 0;
      for (let i = 2; i < Math.min(36, dataArray.length); i++) {
        vocalSum += dataArray[i];
        count++;
      }
      const vocalEnergy = count > 0 ? vocalSum / count : 0;

      // Calibration phase: sample ambient room noise for initial 400ms
      if (!this.isCalibrated) {
        this.calibrationSamples.push(vocalEnergy);
        if (this.calibrationSamples.length >= 25) {
          const sum = this.calibrationSamples.reduce((a, b) => a + b, 0);
          this.noiseFloor = Math.max(sum / this.calibrationSamples.length, 12);
          this.isCalibrated = true;
        }
      }

      // Normalized mic level for planetary visualizer glow
      if (onAudioLevel) {
        const netLevel = Math.max(0, vocalEnergy - this.noiseFloor) / 80;
        onAudioLevel(Math.min(netLevel, 1.0));
      }

      // Voice Activity Detection: Vocal energy must be distinctly above calibrated noise floor
      const voiceThreshold = this.noiseFloor + 18;
      if (this.isCalibrated && vocalEnergy > voiceThreshold) {
        this.activeVocalMs += deltaMs;

        // Natural speaking cadence: 1 word every ~430ms of active vocalization
        if (this.activeVocalMs >= 430) {
          this.activeVocalMs -= 430;
          this.acousticWords++;

          const sttWords = this.recognizedTranscript.split(/\s+/).filter(Boolean).length;
          const bestCount = Math.max(sttWords, this.acousticWords);

          if (onLiveWords) {
            onLiveWords(this.recognizedTranscript, bestCount);
          }
        }
      }

      this.animFrameId = requestAnimationFrame(processAudio);
    };

    this.animFrameId = requestAnimationFrame(processAudio);

    // 2. Real-Time Web Speech Recognition for live text transcripts
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
          }
          this.recognizedTranscript = currentText.trim();
          const words = this.recognizedTranscript.split(/\s+/).filter(Boolean);
          const sttCount = words.length;
          this.acousticWords = Math.max(this.acousticWords, sttCount);

          if (onLiveWords) {
            onLiveWords(this.recognizedTranscript, Math.max(sttCount, this.acousticWords));
          }
        };

        this.recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition interim notice:', e.error);
        };

        this.recognition.onend = () => {
          // Auto-restart recognition if still active
          if (this.stream?.active && this.recognition) {
            try { this.recognition.start(); } catch (_) {}
          }
        };

        this.recognition.start();
      } catch (err) {
        console.warn('SpeechRecognition initialization notice:', err);
      }
    }

    // 3. MediaRecorder for binary audio sent to Groq Whisper v3
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/mp4')
      ? 'audio/mp4'
      : 'audio/wav';

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };
    this.mediaRecorder.start(250);
  }

  getFrequencyData(dataArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(dataArray as any);
    }
  }

  stopRecording(): Promise<{ audioBlob: Blob; audioUrl: string; liveTranscript: string }> {
    return new Promise((resolve, reject) => {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }

      if (this.recognition) {
        try { this.recognition.stop(); } catch (_) {}
      }

      if (!this.mediaRecorder) {
        reject(new Error('Recorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        const transcript = this.recognizedTranscript;
        this.cleanup();
        resolve({ audioBlob, audioUrl, liveTranscript: transcript });
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  cleanup(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.recognition) {
      try { this.recognition.abort(); } catch (_) {}
      this.recognition = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
