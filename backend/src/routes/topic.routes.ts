import { Router } from 'express';
import { getTopics, getTopicById } from '../controllers/topic.controller.js';

const router = Router();

router.get('/', getTopics);
router.get('/:id', getTopicById);

export default router;
