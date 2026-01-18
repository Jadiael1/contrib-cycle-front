import Loading from "@/components/feedback/Loading";
import { useAuth } from "../hooks/useAuth";
import NotFound from "@/pages/NotFound";
import { useLocation } from "react-router";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { isLoading, participantUser } = useAuth();
	const location = useLocation();

	const isDash = /^\/admin(\/|$)/.test(location.pathname);
	if (!isDash) {
		if (isLoading) {
			return <Loading />;
		}

		// se o usuario não fez login, e o loading terminou.
		if (!isLoading && !participantUser) {
			// return <Navigate to="/auth/signin" />;
			// return <AccessDeniedPage />;
			return <NotFound />;
		}

		if (!isLoading) {
			return <>{children}</>;
		}
	} else {
		if (isLoading) {
			return <Loading />;
		}
		return <>{children}</>;
	}
};
