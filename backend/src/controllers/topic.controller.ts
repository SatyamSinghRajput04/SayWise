import { Request, Response } from 'express';
import { topicRepository } from '../repositories/topic.repository.js';

export const getTopics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topics = await topicRepository.getAll();
    res.json({ success: true, data: topics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

export const getTopicById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const topic = await topicRepository.getById(id);
    if (!topic) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Topic not found' } });
      return;
    }
    res.json({ success: true, data: topic });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
