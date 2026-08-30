export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type TopicCategory = 'Travel' | 'Education' | 'Technology' | 'Work & Career' | 'Random Topic' | 'IELTS' | 'TOEFL';

export type ScreenState = 
  | 'LANDING'
  | 'DASHBOARD'
  | 'STUDIO_RECORDING'
  | 'STUDIO_ANALYZING'
  | 'RESULTS_OVERVIEW'
  | 'DETAILED_FEEDBACK'
  | 'PRACTICE_COMPLETE';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  authProvider: 'google' | 'password' | 'guest';
  createdAt: string;
  stats?: {
    totalEvaluations: number;
    averageOverallScore: number;
    currentStreakDays: number;
  };
}

export interface Topic {
  id: string;
  category: TopicCategory;
  title: string;
  prompt: string;
  description: string;
  icon: string;
  targetWordCount: { min: number; max: number };
  targetTimeSeconds: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export type LinguisticCategory =
  | 'Preposition'
  | 'Article'
  | 'Countability'
  | 'Subject-Verb'
  | 'Tense'
  | 'Collocation'
  | 'Redundancy'
  | 'Sentence Structure';

export interface GrammarFeedbackItem {
  id: string;
  original: string;
  better: string;
  why: string;
  category: LinguisticCategory | string;
  type?: 'error' | 'style';
  severity?: 'critical' | 'major' | 'minor';
  confidence?: number;
  source?: 'rule' | 'llm' | 'both';
}

export interface GrammarSummary {
  totalIssues: number;
  errorsCount: number;
  styleCount: number;
  severityBreakdown: {
    critical: number;
    major: number;
    minor: number;
  };
  whatYouDidWell: string[];
  biggestImprovementFocus: string;
}

export interface VocabularySuggestionItem {
  id: string;
  original: string;
  better: string;
  why: string;
  cefrLevel: CEFRLevel;
}

export interface FluencyMetric {
  wordsPerMinute: number;
  pacingRating: 'Too Slow' | 'Good pace' | 'Too Fast';
  fillerWordsCount: number;
  fillerWordsList: Array<{ word: string; count: number }>;
  pauseCount: number;
  tip: string;
}

export interface EvaluationResult {
  id: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  topicPrompt: string;
  transcript: string;
  wordCount: number;
  durationSeconds: number;
  scores: {
    overall: number;
    grammar: number;
    vocabulary: number;
    fluency: number;
    cefrLevel: CEFRLevel;
    ieltsBandEstimate: number;
  };
  grammarFeedback: GrammarFeedbackItem[];
  grammarSummary?: GrammarSummary;
  vocabularySuggestions: VocabularySuggestionItem[];
  fluencyAnalysis: FluencyMetric;
  whatYouDidWell: string[];
  areasToImprove: string[];
  actionPlan: string[];
  createdAt: string;
}
