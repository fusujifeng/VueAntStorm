<template>
  <a-layout style="min-height: 100vh">
    <!-- 左侧菜单 -->
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <h3 style="color: white; text-align: center; margin: 16px 0;">{{ collapsed ? 'VAS' : 'VueAntStorm' }}</h3>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        theme="dark"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>
    
    <a-layout>
      <!-- 顶部导航栏 -->
      <a-layout-header style="background: #fff; padding: 0; box-shadow: 0 1px 4px rgba(0,21,41,.08)">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 24px">
          <div style="display: flex; align-items: center">
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <a-breadcrumb style="margin-left: 16px">
              <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
                {{ item.title }}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          
          <div style="display: flex; align-items: center; gap: 16px">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <user-outlined />
                    个人中心
                  </a-menu-item>
                  <a-menu-item key="settings">
                    <setting-outlined />
                    设置
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <logout-outlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
              <a-avatar style="cursor: pointer">
                <template #icon><user-outlined /></template>
              </a-avatar>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      
      <!-- 中间内容区域 -->
      <a-layout-content style="margin: 24px 16px; padding: 24px; background: #fff; min-height: 280px">
        <router-view />
      </a-layout-content>
      
      <!-- 底部 -->
      <a-layout-footer style="text-align: center">
        VueAntStorm ©2024 Created by Your Team
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TableOutlined,
  FormOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>(['components'])

// 菜单项配置
const menuItems: MenuProps['items'] = [
  {
    key: 'dashboard',
    icon: () => h(DashboardOutlined),
    label: '仪表盘',
    title: '仪表盘'
  },
  {
    key: 'components',
    icon: () => h(TableOutlined),
    label: '组件展示',
    title: '组件展示',
    children: [
      {
        key: 'table',
        label: '表格组件',
        title: '表格组件'
      },
      {
        key: 'form',
        icon: () => h(FormOutlined),
        label: '表单组件',
        title: '表单组件'
      },
      {
        key: 'charts',
        label: '图表组件',
        title: '图表组件'
      }
    ]
  },
  {
    key: 'docs',
    icon: () => h(FileTextOutlined),
    label: '文档',
    title: '文档'
  }
]

// 面包屑导航
const breadcrumbItems = computed(() => {
  const pathArray = route.path.split('/').filter(item => item)
  const breadcrumbs = [{ title: '首页', path: '/' }]
  
  let currentPath = ''
  pathArray.forEach(path => {
    currentPath += `/${path}`
    const menuItem = findMenuItemByKey(path)
    if (menuItem) {
      breadcrumbs.push({ title: menuItem.label || menuItem.title, path: currentPath })
    }
  })
  
  return breadcrumbs
})

// 查找菜单项
function findMenuItemByKey(key: string): any {
  function search(items: any[]): any {
    for (const item of items) {
      if (item.key === key) return item
      if (item.children) {
        const found = search(item.children)
        if (found) return found
      }
    }
    return null
  }
  return search(menuItems as any[])
}

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  selectedKeys.value = [key]
  
  // 根据菜单key导航到对应路由
  const routeMap: Record<string, string> = {
    dashboard: '/dashboard',
    table: '/components/table',
    form: '/components/form',
    charts: '/components/charts',
    docs: '/docs'
  }
  
  const targetRoute = routeMap[key]
  if (targetRoute && route.path !== targetRoute) {
    router.push(targetRoute)
  }
}

// 退出登录
const handleLogout = () => {
  // 这里可以添加退出登录的逻辑
  router.push('/login')
}

// 监听路由变化更新选中的菜单
watch(
  () => route.path,
  (newPath) => {
    const pathSegments = newPath.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      selectedKeys.value = [lastSegment]
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  border-radius: 6px;
}
</style>