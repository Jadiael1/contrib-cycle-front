import type { IPayment } from "@/interfaces/IPayments";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Check, ExternalLink } from "lucide-react";
import { useMemo } from "react";

const API_BASE_URL_FALLBACK = "http://localhost:8000";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL_FALLBACK;

function getStorageUrl(path: string | null): string | null {
	if (!path) return null;
	return `${API_BASE_URL}/storage/${path}`;
}

const PaymentRow = ({ payment }: { payment: IPayment }) => {
	const periodLabel = useMemo(() => {
		const parts = [String(payment.period.year)];
		if (payment.period.month)
			parts.push(String(payment.period.month).padStart(2, "0"));
		if (payment.period.week_of_month)
			parts.push(`S${payment.period.week_of_month}`);
		parts.push(`#${payment.period.sequence}`);
		return parts.join(" / ");
	}, [payment.period]);

	const receiptUrl = getStorageUrl(payment.receipt_path);

	return (
		<div className="flex items-center justify-between py-3 border-b border-border last:border-0">
			<div className="flex items-center gap-3">
				<div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
					<Check className="h-5 w-5 text-success" />
				</div>
				<div>
					<p className="font-mono text-sm text-star-white">{periodLabel}</p>
					<p className="text-xs text-star-muted">
						{formatDate(payment.paid_at)}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<span className="font-mono text-cosmic-cyan">
					{formatCurrency(payment.amount)}
				</span>
				<a
					href={receiptUrl ?? "#"}
					target="_blank"
					rel="noopener noreferrer"
					className={`text-star-muted hover:text-cosmic-cyan transition-colors ${receiptUrl ? "" : "invisible"}`}
				>
					<ExternalLink className="h-4 w-4" />
				</a>
			</div>
		</div>
	);
};
export default PaymentRow;
