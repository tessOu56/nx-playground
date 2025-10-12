<template>
  <div class="min-h-screen flex flex-col">
    <nav class="gradient-bg shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center">
            <h2 class="text-white text-xl font-bold">Vue3 特效展示</h2>
          </router-link>
          <div class="hidden md:flex space-x-8">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              active-class="text-white bg-white/20"
            >
              {{ item.name }}
            </router-link>
          </div>
          <!-- 移動端菜單 -->
          <div class="md:hidden">
            <button class="text-white hover:text-white/80">
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 p-4 max-w-7xl mx-auto w-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-gray-800 text-white text-center py-4">
      <p class="opacity-80">
        Vue 3 Web 特效專案 - 使用 Vue 3 + Vue Router + GSAP + Three.js + Lottie
        + Tailwind CSS
      </p>
    </footer>
  </div>
</template>

<script>
import { ref } from "vue"

export default {
  name: "AppLayout",
  setup() {
    const menuItems = ref([
      { path: "/", name: "首頁" },
      { path: "/particles", name: "粒子特效" },
      { path: "/gsap-animations", name: "GSAP 動畫" },
      { path: "/three-js", name: "Three.js 3D" },
      { path: "/lottie", name: "Lottie 動畫" },
      { path: "/motion", name: "Motion 動畫" },
      { path: "/interactive", name: "互動特效" },
    ])

    return {
      menuItems,
    }
  },
}
</script>

<style scoped>
/* 頁面過渡動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
