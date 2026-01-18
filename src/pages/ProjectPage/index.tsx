import Header from "@/components/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import { formatCurrency, getIntervalLabel } from "@/lib/utils";
import {
	AlertCircle,
	Calendar,
	CreditCard,
	Sparkles,
	Users,
	Orbit,
	Receipt,
	Plus,
} from "lucide-react";
import { useParams } from "react-router";
import PaymentMethodInfo from "./PaymentMethodInfo";
import { useToast } from "@/hooks/useToast";
import { useJoinProject } from "@/hooks/useJoinProject";
import { useState } from "react";
import ConfirmParticipation from "./ConfirmParticipation";
import NewPaymentModal from "./NewPaymentModal";
import type { TPaymentInterval } from "@/types/TPaymentInterval";
import { usePayments } from "@/hooks/usePayments";
import PaymentRow from "./PaymentRow";

const ProjectPage = () => {
	const [isJoinConfirmationOpen, setIsJoinConfirmationOpen] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const { slug } = useParams<{ slug: string }>();
	const { participantToken } = useAuth();
	const { toast } = useToast();
	const { data } = useProject(slug!, participantToken!);
	const joinMutation = useJoinProject(slug!, participantToken!);
	const { data: paymentsData } = usePayments(slug!, participantToken!);
	if (!data) return;
	const project = data?.data;
	const membership = data?.membership;
	const stats = data?.stats;

	const canViewPaymentInfo = membership?.status === "accepted";
	const isRemoved = membership?.status === "removed";
	const isParticipant = !!membership?.status;
	const isFull = stats?.is_full;

	const handleJoin = async () => {
		try {
			await joinMutation.mutateAsync();
			if (joinMutation.error) {
				throw new Error(`HTTP error! status: ${joinMutation.error.message}`);
			}
			toast({
				title: "Sucesso",
				description: "Participação confirmada! Bem-vindo à missão.",
				variant: "default",
			});
		} catch (err) {
			const error = err as { message?: string };
			toast({
				title: "Error",
				description:
					error.message || "Não foi possível confirmar participação.",
				variant: "destructive",
			});
		} finally {
			setIsJoinConfirmationOpen(false);
			joinMutation.reset();
		}
	};

	return (
		<div className="min-h-screen stars-bg">
			<Header />
			<main className="container px-4 py-8">
				{/* Project Info */}
				<div className="max-w-4xl mx-auto">
					<Card variant="cockpit" className="mb-8">
						<CardHeader>
							<div className="flex items-start justify-between gap-4 flex-wrap">
								<div>
									<CardTitle as="h1" className="text-2xl md:text-3xl mb-2">
										{project.title}
									</CardTitle>
									{project.description && (
										<p className="text-star-dim">{project.description}</p>
									)}
								</div>
								<div className="flex items-center gap-2">
									{stats && (
										<Badge variant={stats.is_full ? "warning" : "success"}>
											<Users className="h-3 w-3 mr-1" />
											{stats.accepted_count}/{project.participant_limit}
										</Badge>
									)}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<div className="flex items-center gap-3 p-4 rounded-lg bg-space-nebula/50">
									<Sparkles className="h-6 w-6 text-cosmic-gold" />
									<div>
										<p className="text-xs text-star-muted">Valor</p>
										<p className="font-mono text-lg text-cosmic-cyan">
											{formatCurrency(project.amount_per_participant)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-4 rounded-lg bg-space-nebula/50">
									<Calendar className="h-6 w-6 text-cosmic-purple" />
									<div>
										<p className="text-xs text-star-muted">Frequência</p>
										<p className="text-star-white">
											{getIntervalLabel(
												project.payment_interval,
												project.payments_per_interval,
											)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-4 rounded-lg bg-space-nebula/50">
									<CreditCard className="h-6 w-6 text-cosmic-pink" />
									<div>
										<p className="text-xs text-star-muted">Métodos</p>
										<p className="text-star-white">
											{
												project.payment_methods.filter((m) => m.is_active)
													.length
											}{" "}
											disponível(is)
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Status Messages */}
					{isRemoved && (
						<Card variant="glass" className="mb-6 border-destructive/50">
							<CardContent className="flex items-center gap-3 py-4">
								<AlertCircle className="h-6 w-6 text-destructive" />
								<div>
									<p className="font-medium text-destructive">
										Participação removida
									</p>
									<p className="text-sm text-star-muted">
										Você foi removido deste projeto.
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{isFull && !isParticipant && (
						<Card variant="glass" className="mb-6 border-warning/50">
							<CardContent className="flex items-center gap-3 py-4">
								<AlertCircle className="h-6 w-6 text-warning" />
								<div>
									<p className="font-medium text-warning">Projeto lotado</p>
									<p className="text-sm text-star-muted">
										Todas as vagas foram preenchidas.
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{!isParticipant && !isFull && (
						<Card variant="glass" className="mb-8 border-cosmic-cyan/30">
							<CardContent className="py-6 text-center">
								<Orbit className="h-12 w-12 text-cosmic-cyan mx-auto mb-4 animate-pulse" />
								<h3 className="text-lg font-bold text-star-white mb-2">
									Confirme sua participação
								</h3>
								<p className="text-star-muted mb-6">
									Clique abaixo para confirmar que deseja participar deste
									projeto.
								</p>
								<Button
									onClick={() => {
										setIsJoinConfirmationOpen(true);
									}}
									isLoading={joinMutation.isPending}
								>
									Aceito participar
								</Button>
							</CardContent>
						</Card>
					)}

					{canViewPaymentInfo && (
						<>
							<Card variant="glass" className="mb-8">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Dados para Pagamento</CardTitle>
										<Badge variant="success">Participante Confirmado</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-6">
										{project.payment_methods
											.filter((m) => m.is_active)
											.map((method) => (
												<div
													key={method.id}
													className="p-4 rounded-lg bg-space-nebula/50 border border-border"
												>
													<div className="flex items-center gap-2 mb-3">
														<Badge variant="outline">
															{method.type === "pix" ? "PIX" : "Transferência"}
														</Badge>
														{method.label && (
															<span className="text-sm text-star-muted">
																{method.label}
															</span>
														)}
													</div>
													<PaymentMethodInfo method={method} />
												</div>
											))}
									</div>
								</CardContent>
							</Card>

							{/* Payments History */}
							<Card variant="glass">
								<CardHeader>
									<div className="flex items-center justify-between flex-wrap gap-4">
										<CardTitle className="flex items-center gap-2">
											<Receipt className="h-5 w-5" />
											Meus Pagamentos
										</CardTitle>
										<Button
											size="sm"
											onClick={() => {
												setShowPaymentModal(true);
											}}
											className="cursor-pointer"
										>
											<Plus className="h-4 w-4 mr-1" />
											Novo Pagamento
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									{paymentsData?.data && paymentsData.data.length > 0 ? (
										<div className="divide-y divide-border">
											{paymentsData.data.map((payment) => (
												<PaymentRow key={payment.id} payment={payment} />
											))}
										</div>
									) : (
										<div className="py-8 text-center">
											<Receipt className="h-12 w-12 text-star-muted mx-auto mb-3" />
											<p className="text-star-muted">
												Nenhum pagamento registrado ainda.
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</>
					)}
				</div>
			</main>
			<ConfirmParticipation
				isOpen={isJoinConfirmationOpen}
				onClose={() => setIsJoinConfirmationOpen(false)}
				onConfirm={handleJoin}
				isPending={joinMutation.isPending}
			/>
			{showPaymentModal && project ? (
				<NewPaymentModal
					slug={slug!}
					paymentInterval={project.payment_interval as TPaymentInterval}
					onClose={() => setShowPaymentModal(false)}
					onSuccess={() => {
						setShowPaymentModal(false);
						toast({
							title: "Sucesso",
							description: "Pagamento registrado com sucesso!",
							variant: "default",
						});
					}}
				/>
			) : null}
		</div>
	);
};

export default ProjectPage;
