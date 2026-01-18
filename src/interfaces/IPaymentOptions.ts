import type { TPaymentInterval } from "@/types/TPaymentInterval";

interface IWeeks {
	value: number;
	label: string;
}

export interface IPaymentOptions {
	payment_interval: TPaymentInterval;
	payments_per_interval: number;
	sequence_range: {
		min: number;
		max: number;
	};
	weeks_in_month: number;
	weeks: IWeeks[];
}
