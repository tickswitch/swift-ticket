import { Response } from 'express';
import { z } from 'zod';
import catchAsync from '../../utils/catchAsync';
import { successResponse, errorResponse, paginateResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth';
import { adminService } from './admin.service';

const rejectSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
});

const VALID_STATUSES = ['pending', 'approved', 'rejected'];

const listings = catchAsync(async (req: AuthRequest, res: Response) => {
  const { status, page } = req.query;
  const statusParam = typeof status === 'string' && VALID_STATUSES.includes(status) ? status : undefined;
  const pageNum = page ? Math.max(1, Number(page)) : 1;

  const { listings: data, total, total_pages } = await adminService.getListings(statusParam, pageNum);

  return paginateResponse(res, data, { total, page: pageNum, total_pages }, 'Listings fetched');
});

const listingById = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const ticket = await adminService.getListingById(id);
  return successResponse(res, ticket, 'Listing fetched');
});

const approve = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const ticket = await adminService.approveListing(id);
  return successResponse(res, ticket, 'Listing approved');
});

const reject = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = rejectSchema.safeParse(req.body);
  if (!parsed.success) return errorResponse(res, parsed.error.errors[0].message, 422);

  const id = Number(req.params.id);
  const ticket = await adminService.rejectListing(id, parsed.data.reason);
  return successResponse(res, ticket, 'Listing rejected');
});

const stats = catchAsync(async (_req: AuthRequest, res: Response) => {
  const data = await adminService.getStats();
  return successResponse(res, data, 'Stats fetched');
});

export const adminController = { listings, listingById, approve, reject, stats };
