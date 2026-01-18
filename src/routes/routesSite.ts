import { House } from "lucide-react";
import Home from "@/pages/Home";
import type IRoutes from "./IRoutes";

const routesSite: IRoutes[] = [
	{
		path: "/",
		component: Home,
		visibleInDisplay: true,
		displayName: "Home",
		protected: false,
		icon: House,
	},
];

export default routesSite;
