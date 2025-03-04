import React, { useState, useEffect } from "react";
import { FiFolder, FiFile, FiHome, FiHardDrive, FiDownload, FiCloud } from "react-icons/fi";
import { useFileSystem, FileSystemItem } from "~/store/FileSystemContext";

// 사이드바 아이템 타입 정의
interface SidebarItem {
	id: string;
	name: string;
	icon: React.ReactNode;
	path: string;
}

export default function FinderApp() {
	const { state, getItemsByPath, setCurrentPath, getItemById, deleteItem, renameItem } = useFileSystem();
	const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>("home");
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const [currentItems, setCurrentItems] = useState<FileSystemItem[]>([]);
	const [pathHistory, setPathHistory] = useState<string[]>([state.currentPath]);
	const [historyIndex, setHistoryIndex] = useState<number>(0);

	const sidebarItems: SidebarItem[] = [
		{ id: "favorites", name: "즐겨찾기", icon: null, path: "" },
		{ id: "home", name: "홈", icon: <FiHome className="text-blue-500" />, path: "/" },
		{ id: "desktop", name: "데스크탑", icon: <FiFolder className="text-blue-500" />, path: "/Desktop" },
		{ id: "documents", name: "문서", icon: <FiFolder className="text-blue-500" />, path: "/Documents" },
		{ id: "downloads", name: "다운로드", icon: <FiDownload className="text-blue-500" />, path: "/Downloads" },
		{ id: "locations", name: "위치", icon: null, path: "" },
		{ id: "macintosh", name: "Macintosh HD", icon: <FiHardDrive className="text-gray-500" />, path: "/" },
		{ id: "icloud", name: "iCloud", icon: <FiCloud className="text-blue-400" />, path: "/iCloud" },
	];

	useEffect(() => {
		const items = getItemsByPath(state.currentPath);
		setCurrentItems(items);
	}, [state.currentPath, getItemsByPath]);

	const navigateTo = (path: string) => {
		if (path !== state.currentPath) {
			const newHistory = pathHistory.slice(0, historyIndex + 1);
			newHistory.push(path);
			setPathHistory(newHistory);
			setHistoryIndex(newHistory.length - 1);
			setCurrentPath(path);
		}
	};

	const goBack = () => {
		if (historyIndex > 0) {
			setHistoryIndex(historyIndex - 1);
			setCurrentPath(pathHistory[historyIndex - 1]);
		}
	};
	const goForward = () => {
		if (historyIndex < pathHistory.length - 1) {
			setHistoryIndex(historyIndex + 1);
			setCurrentPath(pathHistory[historyIndex + 1]);
		}
	};

	const formatFileSize = (bytes?: number): string => {
		if (bytes === undefined) return "-";
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
		return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
	};

	const formatDate = (date: Date): string => {
		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleItemDoubleClick = (item: FileSystemItem) => {
		if (item.type === "folder") {
			const newPath = state.currentPath === "/" ? `/${item.name}` : `${state.currentPath}/${item.name}`;
			navigateTo(newPath);
		} else {
			console.log("파일 열기:", item.name);
		}
	};

	return (
		<div className="flex flex-col h-full bg-white">
			{/* 툴바 */}
			<div className="h-10 border-b flex items-center px-4 bg-gray-100">
				<button className={`mr-2 p-1 rounded ${historyIndex > 0 ? "hover:bg-gray-200 text-gray-800" : "text-gray-400"}`} onClick={goBack} disabled={historyIndex <= 0}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
				<button
					className={`mr-4 p-1 rounded ${historyIndex < pathHistory.length - 1 ? "hover:bg-gray-200 text-gray-800" : "text-gray-400"}`}
					onClick={goForward}
					disabled={historyIndex >= pathHistory.length - 1}
				>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
				<div className="text-sm font-medium">{state.currentPath}</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* 사이드바 */}
				<div className="w-48 border-r overflow-y-auto bg-gray-50">
					{sidebarItems.map((item) => (
						<React.Fragment key={item.id}>
							{!item.icon ? (
								<div className="px-4 py-1 text-xs text-gray-500 font-medium mt-2">{item.name}</div>
							) : (
								<div
									className={`px-4 py-1.5 flex items-center text-sm cursor-pointer ${selectedSidebarItem === item.id ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
									onClick={() => {
										setSelectedSidebarItem(item.id);
										if (item.path) {
											navigateTo(item.path);
										}
									}}
								>
									<span className="mr-2">{item.icon}</span>
									{item.name}
								</div>
							)}
						</React.Fragment>
					))}
				</div>

				{/* 파일 보기 영역 */}
				<div className="flex-1 overflow-y-auto">
					<div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-4 py-2 text-xs font-medium text-gray-500 border-b">
						<div className="pl-8">이름</div>
						<div>종류</div>
						<div>크기</div>
						<div>수정된 날짜</div>
					</div>

					{currentItems.map((item) => (
						<div
							key={item.id}
							className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-4 py-1.5 text-sm border-b border-gray-100 cursor-pointer ${selectedItem === item.id ? "bg-blue-100" : "hover:bg-gray-50"}`}
							onClick={() => setSelectedItem(item.id)}
							onDoubleClick={() => handleItemDoubleClick(item)}
						>
							<div className="flex items-center">
								<span className="mr-2">{item.type === "folder" ? <FiFolder className="text-blue-500" size={18} /> : <FiFile className="text-gray-500" size={18} />}</span>
								{item.name}
							</div>
							<div className="text-gray-500">{item.type === "folder" ? "폴더" : item.name.split(".").pop()?.toUpperCase() + " 파일"}</div>
							<div className="text-gray-500">{formatFileSize(item.size)}</div>
							<div className="text-gray-500">{formatDate(item.modifiedAt)}</div>
						</div>
					))}
				</div>
			</div>

			{/* 상태 표시줄 */}
			<div className="h-6 border-t bg-gray-50 text-xs text-gray-500 px-4 flex items-center">{currentItems.length}개 항목</div>
		</div>
	);
}
