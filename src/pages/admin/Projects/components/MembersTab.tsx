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
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useAdminMembers } from "@/hooks/useAdminMembers";
import { useAuth } from "@/hooks/useAuth";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import { useRestoreMember } from "@/hooks/useRestoreMember";
import { useToast } from "@/hooks/useToast";
import type { IAdminProjectMember } from "@/interfaces/IAdminProjectMember";
import { formatPhone, getStatusLabel } from "@/lib/utils";
import {
	Ban,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	Search,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";

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
												className="cursor-pointer"
											>
												<Ban className="h-4 w-4 text-destructive" />
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
export default MembersTab;
