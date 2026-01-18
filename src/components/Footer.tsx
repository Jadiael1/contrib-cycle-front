const Footer = () => {
	return (
		<footer className="border-t border-border py-8 mt-12">
			<div className="container px-4 text-center text-star-muted text-sm">
				<p>
					© {new Date().getFullYear()} Contrib Cycle. Todos os direitos
					reservados.
				</p>
			</div>
		</footer>
	);
};
export default Footer;
