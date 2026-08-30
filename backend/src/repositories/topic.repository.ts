import { Topic } from '../types/index.js';

export const DEFAULT_TOPICS: Topic[] = [
  {
    id: 'topic-travel',
    category: 'Travel',
    title: 'Travel Experiences',
    prompt: 'Describe a memorable journey you took or a place you would love to visit. Explain why it was significant to you.',
    prompts: [
      'Describe a memorable journey you took or a place you would love to visit. Explain why it was significant to you.',
      'Talk about an unexpected adventure or cultural surprise you experienced while traveling away from home.',
      'If you could live in any city in the world for one full year, where would you go, what local traditions would you explore, and why?',
      'Describe your ideal vacation: would you prefer exploring a bustling historic metropolis or relaxing in isolated natural landscapes? Give reasons.',
      'Discuss a local dish or culinary experience from a trip that left a lasting impression on your taste and memory.'
    ],
    description: 'Share your travel stories, dream destinations, and adventures',
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
    prompts: [
      'Discuss an important skill or academic subject you learned. How has it influenced your personal or professional life?',
      'Talk about a mentor, teacher, or book that fundamentally transformed the way you approach problem-solving and critical thinking.',
      'Describe a time you struggled to learn a complex concept (such as programming, math, or a language) and how you persevered through frustration.',
      'If you could instantly download and master any complex domain or art form overnight, what would you choose and how would you apply it?',
      'Do you believe self-directed online learning will eventually replace traditional university degrees? Defend your perspective.'
    ],
    description: 'Talk about your skills, mentors, and academic breakthroughs',
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
    prompts: [
      'How do you think artificial intelligence and automation will reshape workplace dynamics and daily life over the next decade?',
      'Discuss the ethical dilemmas of autonomous robots and smart AI assistants operating inside our private homes.',
      'Would you ever participate in a mission to colonize Mars or travel to orbit if commercial spaceflight became affordable? Why or why not?',
      'What is one science fiction technology or invention you wish existed today, and how would it solve a major global problem?',
      'How has social media altered human relationships and attention spans, and what boundaries should we set for our digital well-being?'
    ],
    description: 'Explore AI, space colonization, robotics, and futuristic innovations',
    icon: 'Monitor',
    targetWordCount: { min: 100, max: 200 },
    targetTimeSeconds: 90,
    difficulty: 'Advanced',
  },
  {
    id: 'topic-work-career',
    category: 'Work & Career',
    title: 'Your Dream Job & Leadership',
    prompt: 'Talk about your ideal career or dream job. What responsibilities would it entail, and why is it appealing to you?',
    prompts: [
      'Talk about your ideal career or dream job. What responsibilities would it entail, and why is it appealing to you?',
      'If you were to launch your own tech startup tomorrow, what core problem would you tackle and what culture would you build for your team?',
      'Describe the single most vital quality of an inspiring leader, and provide a real-world or historical example.',
      'What does healthy work-life balance mean to you, and how do you prioritize between high career ambitions and personal health?',
      'Describe an ideal project team: would you prefer working with specialists who do one thing perfectly, or versatile generalists? Explain.'
    ],
    description: 'Discuss dream professions, entrepreneurship, and leadership',
    icon: 'Briefcase',
    targetWordCount: { min: 100, max: 200 },
    targetTimeSeconds: 90,
    difficulty: 'Intermediate',
  },
  {
    id: 'topic-random',
    category: 'Random Topic',
    title: 'Pop Culture, Sports & Challenges',
    prompt: 'Talk about a movie or television series that had a deep emotional impact on you. What made the storytelling memorable?',
    prompts: [
      'Talk about a movie or television series that had a deep emotional impact on you. What made the storytelling memorable?',
      'Describe an iconic sports match, tournament, or comeback victory that inspired you with its display of teamwork and grit.',
      'If you could spend 24 hours inside the fictional world of any movie, video game, or novel, which universe would you choose and what would you do?',
      'Describe a time you faced intense stage fright or nervousness speaking before a crowd, and how you handled the adrenaline.',
      'What is a song, musical genre, or soundtrack that motivates you to focus and conquer challenging goals? Explain why it resonates with you.'
    ],
    description: 'Engaging challenges on movies, series, sports, and personal grit',
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
