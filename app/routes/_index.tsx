import { useEffect, useRef, useCallback } from "react";
import type { MetaFunction } from "@remix-run/node";
import MacOSLayout from "~/components/layout/MacOSLayout";
import WelcomeApp from "~/components/apps/WelcomeApp";
import { useWindow } from "~/store/WindowContext";

export const meta: MetaFunction = () => {
	return [{ title: "Macinate - 웹 기반 맥 OS 시뮬레이터" }, { name: "description", content: "웹에서 맥 OS 경험을 즐겨보세요!" }];
};

export default function Index() {
	const { openWindow, state } = useWindow();
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

	// 페이지 로드 시 환영 창 열기 - state.windows가 변경될 때만 확인
	useEffect(() => {
		// 이미 welcome 창이 열려있는지 확인
		const welcomeWindowExists = state.windows.some((window) => window.id === "welcome");
		hasOpenedWelcomeWindow.current = false;

		// 이미 창을 열었거나 이미 welcome 창이 존재하면 실행하지 않음
		if (hasOpenedWelcomeWindow.current || welcomeWindowExists) {
			return;
		}

		// 창을 열었음을 표시
		hasOpenedWelcomeWindow.current = true;

		// 약간의 지연 후 창 열기 (애니메이션 효과를 위해)
		const timer = setTimeout(() => {
			openWelcomeWindow();
		}, 1000);

		return () => clearTimeout(timer);
	}, []); // state.windows와 openWelcomeWindow가 변경될 때만 실행

	return (
		<MacOSLayout>
			<div className="h-full">{/* 데스크탑 영역은 비워둡니다. 창은 WindowManager에서 관리됩니다. */}</div>
		</MacOSLayout>
	);
}
