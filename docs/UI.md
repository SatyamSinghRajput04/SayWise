## 1. Unified Visual Identity & Color Palette

SayWise adopts a single, unified, cohesive **Atmospheric Sky-Blue & Glassmorphic Visual Language** across the entire application (Landing Page, Dashboard, Speaking Studio, and Evaluation Report):

### 1.1 Color Tokens & Global Themes

```css
/* 1. Global Atmospheric Background Gradients */
--bg-sky-hero: linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%);
--bg-app-surface: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%);
--bg-card-glass: rgba(255, 255, 255, 0.88);
--bg-card-glass-hover: rgba(255, 255, 255, 0.96);
--border-glass: rgba(255, 255, 255, 0.70);
--shadow-glass: 0 10px 30px -10px rgba(2, 132, 199, 0.15);

/* 2. Brand & Interactive Accents */
--color-brand-primary: #0284c7; /* Sky 600 */
--color-brand-hover:   #0369a1; /* Sky 700 */
--color-brand-glow:    #38bdf8; /* Sky 400 (Waveform & Neon glow) */
--color-brand-dark:    #0c4a6e; /* Sky 900 (High-contrast text) */

/* 3. Soft Pastel Topic Badges (Harmonized with Sky Blue) */
--badge-travel:      #f3e8ff; /* Soft Purple bg */
--badge-travel-text: #7e22ce;
--badge-edu:         #dcfce7; /* Soft Emerald bg */
--badge-edu-text:    #15803d;
--badge-tech:        #e0f2fe; /* Soft Sky bg */
--badge-tech-text:   #0369a1;
--badge-career:      #ffedd5; /* Soft Amber bg */
--badge-career-text: #c2410c;
--badge-random:      #fce7f3; /* Soft Rose bg */
--badge-random-text: #be185d;

/* 4. Evaluation & Diagnostic Indicators */
--score-emerald:     #10b981; /* High Band (80-100 / C1-C2) */
--score-amber:       #f59e0b; /* Medium Band (60-79 / B1-B2) */
--score-rose:        #f43f5e; /* Grammar Mistake / Low Band (0-59) */
```

### 1.2 Cohesive Experience Across All Views
* **Landing Page**: Deep sky-blue atmospheric gradient hero, translucent frosted-glass capsule navbar, bold white typography, 3D AI mascot, and live waveform preview.
* **Dashboard**: Light sky-blue ambient background (`bg-sky-50/70`), white glassmorphic cards with frosted borders (`backdrop-blur-xl bg-white/85 border border-white/80 shadow-md`), 3D mascot greeting card, and soft pastel topic badges.
* **Speaking Studio**: Matching sky-tinted recording arena with a radiant cyan/sky-blue live frequency waveform canvas, pulsing recording indicator, and clean frosted action controls.
* **Evaluation Report**: White frosted scorecards with emerald/sky accent gauges, interactive colored grammar highlights, and clean typography.

---

## 2. Landing Page Architecture (`/`)

The landing page adapts the sky-blue glassmorphic reference design into a compelling value proposition for SayWise:

### 2.1 Header / Navbar
* **Brand Identity (Left)**: SayWise Logo + 3D Voice Avatar icon.
* **Floating Frosted Glass Capsule (Center)**: `[ Home ]  [ How It Works ]  [ Features ]  [ Topics ]` with subtle pill hover states.
* **Action CTAs (Right)**: `Sign In` text link + `Start Free →` white pill button.

### 2.2 Hero Section
* **Pill Badge**: `✨ Top #1 AI Speaking & Fluency Coach →`
* **Hero Headline**:
  # Speak with Unshakable Fluency & Precision with AI
* **Sub-headline**:
  *SayWise analyzes your 100–200 word spoken responses in real-time—delivering instant grammar diagnostics, CEFR vocabulary breakdowns, pacing analytics, and personalized coaching.*
* **CTA Button Cluster**:
  * `[ Start Speaking for Free → ]` (High-contrast solid white pill button).
  * `[ Try 30s Instant Demo ▷ ]` (Frosted glass button opening quick speaking widget).
* **Hero Mascot & Voice Bubble**:
  * Floating 3D AI coach with interactive speech bubbles (*"Hello! Ready to speak for 90 seconds?"*).

### 2.3 Live Interactive Speaking Preview Widget
* An embedded interactive soundwave preview right on the landing page where visitors can test their microphone and watch live waveform animations.

### 2.4 Feature Highlights Grid (Frosted Glass Cards)
1. 🎯 **Pinpoint Grammar Corrections**: Highlighted inline transcript with grammatical rule explanations.
2. 📚 **CEFR Lexical Resource**: Word-level A1–C2 categorization with advanced synonym upgrades.
3. ⚡ **Fluency & Pacing Radar**: Accurate WPM calculations, pause ratio, and filler word detection.
4. 📈 **Actionable Improvement Roadmap**: Tailored speaking drills designed by linguistic experts.

---

## 3. Dashboard UI/UX Specification (Mobile-First & Desktop Adaptive)

The dashboard adapts the user's mobile-friendly design reference with soft pastel tones, rounded cards, and the 3D AI companion.

```
┌────────────────────────────────────────────────────────┐
│  (Avatar) Good Morning                               🔔│
│           Buddy, Alex                                  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 👋 Welcome back Buddy, Alex!            [ 🤖 ]   │  │
│  │                                         (Robot)  │  │
│  │ What would you like to speak about               │  │
│  │ today?                                           │  │
│  │                                                  │  │
│  │ • 100–200 words target                           │  │
│  │ • Instant AI Speech & Grammar Evaluation         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Choose a topic and improve your speaking:             │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [ ✈️ ]  Travel                              >   │  │
│  │        Share your travel experiences             │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [ 🎓 ]  Education                           >   │  │
│  │        Talk about your learning journey          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [ 🖥️ ]  Technology                          >   │  │
│  │        The future of technology                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [ 💼 ]  Work & Career                       >   │  │
│  │        Your dream job                            │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [ ✨ ]  Random Topic                        >   │  │
│  │        Surprise me!                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🔥 Keep your streak going!                  ( > )│  │
│  │    3 days in a row                               │  │
│  │    [ ✓ ]  ───  [ ✓ ]  ───  [ ✓ ]  ───  ( 4 )     │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 3.1 Key Dashboard Components:
1. **Top User Bar**:
   * Left: Circular user avatar with greeting *"Good Morning, Buddy, Alex"* (or dynamic time-based greeting).
   * Right: Notification bell with notification indicator dot.
2. **Hero Welcome Card**:
   * Title: *"👋 Welcome back Buddy, Alex!"*
   * Subtitle: *"What would you like to speak about today?"*
   * Right: 3D cute AI robot mascot with interactive hover greeting.
3. **Categorized Topic List**:
   * Each card features a soft-pastel rounded icon, title, description, and right chevron arrow:
     * ✈️ **Travel**: `bg-purple-100 text-purple-600` — *"Share your travel experiences"*
     * 🎓 **Education**: `bg-emerald-100 text-emerald-600` — *"Talk about your learning journey"*
     * 🖥️ **Technology**: `bg-blue-100 text-blue-600` — *"The future of technology"*
     * 💼 **Work & Career**: `bg-amber-100 text-amber-600` — *"Your dream job"*
     * ✨ **Random Topic**: `bg-pink-100 text-pink-600` — *"Surprise me!"*
   * Clicking any topic immediately opens the **Speaking Assessment Studio** with the selected prompt.
4. **Streak Card**:
   * Flame icon 🔥 with *"Keep your streak going! 3 days in a row"*.
   * Interactive progress step nodes: `[ ✓ Day 1 ] [ ✓ Day 2 ] [ ✓ Day 3 ] [ (4) Today ]`.
   * Action button opening the full practice history and calendar.
5. **Mobile & Desktop Shell**:
   * Centered mobile-optimized layout on mobile screens (`w-full max-w-lg mx-auto`).
   * Seamlessly scales to a multi-column view on desktop displays with side navigation.

---

## 4. Complete End-to-End Screen Flow & UX Hierarchy

SayWise features a seamless 6-screen voice assessment journey:

```
[ 1. Landing Page ] ──> [ 2. Dashboard ] ──> [ 3. Speak Now (Studio) ]
                                                        │ (Stop Recording)
                                                        ▼
                                             [ 4. Analyzing Speech ]
                                                        │ (Processing Finished)
                                                        ▼
                                             [ 5. Your Results ]
                                                        │ (View Detailed Feedback)
                                                        ▼
                                             [ 6. Detailed Feedback ]
                                                        │ (Finish Review →)
                                                        ▼
                                             [ 7. Practice Completed 🎉 ]
```

---

### 4.1 Screen 1: Speak Now (Voice Recording Studio)
* **Header**: Back arrow `<` | Title `"Speak Now"` | Top-Right `"💡 Tips"` button.
* **Topic Card**: Target badge `"100–200 words"` in purple pill | Prompt title: **"Talk about your dream job."**
* **Audio Visualizer Center**:
  * Concentric pulsing gradient rings around a glowing purple microphone icon.
  * Real-time audio waveform canvas rendering audio frequency bars.
  * Digital Timer: `00:45` with animated text `"Recording..."`.
* **Live Pacing Metrics Bar**:
  * Words Counter: `127 Words` (green active indicator).
  * Speaking Pace: `"Good pace • Keep it up!"`.
  * Target Duration: `01:20 Est. time`.
* **Primary Action**: Solid red/rose button: `[ ■ Stop Recording ]`.

---

### 4.2 Screen 2: Analyzing Your Speech (Dynamic Stage Stepper)
* **Header**: Back arrow `<` | Title `"Analyzing your speech"`.
* **Illustration**: 3D Cute AI Robot companion with glowing eyes and ambient purple stars.
* **Heading**: **"Analyzing your speech..."** | Subtitle: *"This usually takes 10–20 seconds"*.
* **Live Animated Checklist**:
  * `✓ Converting speech to text` (Completed)
  * `✓ Checking grammar` (Completed)
  * `◐ Evaluating vocabulary` (In progress animation)
  * `○ Calculating overall score` (Pending)
  * `○ Generating feedback` (Pending)
* **Insight Card**: `"💡 Did you know? Practicing daily helps you speak with more confidence and clarity."`

---

### 4.3 Screen 3: Your Results (Overview Scorecard)
* **Header**: Back arrow `<` | Title `"Your Results"` | Top-Right Share icon.
* **Hero Score Card**:
  * Score: `82 / 100` | Subtitle: `"Great job! 🎉"`.
  * Circular progress ring gauge displaying `82`.
* **Multi-Metric Breakdown Bars**:
  * 🔤 **Grammar**: `86/100` (purple bar)
  * 📖 **Vocabulary**: `78/100` (blue bar)
  * 🎙️ **Fluency**: `81/100` (orange bar)
* **Feedback Cards**:
  * **What you did well** (Soft emerald bg):
    * `✓ Good use of varied vocabulary`
    * `✓ Clear and well-structured sentences`
  * **Areas to improve** (Soft amber bg):
    * `💡 Try to use more linking words`
    * `💡 Work on article usage (a, an, the)`
* **Primary Action**: Solid purple/indigo button: `[ View Detailed Feedback ]`.

---

### 4.4 Screen 4: Detailed Feedback (Transcript & Diagnostic Fixes)
* **Header**: Back arrow `<` | Title `"Detailed Feedback"`.
* **Your Transcript Card**:
  * Verbatim text with audio playback button `▶` to listen back.
* **Grammar Feedback Card**:
  * Original: *"it allows me to solve real world problems"* 🔊
  * Better: *"it allows me to solve real-world problems"* (highlighted in green)
  * Why: *Use a hyphen to compound adjectives before nouns.*
* **Vocabulary Suggestion Card**:
  * Original: *"very interesting"* 🔊
  * Better: *"highly engaging"* (highlighted in green)
  * Why: *More precise and impactful.*
* **Fluency Tip Card**:
  * *Try to vary your sentence structures. Mix short and long sentences for better flow.*
* **Custom Bottom CTA**:
  * Solid pill button: `[ Finish Review → ]` (transitions smoothly to Screen 5).

---

### 4.5 Screen 5: Practice Completed / Celebration View
* **Celebration Banner**: Festive Party Popper illustration 🎉 with confetti.
* **Heading**: **"Great job, Buddy Alex! 🎉"** | Subtitle: *"You completed your speaking practice."*
* **Action Menu Options**:
  * `[ ↻ ]  Practice Again` — *"Try the same topic"*
  * `[ ✦ ]  Choose New Topic` — *"Pick a different topic"*
  * `[ ◷ ]  View History` — *"See your past attempts"*
  * `[ 💬 ]  Chat about this (New)` — *"Discuss your answer with AI"*
* **Primary Action**: Solid button `[ Back to Home ]` returning to the main Dashboard.

---

## 3. Audio Recording & Waveform UX Flow

```
[Idle State] ──(Click 'Start Speaking')──> [Request Mic Permission]
                                                    │
                                             (Granted)
                                                    │
                                                    ▼
                                          [Active Recording State]
                                          * Live Waveform Frequency Canvas
                                          * Elapsed Timer (e.g. 01:14 / 02:00)
                                          * Pulsing Red Recording Indicator
                                                    │
                        ┌───────────────────────────┴───────────────────────────┐
                        │ (Click 'Pause')                                       │ (Click 'Stop & Review')
                        ▼                                                       ▼
                [Paused State]                                          [Review State]
                * Freeze Timer                                          * Audio Playback Bar
                * Resume Button                                         * 'Re-record' vs 'Submit for Analysis'
                                                                                │
                                                                         (Click 'Submit')
                                                                                │
                                                                                ▼
                                                                     [Processing Stage Modal]
                                                                     1. Uploading Audio...
                                                                     2. Transcribing Speech...
                                                                     3. AI Evaluating Grammar...
                                                                     4. Generating Report...
                                                                                │
                                                                                ▼
                                                                     [Render Evaluation Report]
```

---

## 4. Accessibility (a11y) & Responsive Standards
* **Keyboard Navigation**: `Spacebar` toggles recording start/stop; `Esc` cancels prompt modal.
* **Screen Reader Support**: ARIA live regions announce recording status and score calculation completion.
* **Mobile Responsiveness**: Audio recording studio is fully optimized for touch targets (min $48\times48\text{px}$) on mobile viewports.
