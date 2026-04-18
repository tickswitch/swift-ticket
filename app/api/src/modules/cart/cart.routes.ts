import { Router } from 'express';
import { cartController } from './cart.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public route to view single ticket detail (if that's public)
router.get('/tickets/:ticketId', cartController.getTicket);

// Authenticated routes
router.use(authenticate);
router.get('/', cartController.view);
router.post('/add', cartController.add);
router.post('/remove', cartController.remove);
router.post('/apply-coupon', cartController.applyCoupon);

export default router;
