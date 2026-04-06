import * as React from "react";
import { cn } from "@/lib/Utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
  icon?: React.ReactNode;
}

function Input({ className, type, error, icon, ...props }: InputProps) {
  return (
    <div className="relative flex flex-col gap-1.5 w-full group">
      <div className="relative flex items-center">
        {icon && (
          <div
            className={cn(
              "absolute left-4 z-10 text-neutral-400 transition-colors pointer-events-none group-focus-within:text-primary",
              error && "text-error/60"
            )}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "peer flex h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2 text-sm text-neutral-900 shadow-sm transition-all duration-300 outline-none placeholder:text-neutral-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-11",
            error && "border-error focus:border-error focus:ring-error/10",
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-error mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };
