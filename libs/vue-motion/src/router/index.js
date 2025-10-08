import { createRouter, createWebHistory } from "vue-router"
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
