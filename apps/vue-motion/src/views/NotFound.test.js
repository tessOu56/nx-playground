import { flushPromises, mount } from "@vue/test-utils"
import { createMemoryHistory, createRouter } from "vue-router"
import { describe, expect, it } from "vitest"

import { demos } from "../data/demos.js"
import NotFound from "./NotFound.vue"
import router from "../router/index.js"

describe("NotFound", () => {
  it("is registered as the catch-all route", async () => {
    await router.push("/this-page-does-not-exist")
    expect(router.currentRoute.value.name).toBe("NotFound")
  })

  it("offers a way home and a link to every demo", async () => {
    const memory = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", name: "Home", component: { template: "<div />" } },
        ...demos.map(demo => ({
          path: demo.path,
          name: demo.id,
          component: { template: "<div />" },
        })),
        { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
      ],
    })
    await memory.push("/missing")
    await memory.isReady()
    const wrapper = mount(NotFound, { global: { plugins: [memory] } })
    await flushPromises()
    expect(wrapper.get("h1").text()).toMatch(/not in the sandbox/i)
    expect(wrapper.text()).toContain("View source")
    for (const demo of demos) {
      expect(wrapper.text()).toContain(demo.nav)
    }
  })
})
