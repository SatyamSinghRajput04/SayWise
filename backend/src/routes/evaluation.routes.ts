import { Router } from 'express';
import { submitEvaluation, getEvaluationById, getUserEvaluations } from '../controllers/evaluation.controller.js';
import { uploadAudio } from '../middleware/upload.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/submit', authMiddleware, uploadAudio.single('audio'), submitEvaluation);
router.get('/history', authMiddleware, getUserEvaluations);
router.get('/:id', getEvaluationById);

export default router;
