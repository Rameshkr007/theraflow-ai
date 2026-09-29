"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, error, id, ...props }, ref) => {
  const checkboxId = id || React.useId();
  
  return (
    <div className="flex flex-row items-start space-x-3 space-y-0">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
          error && "border-destructive",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          {props.checked === "indeterminate" ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {(label || description) && (
        <div className="grid gap-1.5 leading-none">
          {label && <Label htmlFor={checkboxId} className="cursor-pointer">{label}</Label>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
