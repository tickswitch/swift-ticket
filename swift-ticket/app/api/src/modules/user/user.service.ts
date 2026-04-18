import { AppError } from '../../utils/AppError';
import { sendMail } from '../../config/mail';
import { userRepository } from './user.repository';
import type { UpdateContactInput, UpdateBankInput } from './user.validation';

const getProfile = async (userId: number) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  const profile = await userRepository.getFinancialProfile(userId);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar
      ? `${process.env.APP_URL}/uploads/${user.avatar}`
      : null,
    address: profile?.address ?? null,
    city: profile?.city ?? null,
    country_of_residence: profile?.country_of_residence ?? null,
    postal_code: profile?.postal_code ?? null,
    date_of_birth: profile?.dob ?? null,
    bank_country: profile?.bank_country ?? null,
    account_holder_name: profile?.account_holder_name ?? null,
    phone_number: profile?.phone_number ?? null,
    bank_account_number: profile?.bank_account_number ?? null,
  };
};

const updateContact = async (userId: number, payload: UpdateContactInput) => {
  await userRepository.updateById(userId, {
    name: payload.name,
    phone: payload.phone ?? null,
  });

  const profile = await userRepository.upsertFinancialProfile(userId, {
    address: payload.address ?? null,
    city: payload.city ?? null,
    country_of_residence: payload.country_of_residence,
    postal_code: payload.postal_code,
    dob: payload.dob ?? null,
  });

  return {
    name: payload.name,
    phone: payload.phone ?? null,
    address: profile.address,
    city: profile.city,
    country_of_residence: profile.country_of_residence,
    postal_code: profile.postal_code,
    dob: profile.dob,
  };
};

const updateBank = async (userId: number, payload: UpdateBankInput) => {
  const profile = await userRepository.upsertFinancialProfile(userId, {
    bank_country: payload.bank_country,
    account_holder_name: payload.account_holder_name,
    phone_number: payload.phone_number,
    bank_account_number: payload.bank_account_number,
  });

  return {
    bank_country: profile.bank_country,
    account_holder_name: profile.account_holder_name,
    phone_number: profile.phone_number,
    bank_account_number: profile.bank_account_number,
  };
};

const uploadAvatar = async (userId: number, avatarPath: string) => {
  await userRepository.updateById(userId, { avatar: avatarPath });
  return `${process.env.APP_URL}/uploads/${avatarPath}`;
};

const requestEmailUpdate = async (userId: number, newEmail: string) => {
  // Check new email not already taken
  const existing = await userRepository.findByEmail(newEmail);
  if (existing) throw new AppError('Email already in use.', 422);

  const otp = String(Math.floor(1000 + Math.random() * 9000));
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

  await userRepository.updateById(userId, {
    reset_token: newEmail,
    otp,
    otp_expiration: otpExpiration,
  });

  const body = `Hello,\n\nWe have received a request to reset your email.\n\nYour One-Time Password (OTP) for email reset is:\n\n${otp}\n\nThis OTP is valid for 5 minutes.`;
  await sendMail(newEmail, 'Reset Email OTP', body);
};

const verifyEmailUpdate = async (userId: number, otp: string) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  if (!user.otp || !user.reset_token) {
    throw new AppError('No email update request found.', 400);
  }

  if (user.otp !== otp) throw new AppError('Invalid OTP.', 400);

  if (!user.otp_expiration || new Date() > user.otp_expiration) {
    throw new AppError('OTP has expired.', 400);
  }

  await userRepository.updateById(userId, {
    email: user.reset_token,
    reset_token: null,
    otp: null,
    otp_expiration: null,
  });
};

const removeAccount = async (userId: number) => {
  await userRepository.deleteById(userId);
};

export const userService = {
  getProfile,
  updateContact,
  updateBank,
  uploadAvatar,
  requestEmailUpdate,
  verifyEmailUpdate,
  removeAccount,
};
