import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export function formatDate(date: string | null): string {
	if (!date) return "-";
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(date));
}

export const formatCurrency = (value: string | number): string => {
	const numValue = typeof value === "string" ? parseFloat(value) : value;
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(numValue);
};

export const getIntervalLabel = (interval: string, count: number): string => {
	const labels: Record<string, string> = {
		week: count === 1 ? "por semana" : `${count}x por semana`,
		month: count === 1 ? "por mês" : `${count}x por mês`,
		year: count === 1 ? "por ano" : `${count}x por ano`,
	};
	return labels[interval] || interval;
};

export function formatPhone(phone: string): string {
	const cleaned = phone.replace(/\D/g, "");
	if (cleaned.length === 11) {
		return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
	}
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
	}
	return phone;
}

export function getStatusLabel(status: string | null): string {
	const labels: Record<string, string> = {
		pending: "Pendente",
		accepted: "Confirmado",
		removed: "Removido",
		processing: "Processando",
		completed: "Concluído",
		failed: "Falhou",
	};
	return status ? labels[status] || status : "-";
}
