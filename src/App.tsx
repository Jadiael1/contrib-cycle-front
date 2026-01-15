import AppRoutes from "./routes";
import ThemeProvider from "./components/ThemeProvider";
import ToastProvider from "./components/feedback/ToastProvider";

const App = () => {
	return (
		<ThemeProvider>
			<ToastProvider>
				<AppRoutes />
			</ToastProvider>
		</ThemeProvider>
	);
}

export default App;
