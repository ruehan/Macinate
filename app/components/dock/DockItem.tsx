import React, { useState } from "react";
import { motion } from "framer-motion";
import { useWindow } from "~/store/WindowContext";
import WelcomeApp from "~/components/apps/WelcomeApp";
import FinderApp from "~/components/apps/FinderApp";
import SafariApp from "~/components/apps/SafariApp";

interface DockItemProps {
	id: string;
	name: string;
	icon: string;
}

export default function DockItem({ id, name, icon }: DockItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const { openWindow, state } = useWindow();

	const isRunning = state.windows.some((window) => window.id === id);

	const launchApp = () => {
		if (isRunning) {
			const runningWindow = state.windows.find((window) => window.id === id);
			if (runningWindow && runningWindow.isMinimized) {
			} else {
				return;
			}
		}

		let appContent;
		let appTitle = name;
		let appSize = { width: 600, height: 400 };

		switch (id) {
			case "finder":
				appContent = <FinderApp />;
				appSize = { width: 800, height: 500 };
				break;
			case "safari":
				appContent = <SafariApp />;
				appSize = { width: 900, height: 600 };
				break;
			case "notes":
				appContent = <div>Notes 앱 (구현 예정)</div>;
				appSize = { width: 500, height: 400 };
				break;
			default:
				appContent = <WelcomeApp />;
		}

		const windowCount = state.windows.length;
		const position = {
			x: 100 + ((windowCount * 20) % 200),
			y: 50 + ((windowCount * 20) % 200),
		};

		openWindow({
			id,
			title: appTitle,
			content: appContent,
			isOpen: true,
			isMinimized: false,
			isMaximized: false,
			position,
			size: appSize,
			appIcon: icon,
		});
	};

	return (
		<motion.div
			className="flex flex-col items-center justify-center mx-1 relative"
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			whileHover={{ scale: 1.2, y: -10 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			onClick={launchApp}
		>
			{/* 앱 아이콘 */}
			<div className="w-12 h-12 relative flex items-center justify-center">
				{icon.endsWith(".svg") ? (
					<img src={icon} alt={name} className="w-full h-full rounded-lg" />
				) : (
					<div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-xs">{name.substring(0, 1)}</div>
				)}
			</div>

			{/* 앱 이름 툴팁 */}
			{isHovered && (
				<motion.div
					className="absolute -top-8 px-2 py-1 bg-gray-800/80 text-white text-xs rounded whitespace-nowrap"
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					{name}
				</motion.div>
			)}

			{/* 실행 중 표시 점 */}
			{isRunning && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
		</motion.div>
	);
}
