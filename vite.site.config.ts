import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL("./site", import.meta.url)),
  // Relative asset URLs: the site works at the domain root and under /<repo>/ on GitHub Pages.
  base: "./",
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  server: {
    port: 5174,
    open: "/",
  },
  build: {
    outDir: fileURLToPath(new URL("./dist-site", import.meta.url)),
    emptyOutDir: true,
  },
});
