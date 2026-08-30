import React from 'react';
import { 
  Flame, 
  Check, 
  ChevronRight, 
  Plane, 
  GraduationCap, 
  Monitor, 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  Target,
  Clock
} from 'lucide-react';
import { Topic, User, EvaluationResult } from '../../types/index.js';
import { RobotMascot } from '../common/RobotMascot.js';
import {
  calculateCalendarStreak,
  calculateTodayEvaluations,
  calculateRollingAverageScore,
  calculateEstimatedCEFR,
} from '../../utils/metricsCalculator.js';

interface DashboardPageProps {
  user: User | null;
  topics: Topic[];
  evaluations?: EvaluationResult[];
  onSelectTopic: (topic: Topic) => void;
  onOpenHistory?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  topics,
  evaluations = [],
  onSelectTopic,
  onOpenHistory,
}) => {
  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Plane':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-blue-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-amber-600" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTopicBg = (iconName: string) => {
    switch (iconName) {
      case 'Plane':
        return 'bg-sky-100/90 text-sky-700';
      case 'GraduationCap':
        return 'bg-emerald-100/90 text-emerald-700';
      case 'Monitor':
        return 'bg-blue-100/90 text-blue-700';
      case 'Briefcase':
        return 'bg-amber-100/90 text-amber-700';
      case 'Sparkles':
      default:
        return 'bg-purple-100/90 text-purple-700';
    }
  };

  const getCleanFirstName = (displayName?: string): string => {
    if (!displayName) return 'Alex';
    const cleaned = displayName.replace(/^buddy,?\s*/i, '').trim();
    return cleaned.split(/\s+/)[0] || 'Alex';
  };

  // Pure dynamic metrics computed from ground truth
  const streakDays = calculateCalendarStreak(evaluations);
  const todayCount = calculateTodayEvaluations(evaluations);
  const avgScore = calculateRollingAverageScore(evaluations);
  const estimatedCefr = calculateEstimatedCEFR(avgScore);
  const totalEvaluations = evaluations.length > 0 ? evaluations.length : (user?.stats?.totalEvaluations || 0);
  const dailyCompleted = Math.min(todayCount, 2);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#258ecf] via-[#48a9e6] to-[#7ec5f2] text-slate-900 font-sans selection:bg-white selection:text-sky-600 pb-16">
      {/* 1. Volumetric Sky Clouds Atmosphere in Dashboard Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Top-Right Cloud Behind Hero */}
        <div className="absolute top-10 -right-20 w-[520px] h-80 opacity-80">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px] drop-shadow-xl">
            <circle cx="160" cy="140" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="240" cy="110" r="85" fill="white" fillOpacity="0.9" />
            <circle cx="320" cy="130" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="200" cy="180" r="60" fill="white" fillOpacity="0.75" />
            <circle cx="280" cy="180" r="65" fill="white" fillOpacity="0.75" />
          </svg>
        </div>

        {/* Top-Left Ambient Cloud */}
        <div className="absolute -top-10 -left-20 w-96 h-64 opacity-60">
          <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px]">
            <circle cx="120" cy="120" r="60" fill="white" fillOpacity="0.8" />
            <circle cx="180" cy="100" r="70" fill="white" fillOpacity="0.85" />
            <circle cx="240" cy="120" r="60" fill="white" fillOpacity="0.8" />
          </svg>
        </div>

        {/* Mid-Background Soft Cloud Bank */}
        <div className="absolute top-1/2 -left-32 w-[600px] h-96 opacity-40">
          <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[2px]">
            <circle cx="150" cy="150" r="80" fill="white" fillOpacity="0.7" />
            <circle cx="250" cy="120" r="95" fill="white" fillOpacity="0.8" />
            <circle cx="350" cy="150" r="80" fill="white" fillOpacity="0.7" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* 2. Welcome Banner with Cloud Theme */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/15 border border-white/80 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/90 text-sky-800 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>AI Speaking Studio • Ready</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display">
                Welcome back, {getCleanFirstName(user?.displayName)} 👋
              </h1>
              <p className="text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
                Choose a prompt below to practice your fluency and get instant multi-dimensional scoring.
              </p>
            </div>

            {/* Mascot in Dashboard Banner */}
            <div className="flex-shrink-0">
              <RobotMascot size="md" speechText="Let's practice!" />
            </div>
          </div>
        </div>

        {/* 3. Responsive 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Streaks, Stats & Daily Goal (4 cols on Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 🔥 Dynamic Calendar-Based Streak Card */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl shadow-sky-950/10 border border-white/80 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${streakDays > 0 ? 'bg-gradient-to-tr from-amber-400 to-orange-500 shadow-amber-500/25' : 'bg-gradient-to-tr from-sky-400 to-blue-600 shadow-sky-500/25'} text-white flex items-center justify-center shadow-md`}>
                    <Flame className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-display">
                      {streakDays > 0 ? 'Streak active! 🔥' : 'Start your speaking streak'}
                    </h3>
                    <p className="text-xs font-bold text-sky-700">
                      {streakDays === 0 ? '0 days' : `${streakDays} day${streakDays > 1 ? 's' : ''} in a row`}
                    </p>
                  </div>
                </div>
                {onOpenHistory && (
                  <button onClick={onOpenHistory} className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-100 flex items-center justify-center text-sky-600 transition-colors cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dynamic Step Progress Tracker */}
              <div className="flex items-center justify-between px-1 pt-1">
                {/* Day 1 */}
                <div className="flex items-center gap-1.5 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                    streakDays >= 1
                      ? 'bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-sky-500/30'
                      : 'border-2 border-sky-500 bg-sky-50 text-sky-700 animate-pulse'
                  }`}>
                    {streakDays >= 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                  </div>
                  <div className={`h-1.5 flex-1 rounded-full ${streakDays >= 2 ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-slate-200'}`} />
                </div>

                {/* Day 2 */}
                <div className="flex items-center gap-1.5 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                    streakDays >= 2
                      ? 'bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-sky-500/30'
                      : streakDays === 1
                      ? 'border-2 border-sky-500 bg-sky-50 text-sky-700 animate-pulse'
                      : 'border border-slate-200 bg-slate-100 text-slate-400'
                  }`}>
                    {streakDays >= 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
                  </div>
                  <div className={`h-1.5 flex-1 rounded-full ${streakDays >= 3 ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-slate-200'}`} />
                </div>

                {/* Day 3 */}
                <div className="flex items-center gap-1.5 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                    streakDays >= 3
                      ? 'bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-sky-500/30'
                      : streakDays === 2
                      ? 'border-2 border-sky-500 bg-sky-50 text-sky-700 animate-pulse'
                      : 'border border-slate-200 bg-slate-100 text-slate-400'
                  }`}>
                    {streakDays >= 3 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '3'}
                  </div>
                  <div className={`h-1.5 flex-1 rounded-full ${streakDays >= 4 ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-slate-200'}`} />
                </div>

                {/* Day 4 - Next Milestone */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  streakDays >= 4
                    ? 'bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-sky-500/30'
                    : streakDays === 3
                    ? 'border-2 border-sky-500 bg-sky-50 text-sky-700 animate-pulse'
                    : 'border border-slate-200 bg-slate-100 text-slate-400'
                }`}>
                  {streakDays >= 4 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '4'}
                </div>
              </div>
            </div>

            {/* 📊 Dynamic User Metrics Card */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl shadow-sky-950/10 border border-white/80 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>Your Fluency Profile</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Average Score */}
                <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-3.5 text-center">
                  <p className="text-2xl font-black text-sky-950 font-mono">
                    {avgScore !== null ? avgScore : '—'}
                  </p>
                  <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mt-0.5">
                    {avgScore !== null ? (totalEvaluations >= 10 ? 'Recent 10-Test Avg' : 'Average Score') : 'Take test to begin'}
                  </p>
                </div>

                {/* Estimated CEFR Level */}
                <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3.5 text-center">
                  <p className="text-2xl font-black text-emerald-950 font-mono">
                    {estimatedCefr !== null ? estimatedCefr : '—'}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
                    {estimatedCefr !== null ? 'Estimated CEFR' : 'Benchmark pending'}
                  </p>
                </div>
              </div>

              {/* Total Evaluations & History Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-500">
                  Total Evaluations: <strong className="text-slate-800">{totalEvaluations}</strong>
                </span>
                {onOpenHistory && (
                  <button
                    onClick={onOpenHistory}
                    className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>View all</span>
                  </button>
                )}
              </div>
            </div>

            {/* 🎯 Date-Based Daily Practice Goal */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl shadow-sky-950/10 border border-white/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Today's Practice</h4>
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {dailyCompleted} of 2 completed {dailyCompleted >= 2 ? '🎉' : ''}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(dailyCompleted / 2) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {dailyCompleted === 0
                  ? 'Record 2 responses today to hit your daily speaking goal.'
                  : dailyCompleted === 1
                  ? 'Record 1 more response today to hit your daily milestone.'
                  : 'Daily goal achieved! Keep practicing to push your fluency higher.'}
              </p>
            </div>
          </div>

          {/* Right Column: Topics Grid (8 cols on Desktop) */}
          <div className="lg:col-span-8 space-y-4" id="topics-section">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                  Choose a topic and improve your speaking.
                </h2>
                <p className="text-xs text-sky-950 font-bold mt-0.5">
                  Select any category to begin your guided 90-second recording session.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t)}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-lg shadow-sky-950/5 border border-white/90 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-950/10 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4 active:scale-[0.99]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${getTopicBg(t.icon)}`}>
                        {getTopicIcon(t.icon)}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-800 transition-colors">
                        {t.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {t.prompt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                      Target: 100–200 words
                    </span>
                    <span className="font-extrabold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Practice Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
