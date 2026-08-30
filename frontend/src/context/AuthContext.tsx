import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';
import { firebaseAuthService } from '../config/firebase.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  demoTestsCount: number;
  isDemoSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  loginAsGuest: (name?: string) => Promise<void>;
  loginWithGoogle: (profile?: { email: string; displayName?: string; photoURL?: string }) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  recordDemoTestCompleted: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('saywise_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('saywise_token');
    } catch {
      return null;
    }
  });

  const [demoTestsCount, setDemoTestsCount] = useState<number>(() => {
    try {
      const count = sessionStorage.getItem('saywise_demo_tests');
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const isDemoSession = !user || user.authProvider === 'guest';

  const saveSession = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem('saywise_token', newToken);
      localStorage.setItem('saywise_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      try {
        const fbData = await firebaseAuthService.login(email, password);
        saveSession(fbData.token, fbData.user);
        api.login(email, password).catch(() => {});
        return;
      } catch (fbErr: any) {
        console.warn('Firebase login attempt, checking server fallback:', fbErr.message);
      }
      const data = await api.login(email, password);
      saveSession(data.token, data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      try {
        const fbData = await firebaseAuthService.register(email, password, displayName || '');
        saveSession(fbData.token, fbData.user);
        api.register(email, password, displayName).catch(() => {});
        return;
      } catch (fbErr: any) {
        console.warn('Firebase register attempt, checking server fallback:', fbErr.message);
      }
      const data = await api.register(email, password, displayName);
      saveSession(data.token, data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async (name?: string) => {
    setIsLoading(true);
    try {
      const data = await api.loginGuest(name || 'Alex');
      saveSession(data.token, data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (profile?: { email: string; displayName?: string; photoURL?: string }) => {
    setIsLoading(true);
    try {
      try {
        const fbData = await firebaseAuthService.loginWithGoogle();
        saveSession(fbData.token, fbData.user);
        api.loginGoogle(fbData.user).catch(() => {});
        return;
      } catch (fbErr: any) {
        console.warn('Firebase Google sign-in fallback:', fbErr.message);
      }
      const payload = profile || {
        email: 'alex.johnson@gmail.com',
        displayName: 'Alex Johnson',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
      const data = await api.loginGoogle(payload);
      saveSession(data.token, data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      await firebaseAuthService.sendPasswordReset(email);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    firebaseAuthService.logout().catch(() => {});
    try {
      localStorage.removeItem('saywise_token');
      localStorage.removeItem('saywise_user');
      sessionStorage.removeItem('saywise_demo_tests');
      setDemoTestsCount(0);
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }
  };

  const recordDemoTestCompleted = () => {
    setDemoTestsCount((prev) => {
      const next = prev + 1;
      try {
        sessionStorage.setItem('saywise_demo_tests', next.toString());
      } catch (e) {
        console.warn('SessionStorage save error:', e);
      }
      return next;
    });
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const updated = await api.getMe(token);
      if (updated && updated.email) {
        setUser(updated);
        try {
          localStorage.setItem('saywise_user', JSON.stringify(updated));
        } catch {}
      }
    } catch (e) {
      console.warn('Session refresh warning:', e);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        demoTestsCount,
        isDemoSession,
        login,
        register,
        loginAsGuest,
        loginWithGoogle,
        sendPasswordReset,
        logout,
        refreshUser,
        recordDemoTestCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
