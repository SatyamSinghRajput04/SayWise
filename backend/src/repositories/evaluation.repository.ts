import fs from 'fs';
import path from 'path';
import { EvaluationResult } from '../types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const EVALS_FILE = path.join(DATA_DIR, 'evaluations.json');

export class EvaluationRepository {
  private evaluations: Map<string, EvaluationResult> = new Map();

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      if (fs.existsSync(EVALS_FILE)) {
        const raw = fs.readFileSync(EVALS_FILE, 'utf-8');
        const list: EvaluationResult[] = JSON.parse(raw);
        list.forEach((e) => this.evaluations.set(e.id, e));
      }
    } catch (e) {
      console.warn('Evaluation storage init notice:', e);
    }
  }

  private persistToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      const data = JSON.stringify(Array.from(this.evaluations.values()), null, 2);
      fs.writeFileSync(EVALS_FILE, data, 'utf-8');
    } catch (e) {
      console.error('Disk write error for evaluations:', e);
    }
  }

  async save(evaluation: EvaluationResult): Promise<EvaluationResult> {
    this.evaluations.set(evaluation.id, evaluation);
    this.persistToDisk();
    return evaluation;
  }

  async getById(id: string): Promise<EvaluationResult | null> {
    return this.evaluations.get(id) || null;
  }

  async getByUserId(userId: string): Promise<EvaluationResult[]> {
    return Array.from(this.evaluations.values())
      .filter((e) => e.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const evaluationRepository = new EvaluationRepository();
