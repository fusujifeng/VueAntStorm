<template>
  <div class="log-index-page">
    <!-- 顶部：左侧筛选 + 右侧新建按钮 -->
    <a-flex align="center" justify="space-between" style="margin-bottom: 12px;">
      <AdvancedSearch
        v-model="searchParams"
        :filter-options="filterOptions"
        :loading="loading"
        @search="handleSearch"
        @reset="handleReset"
      />
      <a-button type="primary" @click="goAddLog">新建日志</a-button>
    </a-flex>

    <!-- 表格区域 -->
    <a-card :bordered="false">
      <a-table
        row-key="id"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 'max-content' }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewDetail(record)">详情</a-button>
              <a-button type="link" @click="editLog(record)">编辑</a-button>
            </a-space>
          </template>
          <template v-else-if="column.key === 'id'">
            <EllipsisText :text="text" :width="140" />
          </template>
          <template v-else-if="column.key === 'station'">
            <EllipsisText :text="text" :width="180" />
          </template>
          <template v-else-if="column.key === 'workOrder'">
            <EllipsisText :text="text" :width="140" />
          </template>
        </template>
      </a-table>
    </a-card>

    
  </div>
  
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import AdvancedSearch from '@/components/AdvancedSearch.vue'
import { useRouter } from 'vue-router'
import EllipsisText from '@/components/EllipsisText.vue'

interface LogItem {
  id: string
  station: string
  workOrder: string
  createdAt: string
}

const loading = ref(false)
const searchParams = ref<Record<string, any>>({})

// 自定义筛选项配置
const filterOptions = ref([
  { type: 'input', value: 'keyword', placeholder: '请输入日志编号/关联工单' },
  { type: 'input', value: 'station', placeholder: '请输入关联电站' }
])

// 表格数据
const dataSource = ref<LogItem[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 列配置
const columns = [
  { title: '日志编号', dataIndex: 'id', key: 'id', width: 160 },
  { title: '关联电站', dataIndex: 'station', key: 'station', width: 200 },
  { title: '关联工单', dataIndex: 'workOrder', key: 'workOrder', width: 160 },
  { title: '操作', key: 'actions', fixed: 'right', width: 160 }
]

// 新建日志页面跳转
const router = useRouter()
const goAddLog = () => router.push('/log-add')

// 模拟后端数据
const buildMockData = (): LogItem[] => {
  const stations = ['山东泰达电站', '青岛海上风电场', '临沂新能示范电站']
  
  const list: LogItem[] = Array.from({ length: 57 }).map((_, i) => {
    const date = new Date(Date.now() - i * 86400000)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return {
      id: `LOG${String(i + 1).padStart(6, '0')}`,
      station: stations[i % stations.length],
      workOrder: `WO${String(i + 10).padStart(5, '0')}`,
      createdAt: `${yyyy}-${mm}-${dd}`
    }
  })
  return list
}

const allData = ref<LogItem[]>(buildMockData())

// 查询数据（模拟）
const fetchLogs = async () => {
  loading.value = true
  try {
    const { keyword, station } = searchParams.value || {}
    let result = [...allData.value]

    if (keyword) {
      const kw = String(keyword).toLowerCase()
      result = result.filter(
        item =>
          item.id.toLowerCase().includes(kw) ||
          item.workOrder.toLowerCase().includes(kw)
      )
    }

    if (station) {
      const st = String(station).toLowerCase()
      result = result.filter(item => item.station.toLowerCase().includes(st))
    }

    // 分页
    pagination.total = result.length
    const startIndex = (pagination.current - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    dataSource.value = result.slice(startIndex, endIndex)
  } finally {
    loading.value = false
  }
}

// 事件处理
const handleSearch = (params: Record<string, any>) => {
  searchParams.value = params
  pagination.current = 1
  fetchLogs()
}

const handleReset = () => {
  searchParams.value = {}
  pagination.current = 1
  fetchLogs()
}

const handleFilterChange = (key: string, value: any) => {
  // 可根据需要实时响应筛选变更
}

const onTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchLogs()
}

const viewDetail = (record: LogItem) => {
  router.push({ path: '/log-detail', query: { id: record.id } })
}

const editLog = (record: LogItem) => {
  router.push({ path: '/log-edit', query: { id: record.id } })
}

// 新建日志跳转在上方定义

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.log-index-page {
  padding: 12px 0;
  min-width: 1400px;
  overflow-x: auto;
}
/* 表头单行显示 */
.log-index-page :deep(.ant-table-thead th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>