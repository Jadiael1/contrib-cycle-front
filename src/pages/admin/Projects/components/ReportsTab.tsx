import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { useAdminReports } from "@/hooks/useAdminReports";
import { useAuth } from "@/hooks/useAuth";
import { useGenerateReport } from "@/hooks/useGenerateReport";
import { useToast } from "@/hooks/useToast";
import { downloadFileWithToken } from "@/lib/downloadFileWithToken";
import { formatDate } from "@/lib/utils";
import { Download, FileText, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

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
					<Button
						size="sm"
						onClick={() => setShowGenerate(true)}
						className="cursor-pointer"
					>
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

export default ReportsTab;
