import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SubMenuItem = {
	id: string;
	separator?: boolean;
} & (
	| {
			separator: true;
	  }
	| {
			label: string;
			shortcut?: string;
			disabled?: boolean;
			onClick?: () => void;
	  }
);

export interface MenuItemProps {
	label: string;
	items: SubMenuItem[];
}

export default function MenuItem({ label, items }: MenuItemProps) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleMouseEnter = () => {
		setIsOpen(true);
	};

	const handleMouseLeave = () => {
		setIsOpen(false);
	};

	const handleItemClick = (callback?: () => void) => {
		if (callback) {
			callback();
		}
		setIsOpen(false);
	};

	// 메뉴 외부 클릭 시 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<div className={`px-2 py-0.5 rounded-md cursor-default ${isOpen ? "bg-blue-500 text-white" : "hover:bg-gray-200/50"}`}>{label}</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -5 }}
						transition={{ duration: 0.1 }}
						className="absolute top-full left-0 mt-0.5 bg-white/90 backdrop-blur-md shadow-lg rounded-md py-1 min-w-[200px] z-50"
						style={{ transformOrigin: "top" }}
					>
						{items.map((item) => (
							<React.Fragment key={item.id}>
								{item.separator ? (
									<div className="h-px bg-gray-200 my-1 mx-2" />
								) : (
									<div
										className={`px-4 py-1 flex justify-between items-center ${item.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-500 hover:text-white cursor-default"}`}
										onClick={() => !item.disabled && handleItemClick(item.onClick)}
									>
										<span>{item.label}</span>
										{item.shortcut && <span className="text-xs text-gray-500 ml-4">{item.shortcut}</span>}
									</div>
								)}
							</React.Fragment>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
