import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSystemSettings } from "~/store/SystemSettingsContext";
import { useAuth } from "~/store/AuthContext";

interface LoginScreenProps {
	onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
	const { state: systemState } = useSystemSettings();
	const { restart } = useAuth();
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!password.trim()) {
			setError("비밀번호를 입력해주세요.");
			return;
		}

		onLogin("Guest");
	};

	const handleRestart = () => {
		restart();
		window.location.reload();
	};

	const handleShutdown = () => {
		restart();
		window.location.reload();
	};

	const formattedDate = currentTime.toLocaleDateString("ko-KR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const formattedTime = currentTime.toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	return (
		<motion.div
			className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center backdrop-blur-sm"
			style={{ backgroundImage: `url(${systemState.wallpaper})` }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<div className="flex flex-col items-center mb-8">
				<div className="text-white text-4xl font-light mb-2">{formattedTime}</div>
				<div className="text-white text-lg font-light">{formattedDate}</div>
			</div>

			<motion.div
				className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 w-80 flex flex-col items-center"
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.5 }}
			>
				<div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
					<img src="/icons/user.png" alt="User" className="w-full h-full object-cover" />
				</div>

				<h2 className="text-white text-xl font-medium mb-6">Guest</h2>

				<form onSubmit={handleSubmit} className="w-full">
					<input
						type="password"
						placeholder="비밀번호"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setError("");
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSubmit(e);
							}
						}}
						className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
						autoFocus
					/>

					{error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}
				</form>
			</motion.div>

			<div className="absolute bottom-4 flex justify-center w-full">
				<div className="flex items-center space-x-4">
					<button className="text-white/70 hover:text-white flex items-center" onClick={handleShutdown}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
						<span>시스템 종료</span>
					</button>
					<button className="text-white/70 hover:text-white flex items-center" onClick={handleRestart}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<span>재시동</span>
					</button>
				</div>
			</div>
		</motion.div>
	);
}
