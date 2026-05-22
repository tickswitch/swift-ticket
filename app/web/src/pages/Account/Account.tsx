import { Link } from "react-router";
import { motion } from "motion/react";
import { ShieldCheck, ShieldAlert, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// The API may return phone/phone_verified beyond the base User type
interface UserExtended {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  phone_verified?: boolean;
}

// Derive up-to-2-letter initials from a display name
const getInitials = (name?: string): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ── Shared card wrapper ───────────────────────────────────────────────────────
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#F1F5F9] ${className}`}
  >
    {children}
  </div>
);

// ── Single info row ───────────────────────────────────────────────────────────
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-4">
    {children}
  </div>
);

// ── Section label above each card ─────────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-medium uppercase tracking-wider text-[#64748B] mb-3">
    {children}
  </p>
);

// ── Verified green badge ──────────────────────────────────────────────────────
const VerifiedBadge = () => (
  <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] rounded-full px-3 py-1 text-xs font-medium shrink-0">
    <ShieldCheck className="w-3 h-3" />
    Verified
  </span>
);

// ── Action needed amber badge ─────────────────────────────────────────────────
const ActionBadge = () => (
  <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] rounded-full px-3 py-1 text-xs font-medium shrink-0">
    <ShieldAlert className="w-3 h-3" />
    Action needed
  </span>
);

// ── Edit / action link ────────────────────────────────────────────────────────
const EditLink = ({ to, label = "Edit" }: { to: string; label?: string }) => (
  <Link
    to={to}
    className="flex items-center gap-0.5 text-[#2563EB] text-sm font-medium hover:text-[#1D4ED8] transition-colors shrink-0"
  >
    {label}
    <ChevronRight className="w-3.5 h-3.5" />
  </Link>
);

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
});

// ── Account page ──────────────────────────────────────────────────────────────
const Account = () => {
  const { currentUser } = useAuth();
  const user = currentUser as UserExtended | null;

  const initials = getInitials(user?.name);
  const phoneVerified = Boolean(user?.phone_verified);
  const hasPhone = Boolean(user?.phone);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          className="flex flex-col items-center text-center gap-3 pb-4"
        >
          <div className="w-20 h-20 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-2xl select-none ring-4 ring-[#2563EB]/20">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-proximaBold text-[#0F172A]">
              {user?.name ?? "Your account"}
            </h1>
            <Link
              to="/identy-verify"
              className="text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors mt-0.5 inline-block"
            >
              Edit profile
            </Link>
          </div>
        </motion.div>

        {/* ── Basic info ───────────────────────────────────────────────── */}
        <motion.section {...fadeUp(0.08)}>
          <SectionLabel>Basic info</SectionLabel>
          <Card>
            {/* Email */}
            <Row>
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] mb-0.5">Email address</p>
                <p className="text-[#0F172A] font-medium text-sm truncate">
                  {user?.email ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <VerifiedBadge />
                <EditLink to="/email" />
              </div>
            </Row>

            {/* Phone */}
            <Row>
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] mb-0.5">Phone number</p>
                {hasPhone ? (
                  <p className="text-[#0F172A] font-medium text-sm">
                    {user?.phone}
                  </p>
                ) : (
                  <Link
                    to="/phone"
                    className="text-[#2563EB] text-sm font-medium hover:text-[#1D4ED8] transition-colors"
                  >
                    Add phone number
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {phoneVerified ? <VerifiedBadge /> : <ActionBadge />}
                <EditLink to="/phone" label={hasPhone ? "Edit" : "Add"} />
              </div>
            </Row>

            {/* Full name */}
            <Row>
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] mb-0.5">Full name</p>
                <p className="text-[#0F172A] font-medium text-sm">
                  {user?.name ?? "Not set"}
                </p>
              </div>
              <EditLink to="/identy-verify" />
            </Row>
          </Card>
        </motion.section>

        {/* ── Seller verification ──────────────────────────────────────── */}
        <motion.section {...fadeUp(0.14)}>
          <SectionLabel>Seller verification</SectionLabel>

          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0">
                <ShieldCheck size={22} strokeWidth={2.5} className="text-[#2563EB]" />
              </div>
              <div className="min-w-0">
                <p className="text-[#0F172A] font-medium text-sm">Seller status</p>
                <p className="text-[#64748B] text-xs mt-0.5">
                  {phoneVerified
                    ? "You're approved to sell"
                    : "Verify your phone to start selling"}
                </p>
              </div>
            </div>

            {/* Right side badge */}
            {phoneVerified ? (
              <span className="inline-flex items-center gap-1 bg-[#DBEAFE] text-[#1D4ED8] border border-[#93C5FD] rounded-full px-3 py-1 text-xs font-medium shrink-0">
                <ShieldCheck className="w-3 h-3" />
                Verified Seller
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] rounded-full px-3 py-1 text-xs font-medium shrink-0">
                Verification needed
              </span>
            )}
          </div>
        </motion.section>

        {/* ── Payout details ───────────────────────────────────────────── */}
        <motion.section {...fadeUp(0.2)}>
          <SectionLabel>Payout details</SectionLabel>
          <Card>
            <Row>
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] mb-0.5">Payout method</p>
                <p className="text-[#0F172A] font-medium text-sm">
                  UPI / Bank account
                </p>
                <p className="text-[#94A3B8] text-xs mt-0.5">
                  Where we send your money after a ticket sells
                </p>
              </div>
              <EditLink to="/account/payout" />
            </Row>
          </Card>
        </motion.section>

        {/* ── Danger zone ──────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.26)} className="text-center pt-4">
          <button className="text-red-400 text-sm hover:text-red-500 transition-colors">
            Delete account
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Account;
