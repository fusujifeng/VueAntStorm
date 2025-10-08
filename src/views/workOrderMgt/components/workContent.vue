<template>
  <div class="work-content">
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="list" :pagination="false" row-key="id" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { title: '时间', dataIndex: 'date', key: 'date', width: 160 },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 120 },
]

const list = ref(Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  date: `2025/12/${24 - i}`,
  content: '现场安装调试、整体验收、硬件/软件联合测试、交互规范验证…',
  owner: ['张三','李四','王五'][i % 3]
})))
</script>

<style scoped>
.work-content { padding-top: 8px; }
</style>