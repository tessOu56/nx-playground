<template>
  <div
    class="inline-flex gap-0.5"
    role="group"
    :aria-label="`評分 ${displayValue} / ${max}`"
    @mouseleave="hover = 0"
  >
    <button
      v-for="star in max"
      :key="star"
      type="button"
      class="text-2xl leading-none transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
      :class="star <= displayValue ? 'text-amber-400' : 'text-gray-300'"
      :aria-label="`${star} 星`"
      @click="select(star)"
      @mouseenter="hover = star"
    >
      ★
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
})

const emit = defineEmits(["update:modelValue"])

const hover = ref(0)

const displayValue = computed(() => hover.value || props.modelValue)

function select(star) {
  emit("update:modelValue", star === props.modelValue ? 0 : star)
}
</script>
