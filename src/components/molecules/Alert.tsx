import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/Utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
      variants: {
        variant: {
          default: "bg-white text-neutral-900 border-neutral-200 shadow-sm",
          destructive: "text-error bg-error/5 border-error/20 [&>svg]:text-error *:data-[slot=alert-description]:text-error/80",
          success: "text-success bg-success/5 border-success/20 [&>svg]:text-success *:data-[slot=alert-description]:text-success/80",
          warning: "text-warning bg-warning/5 border-warning/20 [&>svg]:text-warning *:data-[slot=alert-description]:text-warning/80",
          info: "text-info bg-info/5 border-info/20 [&>svg]:text-info *:data-[slot=alert-description]:text-info/80",
        },
      },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-bold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
