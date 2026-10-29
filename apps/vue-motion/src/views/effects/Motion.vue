<template>
  <div class="motion-page">
    <div class="page-header">
      <h1>🌊 Motion 動畫</h1>
      <p>VueUse Motion 提供的聲明式動畫系統</p>
    </div>

    <div class="controls">
      <button @click="toggleAnimations" class="control-btn">
        {{ isAnimating ? "暫停動畫" : "開始動畫" }}
      </button>
      <button @click="resetAnimations" class="control-btn">重置動畫</button>
    </div>

    <div class="animation-container">
      <!-- 基本動畫 -->
      <div class="animation-section">
        <h3>基本動畫</h3>
        <div class="demo-area">
          <div
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: motionMs(1000) } }"
            :visible="{ scale: 1.1, transition: { duration: motionMs(500) } }"
            :visibleOnce="{ scale: 1 }"
            class="motion-box basic-motion"
          >
            淡入 + 縮放
          </div>
        </div>
      </div>

      <!-- 滑動動畫 -->
      <div class="animation-section">
        <h3>滑動動畫</h3>
        <div class="demo-area">
          <div
            v-motion
            :initial="{ x: -100, opacity: 0 }"
            :enter="{
              x: 0,
              opacity: 1,
              transition: { duration: motionMs(800), delay: prefersReducedMotion ? 0 : 200 },
            }"
            :hovered="{ x: 20, transition: { duration: motionMs(300) } }"
            class="motion-box slide-motion"
          >
            左滑入
          </div>
          <div
            v-motion
            :initial="{ x: 100, opacity: 0 }"
            :enter="{
              x: 0,
              opacity: 1,
              transition: { duration: motionMs(800), delay: prefersReducedMotion ? 0 : 400 },
            }"
            :hovered="{ x: -20, transition: { duration: motionMs(300) } }"
            class="motion-box slide-motion"
          >
            右滑入
          </div>
        </div>
      </div>

      <!-- 旋轉動畫 -->
      <div class="animation-section">
        <h3>旋轉動畫</h3>
        <div class="demo-area">
          <div
            v-motion
            :initial="{ rotation: 0, scale: 0 }"
            :enter="{
              rotation: 360,
              scale: 1,
              transition: { duration: motionMs(1500), ease: 'easeOut' },
            }"
            :hovered="{
              rotation: 180,
              scale: 1.2,
              transition: { duration: motionMs(500) },
            }"
            class="motion-box rotate-motion"
          >
            旋轉進入
          </div>
        </div>
      </div>

      <!-- 彈性動畫 -->
      <div class="animation-section">
        <h3>彈性動畫</h3>
        <div class="demo-area">
          <div
            v-motion
            :initial="{ scale: 0, y: 50 }"
            :enter="{
              scale: 1,
              y: 0,
              transition: { duration: motionMs(800), ease: 'backOut' },
            }"
            :hovered="{
              scale: 1.1,
              y: -10,
              transition: { duration: motionMs(300), ease: 'backOut' },
            }"
            class="motion-box elastic-motion"
          >
            彈性效果
          </div>
        </div>
      </div>

      <!-- 序列動畫 -->
      <div class="animation-section">
        <h3>序列動畫</h3>
        <div class="demo-area">
          <div
            v-for="(item, index) in sequenceItems"
            :key="index"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { duration: motionMs(500), delay: prefersReducedMotion ? 0 : index * 100 },
            }"
            :hovered="{ scale: 1.05, transition: { duration: motionMs(200) } }"
            class="sequence-item"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 路徑動畫 -->
      <div class="animation-section">
        <h3>路徑動畫</h3>
        <div class="demo-area path-demo">
          <div
            v-motion
            :initial="{ x: 0, y: 0 }"
            :enter="pathEnter"
            class="motion-box path-motion"
          >
            路徑移動
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>VueUse Motion 特色</h3>
      <div class="features-grid">
        <div class="feature-card">
          <h4>🎯 聲明式</h4>
          <p>使用 Vue 指令直接定義動畫，無需複雜的 JavaScript</p>
        </div>
        <div class="feature-card">
          <h4>⚡ 高效能</h4>
          <p>基於 Web Animations API，硬體加速，流暢動畫</p>
        </div>
        <div class="feature-card">
          <h4>🎨 豐富緩動</h4>
          <p>支援多種緩動函數，包括自定義貝塞爾曲線</p>
        </div>
        <div class="feature-card">
          <h4>🔄 響應式</h4>
          <p>動畫狀態響應式更新，支援條件動畫</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue"

import { usePrefersReducedMotion } from "../../composables/usePrefersReducedMotion.js"

export default {
  name: "MotionEffect",
  setup() {
    const prefersReducedMotion = usePrefersReducedMotion()
    const motionMs = duration => (prefersReducedMotion.value ? 0 : duration)
    const isAnimating = ref(true)
    const sequenceItems = ref([
      "項目 1",
      "項目 2",
      "項目 3",
      "項目 4",
      "項目 5",
    ])

    const toggleAnimations = () => {
      isAnimating.value = !isAnimating.value
    }

    const resetAnimations = () => {
      window.location.reload()
    }

    const pathEnter = computed(() =>
      prefersReducedMotion.value
        ? { x: 0, y: 0 }
        : {
            x: [0, 100, 200, 100, 0],
            y: [0, -50, 0, 50, 0],
            transition: {
              duration: 3000,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }
    )

    onMounted(() => {
      setTimeout(() => {
        isAnimating.value = true
      }, 100)
    })

    return {
      prefersReducedMotion,
      motionMs,
      pathEnter,
      isAnimating,
      sequenceItems,
      toggleAnimations,
      resetAnimations,
    }
  },
}
</script>

<style scoped>
.motion-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.control-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.animation-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
}

.animation-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.animation-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.demo-area {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 40px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.motion-box {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.basic-motion {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.slide-motion {
  background: linear-gradient(45deg, #f093fb, #f5576c);
}

.rotate-motion {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
}

.elastic-motion {
  background: linear-gradient(45deg, #43e97b, #38f9d7);
}

.path-motion {
  background: linear-gradient(45deg, #fa709a, #fee140);
}

.sequence-item {
  background: linear-gradient(45deg, #a8edea, #fed6e3);
  color: #2c3e50;
  padding: 15px 25px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sequence-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.path-demo {
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
}

.path-demo::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  opacity: 0.3;
}

.info-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h4 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: center;
  }

  .control-btn {
    width: 200px;
  }

  .motion-box {
    width: 100px;
    height: 100px;
    font-size: 0.8rem;
  }

  .demo-area {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
