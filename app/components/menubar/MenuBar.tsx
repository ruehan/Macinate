import React from "react";
import { motion } from "framer-motion";
import AppleLogo from "./AppleLogo";
import StatusIcons from "./StatusIcons";

export default function MenuBar() {
	const currentTime = new Date().toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	return (
		<motion.div
			className="h-7 bg-macos-menubar backdrop-blur-md flex items-center justify-between px-3 text-sm text-black z-50"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.2 }}
		>
			<div className="flex items-center space-x-4">
				<AppleLogo />
				<span className="font-semibold">Finder</span>
				<span>파일</span>
				<span>편집</span>
				<span>보기</span>
				<span>이동</span>
				<span>윈도우</span>
				<span>도움말</span>
			</div>
			<StatusIcons currentTime={currentTime} />
		</motion.div>
	);
}
