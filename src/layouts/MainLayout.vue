<template>
  <a-layout style="min-height: 100vh" :class="{ 'layout--top-menu': layoutMode === 'top' }">
    <!-- 顶部菜单模式 -->
    <template v-if="layoutMode === 'top'">
      <a-layout-header class="layout-header">
        <TopMenu
          :theme="topMenuTheme"
          :show-logo="true"
          :show-title="true"
          :show-actions="true"
          :searchable="true"
          :show-notification="true"
          :notification-count="notificationCount"
          :show-user-menu="true"
          :logo="logo"
          :title="title"
          @select="handleTopMenuSelect"
          @search="handleTopMenuSearch"
          @notification-click="handleNotificationClick"
          @user-menu-click="handleUserMenuClick"
        />
      </a-layout-header>
      
      <a-layout-content class="layout-content">
        <div class="content-wrapper">
          <!-- 面包屑导航 -->
          <div v-if="showBreadcrumb" class="breadcrumb-wrapper">
            <a-breadcrumb>
              <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
                <router-link v-if="item.path && item.path !== route.path" :to="item.path">
                  {{ item.title }}
                </router-link>
                <span v-else>{{ item.title }}</span>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          
          <!-- 页面内容 -->
          <div class="page-content">
            <router-view />
          </div>
        </div>
      </a-layout-content>
    </template>
    
    <!-- 侧边菜单模式 -->
    <template v-else>
      <!-- 左侧菜单 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :collapsible="collapsible"
        :width="siderWidth"
        :collapsed-width="collapsedWidth"
        :breakpoint="breakpoint"
        @collapse="handleSiderCollapse"
        @breakpoint="handleSiderBreakpoint"
        class="layout-sider"
      >
        <SideMenu
          :collapsed="collapsed"
          :theme="sideMenuTheme"
          :show-logo="true"
          :show-title="!collapsed"
          :show-search="showSideMenuSearch"
          :accordion="accordion"
          :logo="logo"
          :title="title"
          @select="handleSideMenuSelect"
          @collapse="handleMenuCollapse"
          @search="handleSideMenuSearch"
        />
      </a-layout-sider>
      
      <a-layout>
        <!-- 顶部导航栏 -->
        <a-layout-header class="layout-header">
          <div class="header-content">
            <div class="header-left">
              <menu-unfold-outlined
                v-if="collapsed"
                class="trigger"
                @click="toggleCollapsed"
              />
              <menu-fold-outlined
                v-else
                class="trigger"
                @click="toggleCollapsed"
              />
              
              <!-- 面包屑导航 -->
              <div v-if="showBreadcrumb" class="breadcrumb-wrapper">
                <a-breadcrumb>
                  <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
                    <router-link v-if="item.path && item.path !== route.path" :to="item.path">
                      {{ item.title }}
                    </router-link>
                    <span v-else>{{ item.title }}</span>
                  </a-breadcrumb-item>
                </a-breadcrumb>
              </div>
            </div>
            
            <div class="header-right">
              <!-- 通知 -->
              <div v-if="showNotification" class="header-notification">
                <a-badge :count="notificationCount" :dot="notificationDot">
                  <a-button type="text" :icon="h(BellOutlined)" @click="handleNotificationClick" />
                </a-badge>
              </div>
              
              <!-- 用户菜单 -->
              <a-dropdown placement="bottomRight">
                <template #overlay>
                  <a-menu @click="handleUserMenuClick">
                    <a-menu-item key="profile">
                      <user-outlined />
                      个人中心
                    </a-menu-item>
                    <a-menu-item key="settings">
                      <setting-outlined />
                      设置
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="logout">
                      <logout-outlined />
                      退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="text" class="user-btn">
                  <a-avatar :size="32">
                    <template #icon><user-outlined /></template>
                  </a-avatar>
                  <span v-if="currentUser" class="user-name">{{ currentUser.username }}</span>
                  <DownOutlined class="user-arrow" />
                </a-button>
              </a-dropdown>
            </div>
          </div>
        </a-layout-header>
        
        <!-- 中间内容区域 -->
         <a-layout-content class="layout-content">
           <div class="content-wrapper">
             <router-view />
           </div>
         </a-layout-content>
         
         <!-- 底部 -->
         <a-layout-footer class="layout-footer">
           VueAntStorm ©2024 Created by Your Team
         </a-layout-footer>
       </a-layout>
     </template>
   </a-layout>
 </template>

<script setup lang="ts">
import { ref, computed, watch, h, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { MenuItem } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { generateBreadcrumb } from '@/utils/auth'
import SideMenu from '@/components/menu/SideMenu.vue'
import TopMenu from '@/components/menu/TopMenu.vue'

// Props
interface Props {
  // 布局模式
  layoutMode?: 'side' | 'top'
  // 侧边栏配置
  collapsible?: boolean
  siderWidth?: number
  collapsedWidth?: number
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  // 菜单主题
  sideMenuTheme?: 'light' | 'dark'
  topMenuTheme?: 'light' | 'dark'
  // 显示配置
  showBreadcrumb?: boolean
  showSideMenuSearch?: boolean
  showNotification?: boolean
  accordion?: boolean
  // 品牌配置
  logo?: string
  title?: string
  // 通知配置
  notificationCount?: number
  notificationDot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  layoutMode: 'side',
  collapsible: true,
  siderWidth: 256,
  collapsedWidth: 80,
  breakpoint: 'lg',
  sideMenuTheme: 'dark',
  topMenuTheme: 'light',
  showBreadcrumb: true,
  showSideMenuSearch: true,
  showNotification: true,
  accordion: false,
  title: 'VueAntStorm',
  notificationCount: 0,
  notificationDot: false
})

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const menuStore = useMenuStore()

// 响应式数据
const collapsed = ref<boolean>(false)
const isMobile = ref<boolean>(false)

// 计算属性
const currentUser = computed(() => authStore.user)

const currentMenus = computed(() => {
  return props.layoutMode === 'top' ? menuStore.filteredHeadMenus : menuStore.filteredSideMenus
})

// 面包屑导航
const breadcrumbItems = computed(() => {
  return generateBreadcrumb(route.path, currentMenus.value)
})

// 方法

/**
 * 切换侧边栏折叠状态
 */
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

/**
 * 处理侧边栏折叠事件
 */
const handleSiderCollapse = (collapsed: boolean) => {
  // 可以在这里添加额外的折叠逻辑
}

/**
 * 处理侧边栏断点事件
 */
const handleSiderBreakpoint = (broken: boolean) => {
  isMobile.value = broken
  if (broken) {
    collapsed.value = true
  }
}

/**
 * 处理侧边菜单选择
 */
const handleSideMenuSelect = (info: { key: string; selectedKeys: string[]; menu: MenuItem }) => {
  // 菜单选择逻辑已在 SideMenu 组件内部处理
}

/**
 * 处理顶部菜单选择
 */
const handleTopMenuSelect = (info: { key: string; selectedKeys: string[]; menu: MenuItem }) => {
  // 菜单选择逻辑已在 TopMenu 组件内部处理
}

/**
 * 处理菜单折叠
 */
const handleMenuCollapse = (collapsed: boolean) => {
  toggleCollapsed()
}

/**
 * 处理侧边菜单搜索
 */
const handleSideMenuSearch = (keyword: string) => {
  // 搜索逻辑已在菜单组件内部处理
}

/**
 * 处理顶部菜单搜索
 */
const handleTopMenuSearch = (keyword: string) => {
  // 搜索逻辑已在菜单组件内部处理
}

/**
 * 处理通知点击
 */
const handleNotificationClick = () => {
  message.info('通知功能待开发')
}

/**
 * 处理用户菜单点击
 */
const handleUserMenuClick = (info: { key: string }) => {
  switch (info.key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

/**
 * 退出登录
 */
const handleLogout = async () => {
  try {
    await authStore.logout()
    message.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    message.error('退出登录失败')
  }
}

// 生命周期
onMounted(async () => {
  // 初始化菜单数据
  try {
    await menuStore.initializeMenus()
  } catch (error) {
    console.error('初始化菜单失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.layout {
  &--top-menu {
    .layout-header {
      position: sticky;
      top: 0;
      z-index: 100;
    }
  }
}

.layout-header {
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #f0f0f0;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 64px;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.layout-sider {
  :deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.layout-content {
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
  
  .content-wrapper {
    padding: 24px;
    min-height: 100%;
  }
  
  .page-content {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-height: calc(100vh - 200px);
  }
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #1890ff;
    background-color: rgba(0, 0, 0, 0.025);
  }
}

.breadcrumb-wrapper {
  .ant-breadcrumb {
    font-size: 14px;
    
    :deep(.ant-breadcrumb-link) {
      color: #666;
      text-decoration: none;
      
      &:hover {
        color: #1890ff;
      }
    }
    
    :deep(.ant-breadcrumb-separator) {
      color: #999;
    }
  }
}

.header-notification {
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

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  height: 40px;
  border-radius: 20px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  .user-name {
    font-size: 14px;
    color: #333;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .user-arrow {
    font-size: 12px;
    color: #999;
    transition: transform 0.2s;
  }
}

// 顶部菜单模式样式
.layout--top-menu {
  .layout-content {
    min-height: calc(100vh - 64px);
    
    .breadcrumb-wrapper {
      margin-bottom: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .layout-header {
    .header-content {
      padding: 0 16px;
    }
    
    .user-name {
      display: none;
    }
  }
  
  .layout-content {
    .content-wrapper {
      padding: 16px;
    }
    
    .page-content {
      padding: 16px;
    }
  }
}

@media (max-width: 576px) {
  .breadcrumb-wrapper {
    display: none;
  }
  
  .header-notification {
    display: none;
  }
}

// 底部样式
.layout-footer {
  text-align: center;
  background: #f0f2f5;
  color: #666;
  padding: 24px 0;
  border-top: 1px solid #f0f0f0;
}
</style>