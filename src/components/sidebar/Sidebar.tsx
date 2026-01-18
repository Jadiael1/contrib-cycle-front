import { Link, useLocation, useNavigate } from "react-router";
import { Orbit, LogOut, Globe, LayoutDashboard } from "lucide-react"; // Importando LayoutDashboard
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import routesAdmin from "@/routes/routesAdmin";
import { useToast } from "@/hooks/useToast";

export const Sidebar = () => {
	const location = useLocation();
	const { signout, adminToken } = useAuth();
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleLogout = async () => {
		await signout("admin", adminToken!);
		navigate("/admin/login", { replace: true });
		toast({
			title: "Sessão Encerrada",
			description: "Conexão com o Centro de Comando finalizada.",
		});
	};

	const adminHomePath = "/admin";

	return (
		<div className="flex flex-col h-full bg-space-deep/50 backdrop-blur-md overflow-hidden">
			{/* Brand Area - Agora clicável para voltar ao início do Admin */}
			<Link
				to={adminHomePath}
				className="p-6 border-b border-white/5 shrink-0 group/logo block hover:bg-white/5 transition-colors"
			>
				<div className="flex items-center gap-3">
					<div className="relative">
						<Orbit className="h-8 w-8 text-cosmic-purple animate-pulse-glow group-hover/logo:rotate-90 transition-transform duration-700" />
						<div className="absolute inset-0 bg-cosmic-purple/20 blur-xl rounded-full" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-bold text-star-white tracking-widest uppercase">
							Centro de Comando
						</span>
						<span className="text-[10px] font-mono text-cosmic-purple uppercase leading-none">
							Admin Level
						</span>
					</div>
				</div>
			</Link>

			{/* Navigation - SCROLLÁVEL */}
			<nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar space-y-2">
				<p className="px-4 text-[10px] font-mono text-star-muted uppercase tracking-[0.2em] mb-4 opacity-50">
					Módulos de Sistema
				</p>

				<div className="space-y-1.5">
					{/* Item de Home/Dashboard fixo no topo da lista */}
					<Link
						to={adminHomePath}
						className={cn(
							"group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 border",
							location.pathname === adminHomePath
								? "bg-cosmic-purple/10 border-cosmic-purple/30 text-star-white shadow-[0_0_20px_rgba(168,85,247,0.15)]"
								: "border-transparent text-star-dim hover:bg-white/5 hover:text-star-white",
						)}
					>
						<div className="flex items-center gap-3">
							<LayoutDashboard
								className={cn(
									"h-5 w-5 transition-transform duration-300 group-hover:scale-110",
									location.pathname === adminHomePath
										? "text-cosmic-purple"
										: "text-star-muted group-hover:text-cosmic-purple",
								)}
							/>
							<span className="text-sm font-medium tracking-wide">
								Dashboard
							</span>
						</div>
					</Link>

					{/* Divisor sutil */}
					<div className="h-px bg-white/5 mx-4 my-2" />

					{/* Mapeamento dos outros módulos */}
					{routesAdmin
						.filter((item) => item.visibleInDisplay)
						.map((item) => {
							const isActive = location.pathname === item.path;
							return (
								<Link
									key={item.path}
									to={item.path}
									className={cn(
										"group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 border",
										isActive
											? "bg-cosmic-purple/10 border-cosmic-purple/30 text-star-white shadow-[0_0_20px_rgba(168,85,247,0.15)]"
											: "border-transparent text-star-dim hover:bg-white/5 hover:text-star-white",
									)}
								>
									<div className="flex items-center gap-3">
										{item.icon && (
											<item.icon
												className={cn(
													"h-5 w-5 transition-transform duration-300 group-hover:scale-110",
													isActive
														? "text-cosmic-purple"
														: "text-star-muted group-hover:text-cosmic-purple",
												)}
											/>
										)}
										<span className="text-sm font-medium tracking-wide">
											{item.displayName}
										</span>
									</div>
									{isActive && (
										<div className="h-1 w-1 rounded-full bg-cosmic-purple shadow-[0_0_8px_#a855f7] animate-pulse" />
									)}
								</Link>
							);
						})}
				</div>
			</nav>

			{/* Footer Sidebar */}
			<div className="p-4 border-t border-white/5 bg-space-void/40 shrink-0 space-y-1">
				<Link
					to="/"
					className="w-full flex items-center gap-3 px-4 py-3 text-sm text-star-dim hover:text-cosmic-cyan transition-all rounded-xl hover:bg-cosmic-cyan/5 group border border-transparent hover:border-cosmic-cyan/20"
				>
					<Globe className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
					<span className="font-mono uppercase text-xs tracking-tighter">
						Visualizar Site
					</span>
				</Link>

				<button
					onClick={handleLogout}
					className="w-full flex items-center gap-3 px-4 py-3 text-sm text-star-muted hover:text-destructive transition-all rounded-xl hover:bg-destructive/10 group cursor-pointer border border-transparent hover:border-destructive/20"
				>
					<LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
					<span className="font-mono uppercase text-xs tracking-tighter">
						Encerrar Sistema
					</span>
				</button>
			</div>
		</div>
	);
};
