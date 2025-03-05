import { useEffect, useRef, useCallback } from "react";
import type { MetaFunction } from "@remix-run/node";
import MacOSLayout from "~/components/layout/MacOSLayout";
import WelcomeApp from "~/components/apps/WelcomeApp";
import { useWindow } from "~/store/WindowContext";
import { useAuth } from "~/store/AuthContext";
import LoginScreen from "~/components/auth/LoginScreen";

export const meta: MetaFunction = () => {
	return [{ title: "Macinate - 웹 기반 맥 OS 시뮬레이터" }, { name: "description", content: "웹에서 맥 OS 경험을 즐겨보세요!" }];
};

export default function Index() {
	const { openWindow, state } = useWindow();
	const { state: authState, login } = useAuth();
	const hasOpenedWelcomeWindow = useRef(false);

	const openWelcomeWindow = useCallback(() => {
		openWindow({
			id: "welcome",
			title: "Welcome to Macinate",
			content: <WelcomeApp />,
			isOpen: true,
			isMinimized: false,
			isMaximized: false,
			position: { x: 100, y: 50 },
			size: { width: 600, height: 400 },
			appIcon: "/icons/welcome.svg",
		});
	}, [openWindow]);

	useEffect(() => {
		if (!authState.isAuthenticated) {
			return;
		}

		const welcomeWindowExists = state.windows.some((window) => window.id === "welcome");

		if (hasOpenedWelcomeWindow.current || welcomeWindowExists) {
			return;
		}

		hasOpenedWelcomeWindow.current = true;

		const timer = setTimeout(() => {
			openWelcomeWindow();
		}, 1000);

		return () => clearTimeout(timer);
	}, [authState.isAuthenticated, state.windows, openWelcomeWindow]);

	const handleLogin = (username: string) => {
		login(username);
	};

	if (!authState.isAuthenticated) {
		return <LoginScreen onLogin={handleLogin} />;
	}

	return (
		<MacOSLayout>
			<div className="h-full"></div>
		</MacOSLayout>
	);
}
