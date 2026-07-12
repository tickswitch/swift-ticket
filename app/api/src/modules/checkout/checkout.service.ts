import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { cartRepository } from '../cart/cart.repository';
import { buyerFee } from '../../utils/pricing';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayKeyId = () => process.env.RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY ?? '';
const razorpayKeySecret = () => process.env.RAZORPAY_KEY_SECRET ?? process.env.RAZORPAY_SECRET ?? '';

const checkout = async (userId: number, couponCode?: string, ticketId?: number) => {
  const cart = await cartRepository.getCartWithItems(userId);
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // "Buy now" on a single listing passes ticket_id — only that cart item is
  // ordered/charged, not everything sitting in the buyer's cart.
  let items = cart.items;
  if (ticketId !== undefined) {
    items = cart.items.filter((item) => item.resale_ticket_id === ticketId);
    if (items.length === 0) {
      throw new AppError('Ticket not found in cart.', 404);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  // Buyer platform fee, computed with the same rule the frontend displays.
  // Without this the buyer is never charged the fee shown on the pay button.
  const buyerFeesTotal = items.reduce(
    (sum, item) => sum + buyerFee(Number(item.price)) * item.quantity,
    0
  );
  let discount = 0;
  let couponId: number | null = null;

  if (couponCode) {
    const coupon = await cartRepository.checkCoupon(couponCode);
    if (coupon && (!coupon.min_order_amount || subtotal >= Number(coupon.min_order_amount))) {
      couponId = coupon.id;
      if (coupon.type === 'fixed') {
        discount = Number(coupon.value);
      } else {
        discount = (Number(coupon.value) / 100) * subtotal;
      }
    }
  }

  const total = Math.max(0, subtotal - discount) + buyerFeesTotal;

  return prisma.$transaction(async (tx) => {
    const orderNumber = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const order = await tx.order.create({
      data: {
        user_id: userId,
        order_number: orderNumber,
        subtotal,
        discount,
        total,
        coupon_id: couponId,
        payment_method: 'razorpay',
        payment_status: 'pending',
        orderItems: {
          create: items.map((item) => ({
            resale_ticket_id: item.resale_ticket_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    const razorpay = new Razorpay({
      key_id: razorpayKeyId(),
      key_secret: razorpayKeySecret(),
    });

    const options = {
      amount: Math.round(total * 100), // paise
      currency: 'INR',
      receipt: orderNumber,
      payment_capture: 1,
    };

    const rzpOrder = await razorpay.orders.create(options);

    await tx.order.update({
      where: { id: order.id },
      data: { razorpay_order_id: rzpOrder.id },
    });

    return {
      message: 'Order Placed successful',
      order,
      razorpay: {
        order_id: rzpOrder.id,
        key: razorpayKeyId(),
        amount: Math.round(total * 100),
        currency: 'INR',
      },
    };
  });
};

const verify = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  const secret = razorpayKeySecret();
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  // Verify signature
  if (expectedSignature !== razorpay_signature) {
    throw new AppError('Payment verification failed', 400);
  }

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { razorpay_order_id },
      include: { orderItems: { include: { ticket: true } } },
    });

    if (!order) throw new AppError('Order not found', 404);

    if (order.payment_status !== 'paid') {
      for (const item of order.orderItems) {
        // Release reservation & mark as sold
        await tx.resaleTicket.update({
          where: { id: item.ticket.id },
          data: {
            reserved_quantity: Math.max(0, item.ticket.reserved_quantity - item.quantity),
            sold_quantity: item.ticket.sold_quantity + item.quantity,
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: { payment_status: 'paid', transaction_id: razorpay_payment_id },
      });

      // Clear only the cart items that were part of THIS order — checkout
      // can now be scoped to a single ticket (ticket_id), so wiping the
      // whole cart here would delete the buyer's other, still-unpaid items.
      const userCart = await tx.cart.findFirst({
        where: { user_id: order.user_id },
      });
      if (userCart) {
        const paidTicketIds = order.orderItems.map((item) => item.resale_ticket_id);
        await tx.cartItem.deleteMany({
          where: { cart_id: userCart.id, resale_ticket_id: { in: paidTicketIds } },
        });
      }
    }

    return { message: 'Payment verified successfully' };
  });
};

export const checkoutService = {
  checkout,
  verify,
};
