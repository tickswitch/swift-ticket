import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { successResponse, errorResponse } from '../../utils/response';
import { userService } from './user.service';
import { AuthRequest } from '../../middleware/auth';
import {
  updateContactSchema,
  updateBankSchema,
  requestEmailUpdateSchema,
  verifyEmailUpdateSchema,
} from './user.validation';

const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await userService.getProfile(req.user!.id);
  return successResponse(res, data);
});

const updateContact = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = updateContactSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }
  const data = await userService.updateContact(req.user!.id, parsed.data);
  return res.status(200).json({ success: true, status: 200, message: 'Contact Details updated successfully.', data });
});

const updateBank = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = updateBankSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }
  const data = await userService.updateBank(req.user!.id, parsed.data);
  return res.status(200).json({ success: true, status: 200, message: 'Bank Details updated successfully.', data });
});

const uploadAvatar = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return errorResponse(res, 'No avatar file uploaded.', 400);
  }
  const avatarUrl = await userService.uploadAvatar(
    req.user!.id,
    `avatars/${req.file.filename}`
  );
  return res.status(200).json({ success: true, status: 200, message: 'Avatar uploaded successfully.', avatar_url: avatarUrl });
});

const requestEmailUpdate = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = requestEmailUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }
  await userService.requestEmailUpdate(req.user!.id, parsed.data.new_email);
  return successResponse(res, null, 'OTP sent to your new email address.');
});

const verifyEmailUpdate = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = verifyEmailUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, parsed.error.errors[0].message, 422);
  }
  await userService.verifyEmailUpdate(req.user!.id, parsed.data.otp);
  return successResponse(res, null, 'Email updated successfully.');
});

const removeAccount = catchAsync(async (req: AuthRequest, res: Response) => {
  await userService.removeAccount(req.user!.id);
  return successResponse(res, null, 'Account successfully deleted.');
});

export const userController = {
  getProfile,
  updateContact,
  updateBank,
  uploadAvatar,
  requestEmailUpdate,
  verifyEmailUpdate,
  removeAccount,
};
