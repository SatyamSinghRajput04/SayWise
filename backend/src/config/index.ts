import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  groqApiKey: process.env.GROQ_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'saywise_jwt_secret_production_fallback',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
};
