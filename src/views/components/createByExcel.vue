<template>

  <ContentHeader has-return>
    <template #tabs>
      <a-steps
          style="width: 40%"
          :current="current"
          :items="items"
          class="createPlantStep"
      ></a-steps>
    </template>
  </ContentHeader>
  <div class="flexWrap46 content-wrap">
    <a-flex
        vertical
        class="content"
    >
      <div
          class="addPlantWrap"
          v-if="!showSuccessPage"
      >






        <div class="steps-content" v-if="pageType === 1">
          <a-form
              ref="formRef"
              :model="formState"
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              layout="vertical"
              :scrollToFirstError="true"
          >
<!--            录入基本信息-->
            <template v-if="current === 0">

              <a-form-item
                  :label="$t('etoName')" required>
                <a-input
                    v-model:value="formState.eto_name"
                    :placeholder="
         $t('pleaseEnter', {
          name: $t('eto_name')
         })
        "
                ></a-input>
              </a-form-item>

              <a-form-item
                  :label="$t('plantName')"
                  name="name"
                  :rules="[
        {
         required: true,
         message: $t('pleaseEnter', {
          name: $t('plantName')
         })
        },
        {
         pattern: new RegExp(validator.regExp.plantName),
         message: t('plantNameCheck', {
          name: t('plantName'),
          min: 2,
          max: 64
         })
        }
       ]"
              >
                <a-input
                    v-model:value="formState.name"
                    :placeholder="
         $t('pleaseEnter', { name: $t('plantName') })
        "
                ></a-input>
              </a-form-item>

              <a-form-item
                  :label="$t('selectTimezone')"
                  name="timezone"
                  :rules="[
        { required: true, message: $t('pleaseSelect') }
       ]"
              >
                <my-select
                    v-model:value="formState.timezone"
                    :placeholder="
         $t('pleaseSelect', {
          name: $t('selectTimezone')
         })
        "
                >
                  <a-select-option value="Asia/Chongqing">
                    北京，重庆，香港特别行政区，乌鲁木齐
                  </a-select-option>
                </my-select>
              </a-form-item>
              <MapContainerIframe
                  v-model="formState.address"
                  v-model:longitude="formState.longitude"
                  v-model:latitude="formState.latitude"
                  v-model:province="formState.province"
                  v-model:city="formState.city"
                  v-model:county="formState.county"
                  v-model:mapRegion="mapRegion"
                  :formRef="formRef"
              />

<!--              所属组织id（归属服务战区）-->
              <a-form-item
                  :label="$t('org_id_service')"
                  name="region"
                  style="margin-top: 16px"
                  required
              >
                <my-select
                    v-model:value="formState.region"
                    :placeholder="
         $t('pleaseSelect', { name: $t('region') })
        "
                >
                  <a-select-option
                      v-for="item in regionDict?.children"
                      :key="item.id"
                      :value="item.value"
                  >
                    {{ item.name['zh-Hans'] }}
                  </a-select-option>
                </my-select>

              </a-form-item>
            </template>
<!--            录入详细信息-->
            <template v-if="current === 1">

              <a-form-item :label="$t('plantType')"
                  name="plant_type"
                  required
              >
                <my-select
                    placeholder="pleaseSelect"
                    v-model:value="formState.plant_type"
                >
                  <a-select-option
                      v-for="item in applicationTypeDict?.children"
                      :key="item.id"
                      :value="item.value"
                  >
                    {{ item.name['zh-Hans'] }}
                  </a-select-option>
                </my-select>
              </a-form-item>
              <a-form-item :label="$t('useType')"
                  name="use_type"
                  required
              >
<!--                应用类型-->
                <my-select
                    width="400"
                    v-model:value="formState.use_type"
                    :placeholder="$t('pleaseSelect')"
                >
                  <a-select-option
                      v-for="item in applicationTypeDict?.children"
                      :key="item.id"
                      :value="item.value"
                  >
                    {{ item.name['zh-Hans'] }}
                  </a-select-option>
                </my-select>
              </a-form-item>

              <a-form-item
                  :label="$t('energy_power')"
                  name="energy_power"
                  :rules="[
              {required:true},
        {
         type: 'number',
         min: 0,
         max: 10000000,
         message: $t('rangeCheck', {
          name: $t('energy_power'),
          min: 0,
          max: 10000000
         })
        }
       ]"
              >
                <a-input-number
                    :controls="false"
                    v-model:value="formState.energy_power"
                    addon-after="kW"
                    :placeholder="
         $t('pleaseEnter', { name: $t('energy_power') })
        "
                />
              </a-form-item>
              <a-form-item
                  :label="$t('energy_capacity')"
                  name="energy_capacity"
                  :rules="[
                      {required:true},
        {
         type: 'number',
         min: 0,
         max: 10000000,
         message: $t('rangeCheck', {
          name: $t('energy_capacity'),
          min: 0,
          max: 10000000
         })
        }
       ]"
              >
                <a-input-number
                    :controls="false"
                    v-model:value="formState.energy_capacity"
                    addon-after="kWh"
                    :placeholder="
         $t('pleaseEnter', {
          name: $t('energy_capacity')
         })
        "
                />
              </a-form-item>
              <a-form-item :label="$t('device_model')"
                           name="sale_device_model"
                           :rules="[
                      {required:true}
                      ]"
                           >
              <a-space
                  v-for="(item, index) in formState.sale_device_model"
                  :key="item.model"
                  style="display: flex; margin-bottom: 8px"
                  align="baseline"
              >
                <a-form-item
                    :name="['sale_device_model', index, 'model']"
                    :rules="{
                     required: true,
                     message: $t('pleaseSelect')
        }"
                >
                  <a-select
                      v-model:value="item.model"
                      :options="deviceTypeSelectList"
                      :field-names="{ label: 'model', value: 'model' }"
                      style="width: 180px"
                      label-field="model"
                      value-field="model"
                  >
                  </a-select>
                </a-form-item>
                <a-form-item
                    :name="['sale_device_model', index, 'count']"
                    :rules="{
                    required: true,
                    message: $t('pleaseSelect')

        }"
                >
                  <a-input-number v-model:value="item.count" addon-after="台"/>
                </a-form-item>
                <MinusCircleOutlined @click="removeItem(item)" />
              </a-space>
              </a-form-item>
              <a-form-item>
                <a-button type="dashed" block @click="addItem">
                  <PlusOutlined />
                  Add model
                </a-button>
              </a-form-item>
            </template>
<!--            录入归属信息-->
            <template v-if="current === 2">
              <a-form-item
                  :label="$t('customerId')"
                  :rules="[
                      {required:true}
                      ]"
              >
                <a-input
                    v-model:value="formState.customer_id"
                    :placeholder="
         $t('pleaseEnter', {
          name: $t('eto_name')
         })
        "
                ></a-input>
              </a-form-item>
              <a-form-item
                  :label="$t('saleHeadId')"
                  :rules="[
                      {required:true}
                      ]"
              >
                <a-input
                    v-model:value="formState.sale_head_id"
                    :placeholder="
         $t('pleaseEnter', {
          name: $t('eto_name')
         })
        "
                ></a-input>
              </a-form-item>
              <a-form-item
                  :label="$t('expandHeadId')"
                  required
              >
                <a-input
                    v-model:value="formState.expand_head_id"
                    :placeholder="
         $t('pleaseEnter', {
          name: $t('eto_name')
         })
        "
                ></a-input>
              </a-form-item>
              <a-form-item
                  :label="$t('serveHeadId')"
                  :rules="[
                      {required:true}
                      ]"
              >
                <a-input
                    v-model:value="formState.serve_head_id"
                    :placeholder="
         $t('pleaseEnter', {
          name: $t('eto_name')
         })
        "
                ></a-input>
              </a-form-item>
            </template>
          </a-form>
        </div>
        <a-row justify="end" style="margin:0 15px 15px 15px" class="btnGroups">
          <a-button
              v-if="Number(current) > 0"
              @click="prev"
          >
            {{ $t('prevStep') }}
          </a-button>
          <a-button
              class="mgl8"
              v-if="current < steps.length - 1"
              :disabled="imgStatus === 'uploading'"
              type="primary"
              @click="next"
          >
            {{ $t('nextStep') }}
          </a-button>
          <a-button
              class="mgl8"
              v-if="current == steps.length - 1"
              type="primary"
              @click="handleSubmit"
          >
            {{ $t('createStation') }}
          </a-button>
        </a-row>
        </a-form>
        </div>

        <!-- Excel上传模式 -->
        <div class="excel-upload-container" v-if="pageType === 2">
          <!-- 第一步：上传文件 -->
          <div v-if="current === 0" class="upload-step">
            <div class="upload-content">
              <div class="upload-area">
                <a-button type="primary" @click="showUploadModal = true">
                  选择文件
                </a-button>
                <p>请选择Excel文件上传</p>
              </div>
            </div>
          </div>

          <!-- 第二步：编辑信息 -->
          <div v-if="current === 1" class="edit-step">
            <div class="data-list-section">
              <div class="data-list-header">
                <h3>数据列表</h3>
                <a-button type="primary" @click="showAddFileModal = true">
                  添加文件
                </a-button>
              </div>
              <div class="data-list">
                <div 
                  v-for="(item, index) in uploadedData" 
                  :key="item.id"
                  :class="['data-item', { active: selectedDataIndex === index }]"
                  @click="selectDataItem(index)"
                >
                  <div class="data-item-content">
                    <div class="data-item-info">
                      <h4>{{ item.name }}</h4>
                      <p>{{ item.eto_name }}</p>
                      <span :class="['status', item.status === '已导入电站数据' ? 'imported' : 'pending']">
                        {{ item.status }}
                      </span>
                    </div>
                    <a-button 
                      type="text" 
                      danger 
                      @click.stop="removeDataItem(index)"
                    >
                      删除
                    </a-button>
                  </div>
                </div>
              </div>
            </div>

            <div class="station-info-section">
              <a-tabs v-model:activeKey="currentTab" type="card">
                <a-tab-pane key="basic" tab="基本信息">
                  <a-form
                    ref="formRef"
                    :model="formState"
                    :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }"
                    :colon="false"
                    layout="vertical"
                  >
                    <a-form-item label="ETO名称">
                      <a-input v-model:value="formState.eto_name" placeholder="请输入ETO名称" />
                    </a-form-item>
                    <a-form-item label="电站名称">
                      <a-input v-model:value="formState.name" placeholder="请输入电站名称" />
                    </a-form-item>
                    <a-form-item label="详细地址">
                      <a-input v-model:value="formState.address" placeholder="请输入详细地址" />
                    </a-form-item>
                  </a-form>
                </a-tab-pane>
                
                <a-tab-pane key="detail" tab="详细信息">
                  <a-form
                    ref="formRef"
                    :model="formState"
                    :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }"
                    :colon="false"
                    layout="vertical"
                  >
                    <a-form-item label="储能装机功率">
                      <a-input-number 
                        v-model:value="formState.energy_power" 
                        addon-after="kW"
                        placeholder="请输入储能装机功率" 
                      />
                    </a-form-item>
                    <a-form-item label="储能装机容量">
                      <a-input-number 
                        v-model:value="formState.energy_capacity" 
                        addon-after="kWh"
                        placeholder="请输入储能装机容量" 
                      />
                    </a-form-item>
                  </a-form>
                </a-tab-pane>
                
                <a-tab-pane key="ownership" tab="归属信息">
                  <a-form
                    ref="formRef"
                    :model="formState"
                    :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }"
                    :colon="false"
                    layout="vertical"
                  >
                    <a-form-item label="所属区域">
                      <a-select v-model:value="formState.region" placeholder="请选择所属区域">
                        <a-select-option value="华东">华东</a-select-option>
                        <a-select-option value="华南">华南</a-select-option>
                        <a-select-option value="华北">华北</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-form>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>

          <!-- 按钮区域 -->
          <a-row justify="center" style="margin-top: 24px;">
            <a-button 
              v-if="(pageType === 1 && current > 0) || (pageType === 2 && current === 1 && currentTab !== 'basic')" 
              @click="prev"
            >
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
              @click="handleSubmit"
              style="margin-left: 8px"
            >
              创建电站
            </a-button>
          </a-row>
        </div>

        <!-- Excel上传弹窗 -->
        <a-modal
          v-model:open="showUploadModal"
          title="上传Excel文件"
          width="600px"
          @ok="showUploadModal = false"
        >
          <a-upload-dragger
            name="file"
            :multiple="false"
            accept=".xlsx,.xls"
            :before-upload="handleFileUpload"
            :show-upload-list="false"
          >
            <p class="ant-upload-drag-icon">
              <!-- <InboxOutlined /> -->
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p class="ant-upload-hint">支持单个文件上传，仅支持 .xlsx 和 .xls 格式</p>
          </a-upload-dragger>
        </a-modal>

        <!-- 添加文件弹窗 -->
        <a-modal
          v-model:open="showAddFileModal"
          title="添加文件"
          width="600px"
          @ok="showAddFileModal = false"
        >
          <a-upload-dragger
            name="file"
            :multiple="false"
            accept=".xlsx,.xls"
            :before-upload="handleAddFile"
            :show-upload-list="false"
          >
            <p class="ant-upload-drag-icon">
              <!-- <InboxOutlined /> -->
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p class="ant-upload-hint">支持单个文件上传，仅支持 .xlsx 和 .xls 格式</p>
          </a-upload-dragger>
        </a-modal>
      </div>
      <div
          class="successPage"
          v-else
      >
        <a-flex
            vertical
            align="center"
            :gap="24"
        >
          <StepSuccessIcon />
          <span>{{ $t('createPlantSuccess') }}</span>
          <div>
            <a-button
                class="mgl16"
                @click="$router.push('/plantMgt')"
            >
              {{ $t('backToPlantMgr') }}
            </a-button>
          </div>
        </a-flex>
      </div>
    </a-flex>
  </div>
</template>

<script setup lang="ts">
import { type SelectProps } from 'ant-design-vue'
import { piniaStore } from '@/stores'
import { OrgTypes } from '@/enum'
import StepSuccessIcon from '@/assets/icons/svg/stepSuccessIcon.svg?component'
import type { Rule } from 'ant-design-vue/es/form/interface'
import { regionsArr } from '@/utils/utils'
import { debounce } from 'lodash-es'
import {deviceTypeSelectList} from "@/constants/plantConstants";
const { t } = useI18n()
let lastFetchId = 0
const state = reactive<any>({
  data: [],
  value: undefined
})

let ownerLastFetchId = 0
const ownerState = reactive<any>({
  data: [],
  value: undefined
})


export interface FormState {
  /**
   * 详细地址
   */
  address: string;
  /**
   * 市
   */
  city: string;
  /**
   * 国家
   */
  country: string;
  /**
   * 县区
   */
  county: string;
  /**
   * 客户id
   */
  customer_id: string;
  /**
   * 储能装机容量
   */
  energy_capacity: string;
  /**
   * 储能装机容量单位
   */
  energy_capacity_unit: string;
  /**
   * 储能装机容量
   */
  energy_power: string;
  /**
   * 储能装机容量单位
   */
  energy_power_unit: string;
  /**
   * eto名称
   */
  eto_name: string;
  /**
   * 拓展负责人id
   */
  expand_head_id: string;
  /**
   * 纬度
   */
  latitude: string;
  /**
   * 经度
   */
  longitude: string;
  /**
   * 电站名称
   */
  name: string;
  /**
   * 所属组织编号
   */
  org_code: string;
  /**
   * 所属组织id（归属服务战区）
   */
  region:string
  /**
   * 电站类型
   */
  plant_type: string;
  /**
   * 省
   */
  province: string;
  /**
   * 销售设备型号
   */
  sale_device_model: SaleDeviceModel[];
  /**
   * 销售负责人id
   */
  sale_head_id: string;
  /**
   * 服务负责人id
   */
  serve_head_id: string;
  /**
   * 时区
   */
  timezone: string;
  /**
   * 应用类型
   */
  use_type: string;
  [property: string]: any;
}

export interface SaleDeviceModel {
  /**
   * 数量
   */
  count: number;
  /**
   * 设备型号
   */
  model: string;
  [property: string]: any;
}
const mapRegion = ref('')
const regionOptions = ref<any>([])
watch(
    () => mapRegion.value,
    (newVal) => {
      console.log(112233, newVal)

      formatRegion(newVal)
    }
)
const formatRegion = (province: string) => {
  if (province === '内蒙古自治区') {
    formState.value.region_name = '内蒙古东部地区'
  } else {
    regionOptions.value = regionsArr.filter(
        (item) => item.indexOf(province) > -1
    )

    if (regionOptions.value.length === 1) {
      formState.value.region_name = regionOptions.value[0]
    } else {
      formState.value.region_name = undefined
    }
  }
}

const orgsStore = piniaStore.useOrgsStore
// 页面类型：1-原始模式，2-Excel上传模式
const pageType = ref<number>(2)

const current = ref<number>(0)

// Excel上传模式相关数据
const uploadedData = ref<any[]>([])
const selectedDataIndex = ref<number>(0)
const hasUploadedFile = ref<boolean>(false)
const showUploadModal = ref<boolean>(false)
const showAddFileModal = ref<boolean>(false)
const currentTab = ref<string>('basic')

// Excel上传模式的步骤
const excelSteps = [
  { title: '上传文件' },
  { title: '编辑信息' }
]

let industryMap = ref()
const queryTariffOptions = () => {
  plant
      .getTariffOptions({
        region_name: formState.value.region_name
      })
      .then((res) => {
        let tempIndustryMap = new Map()

        Object.keys(res).forEach((key) => {
          let keysArr = key.split('-')
          let tariffModelMap
          if (tempIndustryMap.has(keysArr[1])) {
            tariffModelMap = tempIndustryMap.get(keysArr[1])
            tariffModelMap.set(keysArr[0], res[key])
          } else {
            tariffModelMap = new Map()
            tariffModelMap.set(keysArr[0], res[key])
          }

          tempIndustryMap.set(keysArr[1], tariffModelMap)
        })
        industryMap.value = tempIndustryMap
        let first = tempIndustryMap.keys().next().value

        formState.value.tariff_industry = first
        formState.value.tariff_model = tempIndustryMap
            .get(first)
            .keys()
            .next().value
        formState.value.tariff_voltage = tempIndustryMap
            .get(first)
            .values()
            .next().value[0]
      })
      .catch((err) => {
        console.log(112233, err)
      })
}

const next = () => {
  document.querySelector('.addPlantWrap')?.scrollTo({ top: 0 })
  
  if (pageType.value === 2) {
    // Excel上传模式的导航逻辑
    if (current.value === 0) {
      // 第一步到第二步
      current.value++
    } else if (current.value === 1) {
      // 第二步内部的标签页切换
      if (currentTab.value === 'basic') {
        currentTab.value = 'detail'
      } else if (currentTab.value === 'detail') {
        currentTab.value = 'ownership'
      }
    }
  } else {
    // 原始模式的导航逻辑
    formRef.value
        .validate()
        .then(() => {
          current.value++
          if (current.value === 1) {
            if (formState.value.region_name) {
              // queryTariffOptions()
            }
            // 查询区域对应的电价选项
          }
        })
        .catch((err: any) => {
          formRef.value.scrollToField(err.errorFields[0].name)
        })
  }
}

const prev = () => {
  document.querySelector('.addPlantWrap')?.scrollTo({ top: 0 })
  
  if (pageType.value === 2) {
    // Excel上传模式的导航逻辑
    if (current.value === 1) {
      // 第二步内部的标签页切换
      if (currentTab.value === 'ownership') {
        currentTab.value = 'detail'
      } else if (currentTab.value === 'detail') {
        currentTab.value = 'basic'
      } else if (currentTab.value === 'basic') {
        // 从第二步回到第一步
        current.value--
      }
    }
  } else {
    // 原始模式的导航逻辑
    current.value--
  }
}
const steps = [
  {
    title: '录入基本信息'
    // description: '详细文案描述内容'
  },
  {
    title: '录入详细信息'
    // description: '详细文案描述内容'
  },
  {
    title: t('inputAttributionInfo')
    // description: '详细文案描述内容'
  }
  // {
  //  title: '电价方案',
  //  description: '详细文案描述内容'
  // }
]

// 根据pageType动态选择步骤
const currentSteps = computed(() => {
  return pageType.value === 2 ? excelSteps : steps
})

const items = computed(() => {
  return currentSteps.value.map((item) => ({
    key: item.title,
    title: item.title
  }))
})

const formRef = ref()
const formState: FormState = ref({
  eto_name:'',
  name: '',
  timezone: '中国',
  country: '中国',
  province: '',
  city: '',
  county: '',
  address: '',
  longitude: 777.43,
  latitude: 888.43,
  region:'',
  plant_type: '大储电站',
  use_type: undefined,
  energy_capacity: undefined,
  energy_capacity_unit:"KW" ,
  energy_power: 5000,
  energy_power_unit: "KW",
  sale_device_model: [ {
    model: "",
    count: undefined
  }],
  customer_id: "1964900024058851328",
  sale_head_id: "1964900024058851328",
  expand_head_id: "1964900024058851328",
  serve_head_id: "1960607213159395328"
})
const imgStatus = ref<string | undefined>('')


const removeItem = (item: any) => {
  const index = formState.value.sale_device_model.indexOf(item);
  if (index !== -1) {
    formState.value.sale_device_model.splice(index, 1);
  }
};
const addItem = () => {
  formState.value.sale_device_model.push({
    model: undefined,
    count: undefined,
  });
};

const investmentDict = ref<Dict>()
const applicationTypeDict = ref<Dict>()
const regionDict = ref<Dict>()
const plantTypeDict = ref<Dict>()
const powerStationTypeDict = ref<Dict>()
const provinceList = ref<any>()
const provinceDict = ref<Dict>()
onMounted(async () => {
  dict.getDicts({
    codes: [
      'applicationType',
      'region',
      'plant_type',

    ]
  }).then((res) => {

    applicationTypeDict.value = res.find((item) => item.code === 'applicationType')
    regionDict.value = res.find((item) => item.code === 'region')
    plantTypeDict.value = res.find((item) => item.code === 'plant_type')


    // provinceDict.value = res.find((item) => item.code === 'province')
    // provinceList.value = provinceDict.value?.children
  })

  if (orgsStore?.orgs?.currentOrg.type === OrgTypes.DEALER) {
    formState.value.org_id = orgsStore.orgs.currentOrg.id
    formState.value.org_code = orgsStore.orgs.currentOrg.code
    formState.value.org_name = orgsStore.orgs.currentOrg.name
    state.value = orgsStore.orgs.currentOrg.name
  } else if (orgsStore?.orgs?.currentOrg.type === OrgTypes.OWNER) {
    formState.value.owner_org_id = orgsStore.orgs.currentOrg.id
    formState.value.owner_org_code = orgsStore.orgs.currentOrg.code
    formState.value.owner_org_name = orgsStore.orgs.currentOrg.name
    ownerState.value = orgsStore.orgs.currentOrg.name
  }
})

const showSuccessPage = ref(false)
const plantId = ref()

// Excel上传模式相关方法
const handleFileUpload = (file: any) => {
  // 模拟解析Excel文件
  const mockData = [
    {
      id: 1,
      name: '山东省某储能电站',
      status: '已导入电站数据',
      eto_name: '某电力科技有限公司',
      address: '山东省济南市历下区',
      energy_power: 5000,
      energy_capacity: 10000
    },
    {
      id: 2,
      name: '江苏省某储能电站',
      status: '未配置电站数据',
      eto_name: '某新能源科技有限公司',
      address: '江苏省南京市鼓楼区',
      energy_power: 3000,
      energy_capacity: 6000
    }
  ]
  
  uploadedData.value = mockData
  selectedDataIndex.value = 0
  hasUploadedFile.value = true
  showUploadModal.value = false
  // message.success('文件上传成功！')
}

const handleAddFile = (file: any) => {
  // 模拟解析新的Excel文件
  const newData = {
    id: uploadedData.value.length + 1,
    name: `新增储能电站${uploadedData.value.length + 1}`,
    status: '未配置电站数据',
    eto_name: '某科技有限公司',
    address: '某省某市某区',
    energy_power: 2000,
    energy_capacity: 4000
  }
  
  uploadedData.value.push(newData)
  showAddFileModal.value = false
  // message.success('文件添加成功！')
}

const removeDataItem = (index: number) => {
  uploadedData.value.splice(index, 1)
  
  // 调整选中索引
  if (selectedDataIndex.value >= uploadedData.value.length) {
    selectedDataIndex.value = Math.max(0, uploadedData.value.length - 1)
  } else if (selectedDataIndex.value > index) {
    selectedDataIndex.value--
  }
  
  // message.success('删除成功！')
}

const selectDataItem = (index: number) => {
  selectedDataIndex.value = index
  // 根据选中的数据更新表单
  const selectedData = uploadedData.value[index]
  if (selectedData) {
    formState.value.name = selectedData.name
    formState.value.eto_name = selectedData.eto_name
    formState.value.address = selectedData.address
    formState.value.energy_power = selectedData.energy_power
    formState.value.energy_capacity = selectedData.energy_capacity
  }
}
  formRef.value.validate().then(() => {
    let data = util.cloneDeep(formState.value)
    // data.parts = formState.value.parts.join(',')
    // data.tech = formState.value.tech.join(',')
    // data.country = 'china'
    // data.district = formState.value.address

    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})

    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})
    plant
        .addPlant(data)
        .then((res) => {
          showSuccessPage.value = true
          plantId.value = res.id
        })
        .catch((err) => {})

  })
}

const router = useRouter()
const addDevice = () => {
  router.push({
    path: `/plantMgt/${plantId.value}/addDevice`,
    query: { from: 'createPlant' }
  })
}
watch(
    () => formState.value.region_name,
    () => {
      // queryTariffOptions()
    }
)
</script>

<style lang="less" scoped>
.successPage {
  height: calc(100% - 56px);
  .ant-flex {
    height: 100%;
    padding-top: 12%;
  }
}
.addPlantWrap {
  position: relative;
  padding: 0;
  height: calc(100% - 1px);

  overflow-y: auto;
  overflow-x: hidden;
  .ant-steps {
    &.createPlantStep {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--Bg);
    }
  }
  .steps-content {
    width: 400px;
    margin: 0 auto;
    padding-bottom: 16px;
    min-height: calc(100% - 144px);
  }
  .ant-form-item {
    &.noMgb {
      margin-bottom: 0px;
    }
  }
  :deep(.ant-input-number-group) {
    .ant-input-number-group-addon {
      width: 60px;
    }
    .ant-input-number {
      width: calc(100% - 60px);
      float: none;
    }
  }
}
.addTplWrap {
  width: 100%;
  .addTplForm {
    width: 400px;
    margin: 0 auto;
    .selectTemplateBtn {
      position: absolute;
      top: -36px;
      right: 0px;
    }
    .gradient {
      width: 100%;
      height: auto;
      background: linear-gradient(
          to bottom,
          rgba(231, 249, 254, 0.3),
          rgba(231, 249, 254, 0.05)
      );
      padding: 20px;
      border: 1px solid var(--InoGray_01);
      .sectionTitleWrap {
        margin-bottom: 16px;
        .sectionTitle {
          color: var(--InoGray_10);
          font-weight: bold;
          display: inline-block;
          line-height: 24px;
        }
      }

      .subTitle {
        color: var(--InoGray_09);
        line-height: 24px;
        margin-bottom: 16px;
        display: inline-block;
      }
      .thirdTitle {
        color: var(--InoGray_08);
        font-size: 12px;
        line-height: 20px;
        display: block;
        margin-bottom: 8px;
      }
      .priceTable {
        :deep(.ant-spin-nested-loading) {
          height: 100%;
          overflow: visible;
          position: hidden;
          .ant-spin-container {
            height: 100%;
            overflow: visible;
          }
        }
        :deep(.ant-table-content) {
          table {
            table-layout: fixed !important;
          }
        }
        :deep(.ant-table-cell) {
          vertical-align: top;
        }
        :deep(.ant-table-small) {
          background-color: transparent;
        }
        :deep(.ant-table-thead) {
          border-radius: 2px;
        }
      }
      :deep(.ant-table-wrapper)
      .ant-table-tbody
      > tr.ant-table-row:hover
      > td {
        background: transparent;
      }
      :deep(.ant-table-wrapper)
      .ant-table-tbody
      > tr
      > td.ant-table-cell-row-hover {
        background: transparent;
      }
      .month {
        width: 28px;
        height: 28px;
        border-radius: 1px;
        background-color: var(--InoGray_01);
        color: var(--InoGray_09);
        font-size: 14px;
        line-height: 28px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        margin-bottom: 16px;
        &:hover {
          background-color: var(--InoGray_02);
        }
        &.selected {
          background-color: var(--Primary_05);
          color: #fff;
          &:hover {
            background-color: #69c5f8;
            color: #fff;
          }
        }
      }
      .ant-table-wrapper {
        .ant-table-thead {
          & > tr {
            & > th {
              font-size: 12px;
              line-height: 24px;
              padding: 6px 12px;
            }
          }
        }
      }
      .ant-table-wrapper {
        .ant-table-tbody {
          & > tr {
            & > td {
              vertical-align: baseline;
              padding: 5px 12px;
              color: var(--InoGray_09);
              .ant-input {
                border-color: var(--InoGray_01);
                background-color: var(--InoGray_01);
                font-size: 12px;
              }
              .ant-picker {
                width: 160px;
                margin-right: 14px;
                background-color: var(--InoGray_01) !important;
                border-color: var(--InoGray_01);
                font-size: 12px;
              }
              .ant-input-number {
                border-color: var(--InoGray_01);
                background-color: var(--InoGray_01);
                .ant-input-number-handler-wrap {
                  display: none;
                }
              }
            }
          }
        }
      }
      :deep(.ant-input-number-group) {
        .ant-input-number-group-addon {
          width: 90px;
        }
        .ant-input-number {
          width: calc(100% - 90px);
        }
      }
    }
    .ant-input-number-group-wrapper {
      width: 100%;
      .ant-input-number-handler-wrap {
        display: none;
      }
    }
  }
}
.helpText {
  margin-top: 8px;
  color: var(--Sub_Yellow_06);
  .anticon {
    font-size: 14px;
  }
/* Excel上传模式样式 */
.excel-upload-container {
  padding: 24px;
  
  .upload-step {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    
    .upload-content {
      text-align: center;
      
      .upload-area {
        padding: 40px;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        background: #fafafa;
        
        p {
          margin-top: 16px;
          color: #666;
        }
      }
    }
  }
  
  .edit-step {
    display: flex;
    gap: 24px;
    min-height: 600px;
    
    .data-list-section {
      flex: 1;
      max-width: 400px;
      
      .data-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
      }
      
      .data-list {
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        max-height: 500px;
        overflow-y: auto;
        
        .data-item {
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background-color: #f5f5f5;
          }
          
          &.active {
            background-color: #e6f7ff;
            border-color: #1890ff;
          }
          
          &:last-child {
            border-bottom: none;
          }
          
          .data-item-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            
            .data-item-info {
              flex: 1;
              
              h4 {
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: 600;
                color: #262626;
              }
              
              p {
                margin: 0 0 8px 0;
                font-size: 12px;
                color: #8c8c8c;
              }
              
              .status {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 4px;
                
                &.imported {
                  background-color: #f6ffed;
                  color: #52c41a;
                  border: 1px solid #b7eb8f;
                }
                
                &.pending {
                  background-color: #fff7e6;
                  color: #fa8c16;
                  border: 1px solid #ffd591;
                }
              }
            }
          }
        }
      }
    }
    
    .station-info-section {
      flex: 2;
      
      .ant-tabs {
        height: 100%;
        
        .ant-tabs-content-holder {
          padding: 16px;
          border: 1px solid #d9d9d9;
          border-radius: 0 0 8px 8px;
          min-height: 400px;
        }
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .excel-upload-container .edit-step {
    flex-direction: column;
    
    .data-list-section {
      max-width: none;
    }
  }
}

</style>