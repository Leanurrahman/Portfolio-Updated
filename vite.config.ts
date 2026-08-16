import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      // HMR can be disabled locally with DISABLE_HMR if needed.
      hmr: process.env.DISABLE_HMR !== "true",
      // Keep file watching enabled unless explicitly disabled for local dev purposes.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
