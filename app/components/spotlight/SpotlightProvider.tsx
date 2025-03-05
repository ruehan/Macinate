import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Spotlight from "./Spotlight";

interface SpotlightContextType {
	isSpotlightOpen: boolean;
	openSpotlight: () => void;
	closeSpotlight: () => void;
	toggleSpotlight: () => void;
}

const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

export const useSpotlight = () => {
	const context = useContext(SpotlightContext);
	if (!context) {
		throw new Error("useSpotlight must be used within a SpotlightProvider");
	}
	return context;
};

interface SpotlightProviderProps {
	children: ReactNode;
}

export default function SpotlightProvider({ children }: SpotlightProviderProps) {
	const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

	const openSpotlight = () => setIsSpotlightOpen(true);
	const closeSpotlight = () => setIsSpotlightOpen(false);
	const toggleSpotlight = () => setIsSpotlightOpen((prev) => !prev);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// macOS: Cmd+Space, Windows/Linux: Ctrl+Space
			if ((e.metaKey || e.ctrlKey) && e.key === " ") {
				e.preventDefault(); // 기본 동작 방지
				toggleSpotlight();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<SpotlightContext.Provider value={{ isSpotlightOpen, openSpotlight, closeSpotlight, toggleSpotlight }}>
			{children}
			<Spotlight isOpen={isSpotlightOpen} onClose={closeSpotlight} />
		</SpotlightContext.Provider>
	);
}
