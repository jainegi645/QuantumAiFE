import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy API calls to backend during development to avoid CORS issues.
    // Uses VITE_BACKEND_URL if set, otherwise falls back to the Azure URL used in your app.
    proxy: {
      '/api': {
        // Prefer an explicit local backend during development unless VITE_BACKEND_URL is set.
        target: (process.env as any).VITE_BACKEND_URL || 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
