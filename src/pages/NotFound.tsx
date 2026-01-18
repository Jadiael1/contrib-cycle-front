import { Link } from "react-router";
import { Orbit, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const NotFound = () => {
	return (
		<div className="min-h-screen stars-bg flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<div className="relative mb-8">
					<Orbit className="h-24 w-24 text-cosmic-purple mx-auto animate-float opacity-30" />
					<AlertTriangle className="h-12 w-12 text-warning absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
				</div>
				<h1 className="text-4xl font-bold text-star-white mb-4">404</h1>
				<p className="text-xl text-star-dim mb-2">Página não encontrada</p>
				<p className="text-star-muted mb-8">
					Parece que você se perdeu no espaço. Esta página não existe ou foi
					movida para outra galáxia.
				</p>
				<Link to="/">
					<Button className="cursor-pointer">
						<Home className="h-4 w-4 mr-2" />
						Voltar ao Início
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
