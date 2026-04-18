import { z } from 'zod';

export const updateContactSchema = z.object({
  name: z.string().min(1).max(255),
  phone: z.string().optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  dob: z.string().optional(),
  country_of_residence: z.string().max(100),
  postal_code: z.string().max(20),
});

export const updateBankSchema = z.object({
  bank_country: z.string().max(100),
  account_holder_name: z.string().max(20),
  phone_number: z.string(),
  bank_account_number: z.string().regex(/^\+?[0-9\s\-()?]{7,15}$/, 'Invalid account number'),
});

export const requestEmailUpdateSchema = z.object({
  new_email: z.string().email(),
});

export const verifyEmailUpdateSchema = z.object({
  otp: z.string().length(4),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type UpdateBankInput = z.infer<typeof updateBankSchema>;
