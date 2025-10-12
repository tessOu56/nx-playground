<template>
  <div class="threejs-page">
    <div class="page-header">
      <h1>🎯 Three.js 3D</h1>
      <p>3D 場景渲染，包含模型、光照和材質效果</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>旋轉速度: {{ rotationSpeed }}</label>
        <input
          v-model="rotationSpeed"
          type="range"
          min="0"
          max="0.05"
          step="0.005"
        />
      </div>

      <div class="control-group">
        <label>縮放: {{ scale }}</label>
        <input v-model="scale" type="range" min="0.5" max="2" step="0.1" />
      </div>

      <button @click="toggleAnimation" class="control-btn">
        {{ isAnimating ? "暫停" : "開始" }}
      </button>

      <button @click="changeModel" class="control-btn">切換模型</button>
    </div>

    <div class="canvas-container">
      <canvas ref="canvas" class="threejs-canvas"></canvas>
    </div>

    <div class="info-section">
      <h3>Three.js 功能展示</h3>
      <div class="features-grid">
        <div class="feature-card">
          <h4>🎨 材質系統</h4>
          <p>支援多種材質類型：基本、Lambert、Phong、標準等</p>
        </div>
        <div class="feature-card">
          <h4>💡 光照系統</h4>
          <p>環境光、方向光、點光源、聚光燈等光照效果</p>
        </div>
        <div class="feature-card">
          <h4>📐 幾何體</h4>
          <p>內建多種 3D 幾何體，支援自定義幾何體</p>
        </div>
        <div class="feature-card">
          <h4>🎮 互動控制</h4>
          <p>滑鼠控制相機，鍵盤控制模型變換</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue"
import * as THREE from "three"

export default {
  name: "ThreeJSEffect",
  setup() {
    const canvas = ref(null)
    const rotationSpeed = ref(0.01)
    const scale = ref(1)
    const isAnimating = ref(true)

    let scene = null
    let camera = null
    let renderer = null
    let cube = null
    let sphere = null
    let torus = null
    let currentModel = "cube"
    let animationId = null

    const initThreeJS = () => {
      if (!canvas.value) return

      // 創建場景
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1a1a)

      // 創建相機
      camera = new THREE.PerspectiveCamera(
        75,
        canvas.value.clientWidth / canvas.value.clientHeight,
        0.1,
        1000
      )
      camera.position.z = 5

      // 創建渲染器
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true,
      })
      renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      // 創建幾何體
      createGeometries()

      // 創建光照
      createLights()

      // 開始動畫循環
      animate()
    }

    const createGeometries = () => {
      // 立方體
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
      const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        shininess: 100,
      })
      cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.castShadow = true
      scene.add(cube)

      // 球體
      const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32)
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xf093fb,
        shininess: 100,
      })
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.castShadow = true
      sphere.visible = false
      scene.add(sphere)

      // 環形
      const torusGeometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100)
      const torusMaterial = new THREE.MeshPhongMaterial({
        color: 0x4facfe,
        shininess: 100,
      })
      torus = new THREE.Mesh(torusGeometry, torusMaterial)
      torus.castShadow = true
      torus.visible = false
      scene.add(torus)

      // 地面
      const planeGeometry = new THREE.PlaneGeometry(10, 10)
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.5,
      })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -Math.PI / 2
      plane.position.y = -2
      plane.receiveShadow = true
      scene.add(plane)
    }

    const createLights = () => {
      // 環境光
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
      scene.add(ambientLight)

      // 方向光
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(5, 5, 5)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      scene.add(directionalLight)

      // 點光源
      const pointLight = new THREE.PointLight(0x667eea, 0.5, 100)
      pointLight.position.set(-5, 5, 5)
      scene.add(pointLight)

      // 聚光燈
      const spotLight = new THREE.SpotLight(0xf093fb, 0.5)
      spotLight.position.set(0, 10, 0)
      spotLight.angle = Math.PI / 6
      spotLight.penumbra = 0.1
      spotLight.castShadow = true
      scene.add(spotLight)
    }

    const animate = () => {
      if (!isAnimating.value) {
        animationId = requestAnimationFrame(animate)
        return
      }

      // 旋轉模型
      if (cube && cube.visible) {
        cube.rotation.x += rotationSpeed.value
        cube.rotation.y += rotationSpeed.value
        cube.scale.setScalar(scale.value)
      }

      if (sphere && sphere.visible) {
        sphere.rotation.x += rotationSpeed.value
        sphere.rotation.y += rotationSpeed.value
        sphere.scale.setScalar(scale.value)
      }

      if (torus && torus.visible) {
        torus.rotation.x += rotationSpeed.value
        torus.rotation.y += rotationSpeed.value
        torus.scale.setScalar(scale.value)
      }

      // 相機環繞
      const time = Date.now() * 0.001
      camera.position.x = Math.cos(time * 0.2) * 8
      camera.position.z = Math.sin(time * 0.2) * 8
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    const toggleAnimation = () => {
      isAnimating.value = !isAnimating.value
    }

    const changeModel = () => {
      if (!cube || !sphere || !torus) return

      // 隱藏所有模型
      cube.visible = false
      sphere.visible = false
      torus.visible = false

      // 切換到下一個模型
      switch (currentModel) {
        case "cube":
          currentModel = "sphere"
          sphere.visible = true
          break
        case "sphere":
          currentModel = "torus"
          torus.visible = true
          break
        case "torus":
          currentModel = "cube"
          cube.visible = true
          break
      }
    }

    const handleResize = () => {
      if (!canvas.value || !camera || !renderer) return

      const width = canvas.value.clientWidth
      const height = canvas.value.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    onMounted(() => {
      initThreeJS()
      window.addEventListener("resize", handleResize)
    })

    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener("resize", handleResize)

      if (renderer) {
        renderer.dispose()
      }
    })

    return {
      canvas,
      rotationSpeed,
      scale,
      isAnimating,
      toggleAnimation,
      changeModel,
    }
  },
}
</script>

<style scoped>
.threejs-page {
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

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.control-group input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
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

.canvas-container {
  background: #1a1a1a;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.threejs-canvas {
  width: 100%;
  height: 500px;
  border-radius: 10px;
  background: #000;
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

  .threejs-canvas {
    height: 300px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
