# API.md — SayWise REST API Specification

This document details the HTTP REST API endpoints, request/response contracts, authentication methods, and status codes for the SayWise backend.

---

## 1. Base URL & Common Conventions

* **Base URL**: `http://localhost:5000/api` (or production URI)
* **Authentication**: Bearer Token in `Authorization: Bearer <jwt_or_firebase_token>`
* **Content-Type**: `application/json` (or `multipart/form-data` for audio upload)
* **Error Response Format**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Spoken word count is below minimum threshold (100 words).",
      "details": []
    }
  }
  ```

---

## 2. Authentication Endpoints

### 2.1 `POST /api/auth/google`
Authenticates a user via Google OAuth2 ID Token.

* **Request Body**:
  ```json
  {
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
    "email": "user@gmail.com",
    "displayName": "Alex Johnson",
    "photoURL": "https://lh3.googleusercontent.com/..."
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "usr_99812",
        "email": "user@gmail.com",
        "displayName": "Alex Johnson",
        "photoURL": "https://lh3.googleusercontent.com/...",
        "authProvider": "google"
      }
    }
  }
  ```

### 2.2 `POST /api/auth/login` & `POST /api/auth/register`
Email/password sign-in and sign-up with bcrypt password validation.

### 2.3 `GET /api/auth/me`
Fetches authenticated user profile and aggregate stats. Requires Bearer Token.

---

## 3. Topic Endpoints

### 3.1 `GET /api/topics`
Retrieves curated speaking prompts filtered by category and difficulty.

* **Query Parameters**:
  * `category` (optional): `IELTS` | `TOEFL` | `Business` | `Casual`
  * `difficulty` (optional): `Beginner` | `Intermediate` | `Advanced`
* **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "topic-ielts-climate",
        "category": "IELTS",
        "subCategory": "Part 3",
        "title": "Environmental Protection and Renewable Energy",
        "prompt": "Do you believe individuals or governments bear the primary responsibility for combating climate change? Explain your reasoning with examples.",
        "prepTimeSeconds": 60,
        "speakingTimeSeconds": 120,
        "targetWordCount": { "min": 100, "max": 200 },
        "keyVocabularyHints": ["sustainability", "carbon footprint", "policy intervention", "renewable infrastructure"],
        "difficulty": "Advanced"
      }
    ]
  }
  ```

### 3.2 `GET /api/topics/:id`
Retrieves a single topic by ID.

---

## 4. Evaluation Endpoints

### 4.1 `POST /api/evaluations/submit`
Submits an audio recording or transcribed text for multi-dimensional AI scoring.

* **Content-Type**: `multipart/form-data` (audio file) OR `application/json` (direct transcript / audio base64)
* **Form Fields / JSON**:
  * `audio` (File): Binary audio (`.webm`, `.wav`, `.mp3`, `.m4a`)
  * `topicId` (string, required): Topic identifier
  * `topicPrompt` (string, required): Topic text
  * `durationSeconds` (number, required): Recording duration
* **Response `200 OK`** (Direct Mode) or `202 Accepted` (Queued Mode):
  ```json
  {
    "success": true,
    "data": {
      "id": "eval_7781a9",
      "status": "COMPLETED",
      "transcript": "In my opinion, I believe both individuals and governments has to work together...",
      "wordCount": 142,
      "audioDurationSeconds": 68.5,
      "scores": {
        "overall": 82,
        "cefrLevel": "B2",
        "ieltsBandEstimate": 7.0,
        "grammar": 78,
        "vocabulary": 85,
        "fluency": 83,
        "coherence": 82
      },
      "grammarAnalysis": {
        "score": 78,
        "totalErrors": 2,
        "errors": [
          {
            "id": "err_1",
            "errorText": "both individuals and governments has",
            "correction": "both individuals and governments have",
            "category": "Subject-Verb Agreement",
            "rule": "Plural compound subjects take plural verbs.",
            "explanation": "Because 'individuals and governments' is a plural compound subject, use 'have' instead of 'has'."
          }
        ]
      },
      "vocabularyAnalysis": {
        "score": 85,
        "lexicalDiversity": 0.76,
        "levelBreakdown": {
          "A1_A2_Percentage": 52,
          "B1_B2_Percentage": 36,
          "C1_C2_Percentage": 12
        },
        "overusedWords": ["very", "good"],
        "highlightedWords": [
          {
            "word": "sustainability",
            "cefrLevel": "C1",
            "isOverused": false,
            "synonyms": ["viability", "conservation"]
          }
        ]
      },
      "fluencyAnalysis": {
        "score": 83,
        "wordsPerMinute": 124,
        "pacingRating": "Optimal",
        "fillerWords": {
          "totalCount": 3,
          "words": [{ "word": "um", "count": 2 }, { "word": "like", "count": 1 }]
        }
      },
      "feedback": {
        "summary": "Clear, structured argument with high lexical variety. Minor subject-verb agreement slip.",
        "strengths": [
          "Excellent use of C1 vocabulary such as 'sustainability' and 'infrastructure'.",
          "Optimal pacing (124 WPM) with natural sentence cadence."
        ],
        "improvementAreas": [
          "Watch out for subject-verb agreement on compound noun phrases.",
          "Reduce reliance on filler word 'um' at transition points."
        ],
        "recommendedExercises": [
          "Practice compound subject drills with auxiliary verbs.",
          "Record a 60-second response focusing on silent pausing instead of vocal fillers."
        ]
      }
    }
  }
  ```

### 4.2 `GET /api/evaluations/:id`
Retrieves a full evaluation report by ID.

### 4.3 `GET /api/evaluations/history`
Retrieves paginated past evaluations for the authenticated user.

### 4.4 `GET /api/evaluations/stats/summary`
Retrieves aggregated analytics (average scores, score trajectory, common grammar errors).
