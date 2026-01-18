import type { ICollectiveProjectReport } from "@/interfaces/ICollectiveProjectReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

type TPayload = {
	year: number;
	month?: number;
	week_of_month?: number;
	status_scope?: string;
};

const fetchData = async (
	endpoint: string,
	token: string,
	data: TPayload,
): Promise<ICollectiveProjectReport> => {
	try {
		const req = await fetch(`${API_PREFIX}${endpoint}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json; charset=UTF-8",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
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

export const useGenerateReport = (projectId: number, token: string) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: TPayload) =>
			fetchData(
				`/admin/projects/${projectId}/reports/payment-status`,
				token,
				data,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [`admin-reports`, projectId] });
		},
	});
	return mutation;
};
