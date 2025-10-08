<template>
  <div class="add-log-page">
    <!-- 关联工单 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">关联工单</span>
      </a-flex>
      <a-form layout="horizontal">
        <a-form-item label="相关工单" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input v-model:value="form.workOrder" placeholder="请选择需要关联的工单" allow-clear />
        </a-form-item>
      </a-form>
    </section>

    <!-- 今日完成任务项 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">今日完成任务项</span>
        <a-button type="link" @click="openAddTask">新增任务项</a-button>
      </a-flex>
      <a-flex class="task-grid" wrap gap="12">
        <div class="task-item" v-for="(t, idx) in tasks" :key="t.id">
          <a-input v-model:value="t.name" placeholder="请输入任务" style="flex:1" />
          <a-select v-model:value="t.status" style="width: 120px" :options="statusOptions" />
          <a-select v-model:value="t.progress" style="width: 120px" :options="progressOptions" />
          <a-date-picker v-model:value="t.date" style="width: 160px" />
          <a-button type="link" danger @click="removeTask(idx)">删除</a-button>
        </div>
      </a-flex>
    </section>

    <!-- 设备故障记录 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">设备故障记录</span>
        <a-button type="link" @click="openAddDeviceIssue">新增故障记录</a-button>
      </a-flex>
      <a-table :data-source="deviceIssues" :columns="deviceIssueColumns" row-key="id" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag color="orange">未通过</a-tag>
          </template>
        </template>
      </a-table>
    </section>

    <!-- 当日费用记录 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">当日费用记录</span>
        <a-button type="link" @click="openAddExpense">新增费用记录</a-button>
      </a-flex>
      <a-table :data-source="expenses" :columns="expenseColumns" row-key="id" :pagination="false" />
    </section>

    <!-- 异常备注 -->
    <section class="section">
      <span class="section-title">异常备注</span>
      <a-textarea v-model:value="form.remark" placeholder="请输⼊内容" :rows="4" />
    </section>

    <!-- 任务项弹窗 -->
    <a-modal title="新增任务项" v-model:open="taskModal.visible" @ok="addTask" @cancel="taskModal.handleCancel" destroy-on-close>
      <a-form :model="taskForm">
        <a-form-item label="任务名称"><a-input v-model:value="taskForm.name" /></a-form-item>
        <a-form-item label="状态"><a-select v-model:value="taskForm.status" :options="statusOptions" /></a-form-item>
        <a-form-item label="进度"><a-select v-model:value="taskForm.progress" :options="progressOptions" /></a-form-item>
        <a-form-item label="日期"><a-date-picker v-model:value="taskForm.date" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 故障记录弹窗（占位，静态） -->
    <a-modal title="新增故障记录" v-model:open="deviceIssueModal.visible" @ok="addDeviceIssue" @cancel="deviceIssueModal.handleCancel" destroy-on-close>
      <a-form :model="deviceIssueForm">
        <a-form-item label="设备SN码"><a-input v-model:value="deviceIssueForm.sn" /></a-form-item>
        <a-form-item label="设备型号"><a-input v-model:value="deviceIssueForm.model" /></a-form-item>
        <a-form-item label="设备部件号"><a-input v-model:value="deviceIssueForm.partNo" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 费用记录弹窗（占位，静态） -->
    <a-modal title="新增费用记录" v-model:open="expenseModal.visible" @ok="addExpense" @cancel="expenseModal.handleCancel" destroy-on-close>
      <a-form :model="expenseForm">
        <a-form-item label="费用产生人"><a-input v-model:value="expenseForm.owner" /></a-form-item>
        <a-form-item label="费用类型"><a-input v-model:value="expenseForm.type" /></a-form-item>
        <a-form-item label="费用详细"><a-input v-model:value="expenseForm.detail" /></a-form-item>
        <a-form-item label="费用金额"><a-input-number v-model:value="expenseForm.amount" :min="0" :formatter="v => `${v} ￥`" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from '@/composables/useModal'
import EllipsisText from '@/components/EllipsisText.vue'

interface TaskItem {
  id: string
  name: string
  status: string
  progress: string
  date?: string | any
}

interface DeviceIssueItem {
  id: string
  sn: string
  model: string
  partNo: string
  deviceName: string
  currentStatus: string
  reason: string
  happenTime: string
  stage: string
  needReport: string
  itrFlow: string
  itrNo: string
  rdInvolved: string
}

interface ExpenseItem {
  id: string
  owner: string
  type: string
  detail: string
  amount: number
  remark?: string
}

const form = reactive({
  workOrder: '',
  remark: ''
})

// 根据路由区分新建或编辑
const route = useRoute()
const isEdit = computed(() => String(route.path).includes('log-edit'))

// 今日任务项
const statusOptions = [
  { label: '未完成', value: '未完成' },
  { label: '已完成', value: '已完成' }
]
const progressOptions = [
  { label: '60%', value: '60%' },
  { label: '80%', value: '80%' },
  { label: '100%', value: '100%' }
]

const sampleTasks: TaskItem[] = [
  { id: 't1', name: '全站信道巡检调试记录（表链）', status: '未完成', progress: '60%', date: undefined },
  { id: 't2', name: '试运行初步运行报告的编写', status: '已完成', progress: '60%', date: undefined }
]
const tasks = ref<TaskItem[]>(isEdit.value ? [...sampleTasks] : [])

const taskForm = reactive<TaskItem>({ id: '', name: '', status: '未完成', progress: '60%', date: undefined })
const taskModal = useModal({})
const openAddTask = () => taskModal.open()
const addTask = () => {
  const id = `t${Date.now()}`
  tasks.value.push({ ...taskForm, id })
  taskModal.handleCancel()
  taskForm.name = ''
}
const removeTask = (idx: number) => tasks.value.splice(idx, 1)

// 设备故障记录
const sampleDeviceIssues: DeviceIssueItem[] = [
  {
    id: 'd1',
    sn: '01900094ESC0000E5900-XXX',
    model: '11',
    partNo: 'IGBT-AB模块',
    deviceName: 'IGBT-AB模块',
    currentStatus: '未通过',
    reason: 'XXXXXXXXXX',
    happenTime: '2025-05-16',
    stage: '动态调试',
    needReport: '需要',
    itrFlow: '提交',
    itrNo: 'OR-0000...',
    rdInvolved: '是'
  }
]
const deviceIssues = ref<DeviceIssueItem[]>(isEdit.value ? [...sampleDeviceIssues] : [])

const deviceIssueColumns = [
  { title: '设备SN码', dataIndex: 'sn', key: 'sn', width: 220, customRender: ({ text }: any) => h(EllipsisText, { text, width: 200 }) },
  { title: '设备型号', dataIndex: 'model', key: 'model', width: 100, customRender: ({ text }: any) => h(EllipsisText, { text, width: 100 }) },
  { title: '设备部件号', dataIndex: 'partNo', key: 'partNo', width: 160, customRender: ({ text }: any) => h(EllipsisText, { text, width: 160 }) },
  { title: '设备数量', dataIndex: 'model', key: 'qty', width: 100, customRender: () => '1' },
  { title: '部件名称', dataIndex: 'deviceName', key: 'deviceName', width: 140, customRender: ({ text }: any) => h(EllipsisText, { text, width: 140 }) },
  { title: '当前状态', dataIndex: 'currentStatus', key: 'status', width: 120 },
  { title: '故障原因', dataIndex: 'reason', key: 'reason', width: 140, customRender: ({ text }: any) => h(EllipsisText, { text, width: 140 }) },
  { title: '发生时间', dataIndex: 'happenTime', key: 'happenTime', width: 140 },
  { title: '发生阶段', dataIndex: 'stage', key: 'stage', width: 120 },
  { title: '需要分析报告', dataIndex: 'needReport', key: 'needReport', width: 140 },
  { title: '关联ITR流程', dataIndex: 'itrFlow', key: 'itrFlow', width: 140 },
  { title: 'ITR编号', dataIndex: 'itrNo', key: 'itrNo', width: 140, customRender: ({ text }: any) => h(EllipsisText, { text, width: 140 }) },
  { title: '研发是否介入', dataIndex: 'rdInvolved', key: 'rdInvolved', width: 140 }
]

const deviceIssueForm = reactive({ sn: '', model: '', partNo: '' })
const deviceIssueModal = useModal({})
const openAddDeviceIssue = () => deviceIssueModal.open()
const addDeviceIssue = () => {
  const id = `d${Date.now()}`
  deviceIssues.value.push({
    id,
    sn: deviceIssueForm.sn,
    model: deviceIssueForm.model,
    partNo: deviceIssueForm.partNo,
    deviceName: deviceIssueForm.partNo,
    currentStatus: '未通过',
    reason: '-',
    happenTime: '2025-05-16',
    stage: '-',
    needReport: '-',
    itrFlow: '-',
    itrNo: '-',
    rdInvolved: '否'
  })
  deviceIssueModal.handleCancel()
  deviceIssueForm.sn = ''
  deviceIssueForm.model = ''
  deviceIssueForm.partNo = ''
}

// 当日费用记录
const sampleExpenses: ExpenseItem[] = [
  { id: 'e1', owner: 'xxx', type: '住宿', detail: '-', amount: 160, remark: 'XXXXXXXXXX' },
  { id: 'e2', owner: 'xxx', type: '交通', detail: '打车', amount: 160, remark: 'XXXXXXXXXX' }
]
const expenses = ref<ExpenseItem[]>(isEdit.value ? [...sampleExpenses] : [])
const expenseColumns = [
  { title: '费用产生人', dataIndex: 'owner', key: 'owner', width: 140, customRender: ({ text }: any) => h(EllipsisText, { text, width: 140 }) },
  { title: '费用类型', dataIndex: 'type', key: 'type', width: 140 },
  { title: '费用详细', dataIndex: 'detail', key: 'detail', width: 160, customRender: ({ text }: any) => h(EllipsisText, { text, width: 160 }) },
  { title: '费用金额', dataIndex: 'amount', key: 'amount', width: 140, customRender: ({ text }: any) => `${text} ￥` },
  { title: '备注', dataIndex: 'remark', key: 'remark', customRender: ({ text }: any) => h(EllipsisText, { text, width: 160 }) }
]
const expenseForm = reactive({ owner: '', type: '', detail: '', amount: 0 })
const expenseModal = useModal({})
const openAddExpense = () => expenseModal.open()
const addExpense = () => {
  const id = `e${Date.now()}`
  expenses.value.push({ id, ...expenseForm })
  expenseModal.handleCancel()
  expenseForm.owner = ''
  expenseForm.type = ''
  expenseForm.detail = ''
  expenseForm.amount = 0
}
</script>

<style scoped>
.add-log-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 1400px;
  overflow-x: auto;
}
.section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.section-header {
  margin-bottom: 12px;
}
.section-title {
  font-weight: 600;
}
.task-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 calc(50% - 6px);
}
/* 表头单行显示 */
.add-log-page :deep(.ant-table-thead th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>