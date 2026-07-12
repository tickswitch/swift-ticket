import { Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { errorResponse } from '../../utils/response';
import { checkoutService } from './checkout.service';
import { AuthRequest } from '../../middleware/auth';
import { z } from 'zod';

const checkout = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = z.object({
    coupon_code: z.string().optional(),
    // Present when buying a single ticket (e.g. "Buy now" on a listing) —
    // limits the order to that cart item instead of the whole cart.
    ticket_id: z.string().or(z.number()).optional(),
  }).safeParse(req.body);

  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  const ticketId = parsed.data.ticket_id !== undefined ? Number(parsed.data.ticket_id) : undefined;
  const data = await checkoutService.checkout(req.user!.id, parsed.data.coupon_code, ticketId);
  return res.json({ success: true, ...data });
});

const verify = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
  }).safeParse(req.body);

  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  const data = await checkoutService.verify(
    parsed.data.razorpay_order_id,
    parsed.data.razorpay_payment_id,
    parsed.data.razorpay_signature
  );

  return res.json({ status: true, ...data });
});

export const checkoutController = {
  checkout,
  verify,
};
