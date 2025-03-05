import React from "react";
import { useWindow } from "~/store/WindowContext";
import WindowFrame from "./WindowFrame";

export default function WindowManager() {
	const { state, closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, moveWindow, resizeWindow } = useWindow();

	// 최대화/복원 토글 함수
	const toggleMaximize = (windowId: string, isMaximized: boolean) => {
		if (isMaximized) {
			restoreWindow(windowId);
		} else {
			maximizeWindow(windowId);
		}
	};

	return (
		<div className="absolute inset-0 overflow-hidden">
			{state.windows.map((window) => (
				<WindowFrame
					key={window.id}
					window={window}
					onClose={() => closeWindow(window.id)}
					onMinimize={() => minimizeWindow(window.id)}
					onMaximize={() => toggleMaximize(window.id, window.isMaximized)}
					onFocus={() => focusWindow(window.id)}
					onMove={(position) => moveWindow(window.id, position)}
					onResize={(size) => resizeWindow(window.id, size)}
				>
					{window.content}
				</WindowFrame>
			))}
		</div>
	);
}
