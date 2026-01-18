export type TLoginPayload =
	| { username: string; password: string; phone?: never }
	| { phone: string; username?: never; password?: never };
