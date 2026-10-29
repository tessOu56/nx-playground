import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import Particles from "./Particles.vue"

function mockMatchMedia(matches) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

describe("Particles reduced motion", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    }))
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 400,
      top: 0,
      left: 0,
      right: 800,
      bottom: 400,
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("does not auto-start the loop when prefers-reduced-motion is on", () => {
    mockMatchMedia(true)
    const wrapper = mount(Particles)
    expect(wrapper.vm.isAnimating).toBe(false)
    expect(wrapper.get("button").text()).toContain("開始")
    wrapper.unmount()
  })

  it("auto-starts the loop when prefers-reduced-motion is off", () => {
    mockMatchMedia(false)
    const wrapper = mount(Particles)
    expect(wrapper.vm.isAnimating).toBe(true)
    expect(wrapper.get("button").text()).toContain("暫停")
    wrapper.unmount()
  })

  it("cancels the rAF loop when Pause is clicked", async () => {
    mockMatchMedia(false)
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(7)
    const cancel = vi.spyOn(window, "cancelAnimationFrame")
    const wrapper = mount(Particles)

    await wrapper.get("button").trigger("click")

    expect(wrapper.vm.isAnimating).toBe(false)
    expect(cancel).toHaveBeenCalled()
    expect(wrapper.get("button").text()).toContain("開始")
    wrapper.unmount()
  })
})
