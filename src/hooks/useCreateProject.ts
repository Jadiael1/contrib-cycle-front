import type { IBaseResponse } from "@/interfaces/IBaseResponse";
import type { IProject } from "@/interfaces/IParticipantProjectDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

type TPayload = {
	title: string;
	description?: string;
	participant_limit: number;
	amount_per_participant: number;
	payment_interval: string;
	payments_per_interval: number;
	payment_method_type: string;
	payment_method_payload: Record<string, string | undefined>;
};

const fetchData = async (
	endpoint: string,
	token: string,
	payload: TPayload,
): Promise<IBaseResponse<IProject>> => {
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
			throw new Error(`HTTP error! status: ${req.status}`);
		}
		const resp = await req.json();
		return resp;
	} catch (error) {
		throw new Error(`HTTP error! error: ${error}`);
	}
};

export const useCreateProject = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: TPayload) => fetchData("/admin/projects", token, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
			queryClient.invalidateQueries({ queryKey: ["all-projects"] });
		},
	});
};
