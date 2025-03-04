import React from "react";

export default function WelcomeApp() {
	return (
		<div className="h-full flex flex-col items-center justify-center p-6 text-center">
			<h2 className="text-2xl font-bold mb-4">Macinate에 오신 것을 환영합니다!</h2>
			<p className="mb-4">이 프로젝트는 웹 기술을 사용하여 맥 OS의 UI와 경험을 구현합니다.</p>
			<p className="text-sm text-gray-600">
				창을 드래그하여 이동하거나, 우측 하단 모서리를 드래그하여 크기를 조절할 수 있습니다.
				<br />창 제목 표시줄의 버튼을 사용하여 창을 닫거나, 최소화하거나, 최대화할 수 있습니다.
			</p>
		</div>
	);
}
