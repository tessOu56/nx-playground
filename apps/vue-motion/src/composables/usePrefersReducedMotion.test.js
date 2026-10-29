import { defineComponent, nextTick } from "vue"
import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"

import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js"

function mockMatchMedia(matches) {
  const listeners = new Set()
  const mediaQuery = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn((_event, callback) => {
      listeners.add(callback)
    }),
    removeEventListener: vi.fn((_event, callback) => {
      listeners.delete(callback)
    }),
    dispatch(nextMatches) {
      mediaQuery.matches = nextMatches
      listeners.forEach(callback => callback({ matches: nextMatches }))
    },
  }

  window.matchMedia = vi.fn().mockReturnValue(mediaQuery)
  return mediaQuery
}

function mountHost() {
  return mount(
    defineComponent({
      setup() {
        const prefersReducedMotion = usePrefersReducedMotion()
        return { prefersReducedMotion }
      },
      template: "<div>{{ prefersReducedMotion }}</div>",
    })
  )
}

describe("usePrefersReducedMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("is true when matchMedia reports reduce", () => {
    mockMatchMedia(true)
    const wrapper = mountHost()
    expect(wrapper.vm.prefersReducedMotion).toBe(true)
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)"
    )
  })

  it("is false when matchMedia reports no preference", () => {
    mockMatchMedia(false)
    const wrapper = mountHost()
    expect(wrapper.vm.prefersReducedMotion).toBe(false)
  })

  it("updates and unsubscribes when the media query changes", async () => {
    const mediaQuery = mockMatchMedia(false)
    const wrapper = mountHost()

    mediaQuery.dispatch(true)
    await nextTick()
    expect(wrapper.vm.prefersReducedMotion).toBe(true)

    wrapper.unmount()
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    )
  })
})
