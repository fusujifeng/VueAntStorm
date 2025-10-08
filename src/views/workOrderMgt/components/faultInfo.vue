<template>
  <div class="fault-info">
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="list" row-key="id" :pagination="false" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { title: '设备编号', dataIndex: 'deviceId', key: 'deviceId', width: 160 },
  { title: '故障类型', dataIndex: 'type', key: 'type', width: 140 },
  { title: '描述', dataIndex: 'desc', key: 'desc' }
]

const list = ref(Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  deviceId: `DEV-${String(i + 1).padStart(4,'0')}`,
  type: ['通讯异常','硬件损坏','软件异常'][i % 3],
  desc: '设备在负荷切换时出现通讯延迟，建议检查接口。'
})))
</script>

<style scoped>
.fault-info { padding-top: 8px; }
</style>