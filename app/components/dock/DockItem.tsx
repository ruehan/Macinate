import React, { useState } from "react";
import { motion } from "framer-motion";
import WelcomeApp from "../apps/WelcomeApp";
import FinderApp from "../apps/FinderApp";
import SafariApp from "../apps/SafariApp";
import NotesApp from "../apps/NotesApp";
import { useWindow } from "~/store/WindowContext";

interface DockItemProps {
	id: string;
	name: string;
	icon: string;
}

export default function DockItem({ id, name, icon }: DockItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const { openWindow } = useWindow();

	const launchApp = () => {
		let appContent;
		let appSize = { width: 800, height: 500 };

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
				appContent = <NotesApp />;
				appSize = { width: 800, height: 600 };
				break;
			default:
				appContent = <WelcomeApp />;
		}

		openWindow({
			id,
			title: name,
			content: appContent,
			isOpen: true,
			isMinimized: false,
			isMaximized: false,
			position: {
				x: Math.max(50, Math.min(window.innerWidth - appSize.width - 50, 50 + Math.floor(Math.random() * 100))),
				y: Math.max(50, Math.min(window.innerHeight - appSize.height - 50, 50 + Math.floor(Math.random() * 100))),
			},
			size: appSize,
			appIcon: icon,
		});
	};

	return (
		<motion.div className="flex flex-col items-center justify-end mx-1 relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={launchApp}>
			<motion.div
				className="absolute -top-8 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
				initial={{ opacity: 0, y: 10, scale: 0.8 }}
				animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10, scale: isHovered ? 1 : 0.8 }}
				transition={{ duration: 0.2 }}
			>
				{name}
			</motion.div>
			<motion.div
				className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-md"
				whileHover={{ y: -10, scale: 1.1 }}
				transition={{ type: "spring", stiffness: 400, damping: 17 }}
			>
				<img src={icon} alt={name} className="w-10 h-10 object-contain" />
			</motion.div>
			<motion.div className="w-1 h-1 bg-gray-500 rounded-full mt-1" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} />
		</motion.div>
	);
}
