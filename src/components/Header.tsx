import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
	Orbit,
	ChevronDown,
	LogOut,
	User,
	Shield,
	LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import routesSite from "@/routes/routesSite";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { IUser } from "@/interfaces/IUser";

const Header = () => {
	const {
		isLoading,
		participantUser,
		participantToken,
		adminUser,
		adminToken,
		signout,
	} = useAuth();
	const [activeMenu, setActiveMenu] = useState<"participant" | "admin" | null>(
		null,
	);
	const location = useLocation();
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setActiveMenu(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Helpers para formatar nome/fallback
	const getUserDisplayName = (user: IUser | null) => {
		if (!user) return "Usuário";
		if (user.first_name) return user.first_name;
		if (user.username) return user.username;
		if (user.phone) return user.phone;
		return "Explorador";
	};

	const hasParticipant = !isLoading && participantUser && participantToken;
	const hasAdmin = !isLoading && adminUser && adminToken;

	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/5 bg-space-void/80 backdrop-blur-xl">
			<div className="container flex h-18 items-center justify-between px-6">
				{/* LOGO */}
				<div className="flex items-center gap-10">
					<Link to="/" className="flex items-center gap-3 group">
						<div className="relative flex items-center justify-center">
							<Orbit className="h-8 w-8 text-cosmic-cyan transition-transform duration-slow group-hover:rotate-180" />
							<div className="absolute inset-0 bg-cosmic-cyan/20 blur-lg rounded-full animate-pulse-glow" />
						</div>
						<div className="flex flex-col">
							<span className="text-lg font-bold leading-none tracking-wider text-star-white uppercase">
								Contrib <span className="text-cosmic-cyan">Cycle</span>
							</span>
							{/* <span className="text-[10px] font-mono text-star-muted/60 tracking-[0.2em] uppercase">
								Public Access
							</span> */}
						</div>
					</Link>

					<nav className="hidden lg:flex items-center gap-8">
						{routesSite?.map((route) => {
							const isActive = location.pathname === route.path;
							return (
								<Link
									key={route.path}
									to={route.path}
									className={cn(
										"text-sm font-medium tracking-wide transition-all duration-normal hover:text-cosmic-cyan flex items-center gap-2",
										isActive ? "text-cosmic-cyan" : "text-star-dim",
									)}
								>
									{isActive && (
										<div className="h-1 w-1 rounded-full bg-cosmic-cyan shadow-[0_0_8px_hsl(var(--cosmic-cyan))]" />
									)}
									{route.displayName}
								</Link>
							);
						})}
					</nav>
				</div>

				{/* AUTH AREA */}
				<div className="flex items-center gap-3" ref={menuRef}>
					{/* PERFIL PARTICIPANTE */}
					{hasParticipant ? (
						<div className="relative">
							<button
								onClick={() =>
									setActiveMenu(
										activeMenu === "participant" ? null : "participant",
									)
								}
								className={cn(
									"group flex items-center gap-3 pl-4 pr-3 py-1.5 rounded-full border transition-all duration-normal cursor-pointer",
									activeMenu === "participant"
										? "border-cosmic-cyan bg-cosmic-cyan/10 shadow-[0_0_15px_hsl(var(--cosmic-cyan)/0.2)]"
										: "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20",
								)}
							>
								{/* Infos do Usuário */}
								<div className="flex flex-col items-end">
									<span className="text-[9px] font-mono uppercase text-star-muted leading-none tracking-tight">
										Participante
									</span>
									<span className="text-sm font-bold text-star-white leading-tight">
										{getUserDisplayName(participantUser)}
									</span>
								</div>

								{/* Avatar e Indicador */}
								<div className="flex items-center gap-2">
									<div
										className={cn(
											"h-8 w-8 rounded-full border flex items-center justify-center transition-colors",
											activeMenu === "participant"
												? "bg-cosmic-cyan/20 border-cosmic-cyan/40"
												: "bg-white/10 border-white/10 group-hover:border-cosmic-cyan/30",
										)}
									>
										<User
											className={cn(
												"h-4 w-4 transition-colors",
												activeMenu === "participant"
													? "text-cosmic-cyan"
													: "text-star-dim group-hover:text-cosmic-cyan",
											)}
										/>
									</div>

									{/* A SETA: O indicador visual crucial */}
									<ChevronDown
										className={cn(
											"h-4 w-4 text-star-muted transition-all duration-300 ease-in-out",
											activeMenu === "participant"
												? "rotate-180 text-cosmic-cyan"
												: "group-hover:text-star-white",
										)}
									/>
								</div>
							</button>

							{activeMenu === "participant" && (
								<div className="absolute right-0 mt-3 w-56 glass-card rounded-xl border border-white/10 p-2 shadow-2xl animate-scale-in origin-top-right">
									{/* ... restante do menu igual ... */}
									<div className="px-3 py-2 border-b border-white/5 mb-2">
										<p className="text-[10px] font-mono text-cosmic-cyan uppercase tracking-wider">
											Sessão Ativa
										</p>
										<p className="text-xs text-star-dim truncate">
											{participantUser?.username ||
												participantUser?.phone ||
												"Acesso Externo"}
										</p>
									</div>
									{/* <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-star-dim hover:text-star-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
										<UserCircle className="h-4 w-4 group-hover:text-cosmic-cyan" />
										Meu Perfil
									</button>
									<div className="h-px bg-white/5 my-2" /> */}
									<button
										onClick={() => signout("participant", participantToken!)}
										className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
									>
										<LogOut className="h-4 w-4" /> Encerrar Sessão
									</button>
								</div>
							)}
						</div>
					) : null}

					{/* PERFIL ADMIN (Se logado) */}
					{hasAdmin ? (
						<div className="relative">
							<button
								onClick={() =>
									setActiveMenu(activeMenu === "admin" ? null : "admin")
								}
								className={cn(
									"flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
									activeMenu === "admin"
										? "border-cosmic-purple bg-cosmic-purple/20 shadow-[0_0_10px_hsl(var(--cosmic-purple)/0.2)]"
										: "border-cosmic-purple/30 bg-cosmic-purple/5 hover:bg-cosmic-purple/10",
								)}
							>
								<Shield className="h-4 w-4 text-cosmic-purple" />
								<span className="text-xs font-mono font-bold text-cosmic-purple uppercase hidden sm:inline">
									Admin
								</span>
								<ChevronDown
									className={cn(
										"h-3 w-3 text-cosmic-purple transition-transform",
										activeMenu === "admin" && "rotate-180",
									)}
								/>
							</button>

							{activeMenu === "admin" && (
								<div className="absolute right-0 mt-3 w-48 glass-card rounded-xl border border-cosmic-purple/20 p-2 shadow-2xl animate-scale-in origin-top-right">
									<div className="px-3 py-2 border-b border-white/5 mb-1">
										<p className="text-[10px] font-mono text-cosmic-purple uppercase tracking-tighter">
											Nível: Administrator
										</p>
										<p className="text-xs text-star-white truncate font-bold">
											{adminUser?.username || "Admin"}
										</p>
									</div>
									<Link
										to="/admin"
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-star-dim hover:text-star-white hover:bg-white/5 rounded-lg transition-colors"
									>
										<LayoutDashboard className="h-4 w-4" /> Painel Geral
									</Link>
									<button
										onClick={() => signout("admin", adminToken!)}
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer mt-1"
									>
										<LogOut className="h-4 w-4" /> Sair do Admin
									</button>
								</div>
							)}
						</div>
					) : (
						<Link to="/admin/login" className="hidden sm:block">
							<Button
								variant="ghost"
								size="sm"
								className="text-star-muted hover:text-cosmic-purple font-mono text-[10px] uppercase tracking-widest cursor-pointer"
							>
								Admin Area
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
