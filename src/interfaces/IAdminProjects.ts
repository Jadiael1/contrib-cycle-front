export interface IAdminProjects {
	id: number;
	title: string;
	slug: string;
	description?: string;
	participant_limit: number;
	amount_per_participant: string;
	payment_interval: string;
	payments_per_interval: number;
	is_active: boolean;
	created_by_user_id: number;
	created_at: string;
	updated_at: string;
}
