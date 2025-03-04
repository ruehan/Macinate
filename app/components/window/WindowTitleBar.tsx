import React from "react";

interface WindowTitleBarProps {
	title: string;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	isFocused: boolean;
	appIcon?: string;
}

export default function WindowTitleBar({ title, onClose, onMinimize, onMaximize, isFocused, appIcon }: WindowTitleBarProps) {
	// 창 제어 버튼 투명도 설정 (포커스 여부에 따라)
	const buttonOpacity = isFocused ? "opacity-100" : "opacity-50";

	return (
		<div className="h-7 flex items-center justify-center relative select-none" onDoubleClick={onMaximize}>
			{/* 창 제어 버튼 */}
			<div className="absolute left-2 flex items-center space-x-2">
				{/* 닫기 버튼 */}
				<button className={`w-3 h-3 rounded-full bg-macos-button-close ${buttonOpacity} hover:opacity-100 flex items-center justify-center`} onClick={onClose}>
					{isFocused && (
						<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100">
							<path d="M1 1L5 5M1 5L5 1" stroke="#750000" strokeWidth="1" strokeLinecap="round" />
						</svg>
					)}
				</button>

				{/* 최소화 버튼 */}
				<button className={`w-3 h-3 rounded-full bg-macos-button-minimize ${buttonOpacity} hover:opacity-100 flex items-center justify-center`} onClick={onMinimize}>
					{isFocused && (
						<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100">
							<path d="M1 3H5" stroke="#5A3E00" strokeWidth="1" strokeLinecap="round" />
						</svg>
					)}
				</button>

				{/* 최대화 버튼 */}
				<button className={`w-3 h-3 rounded-full bg-macos-button-maximize ${buttonOpacity} hover:opacity-100 flex items-center justify-center`} onClick={onMaximize}>
					{isFocused && (
						<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100">
							<path d="M1 2.5V1.5C1 1.22386 1.22386 1 1.5 1H4.5C4.77614 1 5 1.22386 5 1.5V4.5C5 4.77614 4.77614 5 4.5 5H3.5" stroke="#003605" strokeWidth="1" strokeLinecap="round" />
							<rect x="1" y="2.5" width="2.5" height="2.5" rx="0.5" stroke="#003605" strokeWidth="1" />
						</svg>
					)}
				</button>
			</div>

			{/* 창 제목 */}
			<div className="flex items-center text-xs font-medium text-gray-700">
				{appIcon && <img src={appIcon} alt={title} className="w-4 h-4 mr-1.5" />}
				{title}
			</div>
		</div>
	);
}
