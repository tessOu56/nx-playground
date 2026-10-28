#!/usr/bin/env node
/**
 * GitHub Pages SPA fallbacks for project-site base /nx-playground/vue-motion/
 */
import { copyFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { SPA_FALLBACK_DIRS } from "../src/data/demos.js"

const dist =
  process.env.VUE_MOTION_DIST ??
  join(dirname(fileURLToPath(import.meta.url)), "../../../dist/apps/vue-motion")
const index = join(dist, "index.html")

copyFileSync(index, join(dist, "404.html"))

for (const dir of SPA_FALLBACK_DIRS) {
  mkdirSync(join(dist, dir), { recursive: true })
  copyFileSync(index, join(dist, dir, "index.html"))
}

console.log(
  `postbuild-pages: wrote 404.html + ${SPA_FALLBACK_DIRS.join("/")} index.html`
)
