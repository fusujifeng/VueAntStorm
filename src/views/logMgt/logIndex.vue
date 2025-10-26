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
<a-card title="上传进度条">

  <a-upload
    v-model:file-list="fileList"
    name="file"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    @change="handleChange"
    percent
  >
    <a-space>
      <a-button>
        <upload-outlined></upload-outlined>
        Click to Upload
      </a-button>
      <a-progress type="dashboard" :percent="uploadProgress" :size="20" />
      <a-progress type="dashboard" :percent="uploadProgress" size="small" />
    </a-space>
  </a-upload>

</a-card>
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
        :row-selection="rowSelection"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewDetail(record)">详情</a-button>
              <a-button type="link" @click="editLog(record)">编辑</a-button>
              <a-button @click="showTransferModal">转办</a-button>
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
import { ref, reactive, onMounted, h } from 'vue'
import { message, Modal, Form, Select, Input } from 'ant-design-vue'
import AdvancedSearch from '@/components/AdvancedSearch.vue'
import { useRouter } from 'vue-router'
import EllipsisText from '@/components/EllipsisText.vue'
import type { FormInstance } from 'ant-design-vue'
import type { UploadChangeParam } from 'ant-design-vue/es/upload/interface'

// 定义筛选配置接口
interface FilterOption {
  type: 'input' | 'number' | 'select' | 'datePicker' | 'rangePicker'
  value: string
  placeholder?: string
  options?: Array<{ key: string; value?: any; label: string }>
  otherConfig?: Record<string, any>
  required?: boolean
  validator?: (value: any) => boolean | string
}

interface LogItem {
  id: string
  station: string
  workOrder: string
  createdAt: string
}

const uploadProgress=ref(0)
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

const fileList = ref([]);

const loading = ref(false)
const searchParams = ref<Record<string, any>>({})

// 自定义筛选项配置
const filterOptions = ref<FilterOption[]>([
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

// 转办相关
let transferFormRef: FormInstance | null = null
const transferForm = reactive({
  assignee: undefined as string | undefined,
  reason: ''
})

// 转办人选项（模拟数据）
const assigneeOptions = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' },
  { label: '赵六', value: 'zhaoliu' }
]

// 显示转办弹窗 (使用 Modal.confirm)
const showTransferModal = () => {
  // 重置表单
  transferForm.assignee = undefined
  transferForm.reason = ''
  
  Modal.confirm({
    title: '转办',
    width: 500,
    icon: null, // 去掉图标
    content: () => {
      // 创建表单引用
      const formRef = ref<FormInstance | null>(null)
      
      // 在下一个tick中保存表单引用
      setTimeout(() => {
        transferFormRef = formRef.value
      }, 0)
      
      return h(Form, {
        ref: formRef,
        model: transferForm,
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }, {
        default: () => [
          h(Form.Item, {
            label: '转办人',
            name: 'assignee',
            rules: [{ required: true, message: '请选择转办人' }]
          }, {
            default: () => h(Select, {
              placeholder: '请选择转办人',
              options: assigneeOptions,
              value: transferForm.assignee || '',
              'onUpdate:value': (value: string) => {
                transferForm.assignee = value || undefined
              }
            } as any)
          }),
          h(Form.Item, {
            label: '转办理由',
            name: 'reason',
            rules: [{ required: true, message: '请输入转办理由' }]
          }, {
            default: () => h(Input.TextArea, {
              placeholder: '请输入转办理由',
              rows: 4,
              value: transferForm.reason,
              'onUpdate:value': (value: string) => {
                transferForm.reason = value
              }
            })
          })
        ]
      })
    },
    onOk: async () => {
      try {
        // 执行表单验证
        if (transferFormRef) {
          await transferFormRef.validateFields()
          
          // 模拟转办接口调用
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          message.success('转办成功')
          return Promise.resolve()
        }
      } catch (error) {
        // 验证失败阻止弹窗关闭
        return Promise.reject()
      }
    },
    onCancel() {
      // 清理表单引用
      transferFormRef = null
    }
  })
}

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

const rowSelection = {
  onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },

};
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