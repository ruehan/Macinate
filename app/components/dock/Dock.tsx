import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DockItem from "./DockItem";
import { useSystemSettings } from "~/store/SystemSettingsContext";

// 독에 표시할 앱 목록
const dockItems = [
	{ id: "finder", name: "Finder", icon: "/icons/png/finder.png" },
	{ id: "safari", name: "Safari", icon: "/icons/png/safari.png" },
	{ id: "notes", name: "Notes", icon: "/icons/png/notes.png" },
	{ id: "settings", name: "Settings", icon: "/icons/png/settings.png" },
	// { id: "mail", name: "Mail", icon: "/icons/png/mail.png" },
	// { id: "messages", name: "Messages", icon: "/icons/png/messages.png" },
	// { id: "maps", name: "Maps", icon: "/icons/png/maps.png" },
	// { id: "photos", name: "Photos", icon: "/icons/png/photos.png" },
	// { id: "facetime", name: "FaceTime", icon: "/icons/png/facetime.png" },
	// { id: "calendar", name: "Calendar", icon: "/icons/png/calendar.png" },
];

export default function Dock() {
	const { state } = useSystemSettings();
	const [isVisible, setIsVisible] = useState(true);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (!state.dock.autohide) {
			setIsVisible(true);
			return;
		}

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });

			const windowHeight = window.innerHeight;
			const windowWidth = window.innerWidth;
			const threshold = 50; // 마우스가 이 픽셀 이내로 오면 독이 표시됨

			if (state.dock.position === "bottom" && e.clientY > windowHeight - threshold) {
				setIsVisible(true);
			} else if (state.dock.position === "left" && e.clientX < threshold) {
				setIsVisible(true);
			} else if (state.dock.position === "right" && e.clientX > windowWidth - threshold) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [state.dock.autohide, state.dock.position]);

	// 독 위치에 따른 스타일 계산
	const getDockPositionStyle = () => {
		switch (state.dock.position) {
			case "bottom":
				return "bottom-2 left-0 right-0 flex-row items-end";
			case "left":
				return "left-2 top-0 bottom-0 flex-col items-start";
			case "right":
				return "right-2 top-0 bottom-0 flex-col items-end";
			default:
				return "bottom-2 left-0 right-0 flex-row items-end";
		}
	};

	return (
		<motion.div
			className={`flex justify-center z-50 fixed ${getDockPositionStyle()}`}
			initial={{ opacity: 0, y: state.dock.position === "bottom" ? 20 : 0, x: state.dock.position === "left" ? -20 : state.dock.position === "right" ? 20 : 0 }}
			animate={{
				opacity: isVisible ? 1 : 0,
				y: state.dock.position === "bottom" ? (isVisible ? 0 : 20) : 0,
				x: state.dock.position === "left" ? (isVisible ? 0 : -20) : state.dock.position === "right" ? (isVisible ? 0 : 20) : 0,
			}}
			transition={{ duration: 0.3 }}
		>
			<div className={`p-2 rounded-2xl flex ${state.dock.position === "bottom" ? "flex-row" : "flex-col"} items-center shadow-dock bg-macos-dock backdrop-blur-2xl`}>
				{dockItems.map((item) => (
					<DockItem key={item.id} id={item.id} name={item.name} icon={item.icon} position={state.dock.position} />
				))}
			</div>
		</motion.div>
	);
}
