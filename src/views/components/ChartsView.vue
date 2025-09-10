<template>
  <div class="container">
    <div class="item flex-1">占剩余空间</div>
    <button class="btn">固定宽度</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 可以通过这个变量动态调整父容器宽度，观察效果
const containerWidth = ref(500);
</script>

<style scoped>
.container {
  display: flex;
  /* 使用绑定的变量控制宽度，方便调试 */
  width: v-bind(containerWidth + 'px');
  gap: 10px;
  background-color: #b51515;
  padding: 10px; /* 增加内边距，让内容不贴边 */
  box-sizing: border-box; /* 确保padding不会增加容器总宽度 */
}

/* 关键：添加flex:1属性 */
.flex-1 {
  flex: 1; /* 这行是之前缺失的，用于占据剩余空间 */
}

.item {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
}

.btn {
  width: 100px;
  padding: 10px;
  border: none;
  background-color: #1890ff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  /* 禁止按钮收缩，确保宽度固定 */
  flex-shrink: 0;
}
</style>

