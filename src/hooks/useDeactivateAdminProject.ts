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

type TProjectRef = {
	projectId: number;
	projectSlug?: string;
};

export const useDeactivateAdminProject = (token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ projectId }: TProjectRef) =>
			fetchData(`/admin/projects/${projectId}/deactivate`, token),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
			queryClient.invalidateQueries({ queryKey: ["all-projects"] });
			queryClient.invalidateQueries({
				queryKey: ["admin-project", variables.projectId],
			});
			if (variables.projectSlug) {
				queryClient.invalidateQueries({
					queryKey: ["project", variables.projectSlug],
				});
			}
		},
	});
};
