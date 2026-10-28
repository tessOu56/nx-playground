<template>
  <div class="space-y-6">
    <LabPanel
      title="Composable：useCounter"
      react-hint="把 useState + handlers 抽成 function useCounter() { ... return { count, increment } }"
      vue-hint="composable 是 .js 檔，可跨元件共用；內部用 ref/computed，每個呼叫端有獨立狀態。"
    >
      <CounterWidget label="實例 A" />
      <CounterWidget label="實例 B" class="mt-4" />
      <p class="mt-3 text-xs text-gray-500">
        兩個 CounterWidget 各自呼叫 useCounter()，狀態互不影響（除非改用 Pinia）。
      </p>
    </LabPanel>

    <LabPanel
      title="Composable：useMousePosition"
      react-hint="useEffect 註冊 listener + cleanup 是常見模式。"
      vue-hint="onMounted / onUnmounted 對應 mount/unmount；composable 內封裝事件清理。"
    >
      <p class="font-mono text-indigo-700">
        滑鼠：x = {{ x }}，y = {{ y }}
      </p>
      <p class="text-xs text-gray-500 mt-2">在頁面上移動滑鼠觀察數值變化</p>
    </LabPanel>

    <LabPanel
      title="練習題 1：useLocalStorage"
      react-hint="useEffect(() => { localStorage.setItem(k, JSON.stringify(v)) }, [v])"
      vue-hint="watch 監聽 ref，變更時寫入 localStorage；初始化時讀取。"
    >
      <label class="block text-sm text-gray-600 mb-2">
        筆記（key: vue-motion-lab-note）
        <input
          v-model="labNote"
          type="text"
          placeholder="輸入後重新整理，內容應保留"
          class="mt-1 w-full border rounded-lg px-3 py-2"
        />
      </label>
      <p class="text-xs text-gray-500">
        實作：<code class="bg-gray-100 px-1 rounded">composables/useLocalStorage.js</code>
      </p>
    </LabPanel>
  </div>
</template>

<script setup>
import { useLocalStorage } from "../../composables/useLocalStorage"
import { useMousePosition } from "../../composables/useMousePosition"
import CounterWidget from "./CounterWidget.vue"
import LabPanel from "./LabPanel.vue"

const { x, y } = useMousePosition()
const labNote = useLocalStorage("vue-motion-lab-note", "")
</script>
