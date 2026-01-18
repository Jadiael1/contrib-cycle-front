import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, label, error, hint, id, ...props }, ref) => {
		const inputId = id;

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={inputId}
						className="block text-sm font-medium text-star-dim mb-1.5"
					>
						{label}
					</label>
				)}
				<input
					type={type}
					id={inputId}
					className={cn(
						"flex h-10 w-full rounded-lg border bg-input px-3 py-2 text-sm text-star-white placeholder:text-star-muted transition-colors",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
						"disabled:cursor-not-allowed disabled:opacity-50",
						error
							? "border-destructive focus-visible:ring-destructive"
							: "border-border hover:border-star-muted focus-visible:border-cosmic-cyan",
						className,
					)}
					ref={ref}
					{...props}
				/>
				{hint && !error && (
					<p className="mt-1 text-xs text-star-muted">{hint}</p>
				)}
				{error && <p className="mt-1 text-xs text-destructive">{error}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";

export { Input };
