import { flushPromises, mount } from "@vue/test-utils"
import { createMemoryHistory, createRouter } from "vue-router"
import { describe, expect, it } from "vitest"

import { SITE, demos } from "../data/demos.js"
import Layout from "./Layout.vue"

function stub(name) {
  return { template: `<div>${name}</div>` }
}

async function mountLayout(path = "/") {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "Home", component: stub("home") },
      ...demos.map(demo => ({
        path: demo.path,
        name: demo.id,
        component: stub(demo.nav),
      })),
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: stub("missing"),
      },
    ],
  })
  await router.push(path)
  await router.isReady()
  const wrapper = mount(Layout, {
    global: { plugins: [router] },
  })
  await flushPromises()
  return { wrapper, router }
}

describe("Layout chrome", () => {
  it("exposes a skip link, source link, and main landmark", async () => {
    const { wrapper } = await mountLayout("/")
    expect(wrapper.get(".skip-link").attributes("href")).toBe("#main")
    expect(wrapper.get("#main").exists()).toBe(true)
    const source = wrapper
      .findAll("a")
      .find(anchor => anchor.text() === "Source")
    expect(source.attributes("href")).toBe(SITE.github)
  })

  it("opens and closes the mobile menu from the toggle", async () => {
    const { wrapper } = await mountLayout("/")
    const toggle = wrapper.get(".menu-toggle")
    expect(toggle.attributes("aria-expanded")).toBe("false")
    expect(wrapper.find("#mobile-menu").exists()).toBe(false)

    await toggle.trigger("click")
    expect(toggle.attributes("aria-expanded")).toBe("true")
    expect(wrapper.get("#mobile-menu").text()).toContain("Particles")

    await toggle.trigger("click")
    expect(toggle.attributes("aria-expanded")).toBe("false")
  })

  it("shows a way back and a source file link on demo pages", async () => {
    const { wrapper } = await mountLayout("/particles")
    expect(wrapper.get(".back-link").text()).toContain("All demos")
    const source = wrapper
      .findAll("a")
      .find(anchor => anchor.text() === "Source" && anchor.classes("source-link"))
    expect(source.attributes("href")).toContain(
      "blob/master/src/views/effects/Particles.vue"
    )
    const pills = wrapper.findAll(".demo-pill")
    expect(pills).toHaveLength(demos.length)
  })
})
