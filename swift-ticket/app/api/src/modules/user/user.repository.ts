import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

const findById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

const updateById = async (id: number, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({ where: { id }, data });
};

const deleteById = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};

const getFinancialProfile = async (userId: number) => {
  return prisma.financialProfile.findFirst({ where: { user_id: userId } });
};

const upsertFinancialProfile = async (
  userId: number,
  data: Prisma.FinancialProfileUncheckedUpdateInput
) => {
  return prisma.financialProfile.upsert({
    where: { id: (await prisma.financialProfile.findFirst({ where: { user_id: userId } }))?.id ?? 0 },
    create: { user_id: userId, ...data } as Prisma.FinancialProfileUncheckedCreateInput,
    update: data,
  });
};

const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const userRepository = {
  findById,
  updateById,
  deleteById,
  getFinancialProfile,
  upsertFinancialProfile,
  findByEmail,
};
