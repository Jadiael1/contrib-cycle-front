import { Card } from "@/components/ui/Card";
import type { ICollectiveProjectPublic } from "@/interfaces/ICollectiveProjectPublic";
import { cn, formatCurrency, getIntervalLabel } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "../ui/Badge";
import {
	ArrowRight,
	Phone,
	Sparkles,
	User,
	UserPlus,
	Users,
	X,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "@/hooks/useAuth";

const ProjectModal = ({
	setIsOpen,
	project,
}: {
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	project: ICollectiveProjectPublic;
}) => {
	const [activeTab, setActiveTab] = useState<"login" | "register">("login");
	const [phone, setPhone] = useState("");
	const { signin } = useAuth();
	const handleClose = () => setIsOpen(false);

	const titleId = `title`;
	const loginTabId = `login-tab`;
	const registerTabId = `register-tab`;
	const loginPanelId = `login-panel`;
	const registerPanelId = `register-panel`;

	const inputClassName =
		"w-full rounded-lg border border-border bg-space-dust/60 px-4 py-2.5 text-sm text-star-white placeholder:text-star-muted/60 focus-visible:ring-2 focus-visible:ring-cosmic-cyan/50";
	const labelClassName = "text-xs uppercase tracking-[0.2em] text-star-muted";

	const handleSignIn = () => {
		signin({ phone: phone });
	};

	const handleSignUp = () => {};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-space-void/80 backdrop-blur-sm animate-fade-in"
				onClick={handleClose}
				aria-hidden="true"
			/>
			<div className="relative w-full max-w-5xl">
				<div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cosmic-cyan/20 blur-3xl" />
				<div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-cosmic-purple/20 blur-3xl" />
				<Card
					variant="glass"
					glow
					role="dialog"
					aria-modal="true"
					aria-labelledby={titleId}
					className="relative z-10 w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-scale-in"
				>
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-xs uppercase tracking-[0.35em] text-star-muted">
								Acesso
							</p>
							<h3
								id={titleId}
								className="text-2xl md:text-3xl font-bold text-star-white"
							>
								Portal do Projeto
							</h3>
							<p className="mt-2 text-sm text-star-dim max-w-lg">
								Entre com seu telefone para desbloquear a proxima etapa e
								contribuir com a missao.
							</p>
						</div>
						<button
							type="button"
							onClick={handleClose}
							className="rounded-full border border-border bg-space-deep/70 p-2 text-star-dim transition hover:text-star-white hover:border-cosmic-cyan/40"
							aria-label="Fechar modal"
						>
							<X className="h-4 w-4" />
						</button>
					</div>

					<div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
						<div className="order-2 space-y-4 md:order-1">
							<div className="cockpit-panel p-4 space-y-3">
								<div className="flex items-center justify-between gap-3">
									<span className={labelClassName}>Acesso rapido</span>
									<Badge
										variant="outline"
										className="text-[10px] uppercase tracking-[0.3em]"
									>
										Sem senha
									</Badge>
								</div>
								<p className="text-sm text-star-white">
									Autentique em segundos com seu telefone.
								</p>
								<div className="flex items-center gap-2 text-xs text-star-dim">
									<Phone className="h-3.5 w-3.5 text-cosmic-cyan" />
									Confirmacao via SMS
								</div>
							</div>
							<div className="rounded-xl border border-border bg-space-nebula/70 p-4 space-y-3 w-full">
								<div>
									<span className={labelClassName}>Missao ativa</span>
									<p className="mt-2 text-sm font-semibold text-star-white">
										{project.title}
									</p>
								</div>
								<div className="flex items-center gap-2 text-star-dim text-xs">
									<Sparkles className="h-3.5 w-3.5 text-cosmic-gold" />
									<span className="font-mono text-base text-cosmic-cyan">
										{formatCurrency(project.amount_per_participant)}
									</span>
								</div>
								<p className="text-xs text-star-muted">
									{getIntervalLabel(
										project.payment_interval,
										project.payments_per_interval,
									)}
								</p>
								<div className="flex items-center gap-2 text-xs text-star-dim">
									<Users className="h-3.5 w-3.5" />
									{project.participant_limit} participantes
								</div>
							</div>
						</div>

						<div className="order-1 md:order-2">
							<div
								className="rounded-full border border-border bg-space-deep/70 p-1"
								role="tablist"
								aria-label="Formularios de acesso"
							>
								<div className="grid grid-cols-2 gap-1">
									<button
										type="button"
										id={loginTabId}
										role="tab"
										aria-controls={loginPanelId}
										aria-selected={activeTab === "login"}
										tabIndex={activeTab === "login" ? 0 : -1}
										onClick={() => setActiveTab("login")}
										className={cn(
											"rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition",
											activeTab === "login"
												? "bg-cosmic-cyan/20 text-cosmic-cyan shadow-glow"
												: "text-star-dim hover:text-star-white",
										)}
									>
										Login
									</button>
									<button
										type="button"
										id={registerTabId}
										role="tab"
										aria-controls={registerPanelId}
										aria-selected={activeTab === "register"}
										tabIndex={activeTab === "register" ? 0 : -1}
										onClick={() => setActiveTab("register")}
										className={cn(
											"rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition",
											activeTab === "register"
												? "bg-cosmic-purple/20 text-cosmic-purple shadow-glow-accent"
												: "text-star-dim hover:text-star-white",
										)}
									>
										Registrar
									</button>
								</div>
							</div>

							<div
								className="mt-6"
								role="tabpanel"
								id={activeTab === "login" ? loginPanelId : registerPanelId}
								aria-labelledby={
									activeTab === "login" ? loginTabId : registerTabId
								}
							>
								{activeTab === "login" ? (
									<form
										className="space-y-5 animate-slide-up"
										onSubmit={(event) => event.preventDefault()}
									>
										<div className="space-y-2">
											<label htmlFor={`login-phone`} className={labelClassName}>
												Numero de telefone
											</label>
											<div className="relative">
												<Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmic-cyan" />
												<input
													id={`login-phone`}
													value={phone}
													onChange={(evt) => setPhone(evt.target.value)}
													type="tel"
													inputMode="numeric"
													autoComplete="tel"
													placeholder="(00) 00000-0000"
													className={cn(inputClassName, "pl-10")}
													required
												/>
											</div>
										</div>
										<div className="rounded-xl border border-cosmic-cyan/20 bg-cosmic-cyan/5 px-4 py-3 text-xs text-star-dim">
											Use seu telefone para receber o codigo de acesso.
										</div>
										<Button
											className="w-full"
											type="submit"
											onClick={handleSignIn}
										>
											Entrar agora
											<ArrowRight className="h-4 w-4 ml-1" />
										</Button>
									</form>
								) : (
									<form
										className="space-y-5 animate-slide-up"
										onSubmit={(event) => event.preventDefault()}
									>
										<div className="space-y-2">
											<label
												htmlFor={`register-phone`}
												className={labelClassName}
											>
												Numero de telefone
											</label>
											<div className="relative">
												<Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmic-cyan" />
												<input
													id={`register-phone`}
													type="tel"
													inputMode="numeric"
													autoComplete="tel"
													placeholder="(00) 00000-0000"
													className={cn(inputClassName, "pl-10")}
													required
												/>
											</div>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<label
													htmlFor={`register-name`}
													className={labelClassName}
												>
													Nome
												</label>
												<div className="relative">
													<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmic-purple" />
													<input
														id={`register-name`}
														type="text"
														autoComplete="given-name"
														placeholder="Seu nome"
														className={cn(inputClassName, "pl-10")}
														required
													/>
												</div>
											</div>
											<div className="space-y-2">
												<label
													htmlFor={`register-lastname`}
													className={labelClassName}
												>
													Sobrenome
												</label>
												<div className="relative">
													<UserPlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmic-purple" />
													<input
														id={`register-lastname`}
														type="text"
														autoComplete="family-name"
														placeholder="Seu sobrenome"
														className={cn(inputClassName, "pl-10")}
														required
													/>
												</div>
											</div>
										</div>
										<div className="rounded-xl border border-cosmic-purple/20 bg-cosmic-purple/10 px-4 py-3 text-xs text-star-dim">
											Cadastro rapido para liberar sua vaga no projeto.
										</div>
										<Button
											className="w-full"
											type="submit"
											onClick={handleSignUp}
										>
											Criar conta
											<ArrowRight className="h-4 w-4 ml-1" />
										</Button>
									</form>
								)}
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default ProjectModal;
