import type { IAdminProjects } from "@/interfaces/IAdminProjects";
import type { IBaseResponse } from "@/interfaces/IBaseResponse";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

type TAdminProjectsResponse = IBaseResponse<IAdminProjects> & {
	counts: {
		accepted: number;
		pending: number;
		removed: number;
	};
	stats: {
		available_slots: number;
		is_full: boolean;
	};
};

const fetchData = async (
	endpoint: string,
	token: string,
): Promise<TAdminProjectsResponse> => {
	try {
		const req = await fetch(`${API_PREFIX}${endpoint}`, {
			method: "GET",
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

export const useAdminProject = (projectId: number, token: string) => {
	const query = useQuery({
		queryKey: [`admin-project`],
		queryFn: () => fetchData(`/admin/projects/${projectId}`, token),
	});
	return query;
};
