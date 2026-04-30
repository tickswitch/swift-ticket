import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError';

/**
 * Build a fresh transporter each call so it always picks up current env vars
 * (avoids dotenv-timing issues where env vars weren't loaded at module init time).
 * Connection/socket timeouts ensure the transport never hangs indefinitely.
 */
function buildTransporter() {
  const port = Number(process.env.MAIL_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587/2525 (STARTTLS)
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    connectionTimeout: 10_000,  // 10 s — fail fast instead of hanging
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export const sendMail = async (to: string, subject: string, body: string): Promise<void> => {
  // In development: log the email and skip real sending so missing SMTP config doesn't break the flow
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n=== MOCK EMAIL ===\nTo: ${to}\nSubject: ${subject}\nBody:\n${body}\n==================\n`);
    return;
  }

  // Guard: surface missing config as a clear error rather than a cryptic SMTP failure
  if (!process.env.MAIL_HOST || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
    const msg = '[sendMail] Mail env vars not set (MAIL_HOST / MAIL_USERNAME / MAIL_PASSWORD). Check Render environment settings.';
    console.error(msg);
    throw new AppError('Mail service is not configured. Please contact support.', 500);
  }

  const transporter = buildTransporter();

  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME ?? 'SwiftTickets'}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text: body,
    });
    console.log(`[sendMail] Email dispatched successfully to ${to}`);
  } catch (error) {
    console.error('[sendMail] Failed to send email:', error);
    throw new AppError('Unable to send email. Please try again later.', 500);
  }
};
