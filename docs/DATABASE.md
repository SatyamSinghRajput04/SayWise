# DATABASE.md — SayWise Data Model & Firestore Schema

## 1. Database Architecture Strategy

SayWise utilizes **Google Cloud Firestore (or Firebase Realtime/PostgreSQL compatible repository)** as its primary document data store. 

To ensure clean architecture and prevent vendor lock-in, data access is abstracted behind the **Repository Pattern** (`UserRepository`, `EvaluationRepository`, `TopicRepository`).

---

## 2. Collections & Document Schemas

```
Firestore Root
├── users/ (Collection)
│   └── {userId} (Document)
│
├── topics/ (Collection)
│   └── {topicId} (Document)
│
└── evaluations/ (Collection)
    └── {evaluationId} (Document)
```

---

### 2.1 `users` Collection
Stores user profiles, authentication metadata, and aggregated speaking metrics.

```typescript
interface UserDocument {
  id: string;                         // Unique User UID (Firebase UID or UUID)
  email: string;                      // User email
  displayName: string;               // Full name or username
  photoURL?: string;                  // Avatar image URL
  authProvider: 'google' | 'password' | 'guest'; // Auth mechanism
  createdAt: string;                  // ISO 8601 timestamp
  updatedAt: string;                  // ISO 8601 timestamp
  stats: {
    totalEvaluations: number;        // Total speaking sessions completed
    averageOverallScore: number;     // Moving average score (0-100)
    currentStreakDays: number;       // Consecutive practice days
    lastPracticedAt?: string;        // Last evaluation timestamp
    cefrLevelDistribution: {         // Breakdown of scored levels
      A1: number;
      A2: number;
      B1: number;
      B2: number;
      C1: number;
      C2: number;
    };
  };
  preferences: {
    targetExam: 'IELTS' | 'TOEFL' | 'General' | 'Business';
    targetBandScore: number;         // e.g. 7.5 for IELTS or 85 for score
    nativeLanguage?: string;
  };
}
```

---

### 2.2 `topics` Collection
Curated speaking prompts and benchmark rubrics.

```typescript
interface TopicDocument {
  id: string;                         // e.g. 'topic-ielts-hometown'
  category: 'IELTS' | 'TOEFL' | 'Business' | 'Casual' | 'Custom';
  subCategory?: string;              // e.g. 'Part 1', 'Part 2', 'Workplace'
  title: string;                      // Short title
  prompt: string;                     // The exact question presented to the user
  context?: string;                   // Background scenario / cue card notes
  prepTimeSeconds: number;            // e.g. 60 seconds
  speakingTimeSeconds: number;        // e.g. 120 seconds
  targetWordCount: {
    min: number;                      // 100
    max: number;                      // 200
  };
  keyVocabularyHints: string[];       // Suggested vocabulary to incorporate
  sampleIdealResponse?: string;       // High-scoring reference answer
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
}
```

---

### 2.3 `evaluations` Collection
The core record representing a single speaking attempt and its comprehensive multi-dimensional AI assessment.

```typescript
interface GrammarErrorItem {
  id: string;
  errorText: string;                  // The incorrect phrase in the transcript
  correction: string;                 // Suggested grammatically correct replacement
  category: 'Tense' | 'Subject-Verb Agreement' | 'Preposition' | 'Article' | 'Punctuation' | 'Word Choice' | 'Syntax';
  rule: string;                       // Grammatical rule name
  explanation: string;                // Clear educational rationale
  startIndex?: number;                // Character offset in transcript
  endIndex?: number;                  // Character offset in transcript
}

interface VocabularyItem {
  word: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  isOverused: boolean;
  synonyms: string[];
}

interface EvaluationDocument {
  id: string;                         // Unique evaluation UUID
  userId: string;                     // Owning user UID
  topicId: string;                    // Associated topic ID
  topicTitle: string;                 // Denormalized for fast list queries
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  audioUrl?: string;                  // Signed URL or storage path to audio file
  audioDurationSeconds: number;       // Duration of spoken recording
  transcript: string;                 // Full verbatim Speech-to-Text transcript
  wordCount: number;                  // Number of spoken words (target: 100-200)
  
  scores: {
    overall: number;                  // 0 - 100
    cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    ieltsBandEstimate: number;        // 1.0 - 9.0
    grammar: number;                  // 0 - 100
    vocabulary: number;               // 0 - 100
    fluency: number;                  // 0 - 100
    coherence: number;                // 0 - 100
  };

  grammarAnalysis: {
    score: number;
    totalErrors: number;
    errors: GrammarErrorItem[];
  };

  vocabularyAnalysis: {
    score: number;
    lexicalDiversity: number;         // Type-Token Ratio (TTR 0.0 - 1.0)
    levelBreakdown: {
      A1_A2_Percentage: number;
      B1_B2_Percentage: number;
      C1_C2_Percentage: number;
    };
    highlightedWords: VocabularyItem[];
    overusedWords: string[];
  };

  fluencyAnalysis: {
    score: number;
    wordsPerMinute: number;           // e.g. 135 WPM
    pacingRating: 'Too Slow' | 'Optimal' | 'Too Fast';
    fillerWords: {
      totalCount: number;
      words: Array<{ word: string; count: number }>;
    };
    pauseCount?: number;
  };

  feedback: {
    summary: string;                  // Executive summary of performance
    strengths: string[];              // 2-3 positive feedback highlights
    improvementAreas: string[];       // 3-4 actionable target weaknesses
    recommendedExercises: string[];   // Concrete follow-up speaking tasks
  };

  processingMetadata: {
    sttEngine: string;                // e.g. 'groq-whisper-large-v3'
    evalEngine: string;               // e.g. 'groq-llama-3.3-70b-versatile' / 'gemini-2.0-flash'
    latencyMs: number;
  };

  createdAt: string;
}
```

---

## 3. Database Indexes & Query Patterns

1. **User Evaluation History**:
   * Query: `evaluations.where('userId', '==', uid).orderBy('createdAt', 'desc').limit(20)`
   * Index: `userId ASC, createdAt DESC`
2. **Topic Categorization**:
   * Query: `topics.where('category', '==', 'IELTS').orderBy('difficulty', 'asc')`
   * Index: `category ASC, difficulty ASC`
3. **Analytics Aggregations**:
   * Aggregation pipeline on `evaluations` filtered by `userId` to compute score trajectory over the last 30 days.
