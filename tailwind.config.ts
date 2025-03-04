import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["SF Pro Display", "-apple-system", "BlinkMacSystemFont", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
			},
			colors: {
				macos: {
					menubar: "rgba(255, 255, 255, 0.8)",
					dock: "rgba(255, 255, 255, 0.2)",
					window: "rgba(255, 255, 255, 0.85)",
					"button-close": "#FF5F57",
					"button-minimize": "#FEBC2E",
					"button-maximize": "#28C840",
				},
				black: "#000000",
				white: "#FFFFFF",
				gray: {
					50: "#F9FAFB",
					100: "#F3F4F6",
					200: "#E5E7EB",
					300: "#D1D5DB",
					400: "#9CA3AF",
					500: "#6B7280",
					600: "#4B5563",
					700: "#374151",
					800: "#1F2937",
					900: "#111827",
					950: "#030712",
				},
			},
			boxShadow: {
				dock: "0 0 10px rgba(0, 0, 0, 0.2)",
				window: "0 10px 30px rgba(0, 0, 0, 0.2)",
			},
			textColor: {
				DEFAULT: "#000000",
			},
		},
	},
	plugins: [],
} satisfies Config;
