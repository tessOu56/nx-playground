<template>
  <div class="space-y-6">
    <LabPanel
      title="ref 與 reactive"
      react-hint="useState 回傳 [value, setValue]；更新時觸發 re-render。"
      vue-hint="ref 用 .value 讀寫（script 內）；模板會自動 unwrap。reactive 適合物件，不能直接替換整個物件引用。"
    >
      <div class="flex flex-wrap gap-3 items-center">
        <span class="text-2xl font-bold text-indigo-600">{{ count }}</span>
        <button class="btn-primary" @click="count++">+1 ref</button>
        <button class="btn-secondary" @click="user.score += 5">
          +5 reactive score
        </button>
      </div>
      <p class="mt-3 text-sm text-gray-600">
        reactive 物件：{{ user.name }} — 分數 {{ user.score }}
      </p>
    </LabPanel>

    <LabPanel
      title="computed 衍生狀態"
      react-hint="useMemo(() => count * 2, [count])"
      vue-hint="computed 會追蹤依賴並快取結果，依賴變了才重算。"
    >
      <p class="text-lg">
        count = <strong>{{ count }}</strong> → doubled =
        <strong class="text-pink-600">{{ doubled }}</strong>
        （{{ parity }}）
      </p>
    </LabPanel>

    <LabPanel
      title="watch 副作用"
      react-hint="useEffect(() => { log(count) }, [count])"
      vue-hint="watch 可明確指定要監聽的 ref/reactive 欄位，適合打 API 或寫入 history。"
    >
      <p class="text-sm text-gray-600 mb-2">最近 5 次變化：</p>
      <ul class="space-y-1 text-sm font-mono text-slate-700">
        <li v-for="(entry, i) in changeLog" :key="i">{{ entry }}</li>
        <li v-if="!changeLog.length" class="text-gray-400">調整上方 count 試試</li>
      </ul>
    </LabPanel>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue"
import LabPanel from "./LabPanel.vue"

const count = ref(0)
const user = reactive({ name: "Vue 學員", score: 0 })
const changeLog = ref([])

const doubled = computed(() => count.value * 2)
const parity = computed(() => (count.value % 2 === 0 ? "偶數" : "奇數"))

watch(count, (newVal, oldVal) => {
  changeLog.value = [`${oldVal} → ${newVal}`, ...changeLog.value].slice(0, 5)
})
</script>
