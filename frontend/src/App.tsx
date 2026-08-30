import React, { useState, useEffect } from 'react';
import { ScreenState, Topic, EvaluationResult } from './types/index.js';
import { api } from './services/api.js';
import { useAuth } from './context/AuthContext.js';
import { Navbar } from './components/common/Navbar.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { DashboardPage } from './components/dashboard/DashboardPage.js';
import { SpeakingStudioPage } from './components/studio/SpeakingStudioPage.js';
import { AnalyzingSpeechPage } from './components/studio/AnalyzingSpeechPage.js';
import { ResultsOverviewPage } from './components/report/ResultsOverviewPage.js';
import { DetailedFeedbackPage } from './components/report/DetailedFeedbackPage.js';
import { PracticeCompletePage } from './components/report/PracticeCompletePage.js';
import { HistoryModal } from './components/history/HistoryModal.js';
import { AuthModal } from './components/auth/AuthModal.js';

export const App: React.FC = () => {
  const { user, token, isDemoSession, demoTestsCount, recordDemoTestCompleted } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('LANDING');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [evaluationsHistory, setEvaluationsHistory] = useState<EvaluationResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [authModalTitle, setAuthModalTitle] = useState<string | undefined>();
  const [authModalSubtitle, setAuthModalSubtitle] = useState<string | undefined>();

  // Load history
  const loadHistory = React.useCallback(async () => {
    try {
      const data = await api.getEvaluationHistory(token || undefined);
      if (Array.isArray(data)) {
        setEvaluationsHistory(data);
      }
    } catch (err) {
      console.warn('Failed to load history:', err);
    }
  }, [token]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, token]);

  // Fetch initial topics
  useEffect(() => {
    api.getTopics()
      .then((data) => {
        setTopics(data);
        if (data.length > 0) setSelectedTopic(data[3] || data[0]); // default to Work & Career / Dream job
      })
      .catch((err) => console.error('Failed to load topics:', err));
  }, []);

  const openAuth = (mode: 'signin' | 'signup' = 'signup', title?: string, subtitle?: string) => {
    setAuthModalMode(mode);
    setAuthModalTitle(title);
    setAuthModalSubtitle(subtitle);
    setIsAuthModalOpen(true);
  };

  const handleSelectTopic = (topic: Topic) => {
    // If user is an unauthenticated guest and has already used their 1 free trial test -> prompt sign up
    if (isDemoSession && demoTestsCount >= 1) {
      openAuth(
        'signup',
        'Unlock Unlimited Speaking Practice',
        'You have completed your 1 free speaking trial. Create a free account or sign in to practice all topics.'
      );
      return;
    }

    setSelectedTopic(topic);
    setCurrentScreen('STUDIO_RECORDING');
  };

  const handleTryDemo = () => {
    if (topics.length > 0) {
      setSelectedTopic(topics[0]);
      setCurrentScreen('STUDIO_RECORDING');
    } else {
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleSubmitRecording = async (audioBlob: Blob | null, transcriptText?: string, durationSec?: number, topicPrompt?: string) => {
    if (!selectedTopic) return;
    setCurrentScreen('STUDIO_ANALYZING');

    const formData = new FormData();
    formData.append('topicId', selectedTopic.id);
    formData.append('topicPrompt', topicPrompt || selectedTopic.prompt);
    if (durationSec) formData.append('durationSeconds', durationSec.toString());
    if (transcriptText) formData.append('transcript', transcriptText);
    if (audioBlob) formData.append('audio', audioBlob, 'speaking_sample.webm');

    try {
      const result = await api.submitAudioEvaluation(formData, token || undefined);
      setCurrentEvaluation(result);
      setEvaluationsHistory((prev) => [result, ...prev]);
      if (isDemoSession) {
        recordDemoTestCompleted();
      }

      // Brief pause to display the full stepper completion
      setTimeout(() => {
        setCurrentScreen('RESULTS_OVERVIEW');
      }, 1200);
    } catch (err: any) {
      console.error('Evaluation failed:', err);
      alert(err.message || 'No speech detected. Please speak into your microphone and try again.');
      setCurrentScreen('STUDIO_RECORDING');
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* 1. Global Navigation Bar (shown on Dashboard) */}
      {currentScreen === 'DASHBOARD' && (
        <div className="bg-[#258ecf] pt-1">
          <Navbar
            onNavigateHome={() => setCurrentScreen('LANDING')}
            onNavigateDashboard={() => setCurrentScreen('DASHBOARD')}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenAuth={() => openAuth('signin')}
            currentScreen={currentScreen}
          />
        </div>
      )}

      {/* 2. Main Screen State Switcher */}
      <main className="flex-1 w-full">
        {currentScreen === 'LANDING' && (
          <LandingPage
            onStartFree={() => {
              if (user) {
                setCurrentScreen('DASHBOARD');
              } else {
                openAuth('signup');
              }
            }}
            onExploreTopics={() => setCurrentScreen('DASHBOARD')}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenAuth={() => openAuth('signin')}
            onTryDemo={handleTryDemo}
          />
        )}

        {currentScreen === 'DASHBOARD' && (
          <DashboardPage
            user={user}
            topics={topics}
            evaluations={evaluationsHistory}
            onSelectTopic={handleSelectTopic}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}

        {currentScreen === 'STUDIO_RECORDING' && selectedTopic && (
          <SpeakingStudioPage
            topic={selectedTopic}
            onBack={() => (user ? setCurrentScreen('DASHBOARD') : setCurrentScreen('LANDING'))}
            onSubmitRecording={handleSubmitRecording}
          />
        )}

        {currentScreen === 'STUDIO_ANALYZING' && (
          <AnalyzingSpeechPage onBack={() => setCurrentScreen('STUDIO_RECORDING')} />
        )}

        {currentScreen === 'RESULTS_OVERVIEW' && currentEvaluation && (
          <ResultsOverviewPage
            evaluation={currentEvaluation}
            onBack={() => (user ? setCurrentScreen('DASHBOARD') : setCurrentScreen('LANDING'))}
            onViewDetailedFeedback={() => setCurrentScreen('DETAILED_FEEDBACK')}
          />
        )}

        {currentScreen === 'DETAILED_FEEDBACK' && currentEvaluation && (
          <DetailedFeedbackPage
            evaluation={currentEvaluation}
            onBack={() => setCurrentScreen('RESULTS_OVERVIEW')}
            onFinishReview={() => setCurrentScreen('PRACTICE_COMPLETE')}
          />
        )}

        {currentScreen === 'PRACTICE_COMPLETE' && (
          <PracticeCompletePage
            user={user}
            onPracticeAgain={() => {
              if (isDemoSession && demoTestsCount >= 1) {
                openAuth(
                  'signup',
                  'Save Your Score & Practice Again',
                  'Create a free account to save your report and unlock unlimited practice sessions.'
                );
              } else {
                setCurrentScreen('STUDIO_RECORDING');
              }
            }}
            onChooseNewTopic={() => {
              if (isDemoSession && demoTestsCount >= 1) {
                openAuth(
                  'signup',
                  'Unlock All Speaking Topics',
                  'Create a free account to explore all IELTS, TOEFL, and Conversational topics.'
                );
              } else {
                setCurrentScreen('DASHBOARD');
              }
            }}
            onViewHistory={() => setIsHistoryOpen(true)}
            onBackToHome={() => (user ? setCurrentScreen('DASHBOARD') : setCurrentScreen('LANDING'))}
            onOpenAuth={(mode) =>
              openAuth(
                mode,
                'Save Your Speaking Score',
                'Create a free account to save your evaluation and keep your streak going!'
              )
            }
          />
        )}
      </main>

      {/* 3. Global Practice History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectEvaluation={(evalItem) => {
          setCurrentEvaluation(evalItem);
          setIsHistoryOpen(false);
          setCurrentScreen('RESULTS_OVERVIEW');
        }}
      />

      {/* 4. Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        customTitle={authModalTitle}
        customSubtitle={authModalSubtitle}
      />
    </div>
  );
};
