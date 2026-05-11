import { motion, useReducedMotion } from "motion/react";
import { CheckCircle, ChevronRight, Phone, Shield, Tag, Users } from "lucide-react";
import { priceCap } from "@/utils/priceCap";
import { TicketBadge } from "@/components/Common/TicketBadge";

export interface ResaleTicket {
  id: string | number;
  quantity: number;
  reserved_quantity: number;
  sold_quantity: number;
  ticket_type: string;
  price: number | string; // Prisma Decimal serialises to string in JSON
  originalFaceValue?: number | string;
  // Event metadata stored on the ticket row at listing time
  title?: string | null;
  venue?: string | null;
  start_date?: string | Date | null;
  time?: string | null;
  artist?: string | null;
  user?: {
    avatar?: string | null;
    name?: string | null;
    phone_verified?: boolean;
  };
}

interface TicketListingCardProps {
  ticket: ResaleTicket;
  index?: number;
  onBuyNow: (ticket: ResaleTicket) => void;
}

export default function TicketListingCard({
  ticket,
  index = 0,
  onBuyNow,
}: TicketListingCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const listingPrice = Number(ticket.price);
  const faceValue = ticket.originalFaceValue
    ? Number(ticket.originalFaceValue)
    : listingPrice;
  const availableQty = Math.max(
    0,
    ticket.quantity - ticket.reserved_quantity - ticket.sold_quantity
  );
  const serviceFee = priceCap.buyerServiceFee(listingPrice);
  const txFee = priceCap.buyerTransactionFee(listingPrice);
  const totalToPay = priceCap.totalBuyerPays(listingPrice);
  const markupPct = priceCap.markupPercent(faceValue, listingPrice);

  const initials = ticket.user?.name
    ? ticket.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "S";

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.07 }}
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -3, transition: { duration: 0.2, ease: "easeOut" } }
      }
      className="relative w-full overflow-hidden rounded-2xl cursor-pointer group"
      onClick={() => onBuyNow(ticket)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onBuyNow(ticket)}
      aria-label={`Buy ${ticket.ticket_type} ticket for ₹${totalToPay.toLocaleString("en-IN")}`}
    >
      {/* Gradient blobs — backdrop-blur on the glass layer blurs these */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/[0.12] via-[#93C5FD]/[0.08] to-[#2563EB]/[0.04] rounded-2xl" />
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#2563EB]/[0.14] blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[#60A5FA]/[0.18] blur-xl pointer-events-none" />

      {/* Glass surface */}
      <div className="relative backdrop-blur-md bg-white/60 border border-white/70 shadow-md ring-1 ring-[#2563EB]/10 rounded-2xl p-4 flex flex-col gap-3 transition-shadow duration-200 group-hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] group-focus-within:ring-2 group-focus-within:ring-[#2563EB]/40">

        {/* Main content — horizontal marketplace row */}
        <div className="flex items-stretch gap-5">

          {/* LEFT — seller info, trust signals, quantity */}
          <div className="flex flex-col gap-2.5 flex-1 min-w-0">

            {/* Seller row */}
            <div className="flex items-center gap-2.5">
              {ticket.user?.avatar ? (
                <img
                  src={ticket.user.avatar}
                  alt={ticket.user.name ?? "Seller"}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2563EB]/25 shrink-0"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-proximaSemiBold shrink-0"
                >
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[#0F172A] text-sm font-proximaSemiBold leading-tight truncate">
                  {ticket.user?.name ?? "Verified Seller"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-3 h-3 text-[#2563EB] shrink-0" aria-hidden="true" />
                  <span className="text-[#2563EB] text-xs font-proximaRegular">
                    Verified Seller
                  </span>
                </div>
              </div>
            </div>

            {/* Trust signal pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200 text-xs font-proximaRegular">
                <Phone className="w-3 h-3 shrink-0" aria-hidden="true" />
                Phone verified
              </span>
              {ticket.sold_quantity > 0 ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200 text-xs font-proximaRegular">
                  <CheckCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                  {ticket.sold_quantity} sold on SwiftTickets
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200 text-xs font-proximaRegular">
                  <CheckCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                  New seller
                </span>
              )}
            </div>

            {/* Quantity + availability badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Users className="w-4 h-4 text-[#475569] shrink-0" aria-hidden="true" />
              <span className="text-[#0F172A] text-sm font-proximaSemiBold">
                {availableQty}{" "}
                {availableQty === 1 ? "ticket" : "tickets"}
              </span>
              <TicketBadge count={availableQty} />
            </div>

            {/* Face value markup — only when above face value */}
            {markupPct > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#475569] font-proximaRegular">
                <Tag className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Face ₹{faceValue.toLocaleString("en-IN")}</span>
                <span
                  className={`font-proximaSemiBold ${
                    markupPct > 15 ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  +{markupPct}%
                </span>
              </div>
            )}
          </div>

          {/* RIGHT — price, fee breakdown, CTA */}
          <div className="flex flex-col items-end justify-between gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[#475569] text-xs font-proximaRegular mb-0.5">
                Listing price
              </p>
              <p className="text-[#0F172A] text-2xl font-proximaBold leading-none">
                ₹{listingPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-[#475569] text-xs font-proximaRegular mt-1">
                +₹{(serviceFee + txFee).toLocaleString("en-IN")} fees
                <br />
                <span className="text-[#0F172A] font-proximaSemiBold">
                  ₹{totalToPay.toLocaleString("en-IN")} total
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(ticket);
              }}
              className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-proximaSemiBold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB] focus-visible:outline-offset-2 whitespace-nowrap"
              aria-label={`Buy ${ticket.ticket_type} ticket`}
            >
              Buy Now
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Perforated stub divider — horizontal, bleeds to card edges via -mx-4 */}
        <div className="flex items-center -mx-4" aria-hidden="true">
          <div className="w-5 h-5 rounded-full bg-blue-50 shrink-0" />
          <div className="flex-1 border-t-2 border-dashed border-[#2563EB]/15" />
          <div className="w-5 h-5 rounded-full bg-blue-50 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}
