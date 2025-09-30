<template>
  <div class="custom-steps">
    <!-- 建站流程标题 -->
    <div class="process-header">
      <div class="process-title">
        <span class="title-icon">●</span>
        <span class="title-text">建站流程</span>
      </div>
    </div>

    <!-- 步骤条容器 -->
    <div class="steps-wrapper">
      <div class="steps-container">
        <div v-for="(step, index) in steps" :key="index" class="step-item" :class="{
          'active': index === currentStep,
          'completed': index < currentStep,
          'pending': index > currentStep
        }" :style="{ zIndex: steps.length - index }">
          <!-- 使用原始的editSpan.svg形状 -->
          <div class="step-shape">
            <svg width="220" height="40" viewBox="0 0 220.092 40" fill="none" xmlns="http://www.w3.org/2000/svg"
              class="step-svg">
              <!-- 主背景 -->
              <path
                d="M0 0L204.71 0C206 0 207.22 0.62 207.97 1.68L219.35 17.68C220.33 19.06 220.33 20.93 219.35 22.31L207.97 38.31C207.22 39.37 206 40 204.71 40L0 40L0 0Z"
                fill="#ffffff" fill-rule="evenodd" />
              <!-- 内边框效果 -->
              <path
                d="M2 2L204.71 2C205.05 2 205.36 2.07 205.63 2.21C205.91 2.35 206.14 2.56 206.34 2.84L217.72 18.84C217.99 19.22 218.13 19.61 218.13 20C218.13 20.38 217.99 20.77 217.72 21.15L206.34 37.15C206.14 37.43 205.91 37.64 205.63 37.78C205.36 37.92 205.05 38 204.71 38L2 38L2 2Z"
                :fill=getStepBackgroundColor(index) fill-opacity="1" fill-rule="evenodd" />
            </svg>

            <!-- 步骤内容 -->
            <div class="step-content">
              <span class="step-text">{{ step.title }}</span>
              <div class="step-dates" v-if="step.dates">
                {{ step.dates }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实际起始时间显示 -->
    <div class="time-info">
      <div class="time-label">
        <span class="time-icon">●</span>
        <span class="time-text">实际起始时间</span>
      </div>
      <div class="time-dates">
        <div v-for="(step, index) in steps" :key="`time-${index}`" class="time-item" :class="{
          'active': index === currentStep,
          'completed': index < currentStep,
          'pending': index > currentStep
        }">
          <span v-if="step.actualStartTime" class="actual-time">{{ step.actualStartTime }}</span>
          <span v-else class="no-time">-</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Step {
  title: string
  dates?: string
  actualStartTime?: string
  status?: 'pending' | 'active' | 'completed'
}

interface Props {
  steps: Step[]
  current?: number
}

const props = withDefaults(defineProps<Props>(), {
  current: 0
})

const currentStep = ref(props.current)

// 根据步骤状态返回背景颜色
const getStepBackgroundColor = (index: number) => {
  if (index < currentStep.value) {
    return '#52c41a' // 已完成 - 绿色
  } else if (index === currentStep.value) {
    return '#1890ff' // 当前步骤 - 蓝色
  } else {
    return '#d9d9d9' // 未开始 - 灰色
  }
}

// 根据步骤状态返回内部颜色
const getStepInnerColor = (index: number) => {
  if (index < currentStep.value) {
    return 'rgba(255, 255, 255, 0.2)' // 已完成 - 半透明白色
  } else if (index === currentStep.value) {
    return 'rgba(255, 255, 255, 0.15)' // 当前步骤 - 半透明白色
  } else {
    return 'rgba(255, 255, 255, 0.8)' // 未开始 - 更透明的白色
  }
}

// 暴露方法供父组件调用
const setCurrentStep = (step: number) => {
  currentStep.value = step
}

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

defineExpose({
  setCurrentStep,
  nextStep,
  prevStep,
  currentStep
})
</script>

<style scoped>
.custom-steps {
  width: 100%;
  padding: 20px 0;
  background: #f5f5f5;
}

/* 建站流程标题样式 */
.process-header {
  margin-bottom: 15px;
  padding: 0 20px;
}

.process-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.title-icon {
  color: #1890ff;
  margin-right: 8px;
  font-size: 12px;
}

.title-text {
  color: #333;
}

/* 步骤条容器样式 */
.steps-wrapper {
  position: relative;
}

.steps-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow-x: auto;
  padding: 0 20px;
}

.step-item {
  position: relative;
  flex-shrink: 0;
  margin-right: -15px;
  /* 负边距让步骤重叠 */
  transition: all 0.3s ease;
}

.step-item:last-child {
  margin-right: 0;
}

.step-shape {
  position: relative;
  width: 220px;
  height: 40px;
}

.step-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.step-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 20px;
  /* 为箭头部分留出空间 */
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  pointer-events: none;
}

.step-text {
  font-size: 14px;
  font-weight: 500;
  color: white;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 2px;
}

.step-dates {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1;
}

.step-item.pending .step-text {
  color: #666;
}

.step-item.pending .step-dates {
  color: #999;
}

/* 实际起始时间样式 */
.time-info {
  margin-top: 15px;
  padding: 0 20px;
}

.time-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.time-icon {
  color: #1890ff;
  margin-right: 8px;
  font-size: 10px;
}

.time-text {
  color: #666;
}

.time-dates {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.time-item {
  position: relative;
  flex-shrink: 0;
  width: 220px;
  margin-right: -15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.time-item:last-child {
  margin-right: 0;
}

.actual-time {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  text-align: center;
}

.no-time {
  font-size: 12px;
  color: #ccc;
  text-align: center;
}

.time-item.completed .actual-time {
  color: #52c41a;
}

.time-item.active .actual-time {
  color: #1890ff;
}

.time-item.pending .actual-time {
  color: #999;
}

/* 悬停效果 */
.step-item:hover {
  transform: translateX(10px);

}

/* 激活状态特殊效果 */
.step-item.active {
  transform: scale(1.02);
}

.step-item.active:hover {
  transform: scale(1.02) translateX(10px);
}

/* 响应式设计 */
@media (max-width: 768px) {

  .steps-container,
  .time-info {
    padding: 0 10px;
  }

  .step-shape {
    width: 180px;
    height: 35px;
  }

  .time-item {
    width: 180px;
    margin-right: -12px;
  }

  .step-text {
    font-size: 12px;
  }

  .step-dates {
    font-size: 10px;
  }

  .step-item {
    margin-right: -12px;
  }

  .actual-time,
  .no-time {
    font-size: 11px;
  }
}

/* 动画效果 */
.step-item {
  animation: slideIn 0.6s ease-out;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>