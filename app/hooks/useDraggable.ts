import { useState, useEffect, useRef, RefObject } from "react";

interface Position {
	x: number;
	y: number;
}

interface UseDraggableOptions {
	initialPosition?: Position;
	onDragStart?: (position: Position) => void;
	onDrag?: (position: Position) => void;
	onDragEnd?: (position: Position) => void;
	bounds?: {
		left?: number;
		top?: number;
		right?: number;
		bottom?: number;
	};
	disabled?: boolean;
}

interface UseDraggableReturn {
	position: Position;
	handleRef: RefObject<HTMLElement>;
	isDragging: boolean;
}

export default function useDraggable({ initialPosition = { x: 0, y: 0 }, onDragStart, onDrag, onDragEnd, bounds, disabled = false }: UseDraggableOptions = {}): UseDraggableReturn {
	const [position, setPosition] = useState<Position>(initialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const handleRef = useRef<HTMLElement>(null);

	// 드래그 시작 위치와 요소 위치를 저장하는 ref
	const dragOriginRef = useRef<{
		mouseX: number;
		mouseY: number;
		elementX: number;
		elementY: number;
	}>({
		mouseX: 0,
		mouseY: 0,
		elementX: 0,
		elementY: 0,
	});

	useEffect(() => {
		const dragHandleElement = handleRef.current;

		if (!dragHandleElement || disabled) return;

		const onMouseDown = (e: MouseEvent) => {
			// 마우스 왼쪽 버튼만 처리
			if (e.button !== 0) return;

			// 드래그 시작 위치 저장
			dragOriginRef.current = {
				mouseX: e.clientX,
				mouseY: e.clientY,
				elementX: position.x,
				elementY: position.y,
			};

			setIsDragging(true);

			if (onDragStart) {
				onDragStart(position);
			}

			// 텍스트 선택 방지
			e.preventDefault();
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			// 이동 거리 계산
			const deltaX = e.clientX - dragOriginRef.current.mouseX;
			const deltaY = e.clientY - dragOriginRef.current.mouseY;

			// 새 위치 계산
			let newX = dragOriginRef.current.elementX + deltaX;
			let newY = dragOriginRef.current.elementY + deltaY;

			// 경계 제한 적용
			if (bounds) {
				if (bounds.left !== undefined) {
					newX = Math.max(newX, bounds.left);
				}
				if (bounds.right !== undefined) {
					newX = Math.min(newX, bounds.right);
				}
				if (bounds.top !== undefined) {
					newY = Math.max(newY, bounds.top);
				}
				if (bounds.bottom !== undefined) {
					newY = Math.min(newY, bounds.bottom);
				}
			}

			const newPosition = { x: newX, y: newY };
			setPosition(newPosition);

			if (onDrag) {
				onDrag(newPosition);
			}
		};

		const onMouseUp = () => {
			if (!isDragging) return;

			setIsDragging(false);

			if (onDragEnd) {
				onDragEnd(position);
			}
		};

		// 이벤트 리스너 등록
		dragHandleElement.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);

		// 클린업 함수
		return () => {
			dragHandleElement.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [position, isDragging, onDragStart, onDrag, onDragEnd, bounds, disabled]);

	return { position, handleRef, isDragging };
}
