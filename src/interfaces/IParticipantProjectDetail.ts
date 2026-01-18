interface IMembership {
	status: string;
	accepted_at: string;
	removed_at: string | null;
	blocked: boolean;
}
export interface IPaymentMethodPix {
	id: number;
	type: "pix";
	label: string;
	sort_order: number;
	is_active: boolean;
	payload: {
		pix_key: string;
		pix_holder_name: string;
	};
}

export interface IPaymentMethodBankTransfer {
	id: number;
	type: "bank_transfer";
	label: string;
	sort_order: number;
	is_active: boolean;
	payload: {
		bank_name: string;
		bank_code: string;
		agency: string;
		account_number: string;
		account_type: "checking" | "savings";
		account_holder_name: string;
		document: string;
	};
}

export interface IProject {
	id: number;
	title: string;
	slug: string;
	description?: string | null;
	participant_limit: number;
	amount_per_participant: string;
	payment_interval: string;
	payments_per_interval: number;
	payment_methods: IPaymentMethodPix[] | IPaymentMethodBankTransfer[];
	is_active: boolean;
	created_by_user_id: number;
	created_at: string;
	updated_at: string;
}
export interface IProjectDetail {
	data: IProject;
	membership: IMembership;
	stats: {
		accepted_count: number;
		available_slots: number;
		is_full: boolean;
	};
}
