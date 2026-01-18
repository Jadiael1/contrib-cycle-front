import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	options: Array<{ value: string | number; label: string }>;
	placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, label, error, options, placeholder, id, ...props }, ref) => {
		const selectId = id;

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={selectId}
						className="block text-sm font-medium text-star-dim mb-1.5"
					>
						{label}
					</label>
				)}
				<div className="relative">
					<select
						id={selectId}
						className={cn(
							"flex h-10 w-full appearance-none rounded-lg border bg-input px-3 py-2 pr-10 text-sm text-star-white transition-colors",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
							"disabled:cursor-not-allowed disabled:opacity-50",
							error
								? "border-destructive focus-visible:ring-destructive"
								: "border-border hover:border-star-muted focus-visible:border-cosmic-cyan",
							className,
						)}
						ref={ref}
						{...props}
					>
						{placeholder && (
							<option value="" className="text-star-muted">
								{placeholder}
							</option>
						)}
						{options.map((option) => (
							<option
								key={option.value}
								value={option.value}
								className="bg-space-deep"
							>
								{option.label}
							</option>
						))}
					</select>
					<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-star-muted pointer-events-none" />
				</div>
				{error && <p className="mt-1 text-xs text-destructive">{error}</p>}
			</div>
		);
	},
);

Select.displayName = "Select";

export { Select };
