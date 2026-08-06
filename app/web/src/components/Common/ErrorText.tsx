import { cn } from "@/lib/utils";

interface ErrorTextProps {
  className?: string;
  children?: React.ReactNode;
  onRetry?: () => void;
}

const ErrorText: React.FC<ErrorTextProps> = ({ className, children, onRetry }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("h-80 flex flex-col items-center justify-center gap-3", className)}
    >
      <p>{children || "Couldn't load this right now."}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-semibold text-primary001 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorText;
