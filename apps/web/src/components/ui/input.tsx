import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, hint, error, leftIcon, rightIcon, prefix, suffix, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="flex w-full flex-col space-y-1.5">
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-destructive focus-visible:ring-destructive" : "border-input",
              leftIcon || prefix ? (prefix ? "pl-10" : "pl-10") : "",
              rightIcon || suffix ? (suffix ? "pr-10" : "pr-10") : "",
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-muted-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
          {suffix && (
            <div className="absolute right-3 text-muted-foreground pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
