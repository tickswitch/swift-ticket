import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Price cap helpers (mirror priceCap.ts — no cross-package import in seed)
const SELLER_FEE = 0.05;
const BUYER_SERVICE_FEE = 0.06;
const BUYER_TX_FEE = 0.03;
const computeFees = (price: number) => ({
  buyerFee:        Math.ceil(price * BUYER_SERVICE_FEE),
  sellerFee:       Math.ceil(price * SELLER_FEE),
  totalBuyerPays:  price + Math.ceil(price * BUYER_SERVICE_FEE) + Math.ceil(price * BUYER_TX_FEE),
  sellerReceives:  price - Math.ceil(price * SELLER_FEE),
  maxAllowedPrice: Math.floor(price * 1.2),
});

async function main() {
  // 1. Find or create a seed seller user
  let user = await prisma.user.findFirst({ where: { email: 'seed-seller@swifttickets.dev' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Priya Sharma',
        email: 'seed-seller@swifttickets.dev',
        password: await bcrypt.hash('seed-password-123', 10),
        role: 'user',
        status: 'active',
        phone: '9876543210',
      },
    });
    console.log(`Created seed user: ${user.name} (id=${user.id})`);
  } else {
    console.log(`Using existing seed user: ${user.name} (id=${user.id})`);
  }

  // 2. Find or create a FinancialProfile for the seed user
  let profile = await prisma.financialProfile.findFirst({ where: { user_id: user.id } });
  if (!profile) {
    profile = await prisma.financialProfile.create({
      data: {
        user_id: user.id,
        address: '12 MG Road',
        city: 'Bengaluru',
        country_of_residence: 'India',
        postal_code: '560001',
        bank_country: 'India',
        account_holder_name: 'Priya Sharma',
        phone_number: '9876543210',
        bank_account_number: '000000000000',
      },
    });
    console.log(`Created financial profile (id=${profile.id})`);
  } else {
    console.log(`Using existing financial profile (id=${profile.id})`);
  }

  const EVENT_ID = '1AvjZ_kGkYiS73P';

  // 3. Skip if a seed ticket for this event already exists
  const existing = await prisma.resaleTicket.findFirst({
    where: { event_id: EVENT_ID, user_id: user.id },
  });
  if (existing) {
    console.log(`Seed ticket already exists (id=${existing.id}). Skipping.`);
    return;
  }

  // 4. Ticket data — ₹1 500 face value, ₹1 700 listing (< 120% cap of ₹1 800)
  const faceValue = 1500;
  const listingPrice = 1700;
  const fees = computeFees(listingPrice);

  const ticket = await prisma.resaleTicket.create({
    data: {
      user_id: user.id,
      financial_profile_id: profile.id,
      event_id: EVENT_ID,
      ticketmaster_id: EVENT_ID,
      title: 'Test Event (Seed)',
      venue: 'Palace Grounds, Bengaluru',
      artist: 'SwiftTickets Dev',
      category: 'Music',
      ticket_type: 'General',
      quantity: 3,
      reserved_quantity: 0,
      sold_quantity: 0,
      original_price: faceValue,
      price: listingPrice,
      originalFaceValue: faceValue,
      maxAllowedPrice: fees.maxAllowedPrice,
      buyerFee: fees.buyerFee,
      sellerFee: fees.sellerFee,
      sellerReceives: fees.sellerReceives,
      totalBuyerPays: fees.totalBuyerPays,
      status: 'approved',
      start_date: new Date('2025-12-15'),
      end_date: new Date('2025-12-15'),
      time: '19:00:00',
      seat_info: 'GA Floor',
      additional_info: 'Seed ticket — for local dev preview only',
    },
  });

  console.log(`\n✓ Seed ticket created:`);
  console.log(`  id              : ${ticket.id}`);
  console.log(`  event_id        : ${ticket.event_id}`);
  console.log(`  ticket_type     : ${ticket.ticket_type}`);
  console.log(`  quantity        : ${ticket.quantity}`);
  console.log(`  listing price   : ₹${listingPrice}`);
  console.log(`  face value      : ₹${faceValue}`);
  console.log(`  total buyer pays: ₹${fees.totalBuyerPays}`);
  console.log(`  status          : ${ticket.status}`);
  console.log(`\n  Preview at: /availabletickets/${EVENT_ID}/General`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
