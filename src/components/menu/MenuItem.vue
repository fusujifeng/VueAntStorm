<template>
  <!-- 分组菜单 -->
  <a-menu-item-group v-if="menu.type === 'group'" :key="menu.key" :title="menu.title">
    <template v-for="child in menu.children" :key="child.key">
      <MenuItemComponent
        :menu="child"
        :collapsed="collapsed"
        :show-icon="showIcon"
        :show-badge="showBadge"
      />
    </template>
  </a-menu-item-group>

  <!-- 分割线 -->
  <a-menu-divider v-else-if="menu.type === 'divider'" :key="menu.key" />

  <!-- 子菜单 -->
  <a-sub-menu
    v-else-if="menu.children && menu.children.length > 0"
    :key="menu.key"
    :disabled="menu.disabled"
    :title="menu.title"
  >
    <template #icon>
      <component
        v-if="showIcon && menu.icon"
        :is="menu.icon"
        class="menu-item__icon"
      />
    </template>
    
    <template #title>
      <span class="menu-item__title">
        {{ menu.title }}
        <a-badge
          v-if="showBadge && menu.badge"
          :count="menu.badge.count"
          :color="menu.badge.color"
          :dot="menu.badge.dot"
          :offset="menu.badge.offset"
          class="menu-item__badge"
        />
      </span>
    </template>

    <template v-for="child in menu.children" :key="child.key">
      <MenuItemComponent
        :menu="child"
        :collapsed="collapsed"
        :show-icon="showIcon"
        :show-badge="showBadge"
      />
    </template>
  </a-sub-menu>

  <!-- 普通菜单项 -->
  <a-menu-item
    v-else
    :key="menu.key"
    :disabled="menu.disabled"
  >
    <template #icon>
      <component
        v-if="showIcon && menu.icon"
        :is="menu.icon"
        class="menu-item__icon"
      />
    </template>

    <span class="menu-item__content">
      <span class="menu-item__title">{{ menu.title }}</span>
      <a-badge
        v-if="showBadge && menu.badge"
        :count="menu.badge.count"
        :color="menu.badge.color"
        :dot="menu.badge.dot"
        :offset="menu.badge.offset"
        class="menu-item__badge"
      />
    </span>

    <!-- 外部链接图标 -->
    <LinkOutlined
      v-if="menu.external"
      class="menu-item__external-icon"
    />
  </a-menu-item>
</template>

<script setup lang="ts">
import { LinkOutlined } from '@ant-design/icons-vue'
import type { MenuItem } from '@/types/auth'

// Props
interface Props {
  menu: MenuItem
  collapsed?: boolean
  showIcon?: boolean
  showBadge?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false,
  showIcon: true,
  showBadge: true
})

// 递归组件名称
const MenuItemComponent = 'MenuItemComponent'
</script>

<script lang="ts">
// 设置组件名称以支持递归
export default {
  name: 'MenuItemComponent'
}
</script>

<style lang="scss" scoped>
.menu-item {
  &__icon {
    font-size: 16px;
    vertical-align: middle;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__badge {
    margin-left: 8px;
    flex-shrink: 0;
  }

  &__external-icon {
    font-size: 12px;
    color: #999;
    margin-left: 8px;
    flex-shrink: 0;
  }
}

// 折叠状态下的样式
:deep(.ant-menu-inline-collapsed) {
  .menu-item__badge,
  .menu-item__external-icon {
    display: none;
  }
}

// 子菜单标题样式
:deep(.ant-menu-submenu-title) {
  .menu-item__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

// 菜单项组样式
:deep(.ant-menu-item-group-title) {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  margin: 8px 0 4px 0;
}

// 分割线样式
:deep(.ant-menu-divider) {
  margin: 8px 0;
  background-color: #f0f0f0;
}
</style>