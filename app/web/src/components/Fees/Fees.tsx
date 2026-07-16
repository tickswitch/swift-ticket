import { Link } from "react-router";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { priceCap, MIN_FEE, BUYER_FEE_RATE } from "@/utils/priceCap";

const FeeRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-black/5 dark:border-white/10 last:border-0">
    <span className="text-[#606060] dark:text-slate-400 font-proximaRegular text-sm">{label}</span>
    <span className="font-mono text-[#181818] dark:text-slate-50 text-sm">{value}</span>
  </div>
);

const Fees = () => {
  // Worked example: a mid-priced concert ticket, listed at the maximum allowed price.
  const exampleFace = 2500;
  const exampleListing = priceCap.maxListingPrice(exampleFace);
  const exampleBuyerFee = priceCap.buyerFee(exampleListing);
  const exampleTotalPaid = priceCap.totalBuyerPays(exampleListing);
  const exampleSellerFee = priceCap.sellerFee(exampleListing);
  const exampleSellerReceives = priceCap.sellerReceives(exampleListing);

  // Worked example: a low-priced ticket, where the ₹25 minimum fee kicks in.
  const lowFace = 300;
  const lowBuyerFee = priceCap.buyerFee(lowFace);
  const lowTotalPaid = priceCap.totalBuyerPays(lowFace);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div>
      {/* Hero */}
      <section
        className="w-full bg-[#0F172A] hero-orbs -mt-10 -mx-5 lg:mx-0"
        style={{ padding: "112px 24px 64px" }}
        data-testid="fees-hero"
      >
        <div className="max-w-[820px] mx-auto text-center">
          <span className="text-[#5B8DFF] font-proximaSemiBold text-sm tracking-wide uppercase">
            Fees &amp; price cap
          </span>
          <h1 className="mt-3 text-white text-4xl md:text-5xl font-proximaBold tracking-tight leading-tight">
            No hidden charges. <em className="font-fraunces italic font-medium">Ever.</em>
          </h1>
          <p className="mt-5 text-white/70 font-proximaRegular text-base md:text-lg max-w-[600px] mx-auto">
            One rate for buyers, one for sellers, a ₹{MIN_FEE} floor on small tickets,
            and a hard cap on how high any listing can go. That's the whole model.
          </p>
        </div>
      </section>

      {/* Buyer / Seller fee cards */}
      <section className="w-full bg-white dark:bg-[#0B0F1A]" style={{ padding: "64px 24px" }}>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer */}
          <div className="glass-card p-8">
            <h2 className="text-[#181818] dark:text-slate-50 text-xl font-proximaSemiBold mb-1">
              If you're buying
            </h2>
            <p className="text-[#606060] dark:text-slate-400 font-proximaRegular text-sm mb-6">
              6% platform fee, minimum ₹{MIN_FEE}, added at checkout. The price you
              see at checkout is the price you pay — nothing added after.
            </p>
            <div className="rounded-xl bg-[#F8F9FA] dark:bg-white/[0.04] p-5">
              <p className="text-[#606060] dark:text-slate-400 font-proximaRegular text-xs mb-3">
                Example — ₹{exampleFace.toLocaleString("en-IN")} face value ticket, listed at the cap
              </p>
              <FeeRow label="Listing price" value={inr(exampleListing)} />
              <FeeRow label="Buyer fee (6%)" value={inr(exampleBuyerFee)} />
              <div className="flex items-center justify-between pt-3">
                <span className="text-[#181818] dark:text-slate-50 font-proximaSemiBold text-sm">
                  You pay
                </span>
                <span className="font-mono text-[#181818] dark:text-slate-50 text-lg font-semibold">
                  {inr(exampleTotalPaid)}
                </span>
              </div>
            </div>
          </div>

          {/* Seller */}
          <div className="glass-card p-8">
            <h2 className="text-[#181818] dark:text-slate-50 text-xl font-proximaSemiBold mb-1">
              If you're selling
            </h2>
            <p className="text-[#606060] dark:text-slate-400 font-proximaRegular text-sm mb-6">
              6% platform fee, minimum ₹{MIN_FEE}, taken from your payout — not billed
              separately. You see your exact take-home before you confirm the listing.
            </p>
            <div className="rounded-xl bg-[#F8F9FA] dark:bg-white/[0.04] p-5">
              <p className="text-[#606060] dark:text-slate-400 font-proximaRegular text-xs mb-3">
                Example — same ₹{exampleListing.toLocaleString("en-IN")} listing
              </p>
              <FeeRow label="Listing price" value={inr(exampleListing)} />
              <FeeRow label="Seller fee (6%)" value={`− ${inr(exampleSellerFee)}`} />
              <div className="flex items-center justify-between pt-3">
                <span className="text-[#181818] dark:text-slate-50 font-proximaSemiBold text-sm">
                  You receive
                </span>
                <span className="font-mono text-[#181818] dark:text-slate-50 text-lg font-semibold">
                  {inr(exampleSellerReceives)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ₹25 minimum explainer */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#0F172A]" style={{ padding: "48px 24px" }}>
        <div className="max-w-[1000px] mx-auto glass-card p-8">
          <h3 className="text-[#181818] dark:text-slate-50 text-lg font-proximaSemiBold mb-2">
            Why there's a ₹{MIN_FEE} minimum
          </h3>
          <p className="text-[#606060] dark:text-slate-400 font-proximaRegular text-sm leading-relaxed mb-5">
            6% of a low-priced ticket can round down to a few rupees — not enough to
            cover QR verification and escrow handling. Below ₹{Math.round(MIN_FEE / BUYER_FEE_RATE)},
            the fee is a flat ₹{MIN_FEE} instead of 6%.
          </p>
          <div className="rounded-xl bg-white dark:bg-white/[0.04] p-5 max-w-[420px]">
            <p className="text-[#606060] dark:text-slate-400 font-proximaRegular text-xs mb-3">
              Example — ₹{lowFace.toLocaleString("en-IN")} ticket
            </p>
            <FeeRow label="Ticket price" value={inr(lowFace)} />
            <FeeRow label={`Buyer fee (₹${MIN_FEE} minimum)`} value={inr(lowBuyerFee)} />
            <div className="flex items-center justify-between pt-3">
              <span className="text-[#181818] dark:text-slate-50 font-proximaSemiBold text-sm">
                You pay
              </span>
              <span className="font-mono text-[#181818] dark:text-slate-50 text-lg font-semibold">
                {inr(lowTotalPaid)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Price cap */}
      <section className="w-full bg-white dark:bg-[#0B0F1A]" style={{ padding: "56px 24px" }}>
        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center gap-8">
          <ShieldCheck size={40} color="#2563EB" className="shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-[#181818] dark:text-slate-50 text-xl font-proximaSemiBold mb-2">
              No listing can go past 20% above face value
            </h3>
            <p className="text-[#606060] dark:text-slate-400 text-sm font-proximaRegular leading-relaxed">
              A ₹{exampleFace.toLocaleString("en-IN")} ticket can be listed for at most{" "}
              <span className="font-mono text-[#181818] dark:text-slate-50">
                {inr(exampleListing)}
              </span>{" "}
              — the cap is checked on the server every time a ticket is listed, not
              just enforced in the UI. See how we handle{" "}
              <Link to="/trust-and-safety" className="text-[#2563EB] hover:underline">
                refunds and disputes
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Why fees exist */}
      <section className="w-full bg-[#F8F9FA] dark:bg-[#0F172A]" style={{ padding: "64px 24px" }}>
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-center text-[#181818] dark:text-slate-50 text-2xl md:text-3xl font-proximaBold tracking-tight mb-10">
            What the fee actually pays for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "QR verification", text: "Every ticket checked against its original booking before listing and again at the gate." },
              { title: "SecureSwap escrow", text: "Your payment held safely until the ticket is confirmed valid — for every single order." },
              { title: "Human support", text: "A support team that can look into a specific order, not just a help-article search box." },
            ].map((item) => (
              <div key={item.title} className="glass-card p-6">
                <h3 className="text-[#181818] dark:text-slate-50 text-base font-proximaSemiBold mb-2">
                  {item.title}
                </h3>
                <p className="text-[#606060] dark:text-slate-400 text-sm font-proximaRegular leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="w-full bg-[#0F172A]" style={{ padding: "56px 24px" }}>
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center gap-5">
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to="/events"
              style={{ backgroundColor: "#2563EB" }}
              className="font-proximaSemiBold text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
            >
              Browse events
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/howtosell"
              style={{ borderColor: "#2563EB", color: "#2563EB" }}
              className="font-proximaSemiBold bg-white rounded-full px-6 py-2.5 border-2 hover:bg-gray-50 transition-colors"
            >
              Sell your ticket
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fees;
