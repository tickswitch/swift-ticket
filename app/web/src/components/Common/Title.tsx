import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

const Title = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        "text-2xl font-bold",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Title;
