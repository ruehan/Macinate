import React, { useState, useEffect, useRef } from "react";
import {
	FiFolder,
	FiFile,
	FiHome,
	FiHardDrive,
	FiDownload,
	FiCloud,
	FiPlus,
	FiTrash2,
	FiEdit,
	FiFolderPlus,
	FiFilePlus,
	FiX,
	FiMaximize,
	FiMinimize,
	FiImage,
	FiCode,
	FiFileText,
	FiMusic,
	FiVideo,
	FiArchive,
	FiPaperclip,
	FiSearch,
} from "react-icons/fi";
import { useFileSystem, FileSystemItem } from "~/store/FileSystemContext";

interface SidebarItem {
	id: string;
	name: string;
	icon: React.ReactNode;
	path: string;
}

export default function FinderApp() {
	const { state, getItemsByPath, setCurrentPath, getItemById, deleteItem, renameItem, addItem, moveItem } = useFileSystem();
	const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>("home");
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const [currentItems, setCurrentItems] = useState<FileSystemItem[]>([]);
	const [pathHistory, setPathHistory] = useState<string[]>([state.currentPath]);
	const [historyIndex, setHistoryIndex] = useState<number>(0);

	const [contextMenu, setContextMenu] = useState<{
		visible: boolean;
		x: number;
		y: number;
		itemId: string | null;
	}>({
		visible: false,
		x: 0,
		y: 0,
		itemId: null,
	});

	const [newItemModal, setNewItemModal] = useState<{
		visible: boolean;
		type: "file" | "folder";
		name: string;
	}>({
		visible: false,
		type: "folder",
		name: "",
	});

	const [renameModal, setRenameModal] = useState<{
		visible: boolean;
		itemId: string;
		name: string;
	}>({
		visible: false,
		itemId: "",
		name: "",
	});

	const [previewPanel, setPreviewPanel] = useState<{
		visible: boolean;
		item: FileSystemItem | null;
		maximized: boolean;
	}>({
		visible: false,
		item: null,
		maximized: false,
	});

	const toolbarRef = useRef<HTMLDivElement>(null);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [searchResults, setSearchResults] = useState<FileSystemItem[]>([]);

	const [dragState, setDragState] = useState<{
		isDragging: boolean;
		draggedItemId: string | null;
		dropTargetId: string | null;
	}>({
		isDragging: false,
		draggedItemId: null,
		dropTargetId: null,
	});

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

	const closeContextMenu = () => {
		setContextMenu({ ...contextMenu, visible: false });
	};

	const handleItemContextMenu = (e: React.MouseEvent, itemId: string) => {
		e.preventDefault();
		setContextMenu({
			visible: true,
			x: e.clientX,
			y: e.clientY,
			itemId,
		});
	};

	const handleEmptyAreaContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setContextMenu({
			visible: true,
			x: e.clientX,
			y: e.clientY,
			itemId: null,
		});
	};

	const openNewItemModal = (type: "file" | "folder") => {
		setNewItemModal({
			visible: true,
			type,
			name: type === "folder" ? "새 폴더" : "새 파일.txt",
		});
		closeContextMenu();
	};

	const openRenameModal = (itemId: string) => {
		const item = getItemById(itemId);
		if (item) {
			setRenameModal({
				visible: true,
				itemId,
				name: item.name,
			});
		}
		closeContextMenu();
	};

	const handleCreateNewItem = () => {
		let parentId = "root";
		if (state.currentPath !== "/") {
			const pathParts = state.currentPath.split("/").filter(Boolean);
			let currentParentId = "root";

			for (const part of pathParts) {
				const folder = state.items.find((item) => item.parentId === currentParentId && item.name === part && item.type === "folder");
				if (folder) {
					currentParentId = folder.id;
				}
			}
			parentId = currentParentId;
		}

		addItem({
			name: newItemModal.name,
			type: newItemModal.type,
			parentId,
			size: newItemModal.type === "file" ? 0 : undefined,
			content: newItemModal.type === "file" ? "" : undefined,
		});

		setNewItemModal({ ...newItemModal, visible: false });
	};

	const handleRenameItem = () => {
		renameItem(renameModal.itemId, renameModal.name);
		setRenameModal({ ...renameModal, visible: false });
	};

	const handleDeleteItem = (itemId: string) => {
		deleteItem(itemId);
		closeContextMenu();
	};

	useEffect(() => {
		const handleClickOutside = () => {
			closeContextMenu();
		};

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleItemSelect = (itemId: string) => {
		setSelectedItem(itemId);

		const item = getItemById(itemId);
		if (item && item.type === "file") {
			setPreviewPanel({
				visible: true,
				item,
				maximized: false,
			});
		} else {
			setPreviewPanel({
				...previewPanel,
				visible: false,
				item: null,
			});
		}
	};

	const togglePreview = () => {
		setPreviewPanel({
			...previewPanel,
			visible: !previewPanel.visible,
		});
	};

	const toggleMaximizePreview = () => {
		setPreviewPanel({
			...previewPanel,
			maximized: !previewPanel.maximized,
		});
	};

	const renderFileIcon = (fileName: string) => {
		const extension = fileName.split(".").pop()?.toLowerCase();

		if (["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"].includes(extension || "")) {
			return <FiImage className="text-purple-500" size={18} />;
		}

		if (["js", "jsx", "ts", "tsx", "html", "css", "json", "py", "java", "c", "cpp", "php", "rb"].includes(extension || "")) {
			return <FiCode className="text-green-600" size={18} />;
		}

		if (["txt", "md", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv"].includes(extension || "")) {
			return <FiFileText className="text-blue-400" size={18} />;
		}

		if (["mp3", "wav", "ogg", "flac", "m4a", "aac"].includes(extension || "")) {
			return <FiMusic className="text-yellow-500" size={18} />;
		}

		if (["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(extension || "")) {
			return <FiVideo className="text-red-500" size={18} />;
		}

		if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
			return <FiArchive className="text-amber-600" size={18} />;
		}

		return <FiFile className="text-gray-500" size={18} />;
	};

	const renderPreview = (item: FileSystemItem) => {
		const extension = item.name.split(".").pop()?.toLowerCase();

		if (extension === "txt" || extension === "md" || extension === "js" || extension === "jsx" || extension === "ts" || extension === "tsx" || extension === "css" || extension === "html") {
			return <div className="p-4 font-mono text-sm overflow-auto whitespace-pre-wrap h-full">{item.content || "(내용 없음)"}</div>;
		}

		if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif" || extension === "svg") {
			return (
				<div className="flex items-center justify-center h-full p-4">
					<div className="text-center text-gray-500">
						<FiFile size={48} className="mx-auto mb-2" />
						<p>이미지 미리보기는 아직 지원되지 않습니다.</p>
					</div>
				</div>
			);
		}

		return (
			<div className="flex items-center justify-center h-full p-4">
				<div className="text-center text-gray-500">
					<FiFile size={48} className="mx-auto mb-2" />
					<p>이 파일 형식은 미리보기를 지원하지 않습니다.</p>
				</div>
			</div>
		);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);

		if (!query.trim()) {
			setIsSearching(false);
			return;
		}

		setIsSearching(true);

		const results = state.items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

		setSearchResults(results);
	};

	const cancelSearch = () => {
		setSearchQuery("");
		setIsSearching(false);
	};

	const displayItems = isSearching ? searchResults : currentItems;

	const handleDragStart = (e: React.DragEvent, itemId: string) => {
		e.dataTransfer.setData("text/plain", itemId);
		e.dataTransfer.effectAllowed = "move";

		setDragState({
			...dragState,
			isDragging: true,
			draggedItemId: itemId,
		});
	};

	const handleDragOver = (e: React.DragEvent, targetId: string) => {
		e.preventDefault();

		const targetItem = getItemById(targetId);
		if (targetItem && targetItem.type === "folder") {
			e.dataTransfer.dropEffect = "move";

			setDragState({
				...dragState,
				dropTargetId: targetId,
			});
		} else {
			e.dataTransfer.dropEffect = "none";
		}
	};

	const handleDragEnd = () => {
		setDragState({
			isDragging: false,
			draggedItemId: null,
			dropTargetId: null,
		});
	};

	const handleDrop = (e: React.DragEvent, targetId: string) => {
		e.preventDefault();

		const draggedItemId = e.dataTransfer.getData("text/plain");

		const targetItem = getItemById(targetId);

		if (draggedItemId === targetId) {
			handleDragEnd();
			return;
		}

		if (targetItem && targetItem.type === "folder") {
			moveItem(draggedItemId, targetId);

			handleDragEnd();
		}
	};

	const handleDropOnEmptyArea = (e: React.DragEvent) => {
		e.preventDefault();

		const draggedItemId = e.dataTransfer.getData("text/plain");

		let parentId = "root";
		if (state.currentPath !== "/") {
			const pathParts = state.currentPath.split("/").filter(Boolean);
			let currentParentId = "root";

			for (const part of pathParts) {
				const folder = state.items.find((item) => item.parentId === currentParentId && item.name === part && item.type === "folder");
				if (folder) {
					currentParentId = folder.id;
				}
			}
			parentId = currentParentId;
		}

		moveItem(draggedItemId, parentId);

		handleDragEnd();
	};

	return (
		<div className="flex flex-col h-full bg-white">
			{/* 툴바 */}
			<div ref={toolbarRef} className="h-10 border-b flex items-center px-4 bg-gray-100">
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

				{/* 경로 표시 */}
				<div className="text-sm font-medium mr-4 flex-shrink-0">{isSearching ? "검색 결과" : state.currentPath}</div>

				{/* 검색 입력 필드 */}
				<div className="relative flex-1 max-w-md">
					<div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
						<FiSearch className="text-gray-400" size={14} />
					</div>
					<input
						type="text"
						className="w-full py-1 pl-8 pr-8 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="파일 검색..."
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
					/>
					{searchQuery && (
						<button className="absolute inset-y-0 right-0 flex items-center pr-2" onClick={cancelSearch}>
							<FiX className="text-gray-400 hover:text-gray-600" size={14} />
						</button>
					)}
				</div>

				{/* 파일/폴더 관리 버튼 */}
				<div className="flex space-x-1 ml-4">
					<button className="p-1.5 rounded hover:bg-gray-200 text-gray-700" onClick={() => openNewItemModal("folder")} title="새 폴더">
						<FiFolderPlus size={16} />
					</button>
					<button className="p-1.5 rounded hover:bg-gray-200 text-gray-700" onClick={() => openNewItemModal("file")} title="새 파일">
						<FiFilePlus size={16} />
					</button>
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* 사이드바 */}
				<div className="w-48 border-r overflow-y-auto bg-gray-50">
					{sidebarItems.map((section) => (
						<React.Fragment key={section.id}>
							{section.icon === null && <div className="px-3 py-2 text-xs font-medium text-gray-500">{section.name}</div>}
							{section.icon !== null && (
								<div
									className={`flex items-center px-3 py-1.5 text-sm cursor-pointer ${selectedSidebarItem === section.id ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
									onClick={() => {
										setSelectedSidebarItem(section.id);
										navigateTo(section.path);
									}}
								>
									<span className="mr-2">{section.icon}</span>
									{section.name}
								</div>
							)}
						</React.Fragment>
					))}
				</div>

				{/* 파일 보기 영역 */}
				<div
					className={`${previewPanel.visible && !previewPanel.maximized ? "w-1/2" : "flex-1"} overflow-y-auto`}
					onContextMenu={handleEmptyAreaContextMenu}
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDropOnEmptyArea}
				>
					<div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-4 py-2 text-xs font-medium text-gray-500 border-b">
						<div className="pl-8">이름</div>
						<div>종류</div>
						<div>크기</div>
						<div>수정된 날짜</div>
					</div>

					{isSearching && searchResults.length === 0 ? (
						<div className="flex items-center justify-center h-40 text-gray-500">검색 결과가 없습니다.</div>
					) : (
						displayItems.map((item) => (
							<div
								key={item.id}
								className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-4 px-4 py-1.5 text-sm border-b border-gray-100 cursor-pointer ${
									selectedItem === item.id ? "bg-blue-100" : dragState.dropTargetId === item.id ? "bg-green-100" : "hover:bg-gray-50"
								}`}
								onClick={() => handleItemSelect(item.id)}
								onDoubleClick={() => handleItemDoubleClick(item)}
								onContextMenu={(e) => handleItemContextMenu(e, item.id)}
								draggable={true}
								onDragStart={(e) => handleDragStart(e, item.id)}
								onDragOver={(e) => handleDragOver(e, item.id)}
								onDragEnd={handleDragEnd}
								onDrop={(e) => handleDrop(e, item.id)}
							>
								<div className="flex items-center">
									<span className="mr-2">{item.type === "folder" ? <FiFolder className="text-blue-500" size={18} /> : renderFileIcon(item.name)}</span>
									{item.name}
								</div>
								<div className="text-gray-500">{item.type === "folder" ? "폴더" : item.name.split(".").pop()?.toUpperCase() + " 파일"}</div>
								<div className="text-gray-500">{formatFileSize(item.size)}</div>
								<div className="text-gray-500">{formatDate(item.modifiedAt)}</div>
							</div>
						))
					)}
				</div>

				{/* 미리보기 패널 */}
				{previewPanel.visible && previewPanel.item && (
					<div className={`border-l ${previewPanel.maximized ? "flex-1" : "w-1/2"} flex flex-col`}>
						<div className="h-10 border-b flex items-center justify-between px-4 bg-gray-100">
							<div className="text-sm font-medium truncate">{previewPanel.item.name} 미리보기</div>
							<div className="flex space-x-1">
								<button className="p-1.5 rounded hover:bg-gray-200 text-gray-700" onClick={toggleMaximizePreview} title={previewPanel.maximized ? "축소" : "확대"}>
									{previewPanel.maximized ? <FiMinimize size={14} /> : <FiMaximize size={14} />}
								</button>
								<button className="p-1.5 rounded hover:bg-gray-200 text-gray-700" onClick={togglePreview} title="닫기">
									<FiX size={14} />
								</button>
							</div>
						</div>
						<div className="flex-1 overflow-auto">{renderPreview(previewPanel.item)}</div>
					</div>
				)}
			</div>

			{/* 상태 표시줄 */}
			<div className="h-6 border-t bg-gray-50 text-xs text-gray-500 px-4 flex items-center">{isSearching ? `검색 결과: ${searchResults.length}개 항목` : `${currentItems.length}개 항목`}</div>

			{/* 컨텍스트 메뉴 */}
			{contextMenu.visible && (
				<div
					className="fixed bg-white shadow-lg rounded-md py-1 z-50 w-48 text-sm"
					style={{
						left: contextMenu.x,
						top: contextMenu.y,
						maxHeight: "300px",
						overflow: "auto",
					}}
					onClick={(e) => e.stopPropagation()}
				>
					{contextMenu.itemId ? (
						// 아이템에 대한 컨텍스트 메뉴
						<>
							<button className="w-full text-left px-4 py-1.5 hover:bg-blue-50 flex items-center" onClick={() => openRenameModal(contextMenu.itemId!)}>
								<FiEdit className="mr-2" size={14} />
								이름 변경
							</button>
							<button className="w-full text-left px-4 py-1.5 hover:bg-blue-50 text-red-600 flex items-center" onClick={() => handleDeleteItem(contextMenu.itemId!)}>
								<FiTrash2 className="mr-2" size={14} />
								삭제
							</button>
						</>
					) : (
						// 빈 영역에 대한 컨텍스트 메뉴
						<>
							<button className="w-full text-left px-4 py-1.5 hover:bg-blue-50 flex items-center" onClick={() => openNewItemModal("folder")}>
								<FiFolderPlus className="mr-2" size={14} />새 폴더
							</button>
							<button className="w-full text-left px-4 py-1.5 hover:bg-blue-50 flex items-center" onClick={() => openNewItemModal("file")}>
								<FiFilePlus className="mr-2" size={14} />새 파일
							</button>
						</>
					)}
				</div>
			)}

			{/* 새 파일/폴더 생성 모달 */}
			{newItemModal.visible && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg w-80 p-4">
						<h3 className="text-lg font-medium mb-4">{newItemModal.type === "folder" ? "새 폴더" : "새 파일"} 만들기</h3>
						<input
							type="text"
							className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={newItemModal.name}
							onChange={(e) => setNewItemModal({ ...newItemModal, name: e.target.value })}
							autoFocus
						/>
						<div className="flex justify-end space-x-2">
							<button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => setNewItemModal({ ...newItemModal, visible: false })}>
								취소
							</button>
							<button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleCreateNewItem}>
								만들기
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 이름 변경 모달 */}
			{renameModal.visible && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg w-80 p-4">
						<h3 className="text-lg font-medium mb-4">이름 변경</h3>
						<input
							type="text"
							className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={renameModal.name}
							onChange={(e) => setRenameModal({ ...renameModal, name: e.target.value })}
							autoFocus
						/>
						<div className="flex justify-end space-x-2">
							<button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => setRenameModal({ ...renameModal, visible: false })}>
								취소
							</button>
							<button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleRenameItem}>
								변경
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
