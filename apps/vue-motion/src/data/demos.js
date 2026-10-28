export const SITE = {
  name: "Vue Motion Sandbox",
  live: "https://tessou56.github.io/nx-playground/vue-motion/",
  github: "https://github.com/tessOu56/vue-motion-sandbox",
}

/**
 * Single catalog for home gallery, header strip, 404, and source links.
 * Copy matches what the routes actually render — no extra claims.
 */
export const demos = [
  {
    id: "vue-basics",
    path: "/vue-basics",
    nav: "Lab",
    title: "Vue 3 lab",
    titleZh: "Vue 3 基礎實驗室",
    blurb: "Composition API, component communication, composables, and Pinia.",
    tech: ["Composition API", "Pinia", "Composables"],
    source: "src/views/learn/VueBasics.vue",
    kind: "lab",
  },
  {
    id: "particles",
    path: "/particles",
    nav: "Particles",
    title: "Particles",
    titleZh: "粒子特效",
    blurb: "Canvas 2D particle system with mouse interaction and live controls.",
    tech: ["Canvas 2D", "Vue 3"],
    source: "src/views/effects/Particles.vue",
    kind: "effect",
  },
  {
    id: "gsap",
    path: "/gsap-animations",
    nav: "GSAP",
    title: "GSAP",
    titleZh: "GSAP 動畫",
    blurb: "Tween, timeline, text, and motion-path demos with playback controls.",
    tech: ["GSAP", "Timeline"],
    source: "src/views/effects/GSAPAnimations.vue",
    kind: "effect",
  },
  {
    id: "three",
    path: "/three-js",
    nav: "Three.js",
    title: "Three.js",
    titleZh: "Three.js 3D",
    blurb: "Cube, sphere, and torus with rotation, scale, and lighting.",
    tech: ["Three.js", "WebGL"],
    source: "src/views/effects/ThreeJS.vue",
    kind: "effect",
  },
  {
    id: "lottie",
    path: "/lottie",
    nav: "Lottie",
    title: "Lottie",
    titleZh: "Lottie 動畫",
    blurb: "lottie-web playback of JSON clips (loading, success, error, custom).",
    tech: ["lottie-web", "JSON"],
    source: "src/views/effects/Lottie.vue",
    kind: "effect",
  },
  {
    id: "motion",
    path: "/motion",
    nav: "Motion",
    title: "VueUse Motion",
    titleZh: "Motion 動畫",
    blurb: "Declarative enter, hover, and sequence animations via VueUse Motion.",
    tech: ["VueUse Motion"],
    source: "src/views/effects/Motion.vue",
    kind: "effect",
  },
  {
    id: "interactive",
    path: "/interactive",
    nav: "Interactive",
    title: "Interactive",
    titleZh: "互動特效",
    blurb: "Mouse follow, click ripples, hover, keyboard, and touch demos.",
    tech: ["Pointer", "Keyboard"],
    source: "src/views/effects/Interactive.vue",
    kind: "effect",
  },
  {
    id: "recipes",
    path: "/recipes",
    nav: "Recipes",
    title: "Recipes",
    titleZh: "食譜／原物料",
    blurb: "Static mock JSON gallery. Not a shop, CMS, or REST API.",
    tech: ["mock JSON"],
    source: "src/views/RecipeGallery.vue",
    kind: "mock",
  },
]

export const SPA_FALLBACK_DIRS = demos.map(demo => demo.path.replace(/^\//, ""))

export function demoByPath(path) {
  return demos.find(demo => demo.path === path) ?? null
}

export function sourceUrl(demo) {
  return `${SITE.github}/blob/master/${demo.source}`
}

export function pageTitle(routeName, path) {
  if (routeName === "NotFound") return `Not found · ${SITE.name}`
  const demo = demoByPath(path)
  if (!demo) return SITE.name
  return `${demo.nav} · ${SITE.name}`
}
