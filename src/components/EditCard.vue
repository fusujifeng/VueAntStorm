<template>
  <div class="info-block" style="flex: 1; min-width: 520px">
    <!-- 头部：标题 + 编辑按钮 -->
    <a-flex justify="space-between" align="center" class="block-header-container">
      <a-flex align="center" class="block-title">
        <div class="title-bar"></div>
        <div>{{ title }}</div>
      </a-flex>
      <a-button type="link" @click="editFunction"><a-space><editSpan/>{{editButtonText}}</a-space></a-button>
    </a-flex>
    <!-- 内容区 -->
    <div class="content-area">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import geographicInfo from "@/assets/images/plant/geographicInfo.png";

const props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  editFunction: {
    type: Function,
    default: () => {}
  },
  editButtonText: {
    type: String,
    default: () => ('edit')
  }
})
</script>


<style scoped lang="less">
.station-info-page {
  background-color: #E9EEF2;
}

/* 卡片容器样式 */
.info-block {
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 10px 10px 10px 10px;
  background-color: #fff;
}



/* 头部容器样式 */
.block-header-container {
  margin: 4px 0;
}

/* 标题样式 */
.block-title {
  gap: 8px;
}

.block-title div:last-child {
  text-align: left;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #222222;
}

/* 标题前的彩色条 - 统一为#0099F2 */
.title-bar {
  width: 2px;
  height: 13px;
  border-radius: 2px;
  background-color: #0099F2;
}

/* 内容区域样式 */
.content-area {
  padding-top: 8px;
}
</style>
