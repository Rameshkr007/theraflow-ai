import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium whitespace-nowrap",
    "rounded-md border",
    "transition-all duration-fast ease-standard",
    "focus-visible:outline-none focus-visible:shadow-focus",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-white border-primary",
          "hover:bg-primary-dark hover:border-primary-dark",
          "active:scale-[0.98]",
        ].join(" "),

        secondary: [
          "bg-surface-raised text-text-primary border-border",
          "hover:bg-surface-subtle hover:border-border-strong",
          "active:scale-[0.98]",
        ].join(" "),

        outline: [
          "bg-transparent text-primary border-primary",
          "hover:bg-primary-muted",
          "active:scale-[0.98]",
        ].join(" "),

        ghost: [
          "bg-transparent text-text-secondary border-transparent",
          "hover:bg-surface-subtle hover:text-text-primary",
          "active:scale-[0.98]",
        ].join(" "),

        destructive: [
          "bg-error text-white border-error",
          "hover:bg-red-700 hover:border-red-700",
          "active:scale-[0.98]",
        ].join(" "),

        link: [
          "bg-transparent text-primary border-transparent",
          "underline-offset-4 hover:underline",
          "h-auto p-0",
        ].join(" "),
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-sm",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-base",
        xl: "h-12 px-6 text-base",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0",
        "icon-lg": "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** When true, renders as child component (useful for Next.js Link wrapping) */
  asChild?: boolean;
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Icon to show before the label */
  leftIcon?: React.ReactNode;
  /** Icon to show after the label */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width={size === "xs" || size === "sm" ? 14 : 16}
              height={size === "xs" || size === "sm" ? 14 : 16}
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="sr-only">Loading</span>
          </>
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
