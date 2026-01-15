import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastProviderContext, type ToastInput, type ToastVariant } from "@/hooks/useToast";

interface ToastItem extends ToastInput {
	id: string;
}

const variantStyles: Record<ToastVariant, string> = {
	default: "border-border bg-card text-foreground",
	destructive: "border-destructive/40 bg-destructive/10 text-destructive",
};

const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const toast = useCallback(
		(input: ToastInput) => {
			const id =
				typeof crypto !== "undefined" && "randomUUID" in crypto
					? crypto.randomUUID()
					: `${Date.now()}-${Math.random()}`;
			const variant = input.variant ?? "default";
			setToasts((prev) => [...prev, { ...input, id, variant }]);
			window.setTimeout(() => dismiss(id), 4500);
		},
		[dismiss]
	);

	const value = useMemo(() => ({ toast }), [toast]);

	return (
		<ToastProviderContext.Provider value={value}>
			{children}
			<div
				aria-live="polite"
				className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 md:inset-x-auto md:right-6"
			>
				{toasts.map((item) => (
					<div
						key={item.id}
						className={cn(
							"pointer-events-auto flex w-full max-w-sm items-start justify-between gap-4 rounded-xl border px-4 py-3 shadow-lg",
							variantStyles[item.variant ?? "default"]
						)}
					>
						<div>
							<p className="text-sm font-semibold">{item.title}</p>
							{item.description && (
								<p
									className={cn(
										"mt-1 text-xs",
										item.variant === "destructive"
											? "text-destructive/80"
											: "text-foreground/80"
									)}
								>
									{item.description}
								</p>
							)}
						</div>
						<button
							onClick={() => dismiss(item.id)}
							className="rounded-md p-1 text-foreground/60 transition hover:text-foreground"
							aria-label="Fechar notificação"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				))}
			</div>
		</ToastProviderContext.Provider>
	);
};

export default ToastProvider;
