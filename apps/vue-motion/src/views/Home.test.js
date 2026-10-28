import { flushPromises, mount } from "@vue/test-utils"
import { createMemoryHistory, createRouter } from "vue-router"
import { describe, expect, it } from "vitest"

import { SITE, demos } from "../data/demos.js"
import Home from "./Home.vue"

async function mountHome() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "Home", component: Home },
      ...demos.map(demo => ({
        path: demo.path,
        name: demo.id,
        component: { template: "<div />" },
      })),
    ],
  })
  await router.push("/")
  await router.isReady()
  const wrapper = mount(Home, {
    global: { plugins: [router] },
  })
  await flushPromises()
  return wrapper
}

describe("Home gallery", () => {
  it("states what the sandbox is and links to source", async () => {
    const wrapper = await mountHome()
    expect(wrapper.get("h1").text()).toBe(SITE.name)
    expect(wrapper.text()).toContain("labelled sandbox, not a product")
    const source = wrapper
      .findAll("a")
      .find(anchor => anchor.text().includes("View source"))
    expect(source.attributes("href")).toBe(SITE.github)
  })

  it("renders every demo as a real link, not a click handler", async () => {
    const wrapper = await mountHome()
    const cards = wrapper.findAll("a.demo-card")
    expect(cards).toHaveLength(demos.length)
    for (const [index, demo] of demos.entries()) {
      expect(cards[index].attributes("href")).toBe(demo.path)
      expect(cards[index].text()).toContain(demo.titleZh)
    }
  })
})
