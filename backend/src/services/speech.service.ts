import fs from 'fs';
import Groq from 'groq-sdk';
import { config } from '../config/index.js';

export class SpeechService {
  private groq: Groq | null = null;

  constructor() {
    if (config.groqApiKey) {
      this.groq = new Groq({ apiKey: config.groqApiKey });
    }
  }

  async transcribeAudio(filePath: string, clientTranscript?: string): Promise<{ transcript: string; durationSeconds: number }> {
    // 1. If Groq API Key is configured and audio file exists, use Whisper Large v3
    if (this.groq && fs.existsSync(filePath)) {
      try {
        const fileStream = fs.createReadStream(filePath);
        const transcription = await this.groq.audio.transcriptions.create({
          file: fileStream,
          model: 'whisper-large-v3',
          response_format: 'verbose_json',
          temperature: 0.0,
        });

        const transcript = (transcription as any).text?.trim() || '';
        const durationSeconds = Math.round((transcription as any).duration || 0);
        return { transcript, durationSeconds };
      } catch (err: any) {
        console.error('Groq Whisper API transcription error:', err.message || err);
        // If client provided a live transcript from browser recognition, use it
        if (clientTranscript && clientTranscript.trim()) {
          const wordCount = clientTranscript.trim().split(/\s+/).filter(Boolean).length;
          return { transcript: clientTranscript.trim(), durationSeconds: Math.max(Math.round(wordCount / 2.2), 10) };
        }
        throw new Error(`Speech-to-Text failed: ${err.message || 'Groq transcription error'}`);
      }
    }

    // 2. If client provided live recognized speech from browser Web Speech API
    if (clientTranscript && clientTranscript.trim()) {
      const wordCount = clientTranscript.trim().split(/\s+/).filter(Boolean).length;
      const durationSeconds = Math.max(Math.round(wordCount / 2.2), 10);
      return { transcript: clientTranscript.trim(), durationSeconds };
    }

    // 3. If neither Whisper nor client transcript produced text (Silence / empty mic)
    return { transcript: '', durationSeconds: 0 };
  }
}

export const speechService = new SpeechService();
