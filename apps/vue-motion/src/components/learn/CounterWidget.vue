<template>
  <div
    class="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-white border border-gray-100"
  >
    <span class="text-sm font-medium text-gray-500 w-16">{{ label }}</span>
    <span class="text-2xl font-bold text-indigo-600 w-12 text-center">
      {{ count }}
    </span>
    <span class="text-sm text-gray-500">×2 = {{ doubled }}</span>
    <div class="flex gap-2">
      <button class="btn-primary text-sm py-1 px-3" @click="decrement()">−</button>
      <button class="btn-primary text-sm py-1 px-3" @click="increment()">+</button>
      <button class="btn-secondary text-sm py-1 px-3" @click="reset()">重置</button>
    </div>
    <span
      class="text-xs px-2 py-0.5 rounded-full"
      :class="isEven ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
    >
      {{ isEven ? "偶數" : "奇數" }}
    </span>
  </div>
</template>

<script setup>
import { useCounter } from "../../composables/useCounter"

defineProps({
  label: { type: String, default: "Counter" },
})

const { count, doubled, isEven, increment, decrement, reset } = useCounter(0)
</script>
