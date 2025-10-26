<template>
  <div class="my-table-container">
    <a-table
      :dataSource="props.dataSource"
      :columns="props.columns"
      :pagination="props.pagination"
      :scroll="props.scroll"
      :size="props.size"
      :bordered="props.bordered"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column?.dataIndex === 'operation'">
          <a-space>
            <a-button type="link" size="small">查看</a-button>
            <a-button type="link" size="small">编辑</a-button>
            <a-button type="link" size="small" danger>删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

// 定义 props
interface Props {
  dataSource?: any[]
  columns?: any[]
  pagination?: any
  scroll?: any
  size?: string
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
  columns: () => [],
  pagination: false,
  scroll: () => ({ y: 'calc(100vh - 300px)' }),
  size: 'small',
  bordered: true
})
</script>

<style scoped>
.my-table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.my-table-container .ant-table-wrapper {
  flex: 1;
  height: 0; /* 关键：强制表格计算高度 */
}

.my-table-container .ant-table {
  height: 100%;
}

.my-table-container .ant-table-tbody > tr > td {
  padding: 8px 16px;
}

.my-table-container .ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 600;
}
</style>