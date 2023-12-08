/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				poppings: ["Poppins", "sans-serif"],
			},
		},
	},
	plugins: [],
	important: true,
	corePlugins: {
		preflight: false,
	},
};
