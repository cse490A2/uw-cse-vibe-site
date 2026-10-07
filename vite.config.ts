// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { HIDDEN_PROJECTS } from "./src/lib/published";

const basePath = process.env["VITE_BASE_PATH"] || "/";
const isStaticExport = process.env["VITE_STATIC_EXPORT"] === "1";

export default defineConfig({
  nitro: isStaticExport ? false : true,
  vite: {
    base: basePath,
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: [
      { path: "/" }, { path: "/lectures" }, { path: "/projects" },
      ...Array.from({ length: 10 }, (_, i) => `P${String(i + 1).padStart(2, "0")}`)
        .filter((id) => !HIDDEN_PROJECTS.has(id))
        .flatMap((id) => [
          { path: `/projects/${id}` },
          { path: `/projects/${id}/setup` },
          { path: `/projects/${id}/submission` },
        ]),
    ],
    prerender: { enabled: true, crawlLinks: true, autoStaticPathsDiscovery: false },
  },
});
