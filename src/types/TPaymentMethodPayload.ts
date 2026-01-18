import type { IPaymentMethodPayloadBankTransfer } from "@/interfaces/IPaymentMethodPayloadBankTransfer";
import type { IPaymentMethodPayloadPix } from "@/interfaces/IPaymentMethodPayloadPix";

export type TPaymentMethodPayload =
	| IPaymentMethodPayloadPix
	| IPaymentMethodPayloadBankTransfer;
