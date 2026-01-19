import { Users, Calendar, ArrowRight, Sparkles } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, getIntervalLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { ICollectiveProjectPublic } from "@/interfaces/ICollectiveProjectPublic";
import { useState } from "react";
import ProjectModal from "./ProjectModal";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

const ProjectCard = ({ project }: { project: ICollectiveProjectPublic }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { participantUser, isLoading } = useAuth();
	const navigate = useNavigate();
	const handleOpen = () => {
		if (participantUser) {
			navigate(`/projects/${project.slug}`);
		} else {
			setIsOpen(true);
		}
	};
	return (
		<>
			<Card
				variant="glass"
				className="group hover:border-cosmic-cyan/30 transition-all duration-300"
			>
				<CardHeader>
					<div className="flex items-start justify-between gap-3">
						<CardTitle className="text-star-white group-hover:text-cosmic-cyan transition-colors">
							{project.title}
						</CardTitle>
						<Badge variant="outline" className="shrink-0">
							<Users className="h-3 w-3 mr-1" />
							{project.participant_limit}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-star-dim">
							<Sparkles className="h-4 w-4 text-cosmic-gold" />
							<span className="font-mono text-lg text-cosmic-cyan">
								{formatCurrency(project.amount_per_participant)}
							</span>
							<span className="text-sm">
								{getIntervalLabel(
									project.payment_interval,
									project.payments_per_interval,
								)}
							</span>
						</div>
						<div className="flex items-center gap-2 text-star-muted text-sm">
							<Calendar className="h-4 w-4" />
							<span>
								{project.payment_methods.filter((m) => m.is_active).length}{" "}
								método(s) de pagamento
							</span>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<div className="w-full">
						<Button
							variant="outline"
							className="w-full group-hover:border-cosmic-cyan group-hover:bg-cosmic-cyan/10 cursor-pointer"
							onClick={handleOpen}
							disabled={isLoading}
						>
							Abrir
							<ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
						</Button>
					</div>
				</CardFooter>
			</Card>
			{!participantUser && !isLoading ? (
				<>
					{isOpen ? (
						<ProjectModal setIsOpen={setIsOpen} project={project} />
					) : null}
				</>
			) : null}
		</>
	);
};
export default ProjectCard;
