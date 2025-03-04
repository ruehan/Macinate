import React from "react";
import { motion } from "framer-motion";
import Dock from "../dock/Dock";
import MenuBar from "../menubar/MenuBar";
import Desktop from "../desktop/Desktop";

// 나중에 구현할 컴포넌트들을 위한 임시 플레이스홀더
// const MenuBar = () => <div className="h-6 bg-white/80 backdrop-blur-md flex items-center px-4 text-sm text-black">메뉴바 (구현 예정)</div>;

// const Dock = () => (
// 	<div className="h-16 flex justify-center">
// 		<div className="bg-white/20 backdrop-blur-lg px-4 rounded-2xl flex items-center h-14 mb-1">독 (구현 예정)</div>
// 	</div>
// );

interface MacOSLayoutProps {
	children: React.ReactNode;
}

export default function MacOSLayout({ children }: MacOSLayoutProps) {
	return (
		<motion.div className="flex flex-col h-screen w-screen overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
			<MenuBar />
			<Desktop>{children}</Desktop>
			<Dock />
		</motion.div>
	);
}
