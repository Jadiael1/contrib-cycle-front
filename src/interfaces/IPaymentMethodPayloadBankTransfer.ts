export interface IPaymentMethodPayloadBankTransfer {
	bank_name: string;
	bank_code?: string | null;
	agency: string;
	account_number: string;
	account_type?: "checking" | "savings" | null;
	account_holder_name: string;
	document?: string | null;
}
