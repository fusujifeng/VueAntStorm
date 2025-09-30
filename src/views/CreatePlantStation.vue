<template>
  <div style="padding: 16px; background: #fff; margin-bottom: 16px;">
    <a-steps
        style="width: 40%"
        :current="current"
        :items="steps"
        class="createPlantStep"
    />
  </div>
  
  <div class="flexWrap46 content-wrap">
    <a-flex vertical class="content">
      <div class="addPlantWrap" v-if="!showSuccessPage">
        <div class="steps-content">
          <a-form
              ref="formRef"
              :model="formState"
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              layout="vertical"
              :scrollToFirstError="true"
          >
            <!-- pageType=1: 手动填写模式 -->
            <template v-if="pageType === 1">
              <!-- 第一步：基本信息 -->
              <template v-if="current === 0">
                <a-form-item label="电站名称" name="name" :rules="[{required: true, message: '请输入电站名称'}]">
                  <a-input v-model:value="formState.name" placeholder="请输入电站名称" />
                </a-form-item>
                
                <a-form-item label="详细地址" name="address">
                  <a-input v-model:value="formState.address" placeholder="请输入详细地址" />
                </a-form-item>
                
                <a-form-item label="省份" name="province">
                  <a-select v-model:value="formState.province" placeholder="请选择省份">
                    <a-select-option value="beijing">北京</a-select-option>
                    <a-select-option value="shanghai">上海</a-select-option>
                    <a-select-option value="guangdong">广东</a-select-option>
                  </a-select>
                </a-form-item>
                
                <a-form-item label="城市" name="city">
                  <a-select v-model:value="formState.city" placeholder="请选择城市">
                    <a-select-option value="city1">城市1</a-select-option>
                    <a-select-option value="city2">城市2</a-select-option>
                  </a-select>
                </a-form-item>
              </template>

              <!-- 第二步：详细信息 -->
              <template v-if="current === 1">
                <a-form-item label="电站类型" name="plant_type" :rules="[{required: true, message: '请选择电站类型'}]">
                  <a-select v-model:value="formState.plant_type" placeholder="请选择电站类型">
                    <a-select-option value="solar">光伏电站</a-select-option>
                    <a-select-option value="wind">风力电站</a-select-option>
                  </a-select>
                </a-form-item>
                
                <a-form-item label="储能功率" name="energy_power">
                  <a-input-number
                      v-model:value="formState.energy_power"
                      addon-after="kW"
                      placeholder="请输入储能功率"
                      style="width: 100%"
                  />
                </a-form-item>
                
                <a-form-item label="储能容量" name="energy_capacity">
                  <a-input-number
                      v-model:value="formState.energy_capacity"
                      addon-after="kWh"
                      placeholder="请输入储能容量"
                      style="width: 100%"
                  />
                </a-form-item>
              </template>

              <!-- 第三步：归属信息 -->
              <template v-if="current === 2">
                <a-form-item label="客户ID" name="customer_id" :rules="[{required: true, message: '请输入客户ID'}]">
                  <a-input v-model:value="formState.customer_id" placeholder="请输入客户ID" />
                </a-form-item>
                
                <a-form-item label="销售负责人ID" name="sale_head_id" :rules="[{required: true, message: '请输入销售负责人ID'}]">
                  <a-input v-model:value="formState.sale_head_id" placeholder="请输入销售负责人ID" />
                </a-form-item>
              </template>
            </template>

            <!-- pageType=2: Excel上传模式 -->
            <template v-else-if="pageType === 2">
              <!-- 第一步：上传Excel文件 -->
              <template v-if="current === 0">
                <div style="text-align: center; padding: 50px;">
                  <div style="margin-bottom: 24px;">
                    <PlusOutlined style="font-size: 48px; color: #d9d9d9;" />
                  </div>
                  <p style="margin-bottom: 16px; color: #666;">请选择或拖拽文件上传</p>
                  <a-button type="primary" @click="showUploadModal = true">选择文件</a-button>
                </div>
              </template>

              <!-- 第二步：选择电站数据 -->
              <template v-if="current === 1">
                <div style="display: flex; gap: 24px; height: 500px;">
                  <!-- 左侧：上传的数据列表 -->
                  <div style="flex: 1; border: 1px solid #d9d9d9; border-radius: 6px; padding: 16px; overflow-y: auto;">
                    <div class="data-list-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                      <h4 style="margin: 0;">电站数据列表</h4>
                      <a-button type="primary" size="small" @click="showAddFileModal = true">
                        <PlusOutlined />
                        添加文件
                      </a-button>
                    </div>
                    <div v-if="uploadedData.length === 0" style="text-align: center; color: #999; padding: 50px;">
                      暂无数据，请先上传Excel文件
                    </div>
                    <div 
                      v-for="(item, index) in uploadedData" 
                      :key="index"
                      :class="['data-item', { 'selected': selectedDataIndex === index }]"
                      @click="selectDataItem(index)"
                      style="padding: 12px; margin-bottom: 8px; border: 1px solid #d9d9d9; border-radius: 4px; cursor: pointer; transition: all 0.3s;"
                    >
                      <div class="data-item-content" style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="data-item-info">
                          <div style="font-weight: bold; margin-bottom: 4px;">{{ item.name || '未命名电站' }}</div>
                          <div style="font-size: 12px; color: #666;">
                            <span>类型: {{ item.plant_type || '未设置' }}</span>
                            <span style="margin-left: 16px;">地址: {{ item.address || '未设置' }}</span>
                          </div>
                        </div>
                        <a-button type="text" danger size="small" @click.stop="removeDataItem(index)">
                          <DeleteOutlined />
                        </a-button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 右侧：表单标签页 -->
                  <div style="flex: 1; border: 1px solid #d9d9d9; border-radius: 6px; padding: 16px; overflow-y: auto;">
                    <h4 style="margin-bottom: 16px;">电站信息</h4>
                    <div v-if="selectedDataIndex === -1" style="text-align: center; color: #999; padding: 50px;">
                      请选择左侧的电站数据进行编辑
                    </div>
                    <div v-else>
                      <a-tabs v-model:activeKey="currentTab" type="card">
                        <a-tab-pane key="basic" tab="基本信息">
                          <a-form layout="vertical">
                            <a-form-item label="电站名称">
                              <a-input v-model:value="formState.name" placeholder="请输入电站名称" />
                            </a-form-item>
                            
                            <a-form-item label="详细地址">
                              <a-input v-model:value="formState.address" placeholder="请输入详细地址" />
                            </a-form-item>
                            
                            <a-form-item label="省份">
                              <a-select v-model:value="formState.province" placeholder="请选择省份">
                                <a-select-option value="beijing">北京</a-select-option>
                                <a-select-option value="shanghai">上海</a-select-option>
                                <a-select-option value="guangdong">广东</a-select-option>
                              </a-select>
                            </a-form-item>
                            
                            <a-form-item label="城市">
                              <a-select v-model:value="formState.city" placeholder="请选择城市">
                                <a-select-option value="city1">城市1</a-select-option>
                                <a-select-option value="city2">城市2</a-select-option>
                              </a-select>
                            </a-form-item>
                          </a-form>
                        </a-tab-pane>
                        
                        <a-tab-pane key="detail" tab="详细信息">
                          <a-form layout="vertical">
                            <a-form-item label="电站类型">
                              <a-select v-model:value="formState.plant_type" placeholder="请选择电站类型">
                                <a-select-option value="solar">光伏电站</a-select-option>
                                <a-select-option value="wind">风力电站</a-select-option>
                              </a-select>
                            </a-form-item>
                            
                            <a-form-item label="储能功率">
                              <a-input-number
                                  v-model:value="formState.energy_power"
                                  addon-after="kW"
                                  placeholder="请输入储能功率"
                                  style="width: 100%"
                              />
                            </a-form-item>
                            
                            <a-form-item label="储能容量">
                              <a-input-number
                                  v-model:value="formState.energy_capacity"
                                  addon-after="kWh"
                                  placeholder="请输入储能容量"
                                  style="width: 100%"
                              />
                            </a-form-item>
                          </a-form>
                        </a-tab-pane>
                        
                        <a-tab-pane key="ownership" tab="归属信息">
                          <a-form layout="vertical">
                            <a-form-item label="客户ID">
                              <a-input v-model:value="formState.customer_id" placeholder="请输入客户ID" />
                            </a-form-item>
                            
                            <a-form-item label="销售负责人ID">
                              <a-input v-model:value="formState.sale_head_id" placeholder="请输入销售负责人ID" />
                            </a-form-item>
                          </a-form>
                        </a-tab-pane>
                      </a-tabs>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 第三步：确认电站信息 - 移除，因为现在只有两步 -->
            </template>
          </a-form>
        </div>
        
        <!-- 底部按钮 -->
        <a-row justify="end" style="margin: 15px">
          <a-button v-if="current > 0 || (pageType === 2 && current === 1 && currentTab !== 'basic')" @click="prev">
            上一步
          </a-button>
          <a-button 
            v-if="(pageType === 1 && current < steps.length - 1) || (pageType === 2 && current === 0 && hasUploadedFile) || (pageType === 2 && current === 1 && currentTab !== 'ownership')" 
            type="primary" 
            @click="next"
            style="margin-left: 8px"
          >
            下一步
          </a-button>
          <a-button 
             v-if="(pageType === 1 && current === steps.length - 1) || (pageType === 2 && current === 1 && currentTab === 'ownership')" 
             type="primary" 
             @click="done"
             style="margin-left: 8px"
           >
             创建电站
          </a-button>
        </a-row>
      </div>

      <!-- 成功页面 -->
      <div v-else class="success-page" style="text-align: center; padding: 50px;">
        <CheckCircleOutlined style="font-size: 64px; color: #52c41a; margin-bottom: 16px;" />
        <h2>电站创建成功！</h2>
        <p>电站ID: {{ plantId }}</p>
        <a-button type="primary" @click="goBack">返回电站管理</a-button>
      </div>
    </a-flex>

    <!-- Excel上传弹窗 -->
    <a-modal
      v-model:open="showUploadModal"
      title="上传电站文件"
      :footer="null"
      width="500px"
    >
      <a-upload-dragger
        name="file"
        :multiple="false"
        accept=".xlsx,.xls"
        :before-upload="handleFileUpload"
        :show-upload-list="false"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">
          支持单个文件上传，仅支持 .xlsx 和 .xls 格式
        </p>
      </a-upload-dragger>
    </a-modal>

    <!-- 添加文件弹窗 -->
    <a-modal
      v-model:open="showAddFileModal"
      title="添加电站文件"
      :footer="null"
      width="500px"
    >
      <a-upload-dragger
        name="file"
        :multiple="false"
        accept=".xlsx,.xls"
        :before-upload="handleAddFile"
        :show-upload-list="false"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p class="ant-upload-hint">
          支持单个文件上传，仅支持 .xlsx 和 .xls 格式
        </p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleOutlined, PlusOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()

// 表单数据接口
interface FormState {
  name: string
  address: string
  province: string
  city: string
  plant_type: string
  energy_power: number | null
  energy_capacity: number | null
  customer_id: string
  sale_head_id: string
}

// 响应式数据
const pageType = ref(2) // 1: 手动填写模式, 2: Excel上传模式
const current = ref(0)
const showSuccessPage = ref(false)
const plantId = ref('')
const formRef = ref()
const showUploadModal = ref(false)
const showAddFileModal = ref(false)
const hasUploadedFile = ref(false) // 标记是否已上传文件
const uploadedData = ref<FormState[]>([]) // 存储从Excel解析的数据
const selectedDataIndex = ref(-1) // 当前选中的数据项索引

// 当前标签页（仅在Excel上传模式的第二步使用）
const currentTab = ref('basic')

// 表单数据
const formState = ref<FormState>({
  name: '',
  address: '',
  province: '',
  city: '',
  plant_type: '',
  energy_power: null,
  energy_capacity: null,
  customer_id: '',
  sale_head_id: ''
})

// 步骤配置
const steps = computed(() => {
  if (pageType.value === 1) {
    // 手动填写模式的步骤
    return [
      { title: '基本信息' },
      { title: '详细信息' },
      { title: '归属信息' }
    ]
  } else {
    // Excel上传模式的步骤
    return [
      { title: '上传电站文件' },
      { title: '选择电站数据' }
    ]
  }
})

// 下一步
const next = () => {
  if (pageType.value === 1) {
    // 手动填写模式：步骤间切换
    formRef.value.validateFields().then(() => {
      current.value++
    }).catch((err: any) => {
      console.log('表单验证失败:', err)
    })
  } else {
    // Excel上传模式
    if (current.value === 0) {
      // 第一步到第二步：步骤切换
      current.value++
    } else if (current.value === 1) {
      // 第二步内：标签页切换
      if (currentTab.value === 'basic') {
        currentTab.value = 'detail'
      } else if (currentTab.value === 'detail') {
        currentTab.value = 'ownership'
      } else {
        // 已经是最后一个标签页，完成创建
        handleSubmit()
      }
    }
  }
}

// 上一步
const prev = () => {
  if (pageType.value === 1) {
    // 手动填写模式：步骤间切换
    current.value--
  } else {
    // Excel上传模式
    if (current.value === 1) {
      // 第二步内：标签页切换或返回第一步
      if (currentTab.value === 'ownership') {
        currentTab.value = 'detail'
      } else if (currentTab.value === 'detail') {
        currentTab.value = 'basic'
      } else {
        // 已经是第一个标签页，返回第一步
        current.value--
      }
    } else {
      current.value--
    }
  }
}

// 完成
const done = () => {
  message.success('电站创建成功！')
}

// 返回电站管理
const goBack = () => {
  router.push('/dashboard')
}

// 处理文件上传（第一步）
const handleFileUpload = (file: File) => {
  console.log('上传文件:', file.name)
  
  // 模拟解析Excel文件
  const mockData = [
    {
      name: '山东省某新能源发电站',
      address: '山东省济南市',
      province: 'shandong',
      city: 'jinan',
      plant_type: 'solar',
      energy_power: 50,
      energy_capacity: 100,
      customer_id: 'CUST001',
      sale_head_id: 'SALE001'
    },
    {
      name: '新疆某地科技有限公司光伏发电站',
      address: '新疆乌鲁木齐市',
      province: 'xinjiang',
      city: 'urumqi',
      plant_type: 'solar',
      energy_power: 100,
      energy_capacity: 200,
      customer_id: 'CUST002',
      sale_head_id: 'SALE002'
    },
    {
      name: '成都市某区发电站',
      address: '四川省成都市',
      province: 'sichuan',
      city: 'chengdu',
      plant_type: 'wind',
      energy_power: 75,
      energy_capacity: 150,
      customer_id: 'CUST003',
      sale_head_id: 'SALE003'
    }
  ]
  
  uploadedData.value = mockData
  selectedDataIndex.value = 0
  hasUploadedFile.value = true
  showUploadModal.value = false
  message.success(`文件 ${file.name} 上传成功，解析到 ${mockData.length} 条数据`)
  
  return false // 阻止自动上传
}

// 处理添加文件（第二步中的添加）
const handleAddFile = (file: File) => {
  console.log('添加文件:', file.name)
  
  // 模拟解析Excel文件并添加到列表
  const newData = {
    name: `新电站_${Date.now()}`,
    address: '新地址',
    province: 'beijing',
    city: 'beijing',
    plant_type: 'solar',
    energy_power: 25,
    energy_capacity: 50,
    customer_id: '',
    sale_head_id: ''
  }
  
  uploadedData.value.push(newData)
  showAddFileModal.value = false
  message.success(`文件 ${file.name} 上传成功，已添加到列表`)
  
  return false // 阻止自动上传
}

// 选择数据项
const selectDataItem = (index: number) => {
  selectedDataIndex.value = index
  const selectedData = uploadedData.value[index]
  
  // 填充表单数据
  Object.assign(formState.value, selectedData)
}

// 删除数据项
const removeDataItem = (index: number) => {
  uploadedData.value.splice(index, 1)
  // 如果删除的是当前选中项，重置选中状态
  if (selectedDataIndex.value === index) {
    selectedDataIndex.value = uploadedData.value.length > 0 ? 0 : -1
  } else if (selectedDataIndex.value > index) {
    selectedDataIndex.value--
  }
  message.success('数据项已删除')
}
</script>

<style scoped>
.content-wrap {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.steps-content {
  margin-top: 16px;
  min-height: 400px;
}

.createPlantStep {
  margin-bottom: 24px;
}

.success-page {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Excel上传模式样式 */
.excel-upload-container {
  display: flex;
  gap: 20px;
  height: 500px;
}

.data-list-section {
  flex: 1;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  background: #fafafa;
}

.data-list-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.station-info-section {
  flex: 2;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  background: #fff;
}

.station-info-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.data-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.data-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.data-item.selected {
  border-color: #1890ff;
  background-color: #e6f7ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.data-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.data-list-header h3 {
  margin: 0;
}

.data-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-item-info {
  flex: 1;
}

.data-item-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.data-item-info p {
  margin: 0;
  font-size: 12px;
  color: #8c8c8c;
}

/* 标签页内容样式 */
.ant-tabs-content-holder {
  padding: 16px 0;
}

.ant-form-item {
  margin-bottom: 16px;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .excel-upload-container {
    flex-direction: column;
    height: auto;
  }
  
  .data-list-section,
  .station-info-section {
    flex: none;
  }
  
  .data-list-section {
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>