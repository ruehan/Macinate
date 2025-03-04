import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface FileSystemItem {
	id: string;
	name: string;
	type: "file" | "folder";
	size?: number;
	createdAt: Date;
	modifiedAt: Date;
	parentId: string | null;
	content?: string;
	icon?: string;
}

interface FileSystemState {
	items: FileSystemItem[];
	currentPath: string;
}

type FileSystemAction =
	| { type: "ADD_ITEM"; payload: FileSystemItem }
	| { type: "DELETE_ITEM"; payload: { id: string } }
	| { type: "RENAME_ITEM"; payload: { id: string; name: string } }
	| { type: "MOVE_ITEM"; payload: { id: string; parentId: string | null } }
	| { type: "UPDATE_CONTENT"; payload: { id: string; content: string } }
	| { type: "SET_CURRENT_PATH"; payload: { path: string } };

const initialState: FileSystemState = {
	items: [
		{ id: "root", name: "Root", type: "folder", createdAt: new Date(), modifiedAt: new Date(), parentId: null },
		{ id: "documents", name: "Documents", type: "folder", createdAt: new Date(), modifiedAt: new Date(), parentId: "root" },
		{ id: "downloads", name: "Downloads", type: "folder", createdAt: new Date(), modifiedAt: new Date(), parentId: "root" },
		{ id: "desktop", name: "Desktop", type: "folder", createdAt: new Date(), modifiedAt: new Date(), parentId: "root" },
		{ id: "applications", name: "Applications", type: "folder", createdAt: new Date(), modifiedAt: new Date(), parentId: "root" },
		{ id: "readme", name: "README.md", type: "file", size: 1024, createdAt: new Date(), modifiedAt: new Date(), parentId: "root", content: "# Macinate\n\nA macOS-like interface built with React." },
		{ id: "profile", name: "profile.jpg", type: "file", size: 2048, createdAt: new Date(), modifiedAt: new Date(), parentId: "root" },
		{ id: "doc1", name: "Document1.txt", type: "file", size: 512, createdAt: new Date(), modifiedAt: new Date(), parentId: "documents", content: "This is a sample document." },
		{ id: "doc2", name: "Document2.txt", type: "file", size: 768, createdAt: new Date(), modifiedAt: new Date(), parentId: "documents", content: "This is another sample document." },
		{ id: "download1", name: "download.zip", type: "file", size: 10240, createdAt: new Date(), modifiedAt: new Date(), parentId: "downloads" },
	],
	currentPath: "/",
};

const fileSystemReducer = (state: FileSystemState, action: FileSystemAction): FileSystemState => {
	switch (action.type) {
		case "ADD_ITEM":
			return {
				...state,
				items: [...state.items, action.payload],
			};

		case "DELETE_ITEM":
			const itemIdToDelete = action.payload.id;

			const itemToDelete = state.items.find((item) => item.id === itemIdToDelete);

			if (!itemToDelete) {
				return state;
			}

			let idsToDelete = [itemIdToDelete];

			if (itemToDelete.type === "folder") {
				const collectChildIds = (parentId: string): string[] => {
					const childItems = state.items.filter((item) => item.parentId === parentId);
					let childIds: string[] = [];

					childItems.forEach((child) => {
						childIds.push(child.id);
						if (child.type === "folder") {
							childIds = [...childIds, ...collectChildIds(child.id)];
						}
					});

					return childIds;
				};

				const childIds = collectChildIds(itemIdToDelete);
				idsToDelete = [...idsToDelete, ...childIds];
			}

			return {
				...state,
				items: state.items.filter((item) => !idsToDelete.includes(item.id)),
			};

		case "RENAME_ITEM":
			return {
				...state,
				items: state.items.map((item) => (item.id === action.payload.id ? { ...item, name: action.payload.name, modifiedAt: new Date() } : item)),
			};

		case "MOVE_ITEM":
			return {
				...state,
				items: state.items.map((item) => (item.id === action.payload.id ? { ...item, parentId: action.payload.parentId, modifiedAt: new Date() } : item)),
			};

		case "UPDATE_CONTENT":
			return {
				...state,
				items: state.items.map((item) => (item.id === action.payload.id ? { ...item, content: action.payload.content, modifiedAt: new Date() } : item)),
			};

		case "SET_CURRENT_PATH":
			return {
				...state,
				currentPath: action.payload.path,
			};

		default:
			return state;
	}
};

interface FileSystemContextType {
	state: FileSystemState;
	addItem: (item: Omit<FileSystemItem, "id" | "createdAt" | "modifiedAt">) => void;
	deleteItem: (id: string) => void;
	renameItem: (id: string, name: string) => void;
	moveItem: (id: string, parentId: string | null) => void;
	updateContent: (id: string, content: string) => void;
	setCurrentPath: (path: string) => void;
	getItemsByParentId: (parentId: string | null) => FileSystemItem[];
	getItemById: (id: string) => FileSystemItem | undefined;
	getPathById: (id: string) => string;
	getItemsByPath: (path: string) => FileSystemItem[];
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export function FileSystemProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(fileSystemReducer, initialState);

	const addItem = (item: Omit<FileSystemItem, "id" | "createdAt" | "modifiedAt">) => {
		const newItem: FileSystemItem = {
			...item,
			id: Math.random().toString(36).substring(2, 9), // 간단한 랜덤 ID 생성
			createdAt: new Date(),
			modifiedAt: new Date(),
		};
		dispatch({ type: "ADD_ITEM", payload: newItem });
	};

	const deleteItem = (id: string) => {
		dispatch({ type: "DELETE_ITEM", payload: { id } });
	};

	const renameItem = (id: string, name: string) => {
		dispatch({ type: "RENAME_ITEM", payload: { id, name } });
	};

	const moveItem = (id: string, parentId: string | null) => {
		dispatch({ type: "MOVE_ITEM", payload: { id, parentId } });
	};

	const updateContent = (id: string, content: string) => {
		dispatch({ type: "UPDATE_CONTENT", payload: { id, content } });
	};

	const setCurrentPath = (path: string) => {
		dispatch({ type: "SET_CURRENT_PATH", payload: { path } });
	};

	const getItemsByParentId = (parentId: string | null) => {
		return state.items.filter((item) => item.parentId === parentId);
	};

	const getItemById = (id: string) => {
		return state.items.find((item) => item.id === id);
	};

	const getPathById = (id: string): string => {
		const item = getItemById(id);
		if (!item) return "/";

		if (item.parentId === null) return `/${item.name}`;

		const parentPath = getPathById(item.parentId);
		return `${parentPath === "/" ? "" : parentPath}/${item.name}`;
	};

	const getItemsByPath = (path: string): FileSystemItem[] => {
		if (path === "/" || path === "") {
			return getItemsByParentId("root");
		}

		const pathParts = path.split("/").filter(Boolean);
		let currentParentId = "root";

		for (const part of pathParts) {
			const folder = state.items.find((item) => item.parentId === currentParentId && item.name === part && item.type === "folder");
			if (!folder) return [];
			currentParentId = folder.id;
		}

		return getItemsByParentId(currentParentId);
	};

	return (
		<FileSystemContext.Provider
			value={{
				state,
				addItem,
				deleteItem,
				renameItem,
				moveItem,
				updateContent,
				setCurrentPath,
				getItemsByParentId,
				getItemById,
				getPathById,
				getItemsByPath,
			}}
		>
			{children}
		</FileSystemContext.Provider>
	);
}

export function useFileSystem() {
	const context = useContext(FileSystemContext);
	if (context === undefined) {
		throw new Error("useFileSystem must be used within a FileSystemProvider");
	}
	return context;
}
