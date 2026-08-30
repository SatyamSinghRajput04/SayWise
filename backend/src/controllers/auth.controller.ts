import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { userRepository } from '../repositories/user.repository.js';

export const loginAsGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body || {};
    const result = await authService.loginAsGuest(name);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'AUTH_ERROR', message: err.message } });
  }
};

export const loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, displayName, photoURL } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email is required' } });
      return;
    }
    const result = await authService.loginWithGoogle({ email, displayName, photoURL });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'GOOGLE_AUTH_ERROR', message: err.message } });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } });
      return;
    }
    const result = await authService.register(email, password, displayName);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: 'REGISTER_ERROR', message: err.message } });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } });
      return;
    }
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: err.message } });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const reqUser = (req as any).user;
  if (!reqUser) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No active session' } });
    return;
  }

  let user = reqUser.id ? await userRepository.findById(reqUser.id) : null;
  if (!user && reqUser.email) {
    user = await userRepository.findByEmail(reqUser.email);
  }

  if (user) {
    const { passwordHash, ...sanitized } = user;
    res.json({ success: true, data: sanitized });
    return;
  }

  // If valid OAuth/JWT token for a user not yet persisted in local disk DB
  const fallbackUser = {
    id: reqUser.id || 'usr_oauth',
    email: reqUser.email || 'user@saywise.ai',
    displayName: reqUser.displayName || reqUser.email?.split('@')[0] || 'Member',
    authProvider: 'google' as const,
    createdAt: new Date().toISOString(),
    stats: { totalEvaluations: 0, averageOverallScore: 0, currentStreakDays: 0 },
  };

  res.json({ success: true, data: fallbackUser });
};
