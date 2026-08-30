import fs from 'fs';
import path from 'path';
import { User } from '../types/index.js';

export interface UserRecord extends User {
  passwordHash?: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export class UserRepository {
  private users: Map<string, UserRecord> = new Map();

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        const list: UserRecord[] = JSON.parse(raw);
        list.forEach((u) => this.users.set(u.id, u));
      }
    } catch (e) {
      console.warn('Persistent storage init notice:', e);
    }

    if (!this.users.has('usr_demo')) {
      this.save({
        id: 'usr_demo',
        email: 'alex@saywise.ai',
        displayName: 'Alex',
        passwordHash: '$2a$10$wN3dD1.O5k1B81g6k6k6ee7n1/q7k6k6k6k6k6k6k6k6k6k6k6k6k',
        authProvider: 'guest',
        createdAt: new Date().toISOString(),
        stats: { totalEvaluations: 4, averageOverallScore: 82, currentStreakDays: 3 },
      });
    }
  }

  private persistToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      const data = JSON.stringify(Array.from(this.users.values()), null, 2);
      fs.writeFileSync(USERS_FILE, data, 'utf-8');
    } catch (e) {
      console.error('Disk write error for users:', e);
    }
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.users.get(id) || null;
  }

  async getById(id: string): Promise<UserRecord | null> {
    return this.findById(id);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const clean = email.trim().toLowerCase();
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === clean) || null;
  }

  async save(user: UserRecord): Promise<UserRecord> {
    this.users.set(user.id, user);
    this.persistToDisk();
    return user;
  }

  async updateStats(userId: string, stats: { totalEvaluations: number; averageOverallScore: number; currentStreakDays: number }): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.stats = stats;
      this.save(user);
    }
  }
}

export const userRepository = new UserRepository();
