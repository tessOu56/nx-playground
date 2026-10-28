<template>
  <div class="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-center">
    <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
    <p class="text-2xl font-bold text-indigo-700">{{ store.count }}</p>
  </div>
</template>

<script setup>
import { useCounterStore } from "../../stores/counter"

defineProps({
  title: { type: String, default: "Reader" },
})

const store = useCounterStore()
</script>
