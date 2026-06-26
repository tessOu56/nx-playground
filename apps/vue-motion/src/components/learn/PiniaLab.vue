<template>
  <LabPanel
    title="Pinia 全域狀態"
    react-hint="類似 Zustand create((set) => ({ count, increment: () => set(...) })) 或 Redux slice。"
    vue-hint="defineStore + setup store（Composition 風格）讓任何元件都能讀寫同一份狀態。"
  >
    <div class="flex flex-wrap items-center gap-4">
      <span class="text-3xl font-bold text-indigo-600">{{ store.count }}</span>
      <span class="text-sm text-gray-600">{{ store.label }}</span>
      <span class="text-xs text-gray-500">
        最後操作：{{ store.lastActionLabel }}
      </span>
      <button class="btn-primary" @click="store.increment()">+1</button>
      <button class="btn-primary" @click="store.decrement()">−1</button>
      <button class="btn-secondary" @click="store.reset()">重置</button>
    </div>

    <div class="mt-6 grid md:grid-cols-2 gap-4">
      <StoreReader title="元件 A（只讀）" />
      <StoreReader title="元件 B（只讀）" />
    </div>

    <div class="mt-4">
      <p class="text-sm font-medium text-gray-600 mb-2">操作歷史</p>
      <ul class="text-xs font-mono text-slate-600 space-y-1 max-h-32 overflow-y-auto">
        <li v-for="(line, i) in store.history" :key="i">{{ line }}</li>
        <li v-if="!store.history.length" class="text-gray-400">尚無紀錄</li>
      </ul>
      <p class="mt-2 text-xs text-green-700">
        ✓ 練習題 2：store 已記錄 lastActionAt（見上方「最後操作」）
      </p>
    </div>
  </LabPanel>
</template>

<script setup>
import { useCounterStore } from "../../stores/counter"
import LabPanel from "./LabPanel.vue"
import StoreReader from "./StoreReader.vue"

const store = useCounterStore()
</script>
