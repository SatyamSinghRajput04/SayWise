import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import authRoutes from './routes/auth.routes.js';
import topicRoutes from './routes/topic.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();

// Security & Robust Dynamic CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any origin dynamically (including all Vercel preview/production domains & localhost)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'SayWise Speaking Evaluation API',
    aiProvider: config.groqApiKey ? 'Groq (Whisper v3 + Llama 3.3 70B)' : 'Dynamic Algorithmic Linguistic Engine (Offline Fallback)',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 SayWise API running on http://localhost:${config.port} [${config.nodeEnv}]`);
});

export default app;
