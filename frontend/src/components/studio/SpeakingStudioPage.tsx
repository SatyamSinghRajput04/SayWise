import React, { useState, useRef } from 'react';
import { ChevronLeft, Lightbulb, Square, AlertCircle, Sparkles, Mic, Type } from 'lucide-react';
import { Topic } from '../../types/index.js';
import { AudioRecordingService } from '../../services/audioService.js';
import { NeptuneOrbVisualizer } from './NeptuneOrbVisualizer.js';

interface SpeakingStudioPageProps {
  topic: Topic;
  onBack: () => void;
  onSubmitRecording: (audioBlob: Blob | null, transcriptText?: string, durationSec?: number) => void;
}

export const SpeakingStudioPage: React.FC<SpeakingStudioPageProps> = ({
  topic,
  onBack,
  onSubmitRecording,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveWordCount, setLiveWordCount] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');
  const [useTextMode, setUseTextMode] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioServiceRef = useRef<AudioRecordingService | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const handleStartRecording = async () => {
    setWarningMessage(null);
    setLiveTranscript('');
    setLiveWordCount(0);

    try {
      const service = new AudioRecordingService();
      audioServiceRef.current = service;
      await service.startRecording(
        (level) => setAudioLevel(level),
        (transcript, count) => {
          setLiveTranscript(transcript);
          setLiveWordCount(count);
        }
      );

      setIsRecording(true);
      setSecondsElapsed(0);

      timerIntervalRef.current = window.setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Recording initialization error:', err);
      setWarningMessage(
        err.message || 'Microphone access denied. Please allow microphone permissions or type your response manually below.'
      );
      setUseTextMode(true);
    }
  };

  const handleStopRecording = async () => {
    if (!audioServiceRef.current) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsRecording(false);
    setIsTransitioning(true);

    try {
      const result = await audioServiceRef.current.stopRecording();
      const finalTranscript = (liveTranscript || result.liveTranscript || '').trim();
      const finalDuration = secondsElapsed || 15;

      const words = finalTranscript.split(/\s+/).filter(Boolean);
      if (words.length < 3 && !result.audioBlob) {
        setIsTransitioning(false);
        setWarningMessage('No speech was detected. Please speak clearly into your microphone.');
        return;
      }

      setTimeout(() => {
        onSubmitRecording(result.audioBlob, finalTranscript, finalDuration);
      }, 400);
    } catch (err: any) {
      setIsTransitioning(false);
      console.error('Stop recording error:', err);
      setWarningMessage('Error processing audio. Please try again.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTranscript.trim()) return;

    const words = manualTranscript.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      setWarningMessage('Please write at least a few sentences to receive an evaluation.');
      return;
    }

    const estimatedDuration = Math.max(Math.round(words.length / 2.2), 15);
    setIsTransitioning(true);
    setTimeout(() => {
      onSubmitRecording(null, manualTranscript.trim(), estimatedDuration);
    }, 400);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const minWords = topic.targetWordCount?.min || 100;
  const maxWords = topic.targetWordCount?.max || 200;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#258ecf] via-[#48a9e6] to-[#7ec5f2] text-slate-900 font-sans selection:bg-white selection:text-sky-600 pb-16">
      {/* 1. Volumetric Clouds Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-10 -right-20 w-[500px] h-80 opacity-80">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px] drop-shadow-xl">
            <circle cx="160" cy="140" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="240" cy="110" r="85" fill="white" fillOpacity="0.9" />
            <circle cx="330" cy="130" r="70" fill="white" fillOpacity="0.8" />
            <ellipse cx="240" cy="180" rx="160" ry="60" fill="white" fillOpacity="0.85" />
          </svg>
        </div>

        <div className="absolute top-80 -left-20 w-[480px] h-80 opacity-75">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px] drop-shadow-xl">
            <circle cx="180" cy="140" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="260" cy="110" r="85" fill="white" fillOpacity="0.9" />
            <circle cx="350" cy="130" r="70" fill="white" fillOpacity="0.8" />
            <ellipse cx="260" cy="180" rx="160" ry="60" fill="white" fillOpacity="0.85" />
          </svg>
        </div>

        <div className="absolute -bottom-16 left-0 right-0 h-[320px] opacity-95">
          <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <ellipse cx="200" cy="220" rx="180" ry="80" fill="white" fillOpacity="0.8" />
            <ellipse cx="500" cy="200" rx="220" ry="90" fill="white" fillOpacity="0.85" />
            <ellipse cx="820" cy="190" rx="210" ry="90" fill="white" fillOpacity="0.9" />
            <ellipse cx="1160" cy="210" rx="230" ry="90" fill="white" fillOpacity="0.85" />
            <ellipse cx="1400" cy="230" rx="160" ry="80" fill="white" fillOpacity="0.8" />
            <rect x="0" y="240" width="1440" height="80" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
      </div>

      {/* 2. Top Header Navigation */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isRecording}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white font-black text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Studio</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-widest text-white/90 drop-shadow">
            Voice Studio • {topic.category}
          </span>
        </div>

        <button
          onClick={() => setShowTips(!showTips)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all shadow-sm ${
            showTips
              ? 'bg-amber-400 text-slate-950 shadow-amber-400/30'
              : 'bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/40 text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Tips</span>
        </button>
      </div>

      {/* 3. Main Speaking Studio Glassmorphic Canvas */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-2">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-sky-950/15 border border-white/80">
          
          {/* Warning Banner */}
          {warningMessage && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Tips Drawer */}
          {showTips && (
            <div className="mb-6 bg-amber-50/95 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2 animate-in slide-in-from-top duration-200">
              <p className="font-extrabold uppercase tracking-wider text-[11px] text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Examiner Pro Tips for "{topic.title}":</span>
              </p>
              <ul className="space-y-1 list-disc list-inside font-medium pl-1 text-slate-700">
                <li>Structure your response: Introduction $\to$ Key Reasons/Stories $\to$ Conclusion.</li>
                <li>Aim for 100–200 words at a steady, natural speaking pace of 120–140 words per minute.</li>
                <li>Incorporate high-level academic adjectives and varied conjunctions.</li>
              </ul>
            </div>
          )}

          {/* Desktop 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Prompt & Speaking Target Goals */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="space-y-2.5">
                {isRecording ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-black uppercase tracking-wider animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Speaking in progress...</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black uppercase tracking-wider">
                    <span>🎯 Target: {minWords}–{maxWords} words</span>
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug font-display">
                  {topic.title}
                </h1>

                <p className="text-slate-600 text-sm font-medium leading-relaxed bg-sky-50/60 border border-sky-100/80 rounded-2xl p-4">
                  "{topic.prompt}"
                </p>
              </div>

              {/* Progress & Target Stats Capsule */}
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Spoken Words</span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {liveWordCount} <span className="text-xs text-slate-400 font-sans font-bold">/ 200 words</span>
                    </span>
                  </div>
                  {/* Dynamic Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, Math.round((liveWordCount / 200) * 100)))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Minimum: 100</span>
                    <span>Target: 100–200</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Time</p>
                    <p className="text-sm font-black text-slate-800 font-mono mt-0.5">
                      {topic.targetTimeSeconds || 90}s
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</p>
                    <p className="text-xs font-black text-sky-700 uppercase mt-1">
                      {topic.difficulty}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Rotating Neptune Planet */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-5 text-center">
              
              {!useTextMode ? (
                <>
                  {/* 3D Neptune Planet Visualizer (Pure planet, zero clutter) */}
                  <div className="relative py-2 flex items-center justify-center">
                    <NeptuneOrbVisualizer
                      isRecording={isRecording}
                      audioLevel={audioLevel}
                      isTransitioning={isTransitioning}
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                    />
                  </div>

                  {/* Timer & Status Captions */}
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight flex items-center justify-center gap-2">
                      {isRecording && <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block" />}
                      <span>{formatTime(secondsElapsed)}</span>
                    </div>
                    <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                      {isRecording ? "I'm listening..." : "Ready when you are."}
                    </p>
                  </div>

                  {/* Live Recognized Speech Bubble */}
                  {isRecording && liveTranscript && (
                    <div className="w-full max-w-md bg-sky-50/90 border border-sky-200/90 rounded-2xl p-3.5 text-xs text-slate-700 italic font-medium leading-relaxed shadow-sm animate-in fade-in">
                      "{liveTranscript}"
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div className="w-full max-w-md space-y-3 pt-1">
                    {isRecording ? (
                      <button
                        onClick={handleStopRecording}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-rose-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>Finish & Analyze →</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStartRecording}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-sky-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Speaking Now →</span>
                      </button>
                    )}

                    {/* Manual Text Switcher */}
                    <button
                      onClick={() => setUseTextMode(true)}
                      className="text-xs font-bold text-slate-500 hover:text-sky-700 transition-colors inline-flex items-center gap-1"
                    >
                      <Type className="w-3.5 h-3.5" />
                      <span>Or write/type transcript manually</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Manual Text Mode */
                <form onSubmit={handleManualSubmit} className="w-full max-w-md space-y-4">
                  <div className="text-left space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Type Your Spoken Response:
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={manualTranscript}
                      onChange={(e) => setManualTranscript(e.target.value)}
                      placeholder="Type your response here (100–200 words)..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 transition-all leading-relaxed"
                    />
                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                      <span>{manualTranscript.trim().split(/\s+/).filter(Boolean).length} words</span>
                      <span>Target: {minWords}–{maxWords} words</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit for AI Evaluation →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseTextMode(false)}
                    className="text-xs font-bold text-slate-500 hover:text-sky-700 transition-colors inline-flex items-center gap-1"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Switch back to Voice Recording</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
