import { Link } from "react-router";
import {
  ShieldCheck,
  QrCode,
  Wallet,
  Ban,
  CalendarX,
  UserX,
  Lock,
  LifeBuoy,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { priceCap } from "@/utils/priceCap";

const escrowSteps = [
  {
    num: "1",
    title: "Buyer pays into SecureSwap",
    text: "Your payment is held by SecureSwap, not sent to the seller — via Razorpay, UPI, or card.",
  },
  {
    num: "2",
    title: "Seller sends the ticket",
    text: "The seller transfers the ticket through SwiftTickets. Its QR code is checked against the original booking.",
  },
  {
    num: "3",
    title: "You scan in at the gate",
    text: "The ticket works, or it doesn't — either way we know within seconds of entry.",
  },
  {
    num: "4",
    title: "Seller gets paid",
    text: "Funds release to the seller's bank account only after your ticket is confirmed valid.",
  },
];

const scenarios = [
  {
    icon: Ban,
    title: "Ticket doesn't scan at the gate",
    remedy: "Full refund, including your buyer fee.",
    timeline: "Refund initiated same day, credited in 5–7 working days.",
  },
  {
    icon: CalendarX,
    title: "Event is cancelled or postponed",
    remedy: "Full refund automatically — no dispute needed.",
    timeline: "Refund initiated within 48 hours of the organiser's cancellation notice.",
  },
  {
    icon: UserX,
    title: "Seller never sends the ticket",
    remedy: "Full refund. Payment was never released to them.",
    timeline: "Refund initiated once the delivery window lapses, 5–7 working days to credit.",
  },
];

const faqs = [
  {
    q: "What is SecureSwap?",
    a: "SecureSwap is SwiftTickets' escrow system. When you buy a resale ticket, your payment sits with SecureSwap — not the seller — until your ticket is confirmed valid at the event. The seller is paid only after that check clears.",
  },
  {
    q: "How do you verify a ticket is real?",
    a: "Every resold ticket's QR code is checked against the original event booking before it's listed, and again when it's scanned at entry. A ticket that's already been used or doesn't match the original booking is caught before you pay, or refunded in full if something slips through.",
  },
  {
    q: "Is reselling tickets on SwiftTickets legal in India?",
    a: "SwiftTickets caps every resale at 20% above face value, in line with how Indian consumer protection rules on ticket resale are generally applied. Some events and venues (certain sports fixtures in particular) restrict resale entirely in their own terms — we block listings for those where we're aware of the restriction.",
  },
  {
    q: "What if I never get my refund?",
    a: "Refunds are processed automatically by our system, not manually per request. If yours hasn't arrived in 7 working days, contact support with your order ID and we'll trace the payment.",
  },
];

const TrustSafety = () => {
  const exampleFace = 2500;
  const exampleListing = priceCap.maxListingPrice(exampleFace);

  return (
    <div>
      {/* Hero */}
      <section
        className="w-full bg-[#0F172A] hero-orbs"
        style={{ padding: "72px 24px 64px" }}
        data-testid="trust-safety-hero"
      >
        <div className="max-w-[900px] mx-auto text-center">
          <span className="text-[#5B8DFF] font-proximaSemiBold text-sm tracking-wide uppercase">
            Trust &amp; Safety
          </span>
          <h1 className="mt-3 text-white text-4xl md:text-5xl font-proximaBold tracking-tight leading-tight">
            Payment protected until your ticket is{" "}
            <em className="font-fraunces italic font-medium">
              confirmed real
            </em>
            .
          </h1>
          <p className="mt-5 text-white/70 font-proximaRegular text-base md:text-lg max-w-[640px] mx-auto">
            Every SwiftTickets purchase runs through SecureSwap escrow. The seller
            isn't paid until your ticket scans at the gate.
          </p>
        </div>
      </section>

      {/* Escrow steps */}
      <section className="w-full bg-white dark:bg-[#0B0F1A]" style={{ padding: "64px 24px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-[#181818] dark:text-slate-50 text-2xl md:text-3xl font-proximaBold tracking-tight mb-12">
            How SecureSwap escrow works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {escrowSteps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center md:items-start md:text-left">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-lg font-proximaBold mb-4"
                  style={{ backgroundColor: "#2563EB" }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>
                <h3 className="text-[#181818] dark:text-slate-50 text-lg font-proximaSemiBold mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[#606060] dark:text-slate-400 text-sm font-proximaRegular leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified QR + payment security */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#0F172A]" style={{ padding: "64px 24px" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 flex flex-col gap-3">
            <QrCode size={28} color="#2563EB" aria-hidden="true" />
            <h3 className="text-[#181818] dark:text-slate-50 text-xl font-proximaSemiBold">
              Verified QR, checked twice
            </h3>
            <p className="text-[#606060] dark:text-slate-400 text-sm font-proximaRegular leading-relaxed">
              Every ticket is matched against its original booking before it's listed,
              and scanned again at your event's entry gate. A ticket that's already
              been used, or doesn't match the original, never gets to be sold twice.
            </p>
          </div>
          <div className="glass-card p-8 flex flex-col gap-3">
            <Wallet size={28} color="#2563EB" aria-hidden="true" />
            <h3 className="text-[#181818] dark:text-slate-50 text-xl font-proximaSemiBold">
              Payments via Razorpay, not us
            </h3>
            <p className="text-[#606060] dark:text-slate-400 text-sm font-proximaRegular leading-relaxed">
              UPI, cards, and wallets are processed by Razorpay. SwiftTickets never
              stores your card number, CVV, or UPI PIN — we only ever see the
              payment's status.
            </p>
          </div>
        </div>
      </section>

      {/* What-if scenarios */}
      <section className="w-full bg-white dark:bg-[#0B0F1A]" style={{ padding: "64px 24px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-[#181818] dark:text-slate-50 text-2xl md:text-3xl font-proximaBold tracking-tight mb-2">
            If something goes wrong
          </h2>
          <p className="text-center text-[#606060] dark:text-slate-400 font-proximaRegular text-base mb-12">
            Three situations we cover, and exactly what happens next.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="glass-card p-6 flex flex-col gap-3">
                  <Icon size={24} color="#EF4444" aria-hidden="true" />
                  <h3 className="text-[#181818] dark:text-slate-50 text-base font-proximaSemiBold">
                    {s.title}
                  </h3>
                  <p className="text-[#181818] dark:text-slate-50 text-sm font-proximaRegular">
                    {s.remedy}
                  </p>
                  <p className="text-[#606060] dark:text-slate-400 text-xs font-proximaRegular">
                    {s.timeline}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Price cap as protection */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#0F172A]" style={{ padding: "64px 24px" }}>
        <div className="max-w-[900px] mx-auto glass-card p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <ShieldCheck size={40} color="#2563EB" className="shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-[#181818] dark:text-slate-50 text-xl font-proximaSemiBold mb-2">
              Prices are capped at 20% above face value
            </h3>
            <p className="text-[#606060] dark:text-slate-400 text-sm font-proximaRegular leading-relaxed">
              A ₹{exampleFace.toLocaleString("en-IN")} ticket can never be listed above{" "}
              <span className="font-mono text-[#181818] dark:text-slate-50">
                ₹{exampleListing.toLocaleString("en-IN")}
              </span>{" "}
              on SwiftTickets — enforced on every listing, not just promised in marketing copy.
              See the full{" "}
              <Link to="/fees" className="text-[#2563EB] hover:underline">
                fee and price cap breakdown
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-white dark:bg-[#0B0F1A]" style={{ padding: "64px 24px" }} data-testid="trust-safety-faq">
        <div className="max-w-[760px] mx-auto">
          <h2 className="text-center text-[#181818] dark:text-slate-50 text-2xl md:text-3xl font-proximaBold tracking-tight mb-10">
            Common questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="text-[#181818] dark:text-slate-50 font-proximaSemiBold text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#606060] dark:text-slate-400 font-proximaRegular text-sm leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="w-full bg-[#0F172A]" style={{ padding: "56px 24px" }}>
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center gap-5">
          <Lock size={28} color="#5B8DFF" aria-hidden="true" />
          <p className="text-white font-proximaSemiBold text-lg">
            Still unsure? Our support team can walk you through any listing before you pay.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to="/events"
              style={{ backgroundColor: "#2563EB" }}
              className="font-proximaSemiBold text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
            >
              Browse events
            </Link>
            <Link
              to="/help"
              style={{ borderColor: "#2563EB", color: "#2563EB" }}
              className="font-proximaSemiBold bg-white rounded-full px-6 py-2.5 border-2 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <LifeBuoy size={16} aria-hidden="true" />
              Contact support
            </Link>
          </div>
        </div>
      </section>

      {/* FAQPage structured data — static, hardcoded copy above, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
};

export default TrustSafety;
