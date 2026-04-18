import { cn } from "@/lib/utils";
import { FiLoader } from "react-icons/fi";
interface LoaderProps {
  parentClass?: string;
  className?: string;
  size?: number | string;
}

const Loader: React.FC<LoaderProps> = ({ parentClass, className, size }) => {
  return (
    <div className={cn("flex items-center justify-center h-80", parentClass)}>
      <FiLoader
        className={cn("text-[2.8rem] animate-spin text-[#3B9DF8] font-bold", className)}
        size={size || ""}
      />
    </div>
  );
};

export default Loader;
