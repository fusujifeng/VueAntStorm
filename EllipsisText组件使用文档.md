# EllipsisText 组件使用文档

## 概述

`EllipsisText` 是一个基于 Vue 3 和 Ant Design Vue 的文本省略组件。当文本内容超过指定宽度时，会自动显示省略号，并在鼠标悬停时通过 tooltip 显示完整内容。

## 特性

- ✅ 自动文本截断和省略号显示
- ✅ 智能 tooltip 提示（仅在文本被截断时显示）
- ✅ 自定义宽度和样式
- ✅ TypeScript 支持
- ✅ 响应式设计

## 安装和引入

### 1. 组件位置
```
src/components/EllipsisText.vue
```

### 2. 在组件中引入
```vue
<script setup lang="ts">
import EllipsisText from '@/components/EllipsisText.vue'
</script>
```

## API

### Props

| 参数 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| text | string | - | ✅ | 要显示的文本内容 |
| width | number | - | ✅ | 组件宽度（单位：px） |
| customStyle | Record<string, any> | {} | ❌ | 自定义样式对象 |

### 样式属性

组件默认应用以下 CSS 样式：
- `display: inline-block`
- `overflow: hidden`
- `text-overflow: ellipsis`
- `white-space: nowrap`

## 使用示例

### 基础用法

```vue
<template>
  <EllipsisText 
    text="这是一段很长的文本内容，当超过指定宽度时会显示省略号" 
    :width="200"
  />
</template>

<script setup lang="ts">
import EllipsisText from '@/components/EllipsisText.vue'
</script>
```

### 自定义样式

```vue
<template>
  <EllipsisText 
    text="山东省济南市章丘区文祖镇三德范村西南2公里处" 
    :width="300"
    :custom-style="{ 
      fontSize: '16px', 
      color: '#1890ff',
      fontWeight: 'bold',
      backgroundColor: '#f0f0f0',
      padding: '4px 8px',
      borderRadius: '4px'
    }"
  />
</template>
```

### 在表格中使用

```vue
<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'address'">
        <EllipsisText 
          :text="record.address" 
          :width="200"
          :custom-style="{ fontSize: '14px' }"
        />
      </template>
    </template>
  </a-table>
</template>
```

### 在卡片中使用

```vue
<template>
  <a-card title="地理信息">
    <a-flex>
      <a-avatar :src="avatarUrl" shape="square" :size="80" style="margin-right: 12px;" />
      <div>
        <EllipsisText 
          text="山东省济南市章丘区文祖镇三德范村西南2公里处" 
          :width="300"
          :custom-style="{ fontSize: '14px', color: '#333', marginBottom: '8px' }"
        />
        <div>
          <a-tag color="orange">大风预警</a-tag>
          <span>海拔3515米</span>
        </div>
      </div>
    </a-flex>
  </a-card>
</template>
```

## 工作原理

1. **文本截断检测**：组件通过比较元素的 `scrollWidth`（内容实际宽度）和 `clientWidth`（可见宽度）来判断文本是否被截断。

2. **智能 Tooltip**：只有当文本被截断时才显示 tooltip，避免不必要的提示。

3. **响应式更新**：在组件挂载和鼠标悬停时会重新检测文本是否溢出。

## 注意事项

### 1. 宽度设置
- `width` 参数必须为数字，单位为像素（px）
- 建议根据父容器的实际宽度合理设置

### 2. 样式优先级
- `customStyle` 中的样式会覆盖组件默认样式
- 不建议在 `customStyle` 中修改 `overflow`、`text-overflow`、`white-space` 等核心样式属性

### 3. 性能考虑
- 组件会在鼠标悬停时进行 DOM 测量，频繁操作可能影响性能
- 建议在数据量大的列表中谨慎使用

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础的文本省略和 tooltip 功能
- 支持自定义宽度和样式

## 常见问题

### Q: 为什么 tooltip 没有显示？
A: 只有当文本内容超过指定宽度被截断时，tooltip 才会显示。如果文本没有被截断，不会显示 tooltip。

### Q: 如何修改 tooltip 的样式？
A: 可以通过全局 CSS 或者在父组件中覆盖 Ant Design Vue 的 tooltip 样式类。

### Q: 组件支持多行文本吗？
A: 当前版本只支持单行文本省略。如需多行文本省略，建议使用 CSS 的 `-webkit-line-clamp` 属性。

## 贡献

如果您发现问题或有改进建议，欢迎提交 Issue 或 Pull Request。