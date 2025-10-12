<template>
  <div class="gsap-page">
    <div class="page-header">
      <h1>🎬 GSAP 動畫</h1>
      <p>專業級動畫庫，創建複雜的時間軸動畫效果</p>
    </div>

    <div class="controls">
      <button @click="playTimeline" class="control-btn" :disabled="isPlaying">
        {{ isPlaying ? "播放中..." : "播放動畫" }}
      </button>
      <button @click="pauseTimeline" class="control-btn" :disabled="!isPlaying">
        暫停
      </button>
      <button @click="restartTimeline" class="control-btn">重新開始</button>
      <button @click="reverseTimeline" class="control-btn">反向播放</button>
    </div>

    <div class="animation-container">
      <!-- 基本動畫 -->
      <div class="animation-section">
        <h3>基本動畫</h3>
        <div class="demo-area">
          <div ref="basicBox" class="animated-box basic-box"></div>
        </div>
      </div>

      <!-- 時間軸動畫 -->
      <div class="animation-section">
        <h3>時間軸動畫</h3>
        <div class="demo-area">
          <div ref="timelineBox1" class="animated-box timeline-box"></div>
          <div ref="timelineBox2" class="animated-box timeline-box"></div>
          <div ref="timelineBox3" class="animated-box timeline-box"></div>
        </div>
      </div>

      <!-- 彈性動畫 -->
      <div class="animation-section">
        <h3>彈性動畫</h3>
        <div class="demo-area">
          <div ref="elasticBox" class="animated-box elastic-box"></div>
        </div>
      </div>

      <!-- 文字動畫 -->
      <div class="animation-section">
        <h3>文字動畫</h3>
        <div class="demo-area">
          <h2 ref="textAnimation" class="animated-text">Vue 3 + GSAP</h2>
        </div>
      </div>

      <!-- 路徑動畫 -->
      <div class="animation-section">
        <h3>路徑動畫</h3>
        <div class="demo-area path-demo">
          <svg class="path-svg" viewBox="0 0 400 200">
            <path
              ref="motionPath"
              d="M50,100 Q200,20 350,100"
              stroke="#667eea"
              stroke-width="2"
              fill="none"
            />
            <circle ref="pathCircle" r="8" fill="#667eea">
              <animateMotion dur="3s" repeatCount="indefinite">
                <mpath :href="'#motionPath'" />
              </animateMotion>
            </circle>
          </svg>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h3>GSAP 特色功能</h3>
      <div class="features-grid">
        <div class="feature-card">
          <h4>🎯 精確控制</h4>
          <p>精確到像素的動畫控制，支援複雜的時間軸編排</p>
        </div>
        <div class="feature-card">
          <h4>⚡ 高效能</h4>
          <p>硬體加速，60fps 流暢動畫，優化移動裝置效能</p>
        </div>
        <div class="feature-card">
          <h4>🎨 豐富緩動</h4>
          <p>內建多種緩動函數，支援自定義貝塞爾曲線</p>
        </div>
        <div class="feature-card">
          <h4>🔄 時間軸</h4>
          <p>複雜動畫序列管理，支援播放、暫停、反向控制</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue"
import { gsap } from "gsap"

export default {
  name: "GSAPAnimationsEffect",
  setup() {
    const basicBox = ref(null)
    const timelineBox1 = ref(null)
    const timelineBox2 = ref(null)
    const timelineBox3 = ref(null)
    const elasticBox = ref(null)
    const textAnimation = ref(null)
    const pathCircle = ref(null)
    const motionPath = ref(null)

    const isPlaying = ref(false)
    let masterTimeline = null

    const initAnimations = () => {
      // 基本動畫
      if (basicBox.value) {
        gsap.set(basicBox.value, { x: 0, y: 0, rotation: 0 })
        gsap.to(basicBox.value, {
          x: 200,
          y: 50,
          rotation: 360,
          duration: 2,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        })
      }

      // 彈性動畫
      if (elasticBox.value) {
        gsap.set(elasticBox.value, { scale: 1 })
        gsap.to(elasticBox.value, {
          scale: 1.5,
          duration: 1,
          ease: "elastic.out(1, 0.3)",
          repeat: -1,
          yoyo: true,
        })
      }

      // 文字動畫
      if (textAnimation.value) {
        const chars = textAnimation.value.textContent.split("")
        textAnimation.value.innerHTML = chars
          .map(char => `<span style="display: inline-block;">${char}</span>`)
          .join("")

        gsap.fromTo(
          textAnimation.value.children,
          { y: 50, opacity: 0, rotation: 10 },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.1,
            repeat: -1,
            repeatDelay: 2,
          }
        )
      }

      // 主時間軸
      masterTimeline = gsap.timeline({ paused: true })

      if (timelineBox1.value && timelineBox2.value && timelineBox3.value) {
        masterTimeline
          .set([timelineBox1.value, timelineBox2.value, timelineBox3.value], {
            x: 0,
            opacity: 0,
          })
          .to(timelineBox1.value, {
            x: 150,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          })
          .to(
            timelineBox2.value,
            { x: 150, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.5"
          )
          .to(
            timelineBox3.value,
            { x: 150, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.5"
          )
          .to([timelineBox1.value, timelineBox2.value, timelineBox3.value], {
            rotation: 360,
            duration: 1,
            ease: "power2.inOut",
          })
          .to([timelineBox1.value, timelineBox2.value, timelineBox3.value], {
            scale: 1.2,
            duration: 0.5,
            ease: "back.out(1.7)",
          })
          .to([timelineBox1.value, timelineBox2.value, timelineBox3.value], {
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          })
      }
    }

    const playTimeline = () => {
      if (masterTimeline) {
        masterTimeline.play()
        isPlaying.value = true
      }
    }

    const pauseTimeline = () => {
      if (masterTimeline) {
        masterTimeline.pause()
        isPlaying.value = false
      }
    }

    const restartTimeline = () => {
      if (masterTimeline) {
        masterTimeline.restart()
        isPlaying.value = true
      }
    }

    const reverseTimeline = () => {
      if (masterTimeline) {
        masterTimeline.reverse()
        isPlaying.value = !isPlaying.value
      }
    }

    onMounted(() => {
      initAnimations()
    })

    onUnmounted(() => {
      if (masterTimeline) {
        masterTimeline.kill()
      }
      gsap.killTweensOf("*")
    })

    return {
      basicBox,
      timelineBox1,
      timelineBox2,
      timelineBox3,
      elasticBox,
      textAnimation,
      pathCircle,
      motionPath,
      isPlaying,
      playTimeline,
      pauseTimeline,
      restartTimeline,
      reverseTimeline,
    }
  },
}
</script>

<style scoped>
.gsap-page {
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
  position: relative;
}

.animated-box {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin: 0 10px;
}

.basic-box {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.timeline-box {
  background: linear-gradient(45deg, #f093fb, #f5576c);
}

.elastic-box {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
}

.animated-text {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.path-demo {
  background: #1a1a1a;
  padding: 20px;
}

.path-svg {
  width: 100%;
  height: 200px;
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

  .animated-text {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
