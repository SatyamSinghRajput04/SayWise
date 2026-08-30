# PRODUCT.md — SayWise Product Requirements Document (PRD)

## 1. Product Overview
**SayWise** is an intelligent, voice-first speaking assessment platform designed to evaluate English language spoken responses for standardized test prep (IELTS, TOEFL), job interviews, and corporate communication fluency.

A user is presented with a prompt/topic, records a spoken response (targeted at **100–200 words** / 60–120 seconds), and receives instantaneous, high-precision, multi-dimensional feedback.

---

## 2. Target Audience & Personas
1. **Standardized Test Takers (IELTS / TOEFL Candidates)**:
   * Needs: CEFR band alignment, lexical richness metrics, grammatical range feedback, and timer-constrained mock speaking drills.
2. **ESL & Non-Native Professionals**:
   * Needs: Filler word reduction ("um", "like"), pacing (WPM) optimization, and natural phrasing suggestions for workplace conversations.
3. **Language Coaches & Academic Tutors**:
   * Needs: Objective, automated scoring metrics to track student cohort trajectory over time.

---

## 3. Core Features & Functional Requirements

### 3.1 Authentication & User Management
* **Google Single Sign-On (OAuth2 / Firebase Auth)**: One-click sign-in with profile persistence.
* **Email / Password Authentication**: Secure registration, password hashing (bcrypt), and JWT session issuance.
* **Guest / Demo Mode**: Instant access to a trial evaluation session without upfront sign-up friction.
* **User Profile & Practice History**: Track cumulative sessions, aggregate score trajectories, streak counters, and weak-point heatmaps.

### 3.2 Topic & Prompt Discovery Hub
* **Curated Categorized Topics**:
  * *IELTS Speaking Part 1 / 2 / 3* (e.g., Hometown, Hobbies, Technology, Global Environmental Policy).
  * *TOEFL Independent Speaking* (e.g., University Policies, Technology vs Tradition).
  * *Professional Communication* (e.g., Salary Negotiation, Project Leadership, Conflict Resolution).
  * *Everyday Conversational English* (e.g., Travel experiences, Book reviews).
* **Topic Card Specifications**: Prompt title, background context, bulleted preparation tips, target word count (100–200 words), and recommended speaking time (60–120s).

### 3.3 Voice Studio & Audio Recorder
* **Live Web Audio Waveform**: Real-time canvas/frequency bar visualizer reflecting microphone input and amplitude.
* **Recording Controls**: Start Recording, Pause/Resume, Stop & Review, Playback scrubber.
* **Alternative Audio Upload**: Drag-and-drop support for `.mp3`, `.wav`, `.m4a`, and `.webm` files (up to 25MB).
* **Pre-flight Audio Checks**: Microphone permission handling, background noise detection, audio duration guard (minimum 15 seconds, maximum 180 seconds).

### 3.4 Multi-Dimensional Evaluation Engine
* **Overall Fluency Score (0–100) & CEFR Level (A1, A2, B1, B2, C1, C2)**: Weighted composite benchmark.
* **Grammar Evaluation**:
  * Identifies syntax errors, subject-verb disagreements, incorrect tenses, and article/preposition misuse.
  * Inline interactive text highlighting: Hover/click on marked text reveals error category, explanation, and corrected replacement.
* **Vocabulary & Lexical Resource**:
  * Lexical richness & diversity score.
  * Word frequency CEFR level distribution (A1–C2 tags on spoken words).
  * Overused/repetitive word detection with advanced synonym recommendations.
* **Fluency & Pacing Analytics**:
  * Calculated Words Per Minute (WPM) with optimal speaking rate benchmarks (110–150 WPM).
  * Filler word counter ("um", "uh", "actually", "like", "you know").
  * Pause frequency & duration indicators.
* **Actionable Next Steps & Practice Plan**:
  * 3–5 high-impact, prioritized exercises tailored to the user's specific weak spots.

### 3.5 Historical Analytics & Progress Tracking
* Score progression charts (Line/Bar trends across Grammar, Vocabulary, Fluency, and Overall scores).
* Error distribution pie charts (e.g., 40% Tense errors, 30% Prepositions, 30% Vocabulary).
* Audio playback of past attempts with side-by-side transcripts.

---

## 4. Non-Functional Requirements (NFRs)
* **Latency**: End-to-end evaluation result generated in $< 3.5\text{ seconds}$ from audio upload completion.
* **Reliability**: $99.9\%$ uptime; zero data loss during traffic spikes using asynchronous queue buffering.
* **Security**: OWASP compliant, encrypted audio transmission (HTTPS/TLS), secure JWT storage, and sanitization of all LLM inputs.
* **Accessibility**: WCAG 2.1 AA compliant, fully keyboard-navigable recording studio with high-contrast UI mode.
