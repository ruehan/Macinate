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
			},
			boxShadow: {
				dock: "0 0 10px rgba(0, 0, 0, 0.2)",
				window: "0 10px 30px rgba(0, 0, 0, 0.2)",
			},
		},
	},
	plugins: [],
} satisfies Config;
