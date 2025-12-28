import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  
  // IMPORTANT: base path for production
  base: "/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // DEV server (optional, not used in Docker)
  server: {
    host: true,
    port: 8080,
  },

  // PREVIEW server (USED in Docker)
  preview: {
    host: true,
    port: 8080,
  },
});
