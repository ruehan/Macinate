import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindow } from "~/store/WindowContext";
import { useSystemSettings } from "~/store/SystemSettingsContext";
import SettingsApp from "~/components/apps/SettingsApp";
import NotesApp from "~/components/apps/NotesApp";
import FinderApp from "~/components/apps/FinderApp";
import SafariApp from "~/components/apps/SafariApp";

interface DockItemProps {
	id: string;
	name: string;
	icon: string;
	position?: "bottom" | "left" | "right";
}

export default function DockItem({ id, name, icon, position = "bottom" }: DockItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const { openWindow, state } = useWindow();
	const { state: systemSettings } = useSystemSettings();

	const [size, setSize] = useState(60);
	const [magnification, setMagnification] = useState(true);
	const [magnificationLevel, setMagnificationLevel] = useState(1.5);
	const [dockPosition, setDockPosition] = useState(position);

	useEffect(() => {
		setSize(systemSettings.dock.size);
		setMagnification(systemSettings.dock.magnification);
		setMagnificationLevel(systemSettings.dock.magnificationLevel);
		setDockPosition(systemSettings.dock.position || position);
	}, [systemSettings, position]);

	const isAppOpen = state.windows.some((window) => window.id === id && window.isOpen && !window.isMinimized);

	const handleClick = () => {
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
				alert(`${name} 앱은 아직 구현되지 않았습니다.`);
				break;
		}
	};

	const scale = magnification && isHovered ? magnificationLevel : 1;

	const getMarginStyle = () => {
		if (dockPosition === "bottom") {
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
					dockPosition === "bottom" ? "bottom-full mb-2" : dockPosition === "left" ? "left-full ml-2" : "right-full mr-2"
				} bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}
			>
				{name}
			</div>

			{/* 앱 아이콘 */}
			<motion.div
				className="flex items-center justify-center cursor-pointer"
				animate={{
					scale,
					y: dockPosition === "bottom" ? (isHovered ? -10 : 0) : 0,
					x: dockPosition === "left" ? (isHovered ? 10 : 0) : dockPosition === "right" ? (isHovered ? -10 : 0) : 0,
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
						dockPosition === "bottom"
							? "bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1"
							: dockPosition === "left"
							? "left-0 top-1/2 transform -translate-y-1/2 w-1 h-1"
							: "right-0 top-1/2 transform -translate-y-1/2 w-1 h-1"
					} bg-white rounded-full`}
				/>
			)}
		</div>
	);
}
