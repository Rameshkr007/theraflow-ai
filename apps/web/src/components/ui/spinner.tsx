import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin rounded-full border-b-2 border-l-2 border-r-2 border-t-2",
  {
    variants: {
      variant: {
        primary: "border-primary border-r-transparent border-t-transparent",
        white: "border-white border-r-transparent border-t-transparent",
        muted: "border-muted-foreground border-r-transparent border-t-transparent",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ variant, size }), className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
