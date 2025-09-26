<template>
  <div class="document-management-page">
    <!-- 顶部信息区域 -->
    <a-flex justify="space-between" gap="8" style="">
      <!-- 合同信息卡片 -->

      <EditCard title="合同信息" :editFunction="showContractModalFunc" :edit-button-text="$t('edit')" style="flex:auto;cursor: pointer;">
        <template #content>
          <a-flex justify="space-around" align="center" gap="32" style="height: 66px">
            <a-flex gap="12">
              <a-avatar :size="66" shape="square" :src="contractInformation"></a-avatar>
              <a-flex vertical>
                <div>
                  <a-tag color="blue">SS</a-tag>
                  <span
                    style="font-size: 16px;line-height: 22px;font-weight: 600;margin-left: 8px;">FWH202504060001</span>
                </div>
                <a-flex style="margin-top: 8px" gap="16">
                  <a-flex align="center" gap="4">
                    <img :src="iconPersonSvg" style="width: 16px; height: 16px;" />
                    <span style="color: #666; font-size: 14px;">XXXX公司</span>
                  </a-flex>
                  <a-flex align="center" gap="4">
                    <img :src="iconPhoneSvg" style="width: 16px; height: 16px;" />
                    <span style="color: #666; font-size: 14px;">18992888888</span>
                  </a-flex>
                </a-flex>
              </a-flex>
            </a-flex>
            <a-flex gap="12" align="center">
              <a-avatar :size="45" shape="square" :src="personBlue"></a-avatar>
              <div style="height: 45px">
                <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 22px;margin: 0;">属地用户</p>
                <p >
                  陈六-17625461259</p>
              </div>
            </a-flex>
            <div>
              <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 16px;margin: 0;">销售负责人</p>
              <p style="color:#333;font-size: 14px;font-weight: 400;line-height: 20px;margin: 4px 0 0 0;">李四-17625461259
              </p>
            </div>
            <div>
              <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 16px;margin: 0;">拓展负责人</p>
              <p style="color:#333;font-size: 14px;font-weight: 400;line-height: 20px;margin: 4px 0 0 0;">王五-17625461259
              </p>
            </div>
          </a-flex>
        </template>
      </EditCard>
      <!-- 质保信息卡片 -->
      <EditCard title="质保信息" :editFunction="showWarrantyModalFunc" :edit-button-text="$t('edit')" style="flex:auto;cursor: pointer;">
        <template #content>
          <a-flex justify="space-around" align="center" gap="32" style="height: 66px">
            <a-flex gap="12" align="center">
              <a-avatar :size="45" shape="square" :src="warrantyInform" style=""></a-avatar>
              <div style="height: 45px">
                <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 22px;margin: 0;">开始时间</p>
                <p >
                  陈六-17625461259</p>
              </div>
            </a-flex>
            <div>
              <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 16px;margin: 0;">周期</p>
              <p style="color:#333;font-size: 14px;font-weight: 400;line-height: 20px;margin: 4px 0 0 0;">李四-17625461259
              </p>
            </div>
            <div>
              <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 16px;margin: 0;">内容</p>
              <p style="min-width:250px; color:#333;font-size: 14px;font-weight: 400;line-height: 20px;margin: 4px 0 0 0;">王五-17
              </p>
            </div>
          </a-flex>
        </template>
      </EditCard>
    </a-flex>

    <!-- 技术文档列表区域 -->
    <EditCard title="技术文档列表" :editFunction="showUploadModalFunc" :edit-button-text="$t('edit')"
              style="flex:auto;cursor: pointer;" class="docs-section">
      <template #content>
        <a-table :columns="columns" :data-source="docsList" :pagination="false" size="small" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" style="color: #1890ff; padding: 0;">下载</a-button>
                <a-button type="link" size="small" style="color: #1890ff; padding: 0;">重新上传</a-button>
                <a-button type="text" size="small" style="color: #666; padding: 0;">···</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </template>
    </EditCard>




  </div>

  <!-- 合同信息编辑弹窗 -->
  <a-modal v-model:open="showContractModal" title="编辑合同信息" :mask-closable="false" :width="600" @ok="handleContractSubmit"
           @cancel="handleContractCancel">
    <a-form ref="contractFormRef" :model="contractForm" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
      <a-form-item
        label="合同编号"
        name="contractNumber"
        :rules="[{ required: true, message: '请输入合同编号', trigger: 'blur' }]"
      >
        <a-input v-model:value="contractForm.contractNumber" placeholder="请输入合同编号" />
      </a-form-item>

      <a-form-item
        label="合同客户"
        name="contractCustomer"
        :rules="[{ required: true, message: '请选择合同客户', trigger: ['change', 'blur'] }]"
      >
        <a-select v-model:value="contractForm.contractCustomer" placeholder="请选择合同客户">
          <a-select-option value="XXXX公司">XXXX公司</a-select-option>
          <a-select-option value="YYYY公司">YYYY公司</a-select-option>
          <a-select-option value="ZZZZ公司">ZZZZ公司</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="客户等级"
        name="customerLevel"
        :rules="[{ required: true, message: '请选择客户等级', trigger: ['change', 'blur'] }]"
      >
        <a-select v-model:value="contractForm.customerLevel" placeholder="请选择客户等级">
          <a-select-option value="SS">SS</a-select-option>
          <a-select-option value="S">S</a-select-option>
          <a-select-option value="A">A</a-select-option>
          <a-select-option value="B">B</a-select-option>
          <a-select-option value="C">C</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="终端用户"
        name="endUser"
        :rules="[{ required: true, message: '请选择终端用户', trigger: ['change', 'blur'] }]"
      >
        <a-select v-model:value="contractForm.endUser" placeholder="请选择终端用户">
          <a-select-option value="陈六-17625461259">陈六-17625461259</a-select-option>
          <a-select-option value="张三-13800138000">张三-13800138000</a-select-option>
          <a-select-option value="李四-13900139000">李四-13900139000</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="销售负责人"
        name="salesManager"
        :rules="[{ required: true, message: '请选择销售负责人', trigger: ['change', 'blur'] }]"
      >
        <a-select v-model:value="contractForm.salesManager" placeholder="请选择销售负责人">
          <a-select-option value="李四-17625461259">李四-17625461259</a-select-option>
          <a-select-option value="王五-13700137000">王五-13700137000</a-select-option>
          <a-select-option value="赵六-13600136000">赵六-13600136000</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="拓展负责人"
        name="expansionManager"
        :rules="[{ required: true, message: '请选择拓展负责人', trigger: ['change', 'blur'] }]"
      >
        <a-select v-model:value="contractForm.expansionManager" placeholder="请选择拓展负责人">
          <a-select-option value="王五-17625461259">王五-17625461259</a-select-option>
          <a-select-option value="陈七-13500135000">陈七-13500135000</a-select-option>
          <a-select-option value="刘八-13400134000">刘八-13400134000</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 质保信息编辑弹窗 -->
  <a-modal v-model:open="showWarrantyModal" title="编辑质保信息" :mask-closable="false" :width="600" @ok="handleWarrantySubmit"
           @cancel="handleWarrantyCancel">
    <a-form ref="warrantyFormRef" :model="warrantyForm" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" layout="vertical">
      <a-form-item
        label="质保期开始时间"
        name="startTime"
        :rules="[{ required: true, message: '请选择质保期开始时间', trigger: ['change', 'blur'] }]"
      >
        <a-date-picker v-model:value="warrantyForm.startTime" placeholder="请选择质保期开始时间" style="width: 100%" />
      </a-form-item>

      <a-form-item
        label="质保周期"
        name="period"
        :rules="[{ required: true, message: '请选择质保周期', trigger: ['change', 'blur'] }]"
      >
        <a-select v-model:value="warrantyForm.period" placeholder="请选择质保周期">
          <a-select-option value="1年">1年</a-select-option>
          <a-select-option value="2年">2年</a-select-option>
          <a-select-option value="3年">3年</a-select-option>
          <a-select-option value="5年">5年</a-select-option>
          <a-select-option value="10年">10年</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="质保内容"
        name="content"
        :rules="[{ required: true, message: '请输入质保内容', trigger: 'blur' }]"
      >
        <a-textarea v-model:value="warrantyForm.content" placeholder="请输入质保内容" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 上传技术文档弹窗 -->
  <a-modal v-model:open="showUploadModal" title="上传技术文档" :width="650" style="min-width: 600px" :mask-closable="false" @ok="handleUploadSubmit"
           @cancel="handleUploadCancel">
    <a-form ref="uploadFormRef" :model="uploadForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
      <div v-for="(item, index) in technicalDocumentType" >
        <a-flex :gutter="24" justify="space-between">
          <div style="">
            <a-form-item label="" name="docType">
              <div style="min-width: 150px">{{item?.name['zh-Hans']}}</div>
            </a-form-item>
          </div>
          <div>
            <a-form-item label="" name="fileName">
              <a-input v-model:value="uploadForm.fileName" style="width: 300px"  placeholder="请输入文件名称" />
            </a-form-item>
          </div>
          <div>
            <a-form-item label="" name="file">
              <a-upload v-model:file-list="uploadForm.fileList" :before-upload="beforeUpload" :max-count="1">
                <a-button>
                  <template #icon>
                    <span>📁</span>
                  </template>
                  选择文件
                </a-button>
              </a-upload>
            </a-form-item>
          </div>
        </a-flex>
      </div>




    </a-form>

  </a-modal>
</template>

<script setup>
import { ref,reactive } from 'vue';
import dayjs from 'dayjs';
import EditCard from '@/components/EditCard.vue';
import contractInformation from '@/assets/images/plant/contractInformation.png'
import iconPersonSvg from '@/assets/icons/aiopsSvg/iconPerson.svg?url'
import iconPhoneSvg from '@/assets/icons/aiopsSvg/iconPhone.svg?url'
import personBlue from '@/assets/images/plant/personBlue.png'
import warrantyInform from '@/assets/images/plant/warrantyInform.png'

// 弹窗控制
const showContractModal = ref(false);
const showWarrantyModal = ref(false);
const showUploadModal = ref(false);
const contractFormRef = ref();
const warrantyFormRef = ref();
const uploadFormRef = ref();
const technicalDocumentType =ref([])

onMounted( () => {
  // getDictFunc()
})

const getDictFunc = async () => {
  let data=await dict.getDictOpts({code: 'technicalDocumentType'})
  console.log('dict', data)
  technicalDocumentType.value = data
  console.log('technicalDocumentType', technicalDocumentType.value)
}

const showContractModalFunc = () => {
  showContractModal.value = !showContractModal.value
}

const showWarrantyModalFunc = () => {
  showWarrantyModal.value = !showWarrantyModal.value
}

const showUploadModalFunc = () => {
  showUploadModal.value = !showUploadModal.value
}

// 合同表单数据
const contractForm = ref({
  contractNumber: 'FWH202504060001',
  contractCustomer: 'XXXX公司',
  customerLevel: 'SS',
  endUser: '陈六-17625461259',
  salesManager: '李四-17625461259',
  expansionManager: '王五-17625461259'
});

// 质保表单数据
const warrantyForm = ref({
  startTime: dayjs('2025-05-26'),
  period: '2年',
  content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});

// 处理合同表单提交
const handleContractSubmit = () => {
  console.log('提交合同信息:', contractForm.value);
  showContractModal.value = false;
};

// 处理合同表单取消
const handleContractCancel = () => {
  showContractModal.value = false;
};

// 处理质保表单提交
const handleWarrantySubmit = () => {
  console.log('提交质保信息:', warrantyForm.value);
  showWarrantyModal.value = false;
};

// 处理质保表单取消
const handleWarrantyCancel = () => {
  showWarrantyModal.value = false;
};

// 上传表单数据
const uploadForm = ref({
  docType: '',
  fileName: '',
  fileList: []
});

// 处理文件上传前的验证
const beforeUpload = (file) => {
  const isDoc = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (!isDoc) {
    console.warn('只能上传 Word 文档!');
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    console.warn('文件大小不能超过 10MB!');
  }
  return false; // 阻止自动上传
};

// 处理上传表单提交
const handleUploadSubmit = () => {
  console.log('提交上传信息:', uploadForm.value);
  // 这里可以添加实际的文件上传逻辑
  showUploadModal.value = false;
  // 重置表单
  uploadForm.value = {
    docType: '',
    fileName: '',
    fileList: []
  };
};

// 处理上传表单取消
const handleUploadCancel = () => {
  showUploadModal.value = false;
  // 重置表单
  uploadForm.value = {
    docType: '',
    fileName: '',
    fileList: []
  };
};

// 表格列定义
const columns = [
  {
    title: '文档类型',
    dataIndex: 'type',
    key: 'type',
    width: 180
  },
  {
    title: '文档名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    width: 300
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 200
  },
  {
    title: '更新人',
    dataIndex: 'updater',
    key: 'updater',
    width: 220
  },
  {
    title: '操作',
    key: 'actions',
    width: 200
  }
];

// 模拟技术文档列表数据
const docsList = ref([
  {
    id: 1,
    key: 1,
    type: '技术协议',
    name: '储能升压一体机技术协议',
    updateTime: '2025-05-23 00:00:00',
    updater: 'xxxx'
  },
  {
    id: 2,
    key: 2,
    type: '通讯架构图',
    name: 'PSC-IES900-07-25技术协议',
    updateTime: '2025-05-23 00:00:00',
    updater: 'xxxx'
  },
  {
    id: 3,
    key: 3,
    type: 'BMS通讯协议',
    name: '储能升压一体机通讯架构图',
    updateTime: '2025-05-23 00:00:00',
    updater: 'xxxx'
  }
]);
</script>

<style lang="less" scoped>
// 全局变量定义
@primary-color: #409eff; // 主色调（蓝色，用于可点击元素）
@border-color: #e4e7ed; // 边框色
@text-color: #333; // 主文字色
@light-text: #666; // 次要文字色
@hover-bg: #f5f7fa; //  hover 背景色

.document-management-page {
  height: calc(100vh - 100px);
}



/* 信息卡片通用样式 */
.info-card {
  flex: 1;
  height: 140px;
  border: 1px solid @border-color;
  border-radius: 4px;
  padding: 15px;
  background: #fff;
  position: relative;

  .info-card-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: @text-color;
  }

  .info-content {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;

    .info-item {
      display: flex;
      align-items: center;
      min-width: 200px;

      .info-label {
        color: @light-text;
        margin-right: 5px;
      }

      .info-value {
        color: @text-color;
      }
    }
  }

  .edit-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: @primary-color;
    cursor: pointer;
    font-size: 14px;
  }
}

/* 技术文档区域 */
.docs-section {
  height: calc(100vh - 245px);
  background: #fff;
  border: 1px solid @border-color;
  border-radius: 4px;
  padding: 15px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: @text-color;
  }

  .upload-btn {
    background: none;
    border: none;
    color: @primary-color;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .docs-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      border: 1px solid @border-color;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: @hover-bg;
      font-weight: 600;
    }

    tr:hover {
      background-color: @hover-bg;
    }

    .actions {
      .action-link {
        color: @primary-color;
        text-decoration: none;
        margin-right: 10px;
        cursor: pointer;
      }

      .more-btn {
        cursor: pointer;
        color: @light-text;
      }
    }
  }
}


/* 卡片容器样式 */
.info-block {
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 0 10px 10px 10px;
  background-color: #fff;
  margin-bottom: 8px;
}

</style>
