import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("max-w-[1325px] mx-auto px-5 2xl:px-0", className)}>{children}</div>
  );
};

export default Container;
