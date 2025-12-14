/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      host: "localhost",
      port: 5173,
      protocol: "ws",
    },
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/coverage/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: path.resolve(__dirname, "src/router"),
      generatedRouteTree: path.resolve(__dirname, "src/routeTree.gen.ts"),
    }),
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        dimensions: false,
      },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    css: true,
    reporters: ["verbose"],
    coverage: {
      reporter: ["text", "json", "html"],
      provider: "v8",
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
      "date-fns",
      "axios",
      "zustand",
    ],
    exclude: ["@tanstack/react-router-devtools"],
  },
});
