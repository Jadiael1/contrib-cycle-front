import type { IBaseResponse } from "@/interfaces/IBaseResponse";
import type { ICollectiveProjectPaymentMethod } from "@/interfaces/ICollectiveProjectPaymentMethod";
import type { TPaymentMethodPayload } from "@/types/TPaymentMethodPayload";
import type { TPaymentMethodType } from "@/types/TPaymentMethodType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

type TPayload = {
	payment_method_type: TPaymentMethodType;
	payment_method_payload: TPaymentMethodPayload;
	label?: string;
	is_active?: boolean;
	sort_order?: number;
};

const fetchData = async (
	endpoint: string,
	token: string,
	payload: TPayload,
): Promise<IBaseResponse<ICollectiveProjectPaymentMethod>> => {
	try {
		const req = await fetch(`${API_PREFIX}${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		});
		if (!req.ok) {
			const errorBody = await req.json().catch(() => null);
			throw new Error(
				errorBody?.message || `HTTP error! status: ${req.status}`,
			);
		}
		const resp = await req.json();
		return resp;
	} catch (error) {
		throw new Error(`HTTP error! error: ${error}`);
	}
};

export const useCreatePaymentMethod = (projectId: number, token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: TPayload) =>
			fetchData(`/admin/projects/${projectId}/payment-methods`, token, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-payment-methods"] });
		},
	});
};
