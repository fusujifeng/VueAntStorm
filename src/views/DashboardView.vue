<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>仪表盘</h1>
      <p>欢迎使用 VueAntStorm 组件库管理系统</p>
    </div>
    
    <!-- 统计卡片 -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="总组件数"
            :value="stats.totalComponents"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <appstore-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="今日访问"
            :value="stats.todayVisits"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <eye-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="活跃用户"
            :value="stats.activeUsers"
            :value-style="{ color: '#fa8c16' }"
          >
            <template #prefix>
              <user-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="stat-card">
          <a-statistic
            title="系统状态"
            value="正常"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <check-circle-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 图表和快速操作 -->
    <a-row :gutter="[16, 16]" class="content-row">
      <a-col :xs="24" :lg="16">
        <a-card title="访问趋势" class="chart-card">
          <div class="chart-placeholder">
            <line-chart-outlined style="font-size: 48px; color: #d9d9d9;" />
            <p style="color: #999; margin-top: 16px;">图表组件占位符</p>
            <p style="color: #999; font-size: 12px;">可以集成 ECharts 或其他图表库</p>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="8">
        <a-card title="快速操作" class="quick-actions-card">
          <div class="quick-actions">
            <a-button type="primary" block class="action-btn" @click="goToComponents">
              <appstore-outlined />
              查看组件
            </a-button>
            <a-button block class="action-btn" @click="goToDocs">
              <file-text-outlined />
              查看文档
            </a-button>
            <a-button block class="action-btn">
              <setting-outlined />
              系统设置
            </a-button>
            <a-button block class="action-btn">
              <download-outlined />
              导出数据
            </a-button>
          </div>
        </a-card>
        
        <a-card title="最近活动" class="recent-activity-card" style="margin-top: 16px;">
          <a-timeline size="small">
            <a-timeline-item color="blue">
              <template #dot>
                <clock-circle-outlined style="font-size: 16px;" />
              </template>
              <p>更新了表格组件</p>
              <p style="color: #999; font-size: 12px;">2 小时前</p>
            </a-timeline-item>
            <a-timeline-item color="green">
              <template #dot>
                <check-circle-outlined style="font-size: 16px;" />
              </template>
              <p>发布了新版本 v1.2.0</p>
              <p style="color: #999; font-size: 12px;">1 天前</p>
            </a-timeline-item>
            <a-timeline-item color="red">
              <template #dot>
                <exclamation-circle-outlined style="font-size: 16px;" />
              </template>
              <p>修复了表单验证问题</p>
              <p style="color: #999; font-size: 12px;">3 天前</p>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 组件预览 -->
    <a-row :gutter="[16, 16]" class="preview-row">
      <a-col :xs="24">
        <a-card title="组件预览" class="preview-card">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="component in components" :key="component.name">
              <div class="component-preview" @click="goToComponent(component.path)">
                <div class="component-icon">
                  <component :is="component.icon" />
                </div>
                <h4>{{ component.name }}</h4>
                <p>{{ component.description }}</p>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  AppstoreOutlined,
  EyeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
  FormOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 统计数据
const stats = reactive({
  totalComponents: 24,
  todayVisits: 1234,
  activeUsers: 89,
  systemStatus: '正常'
})

// 组件列表
const components = [
  {
    name: '表格组件',
    description: '功能强大的数据表格',
    icon: TableOutlined,
    path: '/components/table'
  },
  {
    name: '表单组件',
    description: '灵活的表单构建器',
    icon: FormOutlined,
    path: '/components/form'
  },
  {
    name: '图表组件',
    description: '丰富的数据可视化',
    icon: BarChartOutlined,
    path: '/components/charts'
  },
  {
    name: '更多组件',
    description: '持续更新中...',
    icon: AppstoreOutlined,
    path: '/components'
  }
]

// 导航方法
const goToComponents = () => {
  router.push('/components/table')
}

const goToDocs = () => {
  router.push('/docs')
}

const goToComponent = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.dashboard-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.content-row {
  margin-bottom: 24px;
}

.chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  border-radius: 6px;
}

.quick-actions-card,
.recent-activity-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.preview-row {
  margin-bottom: 24px;
}

.preview-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.component-preview {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.component-preview:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
}

.component-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 12px;
}

.component-preview h4 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.component-preview p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 24px;
  }
  
  .chart-placeholder {
    height: 200px;
  }
  
  .component-preview {
    height: 120px;
  }
}
</style>