import { useNavigate } from "react-router";
import { Rocket, CreditCard, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { useCreateProject } from "@/hooks/useCreateProject";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, type FormEvent } from "react";
import type { TPaymentInterval } from "@/types/TPaymentInterval";
import { DashboardLayout } from "../DashboardLayout";

export default function AdminProjectNew() {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { adminUser, adminToken } = useAuth();
	const createMutation = useCreateProject(adminToken!);

	useEffect(() => {
		if (!adminUser || !adminToken) {
			navigate("/admin/login");
		}
	}, [adminToken, adminUser, navigate]);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		participant_limit: "",
		amount_per_participant: "",
		payment_interval: "month" as TPaymentInterval,
		payments_per_interval: "1",
		payment_method_type: "pix",
		pix_key: "",
		pix_holder_name: "",
		bank_name: "",
		bank_code: "",
		agency: "",
		account_number: "",
		account_type: "checking",
		account_holder_name: "",
		document: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [generalError, setGeneralError] = useState("");

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) newErrors.title = "Título é obrigatório";
		if (
			!formData.participant_limit ||
			parseInt(formData.participant_limit) < 1
		) {
			newErrors.participant_limit = "Limite deve ser maior que 0";
		}
		if (
			!formData.amount_per_participant ||
			parseFloat(formData.amount_per_participant) <= 0
		) {
			newErrors.amount_per_participant = "Valor deve ser maior que 0";
		}
		if (
			!formData.payments_per_interval ||
			parseInt(formData.payments_per_interval) < 1
		) {
			newErrors.payments_per_interval = "Deve ser pelo menos 1";
		}

		if (formData.payment_method_type === "pix") {
			if (!formData.pix_key.trim())
				newErrors.pix_key = "Chave PIX é obrigatória";
			if (!formData.pix_holder_name.trim())
				newErrors.pix_holder_name = "Nome do titular é obrigatório";
		} else {
			if (!formData.bank_name.trim())
				newErrors.bank_name = "Nome do banco é obrigatório";
			if (!formData.agency.trim()) newErrors.agency = "Agência é obrigatória";
			if (!formData.account_number.trim())
				newErrors.account_number = "Conta é obrigatória";
			if (!formData.account_holder_name.trim())
				newErrors.account_holder_name = "Titular é obrigatório";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setGeneralError("");

		if (!validateForm()) return;

		const payload = {
			title: formData.title,
			description: formData.description || undefined,
			participant_limit: parseInt(formData.participant_limit),
			amount_per_participant: parseFloat(formData.amount_per_participant),
			payment_interval: formData.payment_interval,
			payments_per_interval: parseInt(formData.payments_per_interval),
			payment_method_type: formData.payment_method_type,
			payment_method_payload:
				formData.payment_method_type === "pix"
					? {
							pix_key: formData.pix_key,
							pix_holder_name: formData.pix_holder_name,
						}
					: {
							bank_name: formData.bank_name,
							bank_code: formData.bank_code || undefined,
							agency: formData.agency,
							account_number: formData.account_number,
							account_type: formData.account_type,
							account_holder_name: formData.account_holder_name,
							document: formData.document || undefined,
						},
		};

		try {
			const result = await createMutation.mutateAsync(
				payload as Parameters<typeof createMutation.mutateAsync>[0],
			);
			toast({
				title: "Sucesso",
				description: "Projeto criado com sucesso!",
				variant: "default",
			});
			navigate(`/admin/projects/${result.data.id}`);
		} catch (err) {
			const apiError = err as {
				message?: string;
				validationErrors?: Record<string, string[]>;
			};
			if (apiError.validationErrors) {
				const formErrors: Record<string, string> = {};
				Object.entries(apiError.validationErrors).forEach(([key, messages]) => {
					formErrors[key] = messages[0];
				});
				setErrors(formErrors);
			}
			setGeneralError(apiError.message || "Erro ao criar projeto.");
		}
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen stars-bg">
				<main className="container px-4 py-8">
					<div className="max-w-2xl mx-auto">
						<div className="text-center mb-8">
							<Rocket className="h-12 w-12 text-cosmic-cyan mx-auto mb-4" />
							<h1 className="text-2xl font-bold text-star-white">
								Criar Novo Projeto
							</h1>
							<p className="text-star-muted">
								Configure os detalhes do seu projeto coletivo
							</p>
						</div>

						<form onSubmit={handleSubmit}>
							{generalError && (
								<div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
									<AlertCircle className="h-4 w-4 shrink-0" />
									{generalError}
								</div>
							)}

							{/* Basic Info */}
							<Card variant="glass" className="mb-6">
								<CardHeader>
									<CardTitle>Informações Básicas</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<Input
										label="Título do Projeto"
										placeholder="Ex: Projeto Saturno"
										value={formData.title}
										onChange={(e) => updateField("title", e.target.value)}
										error={errors.title}
									/>
									<Input
										label="Descrição (opcional)"
										placeholder="Descreva seu projeto..."
										value={formData.description}
										onChange={(e) => updateField("description", e.target.value)}
									/>
									<div className="grid grid-cols-2 gap-4">
										<Input
											label="Limite de Participantes"
											type="number"
											min="1"
											placeholder="50"
											value={formData.participant_limit}
											onChange={(e) =>
												updateField("participant_limit", e.target.value)
											}
											error={errors.participant_limit}
										/>
										<Input
											label="Valor por Participante (R$)"
											type="number"
											min="0.01"
											step="0.01"
											placeholder="50.00"
											value={formData.amount_per_participant}
											onChange={(e) =>
												updateField("amount_per_participant", e.target.value)
											}
											error={errors.amount_per_participant}
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<Select
											label="Intervalo de Pagamento"
											value={formData.payment_interval}
											onChange={(e) =>
												updateField("payment_interval", e.target.value)
											}
											options={[
												{ value: "week", label: "Semanal" },
												{ value: "month", label: "Mensal" },
												{ value: "year", label: "Anual" },
											]}
										/>
										<Input
											label="Pagamentos por Intervalo"
											type="number"
											min="1"
											placeholder="1"
											value={formData.payments_per_interval}
											onChange={(e) =>
												updateField("payments_per_interval", e.target.value)
											}
											error={errors.payments_per_interval}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Payment Method */}
							<Card variant="glass" className="mb-6">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CreditCard className="h-5 w-5" />
										Método de Pagamento
									</CardTitle>
									<CardDescription>
										Configure o primeiro método de pagamento. Você poderá
										adicionar mais depois.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<Select
										label="Tipo"
										value={formData.payment_method_type}
										onChange={(e) =>
											updateField("payment_method_type", e.target.value)
										}
										options={[
											{ value: "pix", label: "PIX" },
											{
												value: "bank_transfer",
												label: "Transferência Bancária",
											},
										]}
									/>

									{formData.payment_method_type === "pix" ? (
										<>
											<Input
												label="Chave PIX"
												placeholder="CPF, e-mail, telefone ou chave aleatória"
												value={formData.pix_key}
												onChange={(e) => updateField("pix_key", e.target.value)}
												error={errors.pix_key}
											/>
											<Input
												label="Nome do Titular"
												placeholder="Nome completo"
												value={formData.pix_holder_name}
												onChange={(e) =>
													updateField("pix_holder_name", e.target.value)
												}
												error={errors.pix_holder_name}
											/>
										</>
									) : (
										<>
											<div className="grid grid-cols-2 gap-4">
												<Input
													label="Nome do Banco"
													placeholder="Banco do Brasil"
													value={formData.bank_name}
													onChange={(e) =>
														updateField("bank_name", e.target.value)
													}
													error={errors.bank_name}
												/>
												<Input
													label="Código do Banco"
													placeholder="001"
													value={formData.bank_code}
													onChange={(e) =>
														updateField("bank_code", e.target.value)
													}
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<Input
													label="Agência"
													placeholder="1234"
													value={formData.agency}
													onChange={(e) =>
														updateField("agency", e.target.value)
													}
													error={errors.agency}
												/>
												<Input
													label="Conta"
													placeholder="12345-6"
													value={formData.account_number}
													onChange={(e) =>
														updateField("account_number", e.target.value)
													}
													error={errors.account_number}
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<Select
													label="Tipo de Conta"
													value={formData.account_type}
													onChange={(e) =>
														updateField("account_type", e.target.value)
													}
													options={[
														{ value: "checking", label: "Corrente" },
														{ value: "savings", label: "Poupança" },
													]}
												/>
												<Input
													label="CPF/CNPJ (opcional)"
													placeholder="000.000.000-00"
													value={formData.document}
													onChange={(e) =>
														updateField("document", e.target.value)
													}
												/>
											</div>
											<Input
												label="Nome do Titular"
												placeholder="Nome completo"
												value={formData.account_holder_name}
												onChange={(e) =>
													updateField("account_holder_name", e.target.value)
												}
												error={errors.account_holder_name}
											/>
										</>
									)}
								</CardContent>
							</Card>

							<div className="flex gap-4">
								<Button
									type="button"
									variant="secondary"
									onClick={() => navigate("/admin/projects")}
									className="flex-1"
								>
									Cancelar
								</Button>
								<Button
									type="submit"
									isLoading={createMutation.isPending}
									className="flex-1"
								>
									Criar Projeto
								</Button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</DashboardLayout>
	);
}
