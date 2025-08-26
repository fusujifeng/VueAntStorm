<template>
  <!-- 分组菜单 -->
  <a-menu-item-group v-if="menu.type === 'group'" :key="menu.key" :title="menu.title">
    <template v-for="child in menu.children" :key="child.key">
      <TopMenuItemComponent
        :menu="child"
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
        :is="getIconComponent(menu.icon)"
      />
    </template>
    
    <template #title>
      <span class="top-menu-item__title">
        {{ menu.title }}
        <a-badge
          v-if="showBadge && menu.badge"
          :count="menu.badge.count"
          :dot="menu.badge.dot"
          :color="menu.badge.color"
          :status="menu.badge.status"
          :text="menu.badge.text"
          :offset="menu.badge.offset"
          class="top-menu-item__badge"
        />
      </span>
    </template>

    <template v-for="child in menu.children" :key="child.key">
      <TopMenuItemComponent
        :menu="child"
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
        :is="getIconComponent(menu.icon)"
      />
    </template>
    
    <!-- 外部链接 -->
    <a
      v-if="menu.external && menu.path"
      :href="menu.path"
      :target="menu.target || '_blank'"
      :rel="menu.target === '_blank' ? 'noopener noreferrer' : undefined"
      class="top-menu-item__link top-menu-item__link--external"
    >
      <span class="top-menu-item__title">
        {{ menu.title }}
        <a-badge
          v-if="showBadge && menu.badge"
          :count="menu.badge.count"
          :dot="menu.badge.dot"
          :color="menu.badge.color"
          :status="menu.badge.status"
          :text="menu.badge.text"
          :offset="menu.badge.offset"
          class="top-menu-item__badge"
        />
      </span>
      <LinkOutlined class="top-menu-item__external-icon" />
    </a>
    
    <!-- 内部链接 -->
    <span v-else class="top-menu-item__link">
      <span class="top-menu-item__title">
        {{ menu.title }}
        <a-badge
          v-if="showBadge && menu.badge"
          :count="menu.badge.count"
          :dot="menu.badge.dot"
          :color="menu.badge.color"
          :status="menu.badge.status"
          :text="menu.badge.text"
          :offset="menu.badge.offset"
          class="top-menu-item__badge"
        />
      </span>
    </span>
  </a-menu-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LinkOutlined } from '@ant-design/icons-vue'
import type { MenuItem } from '@/types/auth'
import { parseIcon } from '@/utils/menuGenerator'

// Props
interface Props {
  menu: MenuItem
  showIcon?: boolean
  showBadge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  showBadge: true
})

// 获取图标组件
const getIconComponent = (icon: string) => {
  return parseIcon(icon)
}

// 菜单项类名
const menuItemClass = computed(() => {
  const classes = ['top-menu-item']
  
  if (props.menu.disabled) {
    classes.push('top-menu-item--disabled')
  }
  
  if (props.menu.external) {
    classes.push('top-menu-item--external')
  }
  
  if (props.menu.danger) {
    classes.push('top-menu-item--danger')
  }
  
  return classes
})
</script>

<script lang="ts">
// 递归组件需要定义名称
export default {
  name: 'TopMenuItemComponent'
}
</script>

<style lang="scss" scoped>
.top-menu-item {
  &__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
    width: 100%;
    
    &--external {
      &:hover {
        color: #1890ff;
      }
    }
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  &__badge {
    :deep(.ant-badge-count) {
      font-size: 12px;
      min-width: 16px;
      height: 16px;
      line-height: 16px;
      padding: 0 4px;
    }
    
    :deep(.ant-badge-dot) {
      width: 6px;
      height: 6px;
    }
  }

  &__external-icon {
    font-size: 12px;
    opacity: 0.6;
    margin-left: 4px;
  }

  // 禁用状态
  &--disabled {
    .top-menu-item__link {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  // 危险状态
  &--danger {
    .top-menu-item__title {
      color: #ff4d4f;
    }
  }
}

// 全局样式覆盖
:deep(.ant-menu-item) {
  &.top-menu-item--disabled {
    color: rgba(0, 0, 0, 0.25) !important;
    
    &:hover {
      color: rgba(0, 0, 0, 0.25) !important;
    }
  }
  
  &.top-menu-item--danger {
    .ant-menu-title-content {
      color: #ff4d4f;
    }
    
    &:hover {
      .ant-menu-title-content {
        color: #ff7875;
      }
    }
  }
}

:deep(.ant-menu-submenu) {
  &.top-menu-item--disabled {
    .ant-menu-submenu-title {
      color: rgba(0, 0, 0, 0.25) !important;
      
      &:hover {
        color: rgba(0, 0, 0, 0.25) !important;
      }
    }
  }
  
  &.top-menu-item--danger {
    .ant-menu-submenu-title {
      color: #ff4d4f;
      
      &:hover {
        color: #ff7875;
      }
    }
  }
}

// 暗色主题
:deep(.ant-menu-dark) {
  .top-menu-item--disabled {
    .ant-menu-title-content,
    .ant-menu-submenu-title {
      color: rgba(255, 255, 255, 0.25) !important;
      
      &:hover {
        color: rgba(255, 255, 255, 0.25) !important;
      }
    }
  }
}
</style>