import AdminProjects from "@/pages/admin/Projects";
import type IRoutes from "./IRoutes";
import { FolderKanban } from "lucide-react";
import AdminHome from "@/pages/admin/Home";
import AdminProjectNew from "@/pages/admin/Projects/AdminProjectNew";
import AdminProjectDetails from "@/pages/admin/Projects/AdminProjectDetails";

const routesAdmin: IRoutes[] = [
	{
		path: "/admin",
		component: AdminHome,
		visibleInDisplay: false,
		displayName: "Dashboard",
		protected: true,
		icon: null,
	},
	{
		path: "/admin/projects",
		component: AdminProjects,
		visibleInDisplay: true,
		displayName: "Projetos",
		protected: true,
		icon: FolderKanban,
	},
	{
		path: "/admin/projects/new",
		component: AdminProjectNew,
		visibleInDisplay: false,
		displayName: "Projetos",
		protected: true,
		icon: null,
	},
	{
		path: "/admin/projects/:projectId/*",
		component: AdminProjectDetails,
		visibleInDisplay: false,
		displayName: "Projetos",
		protected: true,
		icon: null,
	},
];

export default routesAdmin;
