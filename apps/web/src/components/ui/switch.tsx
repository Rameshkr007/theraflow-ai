"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
import { Label } from "./label"

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, label, description, size = "md", id, ...props }, ref) => {
  const switchId = id || React.useId();
  
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        {label && <Label htmlFor={switchId} className="text-base">{label}</Label>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <SwitchPrimitives.Root
        id={switchId}
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          size === "sm" && "h-4 w-7",
          size === "md" && "h-6 w-11",
          size === "lg" && "h-8 w-14",
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
            size === "sm" && "h-3 w-3 data-[state=checked]:translate-x-3",
            size === "md" && "h-5 w-5 data-[state=checked]:translate-x-5",
            size === "lg" && "h-7 w-7 data-[state=checked]:translate-x-6"
          )}
        />
      </SwitchPrimitives.Root>
    </div>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
