import { Resend } from 'resend';
import { AppError } from '../utils/AppError';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to: string, subject: string, body: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n=== MOCK EMAIL ===\nTo: ${to}\nSubject: ${subject}\nBody: ${body}\n==================\n`);
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    throw new AppError('[sendMail] RESEND_API_KEY is not set on Render', 500);
  }
  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    text: body,
  });
  if (error) {
    console.error('Email sending failed:', error);
    throw new AppError('Unable to send email. Please try again.', 500);
  }
};

export default resend;
