import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/app/layout.tsx",
        "src/app/error.tsx",
        "src/app/not-found.tsx",
        "src/app/robots.ts",
        "src/app/sitemap.ts",
        "src/app/manifest.ts",
        "src/components/sections/**",
        "src/components/layout/**",
        "src/components/ui/**",
        "src/hooks/**",
        "src/lib/seo.ts",
        "src/lib/site.ts",
      ],
    },
  },
});
