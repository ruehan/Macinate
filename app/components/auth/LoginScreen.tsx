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
			className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center backdrop-blur-xl"
			style={{ backgroundImage: `url(${systemState.wallpaper})` }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<div className="flex flex-col items-center mb-8">
				<div className="text-white text-4xl font-semibold mb-2 drop-shadow-2xl" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
					{formattedTime}
				</div>
				<div className="text-white text-lg font-semibold drop-shadow-xl" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
					{formattedDate}
				</div>
			</div>

			<motion.div className="flex flex-col items-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
				<div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden shadow-xl">
					<img src="/icons/user.png" alt="User" className="w-full h-full object-cover" />
				</div>

				<h2 className="text-white text-xl font-medium mb-6 drop-shadow-lg" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
					Guest
				</h2>

				<form onSubmit={handleSubmit} className="w-full flex flex-col items-center ">
					<input
						type="password"
						placeholder="암호 입력"
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
						className="w-80 bg-white/20 border border-white/30 rounded-full px-4 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg backdrop-blur-xl text-center"
						autoFocus
						style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
					/>

					{error && (
						<div className="text-red-400 text-sm mb-4 text-center" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.3)" }}>
							{error}
						</div>
					)}
				</form>
			</motion.div>

			<div className="absolute bottom-4 flex justify-center w-full">
				<div className="flex items-center space-x-16">
					<button className="text-white/90 hover:text-white flex flex-col items-center drop-shadow-lg transition-all hover:drop-shadow-xl" onClick={handleShutdown}>
						<div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>시스템 종료</span>
					</button>
					<button className="text-white/90 hover:text-white flex flex-col items-center drop-shadow-lg transition-all hover:drop-shadow-xl" onClick={handleRestart}>
						<div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</div>
						<span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>재시동</span>
					</button>
					<button className="text-white/90 hover:text-white flex flex-col items-center drop-shadow-lg transition-all hover:drop-shadow-xl">
						<div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
							</svg>
						</div>
						<span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>잠자기</span>
					</button>
				</div>
			</div>
		</motion.div>
	);
}
