import type {
	IPaymentMethodBankTransfer,
	IPaymentMethodPix,
} from "@/interfaces/IParticipantProjectDetail";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type PaymentMethodProps = {
	method: IPaymentMethodPix | IPaymentMethodBankTransfer;
};

const PaymentMethodInfo = (prop: PaymentMethodProps) => {
	const method = prop.method;
	const [copied, setCopied] = useState(false);
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	if (method.type === "pix" && method.payload) {
		const pix = method.payload;
		return (
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<span className="text-star-muted text-sm">Chave PIX</span>
					<button
						onClick={() => copyToClipboard(pix.pix_key)}
						className="flex items-center gap-1 text-cosmic-cyan hover:text-cosmic-cyan/80 text-sm cursor-pointer"
					>
						{copied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
						{copied ? "Copiado!" : "Copiar"}
					</button>
				</div>
				<p className="font-mono text-sm bg-space-nebula p-3 rounded-lg break-all">
					{pix.pix_key}
				</p>
				<p className="text-star-dim text-sm">Titular: {pix.pix_holder_name}</p>
			</div>
		);
	}

	if (method.type === "bank_transfer" && method.payload) {
		const bank = method.payload;
		return (
			<div className="space-y-2 text-sm">
				<div className="flex justify-between">
					<span className="text-star-muted">Banco</span>
					<span className="font-mono">
						{bank.bank_name} {bank.bank_code && `(${bank.bank_code})`}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-star-muted">Agência</span>
					<span className="font-mono">{bank.agency}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-star-muted">Conta</span>
					<span className="font-mono">
						{bank.account_number}{" "}
						{bank.account_type === "savings" ? "(Poupança)" : "(Corrente)"}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-star-muted">Titular</span>
					<span>{bank.account_holder_name}</span>
				</div>
			</div>
		);
	}
};

export default PaymentMethodInfo;
