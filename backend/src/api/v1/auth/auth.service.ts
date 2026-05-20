import crypto from 'crypto';

import { RefreshToken } from '../../../models/token.model';
import { User } from '../../../models/user.model';
import { TokenPair } from '../../../types';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../../utils/email';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
} from '../../../utils/jwt';
import { AppError } from '../../../middleware/error.middleware';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: InstanceType<typeof User>; tokens: TokenPair }> => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError('Email is already registered', 409);

  const user = await User.create(data);

  const tokens = await generateTokenPair(user);

  sendWelcomeEmail(user.email, user.name).catch(() => undefined);

  return { user, tokens };
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<{ user: InstanceType<typeof User>; tokens: TokenPair }> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Invalid email or password', 401);

  if (!user.isActive) throw new AppError('Account is deactivated. Contact support.', 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const tokens = await generateTokenPair(user);

  return { user, tokens };
};

export const refreshTokens = async (
  token: string,
): Promise<TokenPair> => {
  const payload = verifyRefreshToken(token);

  const storedToken = await RefreshToken.findOne({ token, userId: payload.sub });
  if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new AppError('User not found or inactive', 401);

  // Rotate: revoke old token
  await RefreshToken.findByIdAndUpdate(storedToken._id, { isRevoked: true });

  return generateTokenPair(user);
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) return; // Silent — don't reveal if email exists

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail(email, resetToken);
};

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<void> => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw new AppError('Invalid or expired reset token', 400);

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Revoke all existing refresh tokens for this user
  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
};

const generateTokenPair = async (
  user: InstanceType<typeof User>,
): Promise<TokenPair> => {
  const payload = { sub: user._id.toString(), email: user.email, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: getRefreshTokenExpiryDate(),
  });

  return { accessToken, refreshToken };
};
