<template>
  <a-pagination
   :current="page"
   :page-size="rows"
   :total="props.total"
   :showTotal="(total: number) => `共${total}条`"
   :showQuickJumper="props.showQuickJumper"
   :showSizeChanger="props.showSizeChanger"
   :showSizeChange="showSizeChange"
   :pageSizeOptions="props.pageSizeOptions"
   :showLessItems="props.showLessItems"
   :simple="props.simple"
   @change="handleChange"
  ></a-pagination>
</template>

<script setup lang="ts">
interface Props {
  total: number
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  pageSizeOptions?: any
  showLessItems?: boolean
  simple?: boolean
}
let page = defineModel<number | undefined>('page', {
  required: true
})
let rows = defineModel<number | undefined>('rows', {
  required: true
})
const props = withDefaults(defineProps<Props>(), {
  total: 0,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showLessItems: false,
  simple: false
})

const showSizeChange = (current: number, size: number) => {
  page.value = 1
}
const handleChange = (current: number, size: number) => {
  page.value = current
  if (size !== rows.value) {
   page.value = 1
   rows.value = size
  }
  if (current !== page.value && size === rows.value) {
   page.value = current
  }
}
</script>

<style lang="less" scoped>
.ant-pagination {
  margin: 12px 0 0 0;
  text-align: right;
  position: relative;
  // right: 20px;
  // bottom: 0px;
  :deep(.ant-pagination-item) {
   border-radius: 4px;
   border: 1px solid var(--InoGray_01);
   a {
    color: var(--InoGray_10);
   }
  }
  :deep(.ant-pagination-item-active) {
   border-color: var(--Primary_06);
   background-color: var(--Primary_06);
   a {
    color: var(--Bg);
   }
  }
  :deep(.ant-pagination-next) {
   &.ant-pagination-disabled {
    .anticon {
     color: var(--InoGray_06);
    }
   }
   .anticon {
    font-size: 16px;
    color: var(--InoGray_08);
   }
  }
  :deep(.ant-pagination-prev) {
   &.ant-pagination-disabled {
    .anticon {
     color: var(--InoGray_06);
    }
   }
   .anticon {
    font-size: 16px;
    color: var(--InoGray_08);
   }
  }
}
</style>