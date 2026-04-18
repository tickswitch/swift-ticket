import prisma from '../../config/prisma';

const getCart = async (userId: number) => {
  let cart = await prisma.cart.findFirst({ where: { user_id: userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { user_id: userId } });
  }
  return cart;
};

const getResaleTicketWithLock = async (ticketId: number) => {
  // Using simple findUnique, but in a real app might need a transaction with pessimistic locking
  return prisma.resaleTicket.findUnique({ where: { id: ticketId } });
};

const findCartItem = async (cartId: number, ticketId: number) => {
  return prisma.cartItem.findFirst({
    where: { cart_id: cartId, resale_ticket_id: ticketId, is_purchased: false },
  });
};

const findCartItemById = async (cartId: number, cartItemId: number) => {
  return prisma.cartItem.findFirst({
    where: { cart_id: cartId, id: cartItemId, is_purchased: false },
  });
};

const addCartItem = async (data: any) => {
  return prisma.cartItem.create({ data });
};

const removeCartItem = async (cartItemId: number) => {
  return prisma.cartItem.delete({ where: { id: cartItemId } });
};

const getCartWithItems = async (userId: number) => {
  const cart = await getCart(userId);
  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        where: { is_purchased: false },
        include: {
          resaleTicket: {
            include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
          },
        },
      },
    },
  });
};

const checkCoupon = async (code: string) => {
  return prisma.coupon.findFirst({
    where: { code, is_active: true },
  });
};

export const cartRepository = {
  getCart,
  getResaleTicketWithLock,
  findCartItem,
  findCartItemById,
  addCartItem,
  removeCartItem,
  getCartWithItems,
  checkCoupon,
};
