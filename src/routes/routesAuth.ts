import type IRoutes from "./IRoutes";
import SigninPage from "@/pages/admin/Signin";

const routesAuth: IRoutes[] = [
	{
		path: "/admin/login",
		component: SigninPage,
		visibleInDisplay: false,
		displayName: "Signin",
		protected: false,
		icon: null,
	},
];

export default routesAuth;
