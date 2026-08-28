#!/usr/bin/env node
/**
 * Vite 8 + Nitro `inlineDynamicImports` inlines PGLite into the server
 * function, but does not emit its sidecar WASM/data files. Preview (no
 * DATABASE_URL) then crashes looking for pglite.data next to index.mjs.
 * Copy them after `vite build` so `vite preview` can boot PGLite.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@electric-sql/pglite/dist");
const dest = join(root, ".vercel/output/functions/__server.func");

if (!existsSync(dest)) {
  console.warn("[pglite-assets] no server function output — skip");
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
for (const file of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(src, file);
  if (!existsSync(from)) {
    console.error(`[pglite-assets] missing ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(dest, file));
}
