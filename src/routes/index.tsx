import { BrowserRouter, Routes, Route } from "react-router";
import routes from "@/routes/routes";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				{routes.map(
					({ path, component: Component, protected: isProtected }) => (
						<Route
							key={path}
							path={path}
							element={
								isProtected ? (
									<ProtectedRoute>
										<Component />
									</ProtectedRoute>
								) : (
									<Component />
								)
							}
						/>
					),
				)}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
