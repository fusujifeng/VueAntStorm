<template>
  <div class="basic-info">
    <a-card :bordered="false">
      <a-flex justify="space-between" class="section">
        <div>
          <div class="section-title">工程信息</div>
          <div class="section-content">山东泰达清源服务区西区电站 | 50MW</div>
        </div>
        <div>
          <div class="section-title">站点位置</div>
          <div class="section-content">山东省济南市章丘区某村镇 | 157498975461</div>
        </div>
        <div>
          <div class="section-title">ETO信息</div>
          <div class="section-content">ETO编号：D24128012 | ETO评审信息</div>
        </div>
      </a-flex>

      <div class="sub-section">
        <div class="section-title">工程发起人</div>
        <div class="section-content">负责人：张六-17625461259</div>
      </div>

      <div class="sub-section">
        <div class="section-title">设备型号/数量</div>
        <div class="section-content">IES900-07-2510-C-5 32台；IES900-07-2510-C-5 32台；PCS单台测试</div>
      </div>

      <div class="sub-section">
        <div class="section-title">参与人员</div>
        <div class="section-content">负责人：张六-17625461259；联系人：张三、李四</div>
      </div>

      <div class="sub-section">
        <div class="section-title">需求内容</div>
        <div class="section-content">现场安装调试、整体验收、硬件/软件联合测试、交互规范验证</div>
      </div>
      <!-- 底部操作区 -->
      <a-flex class="footer-actions" justify="flex-end" gap="12">
        <a-button @click="openIgnore">忽略</a-button>
        <a-button @click="openTransfer">转办</a-button>
        <a-button type="primary" @click="openAccept">接受</a-button>
      </a-flex>
    </a-card>

    <!-- 忽略弹窗 -->
    <a-modal
      title="忽略工单"
      v-model:open="ignoreModal.visible.value"
      :mask-closable="false"
      @ok="ignoreModal.handleOk"
      @cancel="ignoreModal.handleCancel"
      destroy-on-close
    >
      <a-form :model="ignoreForm" layout="vertical">
        <a-form-item label="备注">
          <a-textarea v-model:value="ignoreForm.remark" :rows="3" placeholder="请输入忽略原因" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 转办弹窗 -->
    <a-modal
      title="转办工单"
      v-model:open="transferModal.visible.value"
      :mask-closable="false"
      ok-text="提交"
      cancel-text="取消"
      @ok="transferModal.handleOk"
      @cancel="transferModal.handleCancel"
      destroy-on-close
    >
      <a-form
        ref="transferFormRef"
        layout="horizontal"
        :model="transferForm"
        :rules="transferRules"
      >
        <a-form-item
          name="reason"
          label="转办原因"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          required
        >
          <a-input v-model:value="transferForm.reason" placeholder="请输入转办原因" />
        </a-form-item>
        <a-form-item
          name="receiver"
          label="转办接收人"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-select
            v-model:value="transferForm.receiver"
            :options="receiverOptions"
            placeholder="请选择接收人"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 接受弹窗 -->
    <a-modal
      title="接受工单"
      v-model:open="acceptModal.visible.value"
      :mask-closable="false"
      @ok="acceptModal.handleOk"
      @cancel="acceptModal.handleCancel"
      destroy-on-close
    >
      <a-form :model="acceptForm" layout="vertical">
        <a-form-item label="备注">
          <a-textarea v-model:value="acceptForm.remark" :rows="3" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useModal } from '@/composables/useModal'

// 忽略弹窗
const ignoreForm = reactive({ remark: '' })
const ignoreModal = useModal({
  onOk: async () => {
    message.success('已忽略该工单')
    ignoreForm.remark = ''
  }
})
const openIgnore = () => ignoreModal.open()

// 转办弹窗
const transferFormRef = ref()
const receiverOptions = [
  { label: '张三', value: 'zhangsan' },
  { label: '李四', value: 'lisi' },
  { label: '王五', value: 'wangwu' }
]
const transferForm = reactive({ reason: '', receiver: '' })
const transferRules = {
  reason: [{ required: true, message: '请填写转办原因' }]
}
const transferModal = useModal({
  onOk: async () => {
    // 表单校验，失败将阻止关闭
    await transferFormRef.value?.validate()
    message.success('转办成功')
    transferForm.reason = ''
    transferForm.receiver = ''
  }
})
const openTransfer = () => transferModal.open()

// 接受弹窗
const acceptForm = reactive({ remark: '' })
const acceptModal = useModal({
  onOk: async () => {
    message.success('已接受工单')
    acceptForm.remark = ''
  }
})
const openAccept = () => acceptModal.open()
</script>

<style scoped>
.section { gap: 24px; }
.section-title { font-weight: 600; margin-bottom: 8px; }
.section-content { color: #555; }
.sub-section { margin-top: 16px; }
.footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>