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

router.post('/register', avatarUpload.single('avatar'), authController.register);
router.post('/login', uploadNone, authController.login);
router.post('/forgot-password', uploadNone, authController.forgotPassword);
router.post('/verify-otp', uploadNone, authController.verifyOtp);
router.post('/reset-password', uploadNone, authController.resetPassword);
router.post('/resend-otp', otpLimiter, uploadNone, authController.resendOtp);
router.post('/auth/phone/send-otp', otpLimiter, uploadNone, authController.sendPhoneOtp);
router.post('/auth/phone/verify-otp', uploadNone, authController.verifyPhoneOtp);
router.post('/auth/email/send-otp', otpLimiter, uploadNone, authController.sendEmailOtp);
router.post('/auth/email/verify-otp', uploadNone, authController.verifyEmailOtp);
router.post('/logout', authenticate, authController.logout);

export default router;
