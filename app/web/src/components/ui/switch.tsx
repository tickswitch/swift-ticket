import * as SwitchPrimitive from "@radix-ui/react-switch";

// Utility function for className concatenation
const cn = (...classes: string[]): string => classes.filter(Boolean).join(' ');

// Switch Component - Modified to be controlled from parent
interface SwitchProps {
  className?: string;
  on?: string;
  off?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = ({
  className,
  on = "ON",
  off = "OFF",
  checked,
  onCheckedChange,
  ...props
}: SwitchProps) => {
  return (
    <div className="flex items-center gap-2">
      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(
          "peer data-[state=checked]:bg-[#2FA75F] data-[state=unchecked]:bg-gray-300 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[2.15rem] w-16 shrink-0 items-center rounded-full border data-[state=checked]:border-[#2FA75F] border-gray-300 shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className || ""
        )}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "bg-white/70 dark:data-[state=unchecked]:bg-[#2FA75F] data-[state=checked]:bg-[#FFFFFF] pointer-events-none block size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-(-12px))] data-[state=unchecked]:translate-x-0"
          )}
        />
        <span className="text-sm font-medium text-muted-foreground w-10 text-left">
          {!checked ? <p className="ml-2 text-gray-500 font-semibold">{on}</p> : <p className="-ml-4 text-white font-semibold">{off}</p>}
        </span>
      </SwitchPrimitive.Root>
    </div>
  );
};
 











// import * as React from "react";
// import * as SwitchPrimitive from "@radix-ui/react-switch";
// import { cn } from "@/lib/utils";

// type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
//   on?: string;
//   off?: string;
// };

// function Switch({
//   className,
//   on = "ON",
//   off = "OFF",
//   ...props
// }: SwitchProps) {
//   const [checked, setChecked] = React.useState(false);

//   return (
//     <div className="flex items-center gap-2">
//       <SwitchPrimitive.Root
//         data-slot="switch"
//         className={cn(
//           "peer data-[state=checked]:bg-[#2FA75F] data-[state=unchecked]:bg-gray-300 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[2.15rem] w-16 shrink-0 items-center rounded-full border data-[state=checked]:border-[#2FA75F] border-gray-300 shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         checked={checked}
//         onCheckedChange={setChecked}
//         {...props}
//       >
//         <SwitchPrimitive.Thumb
//           data-slot="switch-thumb"
//           className={cn(
//             "bg-white/70 dark:data-[state=unchecked]:bg-[#2FA75F] data-[state=checked]:bg-[#FFFFFF] pointer-events-none block size-6 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-(-12px))] data-[state=unchecked]:translate-x-0"
//           )}
//         />
//       <span className="text-sm font-medium text-muted-foreground w-10 text-left">
//         {!checked ? <p className="ml-2 text-gray-500 font-semibold">ON</p> : <p className="-ml-4 text-white font-semibold">OFF</p>}
//       </span>
//       </SwitchPrimitive.Root>
//     </div>
//   );
// }

// export { Switch };
