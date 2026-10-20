import { defineStore } from "pinia"
import { computed, ref } from "vue"

/**
 * Pinia store — 全域狀態（類似 Redux / Zustand）
 */
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0)
  const history = ref([])
  const lastActionAt = ref(null)

  const label = computed(() =>
    count.value === 0 ? "尚未計數" : `目前：${count.value}`
  )

  const lastActionLabel = computed(() => {
    if (!lastActionAt.value) return "尚無操作"
    return lastActionAt.value.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  })

  function recordAction(message) {
    history.value.push(message)
    lastActionAt.value = new Date()
  }

  function increment() {
    count.value += 1
    recordAction(`+1 → ${count.value}`)
  }

  function decrement() {
    count.value -= 1
    recordAction(`-1 → ${count.value}`)
  }

  function reset() {
    count.value = 0
    recordAction("reset → 0")
  }

  return {
    count,
    history,
    lastActionAt,
    label,
    lastActionLabel,
    increment,
    decrement,
    reset,
  }
})