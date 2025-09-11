<template>
  <a-layout class="station-info-page">
    <!-- 基础信息 + 地理信息 行布局 -->
    <a-flex justify="space-between" align="stretch" style="margin-bottom: 16px;">
      <!-- 基础信息区块 -->
      <div class="info-block" style="flex: 1;min-width: 400px">
        <!-- 头部：标题 + 编辑按钮 -->
        <a-flex justify="space-between" align="center" class="block-header-container">
          <a-flex align="center" class="block-title">
            <div class="title-bar"></div>
            <div>基础信息</div>
          </a-flex>
          <a-button type="text">✎ 编辑</a-button>
        </a-flex>
        <!-- 内容区 -->
        <div class="basic-info content-area">
          <a-flex>
          <a-avatar  src="https://www.antdv.com/assets/logo.1ef800a8.svg"  shape="square" :size="80" style="margin-right: 12px;" />
          <div>
            <h4>山东高速长清服务区西区电站</h4>
            <p>
              <a-tag color="blue">调试中</a-tag>
              ETO: 未恒管家通5MW储能项目
            </p>
            <a-flex wrap gap="8px" style="margin-top: 4px;">
              <a-tag>单PCS项目</a-tag>
              <a-tag>大储</a-tag>
              <a-tag>5MWH</a-tag>
              <a-tag>2025年</a-tag>
              <a-tag>仅汇川设备</a-tag>
              <a-tag>在保</a-tag>
            </a-flex>
          </div>
          </a-flex>
        </div>
      </div>

      <!-- 地理信息区块 -->
      <div class="info-block" style="flex: 1; margin-left: 8px;min-width: 400px">
        <!-- 头部：标题 + 编辑按钮 -->
        <a-flex justify="space-between" align="center" class="block-header-container">
          <a-flex align="center" class="block-title">
            <div class="title-bar"></div>
            <div>地理信息</div>
          </a-flex>
          <a-button type="text">✎ 编辑</a-button>
        </a-flex>
        <!-- 内容区 -->
        <div class="geo-info content-area">

          <a-flex>
          <a-avatar  src="https://www.antdv.com/assets/logo.1ef800a8.svg"  shape="square" :size="80" style="margin-right: 12px;" />

          <div>
            <p>
              山东省济南市章丘区文祖镇三德范村西南2公里处
            </p>
            <a-tag color="orange">大风预警</a-tag><span style="margin: 4px 0;">海拔3515米</span>
            <a-flex>
              <a-space>
                <span>实时温度: 33°</span>
                <span>实时湿度: 24%</span>
              </a-space>
            </a-flex>
          </div>
          </a-flex>
        </div>
      </div>
    </a-flex>

    <!-- 关键节点区块 -->
    <div class="info-block" style="margin-bottom: 16px;min-width: 700px;">
      <!-- 头部：标题 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div>关键节点</div>
        </a-flex>
      </a-flex>
      <!-- 内容区：步骤条 -->
      <div class="content-area">
        <a-steps
          :current="3"
          direction="horizontal"
          :items="[
            {
              title: '建站流程节点',
              description: '2025/05/23 - 2025/05/23',
              status: 'finish',
            },
            {
              title: '设备发货',
              description: '2025/05/23 - 2025/05/23',
              status: 'finish',
            },
            {
              title: '入场调试',
              description: '2025/05/23 - 2025/05/23',
              status: 'finish',
            },
            {
              title: '并网测试',
              description: '2025/05/23 - 2025/05/23',
              status: 'process',
            },
            { title: '涉网试验', description: '-', status: 'wait' },
            { title: '运行报告', description: '-', status: 'wait' },
            { title: '验收报告', description: '-', status: 'wait' },
          ]"
        ></a-steps>
      </div>
    </div>

    <!-- 内部干系人信息区块 -->
    <div class="info-block" style="margin-bottom: 16px;">
      <!-- 头部：标题 + 编辑按钮 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div>内部干系人信息</div>
        </a-flex>
        <a-button type="text">✎ 编辑</a-button>
      </a-flex>
      <!-- 内容区：干系人列表 -->
      <div class="content-area">
        <a-flex wrap gap="24px">
          <div style="min-width: 180px">
            <a-flex gap="10" align="center" justify="">
              <a-avatar :size="40">👤</a-avatar>
              <a-flex vertical justify="flex-start" gap="8">
                <a-flex justify="flex-start">站长</a-flex>
                <a-flex justify="flex-start">陈六-17625461259</a-flex>
              </a-flex>
            </a-flex>
          </div>

          <div style="min-width: 180px">
            <a-flex gap="10" align="center" justify="">
              <a-avatar :size="40">👤</a-avatar>
              <a-flex vertical justify="flex-start" gap="8">
                <a-flex justify="flex-start">站长</a-flex>
                <a-flex justify="flex-start">陈六-17625461259</a-flex>
              </a-flex>
            </a-flex>
          </div>
          <div style="min-width: 180px">
            <a-flex gap="10" align="center" justify="">
              <a-avatar :size="40">👤</a-avatar>
              <a-flex vertical justify="flex-start" gap="8">
                <a-flex justify="flex-start">站长</a-flex>
                <a-flex justify="flex-start">陈六-17625461259</a-flex>
              </a-flex>
            </a-flex>
          </div>
          <div style="min-width: 180px">
          <a-flex gap="10" align="center" justify="">
            <a-avatar :size="40">👤</a-avatar>
            <a-flex vertical justify="flex-start" gap="8">
              <a-flex justify="flex-start">站长</a-flex>
              <a-flex justify="flex-start">陈六-17625461259</a-flex>
            </a-flex>
          </a-flex>
        </div>
        </a-flex>
      </div>
    </div>

    <!-- 重要组件厂商区块 -->
    <div class="info-block" style="margin-bottom: 16px;">
      <!-- 头部：标题 + 编辑按钮 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div>重要组件厂商</div>
        </a-flex>
        <a-button type="text">✎ 编辑</a-button>
      </a-flex>
      <!-- 内容区：厂商列表 -->
      <div class="content-area">
        <a-flex  gap="25" style="min-width: 700px">
          <a-avatar :size="40">👤</a-avatar>
          <a-flex gap="20">
          <div class="">

            <p>EMS后台</p>
            <p>宁德时代</p>
          </div>
          <div class="">

            <p>PMS协控</p>
            <p>宁德时代</p>
          </div>
          <div class="">

            <p>电池BMS</p>
            <p>宁德时代</p>
          </div>
          <div class="">

            <p>变压器设备</p>
            <p>宁德时代</p>
          </div>
          <div class="">

            <p>EMS后台</p>
            <p>宁德时代</p>
          </div>
          <div class="">

            <p>EMS后台</p>
            <p>宁德时代</p>
          </div>
          <div class="">

            <p>EMS后台</p>
            <p>宁德时代</p>
          </div>
          </a-flex>
        </a-flex>
      </div>
    </div>

    <!-- 易损部件型号区块 -->
    <div class="info-block" style="margin-bottom: 16px;">
      <!-- 头部：标题 + 编辑按钮 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div>易损部件型号</div>
        </a-flex>
        <a-button type="text">✎ 编辑</a-button>
      </a-flex>
      <!-- 内容区：部件列表 -->
      <div class="content-area">
        <a-flex  gap="25" style="min-width: 700px">
          <a-avatar :size="40">👤</a-avatar>
        <a-flex wrap gap="16">
          <div class="parts-item">

            <p>鼓-螺丝型号</p>
            <p>IES900-X-X</p>
          </div>
          <div class="parts-item">

            <p>鼓-螺丝型号</p>
            <p>IES900-X-X</p>
          </div>
          <div class="parts-item">

            <p>鼓-螺丝型号</p>
            <p>IES900-X-X</p>
          </div>
          <div class="parts-item">

            <p>鼓-螺丝型号</p>
            <p>IES900-X-X</p>
          </div>
          <div class="parts-item">

            <p>鼓-螺丝型号</p>
            <p>IES900-X-X</p>
          </div>
        </a-flex>
        </a-flex>
      </div>
    </div>

    <!-- 运行计划区块 -->
    <div class="info-block">
      <!-- 头部：标题 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div>运行计划</div>
        </a-flex>
      </a-flex>
      <!-- 内容区：表格 -->
      <div class="content-area">
        <a-table
          :columns="planColumns"
          :data-source="planData"
          size="small"
          bordered
          :pagination="false"
        >
          <template #operation="{ record }">
            <a-button type="text">✎ 编辑</a-button>
          </template>
        </a-table>
      </div>
    </div>
  </a-layout>
</template>

<script setup>
const planColumns = [
  {
    title: '每日充放电计划',
    dataIndex: 'chargeDischargePlan',
  },
  {
    title: '单次运行时间',
    dataIndex: 'singleRunTime',
  },
  {
    title: '现场实际满载',
    dataIndex: 'actualFullLoad',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slots: { customRender: 'operation' },
  },
];

const planData = [
  {
    chargeDischargePlan: '5充5放',
    singleRunTime: '5小时',
    actualFullLoad: '500kW',
  },
];
</script>

<style scoped>
.station-info-page {
  background-color: #E9EEF2;
}

/* 卡片容器样式 */
.info-block {
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 0 16px 14px 16px;
  background-color: #fff;
  margin-bottom: 16px;
}

/* 最后一个区块移除底部margin */
.info-block:last-child {
  margin-bottom: 0;
}

/* 头部容器样式 */
.block-header-container {
  margin: 4px 0;
  //border-bottom: 1px solid #e8e8e8;
}

/* 标题样式 */
.block-title {
  gap: 8px;
}

.block-title div:last-child {
  text-align: left;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  color: #222222;
}

/* 标题前的彩色条 - 统一为#0099F2 */
.title-bar {
  width: 2px;
  height: 13px;
  border-radius: 2px;
  background-color: #0099F2;
}

/* 内容区域样式 */
.content-area {
  padding-top: 8px;
}

/* 基础信息和地理信息内容区 */
.basic-info,
.geo-info {
  display: flex;
  align-items: flex-start;
}




/* 调整按钮中的字符与文字间距 */
a-button[type="text"] {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:deep(.content-wrap) {
  padding: 12px;
  background: var(--InoGray_03);
}
</style>
