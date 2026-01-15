import { Link } from "react-router";

const NotFound = () => {
	return (
		<div>
			<div>
				<p>Erro</p>
				<h1>404</h1>
				<p>A pagina que voce tentou acessar nao existe ou mudou de endereco.</p>
				<Link to="/">Voltar para o inicio</Link>
			</div>
		</div>
	);
};

export default NotFound;
