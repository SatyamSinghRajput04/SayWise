import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Clock, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { SayWiseLogo } from './SayWiseLogo.js';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onOpenHistory?: () => void;
  onOpenAuth?: () => void;
  currentScreen: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onOpenHistory,
  onOpenAuth,
  currentScreen,
}) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isLanding = currentScreen === 'LANDING';
  const isDashboard = currentScreen === 'DASHBOARD';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTopicsClick = () => {
    onNavigateDashboard();
    setTimeout(() => {
      const el = document.getElementById('topics-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const getCleanFirstName = (displayName?: string): string => {
    if (!displayName) return 'Alex';
    const cleaned = displayName.replace(/^buddy,?\s*/i, '').trim();
    return cleaned.split(/\s+/)[0] || 'Alex';
  };

  return (
    <header className="relative z-30 pt-5 px-6 sm:px-12 md:px-16 w-full flex items-center justify-between">
      {/* 1. Left Brand Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none group"
        onClick={onNavigateHome}
      >
        <div className="flex items-center justify-center group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          <SayWiseLogo size={38} />
        </div>
        <span className="font-black text-white text-2xl tracking-tight font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] group-hover:text-sky-100 transition-colors">
          SayWise
        </span>
      </div>

      {/* 2. Center Frosted Glass Capsule Menu */}
      <nav className="hidden md:flex items-center gap-7 bg-white/20 backdrop-blur-xl border border-white/35 rounded-2xl px-7 py-2 shadow-lg shadow-black/10 text-xs font-bold text-white">
        <button
          onClick={onNavigateHome}
          className={`transition-colors hover:text-white drop-shadow ${isLanding ? 'text-white font-black underline underline-offset-4 decoration-white' : 'text-white/85'}`}
        >
          Home
        </button>
        <button
          onClick={onNavigateDashboard}
          className={`transition-colors hover:text-white drop-shadow ${isDashboard ? 'text-white font-black underline underline-offset-4 decoration-white' : 'text-white/85'}`}
        >
          Dashboard
        </button>
        <button
          onClick={handleTopicsClick}
          className="transition-colors hover:text-white text-white/85 drop-shadow cursor-pointer"
        >
          Topics
        </button>
        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="transition-colors hover:text-white text-white/85 drop-shadow"
          >
            History
          </button>
        )}
      </nav>

      {/* 3. Right Action Link / User Profile Dropdown */}
      <div className="flex items-center gap-3">
        {isLanding ? (
          user ? (
            <button
              onClick={onNavigateDashboard}
              className="flex items-center gap-1.5 text-white text-xs sm:text-sm font-extrabold hover:text-white/80 transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAuth}
                className="text-white text-xs sm:text-sm font-bold hover:text-white/80 transition-colors drop-shadow"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white text-sky-950 text-xs sm:text-sm font-black hover:bg-sky-50 shadow-md transition-all group"
              >
                <span>Start for free</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-700 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )
        ) : (
          /* On Dashboard: User Profile Menu with Dropdown */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/35 rounded-2xl px-3.5 py-1.5 shadow-sm text-white transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 text-sky-950 font-black text-xs flex items-center justify-center shadow-sm">
                {getCleanFirstName(user?.displayName).charAt(0)}
              </div>
              <span className="text-xs font-extrabold hidden sm:inline drop-shadow">
                {getCleanFirstName(user?.displayName)}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-white/80 transition-transform group-hover:translate-y-0.5" />
            </button>

            {/* Dropdown Card */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-slate-100 text-slate-900 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-sky-50/80 rounded-2xl mb-2 border border-sky-100/80">
                  <p className="font-black text-slate-900 text-sm">
                    {user?.displayName?.replace(/^buddy,?\s*/i, '') || 'Alex Johnson'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {user?.email || 'alex@saywise.ai'}
                  </p>
                </div>

                <div className="space-y-1">
                  {onOpenHistory && (
                    <button
                      onClick={() => { setIsDropdownOpen(false); onOpenHistory(); }}
                      className="w-full px-3 py-2 rounded-xl text-left font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Speaking History</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setIsDropdownOpen(false); onOpenAuth?.(); }}
                    className="w-full px-3 py-2 rounded-xl text-left font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Switch / Sign In Account</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => { setIsDropdownOpen(false); logout(); onNavigateHome(); }}
                    className="w-full px-3 py-2 rounded-xl text-left font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
