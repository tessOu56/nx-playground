import { mount, flushPromises } from "@vue/test-utils"
import { createPinia } from "pinia"
import { describe, expect, it } from "vitest"

import VueBasics from "./VueBasics.vue"

const LAB_TABS = [
  "compare",
  "reactivity",
  "components",
  "composables",
  "pinia",
  "lifecycle",
]

function mountLab() {
  return mount(VueBasics, {
    global: {
      plugins: [createPinia()],
    },
  })
}

describe("Vue basics lab (T-2026-225)", () => {
  it("renders the lab heading and all six tabs", () => {
    const wrapper = mountLab()
    expect(wrapper.get("h1").text()).toContain("Vue 3 基礎實驗室")
    const tabs = wrapper.findAll("[data-lab-tab]")
    expect(tabs.map(t => t.attributes("data-lab-tab"))).toEqual(LAB_TABS)
  })

  it("switches to the reactivity panel", async () => {
    const wrapper = mountLab()
    await wrapper.get('[data-lab-tab="reactivity"]').trigger("click")
    await flushPromises()
    expect(wrapper.text()).toContain("ref 與 reactive")
    expect(wrapper.get('[data-lab-tab="reactivity"]').attributes("aria-selected")).toBe(
      "true"
    )
  })

  it("shares Pinia state across reader widgets", async () => {
    const wrapper = mountLab()
    await wrapper.get('[data-lab-tab="pinia"]').trigger("click")
    await flushPromises()
    expect(wrapper.text()).toContain("Pinia 全域狀態")
    const increment = wrapper
      .findAll("button")
      .find(btn => btn.text().includes("+1"))
    expect(increment).toBeTruthy()
    await increment.trigger("click")
    expect(wrapper.text()).toContain("元件 A（只讀）")
    expect(wrapper.text()).toMatch(/\+1 → 1/)
  })
})
