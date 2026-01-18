"use client";
import type { IUser } from "@/interfaces/IUser";
import type { TLoginPayload } from "@/types/TLoginPayload";
import { createContext } from "react";

export type TAuthContextProps = {
	adminToken: string | null;
	participantToken: string | null;
	adminUser: IUser | null;
	participantUser: IUser | null;
	signin: (payload: TLoginPayload) => Promise<void>;
	signout: (role: "participant" | "admin", token: string) => Promise<void>;
	isLoading: boolean;
};

export const AuthContext = createContext<TAuthContextProps | undefined>(
	undefined,
);
