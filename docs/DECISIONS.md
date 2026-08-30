# DECISIONS.md — Architectural Decision Records (ADRs)

This document tracks foundational technical decisions, tradeoffs, and architectural rationales for **SayWise**.

---

## ADR-001: Backend Tech Stack Selection (Node.js + Express + TypeScript)

### Status: Accepted
### Context:
We evaluated **Python (FastAPI)** vs **Node.js (Express + TypeScript)** for the core API gateway and AI evaluation orchestrator.
### Decision:
Adopt **Node.js + Express + TypeScript**.
### Rationale:
1. **Ecosystem Alignment**: FluentFeed's primary production stack is Node.js, Express, and Firebase.
2. **End-to-End TypeScript**: Enables shared data contracts and TypeScript DTOs between the React frontend and Express backend.
3. **I/O & Concurrency Performance**: Express/Node handles high-concurrency API gateway traffic with low memory footprint when CPU-heavy audio work is offloaded to dedicated workers.

---

## ADR-002: AI Provider Strategy (Groq API Primary + Pluggable Gemini Fallback)

### Status: Accepted
### Context:
Direct Google Gemini API integration frequently encounters OAuth / setup friction in development environments and higher latency on audio streams. We required a fast, developer-friendly, and cost-effective AI engine.
### Decision:
Adopt **Groq API** as the primary engine (`whisper-large-v3` for Speech-to-Text, and `llama-3.3-70b-versatile` for structured JSON evaluation), wrapped in a **Pluggable AI Provider Interface** (`AIService`) that supports Google Gemini as a configurable fallback.
### Rationale:
1. **Ultra-Low Latency**: Groq Whisper transcribes 90s audio in $< 400\text{ ms}$, and Llama 3.3 70B evaluates structured JSON at ~250 tokens/second.
2. **Single API Key Reliability**: Eliminates Google OAuth configuration barriers while supporting OpenAI-compatible SDKs.
3. **Structured JSON Output**: Both Groq and Gemini support strict JSON response schema validation.

---

## ADR-003: Decoupled Pipeline (STT $\to$ Text Evaluation) vs Monolithic Multimodal Audio

### Status: Accepted
### Context:
We evaluated whether to send raw audio directly to multimodal LLMs (e.g. Gemini 1.5/2.0 multimodal audio input) vs transcribing audio first via Whisper STT and then evaluating the structured transcript.
### Decision:
Implement a **Decoupled 2-Stage Pipeline**:
$$\text{Audio Upload} \longrightarrow \text{STT (Whisper)} \longrightarrow \text{Acoustic Extraction (WPM/Fillers)} \longrightarrow \text{Text Evaluation (LLM)}$$
### Rationale:
1. **Cost Reduction**: Direct audio tokens cost 10x-20x more than text tokens.
2. **Determinism**: Having the explicit transcript allows the frontend to render interactive clickable error tooltips on exact word offsets.
3. **Auditability**: Users and tutors can review and verify the exact transcript alongside the score.

---

## ADR-004: Authentication Strategy (Google OAuth2 + Firebase Auth / JWT)

### Status: Accepted
### Context:
The system requires frictionless user onboarding (Google Single Sign-On) and standard credentials login/signup.
### Decision:
Implement **Google OAuth2 / Firebase Auth Client SDK** on the React frontend, and verify the Google ID token on the Express backend (`google-auth-library` or `firebase-admin`), issuing a signed JWT session cookie/token with a Guest/Demo fallback.
### Rationale:
1. One-click Google login drastically increases student activation rates.
2. The backend remains stateless and horizontally scalable using standard JWT verification middleware.

---

## ADR-005: Data Layer Strategy (Repository Pattern with Firestore & Local Fallback)

### Status: Accepted
### Context:
The backend needs to store users, topics, transcripts, and evaluation reports in Firestore while allowing offline development and seamless testing without hard dependencies on cloud credentials.
### Decision:
Implement the **Repository Pattern** (`IUserRepository`, `IEvaluationRepository`, `ITopicRepository`) with a Firestore implementation and a local in-memory/JSON mock implementation for instant zero-config testing.
### Rationale:
1. Provides clean decoupling between business logic and database drivers.
2. Enables 100% test coverage and instant developer onboarding.
