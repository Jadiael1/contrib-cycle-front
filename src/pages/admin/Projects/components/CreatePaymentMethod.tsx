import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/Modal";
import { Portal } from "@/components/ui/Portal";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePaymentMethod } from "@/hooks/useCreatePaymentMethod";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { TPaymentMethodType } from "@/types/TPaymentMethodType";
import { Building2, QrCode } from "lucide-react";
import { useState } from "react";

type TCreatePaymentMethodProps = {
	isCreatePaymentMethodModalOpen: boolean;
	closeModal: () => void;
	projectId: number;
	projectSlug?: string;
};

type TCreateForm = {
	label: string;
	pix_key: string;
	pix_holder_name: string;
	bank_name: string;
	bank_code: string;
	agency: string;
	account_number: string;
	account_type: "checking" | "savings";
	account_holder_name: string;
	document: string;
};

// Create Payment Method Modal
const CreatePaymentMethod = ({
	isCreatePaymentMethodModalOpen,
	closeModal,
	projectId,
	projectSlug,
}: TCreatePaymentMethodProps) => {
	const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
	const [createMethodType, setCreateMethodType] =
		useState<TPaymentMethodType>("pix");
	const [createForm, setCreateForm] = useState<TCreateForm>({
		label: "",
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
	const { toast } = useToast();
	const { adminToken } = useAuth();
	const createPaymentMutation = useCreatePaymentMethod(
		projectId,
		adminToken!,
		projectSlug,
	);
	if (!isCreatePaymentMethodModalOpen) return;

	const resetCreateForm = () => {
		setCreateMethodType("pix");
		setCreateForm({
			label: "",
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
		setCreateErrors({});
	};

	const updateCreateField = <K extends keyof TCreateForm>(
		field: K,
		value: TCreateForm[K],
	) => {
		setCreateForm((prev) => ({ ...prev, [field]: value }));
		setCreateErrors((prev) => ({ ...prev, [field]: "" }));
	};
	const handleCreatePaymentMethod = async () => {
		const newErrors: Record<string, string> = {};
		const labelValue = createForm.label.trim();
		if (createMethodType === "pix") {
			if (!createForm.pix_key.trim()) {
				newErrors.pix_key = "Informe a chave PIX";
			}
			if (!createForm.pix_holder_name.trim()) {
				newErrors.pix_holder_name = "Informe o nome do titular";
			}
		} else {
			if (!createForm.bank_name.trim()) {
				newErrors.bank_name = "Informe o nome do banco";
			}
			if (!createForm.agency.trim()) {
				newErrors.agency = "Informe a agencia";
			}
			if (!createForm.account_number.trim()) {
				newErrors.account_number = "Informe a conta";
			}
			if (!createForm.account_holder_name.trim()) {
				newErrors.account_holder_name = "Informe o titular";
			}
		}
		if (Object.keys(newErrors).length > 0) {
			setCreateErrors(newErrors);
			return;
		}
		const payload =
			createMethodType === "pix"
				? {
						payment_method_type: createMethodType,
						payment_method_payload: {
							pix_key: createForm.pix_key.trim(),
							pix_holder_name: createForm.pix_holder_name.trim(),
						},
						label: labelValue || undefined,
					}
				: {
						payment_method_type: createMethodType,
						payment_method_payload: {
							bank_name: createForm.bank_name.trim(),
							bank_code: createForm.bank_code.trim() || undefined,
							agency: createForm.agency.trim(),
							account_number: createForm.account_number.trim(),
							account_type: createForm.account_type,
							account_holder_name: createForm.account_holder_name.trim(),
							document: createForm.document.trim() || undefined,
						},
						label: labelValue || undefined,
					};
		try {
			await createPaymentMutation.mutateAsync(payload);
			if (createPaymentMutation.error) {
				throw new Error(
					`HTTP error! status: ${createPaymentMutation.error.message}`,
				);
			}
			toast({
				title: "Sucesso",
				description: "Metodo de pagamento criado com sucesso.",
				variant: "default",
			});
			closeModal();
			resetCreateForm();
		} catch (error) {
			const errMessage =
				error instanceof Error
					? error.message
					: "Erro ao criar metodo de pagamento.";
			toast({
				title: "Error",
				description: errMessage,
				variant: "destructive",
			});
		} finally {
			createPaymentMutation.reset();
		}
	};

	return (
		<>
			<Portal>
				<Modal
					isOpen={isCreatePaymentMethodModalOpen}
					onClose={() => {
						closeModal();
						resetCreateForm();
					}}
				>
					<ModalContent>
						<ModalHeader>
							<ModalTitle>Novo metodo</ModalTitle>
							<ModalDescription>
								Escolha o tipo e informe os dados principais.
							</ModalDescription>
						</ModalHeader>

						<div className="space-y-5 py-4">
							<div className="space-y-3">
								<p className="text-[11px] uppercase tracking-[0.25em] text-star-muted">
									Tipo do metodo
								</p>
								<div className="grid gap-3 sm:grid-cols-2">
									<button
										type="button"
										aria-pressed={createMethodType === "pix"}
										onClick={() => {
											setCreateMethodType("pix");
											setCreateErrors({});
										}}
										className={cn(
											"group flex h-full w-full items-start gap-3 rounded-lg border p-4 text-left transition-all",
											createMethodType === "pix"
												? "border-cosmic-cyan/50 bg-cosmic-cyan/10 shadow-glow-accent/10"
												: "border-white/10 bg-space-void/40 hover:border-white/30",
										)}
									>
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-lg border",
												createMethodType === "pix"
													? "border-cosmic-cyan/40 bg-cosmic-cyan/10"
													: "border-white/10 bg-white/5",
											)}
										>
											<QrCode
												className={cn(
													"h-5 w-5",
													createMethodType === "pix"
														? "text-cosmic-cyan"
														: "text-star-muted",
												)}
											/>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-semibold text-star-white">
												PIX
											</p>
											<p className="text-xs text-star-muted">
												Chave e nome do titular.
											</p>
										</div>
									</button>

									<button
										type="button"
										aria-pressed={createMethodType === "bank_transfer"}
										onClick={() => {
											setCreateMethodType("bank_transfer");
											setCreateErrors({});
										}}
										className={cn(
											"group flex h-full w-full items-start gap-3 rounded-lg border p-4 text-left transition-all",
											createMethodType === "bank_transfer"
												? "border-cosmic-purple/50 bg-cosmic-purple/10 shadow-glow-accent/10"
												: "border-white/10 bg-space-void/40 hover:border-white/30",
										)}
									>
										<div
											className={cn(
												"flex h-10 w-10 items-center justify-center rounded-lg border",
												createMethodType === "bank_transfer"
													? "border-cosmic-purple/40 bg-cosmic-purple/10"
													: "border-white/10 bg-white/5",
											)}
										>
											<Building2
												className={cn(
													"h-5 w-5",
													createMethodType === "bank_transfer"
														? "text-cosmic-purple"
														: "text-star-muted",
												)}
											/>
										</div>
										<div className="space-y-1">
											<p className="text-sm font-semibold text-star-white">
												Transferencia
											</p>
											<p className="text-xs text-star-muted">
												Banco, agencia e conta.
											</p>
										</div>
									</button>
								</div>
							</div>

							<Input
								id="payment-method-label"
								label="Apelido (opcional)"
								placeholder="Ex: Conta principal"
								value={createForm.label}
								onChange={(e) => updateCreateField("label", e.target.value)}
							/>

							{createMethodType === "pix" ? (
								<div className="grid gap-4">
									<Input
										id="payment-method-pix-key"
										label="Chave PIX"
										placeholder="CPF, email, telefone ou aleatoria"
										value={createForm.pix_key}
										onChange={(e) =>
											updateCreateField("pix_key", e.target.value)
										}
										error={createErrors.pix_key}
									/>
									<Input
										id="payment-method-pix-holder"
										label="Nome do titular"
										placeholder="Nome completo"
										value={createForm.pix_holder_name}
										onChange={(e) =>
											updateCreateField("pix_holder_name", e.target.value)
										}
										error={createErrors.pix_holder_name}
									/>
								</div>
							) : (
								<div className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<Input
											id="payment-method-bank-name"
											label="Nome do banco"
											placeholder="Banco do Brasil"
											value={createForm.bank_name}
											onChange={(e) =>
												updateCreateField("bank_name", e.target.value)
											}
											error={createErrors.bank_name}
										/>
										<Input
											id="payment-method-bank-code"
											label="Codigo do banco (opcional)"
											placeholder="001"
											value={createForm.bank_code}
											onChange={(e) =>
												updateCreateField("bank_code", e.target.value)
											}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<Input
											id="payment-method-agency"
											label="Agencia"
											placeholder="1234"
											value={createForm.agency}
											onChange={(e) =>
												updateCreateField("agency", e.target.value)
											}
											error={createErrors.agency}
										/>
										<Input
											id="payment-method-account-number"
											label="Conta"
											placeholder="12345-6"
											value={createForm.account_number}
											onChange={(e) =>
												updateCreateField("account_number", e.target.value)
											}
											error={createErrors.account_number}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<Select
											id="payment-method-account-type"
											label="Tipo de conta"
											value={createForm.account_type}
											onChange={(e) =>
												updateCreateField(
													"account_type",
													e.target.value as TCreateForm["account_type"],
												)
											}
											options={[
												{ value: "checking", label: "Corrente" },
												{ value: "savings", label: "Poupanca" },
											]}
										/>
										<Input
											id="payment-method-document"
											label="Documento (opcional)"
											placeholder="000.000.000-00"
											value={createForm.document}
											onChange={(e) =>
												updateCreateField("document", e.target.value)
											}
										/>
									</div>
									<Input
										id="payment-method-account-holder"
										label="Nome do titular"
										placeholder="Nome completo"
										value={createForm.account_holder_name}
										onChange={(e) =>
											updateCreateField("account_holder_name", e.target.value)
										}
										error={createErrors.account_holder_name}
									/>
								</div>
							)}

							<div className="rounded-lg border border-white/10 bg-space-void/40 p-3 text-xs text-star-muted">
								Metodo fica ativo por padrao. Voce pode desativar depois.
							</div>
						</div>

						<ModalFooter>
							<Button
								variant="secondary"
								onClick={() => {
									closeModal();
									resetCreateForm();
								}}
							>
								Cancelar
							</Button>
							<Button
								onClick={handleCreatePaymentMethod}
								isLoading={createPaymentMutation.isPending}
							>
								Salvar metodo
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</Portal>
		</>
	);
};
export default CreatePaymentMethod;
