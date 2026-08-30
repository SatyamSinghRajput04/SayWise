import { Topic, EvaluationResult, User } from '../types/index.js';

// Read API base URL from Vite environment variable with safe fallback
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Server error (${res.status}): ${text.slice(0, 100)}`);
  }

  if (!res.ok || json.success === false) {
    const errorMsg = json?.error?.message || json?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

// Built-in fallback topics in case of network latency
const FALLBACK_TOPICS: Topic[] = [
  {
    id: 'ielts_tech_01',
    category: 'Technology',
    title: 'Technology & Daily Life',
    prompt: 'Discuss a piece of technology you use every day and how it has changed the way you live or work.',
    description: 'Explain its impact, advantages, and whether you could live without it.',
    icon: '💻',
    targetWordCount: { min: 120, max: 180 },
    targetTimeSeconds: 60,
    difficulty: 'Intermediate',
  },
  {
    id: 'work_intro_01',
    category: 'Work & Career',
    title: 'Professional Self-Introduction',
    prompt: 'Introduce yourself in a professional setting, summarizing your background, core strengths, and goals.',
    description: 'Focus on clear structural articulation, professional register, and confident delivery.',
    icon: '💼',
    targetWordCount: { min: 130, max: 200 },
    targetTimeSeconds: 75,
    difficulty: 'Advanced',
  },
  {
    id: 'toefl_edu_01',
    category: 'Education',
    title: 'The Future of Online Learning',
    prompt: 'Do you believe online learning will completely replace traditional classroom universities? Give reasons.',
    description: 'Structure your argument with clear examples and cohesive linking phrases.',
    icon: '🎓',
    targetWordCount: { min: 120, max: 180 },
    targetTimeSeconds: 60,
    difficulty: 'Intermediate',
  },
  {
    id: 'travel_01',
    category: 'Travel',
    title: 'An Unforgettable Travel Destination',
    prompt: 'Describe a memorable place or city you have visited and what made that trip special for you.',
    description: 'Talk about the people, food, scenery, and your personal feelings.',
    icon: '✈️',
    targetWordCount: { min: 100, max: 150 },
    targetTimeSeconds: 50,
    difficulty: 'Beginner',
  },
];

export const api = {
  async getTopics(): Promise<Topic[]> {
    try {
      const res = await fetch(`${API_BASE}/topics`);
      const data = await parseResponse<Topic[]>(res);
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_TOPICS;
    } catch (e) {
      console.warn('API getTopics fallback active:', e);
      return FALLBACK_TOPICS;
    }
  },

  async loginGuest(name?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return parseResponse<{ token: string; user: User }>(res);
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return parseResponse<{ token: string; user: User }>(res);
  },

  async register(email: string, password: string, displayName?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });
    return parseResponse<{ token: string; user: User }>(res);
  },

  async loginGoogle(profile: { email: string; displayName?: string; photoURL?: string }): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return parseResponse<{ token: string; user: User }>(res);
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return parseResponse<User>(res);
  },

  async submitAudioEvaluation(formData: FormData, token?: string): Promise<EvaluationResult> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/evaluations/submit`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return parseResponse<EvaluationResult>(res);
  },

  async getEvaluationHistory(token?: string): Promise<EvaluationResult[]> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/evaluations/history`, { headers });
      const data = await parseResponse<EvaluationResult[]>(res);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
};
