import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

const create = async (data: Prisma.UserUncheckedCreateInput) => {
  return prisma.user.create({ data });
};

const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const findByPhone = async (phone: string) => {
  return prisma.user.findFirst({ where: { phone } });
};

const findById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

const findByRememberToken = async (token: string) => {
  return prisma.user.findFirst({ where: { remember_token: token } });
};

const updateById = async (id: number, data: Prisma.UserUncheckedUpdateInput) => {
  return prisma.user.update({ where: { id }, data });
};

const deleteById = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};

export const authRepository = {
  create,
  findByEmail,
  findByPhone,
  findById,
  findByRememberToken,
  updateById,
  deleteById,
};
