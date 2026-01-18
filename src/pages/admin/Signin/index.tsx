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
import { Orbit, Lock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const SigninPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { toast } = useToast();

	const { adminUser, adminToken, isLoading, signin } = useAuth();

	useEffect(() => {
		if (!isLoading && adminUser && adminToken) {
			navigate("/admin/projects");
		}
	}, [adminToken, adminUser, isLoading, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!username.trim() || !password.trim()) {
			setError("Preencha todos os campos.");
			return;
		}

		try {
			await signin({ username: username.trim(), password: password.trim() });
			toast({
				title: "Sucesso",
				description: "Login realizado com sucesso!",
				variant: "default",
			});
			navigate("/admin/projects");
		} catch (err) {
			const apiError = err as { message?: string };
			setError(apiError.message || "Credenciais inválidas.");
		}
	};

	return (
		<div className="min-h-screen stars-bg flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Orbit className="h-12 w-12 text-cosmic-cyan mx-auto mb-4 animate-pulse-glow" />
					<h1 className="text-2xl font-bold text-star-white">
						Centro de Controle
					</h1>
					<p className="text-star-muted mt-2">
						Área restrita para administradores
					</p>
				</div>

				<Card variant="glass">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lock className="h-5 w-5" />
							Login Admin
						</CardTitle>
						<CardDescription>
							Entre com suas credenciais de administrador.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
									<AlertCircle className="h-4 w-4 shrink-0" />
									{error}
								</div>
							)}

							<Input
								id="signin-username"
								label="Usuário"
								placeholder="admin"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
							/>

							<Input
								id="signin-password"
								label="Senha"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
							/>

							<Button type="submit" className="w-full">
								Entrar
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
export default SigninPage;
