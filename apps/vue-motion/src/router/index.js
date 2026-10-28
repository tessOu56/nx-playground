import { createRouter, createWebHistory } from "vue-router"

import { pageTitle } from "../data/demos.js"
import Home from "../views/Home.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/particles",
    name: "Particles",
    component: () => import("../views/effects/Particles.vue"),
  },
  {
    path: "/gsap-animations",
    name: "GSAPAnimations",
    component: () => import("../views/effects/GSAPAnimations.vue"),
  },
  {
    path: "/three-js",
    name: "ThreeJS",
    component: () => import("../views/effects/ThreeJS.vue"),
  },
  {
    path: "/lottie",
    name: "Lottie",
    component: () => import("../views/effects/Lottie.vue"),
  },
  {
    path: "/motion",
    name: "Motion",
    component: () => import("../views/effects/Motion.vue"),
  },
  {
    path: "/interactive",
    name: "Interactive",
    component: () => import("../views/effects/Interactive.vue"),
  },
  {
    path: "/recipes",
    name: "RecipeGallery",
    component: () => import("../views/RecipeGallery.vue"),
  },
  {
    path: "/vue-basics",
    name: "VueBasics",
    component: () => import("../views/learn/VueBasics.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const behavior = reduce ? "auto" : "smooth"
    if (to.hash) {
      return { el: to.hash, top: 72, behavior }
    }
    return { top: 0 }
  },
})

router.afterEach(to => {
  document.title = pageTitle(to.name, to.path)
})

export default router
