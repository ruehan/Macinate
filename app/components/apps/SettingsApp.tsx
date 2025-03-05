import React, { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useSystemSettings } from "~/store/SystemSettingsContext";

const availableWallpapers = [
	{ id: "default", path: "/wallpaper.jpg", name: "기본 배경화면", thumbnail: "/wallpaper.jpg" },
	{ id: "mountains", path: "/wallpapers/mountains.jpg", name: "산", thumbnail: "/wallpapers/mountains.jpg" },
	{ id: "ocean", path: "/wallpapers/ocean.jpg", name: "바다", thumbnail: "/wallpapers/ocean.jpg" },
	{ id: "forest", path: "/wallpapers/forest.jpg", name: "숲", thumbnail: "/wallpapers/forest.jpg" },
	{ id: "desert", path: "/wallpapers/desert.jpg", name: "사막", thumbnail: "/wallpapers/desert.jpg" },
	{ id: "space", path: "/wallpapers/space.jpg", name: "우주", thumbnail: "/wallpapers/space.jpg" },
	{ id: "cityscape", path: "/wallpapers/cityscape.jpg", name: "도시", thumbnail: "/wallpapers/cityscape.jpg" },
];

type SettingsTab = "general" | "appearance" | "wallpaper" | "dock";

const LazyImage = memo(({ src, alt, className, onClick, isSelected }: { src: string; alt: string; className: string; onClick?: () => void; isSelected?: boolean }) => {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);

	const srcSet = `${src} 1x`;

	return (
		<div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
			{!loaded && !error && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
			<img
				ref={imgRef}
				src={src}
				srcSet={srcSet}
				alt={alt}
				className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
				onLoad={() => setLoaded(true)}
				onError={() => setError(true)}
				onClick={onClick}
				loading="lazy"
				width="300"
				height="169"
				decoding="async"
			/>
			{error && <div className="absolute inset-0 flex items-center justify-center text-red-500">이미지를 불러올 수 없습니다</div>}
			{isSelected && loaded && <div className="absolute inset-0 border-4 border-blue-500 pointer-events-none"></div>}
		</div>
	);
});

LazyImage.displayName = "LazyImage";

const WallpaperItem = memo(({ wallpaper, isSelected, onSelect }: { wallpaper: (typeof availableWallpapers)[0]; isSelected: boolean; onSelect: (path: string) => void }) => {
	return (
		<div className={`cursor-pointer rounded-lg overflow-hidden border-2 ${isSelected ? "border-blue-500" : "border-transparent"}`}>
			<LazyImage src={wallpaper.thumbnail} alt={wallpaper.name} className="w-full h-full object-cover" onClick={() => onSelect(wallpaper.path)} isSelected={isSelected} />
			<p className="p-2 text-center">{wallpaper.name}</p>
		</div>
	);
});

WallpaperItem.displayName = "WallpaperItem";

const WallpaperSettings = memo(({ currentWallpaper, onWallpaperSelect }: { currentWallpaper: string; onWallpaperSelect: (path: string) => void }) => {
	return (
		<div>
			<h2 className="text-2xl font-semibold mb-6">배경화면 설정</h2>
			<p className="text-gray-600 dark:text-gray-400 mb-4">데스크탑 배경화면을 변경할 수 있습니다.</p>

			<div className="grid grid-cols-3 gap-4">
				{availableWallpapers.map((wallpaper) => (
					<WallpaperItem key={wallpaper.id} wallpaper={wallpaper} isSelected={currentWallpaper === wallpaper.path} onSelect={onWallpaperSelect} />
				))}
			</div>
		</div>
	);
});

WallpaperSettings.displayName = "WallpaperSettings";

const DockSettings = memo(
	({
		dockSize,
		dockMagnification,
		dockMagnificationLevel,
		dockPosition,
		dockAutohide,
		onDockSizeChange,
		onDockMagnificationChange,
		onDockMagnificationLevelChange,
		onDockPositionChange,
		onDockAutohideChange,
	}: {
		dockSize: number;
		dockMagnification: boolean;
		dockMagnificationLevel: number;
		dockPosition: "bottom" | "left" | "right";
		dockAutohide: boolean;
		onDockSizeChange: (size: number) => void;
		onDockMagnificationChange: (enabled: boolean) => void;
		onDockMagnificationLevelChange: (level: number) => void;
		onDockPositionChange: (position: "bottom" | "left" | "right") => void;
		onDockAutohideChange: (enabled: boolean) => void;
	}) => {
		return (
			<div>
				<h2 className="text-2xl font-semibold mb-6">Dock 설정</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-4">Dock의 크기, 위치, 효과를 변경할 수 있습니다.</p>

				<div className="space-y-6">
					<div>
						<h3 className="text-lg font-medium mb-2">크기</h3>
						<input type="range" min="40" max="100" value={dockSize} onChange={(e) => onDockSizeChange(parseInt(e.target.value))} className="w-full" />
						<div className="flex justify-between text-sm text-gray-500">
							<span>작게</span>
							<span>크게</span>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-2">확대 효과</h3>
						<div className="flex items-center mb-4">
							<input type="checkbox" id="magnification" checked={dockMagnification} onChange={(e) => onDockMagnificationChange(e.target.checked)} className="mr-2" />
							<label htmlFor="magnification">확대 효과 사용</label>
						</div>

						{dockMagnification && (
							<div>
								<input type="range" min="1.1" max="2" step="0.1" value={dockMagnificationLevel} onChange={(e) => onDockMagnificationLevelChange(parseFloat(e.target.value))} className="w-full" />
								<div className="flex justify-between text-sm text-gray-500">
									<span>작게</span>
									<span>크게</span>
								</div>
							</div>
						)}
					</div>

					<div>
						<h3 className="text-lg font-medium mb-2">위치</h3>
						<div className="flex space-x-4">
							<button className={`px-4 py-2 rounded-lg ${dockPosition === "bottom" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => onDockPositionChange("bottom")}>
								하단
							</button>
							<button className={`px-4 py-2 rounded-lg ${dockPosition === "left" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => onDockPositionChange("left")}>
								왼쪽
							</button>
							<button className={`px-4 py-2 rounded-lg ${dockPosition === "right" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => onDockPositionChange("right")}>
								오른쪽
							</button>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium mb-2">자동 숨김</h3>
						<div className="flex items-center">
							<input type="checkbox" id="autohide" checked={dockAutohide} onChange={(e) => onDockAutohideChange(e.target.checked)} className="mr-2" />
							<label htmlFor="autohide">Dock 자동 숨김</label>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

DockSettings.displayName = "DockSettings";

export default function SettingsApp() {
	const { state, setTheme, setWallpaper, setDockSize, setDockMagnification, setDockMagnificationLevel, setDockPosition, setDockAutohide, resetSettings } = useSystemSettings();
	const [activeTab, setActiveTab] = useState<SettingsTab>("general");
	const [showSavedNotification, setShowSavedNotification] = useState(false);
	const [loadedWallpapers, setLoadedWallpapers] = useState<string[]>([]);

	const handleTabChange = (tab: SettingsTab) => {
		setActiveTab(tab);

		if (tab === "wallpaper" && !loadedWallpapers.includes(state.wallpaper)) {
			setLoadedWallpapers((prev) => [...prev, state.wallpaper]);
		}
	};

	useEffect(() => {
		setShowSavedNotification(true);

		const timer = setTimeout(() => {
			setShowSavedNotification(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, [state]);

	const handleWallpaperSelect = (path: string) => {
		setWallpaper(path);
		if (!loadedWallpapers.includes(path)) {
			setLoadedWallpapers((prev) => [...prev, path]);
		}
	};

	return (
		<div className="flex h-full bg-white dark:bg-gray-800 text-black dark:text-white relative">
			{showSavedNotification && (
				<motion.div
					className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
				>
					설정이 저장되었습니다
				</motion.div>
			)}

			<div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4">
				<h2 className="text-lg font-semibold mb-4">설정</h2>
				<ul className="space-y-2">
					<li>
						<button
							className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "general" ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
							onClick={() => handleTabChange("general")}
						>
							일반
						</button>
					</li>
					<li>
						<button
							className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "appearance" ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
							onClick={() => handleTabChange("appearance")}
						>
							모양
						</button>
					</li>
					<li>
						<button
							className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "wallpaper" ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
							onClick={() => handleTabChange("wallpaper")}
						>
							배경화면
						</button>
					</li>
					<li>
						<button
							className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "dock" ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
							onClick={() => handleTabChange("dock")}
						>
							Dock
						</button>
					</li>
				</ul>

				<div className="mt-auto pt-4">
					<button className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={resetSettings}>
						설정 초기화
					</button>
				</div>
			</div>

			<div className="flex-1 p-6 overflow-y-auto">
				{activeTab === "general" && (
					<div>
						<h2 className="text-2xl font-semibold mb-6">일반 설정</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-4">시스템의 기본 설정을 변경할 수 있습니다.</p>

						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium mb-2">시스템 정보</h3>
								<div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
									<p>Macinate 웹 OS</p>
									<p>버전: 1.0.0</p>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-2">언어 설정</h3>
								<select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" defaultValue="ko">
									<option value="ko">한국어</option>
									<option value="en">English</option>
									<option value="ja">日本語</option>
									<option value="zh">中文</option>
								</select>
							</div>
						</div>
					</div>
				)}

				{activeTab === "appearance" && (
					<div>
						<h2 className="text-2xl font-semibold mb-6">모양 설정</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-4">시스템의 테마와 모양을 변경할 수 있습니다.</p>

						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium mb-2">테마</h3>
								<div className="flex space-x-4">
									<div className={`cursor-pointer p-4 rounded-lg border-2 ${state.theme === "light" ? "border-blue-500" : "border-gray-300 dark:border-gray-600"}`} onClick={() => setTheme("light")}>
										<div className="w-24 h-16 bg-white border border-gray-300 rounded-lg mb-2"></div>
										<p className="text-center">라이트 모드</p>
									</div>

									<div className={`cursor-pointer p-4 rounded-lg border-2 ${state.theme === "dark" ? "border-blue-500" : "border-gray-300 dark:border-gray-600"}`} onClick={() => setTheme("dark")}>
										<div className="w-24 h-16 bg-gray-800 border border-gray-700 rounded-lg mb-2"></div>
										<p className="text-center">다크 모드</p>
									</div>

									<div className={`cursor-pointer p-4 rounded-lg border-2 ${state.theme === "auto" ? "border-blue-500" : "border-gray-300 dark:border-gray-600"}`} onClick={() => setTheme("auto")}>
										<div className="w-24 h-16 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded-lg mb-2"></div>
										<p className="text-center">자동</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === "wallpaper" && <WallpaperSettings currentWallpaper={state.wallpaper} onWallpaperSelect={handleWallpaperSelect} />}

				{activeTab === "dock" && (
					<DockSettings
						dockSize={state.dock.size}
						dockMagnification={state.dock.magnification}
						dockMagnificationLevel={state.dock.magnificationLevel}
						dockPosition={state.dock.position}
						dockAutohide={state.dock.autohide}
						onDockSizeChange={setDockSize}
						onDockMagnificationChange={setDockMagnification}
						onDockMagnificationLevelChange={setDockMagnificationLevel}
						onDockPositionChange={setDockPosition}
						onDockAutohideChange={setDockAutohide}
					/>
				)}
			</div>
		</div>
	);
}
