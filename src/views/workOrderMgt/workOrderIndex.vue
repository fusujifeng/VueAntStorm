<template>
  <div class="workorder-index-page">
    <!-- 顶部筛选区：AdvancedSearch -->
    <a-flex align="center" justify="space-between" style="margin-bottom: 12px;">
      <AdvancedSearch
        v-model="searchParams"
        :filter-options="filterOptions"
        :loading="loading"
        @search="handleSearch"
        @reset="handleReset"
        @change="handleFilterChange"
      />
      <a-space>
        <span>模式：</span>
        <a-switch
          v-model:checked="isAdmin"
          :checked-children="'管理员'"
          :un-checked-children="'员工'"
        />
        <a-button v-if="isAdmin" type="primary" @click="createWorkOrder">新建工单</a-button>
      </a-space>
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
          <template v-if="column.key === 'source'">
            <a-flex gap="8" align="center">
              <a-badge status="processing" />
              <span>{{ text }}</span>
            </a-flex>
          </template>
          <template v-else-if="column.key === 'orderStatus'">
            <a-tag :color="orderStatusColor(text)">{{ text }}</a-tag>
          </template>
          <template v-else-if="column.key === 'station'">
            <EllipsisText :text="text" :width="220" />
          </template>
          <template v-else-if="column.key === 'project'">
            <EllipsisText :text="text" :width="180" />
          </template>
          <template v-else-if="column.key === 'eventStatus'">
            <a-tag :color="eventStatusColor(text)">{{ text }}</a-tag>
          </template>
          <template v-else-if="column.key === 'id'">
            <a-button type="link" @click="viewDetail(record)">{{ text }}</a-button>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewDetail(record)">详情</a-button>
              <a-button v-if="!isAdmin" type="link" @click="openAccept(record)">接受</a-button>
            </a-space>
          </template>
      </template>
    </a-table>
    </a-card>

    <!-- 接受工单弹窗 -->
    <a-modal
      title="接受工单"
      v-model:open="acceptModal.visible.value"
      :mask-closable="false"
      @ok="acceptModal.handleOk"
      @cancel="acceptModal.handleCancel"
      destroy-on-close
    >
      <a-form :model="acceptForm" layout="vertical">
        <a-form-item label="接受备注">
          <a-textarea v-model:value="acceptForm.remark" :rows="4" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  <!-- 新建工单弹窗 -->
  <a-modal
    title="新建工单"
    v-model:open="createModal.visible.value"
    :mask-closable="false"
    width="500"
    destroy-on-close
    @cancel="createModal.handleCancel"
  >
    <AddWorkOrder ref="addRef" @submit="handleCreateSubmit" />
    <template #footer>
      <a-flex justify="flex-end" gap="8">
        <a-button @click="addRef?.prev()" :disabled="(addRef?.current?.value ?? 0)===0">上一步</a-button>
        <a-button @click="addRef?.next()">下一步</a-button>
        <a-button v-if="addRef?.isLast?.value" type="primary" @click="handleCreateSubmit">确定创建</a-button>
      </a-flex>
    </template>
  </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import AdvancedSearch from '@/components/AdvancedSearch.vue'
import EllipsisText from '@/components/EllipsisText.vue'
import { useModal } from '@/composables/useModal'
import AddWorkOrder from './components/addWorkOrder.vue'
// 子组件引用
const addRef = ref<InstanceType<typeof AddWorkOrder> | null>(null)

interface WorkOrderItem {
  id: string
  source: string
  orderStatus: string
  station: string
  project: string
  eventStatus: string
}

const router = useRouter()
const loading = ref(false)
const searchParams = ref<Record<string, any>>({})
// 页面模式：管理员 / 员工
const isAdmin = ref(false)

// 筛选项配置（按图示，多个选择器与输入框）
const filterOptions = ref([
  { type: 'input' as const, value: 'keyword', placeholder: '工单编号/单位/所属电站/项目节点' },
  { type: 'select' as const, value: 'source', placeholder: '需求来源', options: [
    { key: '自主管理', label: '自主管理' },
    { key: '自主创建', label: '自主创建' },
    { key: '线上提交', label: '线上提交' }
  ] },
  { type: 'select' as const, value: 'orderStatus', placeholder: '工单状态', options: [
    { key: '启动中', label: '启动中' },
    { key: '处理中', label: '处理中' },
    { key: '已交付', label: '已交付' }
  ] },
  { type: 'select' as const, value: 'station', placeholder: '所属电站', options: [
    { key: '山东泰达清源东南电站', label: '山东泰达清源东南电站' },
    { key: '山东泰达海上风电二期', label: '山东泰达海上风电二期' },
    { key: '山东泰达临沂示范电站', label: '山东泰达临沂示范电站' }
  ] },
  { type: 'select' as const, value: 'project', placeholder: '项目节点', options: [
    { key: '电气系统整体验收', label: '电气系统整体验收' },
    { key: '整站运维排查一阶段任务', label: '整站运维排查一阶段任务' },
    { key: 'PC端功能测试', label: 'PC端功能测试' }
  ] },
  { type: 'select' as const, value: 'eventStatus', placeholder: '事件状态', options: [
    { key: '驳回', label: '驳回' },
    { key: '待处理', label: '待处理' },
    { key: '通过', label: '通过' }
  ] },
])

// 表格数据
const dataSource = ref<WorkOrderItem[]>([])
const allData = ref<WorkOrderItem[]>([])

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
  { title: '工单编号', dataIndex: 'id', key: 'id', width: 160 },
  { title: '需求来源', dataIndex: 'source', key: 'source', width: 140 },
  { title: '工单状态', dataIndex: 'orderStatus', key: 'orderStatus', width: 140 },
  { title: '所属电站', dataIndex: 'station', key: 'station', width: 240 },
  { title: '项目节点', dataIndex: 'project', key: 'project', width: 180 },
  { title: '事件状态', dataIndex: 'eventStatus', key: 'eventStatus', width: 120 },
  { title: '操作', key: 'actions', fixed: 'right', width: 160 }
]

// 构建模拟数据
const buildMockData = (): WorkOrderItem[] => {
  const stations = [
    '山东泰达清源东南电站',
    '山东泰达海上风电二期项目电站',
    '山东泰达临沂示范东南电站'
  ]
  const sources = ['自主创建', '线上提交', '线下来文']
  const projects = ['电气系统整体验收', '整站运维排查一阶段任务', 'PC端功能测试']
  const orderStatuses = ['启动中', '处理中', '已交付']
  const eventStatuses = ['驳回', '待处理', '通过']

  const list: WorkOrderItem[] = Array.from({ length: 34 }).map((_, i) => ({
    id: `WO${String(i + 1).padStart(8, '0')}`,
    source: sources[i % sources.length],
    orderStatus: orderStatuses[i % orderStatuses.length],
    station: stations[i % stations.length],
    project: projects[i % projects.length],
    eventStatus: eventStatuses[i % eventStatuses.length]
  }))
  return list
}

// 查询数据（模拟）
const fetchList = async () => {
  loading.value = true
  try {
    const { keyword, source, orderStatus, station, project, eventStatus } = searchParams.value || {}
    let result = [...allData.value]

    if (keyword) {
      const kw = String(keyword).toLowerCase()
      result = result.filter(
        item =>
          item.id.toLowerCase().includes(kw) ||
          item.station.toLowerCase().includes(kw) ||
          item.project.toLowerCase().includes(kw)
      )
    }
    if (source) {
      result = result.filter(item => item.source === source || item.source.toLowerCase().includes(String(source).toLowerCase()))
    }
    if (orderStatus) {
      result = result.filter(item => item.orderStatus === orderStatus || item.orderStatus.toLowerCase().includes(String(orderStatus).toLowerCase()))
    }
    if (station) {
      result = result.filter(item => item.station === station || item.station.toLowerCase().includes(String(station).toLowerCase()))
    }
    if (project) {
      result = result.filter(item => item.project === project || item.project.toLowerCase().includes(String(project).toLowerCase()))
    }
    if (eventStatus) {
      result = result.filter(item => item.eventStatus === eventStatus || item.eventStatus.toLowerCase().includes(String(eventStatus).toLowerCase()))
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
  fetchList()
}
const handleReset = () => {
  searchParams.value = {}
  pagination.current = 1
  fetchList()
}
const handleFilterChange = (key: string, value: any) => {
  // 可选：实时响应筛选变更
}
const onTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchList()
}

// 操作区
const viewDetail = (record: WorkOrderItem) => {
  router.push({ path: `/workorder-detail/${record.id}` })
}
// 新建工单弹窗
const createModal = useModal()
const createWorkOrder = () => {
  createModal.open()
}
const handleCreateSubmit = () => {
  message.success('确定创建（静态）')
  createModal.close()
}

// 接受工单弹窗
const acceptForm = reactive({ remark: '' })
const acceptModal = useModal({
  onOk: async () => {
    message.success('已接受工单')
    acceptForm.remark = ''
  }
})
const openAccept = (record: WorkOrderItem) => {
  message.info(`接受工单：${record.id}`)
  acceptModal.open()
}

// 标签颜色映射
const orderStatusColor = (status: string) => {
  switch (status) {
    case '启动中': return 'blue'
    case '处理中': return 'gold'
    case '已交付': return 'green'
    default: return 'default'
  }
}
const eventStatusColor = (status: string) => {
  switch (status) {
    case '驳回': return 'red'
    case '待处理': return 'orange'
    case '通过': return 'green'
    default: return 'default'
  }
}

onMounted(() => {
  allData.value = buildMockData()
  fetchList()
})
</script>

<style scoped>
.workorder-index-page {
  padding: 12px 0;
  min-width: 1400px;
  overflow-x: auto;
}
/* 表头单行显示 */
.workorder-index-page :deep(.ant-table-thead th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
