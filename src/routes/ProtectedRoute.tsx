import Loading from "@/components/feedback/Loading";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const {
		isLoading,
		adminUser,
		adminToken,
		participantUser,
		participantToken,
	} = useAuth();
	const location = useLocation();
	const isAdminArea = /^\/admin(\/|$)/.test(location.pathname);

	if (isLoading) return <Loading />;

	if (isAdminArea) {
		if (!adminToken || !adminUser) {
			return <Navigate to="/admin/login" replace state={{ from: location }} />;
		}
		return <>{children}</>;
	}

	if (!participantToken || !participantUser) {
		return <Navigate to="/" replace state={{ from: location }} />;
	}
	return <>{children}</>;
};
