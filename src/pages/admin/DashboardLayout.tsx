import { type ReactNode, useState } from "react";
import { Menu, X, Bell, ShieldCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { cn } from "@/lib/utils";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { adminUser } = useAuth();

	return (
		<div className="min-h-screen bg-space-void flex overflow-hidden">
			{/* SIDEBAR DESKTOP - Ocupa altura total e fica fixa na lateral */}
			<aside className="hidden lg:block w-64 h-screen shrink-0 border-r border-white/5 sticky top-0">
				<Sidebar />
			</aside>

			{/* MOBILE OVERLAY & SIDEBAR */}
			<div
				className={cn(
					"fixed inset-0 z-50 lg:hidden transition-all duration-500",
					isMobileMenuOpen ? "visible" : "invisible",
				)}
			>
				{/* Backdrop escurecido */}
				<div
					className={cn(
						"absolute inset-0 bg-space-void/80 backdrop-blur-sm transition-opacity duration-500",
						isMobileMenuOpen ? "opacity-100" : "opacity-0",
					)}
					onClick={() => setIsMobileMenuOpen(false)}
				/>

				{/* Container da Sidebar Mobile */}
				<aside
					className={cn(
						"absolute top-0 left-0 w-72 h-full bg-space-deep border-r border-white/10 shadow-2xl transition-transform duration-500 ease-out flex flex-col",
						isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<div className="p-4 flex justify-end shrink-0">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMobileMenuOpen(false)}
							className="hover:bg-white/10 rounded-full"
						>
							<X className="h-6 w-6 text-star-white" />
						</Button>
					</div>
					<div className="flex-1 overflow-hidden">
						<Sidebar />
					</div>
				</aside>
			</div>

			{/* CONTEÚDO PRINCIPAL */}
			<div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
				{/* Top Header */}
				<header className="h-16 border-b border-white/5 bg-space-deep/30 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between shrink-0 z-30">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							onClick={() => setIsMobileMenuOpen(true)}
						>
							<Menu className="h-6 w-6" />
						</Button>
						<div className="flex items-center gap-2 px-3 py-1 bg-cosmic-purple/10 rounded-full border border-cosmic-purple/20">
							<ShieldCheck className="h-3.5 w-3.5 text-cosmic-purple" />
							<span className="text-[10px] font-mono text-cosmic-purple uppercase font-bold tracking-[0.15em] hidden xs:inline">
								SISTEMA OPERACIONAL
							</span>
						</div>
					</div>

					<div className="flex items-center gap-3 lg:gap-6">
						<button className="p-2 text-star-muted hover:text-star-white transition-colors relative">
							<Bell className="h-5 w-5" />
							<span className="absolute top-2 right-2 h-1.5 w-1.5 bg-cosmic-pink rounded-full ring-2 ring-space-deep animate-pulse" />
						</button>
						<div className="h-8 w-px bg-white/10 hidden sm:block" />
						<div className="flex items-center gap-3 pl-2">
							<div className="text-right hidden sm:block leading-tight">
								<p className="text-xs font-bold text-star-white">
									{adminUser?.username}
								</p>
								<p className="text-[9px] font-mono text-cosmic-purple uppercase opacity-70 italic">
									Master Commander
								</p>
							</div>
							<div className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-linear-to-br from-cosmic-purple/30 to-space-deep border border-cosmic-purple/40 flex items-center justify-center shadow-glow-accent/20 shadow-lg">
								<Shield className="h-5 w-5 text-cosmic-purple" />
							</div>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto stars-bg scroll-smooth">
					<div className="max-w-7xl mx-auto min-h-full">
						<div className="animate-fade-in">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
};
