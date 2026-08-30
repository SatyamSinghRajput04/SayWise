import { Request, Response } from 'express';
import fs from 'fs';
import { evaluationService } from '../services/evaluation.service.js';
import { evaluationRepository } from '../repositories/evaluation.repository.js';

export const submitEvaluation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'usr_demo';
    const topicId = req.body.topicId || 'topic-work-career';
    const transcriptInput = req.body.transcript || '';
    const durationSeconds = req.body.durationSeconds ? parseFloat(req.body.durationSeconds) : 0;
    const filePath = req.file?.path;

    const evaluation = await evaluationService.evaluateSubmission({
      userId,
      topicId,
      filePath,
      transcriptInput,
      durationSeconds,
    });

    // Cleanup uploaded temp file
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }

    res.json({ success: true, data: evaluation });
  } catch (err: any) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'EVALUATION_ERROR',
        message: err.message || 'Evaluation failed',
      },
    });
  }
};

export const getEvaluationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const evaluation = await evaluationRepository.getById(id);
    if (!evaluation) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Evaluation not found' } });
      return;
    }
    res.json({ success: true, data: evaluation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

export const getUserEvaluations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id || 'usr_demo';
    const history = await evaluationRepository.getByUserId(userId);
    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
