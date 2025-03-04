import React, { useState } from "react";
import { motion } from "framer-motion";

interface DockItemProps {
	id: string;
	name: string;
	icon: string;
}

export default function DockItem({ id, name, icon }: DockItemProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			className="flex flex-col items-center mx-1 relative"
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			whileHover={{ scale: 1.2, y: -10 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			{/* 앱 아이콘 */}
			<div className="w-12 h-12 relative">
				<div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-xs">{name.substring(0, 1)}</div>
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
			<div className="w-1 h-1 bg-white rounded-full mt-1"></div>
		</motion.div>
	);
}
