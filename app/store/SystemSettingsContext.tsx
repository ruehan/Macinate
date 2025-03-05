import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

// 시스템 설정 타입 정의
export interface SystemSettings {
	// 테마 설정
	theme: "light" | "dark" | "auto";

	// 배경화면 설정
	wallpaper: string;

	// 독 설정
	dock: {
		size: number; // 독 크기 (50-100)
		magnification: boolean; // 확대 효과 사용 여부
		magnificationLevel: number; // 확대 레벨 (1-2)
		position: "bottom" | "left" | "right"; // 독 위치
		autohide: boolean; // 자동 숨김 여부
	};
}

// 초기 시스템 설정
const defaultSettings: SystemSettings = {
	theme: "light",
	wallpaper: "/wallpaper.jpg",
	dock: {
		size: 60,
		magnification: true,
		magnificationLevel: 1.5,
		position: "bottom",
		autohide: false,
	},
};

// 로컬 스토리지에서 설정 불러오기
const loadInitialSettings = (): SystemSettings => {
	try {
		const savedSettings = localStorage.getItem("systemSettings");
		if (savedSettings) {
			return JSON.parse(savedSettings) as SystemSettings;
		}
	} catch (error) {
		console.error("설정을 불러오는 중 오류가 발생했습니다:", error);
	}
	return defaultSettings;
};

// 액션 타입 정의
type SystemSettingsAction =
	| { type: "SET_THEME"; payload: "light" | "dark" | "auto" }
	| { type: "SET_WALLPAPER"; payload: string }
	| { type: "SET_DOCK_SIZE"; payload: number }
	| { type: "SET_DOCK_MAGNIFICATION"; payload: boolean }
	| { type: "SET_DOCK_MAGNIFICATION_LEVEL"; payload: number }
	| { type: "SET_DOCK_POSITION"; payload: "bottom" | "left" | "right" }
	| { type: "SET_DOCK_AUTOHIDE"; payload: boolean }
	| { type: "RESET_SETTINGS" }
	| { type: "LOAD_SETTINGS"; payload: SystemSettings };

// 리듀서 함수
const systemSettingsReducer = (state: SystemSettings, action: SystemSettingsAction): SystemSettings => {
	switch (action.type) {
		case "SET_THEME":
			return { ...state, theme: action.payload };
		case "SET_WALLPAPER":
			return { ...state, wallpaper: action.payload };
		case "SET_DOCK_SIZE":
			return { ...state, dock: { ...state.dock, size: action.payload } };
		case "SET_DOCK_MAGNIFICATION":
			return { ...state, dock: { ...state.dock, magnification: action.payload } };
		case "SET_DOCK_MAGNIFICATION_LEVEL":
			return { ...state, dock: { ...state.dock, magnificationLevel: action.payload } };
		case "SET_DOCK_POSITION":
			return { ...state, dock: { ...state.dock, position: action.payload } };
		case "SET_DOCK_AUTOHIDE":
			return { ...state, dock: { ...state.dock, autohide: action.payload } };
		case "RESET_SETTINGS":
			return defaultSettings;
		case "LOAD_SETTINGS":
			return action.payload;
		default:
			return state;
	}
};

// Context 생성
interface SystemSettingsContextType {
	state: SystemSettings;
	setTheme: (theme: "light" | "dark" | "auto") => void;
	setWallpaper: (wallpaper: string) => void;
	setDockSize: (size: number) => void;
	setDockMagnification: (enabled: boolean) => void;
	setDockMagnificationLevel: (level: number) => void;
	setDockPosition: (position: "bottom" | "left" | "right") => void;
	setDockAutohide: (enabled: boolean) => void;
	resetSettings: () => void;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

// Provider 컴포넌트
interface SystemSettingsProviderProps {
	children: ReactNode;
}

export function SystemSettingsProvider({ children }: SystemSettingsProviderProps) {
	// 로컬 스토리지에서 초기 설정 불러오기
	const initialSettings = loadInitialSettings();
	const [state, dispatch] = useReducer(systemSettingsReducer, initialSettings);

	// 설정 변경 시 로컬 스토리지에 저장
	useEffect(() => {
		try {
			localStorage.setItem("systemSettings", JSON.stringify(state));
		} catch (error) {
			console.error("설정을 저장하는 중 오류가 발생했습니다:", error);
		}
	}, [state]);

	// 테마 변경 시 HTML 클래스 업데이트
	useEffect(() => {
		const htmlElement = document.documentElement;

		if (state.theme === "dark") {
			htmlElement.classList.add("dark");
			htmlElement.classList.remove("light");
		} else if (state.theme === "light") {
			htmlElement.classList.add("light");
			htmlElement.classList.remove("dark");
		} else if (state.theme === "auto") {
			// 시스템 설정에 따라 자동 변경
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			if (prefersDark) {
				htmlElement.classList.add("dark");
				htmlElement.classList.remove("light");
			} else {
				htmlElement.classList.add("light");
				htmlElement.classList.remove("dark");
			}
		}
	}, [state.theme]);

	// 액션 함수들
	const setTheme = (theme: "light" | "dark" | "auto") => {
		dispatch({ type: "SET_THEME", payload: theme });
	};

	const setWallpaper = (wallpaper: string) => {
		dispatch({ type: "SET_WALLPAPER", payload: wallpaper });
	};

	const setDockSize = (size: number) => {
		dispatch({ type: "SET_DOCK_SIZE", payload: size });
	};

	const setDockMagnification = (enabled: boolean) => {
		dispatch({ type: "SET_DOCK_MAGNIFICATION", payload: enabled });
	};

	const setDockMagnificationLevel = (level: number) => {
		dispatch({ type: "SET_DOCK_MAGNIFICATION_LEVEL", payload: level });
	};

	const setDockPosition = (position: "bottom" | "left" | "right") => {
		dispatch({ type: "SET_DOCK_POSITION", payload: position });
	};

	const setDockAutohide = (enabled: boolean) => {
		dispatch({ type: "SET_DOCK_AUTOHIDE", payload: enabled });
	};

	const resetSettings = () => {
		dispatch({ type: "RESET_SETTINGS" });
	};

	return (
		<SystemSettingsContext.Provider
			value={{
				state,
				setTheme,
				setWallpaper,
				setDockSize,
				setDockMagnification,
				setDockMagnificationLevel,
				setDockPosition,
				setDockAutohide,
				resetSettings,
			}}
		>
			{children}
		</SystemSettingsContext.Provider>
	);
}

// 커스텀 훅
export function useSystemSettings() {
	const context = useContext(SystemSettingsContext);
	if (context === undefined) {
		throw new Error("useSystemSettings must be used within a SystemSettingsProvider");
	}
	return context;
}
