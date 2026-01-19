import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useAdminProjects } from "@/hooks/useAdminProjects";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, getIntervalLabel } from "@/lib/utils";
import {
	Calendar,
	Loader2,
	Plus,
	Settings,
	ToggleLeft,
	ToggleRight,
	Trash2,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { DashboardLayout } from "@/pages/admin/DashboardLayout";
import { useDeleteAdminProject } from "@/hooks/useDeleteAdminProject";
import ConfirmRemoval from "@/pages/admin/Projects/components/ConfirmRemoval";
import type { IAdminProjects } from "@/interfaces/IAdminProjects";
import { useDeactivateAdminProject } from "@/hooks/useDeactivateAdminProject";
import { useActivateAdminProject } from "@/hooks/useActivateAdminProject";
import { useToast } from "@/hooks/useToast";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/Modal";

const AdminProjects = () => {
	const navigate = useNavigate();
	const [isOpenConfirmRemoval, setIsOpenConfirmRemoval] = useState(false);
	const [projectForRemoval, setProjectForRemoval] =
		useState<IAdminProjects | null>(null);

	const [projectToDeactivate, setProjectToDeactivate] =
		useState<IAdminProjects | null>(null);
	const [projectToActivate, setProjectToActivate] =
		useState<IAdminProjects | null>(null);

	const { adminToken } = useAuth();
	const { toast } = useToast();
	const {
		data: projects,
		isLoading,
		error,
		refetch,
	} = useAdminProjects(adminToken!);
	const deleteAdminProjectMutation = useDeleteAdminProject(adminToken!);
	const deactivateAdminProjectMutation = useDeactivateAdminProject(adminToken!);
	const activateAdminProjectMutation = useActivateAdminProject(adminToken!);

	const handleDelete = (project: IAdminProjects) => {
		deleteAdminProjectMutation.mutate({
			projectId: project.id,
			projectSlug: project.slug,
		});
		setProjectForRemoval(null);
	};

	const handleDeactivate = async () => {
		if (!projectToDeactivate) return;
		try {
			await deactivateAdminProjectMutation.mutateAsync({
				projectId: projectToDeactivate.id,
				projectSlug: projectToDeactivate.slug,
			});
			if (deactivateAdminProjectMutation.error) {
				throw new Error(
					`HTTP error! status: ${deactivateAdminProjectMutation.error.message}`,
				);
			}
			toast({
				title: "Sucesso",
				description: "Projeto desativado com sucesso.",
				variant: "default",
			});
		} catch {
			toast({
				title: "Error",
				description: "Erro ao desativar projeto",
				variant: "destructive",
			});
		} finally {
			setProjectToDeactivate(null);
			deactivateAdminProjectMutation.reset();
		}
	};

	const handleActivate = async () => {
		if (!projectToActivate) return;
		try {
			await activateAdminProjectMutation.mutateAsync({
				projectId: projectToActivate.id,
				projectSlug: projectToActivate.slug,
			});
			if (activateAdminProjectMutation.error) {
				throw new Error(
					`HTTP error! status: ${activateAdminProjectMutation.error.message}`,
				);
			}
			toast({
				title: "Sucesso",
				description: "Projeto ativado com sucesso.",
				variant: "default",
			});
		} catch {
			toast({
				title: "Error",
				description: "Erro ao ativar projeto",
				variant: "destructive",
			});
		} finally {
			setProjectToActivate(null);
			activateAdminProjectMutation.reset();
		}
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen stars-bg">
				<main className="container px-4 py-8">
					{/* Page Header */}
					<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
						<div>
							<h1 className="text-2xl font-bold text-star-white">Projetos</h1>
							<p className="text-star-muted">
								Gerencie seus projetos coletivos
							</p>
						</div>
						<Link to="/admin/projects/new">
							<Button className="cursor-pointer">
								<Plus className="h-4 w-4 mr-1" />
								Novo Projeto
							</Button>
						</Link>
					</div>

					{/* Projects List */}
					{isLoading && (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<SkeletonCard key={i} />
							))}
						</div>
					)}

					{error && (
						<ErrorState
							message="Não foi possível carregar os projetos."
							onRetry={() => refetch()}
						/>
					)}

					{projects && projects.length === 0 && (
						<EmptyState
							icon={<Settings className="h-16 w-16" />}
							title="Nenhum projeto criado"
							description="Crie seu primeiro projeto coletivo para começar."
							action={{
								label: "Criar Projeto",
								onClick: () => navigate("/admin/projects/new"),
							}}
						/>
					)}

					{projects && projects.length > 0 && (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{projects.map((project) => (
								<Card
									key={project.id}
									variant="glass"
									className="group hover:border-cosmic-cyan/30 transition-all"
								>
									<CardHeader>
										<div className="flex items-start justify-between gap-2">
											<CardTitle className="text-star-white group-hover:text-cosmic-cyan transition-colors">
												{project.title}
											</CardTitle>
											<Badge
												variant={project.is_active ? "success" : "default"}
											>
												{project.is_active ? (
													<>
														<ToggleRight className="h-3 w-3 mr-1" /> Ativo
													</>
												) : (
													<>
														<ToggleLeft className="h-3 w-3 mr-1" /> Inativo
													</>
												)}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2 text-sm">
											<div className="flex items-center justify-between text-star-dim">
												<span className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													Limite
												</span>
												<span className="font-mono">
													{project.participant_limit}
												</span>
											</div>
											<div className="flex items-center justify-between text-star-dim">
												<span>Valor</span>
												<span className="font-mono text-cosmic-cyan">
													{formatCurrency(project.amount_per_participant)}
												</span>
											</div>
											<div className="flex items-center justify-between text-star-dim">
												<span className="flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													Frequência
												</span>
												<span>
													{getIntervalLabel(
														project.payment_interval,
														project.payments_per_interval,
													)}
												</span>
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex gap-2 pt-4 border-t border-white/5">
										<Link
											to={`/admin/projects/${project.id}`}
											className="flex-1"
										>
											<Button
												variant="outline"
												className="w-full cursor-pointer hover:bg-cosmic-purple/10 hover:text-cosmic-purple border-white/10"
											>
												Gerenciar
											</Button>
										</Link>
										{project.is_active ? (
											<Button
												variant="ghost"
												size="icon"
												className="text-star-muted hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
												onClick={() => {
													setProjectToDeactivate(project);
												}}
												disabled={deactivateAdminProjectMutation.isPending}
												title="Desativar Projeto"
											>
												{deactivateAdminProjectMutation.isPending ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<ToggleRight className="h-4 w-4" />
												)}
											</Button>
										) : (
											<Button
												variant="ghost"
												size="icon"
												className="text-star-muted hover:text-primary hover:bg-primary/10 cursor-pointer transition-colors"
												onClick={() => {
													setProjectToActivate(project);
												}}
												disabled={activateAdminProjectMutation.isPending}
												title="Ativar Projeto"
											>
												{activateAdminProjectMutation.isPending ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<ToggleLeft className="h-4 w-4" />
												)}
											</Button>
										)}

										<Button
											variant="ghost"
											size="icon"
											className="text-star-muted hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
											onClick={() => {
												setIsOpenConfirmRemoval(true);
												setProjectForRemoval(project);
											}}
											disabled={
												deleteAdminProjectMutation.isPending &&
												deleteAdminProjectMutation.variables?.projectId ===
													project.id
											}
											title="Remover Projeto"
										>
											{deleteAdminProjectMutation.isPending &&
											deleteAdminProjectMutation.variables?.projectId ===
												project.id ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Trash2 className="h-4 w-4" />
											)}
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</main>
			</div>

			{/* Deactivate project Confirmation Modal */}
			<Modal
				isOpen={!!projectToDeactivate}
				onClose={() => setProjectToDeactivate(null)}
			>
				<ModalContent>
					<ModalHeader>
						<ModalTitle>Desativar projeto</ModalTitle>
						<ModalDescription>
							Tem certeza que deseja desativar o projeto{" "}
							{projectToDeactivate?.title}?
						</ModalDescription>
					</ModalHeader>
					<ModalFooter>
						<Button
							variant="secondary"
							onClick={() => setProjectToDeactivate(null)}
							className="cursor-pointer"
						>
							Cancelar
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeactivate}
							isLoading={deactivateAdminProjectMutation.isPending}
							className="cursor-pointer"
						>
							Desativar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Activate project Confirmation Modal */}
			<Modal
				isOpen={!!projectToActivate}
				onClose={() => setProjectToActivate(null)}
			>
				<ModalContent>
					<ModalHeader>
						<ModalTitle>Ativar projeto</ModalTitle>
						<ModalDescription>
							Tem certeza que deseja ativar o projeto {projectToActivate?.title}
							?
						</ModalDescription>
					</ModalHeader>
					<ModalFooter>
						<Button
							variant="secondary"
							onClick={() => setProjectToActivate(null)}
							className="cursor-pointer"
						>
							Cancelar
						</Button>
						<Button
							variant="primary"
							onClick={handleActivate}
							isLoading={activateAdminProjectMutation.isPending}
							className="cursor-pointer"
						>
							Ativar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{isOpenConfirmRemoval && projectForRemoval ? (
				<ConfirmRemoval
					isOpen={isOpenConfirmRemoval}
					onClose={() => setIsOpenConfirmRemoval(false)}
					onConfirm={() => handleDelete(projectForRemoval)}
					isPending={deleteAdminProjectMutation.isPending}
				/>
			) : null}
		</DashboardLayout>
	);
};
export default AdminProjects;
