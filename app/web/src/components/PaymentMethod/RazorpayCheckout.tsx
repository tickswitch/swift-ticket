import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { PostData } from "@/API/API";
import { priceCap } from "@/utils/priceCap";

export interface RazorpayCheckoutProps {
  ticketId: string;
  listingPrice: number;
  faceValue: number;
  eventName: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

interface CheckoutResponse {
  success?: boolean;
  status?: boolean;
  // Spec shape
  razorpay_order_id?: string;
  amount?: number;
  currency?: string;
  // Actual backend shape
  razorpay?: {
    order_id: string;
    amount: number;
    currency: string;
    key?: string;
  };
  message?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const RazorpayCheckout = ({
  ticketId,
  listingPrice,
  faceValue,
  eventName,
  onSuccess,
  onError,
  onCancel,
}: RazorpayCheckoutProps) => {
  const [loading, setLoading] = useState(false);

  // Read phone from stored user object for Razorpay prefill
  const stored = localStorage.getItem("user");
  const userPhone = stored
    ? (JSON.parse(stored) as { phone?: string })?.phone ?? ""
    : "";

  const markup = priceCap.markupPercent(faceValue, listingPrice);
  const platformFee = priceCap.buyerFee(listingPrice);
  const totalPay = priceCap.totalBuyerPays(listingPrice);

  const handlePay = async () => {
    if (!window.Razorpay) {
      onError("Payment gateway not loaded. Please refresh and try again.");
      return;
    }

    try {
      setLoading(true);

      // Ensure the ticket is in the cart before checkout (backend checkout is cart-based)
      try {
        await PostData("/cart/add", {
          resale_ticket_id: Number(ticketId),
          quantity: 1,
        });
      } catch {
        // If the item is already in the cart, continue; any fatal cart error will
        // surface from /checkout/ below.
      }

      // Create Razorpay order on backend
      const data = await PostData<CheckoutResponse>("/checkout/", {
        ticket_id: ticketId,
      });

      const orderId = data.razorpay?.order_id ?? data.razorpay_order_id;
      const amount = data.razorpay?.amount ?? data.amount;
      const currency = data.razorpay?.currency ?? data.currency ?? "INR";

      if (!orderId || !amount) {
        onError(data.message || "Failed to create payment order.");
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderId,
        amount: amount,
        currency: currency,
        name: "SwiftTickets",
        description: eventName,
        prefill: { contact: userPhone },
        theme: { color: "#2563EB" },
        handler: async (response: unknown) => {
          const r = response as RazorpayHandlerResponse;
          try {
            await PostData("/checkout/payment/verify", {
              razorpay_order_id: r.razorpay_order_id,
              razorpay_payment_id: r.razorpay_payment_id,
              razorpay_signature: r.razorpay_signature,
            });
            onSuccess(r.razorpay_payment_id);
          } catch {
            onError("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      razorpay.open();
      setLoading(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to initiate payment.";
      onError(msg);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-4"
        data-testid="razorpay-loading"
      >
        <BeatLoader color="#2563EB" size={12} />
        <p className="text-[#606060] text-base sm:text-lg">
          Opening payment...
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl p-5 sm:p-6 max-w-lg w-full mx-auto"
      data-testid="order-summary"
    >
      <h3 className="text-[#181818] text-2xl sm:text-[28px] font-semibold mb-4">
        Order summary
      </h3>
      <p
        className="text-[#606060] text-base sm:text-lg mb-4"
        data-testid="order-summary-event"
      >
        {eventName}
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[#606060] text-base">Ticket price</span>
          <span
            className="text-[#181818] text-base font-semibold"
            data-testid="summary-ticket-price"
          >
            ₹{listingPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#9F9F9F] text-base">Face value</span>
          <span
            className="text-[#9F9F9F] text-base"
            data-testid="summary-face-value"
          >
            ₹{faceValue.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#606060] text-base">Markup</span>
          <span
            className={
              "text-base font-medium " +
              (markup > 0 ? "text-[#FEC100]" : "text-[#2FA75F]")
            }
            data-testid="summary-markup"
          >
            {markup}% above face value
          </span>
        </div>

        <hr className="border-t border-[#E7EAEC] my-1" />

        <div className="flex items-center justify-between">
          <span className="text-[#606060] text-base">Platform fee (6%)</span>
          <span
            className="text-[#181818] text-base font-semibold"
            data-testid="summary-platform-fee"
          >
            ₹{platformFee.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[#181818] text-lg font-semibold">
            Total you pay
          </span>
          <span
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "#2563EB" }}
            data-testid="summary-total"
          >
            ₹{totalPay.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div
        className="flex items-center gap-2 mt-5 text-[#9F9F9F] text-sm"
        data-testid="summary-pay-via"
      >
        <span className="font-medium">Pay via UPI:</span>
        <span>GPay · PhonePe · Paytm · Cards</span>
      </div>

      <button
        type="button"
        onClick={handlePay}
        data-testid="razorpay-pay-btn"
        style={{ backgroundColor: "#2563EB" }}
        className="w-full mt-5 rounded-full text-white font-semibold text-lg py-3 sm:py-4 hover:opacity-90 transition-opacity cursor-pointer"
      >
        Pay ₹{totalPay.toLocaleString("en-IN")}
      </button>

      <button
        type="button"
        onClick={() => onCancel?.()}
        data-testid="razorpay-cancel-link"
        className="w-full mt-3 text-center text-[#606060] text-base hover:text-[#181818] transition-colors cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
};

export default RazorpayCheckout;
