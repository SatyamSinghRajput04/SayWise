import Groq from 'groq-sdk';
import { config } from '../config/index.js';
import { GrammarFeedbackItem, VocabularySuggestionItem, CEFRLevel } from '../types/index.js';

export class GroqService {
  private groq: Groq | null = null;

  constructor() {
    if (config.groqApiKey) {
      this.groq = new Groq({ apiKey: config.groqApiKey });
    }
  }

  async generateLlmCandidates(
    transcript: string,
    topicTitle: string,
    topicPrompt: string
  ): Promise<{
    grammarCandidates: GrammarFeedbackItem[];
    vocabularySuggestions: VocabularySuggestionItem[];
    whatYouDidWell: string[];
    actionPlan: string[];
    llmGrammarScore?: number;
    llmVocabScore?: number;
  }> {
    if (!this.groq) {
      return {
        grammarCandidates: [],
        vocabularySuggestions: [],
        whatYouDidWell: [
          'Spoke with clear conversational rhythm and good lexical range.',
          `Addressed the core themes of the topic: "${topicTitle}".`,
        ],
        actionPlan: [
          'Practice active substitution of common adjectives with academic C1 alternatives.',
          'Focus on dependent prepositions during spontaneous speaking drills.',
        ],
      };
    }

    const systemPrompt = `You are a certified Senior IELTS & Cambridge Spoken English Examiner evaluating a spoken English response for SayWise.

CRITICAL ASSESSMENT PROTOCOL:
1. Thoroughly identify ALL grammatical errors, unidiomatic phrasing, wrong word forms, preposition mistakes, tense inconsistencies, and awkward sentence structures.
2. For every mistake detected:
   - "original": exact problematic phrase from the transcript.
   - "better": natural, idiomatic standard English correction.
   - "why": clear linguistic explanation of the rule violated.
   - "category": Preposition | Article | Countability | Subject-Verb | Tense | Collocation | Redundancy | Sentence Structure
   - "type": "error" (grammatically wrong) or "style" (unnatural / awkward phrasing)
   - "severity": "critical" (meaning is distorted/broken) | "major" (clear grammatical mistake) | "minor" (small slip)
   - "confidence": 0.95
3. Provide 3-5 high-impact CEFR C1/C2 vocabulary upgrades for words in the transcript.
4. Calculate authentic scores (0-100) reflecting real speaking performance.

Return ONLY a valid JSON object matching this schema:
{
  "grammarCandidates": [
    {
      "original": "exact problematic spoken phrase",
      "better": "natural standard English correction",
      "why": "clear grammatical explanation",
      "category": "Preposition" | "Article" | "Countability" | "Subject-Verb" | "Tense" | "Collocation" | "Redundancy" | "Sentence Structure",
      "type": "error" | "style",
      "severity": "critical" | "major" | "minor",
      "confidence": number
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "basic or overused word from transcript",
      "better": "advanced CEFR C1/C2 synonym",
      "why": "why this elevates lexical precision in spoken English",
      "cefrLevel": "B2" | "C1" | "C2"
    }
  ],
  "grammarScore": number,
  "vocabularyScore": number,
  "whatYouDidWell": ["specific strength 1", "specific strength 2"],
  "actionPlan": ["targeted drill 1", "targeted drill 2"]
}`;

    const modelsToTry = [
      'openai/gpt-oss-120b',
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-20b',
      'qwen/qwen3.6-27b'
    ];

    for (const model of modelsToTry) {
      try {
        const completion = await this.groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Topic: "${topicTitle}"\nPrompt: "${topicPrompt}"\n\nSpoken Transcript to evaluate:\n"${transcript}"`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        });

        const raw = completion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            grammarCandidates: (parsed.grammarCandidates || []).map((item: any, idx: number) => ({
              ...item,
              id: `llm_${idx + 1}`,
              source: 'llm',
              confidence: typeof item.confidence === 'number' ? Math.max(0.6, Math.min(0.99, item.confidence)) : 0.95,
            })),
            vocabularySuggestions: (parsed.vocabularySuggestions || []).map((v: any, idx: number) => ({
              ...v,
              id: `v_${idx + 1}`,
            })),
            whatYouDidWell: parsed.whatYouDidWell || ['Demonstrated clear speaking intent.'],
            actionPlan: parsed.actionPlan || ['Practice targeted grammatical substitution drills.'],
            llmGrammarScore: typeof parsed.grammarScore === 'number' ? parsed.grammarScore : undefined,
            llmVocabScore: typeof parsed.vocabularyScore === 'number' ? parsed.vocabularyScore : undefined,
          };
        }
      } catch (err: any) {
        console.warn(`Groq model ${model} evaluation error:`, err.message || err);
      }
    }

    return {
      grammarCandidates: [],
      vocabularySuggestions: [],
      whatYouDidWell: ['Demonstrated clear speaking intent.'],
      actionPlan: ['Practice response structure drills.'],
    };
  }
}

export const groqService = new GroqService();
