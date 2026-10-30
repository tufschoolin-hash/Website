import { cp, mkdir } from "node:fs/promises";

/**
 * `output: "standalone"` emits a self-contained server, but Next.js does not
 * copy the public directory or client assets into it. This keeps `npm start`
 * and the Docker image behaving exactly like a normal production deployment.
 */
await mkdir(".next/standalone/.next", { recursive: true });
await cp("public", ".next/standalone/public", { recursive: true, force: true });
await cp(".next/static", ".next/standalone/.next/static", {
  recursive: true,
  force: true,
});
