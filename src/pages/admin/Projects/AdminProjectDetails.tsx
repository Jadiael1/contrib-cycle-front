import { useParams, Link, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Orbit, Users, CreditCard, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { formatCurrency, getIntervalLabel } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAdminProject } from "@/hooks/useAdminProject";
import { DashboardLayout } from "@/pages/admin/DashboardLayout";
import MembersTab from "@/pages/admin/Projects/components/MembersTab";
import PaymentMethodsTab from "@/pages/admin/Projects/components/PaymentMethodsTab";
import ReportsTab from "@/pages/admin/Projects/components/ReportsTab";

const AdminProjectDetails = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const numericId = parseInt(projectId || "0");
	const { adminToken } = useAuth();

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
							<span className="hidden sm:inline">Voltar</span>
						</Link>
						<Link
							to={`/admin/projects/${project.id}`}
							className="flex items-center gap-2"
						>
							<Orbit className="h-6 w-6 text-cosmic-cyan" />
							<span className="font-bold text-star-white hidden sm:inline">
								{project.title}
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
											<Badge variant="error">{counts.removed} desativados</Badge>
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

export default AdminProjectDetails;
