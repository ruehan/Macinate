import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubMenuItem } from "./MenuItem";

interface AppleMenuProps {
	onItemClick?: (action: string) => void;
}

export default function AppleMenu({ onItemClick }: AppleMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleItemClick = (action: string) => {
		if (onItemClick) {
			onItemClick(action);
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

	const appleMenuItems: SubMenuItem[] = [
		{ id: "about", label: "이 Mac에 관하여", onClick: () => handleItemClick("about") },
		{ id: "separator1", separator: true },
		{ id: "preferences", label: "시스템 환경설정...", onClick: () => handleItemClick("preferences") },
		{ id: "appstore", label: "App Store...", onClick: () => handleItemClick("appstore") },
		{ id: "separator2", separator: true },
		{ id: "sleep", label: "잠자기", onClick: () => handleItemClick("sleep") },
		{ id: "restart", label: "재시동...", onClick: () => handleItemClick("restart") },
		{ id: "shutdown", label: "시스템 종료...", onClick: () => handleItemClick("shutdown") },
		{ id: "separator3", separator: true },
		{ id: "logout", label: "로그아웃...", shortcut: "⇧⌘Q", onClick: () => handleItemClick("logout") },
	];

	return (
		<div ref={menuRef} className="relative">
			<div className={`w-5 h-5 flex items-center justify-center cursor-default ${isOpen ? "bg-blue-500 text-white rounded-md" : ""}`} onClick={handleClick}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
					<path
						fillRule="evenodd"
						d="M12.786 1.072C11.188.752 9.084 1.636 7.646 3.08c-1.536 1.456-2.256 3.464-2.096 5.472.144 1.84 1.352 3.8 3.228 4.736-.56 1.696-1.404 3.384-2.496 4.488 1.136.56 2.64.968 4.132.68 1.536-.288 2.88-1.104 3.456-2.4.352-.8.352-1.744.352-2.6v-.56c1.536-.16 3.04-.752 3.996-1.96 1.056-1.344 1.376-3.2 1.224-5.08-.144-1.76-1.48-3.4-3.228-4.24-1.352-.656-2.784-.784-3.428-.544ZM7.648 19.604c-.224.096-.4.24-.4.24-.944.656-1.904 1.392-3.08 1.944.56-1.16 1.144-2.208 1.712-3.368l.24-.448c.16-.32.288-.656.368-1.008.4.304.832.544 1.296.752l.4.176c-.224.56-.368 1.12-.536 1.712Zm5.064-1.648c-.736.144-1.52.224-2.4.048-.72-.144-1.456-.416-2.128-.832 1.984-.656 3.808-1.76 5.328-3.368 1.008-1.072 1.824-2.32 2.336-3.68.336.176.656.368.928.592.864.736 1.584 1.832 1.76 3.064.224 1.536-.304 2.64-.992 3.424-.72.8-1.728 1.28-2.8 1.52-.656.144-1.376.192-2.032.232Z"
						clipRule="evenodd"
					/>
				</svg>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -5 }}
						transition={{ duration: 0.1 }}
						className="absolute top-full left-0 mt-0.5 bg-white/90 backdrop-blur-md shadow-lg rounded-md py-1 min-w-[220px] z-50"
						style={{ transformOrigin: "top" }}
					>
						{appleMenuItems.map((item) => (
							<React.Fragment key={item.id}>
								{item.separator ? (
									<div className="h-px bg-gray-200 my-1 mx-2" />
								) : (
									<div
										className={`px-4 py-1 flex justify-between items-center ${item.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-500 hover:text-white cursor-default"}`}
										onClick={item.onClick}
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
