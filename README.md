# 🎙️ SayWise — AI-Powered Speaking Evaluation & Fluency Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React 18](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_LPU-F55036?style=for-the-badge&logo=fastapi&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**SayWise is an enterprise-grade spoken English assessment system that provides sub-second, multi-dimensional feedback on grammar, vocabulary, fluency, and CEFR level benchmarks.**

[Features](#-key-features) • [Architecture](#-system-architecture) • [Quickstart](#-quickstart--installation) • [API Contract](#-api-specification) • [Theoretical Blueprint](#-theoretical-assessment--system-blueprint)

</div>

---

## 🌟 Executive Overview

Human speaking tutors are expensive, non-scalable, and slow to provide actionable feedback. Meanwhile, traditional text-based grammar checkers completely fail to evaluate spoken cadence, natural discourse structures, or phonetic hesitations.

**SayWise** bridges this divide. Users record a 100–200 word response to structured prompts (IELTS, TOEFL, Job Interviews, Everyday Conversations) and receive instant, deterministic, multi-dimensional feedback:

1. **4-Layer Spoken Grammar Analysis**: Pinpoints syntax errors, unidiomatic phrasing, and tense slips with inline diffs, category tags, and linguistic rationales.
2. **CEFR Lexical Resource (A1–C2)**: Analyzes vocabulary distribution and recommends formal C1/C2 upgrades with interactive text-to-speech pronunciation.
3. **Acoustic Fluency & Cadence Radar**: Calculates Words Per Minute (WPM), speech cadence, and filters genuine vocal hesitations (`"um"`, `"uh"`).
4. **Deterministic Overall Scoring (0–100)**: Evaluates performance against standardized Cambridge/IELTS rubrics.
5. **Actionable Improvement Roadmap**: Personalized practice drills designed to target specific user weaknesses.

---

## 🚀 Key Features

* **🪐 3D Neptune Planet Studio**: A fluid, interactive 3D planetary visualizer with dynamic speech-cadence tracking and real-time word counting (100–200 words).
* **📖 Pinpointed Spoken Syntax Diffs**: Identifies specific errors, such as:  
  *Spoken:* `~"I have full strong in AI"~` $\to$ *Correct:* **`"I have a strong background in AI"`**
* **📚 Lexical Upgrades with Audio Playback**: Transforms intermediate phrases into C1/C2 academic vocabulary with one-click pronunciation:  
  *`"important"`* $\to$ **`"crucial"`** `[C1]` • *`"help"`* $\to$ **`"facilitate"`** `[C2]`
* **🎧 Interactive Transcript Audio Player**: Listen to your transcript with instant `Play` / `Stop` audio controls.
* **🔐 Multi-Tier Authentication**: Secure Google OAuth2, JWT-backed email authentication, and seamless Guest Mode.
* **☁️ Responsive Volumetric Cloud UI**: Custom glassmorphic interface designed for mobile, tablet, and desktop viewports.

---

## 🏗️ System Architecture

SayWise utilizes a **Decoupled Asynchronous Worker Pipeline** (`Ingestion` $\to$ `STT` $\to$ `Acoustic Analyzer` $\to$ `Structured LLM Adjudicator` $\to$ `Persistence` $\to$ `Client`).

```
┌─────────────────┐       Pre-signed URL       ┌──────────────────────┐
│  Browser Client ├───────────────────────────>│ Cloud Storage (GCS) │
│ (MediaRecorder) │                            └──────────┬───────────┘
└────────┬────────┘                                       │
         │ Trigger Evaluation                             │ Fetch Audio Stream
         ▼                                                ▼
┌─────────────────┐    Push Job (BullMQ)       ┌──────────────────────┐
│ Express Gateway ├───────────────────────────>│ Speech-to-Text Worker│
│ (JWT & Quota)   │                            │ (Groq Whisper v3)    │
└─────────────────┘                            └──────────┬───────────┘
                                                          │ Transcript + Timestamps
                                                          ▼
┌─────────────────┐    Persist Report & Push   ┌──────────────────────┐
│ Firestore / DB  │<───────────────────────────┤ AI Evaluator (Groq)  │
│  & WebSockets   │                            │ + Schema Validator   │
└─────────────────┘                            └──────────────────────┘
```

> 📄 **Full Technical Blueprint**: See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the 2–3 page theoretical assessment covering LLM limitations, cost optimizations ($95\%$ reduction), and high-reliability scaling for 1,000 concurrent submissions.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite), TypeScript | Component-based, strictly typed UI client |
| **Styling** | Tailwind CSS, Lucide Icons | Responsive design system and micro-interactions |
| **Audio Engine** | Web Audio API, MediaRecorder | Client-side audio capture and formant filtering |
| **Backend** | Node.js, Express, TypeScript | Clean Architecture API Gateway |
| **AI Inference** | Groq API (`whisper-large-v3`, `gpt-oss-120b`) | Sub-second transcription and structured evaluation |
| **Authentication** | Firebase Auth & Custom JWT | Google OAuth2 and email/password session handling |
| **Data Storage** | Firestore / Decoupled Repository | Evaluation history, user analytics, and prompt bank |

---

## 📁 Repository Structure

```
SayWise/
├── docs/                                  # Specifications & Architecture
│   ├── ARCHITECTURE.md                    # Theoretical 2-3 Page Blueprint (Assessment)
│   ├── API.md                             # REST API Contract & Payloads
│   ├── DATABASE.md                        # Firestore Schemas & Access Patterns
│   ├── PRODUCT.md                         # PRD & User Stories
│   └── UI.md                              # Design System & Component Hierarchy
│
├── backend/                               # Express + TypeScript Server
│   ├── src/
│   │   ├── config/                        # Environment & Groq/Firebase clients
│   │   ├── controllers/                   # Evaluation, Topic & Auth controllers
│   │   ├── middleware/                    # Auth, Rate Limiter & Error handlers
│   │   ├── repositories/                  # Data access layer (Firestore / Memory)
│   │   ├── routes/                        # API route routers
│   │   ├── services/                      # Groq STT, LLM Evaluation & Adjudicator
│   │   ├── types/                         # TypeScript DTOs and interfaces
│   │   └── utils/                         # Acoustic analyzer & NLP heuristic rules
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                              # React + TypeScript + Tailwind Client
    ├── src/
    │   ├── components/
    │   │   ├── common/                    # Navbar, Mascot, ProtectedRoute
    │   │   ├── landing/                   # Hero & Living Bento About Section
    │   │   ├── studio/                    # Speaking Studio & 3D Neptune Visualizer
    │   │   ├── report/                    # Results Overview, Detailed Feedback & Complete
    │   │   └── history/                   # Past Evaluations & Stat Trackers
    │   ├── context/                       # Auth & Evaluation Contexts
    │   ├── services/                      # Audio Recording & API Client
    │   └── types/                         # Frontend TypeScript definitions
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## ⚡ Quickstart & Installation

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **Groq API Key**: Obtain from [console.groq.com](https://console.groq.com)

### 1. Clone the Repository
```bash
git clone https://github.com/SatyamSinghRajput04/SayWise.git
cd SayWise
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Configure your `.env` file:
```env
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_secret_jwt_key
CLIENT_ORIGIN=http://localhost:5173
```
Build and run the backend server:
```bash
npm run build
npm start
```
*Backend runs on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```
Configure your `.env` file with your Firebase configuration, then run:
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📡 API Specification

### 1. Audio Evaluation
* **`POST /api/evaluations`** (Multipart Form / Audio WebM)
```json
{
  "topicId": "ielts_tech_01",
  "topicPrompt": "Discuss the impact of AI on software development.",
  "durationSeconds": 54
}
```
**Response (`200 OK`)**:
```json
{
  "id": "eval_88921",
  "transcript": "One of the things I learned during college is problem solving...",
  "wordCount": 163,
  "durationSeconds": 54,
  "scores": {
    "overall": 68,
    "grammar": 50,
    "vocabulary": 70,
    "fluency": 72,
    "coherence": 80
  },
  "cefrBand": "B2",
  "grammarFeedback": [
    {
      "original": "how binary tree and graph algorithm actually works",
      "better": "how binary trees and graph algorithms actually work",
      "category": "Subject-Verb",
      "severity": "major",
      "why": "Both nouns are countable and require plural agreement with 'work'."
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "important",
      "better": "crucial",
      "cefrLevel": "C1",
      "why": "Conveys critical significance in formal discourse."
    }
  ],
  "fluencyAnalysis": {
    "wordsPerMinute": 181,
    "pacingRating": "Too Fast",
    "fillerWordsCount": 0,
    "tip": "Slow down slightly to articulate complex consonant clusters."
  }
}
```

### 2. Authentication & Topics
* **`POST /api/auth/register`**: Register email/password user account.
* **`POST /api/auth/login`**: Authenticate user and issue JWT token.
* **`GET /api/topics`**: Fetch speaking prompts categorized by level (A2–C2) and domain (IELTS, TOEFL, Job Interviews).
* **`GET /api/evaluations/history`**: Retrieve previous evaluation history with aggregate progress tracking.

---

## 📑 Theoretical Assessment & System Blueprint

For the theoretical evaluation requested in the assignment:
* **Limitations of Naive Gemini Calls**: Cost analysis ($95\%$ overhead), RPM/TPM exhaustion, single-threaded Node.js event loop blocking.
* **10,000 Evaluations/Day Architecture**: Complete decoupled event-driven worker design with pre-signed uploads and WebSocket push.
* **Cost Optimization**: Prompt token compression, Redis transcript caching, and tiered model routing.
* **1,000 Concurrent Spike Submissions**: BullMQ asynchronous queue buffering, KEDA autoscaling, and circuit breakers.
* **Future Engineering Innovations**: Forced-alignment phoneme grading, $F_0$ pitch intonation analysis, and adaptive mistake vaults.

👉 **Read the complete analysis in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)**.

---

## 📄 License
MIT © 2026 SayWise. All rights reserved.
