import { ShieldCheck, BadgeCheck, Zap, Lock } from "lucide-react";

interface TrustItem {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle: string;
  testId: string;
}

const items: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "120% price cap",
    subtitle: "Never pay more than 20% above face value",
    testId: "trust-item-price-cap",
  },
  {
    icon: BadgeCheck,
    title: "Verified sellers",
    subtitle: "Phone-verified every listing",
    testId: "trust-item-verified-sellers",
  },
  {
    icon: Zap,
    title: "Instant UPI payout",
    subtitle: "Paid within 2 hours of your sale",
    testId: "trust-item-upi-payout",
  },
  {
    icon: Lock,
    title: "Buyer protection",
    subtitle: "Full refund if ticket fails at entry",
    testId: "trust-item-buyer-protection",
  },
];

const TrustBar = () => {
  return (
    <div
      className="w-full py-4"
      style={{ backgroundColor: "#F8F9FA" }}
      data-testid="trust-bar"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.testId}
                data-testid={item.testId}
                className="flex items-start gap-3"
              >
                <div className="shrink-0 mt-0.5">
                  <Icon size={24} color="#2563EB" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#181818] text-sm md:text-base font-semibold leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[#606060] text-xs md:text-sm leading-snug">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
