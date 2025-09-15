<template>
  <a-layout class="station-info-page">
    <!-- 基础信息 + 地理信息 行布局 -->
    <a-flex justify="space-between" align="stretch" style="">
      <!-- 基础信息区块 -->
      <div class="info-block" style="flex: 1;min-width: 520px">
        <!-- 头部：标题 + 编辑按钮 -->
        <a-flex justify="space-between" align="center" class="block-header-container">
          <a-flex align="center" class="block-title">
            <div class="title-bar"></div>
            <div class="cardTitle">基础信息</div>
          </a-flex>
          <a-button type="link" @click="openOrCloseBasicInfoModal"><a-space><img :src="editSpan" alt="edit"
                style="width: 16px; height: 16px;" />编辑</a-space></a-button>
        </a-flex>
        <!-- 内容区 -->
        <div class="basic-info content-area">
          <a-flex>
            <a-avatar :src="basicInfoImg" shape="square" :size="80" style="margin-right: 12px;" />
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
      <div class="info-block" style="flex: 1; margin-left: 8px;min-width: 520px">
        <!-- 头部：标题 + 编辑按钮 -->
        <a-flex justify="space-between" align="center" class="block-header-container">
          <a-flex align="center" class="block-title">
            <div class="title-bar"></div>
            <div>地理信息</div>
          </a-flex>
          <a-button type="link" @click="openOrCloseGeoInfoModal"><a-space><img :src="editSpan" alt="edit"
                style="width: 16px; height: 16px;" />编辑</a-space></a-button>
        </a-flex>
        <!-- 内容区 -->
        <div class="geo-info content-area">

          <a-flex>
            <a-avatar :src="geographicInfo" shape="square" :size="80" style="margin-right: 12px;" />

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
    <div class="info-block" style="min-width: 700px;">
      <!-- 头部：标题 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div class="cardTitle">关键节点</div>
        </a-flex>
      </a-flex>
      <!-- 内容区：步骤条 -->
      <div class="content-area">
        <a-steps :current="3" direction="horizontal" :items="[
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
        ]"></a-steps>
      </div>
    </div>

    <!-- 内部干系人信息区块 -->
    <div class="info-block" style="">
      <!-- 头部：标题 + 编辑按钮 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div class="cardTitle">内部干系人信息</div>
        </a-flex>
        <a-button type="link" @click="openOrCloseInsidersModal"><a-space><img :src="editSpan" alt="edit"
              style="width: 16px; height: 16px;" />编辑</a-space></a-button>
      </a-flex>
      <!-- 内容区：干系人列表 -->
      <div class="content-area">
        <a-flex wrap gap="32">
          <div style="min-width: 180px">
            <a-flex gap="10" align="center" justify="">
              <a-avatar :src="personBlue" shape="circle" :size="45" style="margin-right: 12px;" />
              <a-flex vertical justify="flex-start" gap="8">
                <a-flex justify="flex-start" class="responsiblePersonTitle">站长</a-flex>
                <a-flex justify="flex-start" class="responsiblePersonBody">陈六-17625461259</a-flex>
              </a-flex>
            </a-flex>
          </div>

          <div style="min-width: 180px">
            <a-flex gap="10" align="center" justify="">
              <a-avatar :src="personPurple" shape="circle" :size="45" style="margin-right: 12px;" />
              <a-flex vertical justify="flex-start" gap="8">
                <a-flex justify="flex-start" class="responsiblePersonTitle">站长</a-flex>
                <a-flex justify="flex-start" class="responsiblePersonBody">陈六-17625461259</a-flex>
              </a-flex>
            </a-flex>
          </div>
          <div style="min-width: 180px">
            <a-flex gap="10" align="center" justify="">
              <a-avatar :src="personBlueGreen" shape="circle" :size="45" style="margin-right: 12px;" />
              <a-flex vertical justify="flex-start" gap="8">
                <a-flex justify="flex-start" class="responsiblePersonTitle">站长</a-flex>
                <a-flex justify="flex-start" class="responsiblePersonBody">陈六-17625461259</a-flex>
              </a-flex>
            </a-flex>
          </div>
          <div style="min-width: 180px">
            <a-flex gap="10" align="center" justify="">
              <a-avatar :src="personOrange" shape="circle" :size="45" style="margin-right: 12px;" />
              <a-flex vertical justify="flex-start" gap="8">
                <a-flex justify="flex-start" class="responsiblePersonTitle">站长</a-flex>
                <a-flex justify="flex-start" class="responsiblePersonBody">陈六-17625461259</a-flex>
              </a-flex>
            </a-flex>
          </div>
        </a-flex>
      </div>
    </div>

    <!-- 重要组件厂商区块 -->
    <div class="info-block" style="">
      <!-- 头部：标题 + 编辑按钮 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div class="cardTitle">重要组件厂商</div>
        </a-flex>
        <a-button type="link" @click="openOrCloseFactoryModal"><a-space><img :src="editSpan" alt="edit"
              style="width: 16px; height: 16px;" />编辑</a-space></a-button>
      </a-flex>
      <!-- 内容区：厂商列表 -->
      <div class="content-area">
        <a-flex gap="25" style="min-width: 700px">
          <a-avatar :src="importantPart" shape="circle" :size="45" style="margin-right: 12px;" />
          <a-flex gap="20">
            <div class="">
              <p class="responsiblePersonTitle">EMS后台</p>
              <p class="responsiblePersonBody">宁德时代</p>
            </div>
            <div class="">
              <p class="responsiblePersonTitle">EMS后台</p>
              <p class="responsiblePersonBody">宁德时代</p>
            </div>
            <div class="">
              <p class="responsiblePersonTitle">EMS后台</p>
              <p class="responsiblePersonBody">宁德时代</p>
            </div>
            <div class="">
              <p class="responsiblePersonTitle">EMS后台</p>
              <p class="responsiblePersonBody">宁德时代</p>
            </div>
          </a-flex>
        </a-flex>
      </div>
    </div>

    <!-- 易损部件型号区块 -->
    <div class="info-block" style="">
      <!-- 头部：标题 + 编辑按钮 -->
      <a-flex justify="space-between" align="center" class="block-header-container">
        <a-flex align="center" class="block-title">
          <div class="title-bar"></div>
          <div class="cardTitle">易损部件型号</div>
        </a-flex>
        <a-button type="link" @click="openOrCloseVulnerableModal"><a-space><img :src="editSpan" alt="edit"
              style="width: 16px; height: 16px;" />编辑</a-space></a-button>
      </a-flex>
      <!-- 内容区：部件列表 -->
      <div class="content-area">
        <a-flex gap="25" style="min-width: 700px">
          <a-avatar :src="vulnerablePart" shape="square" :size="45" style="margin-right: 12px;" />
          <a-flex wrap gap="16">
            <div class="parts-item">
              <p class="responsiblePersonTitle">鼓-螺丝型号</p>
              <p class="responsiblePersonBody">IES900-X-X</p>
            </div>
            <div class="parts-item">
              <p class="responsiblePersonTitle">鼓-螺丝型号</p>
              <p class="responsiblePersonBody">IES900-X-X</p>
            </div>
            <div class="parts-item">
              <p class="responsiblePersonTitle">鼓-螺丝型号</p>
              <p class="responsiblePersonBody">IES900-X-X</p>
            </div>
            <div class="parts-item">
              <p class="responsiblePersonTitle">鼓-螺丝型号</p>
              <p class="responsiblePersonBody">IES900-X-X</p>
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
          <div class="cardTitle">运行计划</div>
        </a-flex>
      </a-flex>
      <!-- 内容区：表格 -->
      <div class="content-area">
        <a-table :columns="planColumns" :data-source="planData" size="small" bordered :pagination="false">
          <template #operation="{ record }">
            <a-button type="link" @click="openOrClosePlanModal"><a-space><img :src="editSpan" alt="edit"
                  style="width: 16px; height: 16px;" />编辑</a-space></a-button>
          </template>
        </a-table>
      </div>
    </div>


    <!--    编辑基础信息弹窗-->
    <a-modal v-model:open="isBasicInfoModalShow" title="编辑基础信息" :maskClosable="false">
      <template #footer>
        <a-button key="back" @click="openOrCloseBasicInfoModal">Return</a-button>
        <a-button key="submit" type="primary" @click="submitEditBasicInfo">Submit</a-button>
      </template>
      <a-form ref="formRef" :model="basicInfoFormState" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }"
        :colon="false" layout="vertical" :scrollToFirstError="true" class="basic-info-form">
        
        <!-- 电站名称 -->
        <a-form-item label="电站名称" name="name" :rules="[
          { required: true, message: '请输入电站名称' },
          { min: 2, max: 64, message: '电站名称长度在2到64个字符之间' }
        ]">
          <a-input v-model:value="basicInfoFormState.name" placeholder="请输入电站名称" />
        </a-form-item>

        <!-- ETO项目名称 -->
        <a-form-item label="ETO项目名称" name="eto_name" :rules="[
          { required: true, message: '请选择ETO项目名称' }
        ]">
          <a-select v-model:value="basicInfoFormState.eto_name" placeholder="请选择ETO项目名称">
            <a-select-option value="ETO项目A">ETO项目A</a-select-option>
            <a-select-option value="ETO项目B">ETO项目B</a-select-option>
            <a-select-option value="ETO项目C">ETO项目C</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 发电类型 -->
        <a-form-item label="发电类型" name="power_gen_type" :rules="[
          { required: true, message: '请选择发电类型' }
        ]">
          <a-select v-model:value="basicInfoFormState.power_gen_type" placeholder="请选择发电类型">
            <a-select-option value="光伏发电">光伏发电</a-select-option>
            <a-select-option value="风力发电">风力发电</a-select-option>
            <a-select-option value="水力发电">水力发电</a-select-option>
            <a-select-option value="火力发电">火力发电</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 储能类型 -->
        <a-form-item label="储能类型" name="energy_type" :rules="[
          { required: true, message: '请选择储能类型' }
        ]">
          <a-select v-model:value="basicInfoFormState.energy_type" placeholder="请选择储能类型">
            <a-select-option value="锂电池">锂电池</a-select-option>
            <a-select-option value="钠电池">钠电池</a-select-option>
            <a-select-option value="液流电池">液流电池</a-select-option>
            <a-select-option value="压缩空气">压缩空气</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 电站容量 -->
        <a-form-item label="电站容量" name="plant_capacity" :rules="[
          { required: true, message: '请输入电站容量' },
          { type: 'number', min: 0, max: 10000000, message: '电站容量范围在0到10000000之间' }
        ]">
          <a-input-number :controls="false" v-model:value="basicInfoFormState.plant_capacity" 
            placeholder="请输入电站容量" style="width: 100%">
            <template #addonAfter>
              <a-select v-model:value="basicInfoFormState.capacity_unit" style="width: 80px">
                <a-select-option value="kW">kW</a-select-option>
                <a-select-option value="MW">MW</a-select-option>
                <a-select-option value="GW">GW</a-select-option>
                <a-select-option value="kWh">kWh</a-select-option>
                <a-select-option value="MWh">MWh</a-select-option>
                <a-select-option value="GWh">GWh</a-select-option>
              </a-select>
            </template>
          </a-input-number>
        </a-form-item>

        <!-- 所属年度 -->
        <a-form-item label="所属年度" name="belong_year" :rules="[
          { required: true, message: '请选择所属年度' }
        ]">
          <a-date-picker v-model:value="basicInfoFormState.belong_year" picker="year" 
            placeholder="请选择所属年度" style="width: 100%" />
        </a-form-item>

        <!-- 仅汇川设备 -->
        <a-form-item label="仅汇川设备" name="ino_device" :rules="[
          { required: true, message: '请选择是否为汇川设备' }
        ]">
          <a-select v-model:value="basicInfoFormState.ino_device" placeholder="请选择是否为汇川设备">
            <a-select-option value="是">是</a-select-option>
            <a-select-option value="否">否</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 是否投入 -->
        <a-form-item label="是否投入" name="is_warranty" :rules="[
          { required: true, message: '请选择是否投入' }
        ]">
          <a-select v-model:value="basicInfoFormState.is_warranty" placeholder="请选择是否投入">
            <a-select-option value="已投入">已投入</a-select-option>
            <a-select-option value="未投入">未投入</a-select-option>
            <a-select-option value="部分投入">部分投入</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>

    <!--    编辑内部干系人信息弹窗-->
    <!-- 编辑内部干系人信息弹窗（适配 4.2.6 版本） -->
    <a-modal v-model:open="isInsidersModalShow" title="编辑内部干系人信息" :maskClosable="false">
      <template #footer>
        <a-button key="back" @click="openOrCloseInsidersModal">Return</a-button>
        <a-button key="submit" type="primary" @click="submitEditInsiders">Submit</a-button>
      </template>

      <!-- 核心：4.x 版本的 a-form 无需显式绑定 :model 的 .value（内部会自动解包 ref） -->
      <a-form ref="insidersFormRef" :model="InsidersFormState" layout="vertical" :scroll-to-first-error="true"
        class="insiders-form-wrapper">
        <!-- 用 v-for 循环，4.x 中动态 name 需严格对应模型路径 -->
        <div v-for="(item, index) in InsidersFormState.list" :key="index" class="insiders-form-item">
          <!-- 职位字段：使用数组形式的 name -->
          <a-form-item label="职位" class="mb-4" :name="['list', index, 'post']" :rules="[
            { required: true, message: '职位不能为空' },
            { min: 2, message: '职位名称长度必须大于2个字符' }
          ]">
            <a-input v-model:value="item.post" placeholder="请输入职位名称" />
          </a-form-item>

          <!-- 姓名字段：使用数组形式的 name -->
          <a-form-item label="姓名" class="mb-4" :name="['list', index, 'name']" :rules="[
            { required: true, message: '姓名不能为空' },
            { min: 2, message: '姓名长度必须大于2个字符' }
          ]">
            <a-input v-model:value="item.name" placeholder="请输入姓名" />
          </a-form-item>

          <!-- 电话字段：使用数组形式的 name -->
          <a-form-item label="电话" class="mb-6" :name="['list', index, 'phone']" :rules="[
            { required: true, message: '电话号码不能为空' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式' }
          ]">
            <a-input v-model:value="item.phone" placeholder="请输入电话号码" type="tel" />
          </a-form-item>

          <a-divider v-if="index < InsidersFormState.list.length - 1" class="custom-divider" />
        </div>
      </a-form>
    </a-modal>

    <!--    编辑重要组件厂商信息弹窗-->
    <a-modal v-model:open="isFactoryModalShow" title="编辑重要组件厂商信息" :maskClosable="false" width="600px">
      <template #footer>
        <a-button key="back" @click="openOrCloseFactoryModal">Return</a-button>
        <a-button key="submit" type="primary" @click="submitEditFactory">Submit</a-button>
      </template>

      <a-form ref="factoryFormRef" :model="FactoryFormState" layout="vertical" :scroll-to-first-error="true"
        class="factory-form-wrapper">
        <!-- 添加新行按钮 -->
        <div class="mb-4">
          <a-button type="dashed" @click="addFactoryItem" block>
            <template #icon>
              <plus-outlined />
            </template>
            添加组件厂商
          </a-button>
        </div>

        <!-- 动态表单列表 -->
        <div v-for="(item, index) in FactoryFormState.list" :key="index" class="factory-form-item">
          <div class="form-row">
            <!-- 组件名称字段 -->
            <a-form-item label="组件名称" class="form-item-half" :name="['list', index, 'component_name']" :rules="[
              { required: true, message: '组件名称不能为空' },
              { min: 2, message: '组件名称长度必须大于2个字符' }
            ]">
              <a-input v-model:value="item.component_name" placeholder="请输入组件名称" />
            </a-form-item>

            <!-- 厂商名称字段 -->
            <a-form-item label="厂商名称" class="form-item-half" :name="['list', index, 'factory_name']" :rules="[
              { required: true, message: '厂商名称不能为空' },
              { min: 2, message: '厂商名称长度必须大于2个字符' }
            ]">
              <a-input v-model:value="item.factory_name" placeholder="请输入厂商名称" />
            </a-form-item>

            <!-- 删除按钮 -->
            <div class="delete-btn-wrapper">
              <a-button type="text" danger @click="removeFactoryItem(index)"
                :disabled="FactoryFormState.list.length === 1" class="delete-btn">
                <template #icon>
                  <delete-outlined />
                </template>
              </a-button>
            </div>
          </div>

          <a-divider v-if="index < FactoryFormState.list.length - 1" class="custom-divider" />
        </div>
      </a-form>
    </a-modal>

    <!--    编辑易损部件型号信息弹窗-->
    <a-modal v-model:open="isVulnerableModalShow" title="编辑易损部件型号信息" :maskClosable="false" width="600px">
      <template #footer>
        <a-button key="back" @click="openOrCloseVulnerableModal">Return</a-button>
        <a-button key="submit" type="primary" @click="submitEditVulnerable">Submit</a-button>
      </template>

      <a-form ref="vulnerableFormRef" :model="VulnerableFormState" layout="vertical" :scroll-to-first-error="true"
        class="vulnerable-form-wrapper">
        <!-- 添加新行按钮 -->
        <div class="mb-4">
          <a-button type="dashed" @click="addVulnerableItem" block>
            <template #icon>
              <plus-outlined />
            </template>
            添加易损部件
          </a-button>
        </div>

        <!-- 动态表单列表 -->
        <div v-for="(item, index) in VulnerableFormState.list" :key="index" class="vulnerable-form-item">
          <div class="form-row">
            <!-- 部件类型字段 -->
            <a-form-item label="部件类型" class="form-item-half" :name="['list', index, 'type']" :rules="[
              { required: true, message: '部件类型不能为空' },
              { min: 2, message: '部件类型长度必须大于2个字符' }
            ]">
              <a-input v-model:value="item.type" placeholder="请输入部件类型" />
            </a-form-item>

            <!-- 型号字段 -->
            <a-form-item label="型号" class="form-item-half" :name="['list', index, 'model']" :rules="[
              { required: true, message: '型号不能为空' },
              { min: 2, message: '型号长度必须大于2个字符' }
            ]">
              <a-input v-model:value="item.model" placeholder="请输入型号" />
            </a-form-item>

            <!-- 删除按钮 -->
            <div class="delete-btn-wrapper">
              <a-button type="text" danger @click="removeVulnerableItem(index)"
                :disabled="VulnerableFormState.list.length === 1" class="delete-btn">
                <template #icon>
                  <delete-outlined />
                </template>
              </a-button>
            </div>
          </div>

          <a-divider v-if="index < VulnerableFormState.list.length - 1" class="custom-divider" />
        </div>
      </a-form>
    </a-modal>

    <!--    编辑运行计划信息弹窗-->
    <a-modal v-model:open="isPlanModalShow" title="编辑运行计划信息" :maskClosable="false" width="500px">
      <template #footer>
        <a-button key="back" @click="openOrClosePlanModal">Return</a-button>
        <a-button key="submit" type="primary" @click="submitEditPlan">Submit</a-button>
      </template>

      <a-form ref="planFormRef" :model="PlanFormState" layout="vertical" :scroll-to-first-error="true"
        class="plan-form-wrapper">

        <!-- 电站ID字段 -->
        <a-form-item label="电站ID" name="plant_id" :rules="[
          { required: true, message: '电站ID不能为空' }
        ]">
          <a-input v-model:value="PlanFormState.plant_id" placeholder="请输入电站ID" disabled />
        </a-form-item>

        <!-- 日充电量字段 -->
        <a-form-item label="日充电量" name="day_charge" :rules="[
          { required: true, message: '日充电量不能为空' },
          { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的数字' }
        ]">
          <a-input v-model:value="PlanFormState.day_charge" placeholder="请输入日充电量" />
        </a-form-item>

        <!-- 单次运行时间字段 -->
        <a-form-item label="单次运行时间" name="single_run_time" :rules="[
          { required: true, message: '单次运行时间不能为空' },
          { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的数字' }
        ]">
          <a-input v-model:value="PlanFormState.single_run_time" placeholder="请输入单次运行时间" />
        </a-form-item>

        <!-- 实际负载字段 -->
        <a-form-item label="实际负载" name="actual_loaded" :rules="[
          { required: true, message: '实际负载不能为空' },
          { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的数字' }
        ]">
          <a-input v-model:value="PlanFormState.actual_loaded" placeholder="请输入实际负载" />
        </a-form-item>

        <!-- 实际负载单位字段 -->
        <a-form-item label="实际负载单位" name="actual_loaded_unit" :rules="[
          { required: true, message: '实际负载单位不能为空' }
        ]">
          <a-select v-model:value="PlanFormState.actual_loaded_unit" placeholder="请选择实际负载单位">
            <a-select-option value="kW">kW</a-select-option>
            <a-select-option value="MW">MW</a-select-option>
            <a-select-option value="GW">GW</a-select-option>
            <a-select-option value="kWh">kWh</a-select-option>
            <a-select-option value="MWh">MWh</a-select-option>
            <a-select-option value="GWh">GWh</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>

    <!-- 地理信息弹窗 -->
    <a-modal v-model:open="isGeoInfoModalShow" title="编辑地理信息" :width="500" @ok="submitEditGeoInfo">
      <a-form ref="geoInfoFormRef" :model="geoInfoFormState" layout="vertical" class="geo-info-form">
        <a-form-item label="地理位置" name="address" :rules="[{ required: true, message: '请输入地理位置' }]">
          <a-input v-model:value="geoInfoFormState.address" placeholder="请输入地理位置" />
        </a-form-item>
        <a-form-item label="海拔" name="elevation" :rules="[{ required: true, message: '请输入海拔' }, { pattern: /^\d+(\.\d+)?$/, message: '请输入有效的数字' }]">
          <a-input-number v-model:value="geoInfoFormState.elevation" placeholder="请输入海拔" style="width: 100%" :precision="2" />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-layout>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import dayjs from 'dayjs'

import basicInfoImg from '@/assets/images/plant/basicInfo.png'
import geographicInfo from '@/assets/images/plant/geographicInfo.png'
import vulnerablePart from '@/assets/images/plant/vulnerablePart.png'
import personBlue from '@/assets/images/plant/personBlue.png'
import personPurple from '@/assets/images/plant/personPurple.png'
import personBlueGreen from '@/assets/images/plant/personBlueGreen.png'
import personOrange from '@/assets/images/plant/personOrange.png'
import importantPart from '@/assets/images/plant/importantPart.png'
import editSpan from '@/assets/icons/aiopsSvg/editSpan.svg'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {
  editPlant,
  getPlantFactoryInfo,
  getPlantInsidersInfo,
  getPlantPlanInfo,
  getPlantVulnerableInfo,
  addInsiders
} from "@/network/plant/index.js";
import { usePlantsStore } from "@/stores/modules/plant.ts";
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
const plantInfo = usePlantsStore().plantInfo

//基本信息弹窗

let isBasicInfoModalShow = ref(false);

const openOrCloseBasicInfoModal = () => {
  isBasicInfoModalShow.value = !isBasicInfoModalShow.value
}
const submitEditBasicInfo = async () => {
  let sendObj = {
    ...plantInfo,
    ...basicInfoFormState.value
  }
  let res = editPlant(sendObj)
  console.log('res', res)
  isBasicInfoModalShow.value = !isBasicInfoModalShow.value
}

const basicInfoFormState = ref({
  id: plantInfo.id,
  name: '华北电站3',
  eto_name: 'ETO项目A',
  power_gen_type: '光伏发电',
  energy_type: '锂电池',
  plant_capacity: 5500,
  capacity_unit: 'kWh',
  belong_year: dayjs('2025'),
  ino_device: '是',
  is_warranty: '已投入'
})

//地理信息弹窗
let isGeoInfoModalShow = ref(false);
const geoInfoFormRef = ref(null)

const openOrCloseGeoInfoModal = () => {
  isGeoInfoModalShow.value = !isGeoInfoModalShow.value
}

const submitEditGeoInfo = async () => {
  try {
    // 验证表单
    await geoInfoFormRef.value.validate()

    let res = await editPlant(geoInfoFormState.value)
    console.log('res', res)
    isGeoInfoModalShow.value = !isGeoInfoModalShow.value
  } catch (error) {
    console.log('表单校验失败:', error)
    // 校验失败时不关闭弹窗
  }
}

const geoInfoFormState = ref({
  id: plantInfo.id,
  address: '山东省济南市章丘区文祖镇三德范村西南2公里处',
  elevation: 3515
})

// 内部干系人弹窗
let isInsidersModalShow = ref(false);
const insidersFormRef = ref(null)

const openOrCloseInsidersModal = () => {
  console.log(11111)
  isInsidersModalShow.value = !isInsidersModalShow.value
}
const submitEditInsiders = async () => {
  try {
    // 验证表单
    await insidersFormRef.value.validate()

    let res = await editPlant(InsidersFormState.value)
    console.log('res', res)
    isInsidersModalShow.value = !isInsidersModalShow.value
  } catch (error) {
    console.log('表单校验失败:', error)
    // 校验失败时不关闭弹窗
  }
}

const InsidersFormState = reactive({
  id: plantInfo.id,
  list: [  // 固定4项数据，字段包含 id（隐藏，提交时自动携带）、post、name、phone
    { id: '', post: '站长', name: '', phone: '' },
    { id: '', post: '副站长', name: '', phone: '' },
    { id: '', post: '值长', name: '', phone: '' },
    { id: '', post: '联系调试人', name: '', phone: '' }
  ]
})

const handleAddInsiders = async () => {
  let res = await addInsiders({
    plant_id: plantInfo.id,
    post: '站长',
    name: '王三',
    phone: '15896073333',
  })
  console.log('res', res)

}
// 重要组件厂商弹窗
let isFactoryModalShow = ref(false);
const factoryFormRef = ref(null)

const openOrCloseFactoryModal = () => {
  isFactoryModalShow.value = !isFactoryModalShow.value
}

const submitEditFactory = async () => {
  try {
    // 验证表单
    await factoryFormRef.value.validate()

    let res = await editPlant(FactoryFormState.value)
    console.log('res', res)
    isFactoryModalShow.value = !isFactoryModalShow.value
  } catch (error) {
    console.log('表单校验失败:', error)
    // 校验失败时不关闭弹窗
  }
}

const FactoryFormState = reactive({
  id: plantInfo.id,
  list: [  // 动态数据，字段包含 id、component_name、factory_name
    { id: '', component_name: '', factory_name: '' }
  ]
})

const addFactoryItem = () => {
  FactoryFormState.list.push({ id: '', component_name: '', factory_name: '' })
}

const removeFactoryItem = (index) => {
  if (FactoryFormState.list.length > 1) {
    FactoryFormState.list.splice(index, 1)
  }
}

// 易损部件型号弹窗
let isVulnerableModalShow = ref(false);
const vulnerableFormRef = ref(null)

const openOrCloseVulnerableModal = () => {
  isVulnerableModalShow.value = !isVulnerableModalShow.value
}

const submitEditVulnerable = async () => {
  try {
    // 验证表单
    await vulnerableFormRef.value.validate()

    let res = await editPlant(VulnerableFormState.value)
    console.log('res', res)
    isVulnerableModalShow.value = !isVulnerableModalShow.value
  } catch (error) {
    console.log('表单校验失败:', error)
    // 校验失败时不关闭弹窗
  }
}

const VulnerableFormState = reactive({
  id: plantInfo.id,
  list: [  // 动态数据，字段包含 id、type、model
    { id: '', type: '', model: '' }
  ]
})

const addVulnerableItem = () => {
  VulnerableFormState.list.push({ id: '', type: '', model: '' })
}

const removeVulnerableItem = (index) => {
  if (VulnerableFormState.list.length > 1) {
    VulnerableFormState.list.splice(index, 1)
  }
}

// 运行计划弹窗
let isPlanModalShow = ref(false);
const planFormRef = ref(null)

const openOrClosePlanModal = () => {
  isPlanModalShow.value = !isPlanModalShow.value
}

const submitEditPlan = async () => {
  try {
    // 验证表单
    await planFormRef.value.validate()

    let res = await editPlant(PlanFormState.value)
    console.log('res', res)
    isPlanModalShow.value = !isPlanModalShow.value
  } catch (error) {
    console.log('表单校验失败:', error)
    // 校验失败时不关闭弹窗
  }
}

const PlanFormState = reactive({
  plant_id: plantInfo.id,
  day_charge: '',
  single_run_time: '',
  actual_loaded: '',
  actual_loaded_unit: ''
})


onMounted(async () => {
  await queryDataInfo()
})



const queryDataInfo = async () => {
  await getPlantInsidersInfo({ plant_id: plantInfo.id })

  await getPlantFactoryInfo({ plant_id: plantInfo.id })

  await getPlantVulnerableInfo({ plant_id: plantInfo.id })

  await getPlantPlanInfo({ plant_id: plantInfo.id })
}


</script>

<style scoped>
.station-info-page {
  background-color: #E9EEF2;
}

/* 卡片容器样式 */
.info-block {
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 0 10px 10px 10px;
  background-color: #fff;
  margin-bottom: 8px;
}



/* 头部容器样式 */
.block-header-container {
  margin: 4px 0;
}

/* 标题样式 */
.block-title {
  gap: 8px;
}

.block-title div:last-child {
  text-align: left;
  font-size: 14px;
  line-height: 20px;
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

.responsiblePersonTitle {
  font-size: 12px;
  line-height: 22px;
  color: #788295;
  font-weight: 400;
}

.responsiblePersonBody {
  font-size: 14px;
  line-height: 19px;
  color: #222222;
  font-weight: 400;
}

.cardTitle {
  font-size: 14px;
  line-height: 19px;
  color: #222222;
  font-weight: 600;
}
</style>

<style>
.custom-divider {
  height: 2px;
  background-color: #f0f0f0;
  margin: 20px 0;
}

.insiders-form-wrapper {
  height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.insiders-form-wrapper::-webkit-scrollbar {
  width: 6px;
}

.insiders-form-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.insiders-form-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.insiders-form-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 重要组件厂商表单样式 */
.factory-form-wrapper .form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.factory-form-wrapper .form-item-half {
  flex: 1;
  margin-bottom: 0;
}

.factory-form-wrapper .delete-btn-wrapper {
  display: flex;
  align-items: center;
  padding-top: 30px;
}

.factory-form-wrapper .delete-btn {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.factory-form-wrapper .custom-divider {
  margin: 16px 0;
}

.factory-form-wrapper .mb-4 {
  margin-bottom: 16px;
}

.factory-form-item {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fafafa;
}

/* 易损部件表单样式 */
.vulnerable-form-wrapper .form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.vulnerable-form-wrapper .form-item-half {
  flex: 1;
  margin-bottom: 0;
}

.vulnerable-form-wrapper .delete-btn-wrapper {
  display: flex;
  align-items: center;
  padding-top: 30px;
}

.vulnerable-form-wrapper .delete-btn {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vulnerable-form-wrapper .custom-divider {
  margin: 16px 0;
}

.vulnerable-form-wrapper .mb-4 {
  margin-bottom: 16px;
}

.vulnerable-form-item {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fafafa;
}

/* 运行计划表单样式 */
.plan-form-wrapper .ant-form-item {
  margin-bottom: 20px;
}

.plan-form-wrapper .ant-input[disabled] {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.plan-form-wrapper .ant-select {
  width: 100%;
}

/* 基础信息表单样式 */
.basic-info-form .ant-form-item {
  margin-bottom: 20px;
}

.basic-info-form .ant-input-number-group-wrapper {
  width: 100%;
}

.basic-info-form .ant-input-number-group-addon {
  padding: 0;
}

.basic-info-form .ant-select {
  width: 100%;
}

.basic-info-form .ant-date-picker {
  width: 100%;
}

/* 地理信息表单样式 */
.geo-info-form .ant-form-item {
  margin-bottom: 16px;
}

.geo-info-form .ant-input-number {
  width: 100%;
}
</style>
