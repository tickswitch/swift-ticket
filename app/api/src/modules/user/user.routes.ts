import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../middleware/auth';
import { avatarUpload, uploadNone } from '../../utils/fileUpload';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.post('/contact/update', authenticate, uploadNone, userController.updateContact);
router.post('/bank/update', authenticate, uploadNone, userController.updateBank);
router.post('/profile/photo', authenticate, avatarUpload.single('avatar'), userController.uploadAvatar);
router.post('/email/update/request', authenticate, uploadNone, userController.requestEmailUpdate);
router.post('/email/update/verify', authenticate, uploadNone, userController.verifyEmailUpdate);
router.get('/remove/account', authenticate, userController.removeAccount);

export default router;
