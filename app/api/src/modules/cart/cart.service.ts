import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { cartRepository } from './cart.repository';
import axios from 'axios';

const add = async (userId: number, ticketId: number, qty: number) => {
  const cart = await cartRepository.getCart(userId);

  return prisma.$transaction(async (tx) => {
    // using Prisma transaction to "lock" / ensure consistency in real-world scenarios
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
