import React from "react";
import { useWindow } from "~/store/WindowContext";
import WindowFrame from "./WindowFrame";

export default function WindowManager() {
	const { state, closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, moveWindow, resizeWindow } = useWindow();

	return (
		<div className="absolute inset-0 overflow-hidden">
			{state.windows.map((window) => (
				<WindowFrame
					key={window.id}
					window={window}
					onClose={() => closeWindow(window.id)}
					onMinimize={() => minimizeWindow(window.id)}
					onMaximize={() => {
						if (window.isMaximized) {
							restoreWindow(window.id);
						} else {
							maximizeWindow(window.id);
						}
					}}
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
