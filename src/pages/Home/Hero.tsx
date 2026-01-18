import { Rocket } from "lucide-react";
const Hero = () => {
	return (
		<section className="relative py-16 md:py-24 nebula-glow">
			<div className="container px-4 text-center">
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cosmic-purple/20 border border-cosmic-purple/30 text-cosmic-purple text-sm mb-6">
					<Rocket className="h-4 w-4" />
					Projetos Coletivos
				</div>
				<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-star-white mb-4 leading-tight">
					Junte-se à <span className="text-cosmic-cyan">Missão</span>
				</h1>
				<p className="text-lg md:text-xl text-star-dim max-w-2xl mx-auto">
					Participe de projetos coletivos e contribua para missões incríveis.
					Encontre seu destino no universo.
				</p>
			</div>
		</section>
	);
};

export default Hero;
