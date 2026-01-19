import type { IProjectDetail } from "@/interfaces/IParticipantProjectDetail";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

const fetchData = async (
	endpoint: string,
	slug: string,
	token: string,
): Promise<IProjectDetail> => {
	try {
		const req = await fetch(`${API_PREFIX}${endpoint}/${slug}`, {
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

export const useProject = (slug: string, token: string) => {
	const query = useQuery({
		queryKey: ["project", slug],
		queryFn: () => fetchData("/projects", slug, token),
	});
	return query;
};
