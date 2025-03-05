import { SubMenuItem } from "../components/menubar/MenuItem";

const fileMenuItems: SubMenuItem[] = [
	{ id: "new", label: "새로 만들기", shortcut: "⌘N" },
	{ id: "open", label: "열기...", shortcut: "⌘O" },
	{ id: "separator1", separator: true },
	{ id: "close", label: "닫기", shortcut: "⌘W" },
	{ id: "save", label: "저장", shortcut: "⌘S" },
	{ id: "saveAs", label: "다른 이름으로 저장...", shortcut: "⇧⌘S" },
	{ id: "separator2", separator: true },
	{ id: "print", label: "프린트...", shortcut: "⌘P" },
];

const editMenuItems: SubMenuItem[] = [
	{ id: "undo", label: "실행 취소", shortcut: "⌘Z" },
	{ id: "redo", label: "다시 실행", shortcut: "⇧⌘Z" },
	{ id: "separator1", separator: true },
	{ id: "cut", label: "오려두기", shortcut: "⌘X" },
	{ id: "copy", label: "복사하기", shortcut: "⌘C" },
	{ id: "paste", label: "붙여넣기", shortcut: "⌘V" },
	{ id: "separator2", separator: true },
	{ id: "selectAll", label: "모두 선택", shortcut: "⌘A" },
	{ id: "find", label: "찾기...", shortcut: "⌘F" },
];

const viewMenuItems: SubMenuItem[] = [
	{ id: "zoomIn", label: "확대", shortcut: "⌘+" },
	{ id: "zoomOut", label: "축소", shortcut: "⌘-" },
	{ id: "actualSize", label: "실제 크기", shortcut: "⌘0" },
	{ id: "separator1", separator: true },
	{ id: "fullScreen", label: "전체 화면", shortcut: "⌃⌘F" },
];

const windowMenuItems: SubMenuItem[] = [
	{ id: "minimize", label: "최소화", shortcut: "⌘M" },
	{ id: "zoom", label: "확대/축소" },
	{ id: "separator1", separator: true },
	{ id: "bringAllToFront", label: "모두 앞으로 가져오기" },
];

const helpMenuItems: SubMenuItem[] = [
	{ id: "help", label: "도움말" },
	{ id: "about", label: "정보" },
];

export type MenuKey = "app" | "file" | "edit" | "view" | "go" | "window" | "help";
export interface AppMenus {
	[key: string]: SubMenuItem[];
}

const finderMenus: Record<MenuKey, SubMenuItem[]> = {
	app: [
		{ id: "about", label: "Finder에 관하여" },
		{ id: "separator1", separator: true },
		{ id: "preferences", label: "환경설정...", shortcut: "⌘," },
		{ id: "separator2", separator: true },
		{ id: "emptyTrash", label: "휴지통 비우기..." },
		{ id: "separator3", separator: true },
		{ id: "services", label: "서비스" },
		{ id: "separator4", separator: true },
		{ id: "hideFinder", label: "Finder 가리기", shortcut: "⌘H" },
		{ id: "hideOthers", label: "기타 가리기", shortcut: "⌥⌘H" },
		{ id: "showAll", label: "모두 보기" },
	],
	file: [
		{ id: "newFolder", label: "새 폴더", shortcut: "⇧⌘N" },
		{ id: "newFinderWindow", label: "새 Finder 윈도우", shortcut: "⌘N" },
		{ id: "separator1", separator: true },
		{ id: "close", label: "닫기", shortcut: "⌘W" },
		{ id: "getInfo", label: "정보 가져오기", shortcut: "⌘I" },
		{ id: "separator2", separator: true },
		{ id: "duplicate", label: "복제", shortcut: "⌘D" },
		{ id: "makeAlias", label: "별명 만들기", shortcut: "⌃⌘A" },
	],
	edit: editMenuItems,
	view: [
		{ id: "asIcons", label: "아이콘으로", shortcut: "⌘1" },
		{ id: "asList", label: "목록으로", shortcut: "⌘2" },
		{ id: "asColumns", label: "열로", shortcut: "⌘3" },
		{ id: "asGallery", label: "갤러리로", shortcut: "⌘4" },
		{ id: "separator1", separator: true },
		{ id: "showPreview", label: "미리보기 보기", shortcut: "⇧⌘P" },
		{ id: "showPathbar", label: "경로 막대 보기" },
		{ id: "showStatusBar", label: "상태 막대 보기" },
		{ id: "separator2", separator: true },
		{ id: "hideHiddenFiles", label: "숨김 파일 가리기", shortcut: "⇧⌘." },
	],
	go: [
		{ id: "back", label: "뒤로", shortcut: "⌘[" },
		{ id: "forward", label: "앞으로", shortcut: "⌘]" },
		{ id: "enclosingFolder", label: "상위 폴더", shortcut: "⌘↑" },
		{ id: "separator1", separator: true },
		{ id: "computer", label: "컴퓨터", shortcut: "⇧⌘C" },
		{ id: "home", label: "홈", shortcut: "⇧⌘H" },
		{ id: "documents", label: "문서", shortcut: "⇧⌘O" },
		{ id: "desktop", label: "데스크탑", shortcut: "⇧⌘D" },
		{ id: "downloads", label: "다운로드", shortcut: "⌥⌘L" },
		{ id: "applications", label: "응용 프로그램", shortcut: "⇧⌘A" },
	],
	window: windowMenuItems,
	help: helpMenuItems,
};

const notesMenus: Record<MenuKey, SubMenuItem[]> = {
	app: [
		{ id: "about", label: "Notes에 관하여" },
		{ id: "separator1", separator: true },
		{ id: "preferences", label: "환경설정...", shortcut: "⌘," },
		{ id: "separator2", separator: true },
		{ id: "services", label: "서비스" },
		{ id: "separator3", separator: true },
		{ id: "hideNotes", label: "Notes 가리기", shortcut: "⌘H" },
		{ id: "hideOthers", label: "기타 가리기", shortcut: "⌥⌘H" },
		{ id: "showAll", label: "모두 보기" },
	],
	file: [
		{ id: "new", label: "새 노트", shortcut: "⌘N" },
		{ id: "separator1", separator: true },
		{ id: "close", label: "닫기", shortcut: "⌘W" },
		{ id: "save", label: "저장", shortcut: "⌘S" },
		{ id: "separator2", separator: true },
		{ id: "share", label: "공유..." },
		{ id: "export", label: "내보내기..." },
		{ id: "print", label: "프린트...", shortcut: "⌘P" },
	],
	edit: [...editMenuItems, { id: "separator3", separator: true }, { id: "attachments", label: "첨부 파일" }, { id: "addLink", label: "링크 추가...", shortcut: "⌘K" }],
	view: [{ id: "showFonts", label: "서체 보기", shortcut: "⌘T" }, { id: "separator1", separator: true }, ...viewMenuItems],
	go: [],
	window: windowMenuItems,
	help: helpMenuItems,
};

const defaultMenus: Record<MenuKey, SubMenuItem[]> = {
	app: [
		{ id: "about", label: "앱에 관하여" },
		{ id: "separator1", separator: true },
		{ id: "preferences", label: "환경설정...", shortcut: "⌘," },
		{ id: "separator2", separator: true },
		{ id: "services", label: "서비스" },
		{ id: "separator3", separator: true },
		{ id: "hideApp", label: "앱 가리기", shortcut: "⌘H" },
		{ id: "hideOthers", label: "기타 가리기", shortcut: "⌥⌘H" },
		{ id: "showAll", label: "모두 보기" },
	],
	file: fileMenuItems,
	edit: editMenuItems,
	view: viewMenuItems,
	go: [],
	window: windowMenuItems,
	help: helpMenuItems,
};

export const getAppMenus = (appId: string): Record<MenuKey, SubMenuItem[]> => {
	switch (appId) {
		case "finder":
			return finderMenus;
		case "notes":
			return notesMenus;
		default:
			return defaultMenus;
	}
};

export const menuLabels: Record<MenuKey, string> = {
	app: "",
	file: "파일",
	edit: "편집",
	view: "보기",
	go: "이동",
	window: "윈도우",
	help: "도움말",
};

export const menuOrder: MenuKey[] = ["app", "file", "edit", "view", "go", "window", "help"];
