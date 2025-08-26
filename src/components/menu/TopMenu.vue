<template>
  <div class="top-menu" :class="{ 'top-menu--dark': theme === 'dark' }">
    <!-- 左侧Logo和标题 -->
    <div v-if="showLogo" class="top-menu__logo">
      <img v-if="logo" :src="logo" :alt="title" class="top-menu__logo-img" />
      <span v-if="showTitle" class="top-menu__title">{{ title }}</span>
    </div>

    <!-- 菜单内容 -->
    <div class="top-menu__content">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        :mode="'horizontal'"
        :theme="theme"
        :triggerSubMenuAction="triggerAction"
        :sub-menu-open-delay="openDelay"
        :sub-menu-close-delay="closeDelay"
        @select="handleSelect"
        @openChange="handleOpenChange"
        class="top-menu__menu"
      >
        <template v-for="menu in filteredMenus" :key="menu.key">
          <TopMenuItemComponent
            :menu="menu"
            :show-icon="showIcon"
            :show-badge="showBadge"
          />
        </template>
      </a-menu>
    </div>

    <!-- 右侧操作区 -->
    <div v-if="showActions" class="top-menu__actions">
      <slot name="actions">
        <!-- 搜索 -->
        <div v-if="searchable" class="top-menu__search">
          <a-input
            v-model:value="searchKeyword"
            :placeholder="searchPlaceholder"
            allow-clear
            @change="handleSearch"
            class="top-menu__search-input"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </div>

        <!-- 通知 -->
        <div v-if="showNotification" class="top-menu__notification">
          <a-badge :count="notificationCount" :dot="notificationDot">
            <a-button type="text" :icon="h(BellOutlined)" @click="handleNotificationClick" />
          </a-badge>
        </div>

        <!-- 用户菜单 -->
        <div v-if="showUserMenu" class="top-menu__user">
          <a-dropdown placement="bottomRight">
            <a-button type="text" class="top-menu__user-btn">
              <a-avatar
                v-if="userAvatar"
                :src="userAvatar"
                :size="32"
                class="top-menu__user-avatar"
              />
              <a-avatar
                v-else
                :size="32"
                class="top-menu__user-avatar"
              >
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <span v-if="userName" class="top-menu__user-name">{{ userName }}</span>
              <DownOutlined class="top-menu__user-arrow" />
            </a-button>
            
            <template #overlay>
              <a-menu @click="handleUserMenuClick">
                <a-menu-item key="profile">
                  <UserOutlined />
                  个人资料
                </a-menu-item>
                <a-menu-item key="settings">
                  <SettingOutlined />
                  设置
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
  BellOutlined,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import type { MenuItem } from '@/types/auth'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'
import { useMenuConfig } from '@/composables/useMenuConfig'
import TopMenuItemComponent from './TopMenuItem.vue'

// Props
interface Props {
  // 菜单数据
  menus?: MenuItem[]
  // 主题
  theme?: 'light' | 'dark'
  // 是否显示Logo
  showLogo?: boolean
  // 是否显示标题
  showTitle?: boolean
  // 是否显示图标
  showIcon?: boolean
  // 是否显示徽章
  showBadge?: boolean
  // 是否显示操作区
  showActions?: boolean
  // 是否可搜索
  searchable?: boolean
  // 搜索占位符
  searchPlaceholder?: string
  // 是否显示通知
  showNotification?: boolean
  // 通知数量
  notificationCount?: number
  // 通知点
  notificationDot?: boolean
  // 是否显示用户菜单
  showUserMenu?: boolean
  // Logo
  logo?: string
  // 标题
  title?: string
  // 用户头像
  userAvatar?: string
  // 用户名
  userName?: string
  // 子菜单触发方式
  triggerAction?: 'hover' | 'click'
  // 子菜单打开延迟
  openDelay?: number
  // 子菜单关闭延迟
  closeDelay?: number
  // 默认选中的菜单
  defaultSelectedKeys?: string[]
  // 默认展开的菜单
  defaultOpenKeys?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  showLogo: true,
  showTitle: true,
  showIcon: true,
  showBadge: true,
  showActions: true,
  searchable: true,
  searchPlaceholder: '搜索...',
  showNotification: true,
  notificationCount: 0,
  notificationDot: false,
  showUserMenu: true,
  title: 'Vue Ant Storm',
  triggerAction: 'hover',
  openDelay: 0,
  closeDelay: 0.1,
  defaultSelectedKeys: () => [],
  defaultOpenKeys: () => []
})

// Emits
interface Emits {
  (e: 'select', info: { key: string; selectedKeys: string[]; menu: MenuItem }): void
  (e: 'openChange', openKeys: string[]): void
  (e: 'search', keyword: string): void
  (e: 'notificationClick'): void
  (e: 'userMenuClick', info: { key: string }): void
}

const emit = defineEmits<Emits>()

// Composables
const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const authStore = useAuthStore()
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
    return menuConfig.filteredHeadMenus.value
  }
  
  return menuStore.filteredHeadMenus
})

// 当前用户信息
const currentUser = computed(() => authStore.user)

// 用户头像
const userAvatar = computed(() => {
  return props.userAvatar || currentUser.value?.avatar
})

// 用户名
const userName = computed(() => {
  return props.userName || currentUser.value?.username || currentUser.value?.name
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
  openKeys.value = keys
  emit('openChange', keys)
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  menuConfig.searchKeyword.value = searchKeyword.value
  emit('search', searchKeyword.value)
}

/**
 * 处理通知点击
 */
const handleNotificationClick = () => {
  emit('notificationClick')
}

/**
 * 处理用户菜单点击
 */
const handleUserMenuClick = (info: { key: string }) => {
  emit('userMenuClick', info)
  
  // 默认处理
  switch (info.key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      authStore.logout()
      break
  }
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
  }
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
  reset,
  setSelectedByPath
})
</script>

<style lang="scss" scoped>
.top-menu {
  display: flex;
  align-items: center;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  &--dark {
    background: #001529;
    border-bottom-color: #001529;
    
    .top-menu__title {
      color: #fff;
    }
    
    .top-menu__user-name {
      color: rgba(255, 255, 255, 0.85);
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-right: 40px;
    flex-shrink: 0;

    &-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    color: #1890ff;
    white-space: nowrap;
  }

  &__content {
    flex: 1;
    overflow: hidden;

    .top-menu__menu {
      border: none;
      background: transparent;
      line-height: 62px;

      :deep(.ant-menu-item),
      :deep(.ant-menu-submenu) {
        border-bottom: 2px solid transparent;
        margin: 0 8px;
        
        &:hover {
          border-bottom-color: #1890ff;
        }
      }

      :deep(.ant-menu-item-selected) {
        border-bottom-color: #1890ff;
        background: transparent;
        
        &::after {
          display: none;
        }
      }

      :deep(.ant-menu-submenu-selected) {
        .ant-menu-submenu-title {
          border-bottom-color: #1890ff;
        }
      }

      :deep(.ant-menu-horizontal) {
        .ant-menu-item,
        .ant-menu-submenu {
          top: 0;
        }
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  &__search {
    .top-menu__search-input {
      width: 200px;
      
      @media (max-width: 768px) {
        width: 150px;
      }
    }
  }

  &__notification {
    .ant-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  &__user {
    &-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      height: 40px;
      border-radius: 20px;
      
      &:hover {
        background-color: #f5f5f5;
      }
    }

    &-avatar {
      flex-shrink: 0;
    }

    &-name {
      font-size: 14px;
      color: #333;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      
      @media (max-width: 768px) {
        display: none;
      }
    }

    &-arrow {
      font-size: 12px;
      color: #999;
      transition: transform 0.2s;
    }
  }
}

// 暗色主题
.top-menu--dark {
  .top-menu__menu :deep(.ant-menu-dark) {
    .ant-menu-item,
    .ant-menu-submenu-title {
      color: rgba(255, 255, 255, 0.65);
      
      &:hover {
        color: #fff;
        border-bottom-color: #1890ff;
      }
    }
    
    .ant-menu-item-selected {
      color: #fff;
      border-bottom-color: #1890ff;
    }
  }
  
  .top-menu__notification .ant-btn:hover,
  .top-menu__user-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .top-menu {
    padding: 0 16px;
    
    &__logo {
      margin-right: 16px;
    }
    
    &__title {
      font-size: 18px;
    }
    
    &__actions {
      gap: 8px;
    }
  }
}

@media (max-width: 576px) {
  .top-menu {
    &__title {
      display: none;
    }
    
    &__search {
      display: none;
    }
  }
}
</style>