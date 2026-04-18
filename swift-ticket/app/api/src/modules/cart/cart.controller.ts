import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { successResponse, errorResponse } from '../../utils/response';
import { cartService } from './cart.service';
import { AuthRequest } from '../../middleware/auth';
import { z } from 'zod';

const getTicket = catchAsync(async (req: Request, res: Response) => {
  const data = await cartService.getTicket(Number(req.params.ticketId));
  return successResponse(res, data);
});

const view = catchAsync(async (req: AuthRequest, res: Response) => {
  const { data, total } = await cartService.view(req.user!.id);
  return res.json({ success: true, data, total });
});

const add = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = z.object({
    resale_ticket_id: z.number().int().positive(),
    quantity: z.number().int().positive().optional().default(1),
  }).safeParse(req.body);

  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  const data = await cartService.add(req.user!.id, parsed.data.resale_ticket_id, parsed.data.quantity);
  return res.json({ success: true, message: 'Added to cart.', data });
});

const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = z.object({
    cart_item_id: z.number().int().positive(),
  }).safeParse(req.body);

  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  await cartService.remove(req.user!.id, parsed.data.cart_item_id);
  return res.json({ success: true, message: 'Removed from cart' });
});

const applyCoupon = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = z.object({ code: z.string() }).safeParse(req.body);
  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  const data = await cartService.applyCoupon(req.user!.id, parsed.data.code);
  return res.json(data);
});

export const cartController = {
  getTicket,
  view,
  add,
  remove,
  applyCoupon,
};
