import { computed, ref } from "vue"

/**
 * 可重用的計數器 composable — Vue 版「自訂 hook」
 * React 對照：function useCounter(initial) { const [count, setCount] = useState(initial); ... }
 */
export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)

  function increment(step = 1) {
    count.value += step
  }

  function decrement(step = 1) {
    count.value -= step
  }

  function reset() {
    count.value = initial
  }

  return { count, doubled, isEven, increment, decrement, reset }
}
