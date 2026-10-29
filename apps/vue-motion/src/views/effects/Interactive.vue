<template>
  <div class="interactive-page">
    <div class="page-header">
      <h1>🖱️ 互動特效</h1>
      <p>滑鼠、觸控和鍵盤互動的動態效果</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>互動模式: {{ interactionMode }}</label>
        <select v-model="interactionMode" class="control-select">
          <option value="mouse">滑鼠模式</option>
          <option value="touch">觸控模式</option>
          <option value="keyboard">鍵盤模式</option>
        </select>
      </div>

      <button @click="resetEffects" class="control-btn">重置效果</button>
    </div>

    <div class="interactive-container">
      <!-- 滑鼠跟隨 -->
      <div class="interactive-section">
        <h3>滑鼠跟隨</h3>
        <div
          class="demo-area mouse-follow"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
        >
          <div
            ref="mouseFollower"
            class="mouse-follower"
            :style="{
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            }"
          ></div>
          <p>移動滑鼠查看跟隨效果</p>
        </div>
      </div>

      <!-- 點擊波紋 -->
      <div class="interactive-section">
        <h3>點擊波紋</h3>
        <div class="demo-area ripple-container" @click="createRipple">
          <div
            v-for="ripple in ripples"
            :key="ripple.id"
            class="ripple"
            :style="{
              left: ripple.x + 'px',
              top: ripple.y + 'px',
              animationDelay: ripple.delay + 'ms',
            }"
          ></div>
          <p>點擊任意位置查看波紋效果</p>
        </div>
      </div>

      <!-- 懸停變形 -->
      <div class="interactive-section">
        <h3>懸停變形</h3>
        <div class="demo-area hover-demo">
          <div
            v-for="(item, index) in hoverItems"
            :key="index"
            class="hover-item"
            :class="`hover-${index + 1}`"
            @mouseenter="onHoverEnter(index)"
            @mouseleave="onHoverLeave(index)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 鍵盤互動 -->
      <div class="interactive-section">
        <h3>鍵盤互動</h3>
        <div class="demo-area keyboard-demo">
          <div class="keyboard-instructions">
            <p>按鍵盤方向鍵控制方塊移動</p>
            <p>當前位置: ({{ keyboardPos.x }}, {{ keyboardPos.y }})</p>
          </div>
          <div
            class="keyboard-box"
            :style="{
              transform: `translate(${keyboardPos.x}px, ${keyboardPos.y}px)`,
            }"
          ></div>
        </div>
      </div>

      <!-- 拖拽效果 -->
      <div class="interactive-section">
        <h3>拖拽效果</h3>
        <div class="demo-area drag-demo">
          <div
            v-for="(item, index) in draggableItems"
            :key="index"
            class="draggable-item"
            :style="{
              transform: `translate(${item.x}px, ${item.y}px)`,
              backgroundColor: item.color,
            }"
            @mousedown="startDrag(index, $event)"
            @touchstart="startDrag(index, $event)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>

      <!-- 觸控手勢 -->
      <div class="interactive-section">
        <h3>觸控手勢</h3>
        <div
          class="demo-area touch-demo"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div
            class="touch-indicator"
            :style="{
              transform: `translate(${touchPos.x}px, ${touchPos.y}px) scale(${touchScale})`,
              opacity: touchOpacity,
            }"
          ></div>
          <p>在觸控裝置上進行手勢操作</p>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>互動特效技術</h3>
      <div class="features-grid">
        <div class="feature-card">
          <h4>🖱️ 滑鼠事件</h4>
          <p>mousemove, mouseenter, mouseleave, click 等事件處理</p>
        </div>
        <div class="feature-card">
          <h4>📱 觸控事件</h4>
          <p>touchstart, touchmove, touchend 觸控手勢識別</p>
        </div>
        <div class="feature-card">
          <h4>⌨️ 鍵盤事件</h4>
          <p>keydown, keyup 鍵盤輸入響應</p>
        </div>
        <div class="feature-card">
          <h4>🎨 動畫效果</h4>
          <p>CSS 動畫、變換、過渡效果組合</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue"

import { usePrefersReducedMotion } from "../../composables/usePrefersReducedMotion.js"

export default {
  name: "InteractiveEffect",
  setup() {
    const prefersReducedMotion = usePrefersReducedMotion()
    const interactionMode = ref("mouse")
    const mouseFollower = ref(null)
    const mousePos = ref({ x: 0, y: 0 })
    const ripples = ref([])
    const hoverItems = ref(["懸停效果 1", "懸停效果 2", "懸停效果 3"])
    const keyboardPos = ref({ x: 0, y: 0 })
    const draggableItems = ref([
      { x: 0, y: 0, color: "#667eea", text: "拖拽 1" },
      { x: 100, y: 0, color: "#f093fb", text: "拖拽 2" },
      { x: 200, y: 0, color: "#4facfe", text: "拖拽 3" },
    ])
    const touchPos = ref({ x: 0, y: 0 })
    const touchScale = ref(1)
    const touchOpacity = ref(0)

    let isDragging = false
    let dragIndex = -1
    let dragOffset = { x: 0, y: 0 }

    const onMouseMove = event => {
      if (interactionMode.value !== "mouse") return

      const rect = event.currentTarget.getBoundingClientRect()
      mousePos.value = {
        x: event.clientX - rect.left - 25,
        y: event.clientY - rect.top - 25,
      }
    }

    const onMouseLeave = () => {
      mousePos.value = { x: 0, y: 0 }
    }

    const createRipple = event => {
      if (prefersReducedMotion.value) return

      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const ripple = {
        id: Date.now(),
        x: x - 25,
        y: y - 25,
        delay: 0,
      }

      ripples.value.push(ripple)

      // 移除波紋
      setTimeout(() => {
        const index = ripples.value.findIndex(r => r.id === ripple.id)
        if (index > -1) {
          ripples.value.splice(index, 1)
        }
      }, 600)
    }

    const onHoverEnter = () => {
      // 懸停效果由 CSS 處理
    }

    const onHoverLeave = () => {
      // 懸停效果由 CSS 處理
    }

    const onKeyDown = event => {
      if (interactionMode.value !== "keyboard") return

      const step = 20
      switch (event.key) {
        case "ArrowUp":
          keyboardPos.value.y = Math.max(0, keyboardPos.value.y - step)
          break
        case "ArrowDown":
          keyboardPos.value.y = Math.min(200, keyboardPos.value.y + step)
          break
        case "ArrowLeft":
          keyboardPos.value.x = Math.max(0, keyboardPos.value.x - step)
          break
        case "ArrowRight":
          keyboardPos.value.x = Math.min(300, keyboardPos.value.x + step)
          break
      }
    }

    const startDrag = (index, event) => {
      isDragging = true
      dragIndex = index

      const rect = event.currentTarget.getBoundingClientRect()
      const startX =
        event.type === "mousedown" ? event.clientX : event.touches[0].clientX
      const startY =
        event.type === "mousedown" ? event.clientY : event.touches[0].clientY

      dragOffset.value = {
        x: startX - rect.left - draggableItems.value[index].x,
        y: startY - rect.top - draggableItems.value[index].y,
      }

      event.preventDefault()
    }

    const onMouseMoveDrag = event => {
      if (!isDragging || dragIndex === -1) return

      // 獲取拖拽區域的邊界
      const dragDemo = document.querySelector(".drag-demo")
      if (!dragDemo) return

      const rect = dragDemo.getBoundingClientRect()
      draggableItems.value[dragIndex].x =
        event.clientX - rect.left - dragOffset.value.x
      draggableItems.value[dragIndex].y =
        event.clientY - rect.top - dragOffset.value.y
    }

    const onMouseUp = () => {
      isDragging = false
      dragIndex = -1
    }

    const onTouchStart = event => {
      if (interactionMode.value !== "touch") return

      const touch = event.touches[0]
      const rect = event.currentTarget.getBoundingClientRect()

      touchPos.value = {
        x: touch.clientX - rect.left - 25,
        y: touch.clientY - rect.top - 25,
      }

      touchScale.value = 1.5
      touchOpacity.value = 0.8
    }

    const onTouchMove = event => {
      if (interactionMode.value !== "touch") return

      const touch = event.touches[0]
      const rect = event.currentTarget.getBoundingClientRect()

      touchPos.value = {
        x: touch.clientX - rect.left - 25,
        y: touch.clientY - rect.top - 25,
      }
    }

    const onTouchEnd = () => {
      if (interactionMode.value !== "touch") return

      touchScale.value = 1
      touchOpacity.value = 0
    }

    const resetEffects = () => {
      mousePos.value = { x: 0, y: 0 }
      ripples.value = []
      keyboardPos.value = { x: 0, y: 0 }
      draggableItems.value = [
        { x: 0, y: 0, color: "#667eea", text: "拖拽 1" },
        { x: 100, y: 0, color: "#f093fb", text: "拖拽 2" },
        { x: 200, y: 0, color: "#4facfe", text: "拖拽 3" },
      ]
      touchPos.value = { x: 0, y: 0 }
      touchScale.value = 1
      touchOpacity.value = 0
    }

    onMounted(() => {
      document.addEventListener("keydown", onKeyDown)
      document.addEventListener("mousemove", onMouseMoveDrag)
      document.addEventListener("mouseup", onMouseUp)
    })

    onUnmounted(() => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousemove", onMouseMoveDrag)
      document.removeEventListener("mouseup", onMouseUp)
    })

    return {
      interactionMode,
      mouseFollower,
      mousePos,
      ripples,
      hoverItems,
      keyboardPos,
      draggableItems,
      touchPos,
      touchScale,
      touchOpacity,
      onMouseMove,
      onMouseLeave,
      createRipple,
      onHoverEnter,
      onHoverLeave,
      startDrag,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      resetEffects,
    }
  },
}
</script>

<style scoped>
.interactive-page {
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
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
}

.control-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.control-select {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.control-select:focus {
  outline: none;
  border-color: #667eea;
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

.interactive-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.interactive-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.interactive-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
  text-align: center;
}

.demo-area {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 30px;
  min-height: 200px;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.demo-area p {
  text-align: center;
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.mouse-follow {
  cursor: crosshair;
}

.mouse-follower {
  position: absolute;
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  pointer-events: none;
  transition: transform 0.1s ease;
  z-index: 10;
}

.ripple-container {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 3px solid #667eea;
  border-radius: 50%;
  pointer-events: none;
  animation: ripple-animation 0.6s ease-out;
}

@keyframes ripple-animation {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ripple {
    animation: none;
  }
}

.hover-demo {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.hover-item {
  padding: 20px 30px;
  background: linear-gradient(45deg, #f093fb, #f5576c);
  color: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.hover-item:hover {
  transform: translateY(-10px) scale(1.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.keyboard-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.keyboard-instructions {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.keyboard-box {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border-radius: 10px;
  transition: transform 0.2s ease;
}

.drag-demo {
  position: relative;
  min-height: 150px;
}

.draggable-item {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 15px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  font-weight: 500;
  font-size: 0.9rem;
  transition: transform 0.2s ease;
  user-select: none;
}

.draggable-item:active {
  cursor: grabbing;
  transform: scale(1.1);
}

.touch-demo {
  position: relative;
  min-height: 200px;
}

.touch-indicator {
  position: absolute;
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #43e97b, #38f9d7);
  border-radius: 50%;
  pointer-events: none;
  transition: all 0.3s ease;
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
    align-items: stretch;
  }

  .control-group {
    min-width: auto;
  }

  .interactive-container {
    grid-template-columns: 1fr;
  }

  .hover-demo {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
