import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type PortalProps = {
	children: ReactNode;
	container?: Element | null;
};

export function Portal({ children, container }: PortalProps) {
	return createPortal(children, container ?? document.body);
}
