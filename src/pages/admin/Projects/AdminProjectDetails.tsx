import { useParams, Link, useNavigate, useLocation } from "react-router";
import {
	ArrowLeft,
	Orbit,
	Users,
	CreditCard,
	FileText,
	Trash2,
	Search,
	Download,
	RefreshCw,
	Plus,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalDescription,
	ModalFooter,
} from "@/components/ui/Modal";
import type { IAdminProjectMember } from "@/interfaces/IAdminProjectMember";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui/States";
import { Skeleton } from "@/components/ui/Skeleton";
import {
	formatCurrency,
	formatDate,
	formatPhone,
	getIntervalLabel,
	getStatusLabel,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useAdminProject } from "@/hooks/useAdminProject";
import { useAdminMembers } from "@/hooks/useAdminMembers";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import { useAdminPaymentMethods } from "@/hooks/useAdminPaymentMethods";
import { useAdminReports } from "@/hooks/useAdminReports";
import { useGenerateReport } from "@/hooks/useGenerateReport";
import { Portal } from "@/components/ui/Portal";
import { downloadFileWithToken } from "@/lib/downloadFileWithToken";
import { DashboardLayout } from "../DashboardLayout";
import { useRestoreMember } from "@/hooks/useRestoreMember";

const AdminProjectDetails = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const numericId = parseInt(projectId || "0");
	const { adminUser, adminToken } = useAuth();

	useEffect(() => {
		if (!adminUser || !adminToken) {
			navigate("/admin/login");
		}
	}, [adminToken, adminUser, navigate]);

	const {
		data: projectData,
		isLoading,
		error,
		refetch,
	} = useAdminProject(numericId, adminToken!);

	const project = projectData?.data;
	const counts = projectData?.counts;
	const stats = projectData?.stats;

	const getActiveTab = () => {
		if (location.pathname.includes("/members")) return "members";
		if (location.pathname.includes("/payment-methods")) return "methods";
		if (location.pathname.includes("/reports")) return "reports";
		return "members";
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingState message="Carregando projeto..." />
			</div>
		);
	}

	if (error || !project) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<ErrorState
					message="Projeto não encontrado."
					onRetry={() => refetch()}
				/>
			</div>
		);
	}

	return (
		<DashboardLayout>
			<div className="min-h-screen stars-bg">
				{/* Header */}
				<header className="border-b border-border bg-space-deep/50 backdrop-blur-sm sticky top-0 z-40">
					<div className="container flex items-center justify-between h-16 px-4">
						<Link
							to="/admin/projects"
							className="flex items-center gap-2 text-star-dim hover:text-star-white transition-colors"
						>
							<ArrowLeft className="h-5 w-5" />
							<span className="hidden sm:inline">Projetos</span>
						</Link>
						<Link to="/admin/projects" className="flex items-center gap-2">
							<Orbit className="h-6 w-6 text-cosmic-cyan" />
							<span className="font-bold text-star-white hidden sm:inline">
								Centro de Controle
							</span>
						</Link>
						<div className="w-16" />
					</div>
				</header>

				<main className="container px-4 py-8">
					{/* Project Info */}
					<Card variant="cockpit" className="mb-8">
						<CardHeader>
							<div className="flex items-start justify-between gap-4 flex-wrap">
								<div>
									<CardTitle as="h1" className="text-2xl mb-2">
										{project.title}
									</CardTitle>
									{project.description && (
										<p className="text-star-dim">{project.description}</p>
									)}
								</div>
								<Badge variant={project.is_active ? "success" : "default"}>
									{project.is_active ? "Ativo" : "Inativo"}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<div className="p-4 rounded-lg bg-space-nebula/50">
									<p className="text-xs text-star-muted mb-1">Valor</p>
									<p className="font-mono text-lg text-cosmic-cyan">
										{formatCurrency(project.amount_per_participant)}
									</p>
								</div>
								<div className="p-4 rounded-lg bg-space-nebula/50">
									<p className="text-xs text-star-muted mb-1">Frequência</p>
									<p className="text-star-white">
										{getIntervalLabel(
											project.payment_interval,
											project.payments_per_interval,
										)}
									</p>
								</div>
								<div className="p-4 rounded-lg bg-space-nebula/50">
									<p className="text-xs text-star-muted mb-1">Participantes</p>
									<p className="text-star-white">
										<span className="font-mono text-lg">
											{counts?.accepted || 0}
										</span>
										<span className="text-star-muted">
											{" "}
											/ {project.participant_limit}
										</span>
									</p>
								</div>
								<div className="p-4 rounded-lg bg-space-nebula/50">
									<p className="text-xs text-star-muted mb-1">Status</p>
									<div className="flex gap-2 flex-wrap">
										{counts?.pending ? (
											<Badge variant="warning">
												{counts.pending} pendentes
											</Badge>
										) : null}
										{counts?.removed ? (
											<Badge variant="error">{counts.removed} removidos</Badge>
										) : null}
										{stats?.is_full ? (
											<Badge variant="info">Lotado</Badge>
										) : (
											<Badge variant="success">
												{stats?.available_slots} vagas
											</Badge>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Tabs */}
					<Tabs
						defaultValue={getActiveTab()}
						onChange={(tab) => {
							if (tab === "members")
								navigate(`/admin/projects/${projectId}/members`);
							if (tab === "methods")
								navigate(`/admin/projects/${projectId}/payment-methods`);
							if (tab === "reports")
								navigate(`/admin/projects/${projectId}/reports`);
						}}
					>
						<TabsList>
							<TabsTrigger value="members">
								<Users className="h-4 w-4 mr-1" />
								Membros
							</TabsTrigger>
							<TabsTrigger value="methods">
								<CreditCard className="h-4 w-4 mr-1" />
								Pagamentos
							</TabsTrigger>
							<TabsTrigger value="reports">
								<FileText className="h-4 w-4 mr-1" />
								Relatórios
							</TabsTrigger>
						</TabsList>

						<TabsContent value="members">
							<MembersTab projectId={numericId} />
						</TabsContent>
						<TabsContent value="methods">
							<PaymentMethodsTab projectId={numericId} />
						</TabsContent>
						<TabsContent value="reports">
							<ReportsTab
								projectId={numericId}
								paymentInterval={project.payment_interval}
							/>
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</DashboardLayout>
	);
};

// Members Tab
const MembersTab = ({ projectId }: { projectId: number }) => {
	const { toast } = useToast();
	const [status, setStatus] = useState("accepted");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const { adminToken } = useAuth();
	const [memberToRemove, setMemberToRemove] =
		useState<IAdminProjectMember | null>(null);
	const [memberToRestore, setMemberToRestore] =
		useState<IAdminProjectMember | null>(null);

	const { data, isLoading, error, refetch } = useAdminMembers(
		projectId,
		adminToken!,
		page,
		status,
		search,
	);
	const removeMutation = useRemoveMember(projectId, adminToken!);
	const restoreMutation = useRestoreMember(projectId, adminToken!);

	const handleRestore = async () => {
		if (!memberToRestore) return;
		try {
			await restoreMutation.mutateAsync(memberToRestore.user.id);
			toast({
				title: "Sucesso",
				description: "Membro restaurado com sucesso.",
				variant: "default",
			});
			refetch();
		} catch {
			toast({
				title: "Error",
				description: "Erro ao restaurar membro.",
				variant: "destructive",
			});
		} finally {
			setMemberToRestore(null);
		}
	};

	const handleRemove = async () => {
		if (!memberToRemove) return;
		try {
			await removeMutation.mutateAsync(memberToRemove.user.id);
			toast({
				title: "Sucesso",
				description: "Membro removido com sucesso.",
				variant: "default",
			});
			setMemberToRemove(null);
			refetch();
		} catch {
			toast({
				title: "Error",
				description: "Erro ao remover membro.",
				variant: "destructive",
			});
		}
	};

	return (
		<Card variant="glass">
			<CardHeader>
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<CardTitle>Membros do Projeto</CardTitle>
					<div className="flex items-center gap-2">
						<Select
							value={status}
							onChange={(e) => {
								setStatus(e.target.value);
								setPage(1);
							}}
							options={[
								{ value: "accepted", label: "Confirmados" },
								{ value: "pending", label: "Pendentes" },
								{ value: "removed", label: "Removidos" },
							]}
						/>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="mb-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-star-muted" />
						<input
							type="text"
							placeholder="Buscar por nome ou telefone..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="w-full h-10 pl-10 pr-4 bg-input border border-border rounded-lg text-sm text-star-white placeholder:text-star-muted focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>
				</div>

				{isLoading && (
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center gap-4 py-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-3 w-1/4" />
								</div>
							</div>
						))}
					</div>
				)}

				{error && (
					<ErrorState
						message="Erro ao carregar membros."
						onRetry={() => refetch()}
					/>
				)}

				{data && data.data.length === 0 && (
					<EmptyState
						icon={<Users className="h-12 w-12" />}
						title="Nenhum membro encontrado"
						description="Não há membros com o filtro selecionado."
					/>
				)}

				{data && data.data.length > 0 && (
					<>
						<div className="divide-y divide-border">
							{data.data.map((member) => (
								<div
									key={member.membership_id}
									className="flex items-center justify-between py-4"
								>
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 rounded-full bg-space-nebula flex items-center justify-center text-star-dim font-medium">
											{member.user.first_name?.[0] || "?"}
										</div>
										<div>
											<p className="font-medium text-star-white">
												{member.user.first_name} {member.user.last_name}
											</p>
											<p className="text-sm font-mono text-star-muted">
												{member.user.phone
													? formatPhone(member.user.phone)
													: "-"}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Badge
											variant={
												member.status === "accepted"
													? "success"
													: member.status === "pending"
														? "warning"
														: "error"
											}
										>
											{getStatusLabel(member.status)}
										</Badge>
										{member.status !== "removed" && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setMemberToRemove(member)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										)}
										{member.status === "removed" && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() => {
													setMemberToRestore(member);
												}}
												className="cursor-pointer"
											>
												<RotateCcw className="h-4 w-4 text-primary" />
											</Button>
										)}
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{data.meta && data.meta.last_page > 1 && (
							<div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
								<p className="text-sm text-star-muted">
									Página {data.meta.current_page} de {data.meta.last_page}
								</p>
								<div className="flex gap-2">
									<Button
										variant="secondary"
										size="sm"
										disabled={page === 1}
										onClick={() => setPage((p) => p - 1)}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button
										variant="secondary"
										size="sm"
										disabled={page === data.meta.last_page}
										onClick={() => setPage((p) => p + 1)}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</CardContent>

			{/* Restore Confirmation Modal */}
			<Modal
				isOpen={!!memberToRestore}
				onClose={() => setMemberToRestore(null)}
			>
				<ModalContent>
					<ModalHeader>
						<ModalTitle>Restaurar Membro</ModalTitle>
						<ModalDescription>
							Tem certeza que deseja restaurar{" "}
							{memberToRestore?.user.first_name}{" "}
							{memberToRestore?.user.last_name} do projeto?
						</ModalDescription>
					</ModalHeader>
					<ModalFooter>
						<Button
							variant="secondary"
							onClick={() => setMemberToRestore(null)}
						>
							Cancelar
						</Button>
						<Button
							variant="primary"
							onClick={handleRestore}
							isLoading={restoreMutation.isPending}
							className="cursor-pointer"
						>
							Restaurar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Remove Confirmation Modal */}
			<Modal isOpen={!!memberToRemove} onClose={() => setMemberToRemove(null)}>
				<ModalContent>
					<ModalHeader>
						<ModalTitle>Remover Membro</ModalTitle>
						<ModalDescription>
							Tem certeza que deseja remover {memberToRemove?.user.first_name}{" "}
							{memberToRemove?.user.last_name} do projeto?
						</ModalDescription>
					</ModalHeader>
					<ModalFooter>
						<Button variant="secondary" onClick={() => setMemberToRemove(null)}>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleRemove}
							isLoading={removeMutation.isPending}
						>
							Remover
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Card>
	);
};

// Payment Methods Tab
const PaymentMethodsTab = ({ projectId }: { projectId: number }) => {
	const { adminToken } = useAuth();
	const { data, isLoading, error, refetch } = useAdminPaymentMethods(
		projectId,
		adminToken!,
	);

	if (isLoading) return <LoadingState message="Carregando métodos..." />;
	if (error)
		return (
			<ErrorState
				message="Erro ao carregar métodos."
				onRetry={() => refetch()}
			/>
		);

	return (
		<Card variant="glass">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Métodos de Pagamento</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				{data?.data && data.data.length > 0 ? (
					<div className="space-y-4">
						{data.data.map((method) => (
							<div
								key={method.id}
								className="p-4 rounded-lg bg-space-nebula/50 border border-border"
							>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<Badge variant="outline">
											{method.type === "pix" ? "PIX" : "Transferência"}
										</Badge>
										{method.label && (
											<span className="text-sm text-star-muted">
												{method.label}
											</span>
										)}
									</div>
									<Badge variant={method.is_active ? "success" : "default"}>
										{method.is_active ? "Ativo" : "Inativo"}
									</Badge>
								</div>
								<div className="text-sm text-star-dim">
									{method.type === "pix" && method.payload && (
										<p>
											Chave:{" "}
											<span className="font-mono">
												{(method.payload as { pix_key?: string }).pix_key}
											</span>
										</p>
									)}
									{method.type === "bank_transfer" && method.payload && (
										<p>
											Banco:{" "}
											{(method.payload as { bank_name?: string }).bank_name}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<EmptyState
						icon={<CreditCard className="h-12 w-12" />}
						title="Nenhum método configurado"
					/>
				)}
			</CardContent>
		</Card>
	);
};

// Reports Tab
const ReportsTab = ({
	projectId,
	paymentInterval,
}: {
	projectId: number;
	paymentInterval: string;
}) => {
	const { toast } = useToast();
	const [page] = useState(1);
	const [showGenerate, setShowGenerate] = useState(false);
	const { adminToken } = useAuth();

	const { data, isLoading, error, refetch } = useAdminReports(
		projectId,
		adminToken!,
		page,
	);
	const generateMutation = useGenerateReport(projectId, adminToken!);

	const [year, setYear] = useState(new Date().getFullYear().toString());
	const [month, setMonth] = useState("");
	const [weekOfMonth, setWeekOfMonth] = useState("");
	const [statusScope, setStatusScope] = useState("accepted_only");

	const handleGenerate = async () => {
		const payload: Parameters<typeof generateMutation.mutateAsync>[0] = {
			year: parseInt(year),
			status_scope: statusScope,
		};

		if (paymentInterval === "week" || paymentInterval === "month") {
			if (month) payload.month = parseInt(month);
		}
		if (paymentInterval === "week" && weekOfMonth) {
			payload.week_of_month = parseInt(weekOfMonth);
		}

		try {
			await generateMutation.mutateAsync(payload);
			toast({
				title: "Sucesso",
				description: "Relatório em processamento.",
				variant: "default",
			});
			setShowGenerate(false);
			refetch();
		} catch {
			toast({
				title: "Erro",
				description: "Erro ao gerar relatório.",
				variant: "destructive",
			});
		}
	};

	const getReportStatusBadge = (status: string) => {
		switch (status) {
			case "completed":
				return <Badge variant="success">Concluído</Badge>;
			case "processing":
				return <Badge variant="warning">Processando</Badge>;
			case "failed":
				return <Badge variant="error">Falhou</Badge>;
			default:
				return <Badge>{status}</Badge>;
		}
	};

	return (
		<Card variant="glass">
			<CardHeader>
				<div className="flex items-center justify-between flex-wrap gap-4">
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Relatórios
					</CardTitle>
					<Button size="sm" onClick={() => setShowGenerate(true)}>
						<Plus className="h-4 w-4 mr-1" />
						Gerar Relatório
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading && <LoadingState message="Carregando relatórios..." />}
				{error && (
					<ErrorState
						message="Erro ao carregar relatórios."
						onRetry={() => refetch()}
					/>
				)}

				{data && data.data.length === 0 && (
					<EmptyState
						icon={<FileText className="h-12 w-12" />}
						title="Nenhum relatório gerado"
						description="Clique em 'Gerar Relatório' para criar um novo."
					/>
				)}

				{data && data.data.length > 0 && (
					<div className="space-y-3">
						{data.data.map((report) => (
							<div
								key={report.id}
								className="flex items-center justify-between p-4 rounded-lg bg-space-nebula/50 border border-border"
							>
								<div>
									<div className="flex items-center gap-2 mb-1">
										{getReportStatusBadge(report.status)}
										<span className="text-sm text-star-muted">
											{formatDate(report.created_at)}
										</span>
									</div>
									<p className="text-sm text-star-dim">
										Ano: {report.filters.year}
										{report.filters.month && ` / Mês: ${report.filters.month}`}
										{report.filters.week_of_month &&
											` / Semana: ${report.filters.week_of_month}`}
									</p>
								</div>
								<div className="flex items-center gap-2">
									{report.status === "processing" && (
										<RefreshCw className="h-4 w-4 text-cosmic-cyan animate-spin" />
									)}
									{report.status === "completed" && report.download_url && (
										<button
											type="button"
											onClick={() =>
												downloadFileWithToken(report.download_url!, adminToken!)
											}
											className="p-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
											aria-label="Baixar relatório"
											title="Baixar relatório"
										>
											<Download className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>

			{/* Generate Report Modal */}
			<Portal>
				<Modal isOpen={showGenerate} onClose={() => setShowGenerate(false)}>
					<ModalContent>
						<ModalHeader>
							<ModalTitle>Gerar Relatório</ModalTitle>
							<ModalDescription>
								Configure os filtros para gerar o relatório de status de
								pagamentos.
							</ModalDescription>
						</ModalHeader>

						<div className="space-y-4 py-4">
							<Input
								label="Ano"
								type="number"
								value={year}
								onChange={(e) => setYear(e.target.value)}
							/>

							{(paymentInterval === "week" || paymentInterval === "month") && (
								<Select
									label="Mês"
									value={month}
									onChange={(e) => setMonth(e.target.value)}
									placeholder="Todos os meses"
									options={Array.from({ length: 12 }, (_, i) => ({
										value: String(i + 1),
										label: new Date(2000, i).toLocaleDateString("pt-BR", {
											month: "long",
										}),
									}))}
								/>
							)}

							{paymentInterval === "week" && month && (
								<Select
									label="Semana"
									value={weekOfMonth}
									onChange={(e) => setWeekOfMonth(e.target.value)}
									placeholder="Todas as semanas"
									options={[
										{ value: "1", label: "1ª Semana" },
										{ value: "2", label: "2ª Semana" },
										{ value: "3", label: "3ª Semana" },
										{ value: "4", label: "4ª Semana" },
										{ value: "5", label: "5ª Semana" },
									]}
								/>
							)}

							<Select
								label="Incluir"
								value={statusScope}
								onChange={(e) => setStatusScope(e.target.value)}
								options={[
									{ value: "accepted_only", label: "Apenas confirmados" },
									{ value: "include_removed", label: "Incluir removidos" },
								]}
							/>
						</div>

						<ModalFooter>
							<Button
								variant="secondary"
								onClick={() => setShowGenerate(false)}
							>
								Cancelar
							</Button>
							<Button
								onClick={handleGenerate}
								isLoading={generateMutation.isPending}
							>
								Gerar
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</Portal>
		</Card>
	);
};

export default AdminProjectDetails;
