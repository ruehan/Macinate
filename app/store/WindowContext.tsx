import React, { createContext, useContext, useReducer, ReactNode } from "react";

// 창 타입 정의
export interface Window {
	id: string;
	title: string;
	content: ReactNode;
	isOpen: boolean;
	isFocused: boolean;
	isMinimized: boolean;
	isMaximized: boolean;
	position: { x: number; y: number };
	size: { width: number; height: number };
	zIndex: number;
	appIcon?: string;
	previousPosition?: { x: number; y: number }; // 최대화 전 위치
	previousSize?: { width: number; height: number }; // 최대화 전 크기
}

// 상태 타입 정의
interface WindowState {
	windows: Window[];
	highestZIndex: number;
	focusedWindowId: string | null;
}

// 액션 타입 정의
type WindowAction =
	| { type: "OPEN_WINDOW"; payload: Omit<Window, "zIndex" | "isFocused"> }
	| { type: "CLOSE_WINDOW"; payload: { id: string } }
	| { type: "FOCUS_WINDOW"; payload: { id: string } }
	| { type: "MINIMIZE_WINDOW"; payload: { id: string } }
	| { type: "MAXIMIZE_WINDOW"; payload: { id: string } }
	| { type: "RESTORE_WINDOW"; payload: { id: string } }
	| { type: "MOVE_WINDOW"; payload: { id: string; position: { x: number; y: number } } }
	| { type: "RESIZE_WINDOW"; payload: { id: string; size: { width: number; height: number } } };

// 초기 상태
const initialState: WindowState = {
	windows: [],
	highestZIndex: 0,
	focusedWindowId: null,
};

// 리듀서 함수
const windowReducer = (state: WindowState, action: WindowAction): WindowState => {
	switch (action.type) {
		case "OPEN_WINDOW": {
			const newZIndex = state.highestZIndex + 1;
			const newWindow: Window = {
				...action.payload,
				zIndex: newZIndex,
				isFocused: true,
			};

			// 기존 창들의 포커스 해제
			const updatedWindows = state.windows.map((window) => ({
				...window,
				isFocused: false,
			}));

			return {
				...state,
				windows: [...updatedWindows, newWindow],
				highestZIndex: newZIndex,
				focusedWindowId: newWindow.id,
			};
		}

		case "CLOSE_WINDOW": {
			const updatedWindows = state.windows.filter((window) => window.id !== action.payload.id);

			// 닫은 창이 포커스된 창이었다면 가장 높은 zIndex를 가진 창에 포커스
			let newFocusedWindowId = state.focusedWindowId;
			if (state.focusedWindowId === action.payload.id) {
				const topWindow = [...updatedWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
				newFocusedWindowId = topWindow ? topWindow.id : null;

				// 포커스된 창 업데이트
				updatedWindows.forEach((window) => {
					if (window.id === newFocusedWindowId) {
						window.isFocused = true;
					}
				});
			}

			return {
				...state,
				windows: updatedWindows,
				focusedWindowId: newFocusedWindowId,
			};
		}

		case "FOCUS_WINDOW": {
			const newZIndex = state.highestZIndex + 1;

			const updatedWindows = state.windows.map((window) => ({
				...window,
				isFocused: window.id === action.payload.id,
				zIndex: window.id === action.payload.id ? newZIndex : window.zIndex,
			}));

			return {
				...state,
				windows: updatedWindows,
				highestZIndex: newZIndex,
				focusedWindowId: action.payload.id,
			};
		}

		case "MINIMIZE_WINDOW": {
			const updatedWindows = state.windows.map((window) => {
				if (window.id === action.payload.id) {
					return { ...window, isMinimized: true, isFocused: false };
				}
				return window;
			});

			// 최소화된 창이 포커스된 창이었다면 다음 창에 포커스
			let newFocusedWindowId = state.focusedWindowId;
			if (state.focusedWindowId === action.payload.id) {
				const visibleWindows = updatedWindows.filter((w) => !w.isMinimized);
				const topWindow = [...visibleWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
				newFocusedWindowId = topWindow ? topWindow.id : null;

				// 포커스된 창 업데이트
				updatedWindows.forEach((window) => {
					if (window.id === newFocusedWindowId) {
						window.isFocused = true;
					}
				});
			}

			return {
				...state,
				windows: updatedWindows,
				focusedWindowId: newFocusedWindowId,
			};
		}

		case "MAXIMIZE_WINDOW": {
			const updatedWindows = state.windows.map((window) => {
				if (window.id === action.payload.id) {
					return {
						...window,
						isMaximized: true,
						isFocused: true,
						// 현재 위치와 크기를 저장
						previousPosition: { ...window.position },
						previousSize: { ...window.size },
					};
				}
				return { ...window, isFocused: false };
			});

			return {
				...state,
				windows: updatedWindows,
				focusedWindowId: action.payload.id,
			};
		}

		case "RESTORE_WINDOW": {
			const updatedWindows = state.windows.map((window) => {
				if (window.id === action.payload.id) {
					return {
						...window,
						isMinimized: false,
						isMaximized: false,
						isFocused: true,
						// 저장된 위치와 크기로 복원
						position: window.previousPosition || window.position,
						size: window.previousSize || window.size,
					};
				}
				return { ...window, isFocused: false };
			});

			return {
				...state,
				windows: updatedWindows,
				focusedWindowId: action.payload.id,
			};
		}

		case "MOVE_WINDOW": {
			const updatedWindows = state.windows.map((window) => {
				if (window.id === action.payload.id) {
					return { ...window, position: action.payload.position };
				}
				return window;
			});

			return {
				...state,
				windows: updatedWindows,
			};
		}

		case "RESIZE_WINDOW": {
			const updatedWindows = state.windows.map((window) => {
				if (window.id === action.payload.id) {
					return { ...window, size: action.payload.size };
				}
				return window;
			});

			return {
				...state,
				windows: updatedWindows,
			};
		}

		default:
			return state;
	}
};

// Context 생성
interface WindowContextType {
	state: WindowState;
	openWindow: (window: Omit<Window, "zIndex" | "isFocused">) => void;
	closeWindow: (id: string) => void;
	focusWindow: (id: string) => void;
	minimizeWindow: (id: string) => void;
	maximizeWindow: (id: string) => void;
	restoreWindow: (id: string) => void;
	moveWindow: (id: string, position: { x: number; y: number }) => void;
	resizeWindow: (id: string, size: { width: number; height: number }) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

// Provider 컴포넌트
export function WindowProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(windowReducer, initialState);

	const openWindow = (window: Omit<Window, "zIndex" | "isFocused">) => {
		dispatch({ type: "OPEN_WINDOW", payload: window });
	};

	const closeWindow = (id: string) => {
		dispatch({ type: "CLOSE_WINDOW", payload: { id } });
	};

	const focusWindow = (id: string) => {
		dispatch({ type: "FOCUS_WINDOW", payload: { id } });
	};

	const minimizeWindow = (id: string) => {
		dispatch({ type: "MINIMIZE_WINDOW", payload: { id } });
	};

	const maximizeWindow = (id: string) => {
		dispatch({ type: "MAXIMIZE_WINDOW", payload: { id } });
	};

	const restoreWindow = (id: string) => {
		dispatch({ type: "RESTORE_WINDOW", payload: { id } });
	};

	const moveWindow = (id: string, position: { x: number; y: number }) => {
		dispatch({ type: "MOVE_WINDOW", payload: { id, position } });
	};

	const resizeWindow = (id: string, size: { width: number; height: number }) => {
		dispatch({ type: "RESIZE_WINDOW", payload: { id, size } });
	};

	return (
		<WindowContext.Provider
			value={{
				state,
				openWindow,
				closeWindow,
				focusWindow,
				minimizeWindow,
				maximizeWindow,
				restoreWindow,
				moveWindow,
				resizeWindow,
			}}
		>
			{children}
		</WindowContext.Provider>
	);
}

// 커스텀 훅
export function useWindow() {
	const context = useContext(WindowContext);
	if (context === undefined) {
		throw new Error("useWindow must be used within a WindowProvider");
	}
	return context;
}
