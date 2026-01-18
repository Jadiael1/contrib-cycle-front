import { useState } from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router";
import { Orbit, Lock, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import Loading from "@/components/feedback/Loading";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const SigninPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();
	const { toast } = useToast();
	const { adminToken, isLoading, signin } = useAuth();
	const location = useLocation();
	const from = location.state?.from?.pathname;

	if (isLoading) return <Loading />;
	if (adminToken) return <Navigate to={from ?? "/admin/projects"} replace />;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!username.trim() || !password.trim()) {
			setError("Preencha todos os parâmetros de acesso.");
			return;
		}

		setIsSubmitting(true);
		try {
			await signin({ username: username.trim(), password: password.trim() });
			toast({
				title: "Acesso Autorizado",
				description: "Bem-vindo ao Centro de Comando.",
			});
			navigate(from ?? "/admin/projects", { replace: true });
		} catch (err) {
			const apiError = err as { message?: string };
			setError(apiError.message || "Credenciais de administrador inválidas.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-space-void stars-bg flex items-center justify-center p-4 relative overflow-hidden">
			{/* Botão de Escape - Superior Esquerdo */}
			<div className="absolute top-8 left-8 z-10">
				<Link to="/">
					<Button
						variant="ghost"
						size="sm"
						className="group text-star-muted hover:text-star-white cursor-pointer"
					>
						<ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
						Voltar ao Site
					</Button>
				</Link>
			</div>

			<div className="w-full max-w-md animate-fade-in">
				<div className="text-center mb-8">
					<div className="relative inline-block">
						<Orbit className="h-14 w-14 text-cosmic-purple mx-auto mb-4 animate-pulse-glow" />
						<div className="absolute inset-0 bg-cosmic-purple/20 blur-2xl rounded-full" />
					</div>
					<h1 className="text-2xl font-bold text-star-white tracking-tight">
						Centro de <span className="text-cosmic-purple">Comando</span>
					</h1>
					<p className="text-star-muted mt-2 font-mono text-xs uppercase tracking-[0.2em]">
						Restricted Admin Access
					</p>
				</div>

				<Card variant="glass" className="border-t-0 cockpit-panel">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-star-white">
							<Lock className="h-5 w-5 text-cosmic-purple" />
							Autenticação
						</CardTitle>
						<CardDescription className="text-star-dim">
							Insira suas credenciais para descriptografar o acesso.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-5">
							{error && (
								<div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm animate-shake">
									<AlertCircle className="h-4 w-4 shrink-0" />
									{error}
								</div>
							)}

							<div className="space-y-4">
								<Input
									id="signin-username"
									label="Identificador"
									placeholder="Seu usuário admin"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									autoComplete="username"
									className="bg-space-void/50 border-white/10 focus:border-cosmic-purple/50"
									disabled={isSubmitting}
								/>

								<Input
									id="signin-password"
									label="Chave de Acesso"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="current-password"
									className="bg-space-void/50 border-white/10 focus:border-cosmic-purple/50"
									disabled={isSubmitting}
								/>
							</div>

							<Button
								type="submit"
								className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80 text-star-white shadow-glow-accent/20 cursor-pointer h-11"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Validando...
									</>
								) : (
									"Iniciar Sessão"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Rodapé Auxiliar */}
				<p className="text-center mt-8 text-[10px] font-mono text-star-muted uppercase tracking-widest opacity-50">
					Contrib Cycle © 2026 • Secure Terminal
				</p>
			</div>
		</div>
	);
};

export default SigninPage;
