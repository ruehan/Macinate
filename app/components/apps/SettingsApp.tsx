import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSystemSettings } from "~/store/SystemSettingsContext";

// 사용 가능한 배경화면 목록
const availableWallpapers = [
	{ id: "default", path: "/wallpaper.jpg", name: "기본 배경화면" },
	{ id: "mountains", path: "/wallpapers/mountains.jpg", name: "산" },
	{ id: "ocean", path: "/wallpapers/ocean.jpg", name: "바다" },
	{ id: "forest", path: "/wallpapers/forest.jpg", name: "숲" },
	{ id: "desert", path: "/wallpapers/desert.jpg", name: "사막" },
	{ id: "space", path: "/wallpapers/space.jpg", name: "우주" },
	{ id: "cityscape", path: "/wallpapers/cityscape.jpg", name: "도시" },
];

// 설정 탭 타입
type SettingsTab = "general" | "appearance" | "wallpaper" | "dock";

export default function SettingsApp() {
	const { state, setTheme, setWallpaper, setDockSize, setDockMagnification, setDockMagnificationLevel, setDockPosition, setDockAutohide, resetSettings } = useSystemSettings();
	const [activeTab, setActiveTab] = useState<SettingsTab>("general");
	const [showSavedNotification, setShowSavedNotification] = useState(false);

	// 탭 변경 핸들러
	const handleTabChange = (tab: SettingsTab) => {
		setActiveTab(tab);
	};

	// 설정 변경 시 저장 알림 표시
	useEffect(() => {
		// 설정이 변경되면 저장 알림 표시
		setShowSavedNotification(true);

		// 3초 후 알림 숨기기
		const timer = setTimeout(() => {
			setShowSavedNotification(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, [state]);

	return (
		<div className="flex h-full bg-white dark:bg-gray-800 text-black dark:text-white relative">
			{/* 저장 알림 */}
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

			{/* 사이드바 */}
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

			{/* 메인 콘텐츠 */}
			<div className="flex-1 p-6 overflow-y-auto">
				{/* 일반 설정 */}
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

				{/* 모양 설정 */}
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

				{/* 배경화면 설정 */}
				{activeTab === "wallpaper" && (
					<div>
						<h2 className="text-2xl font-semibold mb-6">배경화면 설정</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-4">데스크탑 배경화면을 변경할 수 있습니다.</p>

						<div className="grid grid-cols-3 gap-4">
							{availableWallpapers.map((wallpaper) => (
								<div
									key={wallpaper.id}
									className={`cursor-pointer rounded-lg overflow-hidden border-2 ${state.wallpaper === wallpaper.path ? "border-blue-500" : "border-transparent"}`}
									onClick={() => setWallpaper(wallpaper.path)}
								>
									<div className="relative aspect-video">
										<img src={wallpaper.path} alt={wallpaper.name} className="w-full h-full object-cover" />
									</div>
									<p className="p-2 text-center">{wallpaper.name}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Dock 설정 */}
				{activeTab === "dock" && (
					<div>
						<h2 className="text-2xl font-semibold mb-6">Dock 설정</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-4">Dock의 크기, 위치, 효과를 변경할 수 있습니다.</p>

						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium mb-2">크기</h3>
								<input type="range" min="40" max="100" value={state.dock.size} onChange={(e) => setDockSize(parseInt(e.target.value))} className="w-full" />
								<div className="flex justify-between text-sm text-gray-500">
									<span>작게</span>
									<span>크게</span>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-2">확대 효과</h3>
								<div className="flex items-center mb-4">
									<input type="checkbox" id="magnification" checked={state.dock.magnification} onChange={(e) => setDockMagnification(e.target.checked)} className="mr-2" />
									<label htmlFor="magnification">확대 효과 사용</label>
								</div>

								{state.dock.magnification && (
									<div>
										<input type="range" min="1.1" max="2" step="0.1" value={state.dock.magnificationLevel} onChange={(e) => setDockMagnificationLevel(parseFloat(e.target.value))} className="w-full" />
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
									<button className={`px-4 py-2 rounded-lg ${state.dock.position === "bottom" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => setDockPosition("bottom")}>
										하단
									</button>
									<button className={`px-4 py-2 rounded-lg ${state.dock.position === "left" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => setDockPosition("left")}>
										왼쪽
									</button>
									<button className={`px-4 py-2 rounded-lg ${state.dock.position === "right" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`} onClick={() => setDockPosition("right")}>
										오른쪽
									</button>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-2">자동 숨김</h3>
								<div className="flex items-center">
									<input type="checkbox" id="autohide" checked={state.dock.autohide} onChange={(e) => setDockAutohide(e.target.checked)} className="mr-2" />
									<label htmlFor="autohide">Dock 자동 숨김</label>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
