import { useEffect, useState, useTransition, type ReactNode } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { IUser } from "@/interfaces/IUser";
import type { TLoginPayload } from "@/types/TLoginPayload";
import type { TSignInResponse } from "@/types/TSignInResponse";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;
const API_PREFIX = `${API_BASE_URL}/api/v1`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [adminUser, setAdminUser] = useState<IUser | null>(null);
	const [participantUser, setParticipantUser] = useState<IUser | null>(null);
	const [adminToken, setAdminToken] = useState<string | null>(
		localStorage.getItem("auth_admin_token"),
	);
	const [participantToken, setParticipantToken] = useState<string | null>(
		localStorage.getItem("auth_participant_token"),
	);

	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		const hasAdminToken = !!adminToken;
		const hasParticipantToken = !!participantToken;
		if (!hasAdminToken && !hasParticipantToken) return;

		const checks = [
			{ type: "admin", hasToken: hasAdminToken, token: adminToken },
			{
				type: "participant",
				hasToken: hasParticipantToken,
				token: participantToken,
			},
		] as const;

		startTransition(async () => {
			for (const check of checks) {
				if (!check.hasToken) continue;
				try {
					const req = await fetch(`${API_PREFIX}/auth/me`, {
						headers: {
							accept: "application/json",
							Authorization: `Bearer ${check.token!}`,
						},
						cache: "no-store",
					});
					if (!req.ok) {
						throw new Error(`HTTP error! status: ${req.status}`);
					}
					const data: IUser = await req.json();
					if (check.type === "admin") {
						setAdminUser(data);
					} else {
						setParticipantUser(data);
					}
				} catch (error) {
					console.error("Auth /me failed:", check.type, error);
				}
			}
		});
	}, [adminToken, participantToken]);

	const signin = async (payload: TLoginPayload) => {
		const isPasswordLogin = "username" in payload && "password" in payload;
		const reqBody = isPasswordLogin
			? { username: payload.username!, password: payload.password! }
			: { phone: payload.phone! };
		const reqUrl = isPasswordLogin
			? `${API_PREFIX}/auth/admin/login`
			: `${API_PREFIX}/auth/participant/login`;
		try {
			const req = await fetch(`${reqUrl}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
					accept: "application/json",
				},
				body: JSON.stringify(reqBody),
				cache: "no-store",
			});
			if (!req.ok) {
				throw new Error(`HTTP error! status: ${req.status}`);
			}
			const data: TSignInResponse = await req.json();
			if (isPasswordLogin) {
				setAdminToken(data.token);
				localStorage.setItem("auth_admin_token", data.token);
			} else {
				setParticipantToken(data.token);
				localStorage.setItem("auth_participant_token", data.token);
			}
		} catch (error) {
			throw new Error(`HTTP error! error: ${error}`);
		}
	};

	const signout = async (role: "participant" | "admin", token: string) => {
		try {
			const reqUrl = `${API_PREFIX}/auth/logout`;
			const req = await fetch(`${reqUrl}`, {
				method: "POST",
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				cache: "no-store",
			});
			if (!req.ok) {
				throw new Error(`HTTP error! status: ${req.status}`);
			}
			if (role === "admin") {
				setAdminUser(null);
				localStorage.removeItem("auth_admin_token");
				setAdminToken(null);
			} else {
				setParticipantUser(null);
				localStorage.removeItem("auth_participant_token");
				setParticipantToken(null);
			}
		} catch (error) {
			throw new Error(`HTTP error! error: ${error}`);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				adminToken,
				participantToken,
				adminUser,
				participantUser,
				signin,
				signout,
				isLoading: isPending,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
