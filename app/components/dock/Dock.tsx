import React from "react";
import { motion } from "framer-motion";
import DockItem from "./DockItem";

// 독에 표시할 앱 목록
const dockItems = [
	{ id: "finder", name: "Finder", icon: "/icons/finder.svg" },
	{ id: "safari", name: "Safari", icon: "/icons/safari.png" },
	{ id: "mail", name: "Mail", icon: "/icons/mail.png" },
	{ id: "messages", name: "Messages", icon: "/icons/messages.png" },
	{ id: "maps", name: "Maps", icon: "/icons/maps.png" },
	{ id: "photos", name: "Photos", icon: "/icons/photos.png" },
	{ id: "facetime", name: "FaceTime", icon: "/icons/facetime.png" },
	{ id: "calendar", name: "Calendar", icon: "/icons/calendar.png" },
	{ id: "notes", name: "Notes", icon: "/icons/notes.png" },
	{ id: "reminders", name: "Reminders", icon: "/icons/reminders.png" },
];

export default function Dock() {
	return (
		<motion.div className="flex justify-center items-end h-20 pb-1 z-50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
			<div className="bg-macos-dock backdrop-blur-2xl px-2 rounded-2xl flex items-end h-16 shadow-dock">
				{dockItems.map((item) => (
					<DockItem key={item.id} id={item.id} name={item.name} icon={item.icon} />
				))}
			</div>
		</motion.div>
	);
}
