import type { TPaymentInterval } from "@/types/TPaymentInterval";
import type { ICollectiveProjectPaymentMethod } from "@/interfaces/ICollectiveProjectPaymentMethod";

export interface ICollectiveProjectPublic {
	id: number;
	title: string;
	slug: string;
	participant_limit: number;
	amount_per_participant: string;
	payment_interval: TPaymentInterval;
	payments_per_interval: number;
	payment_methods: ICollectiveProjectPaymentMethod[];
}
