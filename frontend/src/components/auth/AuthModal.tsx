import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle, Sparkles, Infinity, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { SayWiseLogo } from '../common/SayWiseLogo.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
  customTitle?: string;
  customSubtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  customTitle,
  customSubtitle,
}) => {
  const { login, register, loginWithGoogle, loginAsGuest, sendPasswordReset, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setResetSubmitted(false);
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setErrorMessage('Please enter your full name');
          return;
        }
        await register(email, password, displayName);
        onClose();
      } else if (mode === 'signin') {
        await login(email, password);
        onClose();
      } else if (mode === 'reset') {
        if (!email.trim()) {
          setErrorMessage('Please enter your email address');
          return;
        }
        try {
          await sendPasswordReset(email.trim());
        } catch (err: any) {
          // If invalid email format or rate limited, display clear message
          if (err.code === 'auth/invalid-email') {
            setErrorMessage('Please enter a valid email address.');
            return;
          }
          if (err.code === 'auth/too-many-requests') {
            setErrorMessage('Too many requests. Please wait a few minutes before trying again.');
            return;
          }
        }
        // Generic OWASP-compliant confirmation (does not expose user enumeration)
        setResetSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign in failed');
    }
  };

  const handleGuestLogin = async () => {
    setErrorMessage(null);
    try {
      await loginAsGuest('Alex');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Guest login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/90 text-slate-900 font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. RESET PASSWORD CONFIRMATION STATE */}
        {mode === 'reset' && resetSubmitted ? (
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
              <Infinity className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">
                Check your inbox
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed px-2 font-medium">
                If an account exists for <strong className="text-slate-800 font-bold">{email}</strong>, you'll receive a password-reset link shortly.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setResetSubmitted(false);
                  setErrorMessage(null);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Standard Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="flex justify-center">
                <SayWiseLogo size={44} />
              </div>

              {mode === 'reset' ? (
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display flex items-center justify-center gap-1.5">
                    <span>Reset Password</span>
                    <Infinity className="w-5 h-5 text-sky-500" />
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Securely recover access to your account.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                    {customTitle || (mode === 'signin' ? 'Welcome to SayWise' : 'Create your account')}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {customSubtitle ||
                      (mode === 'signin'
                        ? 'Sign in to access your personalized speaking reports & history'
                        : 'Join SayWise to master your speaking fluency and CEFR band')}
                  </p>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Tab Switcher (Only shown on Sign In / Sign Up) */}
            {mode !== 'reset' && (
              <div className="flex bg-slate-100/90 rounded-2xl p-1 mb-5">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Auth / Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Satyam Singh"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('reset');
                          setErrorMessage(null);
                          setResetSubmitted(false);
                        }}
                        className="text-[11px] font-bold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-800 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-sky-600" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-sm shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'signin'
                        ? 'Sign In'
                        : mode === 'signup'
                        ? 'Create Account'
                        : 'Send Recovery Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Sign In option for Reset Mode */}
            {mode === 'reset' && (
              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            )}

            {/* Social & Guest Buttons (Hidden in Reset Mode) */}
            {mode !== 'reset' && (
              <>
                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <div className="space-y-2">
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Guest 1-Click Demo */}
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>Try 1-Click Demo as Alex</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
