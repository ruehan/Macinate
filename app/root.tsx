import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { WindowProvider } from "~/store/WindowContext";
import { FileSystemProvider } from "~/store/FileSystemContext";
import SpotlightProvider from "~/components/spotlight/SpotlightProvider";
import { SystemSettingsProvider } from "~/store/SystemSettingsContext";
import { AuthProvider } from "~/store/AuthContext";

import "./tailwind.css";

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko" className="light dark:dark">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="font-sans antialiased">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<WindowProvider>
			<FileSystemProvider>
				<SystemSettingsProvider>
					<AuthProvider>
						<SpotlightProvider>
							<Outlet />
						</SpotlightProvider>
					</AuthProvider>
				</SystemSettingsProvider>
			</FileSystemProvider>
		</WindowProvider>
	);
}
