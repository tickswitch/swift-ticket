import { Link } from "react-router";

interface Step {
  num: string;
  title: string;
  text: string;
  testId: string;
}

const steps: Step[] = [
  {
    num: "1",
    title: "List your ticket",
    text: "Upload in 2 minutes. Set your price within the fair cap.",
    testId: "how-it-works-step-1",
  },
  {
    num: "2",
    title: "Buyer pays safely",
    text: "UPI, cards, wallets. Funds held securely until delivery.",
    testId: "how-it-works-step-2",
  },
  {
    num: "3",
    title: "You get paid",
    text: "Ticket delivered instantly. UPI payout in 2 hours.",
    testId: "how-it-works-step-3",
  },
];

const HowItWorksStrip = () => {
  return (
    <section
      className="w-full bg-white"
      style={{ padding: "64px 24px" }}
      data-testid="how-it-works-strip"
    >
      <div className="max-w-[1200px] mx-auto">
        <h2
          className="text-center text-[#181818] text-3xl md:text-4xl font-semibold mb-10"
          data-testid="how-it-works-heading"
        >
          How SwiftTickets works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step) => (
            <div
              key={step.testId}
              data-testid={step.testId}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4"
                style={{ backgroundColor: "#2563EB" }}
                aria-hidden="true"
              >
                {step.num}
              </div>
              <h3 className="text-[#181818] text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-[#606060] text-base leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/sell-tickets"
            data-testid="how-it-works-cta"
            style={{ backgroundColor: "#2563EB" }}
            className="text-white font-semibold rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
          >
            Start selling
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksStrip;
