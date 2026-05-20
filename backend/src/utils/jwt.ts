import jwt from 'jsonwebtoken';

import { config } from '../config';
import { JwtPayload, UserRole } from '../types';

export const signAccessToken = (payload: { sub: string; email: string; role: UserRole }): string => {
  return jwt.sign({ ...payload, type: 'access' }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

export const signRefreshToken = (payload: {
  sub: string;
  email: string;
  role: UserRole;
}): string => {
  return jwt.sign({ ...payload, type: 'refresh' }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};

export const getRefreshTokenExpiryDate = (): Date => {
  const days = parseInt(config.jwt.refreshExpiresIn.replace('d', ''), 10);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
