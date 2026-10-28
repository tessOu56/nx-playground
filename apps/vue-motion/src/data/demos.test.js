import { describe, expect, it } from "vitest"

import router from "../router/index.js"
import {
  SPA_FALLBACK_DIRS,
  SITE,
  demoByPath,
  demos,
  pageTitle,
  sourceUrl,
} from "./demos.js"

describe("demo catalog", () => {
  it("lists unique paths that exist on the router", () => {
    const paths = router.getRoutes().map(route => route.path)
    const demoPaths = demos.map(demo => demo.path)
    expect(new Set(demoPaths).size).toBe(demoPaths.length)
    for (const path of demoPaths) {
      expect(paths).toContain(path)
      expect(demoByPath(path)?.path).toBe(path)
    }
  })

  it("points every demo at a source file in this repo", () => {
    for (const demo of demos) {
      expect(demo.source).toMatch(/^src\//)
      expect(sourceUrl(demo)).toBe(`${SITE.github}/blob/master/${demo.source}`)
    }
  })

  it("builds honest page titles", () => {
    expect(pageTitle("Home", "/")).toBe(SITE.name)
    expect(pageTitle("NotFound", "/missing")).toBe(`Not found · ${SITE.name}`)
    expect(pageTitle("Particles", "/particles")).toBe(`Particles · ${SITE.name}`)
  })

  it("covers SPA fallback directories for Pages", () => {
    expect(SPA_FALLBACK_DIRS).toEqual(demos.map(demo => demo.path.slice(1)))
  })
})
