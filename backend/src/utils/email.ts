import nodemailer from 'nodemailer';

import { config } from '../config';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Fullstack App" <${config.email.from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    logger.info(`Email sent to ${options.to}: ${options.subject}`);
  } catch (error) {
    logger.error('Failed to send email', { error, to: options.to });
    throw new Error('Email delivery failed');
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${config.client.url}/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password.</p>
        <p>This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;
                  text-decoration:none;border-radius:6px;margin:16px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
        <hr />
        <small>Or copy this link: ${resetUrl}</small>
      </div>
    `,
    text: `Reset your password at: ${resetUrl}`,
  });
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Welcome to Fullstack App!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <a href="${config.client.url}/login"
           style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;
                  text-decoration:none;border-radius:6px;margin:16px 0;">
          Get Started
        </a>
      </div>
    `,
  });
};
