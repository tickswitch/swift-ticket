import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const UPI_REGEX = /^[\w.\-]+@[\w]+$/;

interface UpiInputProps {
  value: string;
  onChange: (value: string) => void;
  onVerify?: () => void;
}

const UpiInput = ({ value, onChange, onVerify }: UpiInputProps) => {
  const [touched, setTouched] = useState(false);
  const [verified, setVerified] = useState(false);

  const isValid = UPI_REGEX.test(value);
  const showError = touched && value.length > 0 && !isValid;

  const handleBlur = () => {
    setTouched(true);
    setVerified(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setVerified(false);
  };

  const handleVerify = () => {
    setVerified(true);
    onVerify?.();
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="yourname@okicici"
          aria-invalid={showError}
          className={[
            "bg-white border rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] text-sm w-full focus:outline-none focus:ring-1 transition-colors",
            showError
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]",
          ].join(" ")}
        />
        <button
          type="button"
          onClick={handleVerify}
          disabled={!isValid}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-colors"
        >
          Verify
        </button>
      </div>

      {showError && (
        <p className="text-red-500 text-xs mt-1">
          Enter a valid UPI ID (e.g. name@okicici)
        </p>
      )}

      {verified && isValid && (
        <p className="flex items-center gap-1.5 text-emerald-600 text-xs mt-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Format looks valid ✓
        </p>
      )}
    </div>
  );
};

export default UpiInput;
