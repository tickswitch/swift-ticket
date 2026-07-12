import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { cartRepository } from './cart.repository';
import axios from 'axios';

// Release any cart holds whose reservation window has expired, freeing the
// reserved_quantity back to availability. Runs opportunistically on cart add
// since the free tier has no background scheduler.
// ponytail: global sweep on every add; move to a cron/interval if volume grows.
const releaseExpiredReservations = async (tx: Prisma.TransactionClient) => {
  const expired = await tx.cartItem.findMany({
    where: { reserved_until: { lt: new Date() }, is_purchased: false },
    select: { id: true, resale_ticket_id: true, quantity: true },
  });
  if (expired.length === 0) return;

  const freedByTicket = new Map<number, number>();
  for (const item of expired) {
    freedByTicket.set(
      item.resale_ticket_id,
      (freedByTicket.get(item.resale_ticket_id) ?? 0) + item.quantity
    );
  }

  for (const [ticketId, freed] of freedByTicket) {
    const ticket = await tx.resaleTicket.findUnique({
      where: { id: ticketId },
      select: { reserved_quantity: true },
    });
    if (!ticket) continue;
    await tx.resaleTicket.update({
      where: { id: ticketId },
      data: { reserved_quantity: Math.max(0, ticket.reserved_quantity - freed) },
    });
  }

  await tx.cartItem.deleteMany({ where: { id: { in: expired.map((e) => e.id) } } });
};

const add = async (userId: number, ticketId: number, qty: number) => {
  const cart = await cartRepository.getCart(userId);

  return prisma.$transaction(async (tx) => {
    // Free expired holds first so freed seats count toward availability.
    await releaseExpiredReservations(tx);

    const ticket = await tx.resaleTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new AppError('Ticket not found', 404);

    const existingItem = await tx.cartItem.findFirst({
      where: { cart_id: cart.id, resale_ticket_id: ticketId, is_purchased: false },
    });
    if (existingItem) {
      throw new AppError('This ticket is already in your cart.', 409);
    }

    const available = ticket.status === 'approved' ? ticket.quantity - ticket.reserved_quantity - ticket.sold_quantity : 0;
    if (available < qty) {
      throw new AppError('Not enough tickets available.', 409);
    }

    const cartItem = await tx.cartItem.create({
      data: {
        cart_id: cart.id,
        resale_ticket_id: ticket.id,
        quantity: qty,
        price: ticket.price,
        total_price: Number(ticket.price) * qty,
        reserved_until: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    });

    await tx.resaleTicket.update({
      where: { id: ticket.id },
      data: { reserved_quantity: { increment: qty } },
    });

    // Defensive re-check: if a concurrent add pushed reservations past the
    // available supply, roll back rather than oversell.
    // ponytail: full fix needs SELECT ... FOR UPDATE / Serializable isolation.
    const after = await tx.resaleTicket.findUnique({
      where: { id: ticket.id },
      select: { quantity: true, reserved_quantity: true, sold_quantity: true },
    });
    if (after && after.reserved_quantity + after.sold_quantity > after.quantity) {
      throw new AppError('Not enough tickets available.', 409);
    }

    return cartItem;
  });
};

const remove = async (userId: number, cartItemId: number) => {
  const cart = await cartRepository.getCart(userId);

  return prisma.$transaction(async (tx) => {
    const item = await tx.cartItem.findFirst({
      where: { id: cartItemId, cart_id: cart.id, is_purchased: false },
    });
    if (!item) throw new AppError('Cart item not found', 404);

    await tx.resaleTicket.update({
      where: { id: item.resale_ticket_id },
      data: { reserved_quantity: { decrement: item.quantity } },
    });

    await tx.cartItem.delete({ where: { id: item.id } });
  });
};

const view = async (userId: number) => {
  const cart = await cartRepository.getCartWithItems(userId);
  if (!cart) return { data: null, total: 0 };

  // Fetch Ticketmaster event details dynamically
  const items = await Promise.all(
    cart.items.map(async (item) => {
      const ticket = item.resaleTicket as any;
      if (ticket?.event_id) {
        try {
          const { data } = await axios.get(
            `https://app.ticketmaster.com/discovery/v2/events/${ticket.event_id}`,
            { params: { apikey: process.env.TICKETMASTER_API_KEY } }
          );
          ticket.event = {
            id: data.id,
            title: data.name,
            venue: data._embedded?.venues?.[0]?.name,
            location: data._embedded?.venues?.[0]?.city?.name,
            date: data.dates?.start?.localDate,
            time: data.dates?.start?.localTime,
          };
        } catch {
          ticket.event = null;
        }
      }
      return item;
    })
  );

  const total = items.reduce((sum, item) => sum + Number(item.total_price), 0);
  return { data: { ...cart, items }, total };
};

const applyCoupon = async (userId: number, code: string) => {
  const coupon = await cartRepository.checkCoupon(code);
  if (!coupon) throw new AppError('Invalid coupon code.', 404);

  if (coupon.expires_at && new Date() > coupon.expires_at) {
    throw new AppError('Coupon expired.', 400);
  }

  const cart = await cartRepository.getCartWithItems(userId);
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty.', 400);
  }

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  if (coupon.min_order_amount && subtotal < Number(coupon.min_order_amount)) {
    throw new AppError('Minimum order amount not met', 400);
  }

  let discount = 0;
  if (coupon.type === 'fixed') {
    discount = Number(coupon.value);
  } else {
    discount = (subtotal * Number(coupon.value)) / 100;
  }

  return {
    message: 'Coupon applied',
    discount,
    total: subtotal - discount,
  };
};

const getTicket = async (ticketId: number) => {
  const ticket = await prisma.resaleTicket.findFirst({
    where: { id: ticketId, status: 'approved' },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  if (!ticket) throw new AppError('Ticket not found', 404);

  // Hide ticket_file logic handled in controller if needed, or simply delete property
  const { ticket_file, ...rest } = ticket;
  return rest;
};

export const cartService = {
  add,
  remove,
  view,
  applyCoupon,
  getTicket,
};
