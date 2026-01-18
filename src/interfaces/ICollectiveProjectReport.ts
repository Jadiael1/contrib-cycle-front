interface ICollectiveProjectReportFilters {
	year?: number;
	month?: number | null;
	week_of_month?: number | null;
	status_scope?: "accepted_only" | "include_removed";
	disk?: string;
}

interface ICollectiveProjectReportFile {
	name: string | null;
	mime_type: string | null;
	size: number | null;
	generated_at: string | null;
}

export interface ICollectiveProjectReport {
	id: number;
	type: "payment_status";
	status: "processing" | "completed" | "failed";
	filters: ICollectiveProjectReportFilters;
	file: ICollectiveProjectReportFile;
	download_url: string | null;
	created_by_user_id: number | null;
	created_at: string | null;
	updated_at: string | null;
	error_message?: string | null;
}
