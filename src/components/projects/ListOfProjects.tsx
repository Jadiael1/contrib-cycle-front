import { Rocket } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState, EmptyState } from "@/components/ui/States";
import ProjectCard from "@/components/projects/ProjectCard";

const ListOfProjects = () => {
	const { data, isLoading, error, refetch } = useProjects();
	return (
		<section className="py-12">
			<div className="container px-4">
				<div className="flex items-center gap-3 mb-8">
					<div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
					<h2 className="text-xl font-bold text-star-white">Projetos Ativos</h2>
					<div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
				</div>

				{isLoading && (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<SkeletonCard key={i} />
						))}
					</div>
				)}

				{error && (
					<ErrorState
						message="Não foi possível carregar os projetos. Verifique sua conexão."
						onRetry={() => refetch()}
					/>
				)}

				{data && data.data.length === 0 && (
					<EmptyState
						icon={<Rocket className="h-16 w-16" />}
						title="Nenhum projeto disponível"
						description="Ainda não há projetos ativos no momento. Volte em breve!"
					/>
				)}

				{data && data.data.length > 0 && (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{data.data.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default ListOfProjects;
