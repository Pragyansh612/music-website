import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "button-premium text-primary-foreground hover:-translate-y-1 active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "premium-btn-outline bg-background hover:-translate-y-1 active:translate-y-0 border border-input hover:bg-accent hover:text-accent-foreground dark:border-primary/20 dark:hover:border-primary/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary/80 dark:text-white dark:hover:bg-secondary/60 hover:-translate-y-1 active:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/30",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "button-premium text-primary-foreground btn-shine hover:-translate-y-1 active:translate-y-0 pulse-on-hover",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

