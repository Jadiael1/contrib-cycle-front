export type NormalizePhoneResult =
	| {
			ok: true;
			kind: "BR";
			value: string; // ex: 5581995207788
			ddd: string;
			subscriber: string; // 9 dígitos, começando com 9
			cleaned: string;
	  }
	| {
			ok: true;
			kind: "INTL";
			value: string; // dígitos crus (sem +, espaços, etc)
			cleaned: string;
	  }
	| {
			ok: false;
			reason: string;
			cleaned: string;
	  };

type NormalizeOptions = {
	/**
	 * Se true, Brasil só aceita MOBILE.
	 * Se false, permite fixo também (12 dígitos: 55 + DDD + 8).
	 * Pelo seu caso (login por telefone), recomendo true.
	 */
	brMobileOnly?: boolean;

	/**
	 * Se true, tenta tratar prefixo de discagem longa distância com operadora:
	 * Ex: 0XXDDDNÚMERO (onde XX é operadora)
	 */
	brAcceptCarrierPrefix0XX?: boolean;
};

const DEFAULT_OPTS: Required<NormalizeOptions> = {
	brMobileOnly: true,
	brAcceptCarrierPrefix0XX: true,
};

export function normalizePhone(
	input: string,
	options?: NormalizeOptions,
): NormalizePhoneResult {
	const opts = { ...DEFAULT_OPTS, ...(options ?? {}) };

	// 1) deixa só dígitos
	let digits = (input ?? "").replace(/\D/g, "");
	if (!digits) return { ok: false, reason: "Telefone vazio.", cleaned: "" };

	// 2) remove prefixo internacional comum "00" (ex: 0055...)
	if (digits.startsWith("00")) digits = digits.slice(2);

	// 3) se for algo tipo 055..., remove o 0 sobrando antes do 55
	if (digits.startsWith("0") && digits.slice(1).startsWith("55")) {
		digits = digits.slice(1);
	}

	// --- Decide se é BR ou INTL ---
	const brAttempt = tryNormalizeBR(digits, opts);

	if (brAttempt.ok) return brAttempt;

	// Se começa com 55 e falhou BR, é erro (você quer validar BR)
	if (digits.startsWith("55")) {
		return brAttempt; // já vem com ok:false e reason
	}

	// Caso não seja BR (ou não pareça BR), aceita como internacional (sem validar)
	// Só aplica um sanity check de tamanho (E.164 <= 15, e um mínimo pragmático)
	if (digits.length < 10) {
		return {
			ok: false,
			reason: "Número BR incompleto (faltou DDD). Informe DDD + número.",
			cleaned: digits,
		};
	}

	if (digits.length > 15) {
		return { ok: false, reason: "Número muito longo.", cleaned: digits };
	}

	// opcional: E.164 não usa 0 no começo de country code
	if (digits.startsWith("0")) {
		return {
			ok: false,
			reason: "Número internacional inválido (não pode iniciar com 0).",
			cleaned: digits,
		};
	}

	return { ok: true, kind: "INTL", value: digits, cleaned: digits };
}

// ------------------ BR helpers ------------------

function tryNormalizeBR(
	digitsRaw: string,
	opts: Required<NormalizeOptions>,
): NormalizePhoneResult {
	let d = digitsRaw;

	// Se vier com 55, tira e trabalha no nacional
	if (d.startsWith("55")) d = d.slice(2);

	// Trata tronco 0 + DDD + número (ex: 0819..., 0818659...)
	// ou 0XX + DDD + número (operadora)
	if (d.startsWith("0")) {
		// Tenta 0XX + DDD + número
		if (opts.brAcceptCarrierPrefix0XX && d.length >= 12) {
			const maybe = d.slice(1); // remove o 0
			// se remover mais 2 (operadora) deixa 10 ou 11, ótimo
			const afterCarrier = maybe.slice(2);
			if (afterCarrier.length === 10 || afterCarrier.length === 11) {
				d = afterCarrier;
			} else {
				// fallback: só remove o 0
				d = maybe;
			}
		} else {
			d = d.slice(1);
		}
	}

	// Agora esperamos formato nacional: DDD(2) + local(8 ou 9)
	// Se não estiver nesse tamanho, não parece BR (deixa INTL tratar)
	if (!(d.length === 10 || d.length === 11)) {
		return {
			ok: false,
			reason: "Não parece um número BR.",
			cleaned: digitsRaw,
		};
	}

	const ddd = d.slice(0, 2);
	const local = d.slice(2);

	// Validação simples de DDD: 11..99 (evita 00, 01, 02... e 10)
	if (!/^(1[1-9]|[2-9]\d)$/.test(ddd)) {
		return { ok: false, reason: "DDD inválido.", cleaned: digitsRaw };
	}

	// Se já tem 9 dígitos no local, deve ser móvel e começar com 9
	if (local.length === 9) {
		if (local[0] !== "9") {
			// local 9 dígitos mas não começa com 9 → bem suspeito pra celular
			return {
				ok: false,
				reason: "Número BR inválido (celular deve começar com 9).",
				cleaned: digitsRaw,
			};
		}

		return {
			ok: true,
			kind: "BR",
			value: `55${ddd}${local}`,
			ddd,
			subscriber: local,
			cleaned: digitsRaw,
		};
	}

	// local 8 dígitos: pode ser fixo ou celular antigo sem nono dígito
	// Pelo teu requisito, vamos “normalizar adicionando o 9” quando fizer sentido.
	const first = local[0];

	// Heurística pra “móvel antigo sem 9”: começar com 6..9 (muito comum historicamente)
	if (/[6-9]/.test(first)) {
		const mobile = `9${local}`;
		return {
			ok: true,
			kind: "BR",
			value: `55${ddd}${mobile}`,
			ddd,
			subscriber: mobile,
			cleaned: digitsRaw,
		};
	}

	// Se não parece móvel antigo, pode ser fixo (2..5)
	if (!opts.brMobileOnly && /[2-5]/.test(first)) {
		return {
			ok: true,
			kind: "BR",
			value: `55${ddd}${local}`, // 12 dígitos
			ddd,
			subscriber: local,
			cleaned: digitsRaw,
		};
	}

	return {
		ok: false,
		reason: opts.brMobileOnly
			? "Número BR inválido para celular (parece fixo ou formato inesperado)."
			: "Número BR inválido.",
		cleaned: digitsRaw,
	};
}
