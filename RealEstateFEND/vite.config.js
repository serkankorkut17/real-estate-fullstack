import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), flowbiteReact()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		// https: {
		// 	key: fs.readFileSync("localhost-key.pem"),
		// 	cert: fs.readFileSync("localhost-cert.pem"),
		// },
		historyApiFallback: true, // SPA fallback
		proxy: {
			"/api/geocode": {
				target: "https://nominatim.openstreetmap.org",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/geocode/, "/search"),
			},
			"/api/reverse-geocode": {
				target: "https://nominatim.openstreetmap.org/reverse",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/reverse-geocode/, ""),
			},
		},
	},
});
