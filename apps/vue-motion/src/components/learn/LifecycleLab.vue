<template>
  <LabPanel
    title="生命週期與模板指令"
    react-hint="useEffect(fn, []) 僅 mount；useEffect return 做 cleanup。"
    vue-hint="onMounted / onUnmounted；v-if 條件渲染、v-for 列表（記得 :key）。"
  >
    <div class="flex flex-wrap gap-3 mb-4">
      <button class="btn-primary" @click="showList = !showList">
        {{ showList ? "隱藏" : "顯示" }}待辦清單
      </button>
      <button class="btn-secondary" @click="addTodo">新增項目</button>
    </div>

    <p class="text-xs text-gray-500 mb-3">
      元件已掛載 {{ mountCount }} 次紀錄 · 目前 {{ todos.length }} 項
    </p>

    <ul v-if="showList" class="space-y-2">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
      >
        <span>{{ todo.text }}</span>
        <button
          class="text-sm text-red-500 hover:text-red-700"
          @click="removeTodo(todo.id)"
        >
          刪除
        </button>
      </li>
    </ul>
    <p v-else class="text-sm text-gray-400">清單已隱藏（v-if）</p>
  </LabPanel>
</template>

<script setup>
import { onMounted, ref } from "vue"
import LabPanel from "./LabPanel.vue"

const showList = ref(true)
const todos = ref([
  { id: 1, text: "讀懂 ref vs reactive" },
  { id: 2, text: "練習 composable" },
  { id: 3, text: "用 Pinia 共享狀態" },
])
const mountCount = ref(0)
let nextId = 4

onMounted(() => {
  mountCount.value += 1
})

function addTodo() {
  todos.value.push({ id: nextId++, text: `學習項目 #${nextId - 1}` })
}

function removeTodo(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>
