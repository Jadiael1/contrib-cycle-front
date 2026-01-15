import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export default interface IRoutes {
	path: string;
	visibleInDisplay?: boolean;
	displayName?: string;
	protected: boolean;
	component: ComponentType;
	icon?: LucideIcon | null;
}
