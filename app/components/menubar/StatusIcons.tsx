import React from "react";

interface StatusIconsProps {
	currentTime: string;
}

export default function StatusIcons({ currentTime }: StatusIconsProps) {
	return (
		<div className="flex items-center space-x-3">
			{/* 배터리 아이콘 */}
			<div className="flex items-center">
				<svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="0.5" y="0.5" width="18" height="9" rx="1.5" stroke="black" />
					<rect x="2" y="2" width="15" height="6" rx="1" fill="black" />
					<path d="M20 3.5V6.5C20.8333 6.1667 21.2667 5.5 21.2667 5C21.2667 4.5 20.8333 3.8333 20 3.5Z" fill="black" />
				</svg>
			</div>

			{/* Wi-Fi 아이콘 */}
			<div>
				<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M7.99967 2.83333C9.84967 2.83333 11.5997 3.48333 12.9163 4.63333L13.8163 3.73333C12.2163 2.36667 10.1997 1.5 7.99967 1.5C5.79967 1.5 3.78301 2.36667 2.18301 3.73333L3.08301 4.63333C4.39967 3.48333 6.14967 2.83333 7.99967 2.83333Z"
						fill="black"
					/>
					<path
						d="M7.99967 6.83333C8.92634 6.83333 9.79301 7.16667 10.4997 7.73333L11.3997 6.83333C10.4163 6.06667 9.24967 5.5 7.99967 5.5C6.74967 5.5 5.58301 6.03333 4.59967 6.83333L5.49967 7.73333C6.20634 7.16667 7.07301 6.83333 7.99967 6.83333Z"
						fill="black"
					/>
					<path d="M9.08301 8.93333L7.99967 10L6.91634 8.93333C7.24967 8.7 7.61634 8.5 7.99967 8.5C8.38301 8.5 8.74967 8.66667 9.08301 8.93333Z" fill="black" />
				</svg>
			</div>

			{/* 시간 표시 */}
			<div className="font-medium">{currentTime}</div>
		</div>
	);
}
