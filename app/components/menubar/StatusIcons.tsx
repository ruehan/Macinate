import React from "react";
import { useSpotlight } from "../spotlight/SpotlightProvider";

interface StatusIconsProps {
	currentTime: string;
}

export default function StatusIcons({ currentTime }: StatusIconsProps) {
	const { toggleSpotlight } = useSpotlight();

	return (
		<div className="flex items-center space-x-3">
			{/* Spotlight 아이콘 */}
			<div className="cursor-pointer hover:bg-gray-200/50 p-1 rounded-md" onClick={toggleSpotlight} title="Spotlight 검색 (Cmd+Space)">
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>

			{/* 배터리 아이콘 */}
			<div className="flex items-center">
				<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
					<rect x="4" y="9" width="14" height="6" rx="1" fill="currentColor" />
					<path d="M22 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
			</div>

			{/* 와이파이 아이콘 */}
			<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 14C13.1046 14 14 14.8954 14 16C14 17.1046 13.1046 18 12 18C10.8954 18 10 17.1046 10 16C10 14.8954 10.8954 14 12 14Z" fill="currentColor" />
				<path
					d="M7.75732 11.7573C8.24284 11.2718 8.24284 10.4896 7.75732 10.0041C7.2718 9.51855 6.48959 9.51855 6.00407 10.0041C4.5719 11.4363 3.75 13.4437 3.75 15.5C3.75 15.9142 4.08579 16.25 4.5 16.25C4.91421 16.25 5.25 15.9142 5.25 15.5C5.25 13.8551 5.91149 12.2554 7.05941 11.1075C7.30096 10.866 7.51577 10.866 7.75732 11.1075V11.7573Z"
					fill="currentColor"
				/>
				<path
					d="M16.2427 11.7573C16.7282 11.2718 17.5104 11.2718 17.9959 11.7573C19.4281 13.1895 20.25 15.1969 20.25 17.2532C20.25 17.6674 19.9142 18.0032 19.5 18.0032C19.0858 18.0032 18.75 17.6674 18.75 17.2532C18.75 15.6083 18.0885 14.0086 16.9406 12.8607C16.699 12.6192 16.4842 12.6192 16.2427 12.8607V11.7573Z"
					fill="currentColor"
				/>
				<path
					d="M4.98713 7.98713C5.47264 7.50162 5.47264 6.71941 4.98713 6.2339C4.50162 5.74839 3.71941 5.74839 3.2339 6.2339C1.16797 8.29983 0 11.1298 0 14.0607C0 14.4749 0.335786 14.8107 0.75 14.8107C1.16421 14.8107 1.5 14.4749 1.5 14.0607C1.5 11.5339 2.51098 9.09831 4.2339 7.37539C4.47545 7.13384 4.69026 7.13384 4.93181 7.37539L4.98713 7.98713Z"
					fill="currentColor"
				/>
				<path
					d="M19.0129 7.98713C19.4984 7.50162 20.2806 7.50162 20.7661 7.98713C22.832 10.0531 24 12.883 24 15.8139C24 16.2281 23.6642 16.5639 23.25 16.5639C22.8358 16.5639 22.5 16.2281 22.5 15.8139C22.5 13.2871 21.489 10.8515 19.7661 9.12856C19.5246 8.88701 19.3097 8.88701 19.0682 9.12856L19.0129 7.98713Z"
					fill="currentColor"
				/>
			</svg>

			{/* 현재 시간 */}
			<span>{currentTime}</span>
		</div>
	);
}
