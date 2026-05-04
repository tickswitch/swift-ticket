import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";

export interface PaymentSuccessScreenProps {
  paymentId: string;
  eventName: string;
  onDone: () => void;
}

const PaymentSuccessScreen = ({
  paymentId,
  eventName,
  onDone,
}: PaymentSuccessScreenProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full mx-auto flex flex-col items-center text-center"
      data-testid="payment-success-screen"
    >
      <CheckCircle2
        size={64}
        className="text-[#2FA75F] mb-4"
        data-testid="payment-success-icon"
      />

      <h3 className="text-[#181818] text-2xl sm:text-[32px] font-semibold mb-2">
        You're going!
      </h3>

      <p
        className="text-[#606060] text-base sm:text-lg mb-1"
        data-testid="payment-success-event"
      >
        Ticket confirmed for {eventName}
      </p>

      <p className="text-[#606060] text-sm sm:text-base mb-4">
        Check your WhatsApp and email for your ticket
      </p>

      <p
        className="text-[#9F9F9F] text-xs sm:text-sm mb-6 break-all"
        data-testid="payment-success-payment-id"
      >
        Payment ID: {paymentId}
      </p>

      <button
        type="button"
        onClick={onDone}
        data-testid="view-my-tickets-btn"
        style={{ backgroundColor: "#2563EB" }}
        className="w-full rounded-full text-white font-semibold text-lg py-3 sm:py-4 hover:opacity-90 transition-opacity cursor-pointer mb-3"
      >
        View my tickets
      </button>

      <button
        type="button"
        onClick={() => navigate("/")}
        data-testid="back-to-events-link"
        className="text-[#606060] text-base hover:text-[#181818] underline transition-colors cursor-pointer"
      >
        Back to events
      </button>
    </div>
  );
};

export default PaymentSuccessScreen;
