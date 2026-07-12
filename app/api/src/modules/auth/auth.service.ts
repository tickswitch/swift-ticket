import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError';
import { generateToken } from '../../middleware/auth';
import { sendMail } from '../../config/mail';
import { authRepository } from './auth.repository';
import type { RegisterInput, LoginInput } from './auth.validation';

// Pending email-OTP logins for emails with NO account yet. Verify-then-create:
// the User row is only created once the OTP is confirmed, so an unverified
// email never leaves a DB row behind.
// ponytail: in-memory (fine for single-instance Render free tier + 5-min TTL);
// move to Redis/a table if the API ever runs multiple instances.
const pendingEmailOtps = new Map<string, { otp: string; expiresAt: number }>();

const sweepExpiredOtps = () => {
  const now = Date.now();
  for (const [email, entry] of pendingEmailOtps) {
    if (entry.expiresAt < now) pendingEmailOtps.delete(email);
  }
};

const register = async (payload: RegisterInput, avatarPath?: string) => {
  // Check if email already exists
  const existing = await authRepository.findByEmail(payload.email);
  if (existing) {
    throw new AppError('The email has already been taken.', 422);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await authRepository.create({
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? null,
    password: hashedPassword,
    avatar: avatarPath ?? null,
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return { user, token };
};

const login = async (payload: LoginInput) => {
  const user = await authRepository.findByEmail(payload.email);
  if (!user) {
    throw new AppError('Incorrect credentials, please try again.', 403);
  }

  const passwordMatch = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatch) {
    throw new AppError('Incorrect credentials, please try again.', 403);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return { user, token };
};

const forgotPassword = async (email: string) => {
  const user = await authRepository.findByEmail(email);
  // Do not reveal whether the email exists (account enumeration). Return a
  // generic result; the controller responds identically either way.
  if (!user) {
    return { otp: undefined, email };
  }

  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await authRepository.updateById(user.id, {
    otp,
    otp_expiration: otpExpiration,
  });

  const body = `Hello,\n\nWe have received a request to reset your password.\n\nYour One-Time Password (OTP) for password reset is:\n\n${otp}\n\nThis OTP is valid for 5 minutes. If you did not make this request, please ignore this email.`;

  await sendMail(user.email, 'Reset Password OTP', body);

  return { otp, email: user.email };
};

const verifyOtp = async (email: string, otp: string) => {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user.otp !== String(otp)) {
    throw new AppError('Invalid OTP or OTP has expired.', 403);
  }

  if (!user.otp_expiration || new Date() > user.otp_expiration) {
    throw new AppError('Invalid OTP or OTP has expired.', 403);
  }

  // Generate reset token; reuse otp_expiration as the reset-token expiry
  // window (15 min) so a leaked/stale token cannot reset a password forever.
  const rememberToken = await bcrypt.hash(user.email + Date.now(), 10);
  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await authRepository.updateById(user.id, {
    remember_token: rememberToken,
    otp: null,
    otp_expiration: resetTokenExpiry,
  });

  return { remember_token: rememberToken };
};

const resetPassword = async (rememberToken: string, password: string) => {
  const user = await authRepository.findByRememberToken(rememberToken);
  if (!user) {
    throw new AppError('Invalid or expired remember token.', 403);
  }

  if (!user.otp_expiration || new Date() > user.otp_expiration) {
    throw new AppError('Reset link has expired. Please request a new one.', 403);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await authRepository.updateById(user.id, {
    password: hashedPassword,
    remember_token: null,
    otp_expiration: null,
  });
};

const resendOtp = async (email: string) => {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    return { otp: undefined, email };
  }

  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

  await authRepository.updateById(user.id, {
    otp,
    otp_expiration: otpExpiration,
  });

  const body = `Hello,\n\nWe have received a request to reset your password.\n\nYour One-Time Password (OTP) for password reset is:\n\n${otp}\n\nThis OTP is valid for 5 minutes. If you did not make this request, please ignore this email.`;

  await sendMail(user.email, 'Reset Password OTP', body);

  return { otp, email: user.email };
};

const sendPhoneOtp = async (phone: string) => {
  // Generate 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  let user = await authRepository.findByPhone(phone);
  if (user) {
    await authRepository.updateById(user.id, {
      otp,
      otp_expiration: otpExpiration,
    });
  } else {
    // Pre-create a shell user keyed on phone so OTP can be stored
    const placeholderEmail = `${phone.replace(/[^0-9]/g, '')}@phone.swifttickets.local`;
    const placeholderPassword = await bcrypt.hash(`phone-${phone}-${Date.now()}`, 10);
    user = await authRepository.create({
      name: `User ${phone.slice(-4)}`,
      email: placeholderEmail,
      phone,
      password: placeholderPassword,
      avatar: null,
      otp,
      otp_expiration: otpExpiration,
    });
  }

  console.log('OTP for', phone, ':', otp);

  return { phone };
};

const sendEmailOtp = async (email: string) => {
  sweepExpiredOtps();

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

  const user = await authRepository.findByEmail(email);
  if (user) {
    // Existing account — store the OTP on their row (legitimate user).
    await authRepository.updateById(user.id, { otp, otp_expiration: otpExpiration });
  } else {
    // New email — hold the OTP in memory only. No DB row until verified.
    pendingEmailOtps.set(email, { otp, expiresAt: otpExpiration.getTime() });
  }

  const greetingName = user?.name ?? email.split('@')[0];
  const body = `Hello ${greetingName},\n\nYour SwiftTickets login OTP is:\n\n${otp}\n\nThis code expires in 5 minutes. If you didn't request this, you can safely ignore this email.`;
  await sendMail(email, 'Your SwiftTickets Login OTP', body);

  return { email };
};

const verifyEmailOtp = async (email: string, otp: string) => {
  sweepExpiredOtps();

  const existing = await authRepository.findByEmail(email);

  if (existing) {
    // Existing account — verify against the OTP stored on their row.
    if (existing.otp !== String(otp)) {
      throw new AppError('Invalid OTP or OTP has expired.', 403);
    }
    if (!existing.otp_expiration || new Date() > existing.otp_expiration) {
      throw new AppError('Invalid OTP or OTP has expired.', 403);
    }

    await authRepository.updateById(existing.id, { otp: null, otp_expiration: null });

    const token = generateToken({
      id: existing.id,
      email: existing.email,
      role: existing.role,
      name: existing.name,
    });
    return { user: existing, token };
  }

  // New email — verify against the in-memory pending OTP, then create the
  // account. This is the verify-then-create step: no row exists until now.
  const pending = pendingEmailOtps.get(email);
  if (!pending || pending.otp !== String(otp) || pending.expiresAt < Date.now()) {
    throw new AppError('Invalid OTP or OTP has expired.', 403);
  }

  const placeholderPassword = await bcrypt.hash(`email-otp-${email}-${Date.now()}`, 10);
  const user = await authRepository.create({
    name: email.split('@')[0],
    email,
    phone: null,
    password: placeholderPassword,
    avatar: null,
  });
  pendingEmailOtps.delete(email);

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return { user, token };
};

const verifyPhoneOtp = async (phone: string, otp: string) => {
  const user = await authRepository.findByPhone(phone);
  if (!user) {
    throw new AppError('Invalid OTP or OTP has expired.', 403);
  }

  if (user.otp !== String(otp)) {
    throw new AppError('Invalid OTP or OTP has expired.', 403);
  }

  if (!user.otp_expiration || new Date() > user.otp_expiration) {
    throw new AppError('Invalid OTP or OTP has expired.', 403);
  }

  // Clear OTP fields
  await authRepository.updateById(user.id, {
    otp: null,
    otp_expiration: null,
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return { user, token };
};

export const authService = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendEmailOtp,
  verifyEmailOtp,
};
