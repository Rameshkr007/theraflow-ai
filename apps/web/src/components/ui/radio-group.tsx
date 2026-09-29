"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  options: RadioOption[];
  error?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, options, error, ...props }, ref) => {
  return (
    <div className="grid gap-2">
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2", className)}
        {...props}
        ref={ref}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3 space-y-0">
            <RadioGroupPrimitive.Item
              value={option.value}
              disabled={option.disabled}
              id={`${props.name}-${option.value}`}
              className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-destructive"
              )}
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <Circle className="h-2.5 w-2.5 fill-current text-current" />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor={`${props.name}-${option.value}`}
                className={cn(option.disabled && "cursor-not-allowed opacity-50", "cursor-pointer font-normal")}
              >
                {option.label}
              </Label>
              {option.description && (
                <p className="text-sm text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </RadioGroupPrimitive.Root>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export { RadioGroup }
