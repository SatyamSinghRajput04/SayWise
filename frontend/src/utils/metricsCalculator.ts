import { EvaluationResult } from '../types/index.js';

/**
 * Returns YYYY-MM-DD in local time for clean calendar date comparisons
 */
export function getLocalDateString(dateInput?: string | number | Date): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates continuous consecutive calendar-day streak
 */
export function calculateCalendarStreak(evaluations: EvaluationResult[]): number {
  if (!evaluations || evaluations.length === 0) return 0;

  // Extract unique sorted practice dates (descending)
  const uniqueDatesSet = new Set<string>();
  evaluations.forEach((e) => {
    const dateStr = getLocalDateString(e.createdAt || (e as any).timestamp);
    if (dateStr) uniqueDatesSet.add(dateStr);
  });

  const uniqueDates = Array.from(uniqueDatesSet).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const todayStr = getLocalDateString(new Date());
  
  // Calculate yesterday string
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // If the user hasn't practiced today AND hasn't practiced yesterday -> streak is 0
  const latestDate = uniqueDates[0];
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(latestDate === todayStr ? todayStr : yesterdayStr);

  for (const dateStr of uniqueDates) {
    const expectedStr = getLocalDateString(expectedDate);
    if (dateStr === expectedStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Counts evaluations completed on the current calendar day
 */
export function calculateTodayEvaluations(evaluations: EvaluationResult[]): number {
  if (!evaluations || evaluations.length === 0) return 0;
  const todayStr = getLocalDateString(new Date());
  return evaluations.filter((e) => getLocalDateString(e.createdAt || (e as any).timestamp) === todayStr).length;
}

/**
 * Calculates rolling average score (most recent 10 tests if >= 10, otherwise lifetime)
 */
export function calculateRollingAverageScore(evaluations: EvaluationResult[]): number | null {
  if (!evaluations || evaluations.length === 0) return null;
  
  const validScores = evaluations
    .map((e) => e.scores?.overall)
    .filter((s): s is number => typeof s === 'number' && !isNaN(s));

  if (validScores.length === 0) return null;

  // Take most recent 10 evaluations
  const recentScores = validScores.slice(-10);
  const sum = recentScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / recentScores.length);
}

/**
 * Maps deterministic score to Estimated CEFR Level
 */
export function calculateEstimatedCEFR(averageScore: number | null): string | null {
  if (averageScore === null || isNaN(averageScore)) return null;
  if (averageScore >= 85) return 'C2';
  if (averageScore >= 75) return 'C1';
  if (averageScore >= 60) return 'B2';
  if (averageScore >= 45) return 'B1';
  return 'A2';
}
