import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST as string,
  port: Number(process.env.MAIL_PORT) || 2525,
  auth: {
    user: process.env.MAIL_USERNAME as string,
    pass: process.env.MAIL_PASSWORD as string,
  },
});

import { AppError } from '../utils/AppError';

export const sendMail = async (to: string, subject: string, body: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n=== MOCK EMAIL ===\nTo: ${to}\nSubject: ${subject}\nBody: ${body}\n==================\n`);
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text: body,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Let the OTP generation proceed in dev mode even if mail fails, but fail nicely in prod
    if (process.env.NODE_ENV !== 'development') {
      throw new AppError('Unable to send email. Please ensure mail server is configured properly.', 500);
    }
  }
};

export default transporter;
