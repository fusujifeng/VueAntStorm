<template>
  <div class="workorder-detail-page">
    <div class="tabs-sticky">
      <a-tabs
        :active-key="activeKey"
        @change="onTabChange"
        class="prominent-tabs"
      >
        <a-tab-pane key="basic" tab="基础信息" />
        <a-tab-pane key="work-content" tab="工作内容记录" />
        <a-tab-pane key="fault-summary" tab="设备故障汇总" />
        <a-tab-pane key="fee-summary" tab="费用汇总" />
      </a-tabs>
    </div>

    <a-card :bordered="false" class="header-card">
      <a-flex align="center" justify="space-between">
        <div class="title">
          工单详情 - {{ orderId }}
        </div>
        <a-space>
          <a-tag color="blue">进行中</a-tag>
          <a-tag color="green">优先级：中</a-tag>
        </a-space>
      </a-flex>
    </a-card>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = computed(() => String(route.params.id || ''))

// 当前子路由 key：basic/work-content/fault-summary/fee-summary
const activeKey = computed(() => {
  const last = route.path.split('/').pop() || ''
  // 如果当前路径就是 /workorder-detail/:id，则默认 basic
  if (last === orderId.value) return 'basic'
  return last
})

const onTabChange = (key: string) => {
  router.push({ path: `/workorder-detail/${orderId.value}/${key}` })
}
</script>

<style scoped>
.workorder-detail-page {
  padding: 12px 0;
  min-width: 1200px;
}
.tabs-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.prominent-tabs :deep(.ant-tabs-tab) {
  font-size: 16px;
  font-weight: 600;
}
.prominent-tabs :deep(.ant-tabs-ink-bar) {
  height: 3px;
}
.prominent-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #1890ff;
}
.header-card .title {
  font-size: 18px;
  font-weight: 600;
}
</style>