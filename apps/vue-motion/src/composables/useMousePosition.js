import { onMounted, onUnmounted, ref } from "vue"

/**
 * 追蹤滑鼠座標 — 示範 onMounted / onUnmounted 與事件清理
 */
export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.clientX
    y.value = event.clientY
  }

  onMounted(() => {
    window.addEventListener("mousemove", update)
  })

  onUnmounted(() => {
    window.removeEventListener("mousemove", update)
  })

  return { x, y }
}
