import AppRoutes from "./routes";
import ThemeProvider from "./components/ThemeProvider";
import ToastProvider from "./components/feedback/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthProvider";

const App = () => {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<ToastProvider>
					<AuthProvider>
						<AppRoutes />
					</AuthProvider>
				</ToastProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default App;
