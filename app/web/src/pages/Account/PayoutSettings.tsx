import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UpiInput from "@/components/Forms/UpiInput";

// ── Zod schemas ──────────────────────────────────────────────────────────────

const upiSchema = z.object({
  upiId: z
    .string()
    .min(1, "UPI ID is required")
    .regex(/^[\w.\-]+@[\w]+$/, "Enter a valid UPI ID (e.g. name@okicici)"),
});

const bankSchema = z.object({
  accountHolderName: z.string().min(2, "Enter account holder name"),
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  ifscCode: z
    .string()
    .min(11, "Enter a valid IFSC code")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code (e.g. HDFC0001234)"),
  bankName: z.string().min(2, "Enter bank name"),
});

type UpiFormValues = z.infer<typeof upiSchema>;
type BankFormValues = z.infer<typeof bankSchema>;

// ── Shared field label component ─────────────────────────────────────────────

const FieldLabel = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-proximaSemiBold text-[#0F172A] mb-1.5"
  >
    {children}
  </label>
);

// ── Section label above each card ─────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-medium uppercase tracking-wider text-[#64748B] mb-3">
    {children}
  </p>
);

// ── PayoutSettings page ───────────────────────────────────────────────────────

const PayoutSettings = () => {
  const [upiValue, setUpiValue] = useState("");

  // UPI form
  const {
    handleSubmit: handleUpiSubmit,
    setValue: setUpiFormValue,
    formState: { errors: upiErrors },
  } = useForm<UpiFormValues>({
    resolver: zodResolver(upiSchema),
    defaultValues: { upiId: "" },
  });

  // Bank form
  const {
    register: bankRegister,
    handleSubmit: handleBankSubmit,
    formState: { errors: bankErrors },
  } = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
  });

  const handleUpiChange = (val: string) => {
    setUpiValue(val);
    setUpiFormValue("upiId", val, { shouldValidate: false });
  };

  const onUpiSave = (_data: UpiFormValues) => {
    toast.success("Saved successfully ✓");
  };

  const onBankSave = (_data: BankFormValues) => {
    toast.success("Saved successfully ✓");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto px-4 py-10"
      >
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-proximaBold text-[#0F172A]">
            Payout details
          </h1>
          <p className="flex items-center gap-1.5 mt-2 text-sm font-proximaRegular text-[#94A3B8]">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            Where we send your money after a ticket sells. Never visible to
            buyers.
          </p>
        </div>

        {/* Warning callout */}
        <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl p-4 mb-8">
          <AlertTriangle className="w-4 h-4 text-[#92400E] shrink-0 mt-0.5" />
          <p className="text-sm font-proximaRegular text-[#92400E] leading-relaxed">
            Add your payout details before listing tickets. You won't be able
            to receive payment without them.
          </p>
        </div>

        {/* ── UPI section ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionLabel>UPI payment</SectionLabel>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8">
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-base font-proximaBold text-[#0F172A]">UPI ID</h2>
              <span className="px-2.5 py-0.5 bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] text-xs font-proximaSemiBold rounded-full">
                Recommended
              </span>
            </div>

            <form onSubmit={handleUpiSubmit(onUpiSave)} noValidate>
              <div className="mb-2">
                <UpiInput
                  value={upiValue}
                  onChange={handleUpiChange}
                  onVerify={() => {}}
                />
                {upiErrors.upiId && (
                  <p className="text-red-500 text-xs mt-1.5 font-proximaRegular">
                    {upiErrors.upiId.message}
                  </p>
                )}
              </div>

              <p className="text-xs font-proximaRegular text-[#94A3B8] mb-5">
                e.g. yourname@okicici · yourname@ybl · 9876543210@paytm
              </p>

              <Button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full px-6 py-3 h-auto font-semibold"
              >
                Save UPI details
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#E2E8F0]" />
          <span className="text-sm text-[#94A3B8] font-medium shrink-0">or</span>
          <div className="flex-1 h-px bg-[#E2E8F0]" />
        </div>

        {/* ── Bank Transfer section ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionLabel>Bank transfer</SectionLabel>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8">
            {/* Section heading */}
            <div className="mb-5">
              <h2 className="text-base font-proximaBold text-[#0F172A]">
                Bank account
              </h2>
              <p className="text-xs font-proximaRegular text-[#94A3B8] mt-0.5">
                Alternative payout method
              </p>
            </div>

            <form onSubmit={handleBankSubmit(onBankSave)} noValidate>
              <div className="space-y-4">
                {/* Account holder name */}
                <div>
                  <FieldLabel htmlFor="accountHolderName">
                    Account holder name
                  </FieldLabel>
                  <Input
                    id="accountHolderName"
                    type="text"
                    placeholder="As it appears on your bank account"
                    {...bankRegister("accountHolderName")}
                    className={cn(
                      "bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-[#2563EB]/20 rounded-xl",
                      bankErrors.accountHolderName &&
                        "border-red-400 focus-visible:border-red-500"
                    )}
                  />
                  {bankErrors.accountHolderName && (
                    <p className="text-red-500 text-xs mt-1.5 font-proximaRegular">
                      {bankErrors.accountHolderName.message}
                    </p>
                  )}
                </div>

                {/* Account number */}
                <div>
                  <FieldLabel htmlFor="accountNumber">
                    Account number
                  </FieldLabel>
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="Enter your bank account number"
                    {...bankRegister("accountNumber")}
                    className={cn(
                      "bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-[#2563EB]/20 rounded-xl",
                      bankErrors.accountNumber &&
                        "border-red-400 focus-visible:border-red-500"
                    )}
                  />
                  {bankErrors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1.5 font-proximaRegular">
                      {bankErrors.accountNumber.message}
                    </p>
                  )}
                </div>

                {/* IFSC code */}
                <div>
                  <FieldLabel htmlFor="ifscCode">IFSC code</FieldLabel>
                  <Input
                    id="ifscCode"
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    {...bankRegister("ifscCode")}
                    className={cn(
                      "bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-[#2563EB]/20 rounded-xl uppercase",
                      bankErrors.ifscCode &&
                        "border-red-400 focus-visible:border-red-500"
                    )}
                  />
                  {bankErrors.ifscCode && (
                    <p className="text-red-500 text-xs mt-1.5 font-proximaRegular">
                      {bankErrors.ifscCode.message}
                    </p>
                  )}
                </div>

                {/* Bank name */}
                <div>
                  <FieldLabel htmlFor="bankName">Bank name</FieldLabel>
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="e.g. HDFC Bank, SBI, Axis Bank"
                    {...bankRegister("bankName")}
                    className={cn(
                      "bg-white border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-[#2563EB]/20 rounded-xl",
                      bankErrors.bankName &&
                        "border-red-400 focus-visible:border-red-500"
                    )}
                  />
                  {bankErrors.bankName && (
                    <p className="text-red-500 text-xs mt-1.5 font-proximaRegular">
                      {bankErrors.bankName.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="mt-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full px-6 py-3 h-auto font-semibold"
              >
                Save bank details
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PayoutSettings;
