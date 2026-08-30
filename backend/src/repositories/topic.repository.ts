import { Topic } from '../types/index.js';

export const DEFAULT_TOPICS: Topic[] = [
  {
    id: 'topic-travel',
    category: 'Travel',
    title: 'Travel Experiences',
    prompt: 'Describe a memorable journey you took or a place you would love to visit. Explain why it was significant to you.',
    description: 'Share your travel experiences',
    icon: 'Plane',
    targetWordCount: { min: 100, max: 200 },
    targetTimeSeconds: 90,
    difficulty: 'Beginner',
  },
  {
    id: 'topic-education',
    category: 'Education',
    title: 'Learning Journey',
    prompt: 'Discuss an important skill or academic subject you learned. How has it influenced your personal or professional life?',
    description: 'Talk about your learning journey',
    icon: 'GraduationCap',
    targetWordCount: { min: 100, max: 200 },
    targetTimeSeconds: 90,
    difficulty: 'Intermediate',
  },
  {
    id: 'topic-technology',
    category: 'Technology',
    title: 'The Future of Technology',
    prompt: 'How do you think artificial intelligence and automation will reshape workplace dynamics and daily life over the next decade?',
    description: 'The future of technology',
    icon: 'Monitor',
    targetWordCount: { min: 100, max: 200 },
    targetTimeSeconds: 90,
    difficulty: 'Advanced',
  },
  {
    id: 'topic-work-career',
    category: 'Work & Career',
    title: 'Your Dream Job',
    prompt: 'Talk about your ideal career or dream job. What responsibilities would it entail, and why is it appealing to you?',
    description: 'Your dream job',
    icon: 'Briefcase',
    targetWordCount: { min: 100, max: 200 },
    targetTimeSeconds: 90,
    difficulty: 'Intermediate',
  },
  {
    id: 'topic-random',
    category: 'Random Topic',
    title: 'Overcoming Challenges',
    prompt: 'Describe a challenging situation you faced in life or work, how you handled it, and what lessons you took away from the experience.',
    description: 'Surprise me!',
    icon: 'Sparkles',
    targetWordCount: { min: 100, max: 200 },
    targetTimeSeconds: 90,
    difficulty: 'Intermediate',
  },
];

export class TopicRepository {
  private topics: Map<string, Topic> = new Map();

  constructor() {
    DEFAULT_TOPICS.forEach((t) => this.topics.set(t.id, t));
  }

  async getAll(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getById(id: string): Promise<Topic | null> {
    return this.topics.get(id) || null;
  }
}

export const topicRepository = new TopicRepository();
