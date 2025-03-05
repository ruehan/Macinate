import React, { useState } from "react";
import { motion } from "framer-motion";
import { useWindow } from "~/store/WindowContext";
import SettingsApp from "~/components/apps/SettingsApp";
import NotesApp from "~/components/apps/NotesApp";
import FinderApp from "~/components/apps/FinderApp";
import SafariApp from "~/components/apps/SafariApp";

interface DockItemProps {
	id: string;
	name: string;
	icon: string;
	size?: number;
	magnification?: boolean;
	magnificationLevel?: number;
	position?: "bottom" | "left" | "right";
}

export default function DockItem({ id, name, icon, size = 60, magnification = true, magnificationLevel = 1.5, position = "bottom" }: DockItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const { openWindow, state } = useWindow();

	// 앱이 현재 열려있는지 확인
	const isAppOpen = state.windows.some((window) => window.id === id && window.isOpen && !window.isMinimized);

	// 앱 아이콘 클릭 시 창 열기
	const handleClick = () => {
		// 앱 ID에 따라 다른 앱 열기
		switch (id) {
			case "settings":
				openWindow({
					id: "settings",
					title: "System Settings",
					content: <SettingsApp />,
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 100, y: 50 },
					size: { width: 700, height: 500 },
					appIcon: "/icons/settings.svg",
				});
				break;
			case "notes":
				openWindow({
					id: "notes",
					title: "Notes",
					content: <NotesApp />,
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 100, y: 50 },
					size: { width: 600, height: 400 },
					appIcon: "/icons/notes.svg",
				});
				break;
			case "finder":
				openWindow({
					id: "finder",
					title: "Finder",
					content: <FinderApp />,
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 200, y: 150 },
					size: { width: 700, height: 500 },
					appIcon: "/icons/finder.svg",
				});
				break;
			case "safari":
				openWindow({
					id: "safari",
					title: "Safari",
					content: <SafariApp />,
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 150, y: 100 },
					size: { width: 800, height: 600 },
					appIcon: "/icons/safari.svg",
				});
				break;
			default:
				// 기타 앱은 아직 구현되지 않음
				alert(`${name} 앱은 아직 구현되지 않았습니다.`);
				break;
		}
	};

	// 확대 효과 계산
	const scale = magnification && isHovered ? magnificationLevel : 1;

	// 독 위치에 따른 스타일 계산
	const getMarginStyle = () => {
		if (position === "bottom") {
			return { marginLeft: 4, marginRight: 4 };
		} else {
			return { marginTop: 4, marginBottom: 4 };
		}
	};

	return (
		<div className="relative group" style={getMarginStyle()}>
			{/* 앱 이름 툴팁 */}
			<div
				className={`absolute ${
					position === "bottom" ? "bottom-full mb-2" : position === "left" ? "left-full ml-2" : "right-full mr-2"
				} bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}
			>
				{name}
			</div>

			{/* 앱 아이콘 */}
			<motion.div
				className="flex items-center justify-center cursor-pointer"
				animate={{
					scale,
					y: position === "bottom" ? (isHovered ? -10 : 0) : 0,
					x: position === "left" ? (isHovered ? 10 : 0) : position === "right" ? (isHovered ? -10 : 0) : 0,
				}}
				transition={{ type: "spring", stiffness: 300, damping: 20 }}
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				onClick={handleClick}
			>
				<img src={icon} alt={name} style={{ width: size, height: size }} className="rounded-xl" />
			</motion.div>

			{/* 앱이 열려있을 때 표시되는 인디케이터 */}
			{isAppOpen && (
				<div
					className={`absolute ${
						position === "bottom"
							? "bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1"
							: position === "left"
							? "left-0 top-1/2 transform -translate-y-1/2 w-1 h-1"
							: "right-0 top-1/2 transform -translate-y-1/2 w-1 h-1"
					} bg-white rounded-full`}
				/>
			)}
		</div>
	);
}
