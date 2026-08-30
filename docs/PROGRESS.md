# PROGRESS.md — SayWise Development & Milestone Tracker

This document tracks the delivery milestones, implementation phases, verification gates, and progress of the **SayWise** project.

---

## 1. Project Roadmap & Milestone Status

| Phase | Milestone Description | Target Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 0** | **Architecture & Specifications** | `AGENTS.md`, `docs/*`, `.agents/skills/*` | 🟢 **In Progress / Complete** |
| **Phase 1** | **Backend Core & AI Pipeline** | Express + TS Server, Groq/Gemini AI Service, Audio Ingestion, STT | 🟡 **Pending User Approval** |
| **Phase 2** | **Frontend Studio & UI/UX** | React + Tailwind App, Waveform Visualizer, Audio Recorder, Auth | ⚪ **Planned** |
| **Phase 3** | **Interactive Evaluation Report** | Scorecard, Grammar Highlighting, Vocab Breakdown, Pacing Gauges | ⚪ **Planned** |
| **Phase 4** | **Google Auth & Dashboard** | Google SSO integration, User History, Progress Analytics | ⚪ **Planned** |
| **Phase 5** | **Testing & Submission Polish** | End-to-end testing, Documentation refinement, Final Review | ⚪ **Planned** |

---

## 2. Detailed Task Breakdown

### Phase 0: System Architecture & Agent Protocol
- [x] Create root `AGENTS.md` specifying architecture and engineering protocols.
- [x] Create `docs/PRODUCT.md` (PRD with user stories and requirements).
- [x] Create `docs/ARCHITECTURE.md` (2–3 page theoretical analysis covering all assignment prompts).
- [x] Create `docs/DATABASE.md` (Firestore schemas and query patterns).
- [x] Create `docs/API.md` (REST API contracts and OpenAPI DTOs).
- [x] Create `docs/UI.md` (Design tokens, component hierarchy, waveform UX).
- [x] Create `docs/DECISIONS.md` (ADRs for tech stack, AI providers, and auth).
- [x] Create `docs/PROGRESS.md` (Milestone tracker).
- [ ] Create specialized Agent Skills in `.agents/skills/`.

### Phase 1: Backend Implementation (Node.js + Express + TypeScript)
- [ ] Setup `backend/` project structure (`tsconfig.json`, `package.json`, `.env.example`).
- [ ] Implement configuration module (`src/config/index.ts`).
- [ ] Implement AI Service (`GroqService` + `GeminiService` with structured JSON schema).
- [ ] Implement Audio & STT Service (`SpeechService` + acoustic feature extraction).
- [ ] Implement Evaluation Service (`EvaluationService` orchestrating STT + Scoring).
- [ ] Implement Repository Layer (`UserRepo`, `TopicRepo`, `EvaluationRepo`).
- [ ] Implement Controllers and Express Routes.
- [ ] Add Auth & Rate Limiting Middleware.

### Phase 2: Frontend Implementation (React + TypeScript + Tailwind)
- [ ] Setup `frontend/` project structure (Vite + React + TypeScript + Tailwind CSS).
- [ ] Build Design System primitives (Buttons, Cards, Badges, Modals, Progress bars).
- [ ] Implement Audio Recording Studio (`AudioRecorder.tsx`, `WaveformVisualizer.tsx`).
- [ ] Implement Topic Selection Hub (`TopicsPage.tsx`, `TopicCard.tsx`).
- [ ] Build Multi-step Animated Processing Indicator.

### Phase 3: Interactive Evaluation Report & Feedback
- [ ] Build Score Hero Banner with Radial Progress and CEFR Band.
- [ ] Build Interactive Verbatim Transcript with clickable inline error popovers.
- [ ] Build Grammar, Vocabulary, Fluency, and Action Plan tabs.
- [ ] Add PDF / JSON Export options.

### Phase 4: Google Auth & Historical Dashboard
- [ ] Implement Google Sign-In button and Firebase Auth integration.
- [ ] Build Practice History table and Score Trajectory charts.
- [ ] Build User Profile and Goal Settings modal.

### Phase 5: Verification & Quality Assurance
- [ ] Verify complete assignment rubric compliance.
- [ ] Test audio recording and evaluation with sample voice prompts.
- [ ] Validate response time ($< 3.5\text{s}$) and deterministic JSON output.
