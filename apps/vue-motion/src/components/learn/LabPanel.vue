<template>
  <section class="card space-y-4">
    <div>
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <p v-if="subtitle" class="mt-1" style="color: var(--muted)">{{ subtitle }}</p>
    </div>

    <div v-if="reactHint" class="hint-box">
      <p class="font-semibold mb-1">React 對照</p>
      <p class="leading-relaxed" style="color: var(--muted)">{{ reactHint }}</p>
    </div>

    <div v-if="vueHint" class="hint-box hint-vue">
      <p class="font-semibold mb-1">Vue 重點</p>
      <p class="leading-relaxed" style="color: var(--muted)">{{ vueHint }}</p>
    </div>

    <div class="hint-slot">
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

<style scoped>
.hint-box,
.hint-slot {
  border: 1px solid var(--line);
  border-radius: 0.65rem;
  padding: 1rem;
  background: var(--bg);
  font-size: 0.875rem;
}

.hint-vue {
  background: #e7f3ec;
  border-color: #c5ddce;
}

.hint-slot {
  background: var(--bg-elevated);
}
</style>
