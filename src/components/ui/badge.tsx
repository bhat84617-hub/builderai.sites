import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-replit-accent/10 text-replit-accent",
        secondary: "bg-replit-hover text-replit-muted border border-replit-border",
        outline: "border border-replit-border bg-transparent text-replit-muted",
        success: "bg-replit-green/10 text-replit-green",
        warning: "bg-replit-amber/10 text-replit-amber",
        destructive: "bg-replit-red/10 text-replit-red",
        premium: "bg-gradient-to-r from-replit-accent to-replit-blue text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
