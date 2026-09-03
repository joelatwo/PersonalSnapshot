import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // Use a relative base so the built site works regardless of repo name casing
  // and hosting path (works for GitHub Pages). Using './' avoids absolute
  // paths like '/personalsnapshot/' which can cause 404s if the repo's URL
  // path casing differs from the configured base.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});
