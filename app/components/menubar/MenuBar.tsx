import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppleMenu from "./AppleMenu";
import StatusIcons from "./StatusIcons";
import MenuItem from "./MenuItem";
import { useWindow } from "~/store/WindowContext";
import { getAppMenus, menuLabels, menuOrder } from "~/data/appMenus";
import { useAuth } from "~/store/AuthContext";

export default function MenuBar() {
	const { state } = useWindow();
	const { sleep, restart } = useAuth();
	const [currentTime, setCurrentTime] = useState(
		new Date().toLocaleTimeString("ko-KR", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		})
	);

	const focusedWindow = state.windows.find((window) => window.isFocused);
	const appId = focusedWindow?.id || "finder";
	const appName = focusedWindow?.title || "Finder";

	const appMenus = getAppMenus(appId);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(
				new Date().toLocaleTimeString("ko-KR", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				})
			);
		}, 60000);

		return () => clearInterval(timer);
	}, []);

	const handleAppleMenuClick = (action: string) => {
		console.log("Apple menu action:", action);

		switch (action) {
			case "sleep":
				sleep();
				break;
			case "restart":
				restart();
				break;
			case "shutdown":
				restart(); // 종료도 재시작과 동일하게 처리
				break;
			case "logout":
				restart();
				break;
			case "preferences":
				// 시스템 환경설정 앱 열기 (구현 예정)
				break;
			default:
				break;
		}
	};

	return (
		<motion.div
			className="h-7 bg-macos-menubar backdrop-blur-md flex items-center justify-between px-3 text-sm text-black z-50"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.2 }}
		>
			<div className="flex items-center space-x-4">
				<AppleMenu onItemClick={handleAppleMenuClick} />

				<span className="font-semibold">{appName}</span>

				{/* 앱별 메뉴 렌더링 */}
				{menuOrder.map((menuKey) => {
					if (menuKey === "app") return null;

					if (!appMenus[menuKey]) return null;

					return <MenuItem key={menuKey} label={menuLabels[menuKey]} items={appMenus[menuKey]} />;
				})}
			</div>
			<StatusIcons currentTime={currentTime} />
		</motion.div>
	);
}
