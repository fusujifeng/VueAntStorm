<template>
  <div class="side-menu" :class="{ 'side-menu--collapsed': collapsed }">
    <!-- 菜单头部 -->
    <div v-if="showHeader" class="side-menu__header">
      <div class="side-menu__logo">
        <img v-if="logo" :src="logo" :alt="title" class="side-menu__logo-img" />
        <span v-if="!collapsed" class="side-menu__title">{{ title }}</span>
      </div>
    </div>

    <!-- 搜索框 -->
    <div v-if="searchable && !collapsed" class="side-menu__search">
      <a-input
        v-model:value="searchKeyword"
        :placeholder="searchPlaceholder"
        allow-clear
        @change="handleSearch"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>

    <!-- 菜单内容 -->
    <div class="side-menu__content">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        :mode="'inline'"
        :theme="theme"
        :inline-collapsed="collapsed"
        :inline-indent="indent"
        :sub-menu-open-delay="openDelay"
        :sub-menu-close-delay="closeDelay"
        @select="handleSelect"
        @openChange="handleOpenChange"
        class="side-menu__menu"
      >
        <template v-for="menu in filteredMenus" :key="menu.key">
          <MenuItemComponent
            :menu="menu"
            :collapsed="collapsed"
            :show-icon="showIcon"
            :show-badge="showBadge"
          />
        </template>
      </a-menu>
    </div>

    <!-- 菜单底部 -->
    <div v-if="showFooter" class="side-menu__footer">
      <slot name="footer">
        <div class="side-menu__collapse-btn">
          <a-button
            type="text"
            :icon="collapsed ? h(MenuUnfoldOutlined) : h(MenuFoldOutlined)"
            @click="toggleCollapse"
            class="side-menu__collapse-toggle"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'
import type { MenuItem } from '@/types/auth'
import { useMenuStore } from '@/stores/menu'
import { useMenuConfig } from '@/composables/useMenuConfig'
import MenuItemComponent from './MenuItem.vue'

// Props
interface Props {
  // 菜单数据
  menus?: MenuItem[]
  // 是否折叠
  collapsed?: boolean
  // 主题
  theme?: 'light' | 'dark'
  // 缩进
  indent?: number
  // 是否显示头部
  showHeader?: boolean
  // 是否显示底部
  showFooter?: boolean
  // 是否显示图标
  showIcon?: boolean
  // 是否显示徽章
  showBadge?: boolean
  // 是否可搜索
  searchable?: boolean
  // 搜索占位符
  searchPlaceholder?: string
  // Logo
  logo?: string
  // 标题
  title?: string
  // 子菜单打开延迟
  openDelay?: number
  // 子菜单关闭延迟
  closeDelay?: number
  // 默认选中的菜单
  defaultSelectedKeys?: string[]
  // 默认展开的菜单
  defaultOpenKeys?: string[]
  // 是否手风琴模式
  accordion?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  theme: 'light',
  indent: 24,
  showHeader: true,
  showFooter: true,
  showIcon: true,
  showBadge: true,
  searchable: true,
  searchPlaceholder: '搜索菜单...',
  title: 'Vue Ant Storm',
  openDelay: 0,
  closeDelay: 0.1,
  defaultSelectedKeys: () => [],
  defaultOpenKeys: () => [],
  accordion: false
})

// Emits
interface Emits {
  (e: 'update:collapsed', value: boolean): void
  (e: 'select', info: { key: string; selectedKeys: string[]; menu: MenuItem }): void
  (e: 'openChange', openKeys: string[]): void
  (e: 'search', keyword: string): void
}

const emit = defineEmits<Emits>()

// Composables
const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const menuConfig = useMenuConfig()

// 响应式数据
const selectedKeys = ref<string[]>([...props.defaultSelectedKeys])
const openKeys = ref<string[]>([...props.defaultOpenKeys])
const searchKeyword = ref<string>('')

// 计算属性
const filteredMenus = computed(() => {
  if (props.menus) {
    return props.menus
  }
  
  if (searchKeyword.value) {
    return menuConfig.filteredSideMenus.value
  }
  
  return menuStore.filteredSideMenus
})

// 当前选中的菜单项
const currentMenu = computed(() => {
  const findMenu = (menus: MenuItem[], key: string): MenuItem | null => {
    for (const menu of menus) {
      if (menu.key === key) {
        return menu
      }
      if (menu.children) {
        const found = findMenu(menu.children, key)
        if (found) return found
      }
    }
    return null
  }
  
  const selectedKey = selectedKeys.value[0]
  return selectedKey ? findMenu(filteredMenus.value, selectedKey) : null
})

// 方法

/**
 * 切换折叠状态
 */
const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
}

/**
 * 处理菜单选择
 */
const handleSelect = (info: { key: string; selectedKeys: string[] }) => {
  const menu = findMenuByKey(info.key)
  if (!menu) return
  
  selectedKeys.value = info.selectedKeys
  
  // 发射选择事件
  emit('select', {
    key: info.key,
    selectedKeys: info.selectedKeys,
    menu
  })
  
  // 导航到对应路由
  if (menu.path && !menu.external) {
    router.push(menu.path)
  } else if (menu.external && menu.path) {
    window.open(menu.path, menu.target || '_blank')
  }
}

/**
 * 处理子菜单展开/收起
 */
const handleOpenChange = (keys: string[]) => {
  if (props.accordion) {
    // 手风琴模式：只允许一个子菜单展开
    const latestOpenKey = keys.find(key => !openKeys.value.includes(key))
    if (latestOpenKey) {
      const latestOpenMenu = findMenuByKey(latestOpenKey)
      if (latestOpenMenu && latestOpenMenu.children) {
        openKeys.value = [latestOpenKey]
      } else {
        openKeys.value = keys
      }
    } else {
      openKeys.value = keys
    }
  } else {
    openKeys.value = keys
  }
  
  emit('openChange', openKeys.value)
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  menuConfig.searchKeyword.value = searchKeyword.value
  emit('search', searchKeyword.value)
}

/**
 * 根据key查找菜单
 */
const findMenuByKey = (key: string): MenuItem | null => {
  const findMenu = (menus: MenuItem[]): MenuItem | null => {
    for (const menu of menus) {
      if (menu.key === key) {
        return menu
      }
      if (menu.children) {
        const found = findMenu(menu.children)
        if (found) return found
      }
    }
    return null
  }
  
  return findMenu(filteredMenus.value)
}

/**
 * 根据路径设置选中菜单
 */
const setSelectedByPath = (path: string) => {
  const findMenuByPath = (menus: MenuItem[]): MenuItem | null => {
    for (const menu of menus) {
      if (menu.path === path) {
        return menu
      }
      if (menu.children) {
        const found = findMenuByPath(menu.children)
        if (found) return found
      }
    }
    return null
  }
  
  const menu = findMenuByPath(filteredMenus.value)
  if (menu) {
    selectedKeys.value = [menu.key]
    
    // 展开父级菜单
    const parentKeys = getParentKeys(menu.key)
    openKeys.value = [...new Set([...openKeys.value, ...parentKeys])]
  }
}

/**
 * 获取父级菜单keys
 */
const getParentKeys = (targetKey: string): string[] => {
  const parentKeys: string[] = []
  
  const findParents = (menus: MenuItem[], target: string, parents: string[] = []): boolean => {
    for (const menu of menus) {
      const currentParents = [...parents, menu.key]
      
      if (menu.key === target) {
        parentKeys.push(...parents)
        return true
      }
      
      if (menu.children && findParents(menu.children, target, currentParents)) {
        return true
      }
    }
    return false
  }
  
  findParents(filteredMenus.value, targetKey)
  return parentKeys
}

/**
 * 展开所有菜单
 */
const expandAll = () => {
  const getAllKeys = (menus: MenuItem[]): string[] => {
    const keys: string[] = []
    menus.forEach(menu => {
      if (menu.children && menu.children.length > 0) {
        keys.push(menu.key)
        keys.push(...getAllKeys(menu.children))
      }
    })
    return keys
  }
  
  openKeys.value = getAllKeys(filteredMenus.value)
}

/**
 * 收起所有菜单
 */
const collapseAll = () => {
  openKeys.value = []
}

/**
 * 重置菜单状态
 */
const reset = () => {
  selectedKeys.value = [...props.defaultSelectedKeys]
  openKeys.value = [...props.defaultOpenKeys]
  searchKeyword.value = ''
  menuConfig.clearSearch()
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    setSelectedByPath(newPath)
  },
  { immediate: true }
)

// 监听折叠状态变化
watch(
  () => props.collapsed,
  (collapsed) => {
    if (collapsed) {
      // 折叠时收起所有子菜单
      openKeys.value = []
    } else {
      // 展开时恢复之前的状态
      const currentPath = route.path
      setSelectedByPath(currentPath)
    }
  }
)

// 监听菜单数据变化
watch(
  () => filteredMenus.value,
  () => {
    // 菜单数据变化时，重新设置选中状态
    const currentPath = route.path
    setSelectedByPath(currentPath)
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  // 初始化菜单状态
  const currentPath = route.path
  setSelectedByPath(currentPath)
})

// 暴露方法给父组件
defineExpose({
  selectedKeys,
  openKeys,
  currentMenu,
  expandAll,
  collapseAll,
  reset,
  setSelectedByPath
})
</script>

<style lang="scss" scoped>
.side-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  transition: all 0.2s;

  &--collapsed {
    .side-menu__header {
      .side-menu__title {
        opacity: 0;
        width: 0;
      }
    }
  }

  &__header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;

    .side-menu__logo {
      display: flex;
      align-items: center;
      gap: 12px;

      &-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }
    }

    .side-menu__title {
      font-size: 18px;
      font-weight: 600;
      color: #1890ff;
      transition: all 0.2s;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &__search {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    .side-menu__menu {
      border: none;
      height: 100%;

      :deep(.ant-menu-item),
      :deep(.ant-menu-submenu-title) {
        margin: 0;
        border-radius: 0;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }

      :deep(.ant-menu-item-selected) {
        background-color: #e6f7ff;
        border-right: 3px solid #1890ff;
        
        &::after {
          display: none;
        }
      }

      :deep(.ant-menu-submenu-selected) {
        .ant-menu-submenu-title {
          background-color: #e6f7ff;
        }
      }

      :deep(.ant-menu-inline-collapsed) {
        .ant-menu-item,
        .ant-menu-submenu {
          text-align: center;
          
          .ant-menu-item-icon,
          .ant-menu-submenu-arrow {
            margin-right: 0;
          }
        }
      }
    }
  }

  &__footer {
    padding: 16px;
    border-top: 1px solid #f0f0f0;
    flex-shrink: 0;

    .side-menu__collapse-btn {
      display: flex;
      justify-content: center;

      .side-menu__collapse-toggle {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        transition: all 0.2s;

        &:hover {
          border-color: #1890ff;
          color: #1890ff;
        }
      }
    }
  }
}

// 暗色主题
.side-menu :deep(.ant-menu-dark) {
  background: #001529;
  
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: rgba(255, 255, 255, 0.65);
    
    &:hover {
      background-color: #1890ff;
      color: #fff;
    }
  }
  
  .ant-menu-item-selected {
    background-color: #1890ff;
    color: #fff;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .side-menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 256px;
    transform: translateX(-100%);
    transition: transform 0.3s;
    
    &.side-menu--mobile-open {
      transform: translateX(0);
    }
  }
}

// 滚动条样式
.side-menu__content {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
}
</style>