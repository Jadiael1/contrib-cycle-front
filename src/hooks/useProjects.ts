import type { IBaseResponse } from "@/interfaces/IBaseResponse";
import type { ICollectiveProjectPublic } from "@/interfaces/ICollectiveProjectPublic";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

const fetchData = async (
	endpoint: string,
): Promise<IBaseResponse<ICollectiveProjectPublic[]>> => {
	try {
		const req = await fetch(`${API_PREFIX}${endpoint}`);
		if (!req.ok) {
			throw new Error(`HTTP error! status: ${req.status}`);
		}
		const resp = await req.json();
		return resp;
	} catch (error) {
		throw new Error(`HTTP error! error: ${error}`);
	}
};

export const useProjects = () => {
	const query = useQuery({
		queryKey: ["all-projects"],
		queryFn: () => fetchData("/projects"),
	});
	return query;
};
