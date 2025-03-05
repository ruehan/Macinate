import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 브라우저 환경인지 확인
const isBrowser = typeof window !== "undefined";

// 로드맵 항목 인터페이스
interface RoadmapItem {
	id: string;
	title: string;
	description: string;
	status: "planned" | "in-progress" | "completed";
	priority: "low" | "medium" | "high";
	createdAt: string;
}

// 초기 데이터 - 깃 커밋 내역 기반
const initialItems: RoadmapItem[] = [
	{
		id: "1",
		title: "기본 레이아웃 및 UI 구현",
		description: "Mac OS 기본 레이아웃, 상단 메뉴바, 애플 로고, 상태 아이콘 구현",
		status: "completed",
		priority: "high",
		createdAt: "2025-03-04T10:00:00.000Z",
	},
	{
		id: "2",
		title: "하단 Dock 구현",
		description: "화면 하단에 앱 독 추가, 위치 조정, 아이콘 변경 및 앱 실행 기능 구현",
		status: "completed",
		priority: "high",
		createdAt: "2025-03-04T11:30:00.000Z",
	},
	{
		id: "3",
		title: "윈도우 관리 시스템 구현",
		description: "창 열기, 닫기, 최소화, 최대화, 이동, 크기 조절 기능 및 윈도우 상태 관리 로직 구현",
		status: "completed",
		priority: "high",
		createdAt: "2025-03-04T14:20:00.000Z",
	},
	{
		id: "4",
		title: "파일 시스템 및 Finder 구현",
		description: "파일 시스템 컨텍스트 추가 및 Finder 앱 구현으로 파일 및 폴더 탐색 기능 제공",
		status: "completed",
		priority: "high",
		createdAt: "2025-03-04T16:45:00.000Z",
	},
	{
		id: "5",
		title: "Safari 브라우저 구현",
		description: "웹 브라우징 기능을 제공하는 Safari 앱 구현 및 Dock에 추가",
		status: "completed",
		priority: "medium",
		createdAt: "2025-03-04T18:30:00.000Z",
	},
	{
		id: "6",
		title: "메모 앱 구현",
		description: "텍스트 노트를 작성하고 저장할 수 있는 메모 앱 구현",
		status: "completed",
		priority: "medium",
		createdAt: "2025-03-05T09:15:00.000Z",
	},
	{
		id: "7",
		title: "Spotlight 검색 구현",
		description: "시스템 전체 검색 기능을 제공하는 Spotlight 검색 기능 구현",
		status: "completed",
		priority: "medium",
		createdAt: "2025-03-05T10:30:00.000Z",
	},
	{
		id: "8",
		title: "시스템 설정 앱 구현",
		description: "배경화면, 독 설정 등 시스템 환경을 변경할 수 있는 설정 앱 구현",
		status: "completed",
		priority: "high",
		createdAt: "2025-03-05T11:45:00.000Z",
	},
	{
		id: "9",
		title: "로그인 시스템 구현",
		description: "사용자 인증 및 로그인 화면 구현으로 보안 기능 추가",
		status: "completed",
		priority: "high",
		createdAt: "2025-03-05T14:20:00.000Z",
	},
	{
		id: "10",
		title: "UI 버그 수정",
		description: "윈도우 내부 화면이 짤리는 문제, 색상 표시 오류, 독 크기 적용 문제 등 다양한 UI 버그 수정",
		status: "completed",
		priority: "medium",
		createdAt: "2025-03-05T15:40:00.000Z",
	},
	{
		id: "11",
		title: "로드맵 앱 개선",
		description: "로드맵 앱의 UI 개선 및 기능 확장 (그리드/리스트 보기, 정렬, 필터링 등)",
		status: "completed",
		priority: "medium",
		createdAt: "2025-03-05T16:30:00.000Z",
	},
	{
		id: "12",
		title: "다크 모드 지원",
		description: "전체 UI에 다크 모드 테마 적용 기능 구현",
		status: "planned",
		priority: "medium",
		createdAt: "2025-03-06T09:20:00.000Z",
	},
	{
		id: "13",
		title: "알림 시스템 구현",
		description: "시스템 알림 및 알림 센터 구현",
		status: "planned",
		priority: "low",
		createdAt: "2025-03-07T11:15:00.000Z",
	},
	{
		id: "14",
		title: "멀티태스킹 개선",
		description: "여러 앱 간의 전환 및 분할 화면 기능 구현",
		status: "planned",
		priority: "medium",
		createdAt: "2025-03-08T14:00:00.000Z",
	},
	{
		id: "15",
		title: "앱 스토어 구현",
		description: "앱 설치 및 관리를 위한 앱 스토어 구현",
		status: "planned",
		priority: "low",
		createdAt: "2025-03-10T10:30:00.000Z",
	},
	{
		id: "16",
		title: "위젯 시스템 구현",
		description: "바탕화면에 위젯을 추가하고 관리할 수 있는 기능 구현",
		status: "planned",
		priority: "medium",
		createdAt: "2025-03-12T09:45:00.000Z",
	},
	{
		id: "17",
		title: "성능 최적화",
		description: "앱 전반의 성능 개선 및 메모리 사용량 최적화",
		status: "planned",
		priority: "high",
		createdAt: "2025-03-15T13:00:00.000Z",
	},
	{
		id: "18",
		title: "접근성 기능 개선",
		description: "화면 확대/축소, 고대비 모드, 스크린 리더 지원 등 접근성 기능 추가",
		status: "planned",
		priority: "medium",
		createdAt: "2025-03-18T11:30:00.000Z",
	},
];

const RoadmapApp: React.FC = () => {
	if (isBrowser) {
		console.log("RoadmapApp 컴포넌트가 렌더링됩니다.");
	}

	const [items, setItems] = useState<RoadmapItem[]>([]);
	const [filter, setFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("date-desc"); // 기본 정렬: 날짜 내림차순
	const [isLoaded, setIsLoaded] = useState(false);
	const [viewMode, setViewMode] = useState<"list" | "grid">("grid"); // 기본 보기 모드: 그리드

	// 컴포넌트가 마운트될 때 초기 데이터 로드
	useEffect(() => {
		if (isBrowser) {
			console.log("RoadmapApp 컴포넌트가 마운트되었습니다.");
			console.log("초기 데이터:", initialItems);
			setItems(initialItems);
			setIsLoaded(true);
		}
	}, []);

	// 필터링된 항목 가져오기
	const getFilteredItems = () => {
		let filtered = items;

		// 상태 필터링
		if (filter !== "all") {
			filtered = filtered.filter((item) => item.status === filter);
		}

		// 정렬
		return sortItems(filtered, sortBy);
	};

	// 항목 정렬
	const sortItems = (items: RoadmapItem[], sortBy: string) => {
		const sorted = [...items];

		switch (sortBy) {
			case "date-asc":
				return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
			case "date-desc":
				return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			case "priority-high":
				return sorted.sort((a, b) => {
					const priorityOrder = { high: 0, medium: 1, low: 2 };
					return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
				});
			case "priority-low":
				return sorted.sort((a, b) => {
					const priorityOrder = { high: 0, medium: 1, low: 2 };
					return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
				});
			default:
				return sorted;
		}
	};

	// 상태에 따른 배경색 가져오기
	const getStatusBgColor = (status: string) => {
		switch (status) {
			case "planned":
				return "bg-blue-100 text-blue-800";
			case "in-progress":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// 우선순위에 따른 배경색 가져오기
	const getPriorityBgColor = (priority: string) => {
		switch (priority) {
			case "low":
				return "bg-gray-100 text-gray-800";
			case "medium":
				return "bg-blue-100 text-blue-800";
			case "high":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// 날짜 포맷팅
	const formatDate = (dateString: string, status: string) => {
		// 예정된 항목은 날짜를 표시하지 않음
		if (status === "planned") {
			return "";
		}

		// UTC 시간을 한국 시간(KST)으로 변환 (UTC+9)
		const utcDate = new Date(dateString);
		const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

		const now = new Date();
		const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

		const today = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// 날짜 포맷 (시간 제외)
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "Asia/Seoul",
		};

		const kstDateString = kstDate.toDateString();
		const todayString = today.toDateString();
		const yesterdayString = yesterday.toDateString();

		if (kstDateString === todayString) {
			return "오늘";
		} else if (kstDateString === yesterdayString) {
			return "어제";
		} else {
			return kstDate.toLocaleDateString("ko-KR", options);
		}
	};

	// 서버 사이드 렌더링 중에는 간단한 로딩 표시
	if (!isBrowser) {
		console.log("서버 사이드 렌더링 중입니다.");
		return (
			<div className="h-full flex items-center justify-center bg-white">
				<p>로드맵 앱을 불러오는 중...</p>
			</div>
		);
	}

	// 클라이언트 사이드에서 데이터가 로드되기 전에는 로딩 표시
	if (!isLoaded) {
		console.log("클라이언트 사이드에서 데이터 로딩 중입니다.");
		return (
			<div className="h-full flex items-center justify-center bg-white">
				<p>로드맵 데이터를 불러오는 중...</p>
			</div>
		);
	}

	const filteredItems = getFilteredItems();

	return (
		<div className="h-full flex flex-col bg-white rounded-md overflow-hidden">
			{/* 헤더 */}
			<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white">
				<h1 className="text-2xl font-bold">개발 로드맵</h1>
				<p className="text-sm opacity-80 mt-1">프로젝트 개발 상황 및 향후 계획</p>
			</div>

			{/* 필터 및 정렬 */}
			<div className="flex flex-wrap items-center justify-between p-4 border-b bg-gray-50">
				<div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
					<button
						className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "all" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
						onClick={() => setFilter("all")}
					>
						전체
					</button>
					<button
						className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "planned" ? "bg-blue-200 text-blue-800" : "bg-gray-100 text-gray-600 hover:bg-blue-100"}`}
						onClick={() => setFilter("planned")}
					>
						예정됨
					</button>
					<button
						className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "in-progress" ? "bg-yellow-200 text-yellow-800" : "bg-gray-100 text-gray-600 hover:bg-yellow-100"}`}
						onClick={() => setFilter("in-progress")}
					>
						진행 중
					</button>
					<button
						className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "completed" ? "bg-green-200 text-green-800" : "bg-gray-100 text-gray-600 hover:bg-green-100"}`}
						onClick={() => setFilter("completed")}
					>
						완료됨
					</button>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center">
						<span className="text-sm text-gray-500 mr-2">정렬:</span>
						<select className="text-sm border rounded-md px-3 py-1.5 bg-white" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
							<option value="date-desc">최신순</option>
							<option value="date-asc">오래된순</option>
							<option value="priority-high">우선순위 높은순</option>
							<option value="priority-low">우선순위 낮은순</option>
						</select>
					</div>

					<div className="flex items-center border rounded-md overflow-hidden">
						<button className={`px-3 py-1.5 text-sm ${viewMode === "list" ? "bg-gray-200" : "bg-white"}`} onClick={() => setViewMode("list")} title="리스트 보기">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
						<button className={`px-3 py-1.5 text-sm ${viewMode === "grid" ? "bg-gray-200" : "bg-white"}`} onClick={() => setViewMode("grid")} title="그리드 보기">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* 항목 목록 */}
			<div className="flex-1 overflow-y-auto p-5 bg-gray-50">
				{filteredItems.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
						<p className="text-lg font-medium">표시할 항목이 없습니다.</p>
						<p className="mt-1">다른 필터를 선택해보세요.</p>
					</div>
				) : viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{filteredItems.map((item) => (
							<motion.div
								key={item.id}
								className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
							>
								<div className="p-4 border-b">
									<div className="flex justify-between items-start">
										<h3 className="font-medium text-gray-900 text-lg">{item.title}</h3>
										<div className="flex space-x-2 ml-2">
											<span className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(item.status)}`}>
												{item.status === "planned" ? "예정됨" : item.status === "in-progress" ? "진행 중" : "완료됨"}
											</span>
										</div>
									</div>
								</div>
								<div className="p-4">
									<p className="text-sm text-gray-600 mb-3">{item.description}</p>
									<div className="flex justify-between items-center">
										<span className={`text-xs px-2 py-1 rounded-full ${getPriorityBgColor(item.priority)}`}>
											{item.priority === "low" ? "낮은 우선순위" : item.priority === "medium" ? "중간 우선순위" : "높은 우선순위"}
										</span>
										<div className="text-xs text-gray-400">{formatDate(item.createdAt, item.status)}</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				) : (
					<div className="space-y-4">
						{filteredItems.map((item) => (
							<motion.div
								key={item.id}
								className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
							>
								<div className="flex justify-between items-start mb-2">
									<h3 className="font-medium text-gray-900 text-lg">{item.title}</h3>
									<div className="flex space-x-2">
										<span className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(item.status)}`}>
											{item.status === "planned" ? "예정됨" : item.status === "in-progress" ? "진행 중" : "완료됨"}
										</span>
										<span className={`text-xs px-2 py-1 rounded-full ${getPriorityBgColor(item.priority)}`}>{item.priority === "low" ? "낮음" : item.priority === "medium" ? "중간" : "높음"}</span>
									</div>
								</div>
								<p className="text-sm text-gray-600 mb-2">{item.description}</p>
								{formatDate(item.createdAt, item.status) && <div className="text-xs text-gray-400 text-right">{formatDate(item.createdAt, item.status)}</div>}
							</motion.div>
						))}
					</div>
				)}
			</div>

			{/* 상태 요약 */}
			<div className="p-3 border-t bg-white flex justify-between items-center text-sm text-gray-500">
				<div>
					총 {items.length}개 항목 중 {items.filter((item) => item.status === "completed").length}개 완료
				</div>
				<div className="flex items-center gap-2">
					<div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
						<div className="h-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${(items.filter((item) => item.status === "completed").length / items.length) * 100}%` }}></div>
					</div>
					<span>{Math.round((items.filter((item) => item.status === "completed").length / items.length) * 100)}%</span>
				</div>
			</div>
		</div>
	);
};

export default RoadmapApp;
