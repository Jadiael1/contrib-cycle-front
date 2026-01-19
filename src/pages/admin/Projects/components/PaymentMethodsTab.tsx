import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { useActivatePaymentMethod } from "@/hooks/useActivatePaymentMethod";
import { useAdminPaymentMethods } from "@/hooks/useAdminPaymentMethods";
import { useAuth } from "@/hooks/useAuth";
import { useDeactivatePaymentMethod } from "@/hooks/useDeactivatePaymentMethod";
import { useRemovePaymentMethod } from "@/hooks/useRemovePaymentMethod";
import { useToast } from "@/hooks/useToast";
import type { ICollectiveProjectPaymentMethod } from "@/interfaces/ICollectiveProjectPaymentMethod";
import { cn } from "@/lib/utils";
import {
	Building2,
	CreditCard,
	Plus,
	QrCode,
	ToggleLeft,
	ToggleRight,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import CreatePaymentMethod from "@/pages/admin/Projects/components/CreatePaymentMethod";

const PaymentMethodsTab = ({ projectId }: { projectId: number }) => {
	const { toast } = useToast();
	const [
		isDeactivatePaymentMethodModalOpen,
		setIsDeactivatePaymentMethodModalOpen,
	] = useState(false);
	const [paymentMethodToDeactivate, setPaymentMethodToDeactivate] =
		useState<ICollectiveProjectPaymentMethod | null>(null);
	const [
		isActivatePaymentMethodModalOpen,
		setIsActivatePaymentMethodModalOpen,
	] = useState(false);
	const [paymentMethodToActivate, setPaymentMethodToActivate] =
		useState<ICollectiveProjectPaymentMethod | null>(null);

	const [isRemovePaymentMethodModalOpen, setIsRemovePaymentMethodModalOpen] =
		useState(false);
	const [paymentMethodToRemove, setPaymentMethodToRemove] =
		useState<ICollectiveProjectPaymentMethod | null>(null);
	const [isCreatePaymentMethodModalOpen, setIsCreatePaymentMethodModalOpen] =
		useState(false);

	const { adminToken } = useAuth();
	const { data, isLoading, error, refetch } = useAdminPaymentMethods(
		projectId,
		adminToken!,
	);
	const deactivatePaymentMutation = useDeactivatePaymentMethod(
		projectId,
		adminToken!,
	);
	const activatePaymentMutation = useActivatePaymentMethod(
		projectId,
		adminToken!,
	);
	const removePaymentMutation = useRemovePaymentMethod(projectId, adminToken!);

	const handleDeactivatePaymentMethod = async (paymentMethodId: number) => {
		try {
			await deactivatePaymentMutation.mutateAsync(paymentMethodId);
			if (deactivatePaymentMutation.error) {
				throw new Error(
					`HTTP error! status: ${deactivatePaymentMutation.error.message}`,
				);
			}
			toast({
				title: "Sucesso",
				description: "Metodo de pagamento desativado com sucesso.",
				variant: "default",
			});
		} catch {
			toast({
				title: "Error",
				description: "Erro ao desativar metodo de pagamento",
				variant: "destructive",
			});
		} finally {
			setIsDeactivatePaymentMethodModalOpen(false);
			setPaymentMethodToDeactivate(null);
			deactivatePaymentMutation.reset();
		}
	};
	const handleActivatePaymentMethod = async (paymentMethodId: number) => {
		try {
			await activatePaymentMutation.mutateAsync(paymentMethodId);
			if (activatePaymentMutation.error) {
				throw new Error(
					`HTTP error! status: ${activatePaymentMutation.error.message}`,
				);
			}
			toast({
				title: "Sucesso",
				description: "Metodo de pagamento ativado com sucesso.",
				variant: "default",
			});
		} catch {
			toast({
				title: "Error",
				description: "Erro ao ativar metodo de pagamento",
				variant: "destructive",
			});
		} finally {
			setIsActivatePaymentMethodModalOpen(false);
			setPaymentMethodToActivate(null);
			activatePaymentMutation.reset();
		}
	};

	const handleRemovePaymentMethod = async (paymentMethodId: number) => {
		try {
			await removePaymentMutation.mutateAsync(paymentMethodId);
			if (removePaymentMutation.error) {
				throw new Error(
					`HTTP error! status: ${removePaymentMutation.error.message}`,
				);
			}
			toast({
				title: "Sucesso",
				description: "Metodo de pagamento removido com sucesso.",
				variant: "default",
			});
		} catch {
			toast({
				title: "Error",
				description: "Erro ao remover metodo de pagamento",
				variant: "destructive",
			});
		} finally {
			setIsRemovePaymentMethodModalOpen(false);
			setPaymentMethodToRemove(null);
			removePaymentMutation.reset();
		}
	};

	if (isLoading) return <LoadingState message="Carregando métodos..." />;
	if (error)
		return (
			<ErrorState
				message="Erro ao carregar métodos."
				onRetry={() => refetch()}
			/>
		);

	return (
		<Card variant="glass" className="cockpit-panel border-t-0">
			<CardHeader className="border-b border-white/5 pb-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-lg bg-cosmic-purple/10 border border-cosmic-purple/20">
							<CreditCard className="h-5 w-5 text-cosmic-purple" />
						</div>
						<CardTitle className="text-star-white tracking-tight">
							Métodos de Pagamento
						</CardTitle>
					</div>

					{/* Botão de Adicionar no Header */}
					<Button
						size="sm"
						className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-star-white shadow-glow-accent/20 cursor-pointer h-9 px-4"
						onClick={() => {
							setIsCreatePaymentMethodModalOpen(true);
						}}
					>
						<Plus className="h-4 w-4 mr-2" />
						<span className="hidden sm:inline">Novo Método</span>
					</Button>
				</div>
			</CardHeader>

			<CardContent className="pt-6">
				{data?.data && data.data.length > 0 ? (
					<div className="grid gap-4">
						{data.data.map((method) => (
							<div
								key={method.id}
								className="group relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cosmic-purple/30 transition-all duration-normal"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="flex gap-4">
										{/* Ícone Dinâmico por Tipo */}
										<div className="h-10 w-10 rounded-lg bg-space-void/50 border border-white/10 flex items-center justify-center shrink-0">
											{method.type === "pix" ? (
												<QrCode className="h-5 w-5 text-cosmic-cyan" />
											) : (
												<Building2 className="h-5 w-5 text-cosmic-purple" />
											)}
										</div>

										<div className="space-y-1">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="font-bold text-star-white">
													{method.label ||
														(method.type === "pix"
															? "Chave PIX"
															: "Transferência")}
												</span>
												<Badge
													variant="outline"
													className={cn(
														"text-[10px] uppercase tracking-widest font-mono py-0 h-5",
														method.is_active
															? "badge-success"
															: "text-star-muted border-white/10",
													)}
												>
													{method.is_active ? "Ativo" : "Inativo"}
												</Badge>
											</div>

											{/* Detalhes do Payload com fonte Mono */}
											<div className="text-xs text-star-dim font-mono">
												{method.type === "pix" && method.payload && (
													<div className="flex items-center gap-2">
														<span className="opacity-50">ID:</span>
														<span className="text-cosmic-cyan">
															{(method.payload as { pix_key?: string }).pix_key}
														</span>
													</div>
												)}
												{method.type === "bank_transfer" && method.payload && (
													<div className="flex items-center gap-2">
														<span className="opacity-50">BANCO:</span>
														<span className="text-star-white">
															{
																(method.payload as { bank_name?: string })
																	.bank_name
															}
														</span>
													</div>
												)}
											</div>
										</div>
									</div>

									<div className="flex">
										{/* Ação de Excluir/Restaurar */}
										{method.is_active ? (
											<Button
												variant="ghost"
												size="icon"
												className="text-star-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer shrink-0"
												title="Desativar método"
												onClick={() => {
													setIsDeactivatePaymentMethodModalOpen(true);
													setPaymentMethodToDeactivate(method);
												}}
											>
												<ToggleRight className="h-4 w-4 text-destructive" />
											</Button>
										) : (
											<Button
												variant="ghost"
												size="icon"
												className="text-star-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer shrink-0"
												title="Restaurar método"
												onClick={() => {
													setIsActivatePaymentMethodModalOpen(true);
													setPaymentMethodToActivate(method);
												}}
											>
												<ToggleLeft className="h-4 w-4 text-primary" />
											</Button>
										)}
										<Button
											variant="ghost"
											size="icon"
											className="text-star-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer shrink-0"
											title="Remover método"
											onClick={() => {
												setIsRemovePaymentMethodModalOpen(true);
												setPaymentMethodToRemove(method);
											}}
										>
											<Trash2 className="h-4 w-4 text-primary" />
										</Button>
									</div>
								</div>

								{/* Linha decorativa de hover (opcional para estilo) */}
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 group-hover:h-3/4 bg-cosmic-purple transition-all duration-normal rounded-r-full" />
							</div>
						))}
					</div>
				) : (
					<EmptyState
						icon={
							<CreditCard className="h-12 w-12 text-star-muted opacity-20" />
						}
						title="Nenhum método configurado"
					/>
				)}
			</CardContent>

			<CreatePaymentMethod
				closeModal={() => setIsCreatePaymentMethodModalOpen(false)}
				isCreatePaymentMethodModalOpen={isCreatePaymentMethodModalOpen}
				projectId={projectId}
			/>

			{/* Deactivate Payment Method Modal */}
			{paymentMethodToDeactivate && isDeactivatePaymentMethodModalOpen ? (
				<Modal
					isOpen={isDeactivatePaymentMethodModalOpen}
					onClose={() => setIsDeactivatePaymentMethodModalOpen(false)}
				>
					<ModalContent>
						<ModalHeader>
							<ModalTitle>Desativar metodo de pagamento</ModalTitle>
							<ModalDescription>
								Tem certeza que deseja desativar esse metodo de pagamento do
								projeto?
							</ModalDescription>
						</ModalHeader>
						<ModalFooter>
							<Button
								variant="secondary"
								onClick={() => setIsDeactivatePaymentMethodModalOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									handleDeactivatePaymentMethod(paymentMethodToDeactivate.id);
								}}
								isLoading={deactivatePaymentMutation.isPending}
								className="cursor-pointer"
							>
								Desativar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			) : null}

			{/* Activate Payment Method Modal */}
			{paymentMethodToActivate && isActivatePaymentMethodModalOpen ? (
				<Modal
					isOpen={isActivatePaymentMethodModalOpen}
					onClose={() => setIsActivatePaymentMethodModalOpen(false)}
				>
					<ModalContent>
						<ModalHeader>
							<ModalTitle>Ativar metodo de pagamento</ModalTitle>
							<ModalDescription>
								Tem certeza que deseja ativar esse metodo de pagamento do
								projeto?
							</ModalDescription>
						</ModalHeader>
						<ModalFooter>
							<Button
								variant="secondary"
								onClick={() => setIsActivatePaymentMethodModalOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								variant="primary"
								onClick={() => {
									handleActivatePaymentMethod(paymentMethodToActivate.id);
								}}
								isLoading={activatePaymentMutation.isPending}
								className="cursor-pointer"
							>
								Ativar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			) : null}

			{/* Remove Payment Method Modal */}
			{paymentMethodToRemove && isRemovePaymentMethodModalOpen ? (
				<Modal
					isOpen={isRemovePaymentMethodModalOpen}
					onClose={() => setIsRemovePaymentMethodModalOpen(false)}
				>
					<ModalContent>
						<ModalHeader>
							<ModalTitle>Remover metodo de pagamento</ModalTitle>
							<ModalDescription>
								Tem certeza que deseja remover esse metodo de pagamento do
								projeto?
							</ModalDescription>
						</ModalHeader>
						<ModalFooter>
							<Button
								variant="secondary"
								onClick={() => setIsRemovePaymentMethodModalOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									handleRemovePaymentMethod(paymentMethodToRemove.id);
								}}
								isLoading={activatePaymentMutation.isPending}
								className="cursor-pointer"
							>
								Remover
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			) : null}
		</Card>
	);
};
export default PaymentMethodsTab;
