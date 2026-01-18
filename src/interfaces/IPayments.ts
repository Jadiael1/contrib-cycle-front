export interface IPayment {
	id: number;
	amount: string;
	paid_at: string;
	receipt_path: string;
	period: {
		year: number;
		month: number;
		week_of_month: number;
		sequence: number;
	};
	created_at: string;
}
