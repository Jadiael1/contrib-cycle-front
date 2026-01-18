import * as React from "react";
import { Upload, X } from "lucide-react";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalDescription,
	ModalFooter,
} from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { usePaymentOptions } from "@/hooks/usePaymentOptions";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePayment } from "@/hooks/useCreatePayment";
import { useToast } from "@/hooks/useToast";
import type { TPaymentInterval } from "@/types/TPaymentInterval";

interface Props {
	slug: string;
	paymentInterval: TPaymentInterval;
	onClose: () => void;
	onSuccess: () => void;
}

export default function NewPaymentModal({
	slug,
	paymentInterval,
	onClose,
	onSuccess,
}: Props) {
	const { toast } = useToast();
	const { participantToken } = useAuth();
	const createMutation = useCreatePayment(slug, participantToken!);

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	const [year, setYear] = React.useState(String(currentYear));
	const [month, setMonth] = React.useState(String(currentMonth));
	const [weekOfMonth, setWeekOfMonth] = React.useState("1");
	const [sequence, setSequence] = React.useState("1");
	const [paidAt, setPaidAt] = React.useState(
		new Date().toISOString().split("T")[0],
	);
	const [receipt, setReceipt] = React.useState<File | null>(null);
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	const { data: options } = usePaymentOptions(
		slug,
		participantToken!,
		parseInt(year),
		paymentInterval === "week" ? parseInt(month) : undefined,
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 10 * 1024 * 1024) {
				toast({
					title: "Error",
					description: "O arquivo deve ter no máximo 10MB.",
					variant: "destructive",
				});
				return;
			}
			setReceipt(file);
		}
	};

	const handleSubmit = async () => {
		setErrors({});
		const newErrors: Record<string, string> = {};

		if (!year) newErrors.year = "Selecione o ano";
		if ((paymentInterval === "week" || paymentInterval === "month") && !month) {
			newErrors.month = "Selecione o mês";
		}
		if (paymentInterval === "week" && !weekOfMonth) {
			newErrors.weekOfMonth = "Selecione a semana";
		}
		if (!sequence) newErrors.sequence = "Selecione a sequência";
		if (!paidAt) newErrors.paidAt = "Informe a data do pagamento";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const formData = new FormData();
		formData.append("year", year);
		formData.append("sequence", sequence);
		formData.append("paid_at", paidAt);

		if (paymentInterval === "week" || paymentInterval === "month") {
			formData.append("month", month);
		}
		if (paymentInterval === "week") {
			formData.append("week_of_month", weekOfMonth);
		}
		if (receipt) {
			formData.append("receipt", receipt);
		}

		try {
			await createMutation.mutateAsync(formData);
			onSuccess();
		} catch (err) {
			const error = err as { message?: string };
			toast({
				title: "Error",
				description: error.message || "Erro ao registrar pagamento.",
				variant: "destructive",
			});
		}
	};

	const sequenceOptions = React.useMemo(() => {
		if (!options) return [{ value: "1", label: "#1" }];
		const range = options.sequence_range;
		return Array.from({ length: range.max - range.min + 1 }, (_, i) => ({
			value: String(range.min + i),
			label: `#${range.min + i}`,
		}));
	}, [options]);

	const weekOptions = React.useMemo(() => {
		if (options?.weeks) {
			return options.weeks.map((w) => ({
				value: String(w.value),
				label: w.label,
			}));
		}
		return [
			{ value: "1", label: "1ª Semana" },
			{ value: "2", label: "2ª Semana" },
			{ value: "3", label: "3ª Semana" },
			{ value: "4", label: "4ª Semana" },
			{ value: "5", label: "5ª Semana" },
		];
	}, [options]);

	return (
		<Modal isOpen onClose={onClose}>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Registrar Pagamento</ModalTitle>
					<ModalDescription>
						Informe os dados do pagamento realizado.
					</ModalDescription>
				</ModalHeader>

				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<Select
							id="year"
							label="Ano"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							error={errors.year}
							options={[
								{
									value: String(currentYear - 1),
									label: String(currentYear - 1),
								},
								{ value: String(currentYear), label: String(currentYear) },
								{
									value: String(currentYear + 1),
									label: String(currentYear + 1),
								},
							]}
						/>

						{(paymentInterval === "week" || paymentInterval === "month") && (
							<Select
								id="monthly"
								label="Mês"
								value={month}
								onChange={(e) => setMonth(e.target.value)}
								error={errors.month}
								options={Array.from({ length: 12 }, (_, i) => ({
									value: String(i + 1),
									label: new Date(2000, i).toLocaleDateString("pt-BR", {
										month: "short",
									}),
								}))}
							/>
						)}
					</div>

					{paymentInterval === "week" && (
						<Select
							id="week"
							label="Semana do Mês"
							value={weekOfMonth}
							onChange={(e) => setWeekOfMonth(e.target.value)}
							error={errors.weekOfMonth}
							options={weekOptions}
						/>
					)}

					<div className="grid grid-cols-2 gap-4">
						<Select
							id="sequency"
							label="Sequência"
							value={sequence}
							onChange={(e) => setSequence(e.target.value)}
							error={errors.sequence}
							options={sequenceOptions}
						/>

						<Input
							id="dayOfPayment"
							label="Data do Pagamento"
							type="date"
							value={paidAt}
							onChange={(e) => setPaidAt(e.target.value)}
							error={errors.paidAt}
						/>
					</div>

					{/* File Upload */}
					<div>
						<label className="block text-sm font-medium text-star-dim mb-1.5">
							Comprovante (opcional)
						</label>
						{receipt ? (
							<div className="flex items-center justify-between p-3 rounded-lg bg-space-nebula border border-border">
								<span className="text-sm text-star-white truncate">
									{receipt.name}
								</span>
								<button
									onClick={() => setReceipt(null)}
									className="p-1 text-star-muted hover:text-destructive transition-colors"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						) : (
							<label className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-cosmic-cyan/50 cursor-pointer transition-colors">
								<Upload className="h-5 w-5 text-star-muted" />
								<span className="text-sm text-star-muted">
									Clique para anexar
								</span>
								<input
									type="file"
									accept="image/jpeg,image/png,application/pdf"
									onChange={handleFileChange}
									className="hidden"
								/>
							</label>
						)}
						<p className="mt-1 text-xs text-star-muted">
							JPG, PNG ou PDF até 10MB
						</p>
					</div>
				</div>

				<ModalFooter>
					<Button variant="secondary" onClick={onClose}>
						Cancelar
					</Button>
					<Button onClick={handleSubmit} isLoading={createMutation.isPending}>
						Registrar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
