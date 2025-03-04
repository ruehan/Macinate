import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import useDraggable from "~/hooks/useDraggable";
import useResizable, { ResizeDirection } from "~/hooks/useResizable";
import { Window } from "~/store/WindowContext";
import WindowTitleBar from "./WindowTitleBar";

interface WindowFrameProps {
	window: Window;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	onFocus: () => void;
	onMove: (position: { x: number; y: number }) => void;
	onResize: (size: { width: number; height: number }) => void;
	children: React.ReactNode;
}

export default function WindowFrame({ window, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, children }: WindowFrameProps) {
	const windowRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// 드래그 기능 설정
	const { handleRef: dragHandleRef } = useDraggable({
		initialPosition: window.position,
		onDrag: onMove,
		disabled: window.isMaximized,
	});

	// 리사이즈 기능 설정
	const { handleRef: resizeHandleRef } = useResizable({
		initialSize: window.size,
		onResize,
		disabled: window.isMaximized,
	});

	// 창이 최소화되거나 최대화될 때 애니메이션 설정
	const variants = {
		open: {
			scale: 1,
			opacity: 1,
			transition: { type: "spring", stiffness: 300, damping: 25 },
			// top: window.position.y,
			// left: window.position.x,
		},
		minimized: {
			scale: 0.5,
			opacity: 0,
			top: 100,
			transition: { duration: 0.3 },
		},
		maximized: {
			left: 0,
			top: 0,
			width: "100%",
			height: "calc(100% - 28px)", // 메뉴바 높이 제외
			transition: { duration: 0.3 },
		},
	};

	// 창 클릭 시 포커스 설정
	useEffect(() => {
		const handleWindowClick = () => {
			if (!window.isFocused) {
				onFocus();
			}
		};

		const windowElement = windowRef.current;
		if (windowElement) {
			windowElement.addEventListener("mousedown", handleWindowClick);

			return () => {
				windowElement.removeEventListener("mousedown", handleWindowClick);
			};
		}
	}, [window.isFocused, onFocus]);

	// 드래그 시작 처리 함수
	const handleDragStart = (e: React.MouseEvent) => {
		// 최대화된 상태에서는 드래그 불가
		if (window.isMaximized) return;

		// 컨텐츠 영역에서는 드래그 처리하지 않음
		if (contentRef.current && contentRef.current.contains(e.target as Node)) {
			return;
		}

		const handleElement = dragHandleRef.current;
		if (handleElement) {
			// 드래그 핸들의 mousedown 이벤트를 시뮬레이션
			const customEvent = new MouseEvent("mousedown", {
				bubbles: true,
				cancelable: true,
				clientX: e.clientX,
				clientY: e.clientY,
				button: 0,
			});

			handleElement.dispatchEvent(customEvent);
		}
	};

	// 리사이즈 방향 처리 함수
	const handleResizeStart = (direction: ResizeDirection) => (e: React.MouseEvent) => {
		const handleElement = resizeHandleRef.current;
		if (handleElement) {
			// 원래 리사이즈 핸들의 mousedown 이벤트를 시뮬레이션하면서 방향 정보 추가
			const customEvent = new MouseEvent("mousedown", {
				bubbles: true,
				cancelable: true,
				clientX: e.clientX,
				clientY: e.clientY,
				button: 0,
			});

			// 방향 정보 추가
			Object.defineProperty(customEvent, "resizeDirection", {
				value: direction,
				writable: false,
			});

			handleElement.dispatchEvent(customEvent);
		}

		// 이벤트 전파 중지
		e.stopPropagation();
	};

	// 창이 숨겨져 있으면 렌더링하지 않음
	if (window.isMinimized) {
		return null;
	}

	return (
		<motion.div
			ref={windowRef}
			className={`absolute rounded-lg overflow-hidden shadow-window ${window.isFocused ? "ring-1 ring-gray-400" : "ring-1 ring-gray-300"}`}
			style={{
				width: window.size.width,
				height: window.size.height,
				left: window.position.x,
				top: window.position.y,
				zIndex: window.zIndex,
				backgroundColor: "rgba(255, 255, 255, 0.85)",
				backdropFilter: "blur(10px)",
			}}
			animate={window.isMaximized ? "maximized" : "open"}
			variants={variants}
			initial="open"
			onMouseDown={handleDragStart}
		>
			{/* 드래그 핸들 (숨겨진 요소) */}
			<div ref={dragHandleRef as React.RefObject<HTMLDivElement>} className="hidden" />

			{/* 창 제목 표시줄 */}
			<WindowTitleBar title={window.title} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} isFocused={window.isFocused} appIcon={window.appIcon} />

			{/* 창 내용 */}
			<div ref={contentRef} className="h-full overflow-auto p-4">
				{children}
			</div>

			{/* 리사이즈 핸들 (우측 하단, 하단, 우측) */}
			{!window.isMaximized && (
				<>
					{/* 우측 하단 핸들 */}
					<div ref={resizeHandleRef as React.RefObject<HTMLDivElement>} className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" style={{ touchAction: "none" }} />
					{/* 하단 핸들 */}
					<div className="absolute bottom-0 left-4 right-4 h-2 cursor-ns-resize" style={{ touchAction: "none" }} onMouseDown={handleResizeStart("bottom")} />
					{/* 우측 핸들 */}
					<div className="absolute top-4 bottom-4 right-0 w-2 cursor-ew-resize" style={{ touchAction: "none" }} onMouseDown={handleResizeStart("right")} />
				</>
			)}
		</motion.div>
	);
}
