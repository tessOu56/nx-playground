<template>
  <section class="card space-y-4">
    <div>
      <h3 class="text-xl font-bold text-gray-800">{{ title }}</h3>
      <p v-if="subtitle" class="text-gray-600 mt-1">{{ subtitle }}</p>
    </div>

    <div
      v-if="reactHint"
      class="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm"
    >
      <p class="font-semibold text-slate-700 mb-1">React 對照</p>
      <p class="text-slate-600 leading-relaxed">{{ reactHint }}</p>
    </div>

    <div
      v-if="vueHint"
      class="rounded-lg bg-indigo-50 border border-indigo-100 p-4 text-sm"
    >
      <p class="font-semibold text-indigo-800 mb-1">Vue 重點</p>
      <p class="text-indigo-700 leading-relaxed">{{ vueHint }}</p>
    </div>

    <div class="rounded-xl border border-gray-100 bg-gray-50/80 p-5">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  reactHint: { type: String, default: "" },
  vueHint: { type: String, default: "" },
})
</script>
