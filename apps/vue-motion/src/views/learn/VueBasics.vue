<template>
  <div class="space-y-8">
    <header class="page-intro">
      <p class="kicker">Labelled lab</p>
      <h1>Vue 3 基礎實驗室</h1>
      <p>
        從 React 開發者視角出發，用互動範例掌握 Composition API、元件通訊、
        Composables 與 Pinia。完成後再進入動畫特效區會更順。
      </p>
    </header>

    <nav class="flex flex-wrap gap-2" role="tablist" aria-label="Vue basics labs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :data-lab-tab="tab.id"
        :aria-selected="activeTab === tab.id"
        class="tab"
        :class="{ 'tab-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <component :is="activeComponent" />

    <div class="card">
      <h2 class="text-lg font-bold mb-2">建議學習順序</h2>
      <ol class="list-decimal list-inside space-y-1 text-sm" style="color: var(--muted)">
        <li>對照表 → 建立 React / Vue 概念映射</li>
        <li>響應式 → ref、reactive、computed、watch</li>
        <li>元件通訊 → props、emits、v-model</li>
        <li>Composables → 抽出可重用邏輯</li>
        <li>Pinia → 跨頁全域狀態</li>
        <li>生命週期 → onMounted、v-if、v-for</li>
        <li>回到首頁，進入 GSAP / Three.js 動畫實驗</li>
      </ol>
      <p class="mt-3 text-xs" style="color: var(--muted)">
        Completeness lab only — not an event site. Effects page:
        <code>/particles</code>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import ComponentCommLab from "../../components/learn/ComponentCommLab.vue"
import ComposableLab from "../../components/learn/ComposableLab.vue"
import LifecycleLab from "../../components/learn/LifecycleLab.vue"
import PiniaLab from "../../components/learn/PiniaLab.vue"
import ReactVueCompare from "../../components/learn/ReactVueCompare.vue"
import ReactivityLab from "../../components/learn/ReactivityLab.vue"

const tabs = [
  { id: "compare", label: "React 對照", component: ReactVueCompare },
  { id: "reactivity", label: "響應式", component: ReactivityLab },
  { id: "components", label: "元件通訊", component: ComponentCommLab },
  { id: "composables", label: "Composables", component: ComposableLab },
  { id: "pinia", label: "Pinia", component: PiniaLab },
  { id: "lifecycle", label: "生命週期", component: LifecycleLab },
]

const activeTab = ref("compare")

const activeComponent = computed(
  () => tabs.find(t => t.id === activeTab.value)?.component ?? ReactVueCompare
)
</script>
