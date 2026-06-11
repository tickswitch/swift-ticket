import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middleware/auth';
import { adminController } from './admin.controller';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/listings', adminController.listings);
router.get('/stats', adminController.stats);
router.get('/listings/:id', adminController.listingById);
router.patch('/listings/:id/approve', adminController.approve);
router.patch('/listings/:id/reject', adminController.reject);

export default router;
