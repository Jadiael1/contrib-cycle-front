import { createContext, useContext } from "react";

export type ToastVariant = "default" | "destructive";

export interface ToastInput {
	title: string;
	description?: string;
	variant?: ToastVariant;
}

interface ToastContextValue {
	toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProviderContext = ToastContext;

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
