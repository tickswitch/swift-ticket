import { cartDelete, headerSearchIcon, ibtn } from "@/assets";
import Container from "../Common/Container";
import { useLocation, useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import CheckElement from "../AddToCart/CheckElement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetSingleData, PostData } from "@/API/API";
import { getLocalTime } from "@/lib/getLocalTime";
import { formatEventDate } from "@/lib/formatEventDate";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import toast from "react-hot-toast";
import { TicketIcon } from "lucide-react";
import { sortByDistance } from "@/lib/sortByDistance";

// Types
interface CartItem {
  id: number;
  quantity: number;
  total_price: number;
  newquantity: number;
  place: string;
  name?: string; // Added to match usage in the component
  resale_ticket: {
    ticket_type: string;
    start_date: string;
    time: string;
    user: {
      avatar_url: string;
      name: string;
    };
  };
}

interface CartData {
  items: CartItem[];
  id: string;
  total: number;
}

interface PaymentResponse {
  razorpay: {
    order_id: string;
    key: string;
    amount: string;
    currency: string;
    prefill?: {
      name: string;
      email: string;
      contact: string;
    };
  };
}

interface SearchEvent {
  title: string;
  venue: string;
  location: string;
  latitude: number;
  longitude: number;
  city?: string; // Added to match usage in the component
}

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DiscountCart = () => {
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState("");

  const state = useLocation();
  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cartData, isLoading } = useQuery<CartData | undefined>({
    queryKey: ["view-cart"],
    queryFn: async () => {
      const response = await GetSingleData("cart");
      // Properly type guard the response
      if (response?.data) {
        const data = response.data as {
          items: any[];
          id: string;
          total: number;
        };
        
        const cartData: CartData = {
          items: Array.isArray(data.items) ? data.items : [],
          id: typeof data.id === 'string' ? data.id : '',
          total: typeof data.total === 'number' ? data.total : 0
        };
        return cartData;
      }
      return { items: [], id: '', total: 0 };
    },
  });

  // Load tickets from localStorage
  useEffect(() => {
    try {
      const ticketsFromStorage = JSON.parse(
        localStorage.getItem("displayTickets") || "[]"
      );
      const exists = ticketsFromStorage.some(
        (ticket: any) => ticket?.id?.toString() === ((state as any).state as any)?.id?.toString()
      );

      if (!exists && (state as any).state) {
        ticketsFromStorage.push((state as any).state);
        localStorage.setItem(
          "displayTickets",
          JSON.stringify(ticketsFromStorage)
        );
      }
    } catch (err) {
      setError("Error loading tickets from storage.");
      console.error(err);
    }
  }, [state]);

  // Load Razorpay script on component mount
  useEffect(() => {
    loadRazorpayScript().catch((err) => {
      console.error("Failed to load Razorpay script:", err);
      toast.error("Failed to initialize payment system");
    });
  }, []);

  // Payment initialization mutation
  const paymentInit = useMutation({
    mutationKey: ["payment-init"],
    mutationFn: () => PostData("checkout"),
    onError: (err: any) => {
      console.error("Payment API error:", err);
      toast.error("Failed to initialize payment");
    },
  });

  // Payment verification mutation
  const verifyPayment = useMutation({
    mutationKey: ["verify-payment"],
    mutationFn: (paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => PostData("payment/verify", paymentData),
    onSuccess: () => {
      toast.success("Payment verified successfully!");
      localStorage.removeItem("displayTickets");
      queryClient.invalidateQueries({ queryKey: ["view-cart"] });
    },
    onError: (err: any) => {
      console.error("Payment verification failed:", err);
      toast.error("Payment verification failed. Please contact support.");
    },
  });

  // Delete ticket mutation
  const deleteTicket = useMutation({
    mutationKey: ["delete-ticket"],
    mutationFn: (payload: { cart_item_id: number }) => PostData("cart/remove", payload),
    onMutate: (payload) => setDeletingId(payload.cart_item_id),
    onSuccess: () => {
      toast.success("Ticket deleted");
      queryClient.invalidateQueries({ queryKey: ["view-cart"] });
      setDeletingId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Ticket deletion failed");
      setDeletingId(null);
    },
  });

  // Coupon mutation
  const coupon = useMutation({
    mutationKey: ["coupon"],
    mutationFn: (payload: { code: string }) => PostData("cart/apply-coupon", payload),
    onSuccess: () => {
      toast.success("Coupon applied");
      queryClient.invalidateQueries({ queryKey: ["view-cart"] });
      setCouponCode("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to apply coupon");
    },
  });

  // Handle ticket deletion
  const handleDelete = (id: number) => {
    deleteTicket.mutate({ cart_item_id: id });
  };

  // Handle coupon application
  const handleCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    coupon.mutate({ code: couponCode.trim() });
  };

  // Handle payment success
  const handlePaymentSuccess = (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    console.log("Payment successful:", response);

    const paymentData = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    };

    verifyPayment.mutate(paymentData);
  };

  // Handle payment failure with specific international card error
  const handlePaymentError = (error: {
    error?: {
      reason?: string;
      description?: string;
    };
  }) => {
    console.error("Razorpay Payment Error:", error);

    if (error.error) {
      switch (error.error.reason) {
        case "international_transaction_not_allowed":
          toast.error(
            "International cards are not supported. Please use an Indian card or contact support to enable international payments."
          );
          break;
        case "payment_failed":
          toast.error(
            "Payment failed. Please check your card details and try again."
          );
          break;
        case "payment_cancelled":
          toast.error("Payment was cancelled by user.");
          break;
        case "authentication_failed":
          toast.error("Card authentication failed. Please try again.");
          break;
        default:
          toast.error(
            `Payment failed: ${error.error.description || "Unknown error"}`
          );
      }
    } else {
      toast.error("Payment failed. Please try again.");
    }
  };

  // Check if user is likely international
  // const isLikelyInternationalUser = () => {
  //   // You can implement logic to detect user's location
  //   // For now, we'll check timezone or accept a parameter from backend
  //   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //   return !timezone.includes("Asia/Kolkata") && !timezone.includes("India");
  // };

  // Initiate Razorpay payment with international payment handling
  const goToPayment = async () => {
    try {
      // Validate cart has items
      if (!cartData?.items?.length) {
        toast.error("Your cart is empty");
        return;
      }

      // Check if user might be international and show warning
      // if (isLikelyInternationalUser()) {
      //   toast.error("International payments are currently not supported. Please use an Indian card.");
      //   return;
      // }

      // Load Razorpay script if not already loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Payment gateway failed to load. Please refresh the page.");
        return;
      }

      // Initialize payment with backend
      const paymentResponse = await paymentInit.mutateAsync() as PaymentResponse;

      if (!paymentResponse?.razorpay) {
        toast.error("Invalid payment response from server");
        return;
      }

      const razorpayData = paymentResponse.razorpay;

      // Validate required fields
      if (!razorpayData.order_id || !razorpayData.key || !razorpayData.amount) {
        console.error("Missing required payment fields:", razorpayData);
        toast.error("Payment initialization failed - missing required data");
        return;
      }

      // Razorpay options with international payment restrictions
      const options = {
        key: razorpayData.key,
        amount: parseInt(razorpayData.amount),
        currency: razorpayData.currency || "INR",
        name: "Event Ticket Booking",
        description: "Purchase of event tickets",
        order_id: razorpayData.order_id,
        handler: handlePaymentSuccess,
        prefill: {
          name: razorpayData.prefill?.name || "Customer",
          email: razorpayData.prefill?.email || "customer@example.com",
          contact: razorpayData.prefill?.contact || "9999999999",
        },
        notes: {
          order_type: "ticket_purchase",
          cart_id: cartData?.id ?? "unknown",
        },
        theme: {
          color: "#3399cc",
        },
        // Restrict to Indian payment methods only
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true,
          // Disable international payment methods
          international_cards: false, // This will restrict to Indian cards only
        },
        // Additional configuration to prevent international transactions
        config: {
          display: {
            blocks: {
              banks: {
                name: "Bank Offer",
                instruments: [
                  {
                    method: "netbanking",
                  },
                ],
              },
            },
          },
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      // Create and open Razorpay instance
      if (!window.Razorpay) {
        toast.error("Payment gateway failed to load");
        return;
      }
      const rzp = new window.Razorpay(options);

      // Event listeners
      rzp.on("payment.failed", handlePaymentError);

      // Open payment dialog
      rzp.open();
    } catch (error: any) {
      console.error("Error in goToPayment:", error);
      if (
        error?.response?.data?.error?.reason ===
        "international_transaction_not_allowed"
      ) {
        toast.error(
          "International payments are not enabled for your account. Please use an Indian card."
        );
      } else {
        toast.error("Payment initialization failed. Please try again.");
      }
    }
  };

 
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

 
  const navigate = useNavigate();
  // --- Debounce ---
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 900);
    return () => clearTimeout(handler);
  }, [query]);

  // get lat long
  let location = { lat: 0, lon: 0 };
  try {
    const locationStr = localStorage.getItem("selectedLocationCoords");
    if (locationStr) {
      const parsed = JSON.parse(locationStr);
      location = {
        lat: typeof parsed.lat === 'number' ? parsed.lat : 0,
        lon: typeof parsed.lon === 'number' ? parsed.lon : 0
      };
    }
  } catch (e) {
    console.error('Error parsing location coords:', e);
    location = { lat: 0, lon: 0 };
  }
  // --- Fetch Suggestions ---
  const {
    data: SeachData,
    isLoading: SeachDataLoading,
    error: SeachDataError,
  } = useQuery({
    queryKey: ["cart-search-events", debouncedQuery],
    queryFn: () =>
      GetSingleData(`search-events?keyword=${encodeURIComponent(debouncedQuery)}`),
    enabled: !!debouncedQuery,
  });

  const handleSelect = useCallback((city: string) => {
    setQuery(city);
    setIsFocused(false);
  }, []);

  const tmSuggestions: any[] = SeachData?.data?.events ?? (Array.isArray(SeachData?.data) ? SeachData.data : []);
  const resaleSuggestions: any[] = SeachData?.data?.resaleTickets ?? [];
  const formatShortDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const merged: any[] = [
    ...resaleSuggestions.map((t) => ({
      title: t.title,
      date: formatShortDate(t.start_date),
      subtitle: `${t.venue ?? ""}${t.ticket_type ? ` · ${t.ticket_type}` : ""}`,
      price: t.price,
      image: null,
      latitude: null,
      longitude: null,
      type: "resale" as const,
      navigateTo: t.event_id ? `/event-details/${t.event_id}` : null,
    })),
    ...tmSuggestions.map((e) => ({
      title: e.title,
      date: formatShortDate(e.start_date ?? e.date),
      subtitle: `${e.venue ?? ""}${e.location ? `, ${e.location}` : ""}`,
      price: null,
      image: e.image ?? null,
      latitude: e.latitude ?? null,
      longitude: e.longitude ?? null,
      type: "tm" as const,
      navigateTo: `/event-details/${e.id}`,
    })),
  ];

  const suggestions: any[] = sortByDistance(merged, location.lat || null, location.lon || null);

  return (
    <div className="bg-[#F4F4F4] py-[50px]">
      <Container className="lg:px-[225px] 2xl:px-[225px] sm:max-w-[90%]">
        {cartData?.items && cartData.items.length > 1 && (
          <>
            <p className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold">
              Cart
            </p>
            <p className="text-[#606060] sm:text-2xl text-xl font-proximaRegular">
              Continue to checkout to select payment and secure your tickets.
            </p>
          </>
        )}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : cartData?.items && cartData.items.length < 1 ? (
          <div>
            <p className="text-2xl md:text-3xl lg:text-5xl font-bold">
              You cart is empty
            </p>
            <p className="py-8 text-lg">
              Find your next level event! Once you've added tickets to your
              cart, you'll see them here.
            </p>

            {/* Search */}
            <div className=" bg-white rounded-4xl md:flex items-center justify-between px-5 py-2 md:py-1 lg:py-2 w-full relative">
              <input
                className="focus:outline-none font-proximaRegular text-sm w-full pe-5 py-2"
                type="search"
                placeholder="Find events"
                value={query}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow click
                onChange={(e) => setQuery(e.target.value)}
              />
              <p className="absolute top-1/2 right-4 -translate-y-1/2">
                <img
                  src={headerSearchIcon}
                  alt="Search Icon"
                  className="ml-2 w-5 h-5"
                />
              </p>
              {/* Suggestions Dropdown */}
              {isFocused && debouncedQuery && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto">
                  {SeachDataLoading && (
                    <div className="px-4 py-3 flex items-center justify-center">
                      <Loader parentClass="h-fit" size={30} />
                    </div>
                  )}

                  {SeachDataError && (
                    <div className="px-4 py-2 text-red-500 text-sm">
                      Failed to load suggestions
                    </div>
                  )}

                  {!SeachDataLoading && !SeachDataError && suggestions.length === 0 && (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No results found
                    </div>
                  )}

                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => {
                        handleSelect(item.title ?? "");
                        if (item.navigateTo) navigate(item.navigateTo);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).parentElement!.classList.add("bg-primary001/10");
                            }}
                          />
                        ) : (
                          <TicketIcon size={18} className="text-primary001/60" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{item.title}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {item.date && <span>{item.date}</span>}
                          {item.date && item.subtitle && <span className="mx-1">·</span>}
                          {item.subtitle && <span>{item.subtitle}</span>}
                        </p>
                      </div>

                      {/* Price or arrow */}
                      <div className="flex-shrink-0">
                        {item.price !== null ? (
                          <span className="text-xs font-bold text-white bg-primary001 px-2 py-1 rounded-full">
                            ₹{item.price}
                          </span>
                        ) : (
                          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white mt-3 p-5 border border-[#E7EAEC] rounded-2xl shadow-xl">
            {cartData?.items && cartData.items.map((ticket: CartItem, index: number) => (
              <div key={index}>
                <div className="flex justify-between gap-1">
                  <div>
                    <p className="text-[#606060] font-proximaSemiBold sm:text-2xl text-xl">
                      {ticket?.quantity} x {ticket?.resale_ticket?.ticket_type}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(ticket?.id)}
                    className="bg-primary001/10 rounded-full p-[6px] cursor-pointer w-8 h-8"
                    disabled={deleteTicket.isPending}
                  >
                    {deletingId === ticket?.id && deleteTicket.isPending ? (
                      <Loader size={10} />
                    ) : (
                      <img
                        className="object-cover w-5 h-5"
                        src={cartDelete}
                        alt="Delete"
                      />
                    )}
                  </button>
                </div>

                <p className="text-[#838383] font-proximaRegular sm:text-xl text-sm">
                  {getLocalTime(
                    ticket?.resale_ticket?.start_date,
                    ticket?.resale_ticket?.time
                  )}
                  ,{" "}
                  {formatEventDate(
                    ticket?.resale_ticket?.start_date
                  )}{" "}
                  {ticket?.place}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    className="rounded-full h-[42px] w-[42px] object-cover"
                    src={ticket?.resale_ticket?.user?.avatar_url}
                    alt={ticket?.name}
                  />
                  <p className="text-[#838383] font-proximaRegular sm:text-xl text-lg">
                    <span className="text-[#606060] font-proximaSemiBold">
                      ₹{ticket?.total_price} {ticket?.newquantity}{" "}
                    </span>
                    per ticket
                  </p>
                </div>

                <hr className="my-4 bg-[#E7EAEC]" />

                <div className="flex items-center gap-2">
                  <div className="bg-primary001/10 border border-primary001 rounded-lg">
                    <input
                      className="py-2 px-3 w-45 text-[#606060] sm:text-xl text-sm font-proximaRegular focus:outline-none"
                      type="text"
                      placeholder="Discount Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleCoupon()}
                    />
                  </div>

                  <button
                    disabled={!couponCode.trim() || coupon.isPending}
                    onClick={handleCoupon}
                    className="cursor-pointer bg-primary001 rounded-lg text-white font-proximaRegular sm:text-xl text-sm px-5 py-2 disabled:opacity-50"
                  >
                    {coupon.isPending ? (
                      <Loader size={20} parentClass="h-8 w-fit" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
                <hr className="my-4 bg-[#E7EAEC]" />
              </div>
            ))}

            <div>
              <div className="flex items-center gap-1">
                <p className="text-[#606060] sm:text-2xl text-xl font-proximaSemiBold">
                  Total ₹{cartData?.total ?? 0}
                </p>
                <img src={ibtn} alt="Info" />
              </div>

              <p className="text-[#606060] font-proximaRegular sm:text-xl text-sm">
                Approx. total converted to Indian Rupee - you'll pay in the
                seller currency.
              </p>

              {/* Payment Method Info */}
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm font-proximaSemiBold">
                  💳 Accepted Payment Methods:
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  Indian Credit/Debit Cards, Net Banking, UPI, Wallets
                </p>
              </div>

              <button
                onClick={goToPayment}
                disabled={
                  paymentInit.isPending ||
                  verifyPayment.isPending ||
                  !cartData?.items || cartData.items.length === 0
                }
                className="mt-4 cursor-pointer bg-primary001 rounded-4xl text-white font-proximaRegular sm:text-xl text-lg px-5 py-2 disabled:opacity-50"
              >
                {paymentInit.isPending || verifyPayment.isPending ? (
                  <Loader size={20} parentClass="h-10 w-20" />
                ) : (
                  "Continue to Payment"
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <CheckElement />
        </div>
      </Container>
    </div>
  );
};

export default DiscountCart;
