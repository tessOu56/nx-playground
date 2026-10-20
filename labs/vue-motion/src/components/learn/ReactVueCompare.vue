<template>
  <LabPanel
    title="React vs Vue 心智模型"
    subtitle="先建立對照，再進階到動畫實驗"
    react-hint="React 以函式元件 + hooks 為中心；狀態用 useState / useReducer，副作用用 useEffect，跨元件狀態常用 Context 或 Zustand。"
    vue-hint="Vue 3 以 Composition API（ref、computed、watch）為中心；模板用 v-* 指令；跨元件狀態可用 provide/inject 或 Pinia。"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead>
          <tr class="border-b border-gray-200 text-gray-500">
            <th class="py-2 pr-4 font-medium">概念</th>
            <th class="py-2 pr-4 font-medium">React</th>
            <th class="py-2 font-medium">Vue 3</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr
            v-for="row in rows"
            :key="row.concept"
            class="border-b border-gray-100"
          >
            <td class="py-3 pr-4 font-medium">{{ row.concept }}</td>
            <td class="py-3 pr-4 font-mono text-xs text-slate-600">
              {{ row.react }}
            </td>
            <td class="py-3 font-mono text-xs text-indigo-700">{{ row.vue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </LabPanel>
</template>

<script setup>
import LabPanel from "./LabPanel.vue"

const rows = [
  {
    concept: "區域狀態",
    react: "useState(initial)",
    vue: "ref(initial) / reactive({})",
  },
  {
    concept: "衍生狀態",
    react: "useMemo(() => ..., [deps])",
    vue: "computed(() => ...)",
  },
  {
    concept: "副作用",
    react: "useEffect(() => ..., [deps])",
    vue: "watch / watchEffect / onMounted",
  },
  {
    concept: "子元件回呼",
    react: "props.onChange(value)",
    vue: "defineEmits + emit('update:modelValue')",
  },
  {
    concept: "雙向綁定",
    react: "value + onChange（受控元件）",
    vue: "v-model",
  },
  {
    concept: "全域狀態",
    react: "Context / Zustand / Redux",
    vue: "Pinia",
  },
  {
    concept: "可重用邏輯",
    react: "custom hook (useXxx)",
    vue: "composable (useXxx.js)",
  },
]
</script>
