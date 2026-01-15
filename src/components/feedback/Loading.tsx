const Loading = () => {
	const wrapper = "fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm z-50"
	return (
		<div
			className={`${wrapper}`}
			role="status"
			aria-live="polite"
			aria-busy="true"
		>
			<span
				aria-hidden="true"
				className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"
			/>
			<span className="text-sm text-white">Carregando…</span>
		</div>
	);
}

export default Loading;
