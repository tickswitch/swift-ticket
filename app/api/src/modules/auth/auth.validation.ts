import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  phone: z.string().max(255).optional(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().or(z.number()),
});

export const resetPasswordSchema = z.object({
  remember_token: z.string(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
});

export const sendPhoneOtpSchema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian mobile number'),
});

export const verifyPhoneOtpSchema = z.object({
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const sendEmailOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyEmailOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
