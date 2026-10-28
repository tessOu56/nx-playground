<template>
  <div class="space-y-6">
    <LabPanel
      title="Props 與 Emits"
      react-hint="父傳 props，子呼叫 props.onSave(data)。"
      vue-hint="子元件用 defineProps 接收、defineEmits 宣告事件；父層用 @event-name 監聽。"
    >
      <ChildGreeting
        :name="guestName"
        :level="level"
        @greet="onGreet"
      />
      <p v-if="lastGreeting" class="mt-3 text-sm text-indigo-700">
        收到子元件事件：{{ lastGreeting }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3 items-center">
        <label class="text-sm text-gray-600">
          訪客名稱
          <input
            v-model="guestName"
            class="ml-2 border rounded-lg px-3 py-1.5"
          />
        </label>
        <label class="text-sm text-gray-600">
          等級
          <input
            v-model.number="level"
            type="number"
            min="1"
            max="10"
            class="ml-2 border rounded-lg px-3 py-1.5 w-20"
          />
        </label>
      </div>
    </LabPanel>

    <LabPanel
      title="v-model 雙向綁定"
      react-hint="value={text} onChange={e => setText(e.target.value)}"
      vue-hint="v-model 是 :modelValue + @update:modelValue 的語法糖；自訂元件也能支援。"
    >
      <SearchBox v-model="query" />
      <p class="mt-3 text-sm text-gray-600">
        父層 query：<code class="bg-gray-100 px-1 rounded">{{ query }}</code>
      </p>
      <p class="mt-1 text-xs text-green-700">
        ✓ 練習題 1：query 已透過 useLocalStorage 持久化，重新整理頁面仍保留
      </p>
    </LabPanel>

    <LabPanel
      title="練習題 3：RatingStars（v-model 1–5 星）"
      react-hint="受控元件：value={rating} onChange={setRating}；點同一星可清零。"
      vue-hint="RatingStars 發出 update:modelValue，父層用 v-model 綁定數字。"
    >
      <RatingStars v-model="rating" />
      <p class="mt-3 text-sm text-gray-600">
        目前評分：<strong>{{ rating || "未選" }}</strong>
        <span v-if="rating"> / 5 星</span>
      </p>
    </LabPanel>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useLocalStorage } from "../../composables/useLocalStorage"
import ChildGreeting from "./ChildGreeting.vue"
import LabPanel from "./LabPanel.vue"
import RatingStars from "./RatingStars.vue"
import SearchBox from "./SearchBox.vue"

const guestName = ref("React 轉 Vue")
const level = ref(3)
const query = useLocalStorage("vue-motion-search-query", "")
const rating = ref(0)
const lastGreeting = ref("")

function onGreet(message) {
  lastGreeting.value = message
}
</script>
