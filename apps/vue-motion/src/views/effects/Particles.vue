<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gradient mb-4">✨ 粒子特效</h1>
      <p class="text-gray-600 text-lg">
        使用 Canvas 和 WebGL 創建的互動粒子系統
      </p>
    </div>

    <!-- Controls -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >粒子數量: {{ particleCount }}</label
          >
          <input
            v-model="particleCount"
            type="range"
            min="50"
            max="500"
            step="50"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            @input="updateParticles"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >連接距離: {{ connectionDistance }}</label
          >
          <input
            v-model="connectionDistance"
            type="range"
            min="50"
            max="200"
            step="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >粒子速度: {{ particleSpeed }}</label
          >
          <input
            v-model="particleSpeed"
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <button @click="toggleAnimation" class="btn-primary">
          {{ isAnimating ? "暫停" : "開始" }}
        </button>
      </div>
    </div>

    <!-- Canvas Container -->
    <div class="bg-gray-900 rounded-2xl p-6 shadow-2xl">
      <canvas
        ref="canvas"
        class="w-full h-96 bg-black rounded-xl cursor-crosshair"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
      ></canvas>
    </div>

    <!-- Info Section -->
    <div class="card">
      <h3 class="text-2xl font-bold text-gray-800 mb-6">技術說明</h3>
      <ul class="space-y-3">
        <li class="flex items-center text-gray-600">
          <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
          使用 HTML5 Canvas 2D API 渲染粒子
        </li>
        <li class="flex items-center text-gray-600">
          <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
          滑鼠互動影響粒子行為
        </li>
        <li class="flex items-center text-gray-600">
          <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
          動態連接線顯示粒子間的關係
        </li>
        <li class="flex items-center text-gray-600">
          <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
          響應式設計，適配不同螢幕尺寸
        </li>
        <li class="flex items-center text-gray-600">
          <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
          使用 Vue 3 Composition API 管理狀態
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue"

export default {
  name: "ParticlesEffect",
  setup() {
    const canvas = ref(null)
    const particleCount = ref(150)
    const connectionDistance = ref(100)
    const particleSpeed = ref(1.5)
    const isAnimating = ref(true)

    let ctx = null
    let animationId = null
    let particles = []
    let mouse = { x: 0, y: 0 }

    class Particle {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * particleSpeed.value
        this.vy = (Math.random() - 0.5) * particleSpeed.value
        this.radius = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // 邊界反彈
        if (this.x < 0 || this.x > canvas.value.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.value.height) this.vy *= -1

        // 滑鼠互動
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = (100 - distance) / 100
          this.vx += (dx / distance) * force * 0.1
          this.vy += (dy / distance) * force * 0.1
        }

        // 限制速度
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        if (speed > 3) {
          this.vx = (this.vx / speed) * 3
          this.vy = (this.vy / speed) * 3
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`
        ctx.fill()
      }
    }

    const initCanvas = () => {
      if (!canvas.value) return

      ctx = canvas.value.getContext("2d")
      resizeCanvas()

      // 創建粒子
      particles = []
      for (let i = 0; i < particleCount.value; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.value.width,
            Math.random() * canvas.value.height
          )
        )
      }
    }

    const resizeCanvas = () => {
      if (!canvas.value) return

      const rect = canvas.value.getBoundingClientRect()
      canvas.value.width = rect.width
      canvas.value.height = rect.height
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance.value) {
            const opacity = 1 - distance / connectionDistance.value
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      if (!isAnimating.value) {
        animationId = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

      // 更新和繪製粒子
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // 繪製連接線
      drawConnections()

      animationId = requestAnimationFrame(animate)
    }

    const updateParticles = () => {
      particles = []
      for (let i = 0; i < particleCount.value; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.value.width,
            Math.random() * canvas.value.height
          )
        )
      }
    }

    const toggleAnimation = () => {
      isAnimating.value = !isAnimating.value
    }

    const onMouseMove = event => {
      const rect = canvas.value.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }

    const onMouseLeave = () => {
      mouse.x = 0
      mouse.y = 0
    }

    onMounted(() => {
      initCanvas()
      animate()

      window.addEventListener("resize", resizeCanvas)
    })

    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener("resize", resizeCanvas)
    })

    return {
      canvas,
      particleCount,
      connectionDistance,
      particleSpeed,
      isAnimating,
      updateParticles,
      toggleAnimation,
      onMouseMove,
      onMouseLeave,
    }
  },
}
</script>

<style scoped>
/* 自定義滑塊樣式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
