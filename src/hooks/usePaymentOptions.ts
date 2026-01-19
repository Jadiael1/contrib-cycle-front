import type { IPaymentOptions } from "@/interfaces/IPaymentOptions";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

const fetchData = async (
	endpoint: string,
	token: string,
): Promise<IPaymentOptions> => {
	try {
		const req = await fetch(`${API_PREFIX}${endpoint}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (!req.ok) {
			throw new Error(`HTTP error! status: ${req.status}`);
		}
		const resp = await req.json();
		return resp;
	} catch (error) {
		throw new Error(`HTTP error! error: ${error}`);
	}
};

export const usePaymentOptions = (
	slug: string,
	token: string,
	year?: number,
	month?: number,
) => {
	const params = new URLSearchParams();
	if (year) params.set("year", String(year));
	if (month) params.set("month", String(month));
	const queryString = params.toString();
	const query = useQuery({
		queryKey: ["project-payment-options", slug, year ?? "all", month ?? "all"],
		queryFn: () =>
			fetchData(
				`/projects/${slug}/payment-options${queryString ? `?${queryString}` : ""}`,
				token,
			),
	});
	return query;
};
