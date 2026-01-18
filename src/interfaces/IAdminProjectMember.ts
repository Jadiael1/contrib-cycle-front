export interface IAdminProjectMember {
	membership_id: number;
	status: "pending" | "accepted" | "removed";
	accepted_at: string | null;
	removed_at: string | null;
	user: {
		id: number;
		phone: string | null;
		first_name: string | null;
		last_name: string | null;
	};
}
