import { describe, expect, it } from "vitest"

import catalog from "../data/recipes.json"
import router from "../router/index.js"

describe("recipes mock catalog (T-2026-290)", () => {
  it("exposes labelled recipes and materials without REST pretence", () => {
    expect(catalog.labelledMock).toBe(true)
    expect(catalog.recipes.length).toBeGreaterThanOrEqual(3)
    expect(catalog.materials.length).toBeGreaterThanOrEqual(5)
    for (const recipe of catalog.recipes) {
      expect(recipe.id).toBeTruthy()
      expect(recipe.materialIds?.length).toBeGreaterThan(0)
      for (const id of recipe.materialIds) {
        expect(catalog.materials.some(m => m.id === id)).toBe(true)
      }
    }
  })
})

describe("router completeness (T-2026-225)", () => {
  it("registers effects page, vue-basics lab, recipes, and 404", () => {
    const paths = router.getRoutes().map(r => r.path)
    expect(paths).toContain("/")
    expect(paths).toContain("/particles")
    expect(paths).toContain("/vue-basics")
    expect(paths).toContain("/recipes")
    expect(paths).toContain("/:pathMatch(.*)*")
  })

  it("does not register an event-portal surface", () => {
    const paths = router.getRoutes().map(r => r.path)
    expect(paths.some(p => p.includes("event"))).toBe(false)
    expect(paths).not.toContain("/events")
    expect(paths).not.toContain("/checkout")
  })
})
