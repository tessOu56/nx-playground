import { ref, watch } from "vue"

/**
 * 將 ref 與 localStorage 雙向同步
 * React 對照：useState + useEffect(() => localStorage.setItem(...), [value])
 */
export function useLocalStorage(key, initialValue) {
  function read() {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initialValue
      return JSON.parse(raw)
    } catch {
      return initialValue
    }
  }

  const value = ref(read())

  watch(
    value,
    newVal => {
      localStorage.setItem(key, JSON.stringify(newVal))
    },
    { deep: true }
  )

  return value
}
