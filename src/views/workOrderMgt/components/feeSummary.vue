<template>
  <div class="fee-summary">
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="list" row-key="id" :pagination="false" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { title: '费用项', dataIndex: 'item', key: 'item', width: 160 },
  { title: '金额(元)', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '说明', dataIndex: 'desc', key: 'desc' }
]

const list = ref([
  { id: 1, item: '人工费', amount: 1200, desc: '现场调试与验收' },
  { id: 2, item: '材料费', amount: 800, desc: '备件与耗材' },
  { id: 3, item: '差旅费', amount: 600, desc: '交通与住宿' }
])
</script>

<style scoped>
.fee-summary { padding-top: 8px; }
</style>