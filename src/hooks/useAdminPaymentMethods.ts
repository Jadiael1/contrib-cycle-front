import type { IBaseResponse } from "@/interfaces/IBaseResponse";
import type { ICollectiveProjectPaymentMethod } from "@/interfaces/ICollectiveProjectPaymentMethod";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

const fetchData = async (
	endpoint: string,
	token: string,
): Promise<IBaseResponse<ICollectiveProjectPaymentMethod[]>> => {
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

export const useAdminPaymentMethods = (projectId: number, token: string) => {
	const query = useQuery({
		queryKey: [`admin-payment-methods`, projectId],
		queryFn: () =>
			fetchData(`/admin/projects/${projectId}/payment-methods`, token),
	});
	return query;
};
