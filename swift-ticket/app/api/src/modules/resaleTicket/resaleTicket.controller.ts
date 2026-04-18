import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { errorResponse, successResponse } from '../../utils/response';
import { resaleTicketService } from './resaleTicket.service';
import { AuthRequest } from '../../middleware/auth';
import { z } from 'zod';

const storeSchema = z.object({
  ticketmaster_id: z.string(),
  original_price: z.string().or(z.number()),
  price: z.string().or(z.number()),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  time: z.string().optional(),
  additional_info: z.string().optional(),
  country_of_residence: z.string(),
  address: z.string(),
  city: z.string(),
  postal_code: z.string(),
  bank_country: z.string(),
  account_holder_name: z.string(),
  phone_number: z.string(),
  bank_account_number: z.string(),
});

const store = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = storeSchema.safeParse(req.body);
  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  if (!req.file) return errorResponse(res, 'Ticket file is required.', 422);

  const payload = {
    ...parsed.data,
    original_price: Number(parsed.data.original_price),
    price: Number(parsed.data.price),
    start_date: parsed.data.start_date ? new Date(parsed.data.start_date) : undefined,
    end_date: parsed.data.end_date ? new Date(parsed.data.end_date) : undefined,
  };

  const filePath = `tickets/${req.file.filename}`;
  await resaleTicketService.store(req.user!.id, payload, filePath);

  return res.json({ status: true, message: 'Ticket submitted for review successfully.' });
});

const eventTickets = catchAsync(async (req: Request, res: Response) => {
  const result = await resaleTicketService.getEventTickets(req.params.eventId);
  return res.json({ status: true, ...result });
});

const ticketsByType = catchAsync(async (req: Request, res: Response) => {
  const result = await resaleTicketService.ticketsByType(req.params.eventId, req.params.ticketType);
  return res.json({ status: true, data: result });
});

const sellTicketList = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await resaleTicketService.sellTicketList(req.user!.id);
  return res.json({ status: true, data });
});

const buyTicketList = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await resaleTicketService.buyTicketList(req.user!.id);
  return res.json({ status: true, data });
});

export const resaleTicketController = {
  store,
  eventTickets,
  ticketsByType,
  sellTicketList,
  buyTicketList,
};
