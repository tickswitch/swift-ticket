import {
  profile1,
  profile2,
  profile3,
  profile4,
  profile5,
  profile6,
  rupe,
} from "@/assets";
import Container from "@/components/Common/Container";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useParams } from "react-router";
import { TickertAlertIcons } from "../TicketAlerts/TickertAlertIcons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetSingleData, PostData } from "@/API/API";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import RazorpayCheckout from "@/components/PaymentMethod/RazorpayCheckout";
import PaymentSuccessScreen from "@/components/PaymentMethod/PaymentSuccessScreen";
import TicketListingCard, { type ResaleTicket } from "./TicketListingCard";
import ShareListingButton from "./ShareListingButton";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bell, ChevronLeft, Lock, Shield } from "lucide-react";
import { formatShortDate } from "@/lib/formatDate";
 

const tickets = [
  {
    id: 1,
    quantity: 1,
    stock: 2,
    category: "VIP Gallery",
    pricePerTicket: 200.0,
    currencyIcon: rupe,
    image: profile1,
    original_ticket_price: 400.0,
    time: "Today, 9:00 PM",
    name: "Leganes Osasuna",
    place: "Estadio Municipal da Butarque,Leganes",
    totalPrice: 0.0,
    newquantity: 0,
  },
  {
    id: 2,
    quantity: 1,
    stock: 1,
    category: "Regular",
    pricePerTicket: 150.0,
    currencyIcon: rupe,
    image: profile2,
    original_ticket_price: 400.0,
    time: "Today, 9:00 PM",
    name: "Leganes Osasuna",
    place: "Estadio Municipal de Butarque, Leganes",
    totalPrice: 0.0,
  },
  {
    id: 3,
    quantity: 1,
    stock: 3,
    category: "VIP Gallery",
    pricePerTicket: 300.0,
    currencyIcon: rupe,
    image: profile3,
    original_ticket_price: 350.0,
    time: "Today, 7:30 PM",
    name: "Real Zaragoza vs Eibar",
    place: "La Romareda, Zaragoza",
    totalPrice: 0.0,
  },
  {
    id: 4,
    quantity: 1,
    stock: 5,
    category: "Regular",
    pricePerTicket: 150.0,
    currencyIcon: rupe,
    image: profile4,
    original_ticket_price: 420.0,
    time: "Tomorrow, 6:00 PM",
    name: "Malaga CF vs Albacete",
    place: "La Rosaleda, Malaga",
    totalPrice: 0.0,
  },
  {
    id: 5,
    quantity: 1,
    stock: 10,
    category: "VIP Gallery",
    pricePerTicket: 300.0,
    currencyIcon: rupe,
    image: profile5,
    original_ticket_price: 380.0,
    time: "Tomorrow, 8:00 PM",
    name: "Sporting Gijon vs Tenerife",
    place: "El Molinon, Gijon",
    totalPrice: 0.0,
  },
  {
    id: 6,
    quantity: 1,
    stock: 20,
    category: "Regular",
    pricePerTicket: 150.0,
    currencyIcon: rupe,
    image: profile6,
    original_ticket_price: 410.0,
    time: "Today, 10:00 PM",
    name: "Racing Santander vs Huesca",
    place: "Campos de Sport de El Sardinero, Santander",
    totalPrice: 0.0,
  },
];

localStorage.setItem("availableTickets", JSON.stringify(tickets));

type SelectedTicket = {
  id: number | string;
  price: number;
  original_face_value?: number;
  originalFaceValue?: number;
  ticket_type?: string;
};

interface TicketsByTypeResponse {
  event_id: string;
  ticket_type: string;
  total_available_quantity_type: number;
  tickets: ResaleTicket[];
}

const AvailableTicket = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SelectedTicket | null>(
    null
  );
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { id, name } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets-by-types", id, name],
    queryFn: () => GetSingleData(`events/${id}/tickets/${name}`),
  });

  const ticketsData = data?.data as TicketsByTypeResponse | undefined;
  const allTickets = ticketsData?.tickets ?? [];
  const availableCount = allTickets.length;
  const totalSold = allTickets.reduce((sum, t) => sum + (t.sold_quantity ?? 0), 0);
  const soldTickets = allTickets.filter((t) => t.sold_quantity > 0);
  const ticketTypeLabel = name
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : (ticketsData?.ticket_type ?? "");

  // Hero data — pulled from the first ticket row (stored at listing time, no extra API call)
  const firstTicket = allTickets[0];
  const eventTitle = firstTicket?.title ?? `${ticketTypeLabel} Tickets`;
  const eventVenue = firstTicket?.venue ?? null;
  const rawDate = firstTicket?.start_date
    ? String(firstTicket.start_date).split("T")[0]
    : null;
  const rawTime = firstTicket?.time ?? null;
  const formattedDate = formatShortDate(rawDate, rawTime);
  const formattedTime = rawTime
    ? (() => {
        try {
          return new Intl.DateTimeFormat("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(`2000-01-01T${rawTime}`));
        } catch {
          return null;
        }
      })()
    : null;
  const eventDateLine = [formattedDate, formattedTime].filter(Boolean).join(" · ");

  useEffect(() => {
    const savedState = localStorage.getItem(`notification_${id}`);
    if (savedState !== null) {
      setIsNotificationOn(JSON.parse(savedState));
    }
    setIsInitialized(true);
  }, [id]);

  const notification = useMutation({
    mutationKey: ["notification"],
    mutationFn: (payload) => {
      // Replace with your actual API call
      return PostData(`events/notification/${id}`, payload);
      // return Promise.resolve(payload);
    },
    onSuccess: (data) => {
      // Backend sends status: "on" | "off"
      const newState = data?.status === "on";

      setIsNotificationOn(newState);
      localStorage.setItem(`notification_${id}`, JSON.stringify(newState));

      toast.success(
        data?.message ||
          `Notification ${newState ? "enabled" : "disabled"} successfully`
      );
      console.log("Notification response:", data);
    },

    onError: (err) => {
      toast.error(err?.message || "Failed to apply changes");
      // Revert the switch state on error
      setIsNotificationOn((prev) => prev);
    },
  });

  const handleNotificationToggle = (checked) => {
    // Update UI immediately for better UX
    setIsNotificationOn(checked);

    // Send API request with correct notify value
    const notifyValue = checked ? true : false;
    const payload = { notify: notifyValue };

    notification.mutate(payload);
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <ErrorText />
  ) : (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 py-[50px] overflow-hidden">
      {/* Page-level blobs — cards' backdrop-blur blurs these for the frosted glass effect */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#2563EB]/[0.08] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#93C5FD]/[0.10] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-3xl mx-auto px-4">

        {/* ── Event Hero Banner ── */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-[#0a0f1e] to-[#1e3a5f] relative min-h-[210px] flex flex-col justify-between p-6">
            {/* Right-side blue accent glow */}
            <div className="absolute top-0 right-0 bottom-0 w-2/5 bg-gradient-to-l from-[#2563EB]/[0.18] to-transparent pointer-events-none" aria-hidden="true" />
            {/* Subtle top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden="true" />
            {/* Decorative bottom-right circle */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#2563EB]/[0.08] blur-2xl pointer-events-none" aria-hidden="true" />

            {/* Back to event link */}
            <button
              type="button"
              onClick={() => navigate(`/event-details/${id}`)}
              className="flex items-center gap-1 text-white/50 hover:text-white/90 text-sm font-proximaRegular transition-colors duration-200 cursor-pointer w-fit"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Back to event
            </button>

            {/* Event identity */}
            <div className="relative mt-6">
              <h1 className="text-white text-2xl sm:text-3xl font-proximaBold leading-tight mb-2 [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
                {eventTitle}
              </h1>
              {eventDateLine || eventVenue ? (
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-white/50 text-sm font-proximaRegular">
                  {eventDateLine && <span>{eventDateLine}</span>}
                  {eventDateLine && eventVenue && (
                    <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" aria-hidden="true" />
                  )}
                  {eventVenue && <span>{eventVenue}</span>}
                </div>
              ) : null}

              {/* Trust badge + share */}
              <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#2563EB]/25 flex items-center justify-center shrink-0">
                    <Shield className="w-3 h-3 text-[#2563EB]" aria-hidden="true" />
                  </div>
                  <span className="text-white/35 text-xs font-proximaRegular tracking-widest uppercase">
                    SwiftTickets Buyer Protection
                  </span>
                </div>
                <ShareListingButton
                  eventName={eventTitle}
                  price={Number(firstTicket?.price ?? 0)}
                  listingId={`${id ?? ""}/${name ?? ""}`}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Page header */}
        <div className="text-center mb-6">
          <p className="text-black sm:text-4xl text-3xl font-proximaSemiBold">
            {ticketTypeLabel} Tickets
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-[#606060] text-base font-proximaRegular flex-wrap">
            <span>{availableCount} available</span>
            <span className="text-[#D1D5DB]" aria-hidden="true">•</span>
            <span>{totalSold} fans going</span>
            <span className="text-[#D1D5DB]" aria-hidden="true">•</span>
            <span>0 watching</span>
          </div>
        </div>

        {/* Ticket Alerts */}

        {/* {isInitialized && (
          <div className="my-6 mx-auto flex justify-between items-center gap-2 sm:p-4 p-3 sm:w-4/6 w-full  border border-[#FF6D00] rounded-xl  bg-[#FF7E35]/10">
            <div className="flex gap-2 items-center justify-center">
              <p className="bg-[#FF7E35] p-4 rounded-md ">
                <TickertAlertIcons />
              </p>
              <div>
                <p className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold">
                  Ticket alerts
                </p>
                <p className="text-[#949494] sm:text-base text-sm font-proximaRegular">
                  Get notified when a ticket becomes available
                </p>
              </div>
            </div>
          </div>
        )} */}
        <div id="ticket-alerts" className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 bg-[#FF6D00]/10 border border-[#FF6D00] rounded-2xl p-4">
          <div className="flex items-center gap-2 w-full">
            <p className="bg-[#FF7E35] p-4 rounded-md">
              <TickertAlertIcons />
            </p>
            <div className="w-full">
              <p className="text-2xl font-semibold text-[#606060]">
                Ticket alerts
              </p>
              <p className="text-gray-600">
                Get notified when a ticket becomes available
              </p>
            </div>
          </div>
          <Switch
            id="notification-switch"
            on="ON"
            off="OFF"
            checked={isNotificationOn}
            onCheckedChange={handleNotificationToggle}
            disabled={notification.isLoading}
          />
        </div>

        <div className="flex items-center justify-between py-4">
          <p className="text-[#181818] text-2xl font-proximaSemiBold">
            Available
          </p>
          <button
            type="button"
            onClick={() => navigate("/sell-tickets")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#2563EB] text-[#2563EB] text-sm font-proximaSemiBold hover:bg-[#2563EB]/5 active:bg-[#2563EB]/10 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB] focus-visible:outline-offset-2"
          >
            Sell your tickets
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {allTickets.map((ticket, i) => (
            <TicketListingCard
              key={ticket.id}
              ticket={ticket}
              index={i}
              listingId={`${id ?? ""}/${name ?? ""}`}
              onBuyNow={(t) => {
                const token = localStorage.getItem("token");
                if (!token) {
                  navigate(
                    `/auth/login?returnUrl=${encodeURIComponent(
                      window.location.pathname
                    )}`
                  );
                  return;
                }
                setSelectedTicket(t);
                setPaymentDone(false);
                setPaymentId("");
                setShowPayment(true);
              }}
            />
          ))}
        </div>

        {/* Empty state nudge — shown when fewer than 5 listings */}
        {availableCount < 5 && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl mt-4"
          >
            {/* Soft glass blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/[0.06] to-[#93C5FD]/[0.04] rounded-2xl" aria-hidden="true" />
            <div className="relative backdrop-blur-md bg-white/50 border border-white/60 ring-1 ring-[#2563EB]/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
              </div>
              <h3 className="text-[#0F172A] text-lg font-proximaSemiBold mb-1">
                More tickets drop soon
              </h3>
              <p className="text-[#475569] text-sm font-proximaRegular mb-4 max-w-xs mx-auto">
                Get notified the moment new tickets are listed for this show.
              </p>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("ticket-alerts")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-1.5 text-[#2563EB] text-sm font-proximaSemiBold hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB] focus-visible:outline-offset-2"
              >
                Turn on ticket alerts
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Recently sold section */}
        {soldTickets.length > 0 && (
          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
            aria-label="Recently sold tickets"
            className="mt-4"
          >
            <div className="flex items-center gap-2 py-4">
              <Lock className="w-4 h-4 text-[#94A3B8]" aria-hidden="true" />
              <p className="text-[#94A3B8] text-lg font-proximaSemiBold">
                Recently sold
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {soldTickets.map((ticket, i) => (
                <div key={ticket.id} className="opacity-70">
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: i * 0.05,
                    }}
                    className="relative overflow-hidden rounded-2xl"
                    aria-label={`Sold ${ticket.ticket_type} ticket at ₹${Number(ticket.price).toLocaleString("en-IN")}`}
                  >
                    {/* Muted gradient blob */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300/10 to-slate-200/5 rounded-2xl" />

                    {/* Glass surface — muted */}
                    <div className="relative backdrop-blur-md bg-white/40 border border-white/50 ring-1 ring-slate-200/60 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-500 text-sm font-proximaSemiBold capitalize truncate">
                            {ticket.ticket_type}
                          </p>
                          <p className="text-slate-400 text-xs font-proximaRegular">
                            {ticket.sold_quantity} sold
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-slate-400 text-xs font-proximaRegular mb-0.5">
                          Sold at
                        </p>
                        <p className="text-slate-500 text-lg font-proximaBold leading-none">
                          ₹{Number(ticket.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Razorpay payment sheet */}
        <Sheet
          open={showPayment}
          onOpenChange={(open) => {
            setShowPayment(open);
            if (!open) {
              setPaymentDone(false);
              setPaymentId("");
            }
          }}
        >
          <SheetContent
            side="right"
            className="w-full sm:max-w-xl bg-[#F4F4F4] overflow-y-auto"
            data-testid="payment-sheet"
          >
            <SheetHeader>
              <SheetTitle className="sr-only">Complete your payment</SheetTitle>
              <SheetDescription className="sr-only">
                Order summary and secure Razorpay checkout
              </SheetDescription>
            </SheetHeader>
            <div className="p-4 sm:p-6 flex items-start justify-center">
              {selectedTicket && !paymentDone && (
                <RazorpayCheckout
                  ticketId={String(selectedTicket.id)}
                  listingPrice={Number(selectedTicket.price) || 0}
                  faceValue={
                    Number(
                      selectedTicket.original_face_value ??
                        selectedTicket.originalFaceValue ??
                        selectedTicket.price
                    ) || 0
                  }
                  eventName={data?.data?.tickets?.[0]?.title ?? "Your ticket"}
                  onSuccess={(pid) => {
                    setPaymentId(pid);
                    setPaymentDone(true);
                  }}
                  onError={(msg) => {
                    toast.error(msg);
                    setShowPayment(false);
                  }}
                  onCancel={() => setShowPayment(false)}
                />
              )}
              {selectedTicket && paymentDone && (
                <PaymentSuccessScreen
                  paymentId={paymentId}
                  eventName={data?.data?.tickets?.[0]?.title ?? "Your ticket"}
                  onDone={() => {
                    setShowPayment(false);
                    navigate("/tickets");
                  }}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default AvailableTicket;
