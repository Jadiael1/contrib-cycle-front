import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 rounded-lg";

    const variants = {
      primary: "bg-gradient-to-r from-cosmic-cyan to-cosmic-blue text-space-void hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
      secondary: "bg-space-dust text-star-white border border-border hover:bg-space-nebula hover:border-star-muted",
      ghost: "text-star-dim hover:text-star-white hover:bg-space-nebula",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-cosmic-cyan/50 text-cosmic-cyan hover:bg-cosmic-cyan/10 hover:border-cosmic-cyan",
      link: "text-cosmic-cyan underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            <span>Aguarde...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
