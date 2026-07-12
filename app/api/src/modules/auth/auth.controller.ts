import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { successResponse, errorResponse } from '../../utils/response';
import { authService } from './auth.service';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  resendOtpSchema,
  sendPhoneOtpSchema,
  verifyPhoneOtpSchema,
  sendEmailOtpSchema,
  verifyEmailOtpSchema,
} from './auth.validation';

const register = catchAsync(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  const avatarPath = req.file
    ? `avatars/${req.file.filename}`
    : undefined;

  const { user, token } = await authService.register(parsed.data, avatarPath);

  return res.status(201).json({
    status: true,
    message: 'User Successfully Registered',
    code: 201,
    token_type: 'bearer',
    token,
    userData: user,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 403);
  }

  const { user, token } = await authService.login(parsed.data);

  return res.status(200).json({
    status: true,
    message: 'User logged in successfully.',
    token,
    userData: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar
        ? `${process.env.APP_URL}/uploads/${user.avatar}`
        : null,
    },
    token_type: 'Bearer',
    code: 200,
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  // JWT is stateless — client discards the token
  return successResponse(res, null, 'Successfully logged out');
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  const result = await authService.forgotPassword(parsed.data.email);

  return res.status(200).json({
    status: true,
    message: 'If an account exists for this email, an OTP has been sent.',
    // OTP is delivered by email. Never expose it in the HTTP response in a
    // real environment — only surface it in local development for testing.
    ...(process.env.NODE_ENV === 'development' ? { otp: result.otp } : {}),
    email: result.email,
    code: '200',
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  const result = await authService.verifyOtp(parsed.data.email, String(parsed.data.otp));

  return res.status(200).json({
    status: true,
    message: 'OTP verified successfully.',
    remember_token: result.remember_token,
    code: 200,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  await authService.resetPassword(parsed.data.remember_token, parsed.data.password);

  return res.status(200).json({
    status: true,
    message: 'Password reset successfully.',
    code: 200,
  });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const parsed = resendOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  const result = await authService.resendOtp(parsed.data.email);

  return res.status(200).json({
    status: true,
    message: 'If an account exists for this email, an OTP has been sent.',
    ...(process.env.NODE_ENV === 'development' ? { otp: result.otp } : {}),
    email: result.email,
    code: '200',
  });
});

const sendPhoneOtp = catchAsync(async (req: Request, res: Response) => {
  const parsed = sendPhoneOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  await authService.sendPhoneOtp(parsed.data.phone);

  return res.status(200).json({
    success: true,
    message: 'OTP sent',
  });
});

const verifyPhoneOtp = catchAsync(async (req: Request, res: Response) => {
  const parsed = verifyPhoneOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  const { user, token } = await authService.verifyPhoneOtp(parsed.data.phone, parsed.data.otp);

  return res.status(200).json({
    status: true,
    message: 'Phone login successful.',
    token,
    userData: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      avatar: user.avatar
        ? `${process.env.APP_URL}/uploads/${user.avatar}`
        : null,
    },
    token_type: 'Bearer',
    code: 200,
  });
});

const sendEmailOtp = catchAsync(async (req: Request, res: Response) => {
  const parsed = sendEmailOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  await authService.sendEmailOtp(parsed.data.email);

  return res.status(200).json({
    status: true,
    message: 'OTP sent to your email.',
    code: 200,
  });
});

const verifyEmailOtp = catchAsync(async (req: Request, res: Response) => {
  const parsed = verifyEmailOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }

  const { user, token } = await authService.verifyEmailOtp(parsed.data.email, parsed.data.otp);

  return res.status(200).json({
    status: true,
    message: 'Login successful.',
    token,
    userData: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar
        ? `${process.env.APP_URL}/uploads/${user.avatar}`
        : null,
    },
    token_type: 'Bearer',
    code: 200,
  });
});

export const authController = {
  register,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendEmailOtp,
  verifyEmailOtp,
};
