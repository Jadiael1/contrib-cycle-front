import { BrowserRouter, Routes, Route } from "react-router";
import routes from "@/routes/routes";
import NotFound from "@/pages/NotFound";
import Loading from "@/components/feedback/Loading";

const AppRoutes = () => {
	const isLoading = false;

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
									<div>Protected...</div>
								) : !isLoading ? (
									<Component />
								) : (
									<Loading />
								)
							}
						/>
					)
				)}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
