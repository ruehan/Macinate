import { useState, useEffect, useRef, RefObject } from "react";

interface Size {
	width: number;
	height: number;
}

// 리사이즈 방향 타입 추가
export type ResizeDirection = "bottom" | "right" | "bottom-right" | "left" | "top" | "top-left" | "top-right" | "bottom-left";

interface UseResizableOptions {
	initialSize?: Size;
	minSize?: Size;
	maxSize?: Size;
	onResizeStart?: (size: Size) => void;
	onResize?: (size: Size, positionDelta?: { x: number; y: number }) => void;
	onResizeEnd?: (size: Size) => void;
	disabled?: boolean;
}

interface UseResizableReturn {
	size: Size;
	handleRef: RefObject<HTMLElement>;
	isResizing: boolean;
}

export default function useResizable({
	initialSize = { width: 400, height: 300 },
	minSize = { width: 200, height: 150 },
	maxSize = { width: 2000, height: 1500 },
	onResizeStart,
	onResize,
	onResizeEnd,
	disabled = false,
}: UseResizableOptions = {}): UseResizableReturn {
	const [size, setSize] = useState<Size>(initialSize);
	const [isResizing, setIsResizing] = useState(false);
	const handleRef = useRef<HTMLElement>(null);
	// 현재 리사이즈 방향을 저장하는 ref
	const currentDirectionRef = useRef<ResizeDirection>("bottom-right");

	// 리사이즈 시작 위치와 요소 크기를 저장하는 ref
	const resizeOriginRef = useRef<{
		mouseX: number;
		mouseY: number;
		elementWidth: number;
		elementHeight: number;
	}>({
		mouseX: 0,
		mouseY: 0,
		elementWidth: 0,
		elementHeight: 0,
	});

	useEffect(() => {
		const resizeHandleElement = handleRef.current;

		if (!resizeHandleElement || disabled) return;

		const onMouseDown = (e: MouseEvent) => {
			// 마우스 왼쪽 버튼만 처리
			if (e.button !== 0) return;

			// 리사이즈 시작 위치 저장
			resizeOriginRef.current = {
				mouseX: e.clientX,
				mouseY: e.clientY,
				elementWidth: size.width,
				elementHeight: size.height,
			};

			// 커스텀 이벤트 데이터에서 방향 정보 가져오기
			const direction = (e as any).resizeDirection as ResizeDirection;
			if (direction) {
				currentDirectionRef.current = direction;
			} else {
				// 기본값은 우측 하단 (대각선) 리사이즈
				currentDirectionRef.current = "bottom-right";
			}

			setIsResizing(true);

			if (onResizeStart) {
				onResizeStart(size);
			}

			// 텍스트 선택 방지
			e.preventDefault();
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isResizing) return;

			// 이동 거리 계산
			const deltaX = e.clientX - resizeOriginRef.current.mouseX;
			const deltaY = e.clientY - resizeOriginRef.current.mouseY;

			// 새 크기 계산 (방향에 따라 다르게 처리)
			let newWidth = resizeOriginRef.current.elementWidth;
			let newHeight = resizeOriginRef.current.elementHeight;
			// 위치 조정을 위한 변수
			let positionDeltaX = 0;
			let positionDeltaY = 0;

			// 방향에 따라 너비/높이 조정 및 위치 조정
			switch (currentDirectionRef.current) {
				case "right":
					// 오른쪽으로 리사이징: 왼쪽 고정, 너비만 변경
					newWidth = resizeOriginRef.current.elementWidth + deltaX;
					break;

				case "bottom":
					// 아래로 리사이징: 위쪽 고정, 높이만 변경
					newHeight = resizeOriginRef.current.elementHeight + deltaY;
					break;

				case "left":
					// 왼쪽으로 리사이징: 오른쪽 고정, 너비 변경 및 위치 조정
					newWidth = resizeOriginRef.current.elementWidth - deltaX;
					positionDeltaX = deltaX;
					break;

				// case "top":
				// 	// 위로 리사이징: 아래쪽 고정, 높이 변경 및 위치 조정
				// 	newHeight = resizeOriginRef.current.elementHeight - deltaY;
				// 	positionDeltaY = deltaY;
				// 	break;

				// case "top-left":
				// 	// 왼쪽 위로 리사이징: 오른쪽 아래 고정, 너비/높이 변경 및 위치 조정
				// 	newWidth = resizeOriginRef.current.elementWidth - deltaX;
				// 	newHeight = resizeOriginRef.current.elementHeight - deltaY;
				// 	positionDeltaX = deltaX;
				// 	positionDeltaY = deltaY;
				// 	break;

				// case "top-right":
				// 	// 오른쪽 위로 리사이징: 왼쪽 아래 고정, 너비/높이 변경 및 위치 조정
				// 	newWidth = resizeOriginRef.current.elementWidth + deltaX;
				// 	newHeight = resizeOriginRef.current.elementHeight - deltaY;
				// 	positionDeltaY = deltaY;
				// 	break;

				case "bottom-left":
					// 왼쪽 아래로 리사이징: 오른쪽 위 고정, 너비/높이 변경 및 위치 조정
					newWidth = resizeOriginRef.current.elementWidth - deltaX;
					newHeight = resizeOriginRef.current.elementHeight + deltaY;
					positionDeltaX = deltaX;
					break;

				case "bottom-right":
				default:
					// 오른쪽 아래로 리사이징: 왼쪽 위 고정, 너비/높이만 변경
					newWidth = resizeOriginRef.current.elementWidth + deltaX;
					newHeight = resizeOriginRef.current.elementHeight + deltaY;
					break;
			}

			// 최소/최대 크기 제한 적용
			const oldWidth = newWidth;
			const oldHeight = newHeight;

			newWidth = Math.max(minSize.width, Math.min(maxSize.width, newWidth));
			newHeight = Math.max(minSize.height, Math.min(maxSize.height, newHeight));

			// 최소/최대 크기 제한으로 인해 크기가 조정된 경우 위치 델타도 조정
			if (["left", "top-left", "bottom-left"].includes(currentDirectionRef.current)) {
				// 최소/최대 크기 제한으로 너비가 조정된 경우, 위치 델타 조정
				positionDeltaX = positionDeltaX * (newWidth / oldWidth);
			}

			if (["top", "top-left", "top-right"].includes(currentDirectionRef.current)) {
				// 최소/최대 크기 제한으로 높이가 조정된 경우, 위치 델타 조정
				positionDeltaY = positionDeltaY * (newHeight / oldHeight);
			}

			const newSize = { width: newWidth, height: newHeight };
			setSize(newSize);

			if (onResize) {
				// 위치 조정이 필요한 경우에만 positionDelta 전달
				if (positionDeltaX !== 0 || positionDeltaY !== 0) {
					onResize(newSize, { x: positionDeltaX, y: positionDeltaY });
				} else {
					onResize(newSize);
				}
			}
		};

		const onMouseUp = () => {
			if (!isResizing) return;

			setIsResizing(false);

			if (onResizeEnd) {
				onResizeEnd(size);
			}
		};

		// 이벤트 리스너 등록
		resizeHandleElement.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);

		// 클린업 함수
		return () => {
			resizeHandleElement.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [size, isResizing, onResizeStart, onResize, onResizeEnd, minSize, maxSize, disabled]);

	return { size, handleRef, isResizing };
}
