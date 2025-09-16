<template>
  <div class="device-info">
    <!-- 设备卡片区域 -->
    <a-flex vertical gap="8">
      <EditCard title="设备总体情况" :editFunction="()=>{handleEditDevice('string')}" :edit-button-text="$t('edit')">
        <template #content>
          <a-flex justify="start" :gap="48" style="overflow-x: scroll">
            <!--          参数-->
            <a-flex align="center">

              <a-avatar :src="deviceImg" shape="square" style="margin-right: 16px;" :size="80" />
              <div class="  ">
                <h3>组串式IES900-XXX</h3>
                <a-flex gap="0.5" style="margin: 8px 0">
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#F1F4F7" style="font-size:12px; color: #0C172B;border: 1px solid #B1B7C7;border-radius: 4px">非标需求编码</a-tag>
                </a-flex>
                <a-flex class="device-details" gap="3">
                  <span>储能系统</span>|
                  <span>储能系统</span>|
                  <span>运行</span>|
                  <span>一体化储能</span>|
                  <span>运行状态</span>|
                </a-flex>
              </div>
            </a-flex>
            <!--          通讯类型:Mod-->
            <a-flex align="center" style="min-width: 500px">

              <a-avatar :src="BMS_img" shape="square" style="margin-right: 16px;" :size="45" />

              <div class="  ">
                <h3>通讯类型：Modbus-RTU(485) / Modbus-TCP / IEC61850/IEC104</h3>
                <a-flex gap="0.5" style="margin: 8px 0">
                  <a-tag color="#F1F9E6" style="font-size:12px; color: #67B100;border: 1px solid #BEE38A;border-radius: 4px">通讯卡软件版本: Modbus-RTU(485)V1.2.4</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                </a-flex>
                <a-flex class="device-details" gap="3">
                  <span>储能系统</span>|
                  <span>储能系统</span>|
                  <span>运行</span>|
                  <span>一体化储能</span>|
                  <span>运行状态</span>|
                </a-flex>
              </div>
            </a-flex>
            <!--          通讯类型:CAN-->
            <a-flex align="center" class="device-card-content">

              <a-avatar :src="EMS_img" shape="square" style="margin-right: 16px;" :size="45" />

              <div class="  ">
                <h3>通讯类型:CAN</h3>
                <a-flex gap="0.5" style="margin: 8px 0">
                  <a-tag color="#F1F9E6" style="font-size:12px; color: #67B100;border: 1px solid #BEE38A;border-radius: 4px">DI类型：常开</a-tag>
                </a-flex>
                <a-flex class="device-details" gap="3">
                  <span>储能系统</span>|
                </a-flex>
              </div>
            </a-flex>
          </a-flex>

        </template>
      </EditCard>
      <EditCard title="设备总体情况" :editFunction="()=>{handleEditDevice('centralized')}" :edit-button-text="$t('edit')">
        <template #content>
          <a-flex justify="start" :gap="48" style="overflow-x: scroll">
            <!--          参数-->
            <a-flex align="center">

              <a-avatar :src="deviceImg" shape="square" style="margin-right: 16px;" :size="80" />
              <div style="height: 80px">
                <h3>组串式IES900-XXX</h3>
                <a-flex gap="0.5" style="margin: 8px 0">
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                  <a-tag color="#F1F4F7" style="font-size:12px; color: #0C172B;border: 1px solid #B1B7C7;border-radius: 4px">非标需求编码</a-tag>
                </a-flex>
                <a-flex class="device-details" gap="3">
                  <span>储能系统</span>|
                  <span>储能系统</span>|
                  <span>运行</span>|
                  <span>一体化储能</span>|
                  <span>运行状态</span>|
                </a-flex>
              </div>
            </a-flex>
            <!--          通讯类型:Mod-->
            <a-flex align="center" style="min-width: 500px">

              <a-avatar :src="BMS_img" shape="square" style="margin-right: 16px;" :size="45" />

              <div class="  ">
                <h3>通讯类型：Modbus-RTU(485) / Modbus-TCP / IEC61850/IEC104</h3>
                <a-flex gap="0.5" style="margin: 8px 0">
                  <a-tag color="#F1F9E6" style="font-size:12px; color: #67B100;border: 1px solid #BEE38A;border-radius: 4px">通讯卡软件版本: Modbus-RTU(485)V1.2.4</a-tag>
                  <a-tag color="#DEF2FF" style="font-size:12px; color: #0099F2;border: 1px solid #74CEFF;border-radius: 4px">储能系统</a-tag>
                </a-flex>
                <a-flex class="device-details" gap="3">
                  <span>储能系统</span>|
                  <span>储能系统</span>|
                  <span>运行</span>|
                  <span>一体化储能</span>|
                  <span>运行状态</span>|
                </a-flex>
              </div>
            </a-flex>
            <!--          通讯类型:CAN-->
            <a-flex align="center" class="device-card-content">

              <a-avatar :src="EMS_img" shape="square" style="margin-right: 16px;" :size="45" />

              <div class="  ">
                <h3>通讯类型:CAN</h3>
                <a-flex gap="0.5" style="margin: 8px 0">
                  <a-tag color="#F1F9E6" style="font-size:12px; color: #67B100;border: 1px solid #BEE38A;border-radius: 4px">DI类型：常开</a-tag>
                </a-flex>
                <a-flex class="device-details" gap="3">
                  <span>储能系统</span>|
                </a-flex>
              </div>
            </a-flex>
          </a-flex>

        </template>
      </EditCard>
      <!-- 设备列表区域 -->
      <!--      <a-card title="设备列表" :bordered="false">-->
      <!--        &lt;!&ndash; 搜索区域 &ndash;&gt;-->
      <!--        <div class="search-section" style="margin-bottom: 16px;">-->
      <!--          <a-row :gutter="16" align="middle">-->
      <!--            <a-col :span="4">-->
      <!--              <a-input v-model:value="searchForm.deviceName" placeholder="设备名称/设备编号/设备类型/设备型号" allow-clear />-->
      <!--            </a-col>-->
      <!--            <a-col :span="3">-->
      <!--              <a-select v-model:value="searchForm.deviceType" placeholder="设备类型" allow-clear style="width: 100%">-->
      <!--                <a-select-option value="储能系统">储能系统</a-select-option>-->
      <!--                <a-select-option value="逆变器">逆变器</a-select-option>-->
      <!--                <a-select-option value="电池组">电池组</a-select-option>-->
      <!--              </a-select>-->
      <!--            </a-col>-->
      <!--            <a-col :span="2">-->
      <!--              <a-button type="primary" @click="handleSearch">-->
      <!--                搜索-->
      <!--              </a-button>-->
      <!--            </a-col>-->
      <!--            <a-col :span="15" style="text-align: right;">-->
      <!--              <a-space>-->
      <!--                <a-button @click="handleExport">导出设备信息</a-button>-->
      <!--                <a-button @click="handleImport">导入设备信息</a-button>-->
      <!--                <a-button type="primary" @click="showAddModal = true">-->
      <!--                  新增设备-->
      <!--                </a-button>-->
      <!--              </a-space>-->
      <!--            </a-col>-->
      <!--          </a-row>-->
      <!--        </div>-->

      <!--        &lt;!&ndash; 设备列表表格 &ndash;&gt;-->
      <!--        <a-table :columns="columns" :data-source="deviceList" :pagination="pagination" :loading="loading" row-key="id"-->
      <!--                 @change="handleTableChange" :scroll="{ x: 1200 }">-->
      <!--          <template #bodyCell="{ column, record }">-->
      <!--            <template v-if="column.key === 'status'">-->
      <!--              <a-tag :color="getStatusColor(record.status)">-->
      <!--                {{ record.status }}-->
      <!--              </a-tag>-->
      <!--            </template>-->
      <!--            <template v-else-if="column.key === 'protocol'">-->
      <!--              <a-space>-->
      <!--                <a-tag v-for="protocol in record.protocols" :key="protocol" color="blue">-->
      <!--                  {{ protocol }}-->
      <!--                </a-tag>-->
      <!--              </a-space>-->
      <!--            </template>-->
      <!--            <template v-else-if="column.key === 'action'">-->
      <!--              <a-space>-->
      <!--                <a-button type="link" size="small" @click="handleView(record)">-->
      <!--                  详情-->
      <!--                </a-button>-->
      <!--                <a-button type="link" size="small" @click="handleEditRecord(record)">-->
      <!--                  编辑-->
      <!--                </a-button>-->
      <!--              </a-space>-->
      <!--            </template>-->
      <!--          </template>-->
      <!--        </a-table>-->
      <!--      </a-card>-->
      <AdvanceSearch
        v-model="filterParams"
        :filterOptions="filterOptions"
        :filterSearch="filterSearch"
        :reset="reset"
      />
      <my-table
        :dataSource="dataSource"
        :columns="columns"
        class="flex-v-1 mgt8"
        :scroll="{ x: '1160px', y: 'calc(100% - 48px)' }"
        :pagination="false"
      >
        <template #emptyText>
          <EmptyComp></EmptyComp>
        </template>
        <template #bodyCell="{ column, text, record }">
          <template v-if="column?.dataIndex === 'code'">
            <a-flex
              justify="space-between"
              wrap="nowrap"
            >
         <span
           class="cellText link"
           @click="goToDetail(record)"
         >
          {{ record.code }}
         </span>
              <a-tooltip
                :title="
           $t(
            record.star === 2
             ? 'followPlant'
             : 'cancelFollowPlant'
           )
          "
              >
                <StarFilled
                  :class="record.star === 1 && 'star'"
                  @click="followPlant(record)"
                />
              </a-tooltip>
            </a-flex>
          </template>
          <template v-if="column?.dataIndex === 'operation'">
            <a-typography-link @click="goToDetail(record)">
              {{ $t('detail') }}
            </a-typography-link>
            <a-typography-link
              type="danger"
              class="mgl8"
              @click="detail(record.id)"
            >
              {{ $t('delete') }}
            </a-typography-link>
          </template>
        </template>
      </my-table>
      <MyPagination
        v-if="totalNumber > 0"
        v-model:page="reqParams.page"
        v-model:rows="reqParams.rows"
        :total="totalNumber"
      ></MyPagination>
    </a-flex>
    <!-- 编辑设备弹窗 -->
    <a-modal v-model:open="editModalVisible" title="编辑设备信息" width="800px" @ok="handleEditSubmit"
             @cancel="handleEditCancel">
      <a-form ref="editFormRef" :model="editForm" :rules="editFormRules" :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }">
        <a-form-item label="设备编号" name="id">
          <a-input v-model:value="editForm.id" placeholder="请输入设备编号" />
        </a-form-item>

        <a-form-item label="设备型号" name="model">
          <a-input v-model:value="editForm.model" placeholder="请输入设备型号" />
        </a-form-item>

        <a-form-item label="并联类型" name="parallel_type">
          <a-input v-model:value="editForm.parallel_type" placeholder="请输入并联类型" />
        </a-form-item>

        <a-form-item label="并联数量" name="parallel_amount">
          <a-input-number v-model:value="editForm.parallel_amount" placeholder="请输入并联数量" style="width: 100%" />
        </a-form-item>

        <a-form-item label="串联机架数量" name="cascade_rack_amount">
          <a-input-number v-model:value="editForm.cascade_rack_amount" placeholder="请输入串联机架数量" style="width: 100%" />
        </a-form-item>

        <a-form-item label="串联PCS数量" name="cascade_pcs_amount">
          <a-input-number v-model:value="editForm.cascade_pcs_amount" placeholder="请输入串联PCS数量" style="width: 100%" />
        </a-form-item>

        <a-form-item label="串联控制方式" name="cascade_control_way">
          <a-input v-model:value="editForm.cascade_control_way" placeholder="请输入串联控制方式" />
        </a-form-item>

        <a-form-item label="是否有ESGU" name="have_esgu">
          <a-input v-model:value="editForm.have_esgu" placeholder="请输入是否有ESGU" />
        </a-form-item>

        <a-form-item label="非标需求编码" name="non_standard_code">
          <a-input v-model:value="editForm.non_standard_code" placeholder="请输入非标需求编码" />
        </a-form-item>

        <a-form-item label="设备参数文件原始文件名" name="param_file_original_name">
          <a-input v-model:value="editForm.param_file_original_name" placeholder="请输入设备参数文件原始文件名" />
        </a-form-item>

        <a-form-item label="设备参数文件mino对象名" name="param_file_obj_name">
          <a-input v-model:value="editForm.param_file_obj_name" placeholder="请输入设备参数文件mino对象名" />
        </a-form-item>

        <a-form-item label="EMS通讯类型" name="ems_comm_type">
          <a-input v-model:value="editForm.ems_comm_type" placeholder="请输入EMS通讯类型" />
        </a-form-item>

        <a-form-item label="通讯配置文件原始文件名" name="comm_file_original_name">
          <a-input v-model:value="editForm.comm_file_original_name" placeholder="请输入通讯配置文件原始文件名" />
        </a-form-item>

        <a-form-item label="通讯配置文件mino对象名" name="comm_file_obj_name">
          <a-input v-model:value="editForm.comm_file_obj_name" placeholder="请输入通讯配置文件mino对象名" />
        </a-form-item>

        <a-form-item label="通讯卡版本" name="comm_card_version">
          <a-input v-model:value="editForm.comm_card_version" placeholder="请输入通讯卡版本" />
        </a-form-item>

        <a-form-item label="BMS通信类型" name="bms_comm_type">
          <a-input v-model:value="editForm.bms_comm_type" placeholder="请输入BMS通信类型" />
        </a-form-item>

        <a-form-item label="BMS DI类型" name="bms_di_type">
          <a-input v-model:value="editForm.bms_di_type" placeholder="请输入BMS DI类型" />
        </a-form-item>

        <a-form-item label="BMS DI设备" name="bms_di_device">
          <a-input v-model:value="editForm.bms_di_device" placeholder="请输入BMS DI设备" />
        </a-form-item>

        <a-form-item label="设备总数量" name="device_count">
          <a-input-number v-model:value="editForm.device_count" placeholder="请输入设备总数量" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 设备详情弹窗 -->
    <a-modal v-model:open="detailModalVisible" title="设备信息详情-设备详情" width="600px" :footer="null">
      <div class="device-detail-content">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="设备编号">
            {{ deviceDetail.code || 'OOES900-XXX' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备型号">
            {{ deviceDetail.model || 'PCS设备' }}
          </a-descriptions-item>
          <a-descriptions-item label="设备类型">
            {{ deviceDetail.type || '' }}
          </a-descriptions-item>
          <a-descriptions-item label="序列号">
            {{ deviceDetail.sn || 'D1900094ESC700013' }}
          </a-descriptions-item>
          <a-descriptions-item label="软件版本">
            <div>
              <div>主ARM: {{ deviceDetail.arm_version_main || 'XXXXXXX' }}</div>
              <div>辅ARM: {{ deviceDetail.arm_version_assist || 'XXXXXXX' }}</div>
              <div>FPGA: {{ deviceDetail.fpga_version || 'XXXXXXX' }}</div>
              <div>菜单版本: {{ deviceDetail.menu_version || 'XXXXXXX' }}</div>
              <div>HMI: {{ deviceDetail.hmi_version || 'XXXXXXX' }}</div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="关键器件">
            <div v-if="deviceDetail.key_part && deviceDetail.key_part.length > 0">
              <div v-for="(part, index) in deviceDetail.key_part" :key="index">
                IGBT-{{ part.name || 'XXXXXXX' }}
              </div>
            </div>
            <div v-else>
              <div>IGBT-XXXXXXX</div>
              <div>IGBT-XXXXXXX</div>
              <div>IGBT-XXXXXXX</div>
              <div>IGBT-XXXXXXX</div>
              <div>IGBT-XXXXXXX</div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="批次配置">
            {{ deviceDetail.is_batch_conf || '' }}
          </a-descriptions-item>
          <a-descriptions-item label="IP地址">
            {{ deviceDetail.ip_address || '' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>

    <!-- 设备记录编辑弹窗 -->
    <a-modal v-model:open="recordEditModalVisible" title="设备信息编辑-设备详情" width="600px" @ok="handleRecordEditSubmit"
             @cancel="handleRecordEditCancel">
      <a-form ref="recordEditFormRef" :model="recordEditForm" :rules="recordEditFormRules" :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }">
        <a-form-item label="设备编号" name="code">
          <a-input v-model:value="recordEditForm.code" placeholder="请输入设备编号" />
        </a-form-item>

        <a-form-item label="设备型号" name="model">
          <a-input v-model:value="recordEditForm.model" placeholder="请输入设备型号" />
        </a-form-item>

        <a-form-item label="设备类型" name="type">
          <a-input v-model:value="recordEditForm.type" placeholder="请输入设备类型" />
        </a-form-item>

        <a-form-item label="序列号" name="sn">
          <a-input v-model:value="recordEditForm.sn" placeholder="请输入序列号" />
        </a-form-item>

        <a-form-item label="主ARM版本" name="arm_version_main">
          <a-input v-model:value="recordEditForm.arm_version_main" placeholder="请输入主ARM版本" />
        </a-form-item>

        <a-form-item label="辅ARM版本" name="arm_version_assist">
          <a-input v-model:value="recordEditForm.arm_version_assist" placeholder="请输入辅ARM版本" />
        </a-form-item>

        <a-form-item label="FPGA版本" name="fpga_version">
          <a-input v-model:value="recordEditForm.fpga_version" placeholder="请输入FPGA版本" />
        </a-form-item>

        <a-form-item label="菜单版本" name="menu_version">
          <a-input v-model:value="recordEditForm.menu_version" placeholder="请输入菜单版本" />
        </a-form-item>

        <a-form-item label="HMI版本" name="hmi_version">
          <a-input v-model:value="recordEditForm.hmi_version" placeholder="请输入HMI版本" />
        </a-form-item>

        <a-form-item label="关键器件" name="key_part_names">
          <a-textarea v-model:value="recordEditForm.key_part_names" placeholder="请输入关键器件名称，多个用换行分隔" :rows="3" />
        </a-form-item>

        <a-form-item label="批次配置" name="is_batch_conf">
          <a-input v-model:value="recordEditForm.is_batch_conf" placeholder="请输入批次配置" />
        </a-form-item>

        <a-form-item label="IP地址" name="ip_address">
          <a-input v-model:value="recordEditForm.ip_address" placeholder="请输入IP地址" />
        </a-form-item>
      </a-form>
    </a-modal>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { DesktopOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import EditCard from "@/components/EditCard.vue";
import deviceImg from "@/assets/images/plant/deviceImg.png"
import BMS_img from "@/assets/images/plant/BMS_img.png"
import EMS_img from "@/assets/images/plant/EMS_img.png"
// import {useResetableRef} from "@/hooks/useResetable";
const { t } = useI18n()
// 响应式数据
const loading = ref(false);
const showAddModal = ref(false);
const editingDevice = ref(null);
const deviceFormRef = ref();

// 响应式数据
const searchForm = reactive({
  deviceName: '',
  deviceType: ''
});

// 编辑弹窗相关
const editModalVisible = ref(false);
const editFormRef = ref<FormInstance>();

// 设备记录编辑弹窗相关
const recordEditModalVisible = ref(false);
const recordEditFormRef = ref<FormInstance>();

// 设备详情弹窗相关
const detailModalVisible = ref(false);
const deviceDetail = reactive({
  id: '',
  code: '',
  model: '',
  type: '',
  sn: '',
  arm_version_main: '',
  arm_version_assist: '',
  fpga_version: '',
  menu_version: '',
  hmi_version: '',
  key_part: [],
  is_batch_conf: '',
  ip_address: ''
});

// 设备记录编辑表单
const recordEditForm = reactive({
  id: '',
  code: '',
  model: '',
  type: '',
  sn: '',
  arm_version_main: '',
  arm_version_assist: '',
  fpga_version: '',
  menu_version: '',
  hmi_version: '',
  key_part_names: '',
  is_batch_conf: '',
  ip_address: ''
});

const recordEditFormRules = {
  code: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  type: [{ required: true, message: '请输入设备类型', trigger: 'blur' }],
  sn: [{ required: true, message: '请输入序列号', trigger: 'blur' }]
};
const editForm = reactive({
  id: '',
  model: '',
  parallel_type: '',
  parallel_amount: null,
  cascade_rack_amount: null,
  cascade_pcs_amount: null,
  cascade_control_way: '',
  have_esgu: '',
  non_standard_code: '',
  param_file_original_name: '',
  param_file_obj_name: '',
  ems_comm_type: '',
  comm_file_original_name: '',
  comm_file_obj_name: '',
  comm_card_version: '',
  bms_comm_type: '',
  bms_di_type: '',
  bms_di_device: '',
  device_count: null
});

const editFormRules = {
  id: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  parallel_type: [{ required: true, message: '请输入并联类型', trigger: 'blur' }],
  have_esgu: [{ required: true, message: '请输入是否有ESGU', trigger: 'blur' }],
  ems_comm_type: [{ required: true, message: '请输入EMS通讯类型', trigger: 'blur' }]
};

// 设备表单
const deviceForm = reactive({
  deviceName: '',
  deviceType: '',
  deviceCode: '',
  status: '',
  location: '',
  installDate: null,
  description: ''
});

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 15,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
});



// 表格列定义
const columns = [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    width: 180,
    fixed: 'left'
  },
  {
    title: '设备编号',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
    width: 120
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    key: 'deviceType',
    width: 100
  },
  {
    title: '设备型号',
    dataIndex: 'deviceModel',
    key: 'deviceModel',
    width: 120
  },
  {
    title: '运行状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '容量/功率',
    dataIndex: 'capacity',
    key: 'capacity',
    width: 120
  },
  {
    title: '额定电压',
    dataIndex: 'voltage',
    key: 'voltage',
    width: 100
  },
  {
    title: '额定电流',
    dataIndex: 'current',
    key: 'current',
    width: 100
  },
  {
    title: '通讯协议',
    key: 'protocol',
    width: 150
  },
  {
    title: '安装位置',
    dataIndex: 'location',
    key: 'location',
    width: 120
  },
  {
    title: '安装日期',
    dataIndex: 'installDate',
    key: 'installDate',
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right'
  }
];

// 处理函数
const handleSearch = () => {
  console.log('搜索', searchForm);
};

const handleExport = () => {
  message.success('导出功能开发中');
};

const handleImport = () => {
  message.success('导入功能开发中');
};

const handleView = (record: any) => {
  console.log('查看详情', record);
  // 加载设备详情数据
  Object.assign(deviceDetail, {
    id: record.id || '',
    code: record.deviceCode || 'OOES900-XXX',
    model: record.deviceModel || 'PCS设备',
    type: record.deviceType || '',
    sn: record.sn || 'D1900094ESC700013',
    arm_version_main: record.arm_version_main || 'XXXXXXX',
    arm_version_assist: record.arm_version_assist || 'XXXXXXX',
    fpga_version: record.fpga_version || 'XXXXXXX',
    menu_version: record.menu_version || 'XXXXXXX',
    hmi_version: record.hmi_version || 'XXXXXXX',
    key_part: record.key_part || [],
    is_batch_conf: record.is_batch_conf || '',
    ip_address: record.ip_address || ''
  });
  detailModalVisible.value = true;
};

const handleEditDevice = (type: string) => {
  console.log('编辑设备', type);
  editModalVisible.value = true;
  // 这里可以根据type加载不同的设备数据
  if (type === 'centralized') {
    // 加载集中式设备数据
    Object.assign(editForm, {
      id: 'CENTRAL-001',
      model: 'ES5900-XXX',
      parallel_type: 'Modbus-RTU(485)',
      parallel_amount: 1,
      cascade_rack_amount: 2,
      cascade_pcs_amount: 1,
      cascade_control_way: 'Modbus-Led',
      have_esgu: 'ABC123',
      non_standard_code: 'MFR001',
      param_file_original_name: '集中式储能系统原始文件名',
      param_file_obj_name: '集中式储能系统mino对象名',
      ems_comm_type: 'EMS通讯类型',
      comm_file_original_name: '通讯配置文件原始文件名',
      comm_file_obj_name: '通讯配置文件mino对象名',
      comm_card_version: 'v2.1.0',
      bms_comm_type: 'CAN',
      bms_di_type: 'Digital',
      bms_di_device: 'BMS-CENTRAL-001',
      device_count: 3
    });
  } else if (type === 'string') {
    // 加载组串式设备数据
    Object.assign(editForm, {
      id: 'STRING-001',
      model: 'GDE3900-XXX',
      parallel_type: 'Modbus-RTU(485)',
      parallel_amount: 2,
      cascade_rack_amount: 1,
      cascade_pcs_amount: 2,
      cascade_control_way: 'Modbus-RTU(485)V1.2.4',
      have_esgu: 'ESGU',
      non_standard_code: 'NON001',
      param_file_original_name: '组串式储能系统原始文件名',
      param_file_obj_name: '组串式储能系统mino对象名',
      ems_comm_type: 'EMS通讯类型',
      comm_file_original_name: '通讯配置文件原始文件名',
      comm_file_obj_name: '通讯配置文件mino对象名',
      comm_card_version: '通讯卡版本',
      bms_comm_type: 'BMS通讯类型',
      bms_di_type: 'DI类型',
      bms_di_device: 'DI连接设备',
      device_count: 5
    });
  }
};

const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate();
    console.log('提交表单数据:', editForm);
    message.success('设备信息更新成功');
    editModalVisible.value = false;
  } catch (error) {
    console.log('表单验证失败:', error);
  }
};

const handleEditCancel = () => {
  editModalVisible.value = false;
  editFormRef.value?.resetFields();
};

const handleEditRecord = (record: any) => {
  console.log('编辑设备记录', record);
  // 加载设备记录数据到编辑表单
  Object.assign(recordEditForm, {
    id: record.id || '',
    code: record.deviceCode || '',
    model: record.deviceModel || '',
    type: record.deviceType || '',
    sn: record.sn || '',
    arm_version_main: record.arm_version_main || '',
    arm_version_assist: record.arm_version_assist || '',
    fpga_version: record.fpga_version || '',
    menu_version: record.menu_version || '',
    hmi_version: record.hmi_version || '',
    key_part_names: record.key_part ? record.key_part.map((part: any) => part.name).join('\n') : '',
    is_batch_conf: record.is_batch_conf || '',
    ip_address: record.ip_address || ''
  });
  recordEditModalVisible.value = true;
};

const handleRecordEditSubmit = async () => {
  try {
    await recordEditFormRef.value?.validate();
    console.log('提交设备记录编辑数据:', recordEditForm);
    message.success('设备信息更新成功');
    recordEditModalVisible.value = false;
    // 这里可以调用API更新设备信息
  } catch (error) {
    console.log('表单验证失败:', error);
  }
};

const handleRecordEditCancel = () => {
  recordEditModalVisible.value = false;
  recordEditFormRef.value?.resetFields();
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '运行': 'green',
    '停机': 'red',
    '维护中': 'orange',
    '故障': 'red'
  };
  return colorMap[status] || 'default';
};

const { filterParams, reset } = useResetableRef(
  {
    keyword: undefined,
    customer_grade: undefined,
    device_model: undefined,
    software_version: undefined,
    software_type: undefined,
    province: undefined,
    page: '1',
    rows: '10',
  },
  'filterParams'
)
const filterOptions = [
  {
    type: 'search',
    placeholder: t('plantFilterInfo'),
    value: 'info'
  },
  {
    type: 'select',
    placeholder: t('customer_level'),
    value: 'customer_level'
  },
  {
    type: 'select',
    placeholder: t('deviceType'),
    value: 'device_type'
  },
  {
    type: 'select',
    placeholder: t('soft_version'),
    value: 'soft_version'
  },
  {
    type: 'select',
    placeholder: t('province'),
    value: 'province'
  }
]

const filterSearch = () => {
  // queryPlantList()
}

const reqParams = ref<any>({
  rows: 20,
  page: 1
})

const dataSource = ref([
  {
    id: '1',
    code: '1',
    model: '1',
    type: '1',
    sn: '1',
    arm_version_main: '储能系统ES900-XXX',
    arm_version_assist: '储能系统',
    fpga_version: 'ES900001',
    menu_version: 'ES900-500',
    hmi_version: '运行',
    key_part: ['Modbus', 'CAN'],
    is_batch_conf: '500V',
    ip_address: '500A'
  },
  {
    id: '1',
    code: '1',
    model: '1',
    type: '1',
    sn: '1',
    arm_version_main: '储能系统ES900-XXX',
    arm_version_assist: '储能系统',
    fpga_version: 'ES900001',
    menu_version: 'ES900-500',
    hmi_version: '运行',
    key_part: ['Modbus', 'CAN'],
    is_batch_conf: '500V',
    ip_address: '500A'
  }
])
const totalNumber = ref<number>(0)
</script>

<style scoped>
.device-info {
  padding: 0;
}

.device-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.device-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}







.device-subtitle {
  margin: 0 0 8px 0;
  color: #8c8c8c;
  font-size: 12px;
}

.device-details {
  color: #222222;
  font-size: 12px;
  line-height: 22px;
}

.device-status {
  flex-shrink: 0;
}

.search-section {
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
}
</style>
