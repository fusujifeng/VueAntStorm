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
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <dashboard-outlined />
          <span>仪表盘</span>
        </a-menu-item>
        
        <a-menu-item key="deviceInfo">
          <desktop-outlined />
          <span>设备信息</span>
        </a-menu-item>
        
        <a-menu-item key="businessInfo">
          <table-outlined />
          <span>商业信息</span>
        </a-menu-item>
        
        <a-menu-item key="create-plant-station">
          <plus-outlined />
          <span>创建电站</span>
        </a-menu-item>
        
        <a-menu-item key="weather-demo">
          <cloud-outlined />
          <span>天气查询</span>
        </a-menu-item>
        
        <a-menu-item key="modal-demo">
          <table-outlined />
          <span>模态框组件</span>
        </a-menu-item>
        
        <a-menu-item key="composition-api-demo">
          <code-outlined />
          <span>Vue3组合式API</span>
        </a-menu-item>
        
        <a-menu-item key="form-modal-demo">
          <form-outlined />
          <span>表单模态框</span>
        </a-menu-item>
        
        <a-menu-item key="log-index">
          <table-outlined />
          <span>日志列表</span>
        </a-menu-item>

        <a-menu-item key="workorder-index">
          <table-outlined />
          <span>工单管理</span>
        </a-menu-item>
        
        <a-menu-item key="docs">
          <file-text-outlined />
          <span>文档</span>
        </a-menu-item>
      </a-menu>
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
import { ref, computed, watch } from 'vue'
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
  FileTextOutlined,
  DesktopOutlined,
  PlusOutlined,
  CloudOutlined,
  CodeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>([])

// 面包屑导航
const breadcrumbItems = computed(() => {
  const pathArray = route.path.split('/').filter(item => item)
  const breadcrumbs = [{ title: '首页', path: '/' }]

  // 简化的面包屑映射
  const breadcrumbMap: Record<string, string> = {
    dashboard: '仪表盘',
    components: '组件展示',
    table: '表格组件',
    form: '表单组件',
    charts: '图表组件',
    businessInfo: '商业信息',
    'modal-demo': '模态框组件',
    deviceInfo: '设备信息',
    'create-plant-station': '创建电站',
    'weather-demo': '天气查询',
    docs: '文档',
    'workorder-index': '工单管理'
  }

  let currentPath = ''
  pathArray.forEach(path => {
    currentPath += `/${path}`
    const title = breadcrumbMap[path]
    if (title) {
      breadcrumbs.push({ title, path: currentPath })
    }
  })

  return breadcrumbs
})

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  selectedKeys.value = [key]

  // 根据菜单key导航到对应路由
  const routeMap: Record<string, string> = {
    dashboard: '/dashboard',
    table: '/components/table',
    form: '/components/form',
    charts: '/components/charts',
    docs: '/docs',
    businessInfo: '/businessInfo',
    deviceInfo: '/deviceInfo',
    'create-plant-station': '/create-plant-station',
    'custom-steps-demo': '/custom-steps-demo',
    'weather-demo': '/weather-demo',
    'modal-demo': '/modal-demo',
    'composition-api-demo': '/composition-api-demo',
    'form-modal-demo': '/form-modal-demo',
    'log-index': '/log-index',
    'log-add': '/log-add',
    'workorder-index': '/workorder-index',
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
