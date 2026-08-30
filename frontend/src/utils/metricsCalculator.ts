import { EvaluationResult } from '../types/index.js';

/**
 * Converts any date representation to a deterministic Local Calendar Day Integer (Epoch Days).
 * This eliminates all UTC timezone drift, DST changes, and ISO string parsing issues.
 */
export function getLocalDayEpoch(dateInput?: string | number | Date): number {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return 0;
  // Local midnight timestamp in milliseconds
  const localMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.floor(localMidnight / 86400000);
}

/**
 * Calculates continuous consecutive calendar-day streak using integer arithmetic.
 */
export function calculateCalendarStreak(evaluations: EvaluationResult[]): number {
  if (!evaluations || evaluations.length === 0) return 0;

  // Extract unique sorted practice days (descending integer epoch)
  const uniqueDaysSet = new Set<number>();
  evaluations.forEach((e) => {
    const rawDate = e.createdAt || (e as any).timestamp;
    if (rawDate) {
      const epoch = getLocalDayEpoch(rawDate);
      if (epoch > 0) uniqueDaysSet.add(epoch);
    }
  });

  const sortedDays = Array.from(uniqueDaysSet).sort((a, b) => b - a);
  if (sortedDays.length === 0) return 0;

  const todayEpoch = getLocalDayEpoch(new Date());
  const yesterdayEpoch = todayEpoch - 1;

  const latestDay = sortedDays[0];
  // Streak is only active if the latest practice occurred today OR yesterday
  if (latestDay !== todayEpoch && latestDay !== yesterdayEpoch) {
    return 0;
  }

  let streak = 0;
  let expectedDay = latestDay;

  for (const day of sortedDays) {
    if (day === expectedDay) {
      streak++;
      expectedDay--;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Counts evaluations completed on the current local calendar day.
 */
export function calculateTodayEvaluations(evaluations: EvaluationResult[]): number {
  if (!evaluations || evaluations.length === 0) return 0;
  const todayEpoch = getLocalDayEpoch(new Date());
  return evaluations.filter((e) => {
    const rawDate = e.createdAt || (e as any).timestamp;
    return rawDate ? getLocalDayEpoch(rawDate) === todayEpoch : false;
  }).length;
}

/**
 * Calculates rolling average score (most recent 10 tests if >= 10, otherwise lifetime).
 */
export function calculateRollingAverageScore(evaluations: EvaluationResult[]): number | null {
  if (!evaluations || evaluations.length === 0) return null;

  const validScores = evaluations
    .map((e) => e.scores?.overall)
    .filter((s): s is number => typeof s === 'number' && !isNaN(s) && s > 0);

  if (validScores.length === 0) return null;

  // Take the most recent 10 tests
  const recentScores = validScores.slice(0, 10);
  const sum = recentScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / recentScores.length);
}

/**
 * Maps deterministic score to Estimated CEFR Level.
 */
export function calculateEstimatedCEFR(averageScore: number | null): string | null {
  if (averageScore === null || isNaN(averageScore) || averageScore <= 0) return null;
  if (averageScore >= 85) return 'C2';
  if (averageScore >= 75) return 'C1';
  if (averageScore >= 60) return 'B2';
  if (averageScore >= 45) return 'B1';
  return 'A2';
}
