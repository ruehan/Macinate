import { SystemSettingsProvider } from "~/store/SystemSettingsContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="overflow-hidden">
				<SystemSettingsProvider>{children}</SystemSettingsProvider>
			</body>
		</html>
	);
}
