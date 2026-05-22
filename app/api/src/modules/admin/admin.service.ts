import prisma from '../../config/prisma';
import { sendMail } from '../../config/mail';
import { getFileUrl } from '../../utils/fileUpload';
import { AppError } from '../../utils/AppError';

const PAGE_SIZE = 20;

const getListings = async (status?: string, page = 1) => {
  const where = status ? { status: status as 'pending' | 'approved' | 'rejected' } : {};
  const skip = (page - 1) * PAGE_SIZE;

  const [total, listings] = await Promise.all([
    prisma.resaleTicket.count({ where }),
    prisma.resaleTicket.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { created_at: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
  ]);

  const mapped = listings.map((l) => ({ ...l, is_custom_event: l.ticketmaster_id === null }));

  return {
    listings: mapped,
    total,
    page,
    page_size: PAGE_SIZE,
    total_pages: Math.ceil(total / PAGE_SIZE),
  };
};

const getListingById = async (id: number) => {
  const ticket = await prisma.resaleTicket.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  });
  if (!ticket) throw new AppError('Listing not found', 404);

  return {
    ...ticket,
    ticket_file_url: ticket.ticket_file ? getFileUrl(ticket.ticket_file) : null,
  };
};

const approveListing = async (id: number) => {
  const ticket = await prisma.resaleTicket.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!ticket) throw new AppError('Listing not found', 404);

  const updated = await prisma.resaleTicket.update({
    where: { id },
    data: { status: 'approved', admin_notes: null },
  });

  await sendMail(
    ticket.user.email,
    'Your ticket listing is live on TickSwitch!',
    `Hi ${ticket.user.name}, your ticket for ${ticket.title} at ${ticket.venue} has been approved and is now live. Good luck with your sale!`
  );

  return updated;
};

const rejectListing = async (id: number, reason: string) => {
  const ticket = await prisma.resaleTicket.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!ticket) throw new AppError('Listing not found', 404);

  const updated = await prisma.resaleTicket.update({
    where: { id },
    data: { status: 'rejected', admin_notes: reason },
  });

  await sendMail(
    ticket.user.email,
    'Update on your TickSwitch listing',
    `Hi ${ticket.user.name}, your ticket for ${ticket.title} at ${ticket.venue} could not be approved. Reason: ${reason}. Please re-list with the correct ticket file.`
  );

  return updated;
};

const getStats = async () => {
  const groups = await prisma.resaleTicket.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const counts = { pending: 0, approved: 0, rejected: 0, total_listings: 0 };
  for (const g of groups) {
    const key = g.status as keyof Omit<typeof counts, 'total_listings'>;
    counts[key] = g._count.id;
    counts.total_listings += g._count.id;
  }

  return counts;
};

export const adminService = {
  getListings,
  getListingById,
  approveListing,
  rejectListing,
  getStats,
};
