<template>
  <div class="app-shell">
    <a class="skip-link" href="#main">Skip to content</a>

    <header class="site-header">
      <div class="header-inner">
        <router-link class="brand" to="/" :title="SITE.name">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-text">{{ SITE.name }}</span>
        </router-link>

        <nav class="nav-desktop" aria-label="Primary">
          <router-link to="/" exact-active-class="is-current">Home</router-link>
          <router-link
            :to="{ path: '/', hash: '#demos' }"
            active-class=""
            exact-active-class=""
          >
            Demos
          </router-link>
          <router-link to="/vue-basics">Lab</router-link>
          <router-link to="/recipes">Recipes</router-link>
          <a :href="SITE.github" rel="noopener noreferrer">Source</a>
        </nav>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <span class="menu-icon" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <div v-if="menuOpen" id="mobile-menu" class="nav-mobile">
        <nav aria-label="Primary">
          <router-link to="/" @click="closeMenu">Home</router-link>
          <router-link
            :to="{ path: '/', hash: '#demos' }"
            active-class=""
            exact-active-class=""
            @click="closeMenu"
          >
            Demos
          </router-link>
          <router-link to="/vue-basics" @click="closeMenu">Lab</router-link>
          <router-link to="/recipes" @click="closeMenu">Recipes</router-link>
          <a :href="SITE.github" rel="noopener noreferrer" @click="closeMenu">
            Source
          </a>
        </nav>
        <p class="nav-mobile-label" id="mobile-demo-label">All demos</p>
        <nav aria-labelledby="mobile-demo-label">
          <router-link
            v-for="demo in demos"
            :key="demo.id"
            :to="demo.path"
            @click="closeMenu"
          >
            {{ demo.nav }}
            <span class="nav-zh">{{ demo.titleZh }}</span>
          </router-link>
        </nav>
      </div>
    </header>

    <div v-if="!isHome" class="demo-chrome">
      <div class="demo-chrome-inner">
        <router-link class="back-link" :to="{ path: '/', hash: '#demos' }">
          All demos
        </router-link>
        <nav class="demo-strip" aria-label="Demos">
          <router-link
            v-for="demo in demos"
            :key="demo.id"
            :to="demo.path"
            class="demo-pill"
          >
            {{ demo.nav }}
          </router-link>
        </nav>
        <a
          v-if="currentDemo"
          class="source-link"
          :href="sourceUrl(currentDemo)"
          rel="noopener noreferrer"
        >
          Source
        </a>
        <a v-else class="source-link" :href="SITE.github" rel="noopener noreferrer">
          Source
        </a>
      </div>
    </div>

    <main id="main" class="site-main" tabindex="-1">
      <StatusPanel
        v-if="loadError"
        kicker="Error"
        title="This demo failed to load"
        description="The page did not finish loading. Retry, go back to the gallery, or open the source."
        role="alert"
        live="assertive"
      >
        <button class="btn-primary" type="button" @click="retryLoad">
          Try again
        </button>
        <router-link class="btn-ghost" :to="{ path: '/', hash: '#demos' }">
          All demos
        </router-link>
        <a
          v-if="currentDemo"
          class="btn-ghost"
          :href="sourceUrl(currentDemo)"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </StatusPanel>

      <router-view v-else v-slot="{ Component }">
        <Suspense>
          <template #default>
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="viewKey" />
            </transition>
          </template>
          <template #fallback>
            <StatusPanel
              heading="h2"
              title="Loading demo"
              description="Fetching the page bundle."
            />
          </template>
        </Suspense>
      </router-view>
    </main>

    <footer class="site-footer">
      <p>
        Labelled Vue 3 sandbox — not a product.
        <a :href="SITE.github" rel="noopener noreferrer">Source on GitHub</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onErrorCaptured, onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

defineOptions({ name: "AppLayout" })

import StatusPanel from "./StatusPanel.vue"
import { SITE, demos, demoByPath, sourceUrl } from "../data/demos.js"

const route = useRoute()
const menuOpen = ref(false)
const loadError = ref(null)
const retryNonce = ref(0)

const currentDemo = computed(() => demoByPath(route.path))
const isHome = computed(() => route.name === "Home")
const viewKey = computed(() => `${route.fullPath}::${retryNonce.value}`)

const closeMenu = () => {
  menuOpen.value = false
}

const retryLoad = () => {
  loadError.value = null
  retryNonce.value += 1
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
    loadError.value = null
  }
)

watch(menuOpen, open => {
  document.body.style.overflow = open ? "hidden" : ""
})

onErrorCaptured(error => {
  loadError.value = error
  return false
})

const onKeydown = event => {
  if (event.key === "Escape") closeMenu()
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown)
  document.body.style.overflow = ""
})
</script>
