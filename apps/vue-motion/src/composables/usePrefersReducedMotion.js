import { onUnmounted, ref } from "vue"

const QUERY = "(prefers-reduced-motion: reduce)"

function getMediaQuery() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null
  }
  return window.matchMedia(QUERY)
}

/**
 * 讀取 OS `prefers-reduced-motion`，並在設定變更時更新
 */
export function usePrefersReducedMotion() {
  const mediaQuery = getMediaQuery()
  const prefersReducedMotion = ref(Boolean(mediaQuery?.matches))

  if (!mediaQuery) return prefersReducedMotion

  const onChange = event => {
    prefersReducedMotion.value = event.matches
  }

  mediaQuery.addEventListener("change", onChange)
  onUnmounted(() => {
    mediaQuery.removeEventListener("change", onChange)
  })

  return prefersReducedMotion
}
