import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthState {
	isAuthenticated: boolean;
	username: string;
}

interface AuthContextType {
	state: AuthState;
	login: (username: string) => void;
	logout: () => void;
	sleep: () => void;
	restart: () => void;
}

const initialState: AuthState = {
	isAuthenticated: false,
	username: "",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<AuthState>(initialState);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const storedAuth = localStorage.getItem("auth");
		if (storedAuth) {
			try {
				const parsedAuth = JSON.parse(storedAuth);
				setState(parsedAuth);
			} catch (error) {
				console.error("Failed to parse auth data:", error);
				localStorage.removeItem("auth");
			}
		}
		setIsInitialized(true);
	}, []);

	useEffect(() => {
		if (isInitialized) {
			localStorage.setItem("auth", JSON.stringify(state));
		}
	}, [state, isInitialized]);

	const login = (username: string) => {
		setState({
			isAuthenticated: true,
			username,
		});
	};

	const logout = () => {
		setState({
			isAuthenticated: false,
			username: "",
		});
	};

	const sleep = () => {
		setState({
			...state,
			isAuthenticated: false,
		});
	};

	const restart = () => {
		setState({
			isAuthenticated: false,
			username: "",
		});
		localStorage.removeItem("auth");
	};

	return (
		<AuthContext.Provider
			value={{
				state,
				login,
				logout,
				sleep,
				restart,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
