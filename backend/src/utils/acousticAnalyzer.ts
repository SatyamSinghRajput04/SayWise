import { FluencyMetric } from '../types/index.js';

// Primary true vocal hesitation markers
const HESITATION_FILLERS = ['um', 'uh', 'er', 'ah', 'umm', 'uhh', 'hmm', 'erm'];

export function analyzeAcousticsAndFluency(transcript: string, durationSeconds: number): FluencyMetric {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const durationMin = Math.max(durationSeconds / 60, 0.1);
  const wpm = Math.round(wordCount / durationMin);

  let pacingRating: FluencyMetric['pacingRating'] = 'Good pace';
  let tip = 'Your speech pacing is balanced and easy to follow.';

  if (wpm < 105) {
    pacingRating = 'Too Slow';
    tip = 'Try to increase your speaking pace slightly (target 115–140 WPM) to maintain natural momentum.';
  } else if (wpm > 165) {
    pacingRating = 'Too Fast';
    tip = 'Slow down slightly to articulate complex consonant clusters and allow deliberate pauses.';
  }

  const lowerText = transcript.toLowerCase();
  const detectedFillers: Array<{ word: string; count: number }> = [];
  let totalFillers = 0;

  // 1. Check genuine vocal hesitations (um, uh, er, ah, etc.)
  for (const filler of HESITATION_FILLERS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      detectedFillers.push({ word: filler, count: matches.length });
      totalFillers += matches.length;
    }
  }

  // 2. Contextual check for discourse "you know" as an empty filler (not "you know that...")
  const youKnowMatches = lowerText.match(/\byou know\b(?!\s+(that|what|how|why|when|where|who|about))/gi);
  if (youKnowMatches && youKnowMatches.length > 0) {
    detectedFillers.push({ word: 'you know', count: youKnowMatches.length });
    totalFillers += youKnowMatches.length;
  }

  const estimatedPauses = Math.max(Math.round(durationSeconds / 15) - 1, 0);

  return {
    wordsPerMinute: wpm,
    pacingRating,
    fillerWordsCount: totalFillers,
    fillerWordsList: detectedFillers,
    pauseCount: estimatedPauses,
    tip,
  };
}
