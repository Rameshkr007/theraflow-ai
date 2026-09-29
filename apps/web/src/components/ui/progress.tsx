"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all",
  {
    variants: {
      variant: {
        default: "bg-success",
        warning: "bg-warning",
        error: "bg-destructive",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface ProgressProps 
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size = "md", showLabel, ...props }, ref) => (
  <div className="flex w-full items-center gap-3">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        size === "sm" && "h-1",
        size === "md" && "h-2",
        size === "lg" && "h-3",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressVariants({ variant })}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showLabel && (
      <span className="text-sm font-medium text-muted-foreground w-8 text-right">
        {Math.round(value || 0)}%
      </span>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
