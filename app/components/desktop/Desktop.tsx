import React from "react";
import { motion } from "framer-motion";

interface DesktopProps {
	children: React.ReactNode;
}

export default function Desktop({ children }: DesktopProps) {
	return (
		<motion.div
			className="flex-1 bg-cover bg-center overflow-hidden relative"
			style={{ backgroundImage: "url(/wallpaper.jpg)" }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			{/* 데스크탑 아이콘 영역 */}
			<div className="absolute top-2 left-2 flex flex-col space-y-4">{/* 여기에 데스크탑 아이콘들이 추가될 예정 */}</div>

			{/* 앱 창 영역 */}
			<div className="h-full w-full">{children}</div>
		</motion.div>
	);
}
