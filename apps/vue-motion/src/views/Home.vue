<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div class="gradient-bg rounded-3xl p-12 text-center text-white">
      <h1 class="text-5xl font-bold mb-6 animate-fade-in">
        <span class="text-gradient">Vue 3 Web 特效展示</span>
      </h1>
      <p class="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
        探索各種令人驚豔的 Web 特效，使用 Vue 3 生態系打造互動體驗
      </p>
    </div>

    <!-- Effects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="effect in effects"
        :key="effect.id"
        class="card hover:scale-105 cursor-pointer group"
        @click="navigateToEffect(effect.path)"
      >
        <div class="text-center mb-6">
          <span class="text-6xl group-hover:animate-bounce">{{
            effect.icon
          }}</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-4 text-center">
          {{ effect.title }}
        </h3>
        <p class="text-gray-600 mb-6 text-center leading-relaxed">
          {{ effect.description }}
        </p>
        <div class="flex flex-wrap gap-2 justify-center">
          <span
            v-for="tech in effect.tech"
            :key="tech"
            class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="card">
      <h2 class="text-4xl font-bold text-center mb-12 text-gradient">
        技術特色
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          class="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">🎨 豐富動畫</h3>
          <p class="text-gray-600">使用 GSAP、VueUse Motion 等庫創建流暢動畫</p>
        </div>
        <div
          class="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-indigo-50 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">🎯 3D 效果</h3>
          <p class="text-gray-600">Three.js 實現的 3D 場景和互動</p>
        </div>
        <div
          class="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">✨ 粒子系統</h3>
          <p class="text-gray-600">Canvas 和 WebGL 粒子特效</p>
        </div>
        <div
          class="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-indigo-50 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">
            🎬 Lottie 動畫
          </h3>
          <p class="text-gray-600">After Effects 導出的動畫效果</p>
        </div>
        <div
          class="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">🖱️ 互動體驗</h3>
          <p class="text-gray-600">滑鼠和觸控互動特效</p>
        </div>
        <div
          class="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-indigo-50 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold mb-3 text-gray-800">
            📱 響應式設計
          </h3>
          <p class="text-gray-600">適配各種裝置尺寸</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import { useRouter } from "vue-router"

export default {
  name: "HomePage",
  setup() {
    const router = useRouter()

    const effects = ref([
      {
        id: 0,
        title: "Vue 3 基礎實驗室",
        description:
          "從 React 視角學 Composition API、Composables、Pinia，打好基礎再玩動畫",
        icon: "📚",
        path: "/vue-basics",
        tech: ["Composition API", "Pinia", "Composables"],
      },
      {
        id: 1,
        title: "粒子特效",
        description: "使用 Canvas 和 WebGL 創建的粒子系統，支援滑鼠互動",
        icon: "✨",
        path: "/particles",
        tech: ["Canvas", "WebGL", "Vue 3"],
      },
      {
        id: 2,
        title: "GSAP 動畫",
        description: "專業級動畫庫，創建複雜的時間軸動畫效果",
        icon: "🎬",
        path: "/gsap-animations",
        tech: ["GSAP", "Timeline", "Easing"],
      },
      {
        id: 3,
        title: "Three.js 3D",
        description: "3D 場景渲染，包含模型、光照和材質效果",
        icon: "🎯",
        path: "/three-js",
        tech: ["Three.js", "WebGL", "3D"],
      },
      {
        id: 4,
        title: "Lottie 動畫",
        description: "After Effects 導出的 JSON 動畫，輕量且流暢",
        icon: "🎨",
        path: "/lottie",
        tech: ["Lottie", "After Effects", "JSON"],
      },
      {
        id: 5,
        title: "Motion 動畫",
        description: "VueUse Motion 提供的聲明式動畫系統",
        icon: "🌊",
        path: "/motion",
        tech: ["VueUse", "Motion", "Spring"],
      },
      {
        id: 6,
        title: "互動特效",
        description: "滑鼠、觸控和鍵盤互動的動態效果",
        icon: "🖱️",
        path: "/interactive",
        tech: ["Events", "Physics", "Interaction"],
      },
    ])

    const navigateToEffect = path => {
      router.push(path)
    }

    return {
      effects,
      navigateToEffect,
    }
  },
}
</script>

<style scoped>
/* 自定義動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
</style>
