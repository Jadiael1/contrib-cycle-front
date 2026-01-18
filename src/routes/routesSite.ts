import { House } from "lucide-react";
import Home from "@/pages/Home";
import type IRoutes from "./IRoutes";
import ProjectPage from "@/pages/ProjectPage";

const routesSite: IRoutes[] = [
	{
		path: "/",
		component: Home,
		visibleInDisplay: true,
		displayName: "Home",
		protected: false,
		icon: House,
	},
	{
		path: "/projects/:slug",
		component: ProjectPage,
		visibleInDisplay: false,
		displayName: "",
		protected: true,
		icon: null,
	},
];

export default routesSite;
