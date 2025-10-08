<template>
  <div class="cost-summary">
    <a-card :bordered="false">
      <a-flex justify="space-between" align="center" class="section">
        <div class="section-title">费用汇总</div>
        <div class="total">合计：{{ totalAmount }} 元</div>
      </a-flex>

      <AdvancedSearch
        :options="filterOptions"
        @search="handleSearch"
        @reset="handleReset"
        @change="handleFilterChange"
      />

      <a-table :columns="columns" :data-source="dataSource" row-key="id" :pagination="false" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch.vue'

interface CostItem {
  id: number
  item: string
  amount: number
  desc: string
}

const columns = [
  { title: '费用项', dataIndex: 'item', key: 'item', width: 160 },
  { title: '金额(元)', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '说明', dataIndex: 'desc', key: 'desc' }
]

const allData = ref<CostItem[]>([
  { id: 1, item: '人工费', amount: 1200, desc: '现场调试与验收' },
  { id: 2, item: '材料费', amount: 800, desc: '备件与耗材' },
  { id: 3, item: '差旅费', amount: 600, desc: '交通与住宿' }
])
const dataSource = ref<CostItem[]>([...allData.value])

const filterOptions = ref([
  { type: 'input' as const, value: 'keyword', placeholder: '关键词（费用项/说明）' },
  { type: 'select' as const, value: 'type', placeholder: '费用类型', options: [
    { key: '人工费', label: '人工费' },
    { key: '材料费', label: '材料费' },
    { key: '差旅费', label: '差旅费' }
  ] },
])

const totalAmount = computed(() => dataSource.value.reduce((sum, cur) => sum + cur.amount, 0))

const handleSearch = (params: Record<string, any>) => {
  const { keyword = '', type = '' } = params || {}
  let result = [...allData.value]
  const kw = String(keyword).toLowerCase()
  if (kw) {
    result = result.filter(
      item => item.item.toLowerCase().includes(kw) || item.desc.toLowerCase().includes(kw)
    )
  }
  if (type) {
    result = result.filter(item => item.item === type)
  }
  dataSource.value = result
}
const handleReset = () => {
  dataSource.value = [...allData.value]
}
const handleFilterChange = (key: string, value: any) => {
  // 可选：实时响应筛选变更
}
</script>

<style scoped>
.section { gap: 12px; }
.section-title { font-weight: 600; }
.total { color: #333; }
.cost-summary { padding-top: 8px; }
</style>