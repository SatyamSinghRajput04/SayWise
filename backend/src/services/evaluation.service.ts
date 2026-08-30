import { v4 as uuidv4 } from 'uuid';
import { speechService } from './speech.service.js';
import { groqService } from './groq.service.js';
import { runRuleBasedGrammarScanner } from '../utils/dynamicNlpAnalyzer.js';
import { adjudicatorService } from './adjudicator.service.js';
import { analyzeAcousticsAndFluency } from '../utils/acousticAnalyzer.js';
import { evaluationRepository } from '../repositories/evaluation.repository.js';
import { topicRepository } from '../repositories/topic.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { EvaluationResult, CEFRLevel, VocabularySuggestionItem } from '../types/index.js';

export class EvaluationService {
  async evaluateSubmission(params: {
    userId: string;
    topicId: string;
    filePath?: string;
    transcriptInput?: string;
    durationSeconds?: number;
  }): Promise<EvaluationResult> {
    const topic = await topicRepository.getById(params.topicId);
    const topicTitle = topic?.title || 'Speaking Practice';
    const topicPrompt = topic?.prompt || 'Free speaking practice.';

    // 1. Ingest & Transcribe (Layer 1: Normalization)
    let transcript = params.transcriptInput?.trim() || '';
    let durationSeconds = params.durationSeconds || 0;

    if (params.filePath) {
      const sttResult = await speechService.transcribeAudio(params.filePath, params.transcriptInput);
      if (sttResult.transcript) {
        transcript = sttResult.transcript;
      }
      if (!durationSeconds || durationSeconds <= 0) {
        durationSeconds = sttResult.durationSeconds;
      }
    }

    // Silence & Voice Activity Detection (VAD) Guard
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      const error: any = new Error(
        'No speech detected. Please check your microphone permissions and speak clearly for at least 100 words.'
      );
      error.status = 400;
      error.code = 'NO_SPEECH_DETECTED';
      throw error;
    }

    const wordCount = words.length;
    if (durationSeconds <= 0) {
      durationSeconds = Math.max(Math.round(wordCount / 2.2), 15);
    }

    // 2. Parallel Candidate Generation (Layer 2 Rules + Layer 3 LLM via Groq)
    const ruleCandidates = runRuleBasedGrammarScanner(transcript);
    const llmResult = await groqService.generateLlmCandidates(transcript, topicTitle, topicPrompt);

    // 3. Central Adjudication (Layer 4: Overlap Deduplication, Thresholding, Severity & Score Calculation)
    const adjudication = adjudicatorService.adjudicateGrammar(
      ruleCandidates,
      llmResult.grammarCandidates,
      transcript
    );

    // 4. Acoustic & Fluency Metrics
    const fluencyMetrics = analyzeAcousticsAndFluency(transcript, durationSeconds);

    // 5. Lexical Scoring & Synonym Aggregation
    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
    const lexicalDiversity = wordCount > 0 ? uniqueWords / wordCount : 0.75;
    
    // Dynamic vocabulary upgrades from LLM
    const vocabularySuggestions: VocabularySuggestionItem[] = [...llmResult.vocabularySuggestions];

    // Fallback dynamic vocabulary upgrades if LLM suggestions are sparse
    const vocabMap: Record<string, { better: string; why: string; cefrLevel: CEFRLevel }> = {
      very: { better: 'exceptionally', why: 'Strengthens emphasis without basic intensifiers.', cefrLevel: 'B2' },
      good: { better: 'exceptional', why: 'More precise and highlights high quality.', cefrLevel: 'C1' },
      bad: { better: 'adverse', why: 'Academic descriptor for negative conditions.', cefrLevel: 'C1' },
      important: { better: 'paramount', why: 'Elevates critical importance in spoken discourse.', cefrLevel: 'C2' },
      interesting: { better: 'engaging', why: 'More expressive and vivid.', cefrLevel: 'B2' },
      help: { better: 'facilitate', why: 'Formal word for enabling smooth progress.', cefrLevel: 'C1' },
      change: { better: 'transform', why: 'Indicates profound, structural evolution.', cefrLevel: 'B2' },
      problem: { better: 'obstacle', why: 'Framed constructively around challenges.', cefrLevel: 'B2' },
      think: { better: 'postulate', why: 'Formal terminology for presenting perspectives.', cefrLevel: 'C2' },
      many: { better: 'a multitude of', why: 'Demonstrates lexical breadth.', cefrLevel: 'C1' },
      hard: { better: 'arduous', why: 'High-level descriptor for demanding tasks.', cefrLevel: 'C1' },
      big: { better: 'substantial', why: 'Precise quantitative descriptor.', cefrLevel: 'B2' },
      strong: { better: 'robust', why: 'Conveys deep domain competence.', cefrLevel: 'C1' },
      student: { better: 'scholar / researcher', why: 'Elevates academic persona in spoken discourse.', cefrLevel: 'C1' },
    };

    if (vocabularySuggestions.length < 3) {
      const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''));
      for (const [target, suggestion] of Object.entries(vocabMap)) {
        if (lowerWords.includes(target) && !vocabularySuggestions.some((s) => s.original.toLowerCase() === target)) {
          vocabularySuggestions.push({
            id: `v_${target}`,
            original: target,
            better: suggestion.better,
            why: suggestion.why,
            cefrLevel: suggestion.cefrLevel,
          });
          if (vocabularySuggestions.length >= 4) break;
        }
      }
    }

    // 6. Multi-Dimensional Scoring
    const deterministicGrammar = adjudication.deterministicGrammarScore;
    const grammarScore = llmResult.llmGrammarScore !== undefined
      ? Math.min(deterministicGrammar, llmResult.llmGrammarScore)
      : deterministicGrammar;

    const baseVocab = Math.min(94, Math.round(68 + lexicalDiversity * 26));
    const vocabScore = llmResult.llmVocabScore !== undefined
      ? llmResult.llmVocabScore
      : baseVocab;

    const fluencyScore = fluencyMetrics.pacingRating === 'Good pace' ? 88 : 72;
    const overallScore = Math.round((grammarScore * 0.4) + (vocabScore * 0.35) + (fluencyScore * 0.25));

    const cefrLevel: CEFRLevel = overallScore >= 85 ? 'C1' : overallScore >= 75 ? 'B2' : overallScore >= 60 ? 'B1' : 'A2';
    const ieltsBandEstimate = overallScore >= 85 ? 8.0 : overallScore >= 75 ? 7.0 : overallScore >= 60 ? 6.0 : 5.0;

    // 7. Assemble Pedagogical Feedback
    const whatYouDidWell = [
      ...(llmResult.whatYouDidWell || []),
      ...adjudication.grammarSummary.whatYouDidWell,
    ].slice(0, 3);

    const areasToImprove = [
      adjudication.grammarSummary.biggestImprovementFocus,
      ...(llmResult.actionPlan || ['Upgrade repetitive adjectives with advanced academic synonyms.']),
    ].slice(0, 3);

    const actionPlan = [
      `Practice 90-second response drills targeting: ${adjudication.grammarSummary.biggestImprovementFocus}`,
      'Record speech with conscious substitution of C1/C2 descriptors.',
      'Maintain consistent speaking rhythm targeting 120–140 words per minute.',
    ];

    const evaluation: EvaluationResult = {
      id: `eval_${uuidv4().slice(0, 8)}`,
      userId: params.userId,
      topicId: params.topicId,
      topicTitle,
      topicPrompt,
      transcript,
      wordCount,
      durationSeconds,
      scores: {
        overall: overallScore,
        grammar: grammarScore,
        vocabulary: vocabScore,
        fluency: fluencyScore,
        cefrLevel,
        ieltsBandEstimate,
      },
      grammarFeedback: adjudication.finalItems,
      grammarSummary: adjudication.grammarSummary,
      vocabularySuggestions,
      fluencyAnalysis: fluencyMetrics,
      whatYouDidWell,
      areasToImprove,
      actionPlan,
      createdAt: new Date().toISOString(),
    };

    // 8. Persist and Update User Stats
    await evaluationRepository.save(evaluation);

    try {
      const user = await userRepository.getById(params.userId);
      if (user) {
        const userEvals = await evaluationRepository.getByUserId(params.userId);
        const totalEvaluations = userEvals.length;
        const avgScore = Math.round(
          userEvals.reduce((acc, curr) => acc + curr.scores.overall, 0) / totalEvaluations
        );

        await userRepository.updateStats(params.userId, {
          totalEvaluations,
          averageOverallScore: avgScore,
          currentStreakDays: user.stats?.currentStreakDays ? user.stats.currentStreakDays + 1 : 1,
        });
      }
    } catch (err) {
      console.warn('Failed to update user stats post-evaluation:', err);
    }

    return evaluation;
  }
}

export const evaluationService = new EvaluationService();
