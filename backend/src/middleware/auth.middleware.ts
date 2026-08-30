import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // 1. Try local server-issued JWT verification
      const decoded = jwt.verify(token, config.jwtSecret);
      (req as any).user = decoded;
    } catch (_) {
      try {
        // 2. Decode Firebase/Google OAuth JWT payload safely
        const decoded = jwt.decode(token) as any;
        if (decoded && (decoded.user_id || decoded.sub || decoded.email)) {
          (req as any).user = {
            id: decoded.user_id || decoded.sub || 'usr_oauth',
            email: decoded.email,
            displayName: decoded.name || decoded.displayName || decoded.email?.split('@')[0],
          };
        } else {
          (req as any).user = null;
        }
      } catch {
        (req as any).user = null;
      }
    }
  } else {
    (req as any).user = null;
  }
  next();
};
