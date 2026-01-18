export interface IUser {
	id: number;
	role: "participant" | "admin";
	username: string | null;
	phone: string | null;
	first_name: string | null;
	last_name: string | null;
	created_at: string;
	updated_at: string;
}
