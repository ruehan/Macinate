import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindow } from "~/store/WindowContext";
import NotesApp from "~/components/apps/NotesApp";
import SettingsApp from "~/components/apps/SettingsApp";

interface SpotlightProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function Spotlight({ isOpen, onClose }: SpotlightProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);
	const { openWindow } = useWindow();

	useEffect(() => {
		if (searchTerm.trim() === "") {
			setSearchResults([]);
			return;
		}

		const results = performSearch(searchTerm);
		setSearchResults(results);
	}, [searchTerm]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	const performSearch = (term: string) => {
		const lowerTerm = term.toLowerCase();

		const apps = [
			{ id: "finder", title: "Finder", type: "app", icon: "/icons/finder.svg" },
			{ id: "notes", title: "Notes", type: "app", icon: "/icons/notes.svg" },
			{ id: "calculator", title: "Calculator", type: "app", icon: "/icons/calculator.svg" },
			{ id: "welcome", title: "Welcome", type: "app", icon: "/icons/welcome.svg" },
			{ id: "settings", title: "System Settings", type: "app", icon: "/icons/settings.svg" },
		].filter((app) => app.title.toLowerCase().includes(lowerTerm));

		const settings = [
			{ id: "display", title: "Display Settings", type: "setting", icon: "/icons/settings.svg" },
			{ id: "sound", title: "Sound Settings", type: "setting", icon: "/icons/settings.svg" },
			{ id: "dock", title: "Dock Settings", type: "setting", icon: "/icons/settings.svg" },
			{ id: "wallpaper", title: "Wallpaper Settings", type: "setting", icon: "/icons/settings.svg" },
		].filter((setting) => setting.title.toLowerCase().includes(lowerTerm));

		const notes: any[] = [];
		try {
			const storedNotes = localStorage.getItem("notes");
			if (storedNotes) {
				const parsedNotes = JSON.parse(storedNotes);
				const filteredNotes = parsedNotes.filter((note: any) => note.title.toLowerCase().includes(lowerTerm) || note.content.toLowerCase().includes(lowerTerm));

				filteredNotes.forEach((note: any) => {
					notes.push({
						id: note.id,
						title: note.title || "Untitled Note",
						type: "note",
						icon: "/icons/notes.svg",
						preview: note.content.substring(0, 50) + (note.content.length > 50 ? "..." : ""),
					});
				});
			}
		} catch (error) {
			console.error("Error searching notes:", error);
		}

		return [...apps, ...settings, ...notes];
	};

	const handleResultClick = (result: any) => {
		switch (result.type) {
			case "app":
				openApp(result.id);
				break;
			case "note":
				openNoteApp(result.id);
				break;
			case "setting":
				openSettingsApp(result.id);
				break;
		}
		onClose();
	};

	// 앱 열기
	const openApp = (appId: string) => {
		// 앱 ID에 따라 적절한 앱 열기
		switch (appId) {
			case "notes":
				openWindow({
					id: "notes",
					title: "Notes",
					content: <NotesApp />,
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 100, y: 50 },
					size: { width: 600, height: 400 },
					appIcon: "/icons/notes.svg",
				});
				break;
			case "settings":
				openWindow({
					id: "settings",
					title: "System Settings",
					content: <SettingsApp />,
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 100, y: 50 },
					size: { width: 700, height: 500 },
					appIcon: "/icons/settings.svg",
				});
				break;
			case "calculator":
				openWindow({
					id: "calculator",
					title: "Calculator",
					content: <div>Calculator App</div>, // 실제 Calculator 컴포넌트로 교체 필요
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 150, y: 100 },
					size: { width: 300, height: 400 },
					appIcon: "/icons/calculator.svg",
				});
				break;
			case "finder":
				openWindow({
					id: "finder",
					title: "Finder",
					content: <div>Finder App</div>, // 실제 Finder 컴포넌트로 교체 필요
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 200, y: 150 },
					size: { width: 700, height: 500 },
					appIcon: "/icons/finder.svg",
				});
				break;
			case "welcome":
				openWindow({
					id: "welcome",
					title: "Welcome to Macinate",
					content: <div>Welcome App</div>, // 실제 Welcome 컴포넌트로 교체 필요
					isOpen: true,
					isMinimized: false,
					isMaximized: false,
					position: { x: 100, y: 50 },
					size: { width: 600, height: 400 },
					appIcon: "/icons/welcome.svg",
				});
				break;
		}
	};

	const openNoteApp = (noteId: string) => {
		openWindow({
			id: "notes",
			title: "Notes",
			content: <NotesApp />,
			isOpen: true,
			isMinimized: false,
			isMaximized: false,
			position: { x: 100, y: 50 },
			size: { width: 600, height: 400 },
			appIcon: "/icons/notes.svg",
		});
	};

	const openSettingsApp = (settingId: string) => {
		openWindow({
			id: "settings",
			title: "System Settings",
			content: <SettingsApp />,
			isOpen: true,
			isMinimized: false,
			isMaximized: false,
			position: { x: 150, y: 100 },
			size: { width: 700, height: 500 },
			appIcon: "/icons/settings.svg",
		});
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* 배경 오버레이 */}
					<motion.div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

					{/* Spotlight 검색창 */}
					<motion.div
						className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-[600px] bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-50"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ type: "spring", damping: 25 }}
					>
						{/* 검색 입력창 */}
						<div className="flex items-center p-4 border-b border-gray-200">
							<svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							<input
								ref={inputRef}
								type="text"
								className="w-full bg-transparent outline-none text-lg"
								placeholder="Spotlight 검색..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						{/* 검색 결과 */}
						<div className="max-h-[400px] overflow-y-auto">
							{searchResults.length > 0 ? (
								<div className="p-2">
									{searchResults.map((result, index) => (
										<div key={`${result.type}-${result.id}-${index}`} className="flex items-center p-3 rounded-lg hover:bg-gray-200/50 cursor-pointer" onClick={() => handleResultClick(result)}>
											<img src={result.icon} alt={result.title} className="w-8 h-8 mr-3" />
											<div>
												<div className="font-medium">{result.title}</div>
												{result.preview && <div className="text-sm text-gray-500">{result.preview}</div>}
												<div className="text-xs text-gray-400">{result.type === "app" ? "애플리케이션" : result.type === "note" ? "메모" : "설정"}</div>
											</div>
										</div>
									))}
								</div>
							) : searchTerm.trim() !== "" ? (
								<div className="p-8 text-center text-gray-500">검색 결과가 없습니다.</div>
							) : (
								<div className="p-8 text-center text-gray-500">검색어를 입력하세요.</div>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
