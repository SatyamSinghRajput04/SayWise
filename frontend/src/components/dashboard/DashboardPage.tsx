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
import { Topic, User } from '../../types/index.js';
import { RobotMascot } from '../common/RobotMascot.js';

interface DashboardPageProps {
  user: User | null;
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onOpenHistory?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  topics,
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

  const totalEvaluations = user?.stats?.totalEvaluations || 0;
  const avgScore = user?.stats?.averageOverallScore || 82;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#258ecf] via-[#48a9e6] to-[#7ec5f2] text-slate-900 font-sans selection:bg-white selection:text-sky-600 pb-16">
      {/* 1. Volumetric Sky Clouds Atmosphere in Dashboard Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Top-Right Cloud Behind Hero */}
        <div className="absolute top-10 -right-20 w-[520px] h-80 opacity-80">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px] drop-shadow-xl">
            <circle cx="160" cy="140" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="240" cy="110" r="85" fill="white" fillOpacity="0.9" />
            <circle cx="330" cy="130" r="70" fill="white" fillOpacity="0.8" />
            <ellipse cx="240" cy="180" rx="160" ry="60" fill="white" fillOpacity="0.85" />
          </svg>
        </div>

        {/* Mid-Left Floating Cloud */}
        <div className="absolute top-80 -left-20 w-[500px] h-80 opacity-75">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter blur-[1px] drop-shadow-xl">
            <circle cx="180" cy="140" r="75" fill="white" fillOpacity="0.8" />
            <circle cx="260" cy="110" r="85" fill="white" fillOpacity="0.9" />
            <circle cx="350" cy="130" r="70" fill="white" fillOpacity="0.8" />
            <ellipse cx="260" cy="180" rx="160" ry="60" fill="white" fillOpacity="0.85" />
          </svg>
        </div>

        {/* Expansive Bottom Horizon Cumulus Cloud Floor */}
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

        {/* Ambient 4-point Sparkle Stars */}
        <div className="absolute top-28 left-16 text-white/70 animate-pulse">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <path d="M20 0C20 11.0457 28.9543 20 40 20C28.9543 20 20 28.9543 20 40C20 28.9543 11.0457 20 0 20C11.0457 20 20 11.0457 20 0Z" fill="white" fillOpacity="0.8"/>
          </svg>
        </div>
        <div className="absolute bottom-24 right-20 text-white/80 animate-pulse">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <path d="M20 0C20 11.0457 28.9543 20 40 20C28.9543 20 20 28.9543 20 40C20 28.9543 11.0457 20 0 20C11.0457 20 20 11.0457 20 0Z" fill="white" fillOpacity="0.85"/>
          </svg>
        </div>
      </div>

      {/* 2. Main Dashboard Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-6 space-y-6">
        
        {/* Top Hero Welcome Card (Glassmorphic) */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-950/10 border border-white/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              <span>🎯 100–200 words speaking target</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
              👋 Welcome back, {getCleanFirstName(user?.displayName)}!
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl">
              What would you like to speak about today? Choose a prompt below to practice your fluency and get instant multi-dimensional AI scoring.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center">
            <RobotMascot size="sm" speechText="Let's practice!" />
          </div>
        </div>

        {/* 3. Responsive 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Streaks, Stats & Daily Goal (4 cols on Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 🔥 Sky-Blue Streak Card (Replacing Purple) */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl shadow-sky-950/10 border border-white/80 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/25">
                    <Flame className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-display">Keep your streak going!</h3>
                    <p className="text-xs font-bold text-sky-700">3 days in a row</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Sky-Blue / Royal-Blue Step Progress Tracker */}
              <div className="flex items-center justify-between px-1 pt-1">
                {/* Day 1 - Done */}
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-sm shadow-sky-500/30">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="h-1.5 flex-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
                </div>

                {/* Day 2 - Done */}
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-sm shadow-sky-500/30">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="h-1.5 flex-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
                </div>

                {/* Day 3 - Done */}
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-sm shadow-sky-500/30">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="h-1.5 flex-1 bg-slate-200 rounded-full" />
                </div>

                {/* Day 4 - Next Milestone */}
                <div className="w-7 h-7 rounded-full border-2 border-sky-500 bg-sky-50 text-sky-700 font-extrabold text-xs flex items-center justify-center shadow-sm animate-pulse">
                  4
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
                <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-3.5 text-center">
                  <p className="text-xl font-black text-sky-950 font-mono">{avgScore}</p>
                  <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mt-0.5">Avg Score</p>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3.5 text-center">
                  <p className="text-xl font-black text-emerald-950 font-mono">C1</p>
                  <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">CEFR Band</p>
                </div>
              </div>

              {/* Total Evaluations & History Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-500">Total Evaluations: <strong className="text-slate-800">{totalEvaluations}</strong></span>
                {onOpenHistory && (
                  <button
                    onClick={onOpenHistory}
                    className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>View all</span>
                  </button>
                )}
              </div>
            </div>

            {/* 🎯 Daily Practice Goal */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl shadow-sky-950/10 border border-white/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Daily Goal</h4>
                </div>
                <span className="text-xs font-bold text-blue-700">1 of 2 completed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full w-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Record 1 more 90-second response today to hit your fluency milestone.</p>
            </div>
          </div>

          {/* Right Column: Topics Grid (8 cols on Desktop) */}
          <div className="lg:col-span-8 space-y-4" id="topics-section">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                  Choose a topic and improve your speaking.
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Select any structured prompt below to enter the Voice Studio.
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/60 text-slate-700 text-xs font-bold border border-white/80">
                {topics.length} Prompts Available
              </span>
            </div>

            {/* Grid of Frosted Glass Topic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => onSelectTopic(topic)}
                  className="bg-white/90 backdrop-blur-2xl border border-white/90 rounded-3xl p-5 shadow-lg shadow-sky-950/5 hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-300 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${getTopicBg(topic.icon)}`}>
                        {getTopicIcon(topic.icon)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        {topic.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 font-display group-hover:text-sky-600 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                        {topic.prompt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <span>100–200 words</span>
                      <span>•</span>
                      <span>90s target</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-all">
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
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
