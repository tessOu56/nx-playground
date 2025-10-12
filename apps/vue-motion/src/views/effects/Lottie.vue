<template>
  <div class="lottie-page">
    <div class="page-header">
      <h1>🎨 Lottie 動畫</h1>
      <p>After Effects 導出的 JSON 動畫，輕量且流暢</p>
    </div>

    <div class="controls">
      <button @click="playAnimation" class="control-btn" :disabled="isPlaying">
        {{ isPlaying ? "播放中..." : "播放" }}
      </button>
      <button
        @click="pauseAnimation"
        class="control-btn"
        :disabled="!isPlaying"
      >
        暫停
      </button>
      <button @click="stopAnimation" class="control-btn">停止</button>
      <button @click="changeSpeed" class="control-btn">
        切換速度 ({{ currentSpeed }}x)
      </button>
    </div>

    <div class="animation-container">
      <!-- 載入動畫 -->
      <div class="animation-section">
        <h3>載入動畫</h3>
        <div class="demo-area">
          <div ref="loadingContainer" class="lottie-container"></div>
        </div>
      </div>

      <!-- 成功動畫 -->
      <div class="animation-section">
        <h3>成功動畫</h3>
        <div class="demo-area">
          <div ref="successContainer" class="lottie-container"></div>
        </div>
      </div>

      <!-- 錯誤動畫 -->
      <div class="animation-section">
        <h3>錯誤動畫</h3>
        <div class="demo-area">
          <div ref="errorContainer" class="lottie-container"></div>
        </div>
      </div>

      <!-- 自定義動畫 -->
      <div class="animation-section">
        <h3>自定義動畫</h3>
        <div class="demo-area">
          <div ref="customContainer" class="lottie-container"></div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>Lottie 動畫優勢</h3>
      <div class="features-grid">
        <div class="feature-card">
          <h4>🎬 設計師友好</h4>
          <p>直接在 After Effects 中設計，無需程式碼</p>
        </div>
        <div class="feature-card">
          <h4>📦 輕量級</h4>
          <p>JSON 格式，檔案小，載入速度快</p>
        </div>
        <div class="feature-card">
          <h4>🎯 高品質</h4>
          <p>向量動畫，支援任意縮放不失真</p>
        </div>
        <div class="feature-card">
          <h4>🔄 可控制</h4>
          <p>支援播放、暫停、速度控制等操作</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue"
import lottie from "lottie-web"

export default {
  name: "LottieEffect",
  setup() {
    const loadingContainer = ref(null)
    const successContainer = ref(null)
    const errorContainer = ref(null)
    const customContainer = ref(null)

    const isPlaying = ref(false)
    const currentSpeed = ref(1)

    let loadingAnimation = null
    let successAnimation = null
    let errorAnimation = null
    let customAnimation = null

    // 簡單的載入動畫 JSON
    const createLoadingAnimation = () => {
      return {
        v: "5.7.4",
        fr: 60,
        ip: 0,
        op: 60,
        w: 100,
        h: 100,
        nm: "Loading",
        ddd: 0,
        assets: [],
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Circle",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    t: 0,
                    s: [0],
                  },
                  { t: 60, s: [360] },
                ],
              },
              p: { a: 0, k: [50, 50, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: { a: 0, k: [100, 100, 100] },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    d: 1,
                    ty: "el",
                    s: { a: 0, k: [60, 60] },
                    p: { a: 0, k: [0, 0] },
                    nm: "Ellipse Path 1",
                  },
                  {
                    ty: "st",
                    c: { a: 0, k: [0.4, 0.63, 0.92, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 4 },
                    lc: 2,
                    lj: 2,
                    ml: 4,
                    bm: 0,
                    nm: "Stroke 1",
                  },
                ],
                nm: "Ellipse 1",
              },
            ],
            ip: 0,
            op: 60,
            st: 0,
            bm: 0,
          },
        ],
        markers: [],
      }
    }

    // 簡單的成功動畫 JSON
    const createSuccessAnimation = () => {
      return {
        v: "5.7.4",
        fr: 60,
        ip: 0,
        op: 60,
        w: 100,
        h: 100,
        nm: "Success",
        ddd: 0,
        assets: [],
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Check",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              p: { a: 0, k: [50, 50, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                    o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                    t: 0,
                    s: [0, 0, 100],
                  },
                  { t: 30, s: [120, 120, 100] },
                  { t: 60, s: [100, 100, 100] },
                ],
              },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    ty: "rc",
                    d: 1,
                    s: { a: 0, k: [80, 80] },
                    p: { a: 0, k: [0, 0] },
                    r: { a: 0, k: 40 },
                    nm: "Rectangle Path 1",
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.2, 0.8, 0.4, 1] },
                    o: { a: 0, k: 100 },
                    r: 1,
                    bm: 0,
                    nm: "Fill 1",
                  },
                ],
                nm: "Background",
              },
              {
                ty: "gr",
                it: [
                  {
                    ty: "sh",
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-15, -5],
                          [-5, 5],
                          [15, -15],
                        ],
                        c: false,
                      },
                    },
                    nm: "Path 1",
                  },
                  {
                    ty: "st",
                    c: { a: 0, k: [1, 1, 1, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 6 },
                    lc: 2,
                    lj: 2,
                    ml: 4,
                    bm: 0,
                    nm: "Stroke 1",
                  },
                ],
                nm: "Check",
              },
            ],
            ip: 0,
            op: 60,
            st: 0,
            bm: 0,
          },
        ],
        markers: [],
      }
    }

    // 簡單的錯誤動畫 JSON
    const createErrorAnimation = () => {
      return {
        v: "5.7.4",
        fr: 60,
        ip: 0,
        op: 60,
        w: 100,
        h: 100,
        nm: "Error",
        ddd: 0,
        assets: [],
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Cross",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833], y: [0.833] },
                    o: { x: [0.167], y: [0.167] },
                    t: 0,
                    s: [0],
                  },
                  { t: 30, s: [10] },
                  { t: 60, s: [0] },
                ],
              },
              p: { a: 0, k: [50, 50, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: {
                a: 1,
                k: [
                  {
                    i: { x: [0.833, 0.833, 0.833], y: [0.833, 0.833, 0.833] },
                    o: { x: [0.167, 0.167, 0.167], y: [0.167, 0.167, 0.167] },
                    t: 0,
                    s: [0, 0, 100],
                  },
                  { t: 30, s: [120, 120, 100] },
                  { t: 60, s: [100, 100, 100] },
                ],
              },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    ty: "rc",
                    d: 1,
                    s: { a: 0, k: [80, 80] },
                    p: { a: 0, k: [0, 0] },
                    r: { a: 0, k: 40 },
                    nm: "Rectangle Path 1",
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.9, 0.3, 0.3, 1] },
                    o: { a: 0, k: 100 },
                    r: 1,
                    bm: 0,
                    nm: "Fill 1",
                  },
                ],
                nm: "Background",
              },
              {
                ty: "gr",
                it: [
                  {
                    ty: "sh",
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [-15, -15],
                          [15, -15],
                          [15, 15],
                          [-15, 15],
                        ],
                        c: false,
                      },
                    },
                    nm: "Path 1",
                  },
                  {
                    ty: "st",
                    c: { a: 0, k: [1, 1, 1, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 6 },
                    lc: 2,
                    lj: 2,
                    ml: 4,
                    bm: 0,
                    nm: "Stroke 1",
                  },
                ],
                nm: "Cross",
              },
            ],
            ip: 0,
            op: 60,
            st: 0,
            bm: 0,
          },
        ],
        markers: [],
      }
    }

    const initAnimations = () => {
      // 載入動畫
      if (loadingContainer.value) {
        loadingAnimation = lottie.loadAnimation({
          container: loadingContainer.value,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: createLoadingAnimation(),
        })
      }

      // 成功動畫
      if (successContainer.value) {
        successAnimation = lottie.loadAnimation({
          container: successContainer.value,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: createSuccessAnimation(),
        })
      }

      // 錯誤動畫
      if (errorContainer.value) {
        errorAnimation = lottie.loadAnimation({
          container: errorContainer.value,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: createErrorAnimation(),
        })
      }

      // 自定義動畫 (使用載入動畫作為範例)
      if (customContainer.value) {
        customAnimation = lottie.loadAnimation({
          container: customContainer.value,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: createLoadingAnimation(),
        })
      }

      isPlaying.value = true
    }

    const playAnimation = () => {
      if (successAnimation) successAnimation.play()
      if (errorAnimation) errorAnimation.play()
      if (customAnimation) customAnimation.play()
      isPlaying.value = true
    }

    const pauseAnimation = () => {
      if (loadingAnimation) loadingAnimation.pause()
      if (successAnimation) successAnimation.pause()
      if (errorAnimation) errorAnimation.pause()
      if (customAnimation) customAnimation.pause()
      isPlaying.value = false
    }

    const stopAnimation = () => {
      if (loadingAnimation) loadingAnimation.stop()
      if (successAnimation) successAnimation.stop()
      if (errorAnimation) errorAnimation.stop()
      if (customAnimation) customAnimation.stop()
      isPlaying.value = false
    }

    const changeSpeed = () => {
      currentSpeed.value =
        currentSpeed.value === 1 ? 2 : currentSpeed.value === 2 ? 0.5 : 1

      if (loadingAnimation) loadingAnimation.setSpeed(currentSpeed.value)
      if (successAnimation) successAnimation.setSpeed(currentSpeed.value)
      if (errorAnimation) errorAnimation.setSpeed(currentSpeed.value)
      if (customAnimation) customAnimation.setSpeed(currentSpeed.value)
    }

    onMounted(() => {
      initAnimations()
    })

    onUnmounted(() => {
      if (loadingAnimation) loadingAnimation.destroy()
      if (successAnimation) successAnimation.destroy()
      if (errorAnimation) errorAnimation.destroy()
      if (customAnimation) customAnimation.destroy()
    })

    return {
      loadingContainer,
      successContainer,
      errorContainer,
      customContainer,
      isPlaying,
      currentSpeed,
      playAnimation,
      pauseAnimation,
      stopAnimation,
      changeSpeed,
    }
  },
}
</script>

<style scoped>
.lottie-page {
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

.control-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.control-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.animation-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.animation-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.animation-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.demo-area {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 40px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottie-container {
  width: 100px;
  height: 100px;
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

  .animation-container {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
