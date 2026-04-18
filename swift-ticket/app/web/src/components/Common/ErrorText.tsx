import { cn } from "@/lib/utils";

interface ErrorTextProps {
  className?: string;
  children?: React.ReactNode;
}

const ErrorText: React.FC<ErrorTextProps> = ({ className, children }) => {
  return (
    <div className={cn("h-80 flex items-center justify-center", className)}>
      {children || "Something went wrong."}
    </div>
  );
};

export default ErrorText;
