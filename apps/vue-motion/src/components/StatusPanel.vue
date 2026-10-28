<template>
  <section class="status-panel" :role="role" :aria-live="live">
    <p v-if="kicker" class="kicker">{{ kicker }}</p>
    <component :is="heading" class="status-title">{{ title }}</component>
    <p v-if="description" class="status-copy">{{ description }}</p>
    <div v-if="$slots.default" class="status-actions">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  kicker: { type: String, default: "" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  heading: { type: String, default: "h1" },
  role: { type: String, default: "status" },
  live: { type: String, default: "polite" },
})
</script>
