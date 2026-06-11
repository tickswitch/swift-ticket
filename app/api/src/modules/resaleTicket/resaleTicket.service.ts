import axios from 'axios';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { userRepository } from '../user/user.repository';

interface CustomEventPayload {
  title: string;
  venue: string;
  city: string;
  artist?: string;
  category: string;
  start_date: string;
  time?: string;
}

interface TicketStorePayload {
  ticketmaster_id: string;
  original_price: number;
  price: number;
  start_date?: Date;
  end_date?: Date;
  time?: string;
  additional_info?: string;
  country_of_residence?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  bank_country?: string;
  account_holder_name?: string;
  phone_number?: string;
  bank_account_number?: string;
}

const store = async (userId: number, payload: TicketStorePayload, filePath: string) => {
  // Enforce 120% price cap (SwiftTickets core business rule)
  const MAX_MARKUP = 1.2;
  const faceValue = Number(payload.original_price);
  const listingPrice = Number(payload.price);
  const maxAllowed = Math.floor(faceValue * MAX_MARKUP);

  if (listingPrice > maxAllowed) {
    throw new AppError(
      `Listing price ₹${listingPrice} exceeds the maximum allowed resale price of ₹${maxAllowed} (120% of face value ₹${faceValue})`,
      400
    );
  }

  // Computed fee / payout fields
  const buyerFee = Math.ceil(listingPrice * 0.05);
  const sellerFee = Math.ceil(listingPrice * 0.05);
  const totalBuyerPays = listingPrice + buyerFee;
  const sellerReceives = listingPrice - sellerFee;

  return prisma.$transaction(async (tx) => {
    // 1. Store financial info
    let profile = await tx.financialProfile.findFirst({ where: { user_id: userId } });
    if (profile) {
      profile = await tx.financialProfile.update({
        where: { id: profile.id },
        data: {
          country_of_residence: payload.country_of_residence,
          address: payload.address,
          city: payload.city,
          postal_code: payload.postal_code,
          bank_country: payload.bank_country,
          account_holder_name: payload.account_holder_name,
          phone_number: payload.phone_number,
          bank_account_number: payload.bank_account_number,
        },
      });
    } else {
      profile = await tx.financialProfile.create({
        data: {
          user_id: userId,
          country_of_residence: payload.country_of_residence,
          address: payload.address,
          city: payload.city,
          postal_code: payload.postal_code,
          bank_country: payload.bank_country,
          account_holder_name: payload.account_holder_name,
          phone_number: payload.phone_number,
          bank_account_number: payload.bank_account_number,
        },
      });
    }

    // 2. Fetch event details from Ticketmaster
    let title = 'Unknown Event';
    let venue = null;
    let category = null;
    let artist = null;

    try {
      const { data } = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events/${payload.ticketmaster_id}`,
        { params: { apikey: process.env.TICKETMASTER_API_KEY } }
      );
      title = data.name ?? 'Unknown Event';
      venue = data._embedded?.venues?.[0]?.name ?? null;
      category = data.classifications?.[0]?.segment?.name ?? null;
      artist = data._embedded?.attractions?.[0]?.name ?? null;
    } catch {
      // fallback to defaults
    }

    // 3. Store resale ticket
    const ticket = await tx.resaleTicket.create({
      data: {
        user_id: userId,
        financial_profile_id: profile.id,
        event_id: payload.ticketmaster_id,
        ticketmaster_id: payload.ticketmaster_id,
        title,
        venue,
        artist,
        category,
        quantity: 1, // hardcoded per Laravel
        original_price: payload.original_price,
        price: payload.price,
        originalFaceValue: faceValue,
        maxAllowedPrice: maxAllowed,
        buyerFee,
        sellerFee,
        sellerReceives,
        totalBuyerPays,
        start_date: payload.start_date,
        end_date: payload.end_date,
        time: payload.time,
        additional_info: payload.additional_info,
        ticket_file: filePath,
      },
    });

    return ticket;
  });
};

const submitCustomEvent = async (userId: number, payload: CustomEventPayload) => {
  let profile = await prisma.financialProfile.findFirst({ where: { user_id: userId } });
  if (!profile) {
    profile = await prisma.financialProfile.create({
      data: { user_id: userId, city: payload.city },
    });
  } else if (!profile.city) {
    profile = await prisma.financialProfile.update({
      where: { id: profile.id },
      data: { city: payload.city },
    });
  }

  return prisma.resaleTicket.create({
    data: {
      user_id: userId,
      financial_profile_id: profile.id,
      ticketmaster_id: null,
      event_id: null,
      title: payload.title,
      venue: payload.venue,
      artist: payload.artist ?? null,
      category: payload.category,
      start_date: new Date(payload.start_date),
      time: payload.time ?? null,
      status: 'pending',
      quantity: 0,
      original_price: 0,
      price: 0,
      originalFaceValue: 0,
      maxAllowedPrice: 0,
    },
    select: { id: true, title: true, venue: true, start_date: true },
  });
};

type TicketRow = {
  id: number; event_id: string | null; price: unknown; ticket_type: string;
  seat_info: string | null; additional_info: string | null;
  start_date: Date | null; end_date: Date | null; time: string | null;
  quantity: number; reserved_quantity: number; sold_quantity: number;
};

function buildTicketResponse(baseEventData: object, tickets: TicketRow[]) {
  if (tickets.length === 0) {
    return { message: 'No resale tickets found for this event', data: baseEventData };
  }

  const totalQuantity = tickets.reduce((s, t) => s + t.quantity, 0);
  const totalReserved = tickets.reduce((s, t) => s + t.reserved_quantity, 0);
  const totalSold = tickets.reduce((s, t) => s + t.sold_quantity, 0);
  const totalAvailable = totalQuantity - totalReserved - totalSold;

  const grouped = tickets.reduce((acc, ticket) => {
    const type = ticket.ticket_type.toLowerCase();
    if (!acc[type]) acc[type] = [];
    acc[type].push(ticket);
    return acc;
  }, {} as Record<string, TicketRow[]>);

  const ticketsByType = Object.entries(grouped).map(([type, grp]) => ({
    ticket_type: type,
    total_available_quantity_type: grp.reduce((s, t) => s + (t.quantity - t.reserved_quantity - t.sold_quantity), 0),
    tickets: grp,
  }));

  return {
    data: {
      ...baseEventData,
      total_quantity: totalQuantity,
      total_reserved_quantity: totalReserved,
      total_sold_quantity: totalSold,
      total_available_quantity: totalAvailable,
      tickets_by_type: ticketsByType,
    },
  };
}

const TICKET_SELECT = {
  id: true, event_id: true, price: true, ticket_type: true, seat_info: true,
  additional_info: true, start_date: true, end_date: true, time: true,
  quantity: true, reserved_quantity: true, sold_quantity: true,
} as const;

const getEventTickets = async (eventId: string) => {
  // If tickets exist for this eventId with no Ticketmaster ID, build metadata from DB fields
  const firstTicket = await prisma.resaleTicket.findFirst({
    where: { event_id: eventId },
    select: { ticketmaster_id: true, title: true, venue: true, start_date: true, time: true },
  });

  if (firstTicket && firstTicket.ticketmaster_id === null) {
    const startDateStr = firstTicket.start_date
      ? firstTicket.start_date.toISOString().split('T')[0]
      : null;
    const baseEventData = {
      event_id: eventId,
      title: firstTicket.title ?? null,
      image: null,
      start_date: startDateStr,
      end_date: startDateStr,
      time: firstTicket.time ?? null,
      venue: firstTicket.venue ?? null,
      location: null,
      mapUrl: null,
      orginal_ticket_url: null,
    };
    const tickets = await prisma.resaleTicket.findMany({
      where: { event_id: eventId, status: 'approved' },
      select: TICKET_SELECT,
    });
    return buildTicketResponse(baseEventData, tickets);
  }

  let event: any = {};
  try {
    const { data } = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json`,
      { params: { apikey: process.env.TICKETMASTER_API_KEY } }
    );
    event = data;
  } catch {
    return { message: 'Failed to fetch event from Ticketmaster', data: [] };
  }

  const lat = event._embedded?.venues?.[0]?.location?.latitude;
  const long = event._embedded?.venues?.[0]?.location?.longitude;
  const mapUrl = lat && long ? `https://www.google.com/maps/search/?api=1&query=${lat},${long}` : null;

  const baseEventData = {
    event_id: event.id ?? eventId,
    title: event.name ?? null,
    image: event.images?.[0]?.url ?? null,
    start_date: event.dates?.start?.localDate ?? null,
    end_date: event.dates?.end?.localDate ?? event.dates?.start?.localDate ?? null,
    time: event.dates?.start?.localTime ?? null,
    venue: event._embedded?.venues?.[0]?.name ?? null,
    location: event._embedded?.venues?.[0]?.city?.name ?? null,
    mapUrl,
    orginal_ticket_url: event.url ?? null,
  };

  const tickets = await prisma.resaleTicket.findMany({
    where: { event_id: eventId, status: 'approved' },
    select: TICKET_SELECT,
  });

  return buildTicketResponse(baseEventData, tickets);
};

const ticketsByType = async (eventId: string, ticketType: string) => {
  const normalizedType = ticketType.toLowerCase();
  
  // Note: we can't use case insensitive search in prisma easily without raw queries, 
  // but Prisma handles case sensitive matching by default unless provider supports insensitive.
  // Using native case sensitive for simplicity, assuming input normalize is handled or DB collation is CI.
  const tickets = await prisma.resaleTicket.findMany({
    where: {
      event_id: eventId,
      status: 'approved',
      ticket_type: { equals: normalizedType, mode: 'insensitive' },
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  if (tickets.length === 0) {
    return { message: 'No tickets available for this type.', ticket_type: normalizedType, tickets: [] };
  }

  const totalAvailable = tickets.reduce((s, t) => s + (t.quantity - t.reserved_quantity - t.sold_quantity), 0);

  return {
    event_id: eventId,
    ticket_type: normalizedType,
    total_available_quantity_type: totalAvailable,
    tickets,
  };
};

const sellTicketList = async (userId: number) => {
  return prisma.resaleTicket.findMany({ where: { user_id: userId } });
};

const buyTicketList = async (userId: number) => {
  return prisma.order.findMany({
    where: { user_id: userId },
    include: { orderItems: { include: { ticket: true } } },
  });
};

export const resaleTicketService = {
  store,
  submitCustomEvent,
  getEventTickets,
  ticketsByType,
  sellTicketList,
  buyTicketList,
};
