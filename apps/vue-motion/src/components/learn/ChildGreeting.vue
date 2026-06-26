<template>
  <p class="text-gray-700">
    你好，<strong>{{ name }}</strong>（Lv.{{ level }}）
    <button class="btn-primary ml-3 text-sm py-1 px-3" @click="sayHi">
      打招呼
    </button>
  </p>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  level: { type: Number, default: 1 },
})

const emit = defineEmits(["greet"])

function sayHi() {
  emit("greet", `${props.name} 向你打招呼！（等級 ${props.level}）`)
}
</script>
