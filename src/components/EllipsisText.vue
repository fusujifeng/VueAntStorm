<template>
  <a-tooltip :title="showTooltip ? text : ''" placement="top">
    <span 
      ref="textRef"
      :style="{ 
        width: width + 'px', 
        display: 'inline-block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...customStyle 
      }"
      @mouseenter="checkOverflow"
    >
      {{ text }}
    </span>
  </a-tooltip>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Tooltip } from 'ant-design-vue'

interface Props {
  text: string
  width: number
  customStyle?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  customStyle: () => ({})
})

const textRef = ref<HTMLElement>()
const showTooltip = ref(false)

const checkOverflow = async () => {
  await nextTick()
  if (textRef.value) {
    const element = textRef.value
    showTooltip.value = element.scrollWidth > element.clientWidth
  }
}

onMounted(() => {
  checkOverflow()
})
</script>

<style scoped>
span {
  cursor: default;
}
</style>