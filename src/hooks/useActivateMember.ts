import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

const fetchData = async (endpoint: string, token: string) => {
	try {
		const req = await fetch(`${API_PREFIX}${endpoint}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
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

export const useActivateMember = (
	projectId: number,
	token: string,
	projectSlug?: string,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: number) =>
			fetchData(
				`/admin/projects/${projectId}/members/${userId}/activate`,
				token,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-members", projectId] });
			queryClient.invalidateQueries({ queryKey: ["admin-project", projectId] });
			if (projectSlug) {
				queryClient.invalidateQueries({ queryKey: ["project", projectSlug] });
			}
		},
	});
};
