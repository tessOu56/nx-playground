<template>
  <div class="flex flex-wrap gap-2 items-center">
    <input
      :value="modelValue"
      type="search"
      placeholder="搜尋動畫效果..."
      class="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:ring-2 focus:ring-indigo-300 outline-none"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <span v-if="modelValue" class="text-xs text-gray-500">
      {{ modelValue.length }} 字
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
})

const emit = defineEmits(["update:modelValue"])
</script>
