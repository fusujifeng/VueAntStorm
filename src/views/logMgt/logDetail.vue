<template>
  <div class="log-detail-page">
    <!-- 关联工单 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">关联工单</span>
      </a-flex>
      <a-form layout="horizontal">
        <a-form-item label="相关工单" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-model:value="detail.workOrder" style="width: 280px">
            <a-select-option :value="detail.workOrder">{{ detail.workOrder }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </section>

    <!-- 基本信息 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">基本信息</span>
      </a-flex>
      <a-flex class="info-grid" gap="16" wrap>
        <div class="info-item">
          <a-flex gap="8" align="center">
            <a-badge status="success" />
            <div>
              <div class="label">账号</div>
              <div class="value">张六 - 17625461259</div>
            </div>
          </a-flex>
        </div>
        <div class="info-item">
          <a-flex gap="8" align="center">
            <a-badge status="success" />
            <div>
              <div class="label">上次巡检时间</div>
              <div class="value">2025.07.17 09:20:19 / xxxxxxxxxxxxxxxx</div>
            </div>
          </a-flex>
        </div>
        <div class="info-item">
          <a-flex gap="8" align="center">
            <a-badge status="success" />
            <div>
              <div class="label">下次巡检时间</div>
              <div class="value">2025.08.17 09:20:19 / xxxxxxxxxxxxxxxx</div>
            </div>
          </a-flex>
        </div>
      </a-flex>
    </section>

    <!-- 今日完成任务项（两列） -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">今日完成任务项</span>
      </a-flex>
      <a-flex class="task-grid" wrap gap="12">
        <div class="task-item" v-for="t in tasks" :key="t.id">
          <a-flex gap="8" align="center">
            <a-badge status="success" />
            <div class="task-content">
              <div class="task-title">{{ t.name }}</div>
              <a-flex gap="24">
                <div class="task-meta">总数：{{ t.total }} | 已完成：{{ t.done }} | 剩余：{{ t.left }}</div>
                <div class="task-meta">状态：<a-tag :color="t.status === '已完成' ? 'green' : 'gold'">{{ t.status }}</a-tag> 进度：{{ t.progress }}</div>
              </a-flex>
            </div>
          </a-flex>
        </div>
      </a-flex>
    </section>

    <!-- 设备故障记录 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">设备故障记录</span>
      </a-flex>
      <a-table :data-source="deviceIssues" :columns="deviceIssueColumns" row-key="id" :pagination="false">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'status'">
            <a-tag color="green">已探测</a-tag>
          </template>
          <template v-else-if="['sn','model','partNo','deviceName','reason','itrNo'].includes(column.key)">
            <EllipsisText :text="text" :width="160" />
          </template>
        </template>
      </a-table>
    </section>

    <!-- 当日费用记录 -->
    <section class="section">
      <a-flex align="center" justify="space-between" class="section-header">
        <span class="section-title">当日费用记录</span>
      </a-flex>
      <a-table :data-source="expenses" :columns="expenseColumns" row-key="id" :pagination="false">
        <template #bodyCell="{ column, text }">
          <template v-if="['owner','detail','remark'].includes(column.key)">
            <EllipsisText :text="text" :width="160" />
          </template>
        </template>
      </a-table>
    </section>

    <!-- 异常备注 -->
    <section class="section">
      <span class="section-title">异常备注</span>
      <a-textarea v-model:value="detail.remark" placeholder="请输入内容" :rows="4" />
    </section>

    <!-- 底部操作：同意 / 拒绝 -->
    <section class="section actions">
      <a-flex justify="flex-end" gap="12">
        <a-button type="primary" @click="handleAgree">同意</a-button>
        <a-button danger @click="openReject">拒绝</a-button>
      </a-flex>
    </section>

    <!-- 拒绝弹窗 -->
    <a-modal
      title="拒绝"
      v-model:open="rejectModal.visible.value"
      :mask-closable="false"
      ok-text="确认拒绝"
      cancel-text="取消"
      @ok="rejectModal.handleOk"
      @cancel="rejectModal.handleCancel"
      destroy-on-close
    >
      <a-form
        ref="rejectFormRef"
        layout="horizontal"
        :model="rejectForm"
        :rules="rejectRules"
      >
        <a-form-item
          name="reason"
          label="拒绝原因"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          required
        >
          <a-textarea v-model:value="rejectForm.reason" placeholder="请输入拒绝原因" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from '@/composables/useModal'
import { message } from 'ant-design-vue'
import EllipsisText from '@/components/EllipsisText.vue'

const route = useRoute()
const id = computed(() => String(route.params.id || route.query.id || ''))

const detail = reactive({
  id: id.value || 'LOG000001',
  workOrder: 'WO-00001',
  remark: ''
})

// 今日任务项（两列）
const tasks = ref([
  { id: 't1', name: '最小并发值、通道设置', total: 50, done: 20, left: 30, status: '未完成', progress: '60%' },
  { id: 't2', name: '试运行初步运行报告的编写', total: 50, done: 20, left: 30, status: '已完成', progress: '60%' },
  { id: 't3', name: '全站信道巡检调试记录（表链）', total: 50, done: 20, left: 30, status: '未完成', progress: '60%' },
  { id: 't4', name: '全站信道巡检调试记录（表链）', total: 50, done: 20, left: 30, status: '未完成', progress: '60%' }
])

// 设备故障记录
const deviceIssuesAll = ref([
  { id: 'd1', sn: '01900094ESC0000E5900-XXX', model: '001E5900-XXX01', partNo: 'IGBT-AB模块', qty: 1, deviceName: 'IGBT-AB模块', status: '已探测', reason: 'XXXXXXXXXX', happenTime: '2025-05-16', stage: '动态调试', needReport: '需要', itrFlow: '提交', itrNo: 'OR-0000...', rdInvolved: '是', askHelp: '否' }
])
const deviceIssues = ref([...deviceIssuesAll.value])
const deviceIssueColumns = [
  { title: '设备SN码', dataIndex: 'sn', key: 'sn', width: 220 },
  { title: '设备型号', dataIndex: 'model', key: 'model', width: 140 },
  { title: '设备部件号', dataIndex: 'partNo', key: 'partNo', width: 160 },
  { title: '设备数量', dataIndex: 'qty', key: 'qty', width: 100 },
  { title: '部件名称', dataIndex: 'deviceName', key: 'deviceName', width: 140 },
  { title: '当前状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '故障原因', dataIndex: 'reason', key: 'reason', width: 140 },
  { title: '发生时间', dataIndex: 'happenTime', key: 'happenTime', width: 140 },
  { title: '发生阶段', dataIndex: 'stage', key: 'stage', width: 120 },
  { title: '需要分析报告', dataIndex: 'needReport', key: 'needReport', width: 140 },
  { title: '关联ITR流程', dataIndex: 'itrFlow', key: 'itrFlow', width: 140 },
  { title: 'ITR编号', dataIndex: 'itrNo', key: 'itrNo', width: 140 },
  { title: '研发是否介入', dataIndex: 'rdInvolved', key: 'rdInvolved', width: 140 },
  { title: '寻求协助', dataIndex: 'askHelp', key: 'askHelp', width: 120 }
]

// 展示表格，无筛选逻辑

// 当日费用记录
const expensesAll = ref([
  { id: 'e1', owner: 'xxx', type: '住宿', detail: '-', amount: 160, remark: 'XXXXXXXXXX' },
  { id: 'e2', owner: 'xxx', type: '交通', detail: '打车', amount: 160, remark: 'XXXXXXXXXX' }
])
const expenses = ref([...expensesAll.value])
const expenseColumns = [
  { title: '费用产生人', dataIndex: 'owner', key: 'owner', width: 140 },
  { title: '费用类型', dataIndex: 'type', key: 'type', width: 140 },
  { title: '费用详细', dataIndex: 'detail', key: 'detail', width: 160 },
  { title: '费用金额', dataIndex: 'amount', key: 'amount', width: 140, customRender: ({ text }: any) => `${text} ￥` },
  { title: '备注', dataIndex: 'remark', key: 'remark' }
]
// 展示表格，无筛选逻辑

// 底部操作与拒绝弹窗逻辑
const handleAgree = () => {
  message.success('已同意')
}

const rejectFormRef = ref()
const rejectForm = reactive({ reason: '' })
const rejectRules = {
  reason: [{ required: true, message: '请填写拒绝原因' }]
}
const rejectModal = useModal({
  onOk: async () => {
    // 使用表单校验阻止关闭，无全局message提示
    await rejectFormRef.value?.validate()
    message.success('已拒绝')
    rejectForm.reason = ''
  }
})
const openReject = () => rejectModal.open()
</script>

<style scoped>
.log-detail-page {
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
.section-header { margin-bottom: 12px; }
.section-title { font-weight: 600; }
.info-grid { display: flex; flex-wrap: wrap; gap: 16px; }
.info-item { flex: 1 1 33%; min-width: 280px; }
.label { color: #888; }
.value { color: #333; }
.task-grid { display: flex; flex-wrap: wrap; gap: 12px; }
.task-item { flex: 0 0 calc(50% - 6px); background: #fafafa; border-radius: 8px; padding: 8px 12px; }
.task-title { font-weight: 600; margin-bottom: 4px; }
.task-meta { color: #666; }
.actions { text-align: right; }
/* 表头单行显示 */
.log-detail-page :deep(.ant-table-thead th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>