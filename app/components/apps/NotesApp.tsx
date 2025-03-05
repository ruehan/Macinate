import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// 메모 인터페이스 정의
interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: number;
	updatedAt: number;
}

export default function NotesApp() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
	const [currentContent, setCurrentContent] = useState<string>("");
	const [currentTitle, setCurrentTitle] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
	const contentRef = useRef<string>("");
	const titleRef = useRef<string>("");
	const selectedNoteIdRef = useRef<string | null>(null);

	useEffect(() => {
		const savedNotes = localStorage.getItem("notes");
		if (savedNotes) {
			try {
				const parsedNotes = JSON.parse(savedNotes) as Note[];
				setNotes(parsedNotes);

				if (parsedNotes.length > 0) {
					setSelectedNoteId(parsedNotes[0].id);
					setCurrentTitle(parsedNotes[0].title);
					setCurrentContent(parsedNotes[0].content);
				}
			} catch (error) {
				console.error("메모를 불러오는 중 오류가 발생했습니다:", error);
				localStorage.removeItem("notes");
			}
		}
	}, []);

	useEffect(() => {
		contentRef.current = currentContent;
	}, [currentContent]);

	useEffect(() => {
		titleRef.current = currentTitle;
	}, [currentTitle]);

	useEffect(() => {
		selectedNoteIdRef.current = selectedNoteId;
	}, [selectedNoteId]);

	useEffect(() => {
		return () => {
			if (saveTimerRef.current) {
				clearTimeout(saveTimerRef.current);
				saveToLocalStorage();
			}
		};
	}, []);

	const saveToLocalStorage = useCallback(() => {
		const currentNoteId = selectedNoteIdRef.current;
		if (!currentNoteId) return;

		const title = titleRef.current;
		const content = contentRef.current;

		const updatedNotes = notes.map((note) => {
			if (note.id === currentNoteId) {
				return {
					...note,
					title: title || "제목 없음",
					content: content,
					updatedAt: Date.now(),
				};
			}
			return note;
		});

		try {
			localStorage.setItem("notes", JSON.stringify(updatedNotes));
			setNotes(updatedNotes);
		} catch (error) {
			console.error("메모를 저장하는 중 오류가 발생했습니다:", error);
		}
	}, [notes]);

	const updateNotesState = useCallback((updatedNotes: Note[]) => {
		try {
			localStorage.setItem("notes", JSON.stringify(updatedNotes));
			setNotes(updatedNotes);
		} catch (error) {
			console.error("메모를 저장하는 중 오류가 발생했습니다:", error);
		}
	}, []);

	useEffect(() => {
		if (selectedNoteId) {
			const selectedNote = notes.find((note) => note.id === selectedNoteId);
			if (selectedNote) {
				setCurrentTitle(selectedNote.title);
				setCurrentContent(selectedNote.content);
			}
		} else {
			setCurrentTitle("");
			setCurrentContent("");
		}
	}, [selectedNoteId, notes]);

	const createNewNote = useCallback(() => {
		if (selectedNoteIdRef.current) {
			saveToLocalStorage();
		}

		const newNote: Note = {
			id: Date.now().toString(),
			title: "새 메모",
			content: "",
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		const updatedNotes = [newNote, ...notes];
		updateNotesState(updatedNotes);
		setSelectedNoteId(newNote.id);
	}, [notes, saveToLocalStorage, updateNotesState]);

	const deleteNote = useCallback(
		(id: string) => {
			if (saveTimerRef.current) {
				clearTimeout(saveTimerRef.current);
				saveTimerRef.current = null;
			}

			const updatedNotes = notes.filter((note) => note.id !== id);
			updateNotesState(updatedNotes);

			if (id === selectedNoteIdRef.current) {
				if (updatedNotes.length > 0) {
					setSelectedNoteId(updatedNotes[0].id);
				} else {
					setSelectedNoteId(null);
				}
			}
		},
		[notes, updateNotesState]
	);

	const debounceSave = useCallback(() => {
		if (saveTimerRef.current) {
			clearTimeout(saveTimerRef.current);
		}

		saveTimerRef.current = setTimeout(() => {
			saveToLocalStorage();
			saveTimerRef.current = null;
		}, 2000);
	}, [saveToLocalStorage]);

	const handleContentChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newContent = e.target.value;
			setCurrentContent(newContent);
			debounceSave();
		},
		[debounceSave]
	);

	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newTitle = e.target.value;
			setCurrentTitle(newTitle);
			debounceSave();
		},
		[debounceSave]
	);

	const handleBlur = useCallback(() => {
		if (saveTimerRef.current) {
			clearTimeout(saveTimerRef.current);
			saveTimerRef.current = null;
		}
		saveToLocalStorage();
	}, [saveToLocalStorage]);

	const handleSelectNote = useCallback(
		(id: string) => {
			if (saveTimerRef.current) {
				clearTimeout(saveTimerRef.current);
				saveTimerRef.current = null;
			}

			if (selectedNoteIdRef.current) {
				saveToLocalStorage();
			}
			setSelectedNoteId(id);
		},
		[saveToLocalStorage]
	);

	const getNoteTitlePreview = useCallback((note: Note) => {
		if (note.title) return note.title;

		const firstLine = note.content.split("\n")[0].trim();
		return firstLine || "제목 없음";
	}, []);

	const getNoteContentPreview = useCallback((note: Note) => {
		const lines = note.content.split("\n");
		if (lines.length > 1) {
			return lines.slice(1).join(" ").trim().substring(0, 50) + (note.content.length > 50 ? "..." : "");
		}
		return note.content.substring(0, 50) + (note.content.length > 50 ? "..." : "");
	}, []);

	const formatDate = useCallback((timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}, []);

	const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="flex flex-col h-full bg-white dark:bg-gray-900 text-black dark:text-white">
			{/* 상단 툴바 */}
			<div className="flex items-center py-2 px-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 mr-2" onClick={createNewNote}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
				</button>
				<div className="flex-1 relative">
					<input
						type="text"
						placeholder="메모 검색..."
						className="w-full px-3 py-1 pl-8 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
			</div>

			{/* 메인 콘텐츠 영역 */}
			<div className="flex-1 flex overflow-hidden">
				{/* 메모 목록 사이드바 */}
				<div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
					{filteredNotes.length === 0 ? (
						<div className="p-4 text-center text-gray-500 dark:text-gray-400">
							{searchTerm ? (
								<>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<p>검색 결과가 없습니다.</p>
								</>
							) : (
								<>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<p>메모가 없습니다. 새 메모를 작성해보세요.</p>
									<button className="mt-3 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm" onClick={createNewNote}>
										새 메모 작성
									</button>
								</>
							)}
						</div>
					) : (
						filteredNotes.map((note) => (
							<div
								key={note.id}
								className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
									selectedNoteId === note.id ? "bg-yellow-50 dark:bg-yellow-900" : ""
								}`}
								onClick={() => handleSelectNote(note.id)}
							>
								<div className="flex justify-between items-start">
									<h3 className="font-medium truncate">{getNoteTitlePreview(note)}</h3>
									<button
										className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-2"
										onClick={(e) => {
											e.stopPropagation();
											if (window.confirm("이 메모를 삭제하시겠습니까?")) {
												deleteNote(note.id);
											}
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{getNoteContentPreview(note)}</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(note.updatedAt)}</p>
							</div>
						))
					)}
				</div>

				{/* 메모 편집 영역 */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{selectedNoteId ? (
						<>
							<div className="p-3 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
									<input
										type="text"
										placeholder="제목"
										className="w-full px-2 py-1 text-lg font-medium bg-transparent border-none focus:outline-none"
										value={currentTitle}
										onChange={handleTitleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
									<div className="flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										{formatDate(notes.find((note) => note.id === selectedNoteId)?.updatedAt || Date.now())}
									</div>
									<div className="text-xs italic">2초 동안 입력이 없으면 자동 저장됩니다</div>
								</div>
							</div>
							<textarea
								className="flex-1 p-4 w-full bg-transparent border-none resize-none focus:outline-none"
								placeholder="내용을 입력하세요..."
								value={currentContent}
								onChange={handleContentChange}
								onBlur={handleBlur}
							/>
						</>
					) : (
						<div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
							<p className="text-lg">메모를 선택하거나 새 메모를 작성하세요</p>
							<button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors" onClick={createNewNote}>
								새 메모 작성
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
