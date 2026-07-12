import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { avatarUpload, uploadNone } from '../../utils/fileUpload';
import rateLimit from 'express-rate-limit';

const router = Router();

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { status: false, message: 'Too many requests, please try again later.' },
});

// Throttle credential + OTP guessing (login and any verify/reset endpoint).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { status: false, message: 'Too many attempts, please try again later.' },
});

router.post('/register', avatarUpload.single('avatar'), authController.register);
router.post('/login', authLimiter, uploadNone, authController.login);
router.post('/forgot-password', otpLimiter, uploadNone, authController.forgotPassword);
router.post('/verify-otp', authLimiter, uploadNone, authController.verifyOtp);
router.post('/reset-password', authLimiter, uploadNone, authController.resetPassword);
router.post('/resend-otp', otpLimiter, uploadNone, authController.resendOtp);
router.post('/auth/phone/send-otp', otpLimiter, uploadNone, authController.sendPhoneOtp);
router.post('/auth/phone/verify-otp', authLimiter, uploadNone, authController.verifyPhoneOtp);
router.post('/auth/email/send-otp', otpLimiter, uploadNone, authController.sendEmailOtp);
router.post('/auth/email/verify-otp', authLimiter, uploadNone, authController.verifyEmailOtp);
router.post('/logout', authenticate, authController.logout);

export default router;
