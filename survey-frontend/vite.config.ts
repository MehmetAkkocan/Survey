import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//@ts-ignore
const url = process.env.VITE_URL;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: [url],
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    cors: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
