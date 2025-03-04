import React, { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiRefreshCw, FiHome, FiPlus, FiX, FiAlertCircle } from "react-icons/fi";

interface Tab {
	id: string;
	title: string;
	url: string;
	favicon?: string;
	isLoading: boolean;
	error?: string;
}

export default function SafariApp() {
	const [tabs, setTabs] = useState<Tab[]>([{ id: "1", title: "New Tab", url: "about:blank", favicon: "", isLoading: false }]);
	const [activeTabId, setActiveTabId] = useState<string>("1");
	const [inputUrl, setInputUrl] = useState<string>("");
	const [canGoBack, setCanGoBack] = useState<boolean>(false);
	const [canGoForward, setCanGoForward] = useState<boolean>(false);
	const [history, setHistory] = useState<{ [tabId: string]: string[] }>({ "1": ["about:blank"] });
	const [historyIndex, setHistoryIndex] = useState<{ [tabId: string]: number }>({ "1": 0 });

	const inputRef = useRef<HTMLInputElement>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

	useEffect(() => {
		if (activeTab.isLoading && activeTab.url !== "about:blank") {
			console.log("로딩 타임아웃 설정:", activeTab.url);

			const timeoutId = setTimeout(() => {
				console.log("로딩 타임아웃 발생:", activeTab.url);

				const currentTab = tabs.find((tab) => tab.id === activeTabId);
				if (currentTab && currentTab.isLoading) {
					const updatedTabs = tabs.map((tab) => {
						if (tab.id === activeTabId) {
							return {
								...tab,
								isLoading: false,
								error: "웹 페이지 로딩 시간이 초과되었습니다. 네트워크 연결을 확인하거나 다시 시도해 주세요.",
							};
						}
						return tab;
					});

					setTabs(updatedTabs);
				}
			}, 10000); // 10초 타임아웃

			return () => clearTimeout(timeoutId);
		}
	}, [activeTab.isLoading, activeTab.url, activeTabId, tabs]);

	const createNewTab = () => {
		const newTabId = Date.now().toString();
		const newTab: Tab = {
			id: newTabId,
			title: "New Tab",
			url: "about:blank",
			favicon: "",
			isLoading: false,
		};

		setTabs([...tabs, newTab]);
		setActiveTabId(newTabId);
		setInputUrl("");
		setHistory({ ...history, [newTabId]: ["about:blank"] });
		setHistoryIndex({ ...historyIndex, [newTabId]: 0 });
	};

	const closeTab = (tabId: string, e: React.MouseEvent) => {
		e.stopPropagation();

		if (tabs.length === 1) {
			const resetTab: Tab = {
				id: "1",
				title: "New Tab",
				url: "about:blank",
				favicon: "",
				isLoading: false,
			};
			setTabs([resetTab]);
			setActiveTabId("1");
			setInputUrl("");
			setHistory({ "1": ["about:blank"] });
			setHistoryIndex({ "1": 0 });
			return;
		}

		const newTabs = tabs.filter((tab) => tab.id !== tabId);
		setTabs(newTabs);

		if (tabId === activeTabId) {
			const newActiveTab = newTabs[0];
			setActiveTabId(newActiveTab.id);
			setInputUrl(newActiveTab.url !== "about:blank" ? newActiveTab.url : "");
		}
	};

	const changeTab = (tabId: string) => {
		setActiveTabId(tabId);
		const tab = tabs.find((tab) => tab.id === tabId);
		if (tab) {
			setInputUrl(tab.url !== "about:blank" ? tab.url : "");
		}
	};

	const loadUrl = (url: string) => {
		if (!url.trim()) return;

		let formattedUrl = url;
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			if (!url.includes(".")) {
				formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
			} else {
				formattedUrl = `https://${url}`;
			}
		}

		const updatedTabs = tabs.map((tab) => {
			if (tab.id === activeTabId) {
				return {
					...tab,
					url: formattedUrl,
					title: getDomainFromUrl(formattedUrl) || "Loading...",
					isLoading: true,
					error: undefined,
				};
			}
			return tab;
		});

		setTabs(updatedTabs);
		setInputUrl(formattedUrl);

		const tabHistory = [...(history[activeTabId] || [])];
		const currentIndex = historyIndex[activeTabId] || 0;

		const newHistory = tabHistory.slice(0, currentIndex + 1);
		newHistory.push(formattedUrl);

		setHistory({
			...history,
			[activeTabId]: newHistory,
		});

		setHistoryIndex({
			...historyIndex,
			[activeTabId]: newHistory.length - 1,
		});

		setCanGoBack(newHistory.length > 1);
		setCanGoForward(false);

		setTimeout(() => {
			const updatedTabsAfterLoad = tabs.map((tab) => {
				if (tab.id === activeTabId) {
					return { ...tab, isLoading: false };
				}
				return tab;
			});
			setTabs(updatedTabsAfterLoad);
		}, 800); // 0.8초 후 로딩 상태 해제
	};

	const handleLoadError = (url: string, errorMessage: string) => {
		const updatedTabs = tabs.map((tab) => {
			if (tab.id === activeTabId) {
				return {
					...tab,
					isLoading: false,
					error: `웹 페이지를 로드할 수 없습니다: ${errorMessage}`,
				};
			}
			return tab;
		});

		setTabs(updatedTabs);
	};

	const goBack = () => {
		if (!canGoBack) return;

		const tabHistory = history[activeTabId] || [];
		const currentIndex = historyIndex[activeTabId] || 0;

		if (currentIndex > 0) {
			const newIndex = currentIndex - 1;
			const previousUrl = tabHistory[newIndex];

			setHistoryIndex({
				...historyIndex,
				[activeTabId]: newIndex,
			});

			const updatedTabs = tabs.map((tab) => {
				if (tab.id === activeTabId) {
					return {
						...tab,
						url: previousUrl,
						title: getDomainFromUrl(previousUrl) || "Untitled",
						isLoading: previousUrl !== "about:blank",
					};
				}
				return tab;
			});

			setTabs(updatedTabs);
			setInputUrl(previousUrl !== "about:blank" ? previousUrl : "");
			setCanGoBack(newIndex > 0);
			setCanGoForward(true);

			if (previousUrl !== "about:blank") {
				setTimeout(() => {
					const updatedTabsAfterLoad = tabs.map((tab) => {
						if (tab.id === activeTabId) {
							return { ...tab, isLoading: false };
						}
						return tab;
					});
					setTabs(updatedTabsAfterLoad);
				}, 800); // 0.8초 후 로딩 상태 해제
			}
		}
	};

	const goForward = () => {
		if (!canGoForward) return;

		const tabHistory = history[activeTabId] || [];
		const currentIndex = historyIndex[activeTabId] || 0;

		if (currentIndex < tabHistory.length - 1) {
			const newIndex = currentIndex + 1;
			const nextUrl = tabHistory[newIndex];

			setHistoryIndex({
				...historyIndex,
				[activeTabId]: newIndex,
			});

			// 탭 업데이트
			const updatedTabs = tabs.map((tab) => {
				if (tab.id === activeTabId) {
					return {
						...tab,
						url: nextUrl,
						title: getDomainFromUrl(nextUrl) || "Untitled",
						isLoading: nextUrl !== "about:blank",
					};
				}
				return tab;
			});

			setTabs(updatedTabs);
			setInputUrl(nextUrl !== "about:blank" ? nextUrl : "");
			setCanGoBack(true);
			setCanGoForward(newIndex < tabHistory.length - 1);

			if (nextUrl !== "about:blank") {
				setTimeout(() => {
					const updatedTabsAfterLoad = tabs.map((tab) => {
						if (tab.id === activeTabId) {
							return { ...tab, isLoading: false };
						}
						return tab;
					});
					setTabs(updatedTabsAfterLoad);
				}, 800); // 0.8초 후 로딩 상태 해제
			}
		}
	};

	const refresh = () => {
		if (activeTab.url === "about:blank") return;

		const updatedTabs = tabs.map((tab) => {
			if (tab.id === activeTabId) {
				return { ...tab, isLoading: true, error: undefined };
			}
			return tab;
		});

		setTabs(updatedTabs);

		setTimeout(() => {
			const updatedTabsAfterLoad = tabs.map((tab) => {
				if (tab.id === activeTabId) {
					return { ...tab, isLoading: false };
				}
				return tab;
			});
			setTabs(updatedTabsAfterLoad);
		}, 800); // 0.8초 후 로딩 상태 해제
	};

	const goHome = () => {
		loadUrl("https://www.google.com");
	};

	const handleUrlSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loadUrl(inputUrl);
	};

	const getDomainFromUrl = (url: string): string => {
		if (url === "about:blank") return "New Tab";

		try {
			const urlObj = new URL(url);
			return urlObj.hostname;
		} catch (error) {
			return url;
		}
	};

	const getProxyUrl = (url: string): string => {
		if (url === "about:blank") return "about:blank";

		const isHttps = window.location.protocol === "https:";
		const host = isHttps ? window.location.host : window.location.host;
		const protocol = isHttps ? "https://" : "";

		return `${protocol}${host}/proxy?url=${encodeURIComponent(url)}`;
	};

	const handleIframeLoad = () => {
		console.log("iframe 로드 완료:", activeTab.url);

		const updatedTabs = tabs.map((tab) => {
			if (tab.id === activeTabId) {
				return { ...tab, isLoading: false };
			}
			return tab;
		});

		setTabs(updatedTabs);

		try {
			if (iframeRef.current && iframeRef.current.contentDocument) {
				const title = iframeRef.current.contentDocument.title;
				if (title) {
					const updatedTabsWithTitle = tabs.map((tab) => {
						if (tab.id === activeTabId) {
							return { ...tab, title };
						}
						return tab;
					});

					setTabs(updatedTabsWithTitle);
				}
			}
		} catch (error) {
			console.log("Cannot access iframe content due to same-origin policy");

			const domain = getDomainFromUrl(activeTab.url);
			if (domain && domain !== "New Tab") {
				const updatedTabsWithDomain = tabs.map((tab) => {
					if (tab.id === activeTabId && tab.title === "Loading...") {
						return { ...tab, title: domain };
					}
					return tab;
				});

				setTabs(updatedTabsWithDomain);
			}
		}
	};

	const handleIframeError = () => {
		console.error("iframe 로드 오류:", activeTab.url);
		handleLoadError(activeTab.url, "프록시 서버에서 콘텐츠를 가져오는 중 오류가 발생했습니다.");
	};

	const renderWebContent = () => {
		if (activeTab.url === "about:blank") {
			return (
				<div className="flex flex-col items-center justify-center h-full bg-gray-100 text-black">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">새 탭</h2>
					<div className="flex flex-wrap justify-center gap-4 max-w-2xl">
						{/* 자주 방문하는 사이트 바로가기 */}
						{[
							{ url: "https://www.google.com", name: "Google", color: "bg-blue-100", textColor: "text-blue-600" },
							{ url: "https://www.naver.com", name: "Naver", color: "bg-green-100", textColor: "text-green-600" },
							{ url: "https://www.youtube.com", name: "YouTube", color: "bg-red-100", textColor: "text-red-600" },
						].map((site) => (
							<div key={site.url} className="w-24 h-24 bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-50" onClick={() => loadUrl(site.url)}>
								<div className={`w-12 h-12 ${site.color} rounded-full flex items-center justify-center ${site.textColor} mb-2`}>
									<span className="text-xl font-bold">{site.name[0]}</span>
								</div>
								<span className="text-xs text-center text-gray-900 truncate w-full">{site.name}</span>
							</div>
						))}
					</div>
				</div>
			);
		}
		return (
			<div className="relative w-full h-full">
				{activeTab.isLoading && (
					<div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
						<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				)}
				{activeTab.error ? (
					<div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
						<div className="bg-white rounded-lg shadow-md p-6 max-w-md">
							<h2 className="text-xl font-semibold text-red-600 mb-4">페이지를 로드할 수 없습니다</h2>
							<p className="text-gray-700 mb-4">{activeTab.error}</p>
							<p className="text-gray-600 mb-6 text-sm">
								URL: <span className="font-mono">{activeTab.url}</span>
							</p>
							<div className="flex justify-center space-x-4">
								<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" onClick={() => refresh()}>
									새로고침
								</button>
								<button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors" onClick={() => goHome()}>
									홈으로
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full bg-white p-8">
						<div className="max-w-2xl w-full bg-gray-100 rounded-lg shadow-lg p-6">
							<div className="flex items-center mb-6">
								<div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 mr-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-bold text-gray-900">{getDomainFromUrl(activeTab.url)}</h2>
									<p className="text-gray-600 text-sm">{activeTab.url}</p>
								</div>
							</div>

							<div className="bg-white rounded-lg p-4 mb-6 border border-gray-300">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">보안 정책 알림</h3>
								<p className="text-gray-700 mb-4">이 웹사이트는 현재 iframe에서 로드할 수 없습니다. 대부분의 웹사이트는 보안상의 이유로 iframe 내에서 표시되는 것을 제한하고 있습니다.</p>
								<div className="bg-blue-100 p-3 rounded text-blue-800 text-sm">
									<p>X-Frame-Options: SAMEORIGIN 또는 Content-Security-Policy 헤더로 인해 iframe 내에서 콘텐츠를 표시할 수 없습니다.</p>
								</div>
							</div>

							<div className="bg-gray-200 p-4 rounded-lg">
								<h3 className="text-md font-medium text-gray-900 mb-2">웹사이트 정보</h3>
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="text-gray-700">URL:</div>
									<div className="text-gray-900 font-mono truncate">{activeTab.url}</div>
									<div className="text-gray-700">도메인:</div>
									<div className="text-gray-900">{getDomainFromUrl(activeTab.url)}</div>
								</div>
							</div>

							<div className="mt-6 bg-yellow-100 border border-yellow-300 rounded-lg p-4">
								<div className="flex items-center mb-2">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
									</svg>
									<h3 className="text-md font-semibold text-yellow-800">개발 중인 기능</h3>
								</div>
								<p className="text-yellow-800 text-sm">현재 보안 정책 문제로 인해 외부 웹사이트를 직접 표시할 수 없습니다. 개발팀이 이 문제를 해결하기 위해 작업 중입니다.</p>
								<div className="mt-3 text-xs text-yellow-800 bg-yellow-200 p-2 rounded">
									<p>다음 업데이트에서는 더 많은 웹사이트를 볼 수 있도록 개선될 예정입니다. 불편을 드려 죄송합니다.</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="flex flex-col h-full bg-white text-black">
			{/* 탭 바 */}
			<div className="flex items-center bg-gray-100 border-b border-gray-200">
				<div className="flex-1 flex overflow-x-auto">
					{tabs.map((tab) => (
						<div
							key={tab.id}
							className={`flex items-center min-w-[120px] max-w-[200px] h-8 px-3 mr-1 rounded-t-md cursor-pointer ${
								tab.id === activeTabId ? "bg-white border-b-0 text-black" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
							}`}
							onClick={() => changeTab(tab.id)}
						>
							{tab.isLoading ? (
								<div className="text-blue-500 animate-spin mr-1 w-4 h-4">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
								</div>
							) : tab.favicon ? (
								<img src={tab.favicon} alt="" className="w-4 h-4 mr-1" />
							) : null}
							<div className="flex-1 truncate text-sm">{tab.title}</div>
							<button className="ml-2 text-gray-500 hover:text-gray-700" onClick={(e) => closeTab(tab.id, e)}>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					))}
				</div>
				<button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full mx-1" onClick={createNewTab}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>

			{/* 주소 표시줄 */}
			<div className="flex items-center p-2 bg-gray-100 border-b border-gray-200">
				<button
					className={`w-8 h-8 flex items-center justify-center rounded-full mr-1 ${canGoBack ? "text-gray-600 hover:bg-gray-200" : "text-gray-400 cursor-not-allowed"}`}
					onClick={goBack}
					disabled={!canGoBack}
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					className={`w-8 h-8 flex items-center justify-center rounded-full mr-1 ${canGoForward ? "text-gray-600 hover:bg-gray-200" : "text-gray-400 cursor-not-allowed"}`}
					onClick={goForward}
					disabled={!canGoForward}
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
				<button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full mr-1" onClick={refresh}>
					<svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeTab.isLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</button>
				<button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full mr-1" onClick={goHome}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2" />
					</svg>
				</button>

				<form onSubmit={handleUrlSubmit} className="flex-1 flex">
					<input
						type="text"
						className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
						value={inputUrl}
						onChange={(e) => setInputUrl(e.target.value)}
						placeholder="Search or enter website name"
					/>
				</form>
			</div>

			{/* 웹 페이지 표시 영역 */}
			<div className="flex-1 bg-white overflow-hidden text-black">{renderWebContent()}</div>
		</div>
	);
}
