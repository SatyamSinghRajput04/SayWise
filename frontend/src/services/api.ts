import { Topic, EvaluationResult, User } from '../types/index.js';

const API_BASE = '/api';

export const api = {
  async getTopics(): Promise<Topic[]> {
    const res = await fetch(`${API_BASE}/topics`);
    const json = await res.json();
    return json.data || [];
  },

  async loginGuest(name?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Guest login failed');
    return json.data;
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Login failed');
    return json.data;
  },

  async register(email: string, password: string, displayName?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Registration failed');
    return json.data;
  },

  async loginGoogle(profile: { email: string; displayName?: string; photoURL?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Google login failed');
    return json.data;
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Failed to fetch user');
    return json.data;
  },

  async submitAudioEvaluation(formData: FormData, token?: string): Promise<EvaluationResult> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/evaluations/submit`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error?.message || 'Evaluation failed');
    return json.data;
  },

  async getEvaluationHistory(token?: string): Promise<EvaluationResult[]> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/evaluations/history`, { headers });
    const json = await res.json();
    return json.data || [];
  },
};
