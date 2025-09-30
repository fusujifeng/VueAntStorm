<template>
  <div class="device-info">
    <!-- 设备卡片区域 -->
    <a-flex
        vertical
        gap="8"
        style="height: 100%"
    >
      <!--      设备总体情况的v-for列表区域-->

      <a-flex
          vertical
              gap="8"
              style="overflow-y: scroll"
          :style="{
    overflowY: 'scroll', // 等价于overflow-y: scroll
    height: deviceTotaInfoList.length >= 2 ? '290px' : '145px'
  }"

      >
      <div v-for="item in deviceTotaInfoList" :key="item.id">
        <EditCard title="设备总体情况"
                  style="height: 140px;min-height: 140px;white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
    "
                  :editFunction="
					() => {
						handleEditDevice(item)
					}
				"
                  :edit-button-text="'编辑'"
        >
          <template #content>
            <a-flex
                justify="start"
                :gap="48"
                style="overflow-x: scroll"
            >
              <!--          参数-->
              <a-flex align="center">
                <a-avatar
                    :src="deviceImg"
                    shape="square"
                    style="margin-right: 16px"
                    :size="80"
                />
                <div class="  ">
                  <h3>{{ item.model }}</h3>
                  <a-flex
                      gap="0.5"
                      style="margin: 8px 0;min-width: 500px"
                  >
                    <a-tag
                        color="#DEF2FF"
                        style="
											font-size: 12px;
											color: #0099f2;
											border: 1px solid #74ceff;
											border-radius: 4px;
										"
                        @click="()=>{handleDownloadDeviceFile({id:item.id,type:1})}"
                    >
                      <div>
                        <a-flex align="center" gap="6">
      <span style="font-size: 12px;">
        {{ item.id ? item.param_file_original_name : '加载中...' }}
      </span>
                          <downloadIcon v-if="item.id"/>
                        </a-flex>
                      </div>
                    </a-tag>
                    <a-tag
                        color="#DEF2FF"
                        style="
											font-size: 12px;
											color: #0099f2;
											border: 1px solid #74ceff;
											border-radius: 4px;
										"
                    >
                      ESGU:{{ item.have_esgu }}
                    </a-tag>
                    <a-tag
                        color="#DEF2FF"
                        style="
											font-size: 12px;
											color: #0099f2;
											border: 1px solid #74ceff;
											border-radius: 4px;
										"
                    >
                      {{ item.non_standard_code }}
                    </a-tag>
                  </a-flex>
                  <a-flex
                      class="device-details"
                      gap="3"
                  >
<!--                    集中式-->
                    <div v-if="item?.modelType===1">
                      <span>设备总数:{{ item.device_count }}台</span>
                      |
                      <span>并机类型:{{ item.parallel_type }}台</span>
                      |
                      <span>并机数量:{{ item.parallel_amount }}台</span>
                      |
                    </div>

<!--                    组串式-->
                    <div v-if="item?.modelType===2">
                    <span>设备总数:{{ item.device_count }}台</span>
                    |
                    <span>一体机机架:{{ item.esacaio_rack_amount }}台</span>
                    |
                    <span>一体机PCS:{{ item.esacaio_pcs_amount }}台</span>
                    |
                    <span>一体机控制方式:{{ item.esacaio_control_way }}</span>
                    </div>

                  </a-flex>
                </div>
              </a-flex>
              <!--          BMS-->
              <a-flex
                  align="center"
                  style="min-width: 500px"
              >
                <a-avatar
                    :src="BMS_img"
                    shape="square"
                    style="margin-right: 16px"
                    :size="45"
                />

                <div class="  ">
                  <h3>
                    通讯类型:{{ item.bms_comm_type }}
                  </h3>
                  <a-flex
                      gap="0.5"
                      style="margin: 8px 0"
                  >
                    <a-tag
                        color="#F1F9E6"
                        style="
											font-size: 12px;
											color: #67b100;
											border: 1px solid #bee38a;
											border-radius: 4px;
										"
                    >
                      {{ item.comm_card_version }}
                    </a-tag>
                    <a-tag
                        color="#DEF2FF"
                        style="
											font-size: 12px;
											color: #0099f2;
											border: 1px solid #74ceff;
											border-radius: 4px;
										"
                    >
                      {{ item.bms_comm_type }}
                    </a-tag>
                  </a-flex>
                  <a-flex
                      class="device-details"
                      gap="3"
                  >
                    <span>上位机设备类型</span>
                    <span>{{ item.hc_device_type }}</span>

                  </a-flex>
                </div>
              </a-flex>
              <!--          EMS-->
              <a-flex align="center">
                <a-avatar
                    :src="EMS_img"
                    shape="square"
                    style="margin-right: 16px"
                    :size="45"
                />

                <div class="  ">
                  <h3>通讯类型:{{ item.ems_comm_type }}</h3>
                  <a-flex
                      gap="0.5"
                      style="margin: 8px 0"
                  >
                    <a-tag
                        color="#F1F9E6"
                        style="
											font-size: 12px;
											color: #67b100;
											border: 1px solid #bee38a;
											border-radius: 4px;
										"
                    >
                      DI类型：常开
                    </a-tag>
                  </a-flex>
                  <a-flex
                      class="device-details"
                      gap="3"
                  >
                    <span>DI链接设备</span>
                    <span>{{ item.bms_di_device }}</span>
                  </a-flex>
                </div>
              </a-flex>
            </a-flex>
          </template>
        </EditCard>
      </div>
      </a-flex>

      <!-- 设备列表区域 -->
      <EditCard title="设备列表" style="flex: 1; min-height: 0; display: flex; flex-direction: column;">
        <template #content>
          <div style="height: 100%; display: flex; flex-direction: column;">
            <a-flex justify="space-between" style="margin-bottom: 8px;">
              <AdvanceSearch
                  v-model="filterParams"
                  :filterOptions="filterOptions"
                  :filterSearch="filterSearch"
                  :reset="reset"
                  style="min-width: 700px"
              />
              <a-space>
                <a-button @click="openUploadDeviceIPMatchModal">
                上传设备IP匹配表
              </a-button>
              <!--                导出通讯配置表-->
              <a-button @click="handleExportParam">
                导出通讯配置表
              </a-button>
              <a-button @click="openEquipmentNumberSortModal">配置设备编号</a-button>
              </a-space>
            </a-flex>

            <div style="flex: 1; min-height: 0;">
              <my-table
                  :dataSource="dataSource"
                  :columns="columns"
                  style="height: 100%"
                  :scroll="{ x: '1160px', y: 'calc(100% - 60px)' }"
                  :pagination="false"
              >
                <template #emptyText>
                  <EmptyComp></EmptyComp>
                </template>
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column?.dataIndex === 'operation'">
                    <a-button
                        type="link"
                        size="small"
                        @click="openDetailShowModal(record)"
                    >
                      详情
                    </a-button>
                    <a-button
                        type="link"
                        size="small"
                        @click="openDetailEditModal(record)"
                    >
                      编辑
                    </a-button>
                    <a-button
                        type="link"
                        size="small"
                        @click="handleViewHistoricalFaults(record)"
                    >
                      查看历史故障
                    </a-button>
                  </template>
                </template>
              </my-table>
            </div>
            
            <MyPagination
                v-if="totalNumber > 0"
                v-model:page="reqParams.page"
                v-model:rows="reqParams.rows"
                :total="totalNumber"
                style="margin-top: 16px; text-align: right;"
            ></MyPagination>
          </div>
        </template>
      </EditCard>
    </a-flex>
    <!-- 设备总体情况编辑弹窗 -->
    <a-modal
        v-model:open="editCentralizedModalVisible"
        title="编辑设备信息"
        width="480px"
        @ok="handleEditSubmit"
        @cancel="handleEditCancel"
        :mask-closable="false"
        centered
    >
      <a-form
          ref="editFormRef"
          :model="editInfoForm"
          :rules="editFormRules"
          layout="vertical"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 23 }"
          style="height: 80vh;overflow-y: scroll;"
      >
        <a-divider style="margin: 10px 0 24px 0"/>

        <!--          基础信息-->
        <div style="margin-bottom: 18px;">
          <a-flex align="center" gap="8">
            <div class="title-bar"></div>
            <div style="font-weight: 600;">基础信息</div>
          </a-flex>
        </div>
        <!--集中式-->
        <div v-if="editInfoForm.modelType===1">
          <a-form-item label="并机类型"
                       name="parallel_type"
                       required
          >
            <a-select v-model:value="editInfoForm.parallel_type"
                      mode="multiple" placeholder=" ">
              <a-select-option value="交流侧并联">交流侧并联</a-select-option>
              <a-select-option value="直流侧并联">直流侧并联</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="并机数量"
                       name="parallel_amount"
                       required
          >
            <a-select
                v-model:value="editInfoForm.parallel_amount"
                placeholder="请输入并机数量"
                style="width: 100%"
            >
              <a-select-option :value="1">1</a-select-option>
              <a-select-option :value="2">2</a-select-option>
              <a-select-option :value="3">3</a-select-option>
              <a-select-option :value="4">4</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="6">6</a-select-option>
              <a-select-option :value="7">7</a-select-option>
              <a-select-option :value="8">8</a-select-option>
              <a-select-option :value="9">9</a-select-option>
              <a-select-option :value="10">10</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <!--组串式-->
        <div v-if="editInfoForm.modelType===2">
          <a-form-item label="一体机机架数量"
                       name="esacaio_rack_amount"
                       required
          >
            <a-select
                v-model:value="editInfoForm.esacaio_rack_amount"
                placeholder="请输入并机数量"
                style="width: 100%"
            >
              <a-select-option :value="1">1</a-select-option>
              <a-select-option :value="2">2</a-select-option>
              <a-select-option :value="3">3</a-select-option>
              <a-select-option :value="4">4</a-select-option>
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="6">6</a-select-option>
              <a-select-option :value="7">7</a-select-option>
              <a-select-option :value="8">8</a-select-option>
              <a-select-option :value="9">9</a-select-option>
              <a-select-option :value="10">10</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="一体机PCS数量"
                       name="esacaio_pcs_amount"
                       required
          >
            <a-select
                v-model:value="editInfoForm.esacaio_pcs_amount"
                placeholder="请输入并机数量"
                style="width: 100%"
            >
              <a-select-option
                  v-for="num in 64"
                  :key="num"
                  :value="num"
              >
                {{ num }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="一体机控制方式"
                       name="esacaio_control_way"
                       required
          >
            <a-select
                v-model:value="editInfoForm.esacaio_control_way"
                placeholder="请输入并机数量"
                style="width: 100%"
            >
              <a-select-option value="按一体机控制">按一体机控制</a-select-option>
              <a-select-option value="按机架控制">按机架控制</a-select-option>
              <a-select-option value="按单机PCS控制">按单机PCS控制</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <a-form-item label="是否有ESGU"
                     name="have_esgu"
                     required
        >
          <a-select v-model:value="editInfoForm.have_esgu">
            <a-select-option value="是">是</a-select-option>
            <a-select-option value="否">否</a-select-option>
          </a-select>
        </a-form-item>
<!--        非标需求编码是非必填-->
        <a-form-item label="非标需求编码"
                     name="non_standard_code"

        >
          <a-input
              v-model:value="editInfoForm.non_standard_code"
              placeholder="请输入非标需求编码"
          />
        </a-form-item>

        <a-form-item label="设备参数文件"
                     name="paramFileList"
        >
          <a-flex :gap="12" align="center" justify="space-between">
            <div class="file-name-preview">
              {{ paramFileList && paramFileList[0]?.name || '未选择文件' }}
            </div>
            <a-upload
                v-model:file-list="paramFileList"
                name="file"
                :action="false"
                @change="handleFileUpdate(1)"
                :max-count="1"
                :showUploadList="false"
            >
              <a-button>
                <UploadOutlined/>
                选择文件
              </a-button>
            </a-upload>
          </a-flex>
        </a-form-item>
        <!--        EMS通讯类型-->
        <div style="margin-bottom: 18px;">
          <a-flex align="center" gap="8">
            <div class="title-bar"></div>
            <div style="font-weight: 600;">EMS通讯信息</div>
          </a-flex>
        </div>

        <a-form-item label="通讯类型"
                     name="ems_comm_type"
                     required
        >
          <a-select v-model:value="editInfoForm.ems_comm_type"
                    mode="multiple" placeholder=" ">
              <a-select-option
                  v-for="item in ems_comm_type_dictType?.children"
                  :key="item.id"
                  :value="item.value"
              >
                {{ item.name['zh-Hans'] }}
              </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="通讯配置文件"
                     name="commFileList"
        >
          <a-flex :gap="12" align="center" justify="space-between">
            <div class="file-name-preview">
              {{commFileList&&commFileList[0]?.name || '未选择文件' }}
            </div>
            <a-upload
                v-model:file-list="commFileList"
                name="file"
                :action="false"
                @change=" handleFileUpdate(2)"
                :max-count="1"
                :showUploadList="false"
            >
              <a-button>
                <UploadOutlined/>
                选择文件
              </a-button>
            </a-upload>
          </a-flex>
        </a-form-item>
        <a-form-item label="通讯卡版本"
                     name="comm_card_version"
                     required
        >
          <a-input v-model:value="editInfoForm.comm_card_version"/>
        </a-form-item>
        <a-form-item label="上位机设备类型"
                     name="hc_device_type"
                     required
        >
          <a-select v-model:value="editInfoForm.hc_device_type"
                    mode="multiple" placeholder="请选择上位机设备类型">
              <a-select-option
                  v-for="item in hc_device_type_dictType?.children"
                  :key="item.id"
                  :value="item.value"
              >
                {{ item.name['zh-Hans'] }}
              </a-select-option>
          </a-select>
        </a-form-item>

        <!--        BMS通讯类型-->
        <div style="margin-bottom: 18px;">
          <a-flex align="center" gap="8">
            <div class="title-bar"></div>
            <div style="font-weight: 600;">BMS通讯信息</div>
          </a-flex>
        </div>
        <a-form-item label="通讯类型"
                     name="bms_comm_type"
                     required
        >
          <a-select v-model:value="editInfoForm.bms_comm_type">
              <a-select-option
                  v-for="item in bms_comm_type_dictType?.children"
                  :key="item.id"
                  :value="item.value"
              >
                {{ item.name['zh-Hans'] }}
              </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="DI类型"
                     name="bms_di_type"
                     required
        >
          <a-select v-model:value="editInfoForm.bms_di_type">
              <a-select-option
                  v-for="item in bms_di_type_dictType?.children"
                  :key="item.id"
                  :value="item.value"
              >
                {{ item.name['zh-Hans'] }}
              </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="DI链接设备"
                     name="bms_di_device"
                     required
        >
          <a-select v-model:value="editInfoForm.bms_di_device">
              <a-select-option
                  v-for="item in bms_di_device_dictType?.children"
                  :key="item.id"
                  :value="item.value"
              >
                {{ item.name['zh-Hans'] }}
              </a-select-option>
          </a-select>
        </a-form-item>


      </a-form>
    </a-modal>


    <!-- 设备记录编辑弹窗 -->
    <a-modal
        v-model:open="recordEditModalVisible"
        title="设备信息编辑-设备详情"
        width="600px"
        @ok="handleRecordEditSubmit"
        @cancel="handleRecordEditCancel"
    >
      <a-form
          ref="recordEditFormRef"
          :model="recordEditForm"
          :rules="recordEditFormRules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
      >
        <a-form-item
            label="设备编号"
            name="code"
        >
          <a-input
              v-model:value="recordEditForm.code"
              placeholder="请输入设备编号"
          />
        </a-form-item>

        <a-form-item
            label="设备型号"
            name="model"
        >
          <a-input
              v-model:value="recordEditForm.model"
              placeholder="请输入设备型号"
          />
        </a-form-item>

        <a-form-item
            label="设备类型"
            name="type"
        >
          <a-input
              v-model:value="recordEditForm.type"
              placeholder="请输入设备类型"
          />
        </a-form-item>

        <a-form-item
            label="序列号"
            name="sn"
        >
          <a-input
              v-model:value="recordEditForm.sn"
              placeholder="请输入序列号"
          />
        </a-form-item>

        <a-form-item
            label="主ARM版本"
            name="arm_version_main"
        >
          <a-input
              v-model:value="recordEditForm.arm_version_main"
              placeholder="请输入主ARM版本"
          />
        </a-form-item>

        <a-form-item
            label="辅ARM版本"
            name="arm_version_assist"
        >
          <a-input
              v-model:value="recordEditForm.arm_version_assist"
              placeholder="请输入辅ARM版本"
          />
        </a-form-item>

        <a-form-item
            label="FPGA版本"
            name="fpga_version"
        >
          <a-input
              v-model:value="recordEditForm.fpga_version"
              placeholder="请输入FPGA版本"
          />
        </a-form-item>

        <a-form-item
            label="菜单版本"
            name="menu_version"
        >
          <a-input
              v-model:value="recordEditForm.menu_version"
              placeholder="请输入菜单版本"
          />
        </a-form-item>

        <a-form-item
            label="HMI版本"
            name="hmi_version"
        >
          <a-input
              v-model:value="recordEditForm.hmi_version"
              placeholder="请输入HMI版本"
          />
        </a-form-item>

        <a-form-item
            label="关键器件"
            name="key_part_names"
        >
          <a-textarea
              v-model:value="recordEditForm.key_part_names"
              placeholder="请输入关键器件名称，多个用换行分隔"
              :rows="3"
          />
        </a-form-item>

        <a-form-item
            label="批次配置"
            name="is_batch_conf"
        >
          <a-input
              v-model:value="recordEditForm.is_batch_conf"
              placeholder="请输入批次配置"
          />
        </a-form-item>

        <a-form-item
            label="IP地址"
            name="ip_address"
        >
          <a-input
              v-model:value="recordEditForm.ip_address"
              placeholder="请输入IP地址"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!--    设备详情展示的弹窗-->
    <a-modal
        v-model:open="customDetailModalVisible"
        title="设备详情"
        width="480px"
        :footer="null"
        :mask-closable="false"
        centered
    >
      <div class="custom-device-detail-content">
        <div class="detail-item">
          <span class="detail-label">设备型号：</span>
          <span class="detail-value">{{ customDeviceDetail.model || '--' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">设备类型：</span>
          <span class="detail-value">{{ customDeviceDetail.type || '--' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">设备SN码：</span>
          <span class="detail-value">{{ customDeviceDetail.sn || '--' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">软件版本：</span>
          <div class="software-versions">
            <div class="version-item">
              <span class="version-label">主ARM：</span>
              <span class="version-value">{{ customDeviceDetail.arm_version_main || '--' }}</span>
            </div>
            <div class="version-item">
              <span class="version-label">辅ARM：</span>
              <span class="version-value">{{ customDeviceDetail.arm_version_assist || '--' }}</span>
            </div>
            <div class="version-item">
              <span class="version-label">FPGA：</span>
              <span class="version-value">{{ customDeviceDetail.fpga_version || '--' }}</span>
            </div>
            <div class="version-item">
              <span class="version-label">功能码表：</span>
              <span class="version-value">{{ customDeviceDetail.menu_version || '--' }}</span>
            </div>
            <div class="version-item">
              <span class="version-label">HMI：</span>
              <span class="version-value">{{ customDeviceDetail.hmi_version || '--' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-label">关键零部件：</span>
          <div class="key-parts">
            <div
                v-for="(part, index) in customDeviceDetail.key_part"
                :key="index"
                class="part-item"
            >
              {{ part.name || '--' }}
            </div>
            <div v-if="!customDeviceDetail.key_part || customDeviceDetail.key_part.length === 0">
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 设备详情编辑弹窗 -->
    <a-modal
        v-model:open="detailEditModalVisible"
        title="设备详情编辑"
        width="480px"
        @ok="handleDetailEditSubmit"
        @cancel="handleDetailEditCancel"
        :mask-closable="false"
        centered
    >
      <a-form
          ref="detailEditFormRef"
          :model="detailEditForm"
          :rules="detailEditFormRules"
          layout="vertical"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 23 }"
          style="height: 80vh; overflow-y: scroll;"
      >
        <a-form-item
            label="设备编号"
            name="code"
        >
          <a-input
              v-model:value="detailEditForm.code"
              placeholder="请输入设备编号"
          />
        </a-form-item>

        <a-form-item
            label="设备型号"
            name="model"
        >
          <a-input
              v-model:value="detailEditForm.model"
              placeholder="请输入设备型号"
          />
        </a-form-item>

        <a-form-item
            label="设备类型"
            name="type"
        >
          <a-select v-model:value="detailEditForm.type"
                    placeholder="请输入设备类型">
          <a-select-option
              v-for="item in deviceType_dictType?.children"
              :key="item.id"
              :value="item.value"
          >
            {{ item.name['zh-Hans'] }}
          </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
            label="设备SN码"
            name="sn"
        >
          <a-input
              v-model:value="detailEditForm.sn"
              placeholder="请输入设备SN码"
          />
        </a-form-item>

        <a-form-item
            label="软件版本"
        >
          <a-flex vertical gap="8"
                  style="background-color: #F5F7F8; padding: 5px 12px 5px 12px; border-radius: 4px;">
            <a-form-item
                label="主ARM"
                name="arm_version_main"
                :no-style="true"
                required
            >
              <a-input
                  v-model:value="detailEditForm.arm_version_main"
                  placeholder="请输入主ARM版本"
              />
            </a-form-item>

            <a-form-item
                label="辅ARM"
                name="arm_version_assist"
                :no-style="true"
                required
            >
              <a-input
                  v-model:value="detailEditForm.arm_version_assist"
                  placeholder="请输入辅ARM版本"
              />
            </a-form-item>

            <a-form-item
                label="FPGA"
                name="fpga_version"
                :no-style="true"
                required
            >
              <a-input
                  v-model:value="detailEditForm.fpga_version"
                  placeholder="请输入FPGA版本"
              />
            </a-form-item>

            <a-form-item
                label="功能码表"
                name="menu_version"
                :no-style="true"
                required
            >
              <a-input
                  v-model:value="detailEditForm.menu_version"
                  placeholder="请输入功能码表版本"
              />
            </a-form-item>

            <a-form-item
                label="HMI"
                name="hmi_version"
                :no-style="true"
                required
            >
              <a-input
                  v-model:value="detailEditForm.hmi_version"
                  placeholder="请输入HMI版本"
              />
            </a-form-item>
          </a-flex>
        </a-form-item>

        <a-form-item
            label="关键零部件"
            required
        >
          <a-flex vertical gap="8" style="background-color: #F5F7F8; padding: 5px 12px 5px 12px; border-radius: 4px;">
            <template v-for="(item, index) in detailEditForm.key_part" :key="index">
              <a-form-item
                  :no-style="true"
                  :name="[`key_part`, index, 'name']"
              >
                <a-space :style="{ width: '100%' }">
                  <a-input
                      v-model:value="item.name"
                      placeholder="请输入零部件名称"
                      style="flex: 1"
                  />
                  <a-button
                      type="text"
                      danger
                      @click="removeKeyPart(index)"
                      style="width: 100px;"
                      :disabled="detailEditForm.key_part.length <= 1"
                  >
                    删除
                  </a-button>
                </a-space>
              </a-form-item>
            </template>
            <a-button type="dashed" @click="addKeyPart" block>
              + 添加零部件
            </a-button>
          </a-flex>
        </a-form-item>

        <a-form-item
            label="同型号批量配置"
            name="is_batch_conf"
        >
          <a-select
              v-model:value="detailEditForm.is_batch_conf"
              placeholder="请选择"
          >
            <a-select-option value="是">是</a-select-option>
            <a-select-option value="否">否</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!--    设备编号排序弹窗-->
    <a-modal title="配置设备编号"
             v-model:open="equipmentNumberSortModal"
             :mask-closable="false"
             centered
             @ok="handleSortFunc">
      <a-divider style="margin: 12px 0 24px 0"/>
      <a-flex gap="32">
        <div style="width: 98px;height: 266px;overflow-y: scroll;border: 1px solid #E9EEF2;border-radius: 4px;">
          <a-flex vertical align="center" justify="start" style="text-align: left;">
            预览
            <p v-for="item in numberSortForm.list">{{ item }}</p>
          </a-flex>
        </div>
        <div style="flex:1;border: 1px solid #E9EEF2;border-radius: 4px;">
          <a-form
              ref="editFormRef"
              :model="numberSortForm"
              :rules="editFormRules"
              layout="vertical"
              :label-col="{ span: 20 }"
              :wrapper-col="{ span: 20 }"
              style="margin: 10px 0 0 12px;overflow-y: scroll;"
          >

            <a-form-item label="选择设备型号"
                         name="device_model"
                         required
            >
              <a-select
                  v-model:value="numberSortForm.device_model"
                  :options="deviceTotaInfoList"
                  :field-names="{ label: 'model', value: 'model' }"
                  style="width: 300px"
                  label-field="model"
                  value-field="model"
                  @change="changeDeviceModel"
              >
              </a-select>
            </a-form-item>

            <a-checkbox v-model:checked="numberSortForm.enableAutomaticGrouping">
              启用自动分组
            </a-checkbox>


            <a-form-item label="每组数量"
                         name="countPerGroup"
                         required
                         v-if="numberSortForm.enableAutomaticGrouping"
                         style="margin-top:16px"
            >
              <a-input-number v-model:value="numberSortForm.countPerGroup"
              :max="numberSortForm.list.length" :min="1"/>
            </a-form-item>


          </a-form>
        </div>
      </a-flex>
    </a-modal>

    <!--    IP匹配表编辑弹窗-->
    <a-modal  title="上传IP匹配表"
              v-model:open="IPMatchModalIsShow"
              :mask-closable="false"
              @ok="submitIPMatch">
      <a-divider style="margin: 12px 0 24px 0"/>
      <a-upload-dragger
          v-model:fileList="IPMatchfileList"
          name="file"
          :multiple="true"
          :action="false"
          @change="handleChangeIPMatchFile"
          @drop="handleDrop"
      >
        <div class="">
          <PlusOutlined fill="#012122" style="width: 24px; height: 24px;" />
        </div>
        <p class="ant-upload-hint">
          拖拽电站文件至此，或点击上传
        </p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onMounted} from 'vue'
import {message} from 'ant-design-vue'
import {DesktopOutlined} from '@ant-design/icons-vue'
import type {FormInstance} from 'ant-design-vue'
import EditCard from '@/components/EditCard.vue'

// 用假数据替换缺失的图片资源
const deviceImg = '/favicon.ico'
const BMS_img = '/favicon.ico'
const EMS_img = '/favicon.ico'
const deleteIcon = 'delete'
const downloadIcon = 'download'

// 模拟缺失的hooks和函数
const useResetableRef = (initialValue: any) => ref(initialValue)
const useSpinning = () => ({
  spinning: ref(false),
  hide: () => {},
  show: () => {}
})
const useI18n = () => ({
  t: (key: string) => key
})

// 模拟缺失的网络请求函数
const editDeviceTotalInfo = async (data: any) => ({ success: true })
const editSingleDeviceDetailData = async (data: any) => ({ success: true })
const exportParam = async () => ({ success: true })
const getDeviceDetail = async (id: string) => ({ data: {} })
const getDeviceTotalInfo = async () => ({ data: [] })
const setDeviceCode = async (data: any) => ({ success: true })
const updateDeviceFile = async (data: any) => ({ success: true })

// 模拟store
const usePlantsStore = () => ({
  plantInfo: { id: '1', name: 'Test Plant' }
})

// 模拟常量
const deviceTypeSelectList = [
  { label: '类型1', value: '1' },
  { label: '类型2', value: '2' }
]

// 模拟组件
const AdvanceSearch = {
  name: 'AdvanceSearch',
  props: ['modelValue', 'filterOptions', 'filterSearch', 'reset'],
  template: '<div style="padding: 16px; background: #f5f5f5; border-radius: 6px;">高级搜索组件 (模拟)</div>'
}

const MyTable = {
  name: 'MyTable', 
  props: ['dataSource', 'columns', 'scroll', 'pagination'],
  template: '<a-table :dataSource="dataSource" :columns="columns" :scroll="scroll" :pagination="pagination"><template #emptyText><slot name="emptyText"></slot></template><template #bodyCell="scope"><slot name="bodyCell" v-bind="scope"></slot></template></a-table>'
}

const MyPagination = {
  name: 'MyPagination',
  props: ['page', 'rows', 'total'], 
  template: '<a-pagination :current="page" :pageSize="rows" :total="total" />'
}

const EmptyComp = {
  name: 'EmptyComp',
  template: '<a-empty description="暂无数据" />'
}

// 模拟plant对象
const plant = {
  getDeviceList: async (params: any) => ({ list: [], total: 0 }),
  downloadDeviceFile: async (params: any) => ({ success: true }),
  updateDeviceFile: async (formData: any, config: any) => ({ success: true }),
  uploadIpSet: async (formData: any, config: any) => ({ success: true }),
  exportParam: async (params: any) => 'mock,csv,data'
}

// 模拟util对象
const util = {
  downLoad: (filename: string, data: any) => {
    console.log(`下载文件: ${filename}`, data)
  }
}

// 模拟dict对象
const dict = {
  getDicts: async (params: any) => {
    console.log('模拟获取字典数据:', params)
    return { success: true, data: {} }
  }
}

const {t} = useI18n()
// 响应式数据
const loading = ref(false)
const showAddModal = ref(false)
const editingDevice = ref(null)
const deviceFormRef = ref()

// 设备总体情况数据 - 添加假数据
const deviceTotaInfoList = ref([
  {
    id: '1',
    model: 'PCS-100kW',
    modelType: 1,
    device_count: 5,
    parallel_type: '并联',
    parallel_amount: 3,
    have_esgu: '是',
    non_standard_code: 'NS001',
    param_file_original_name: 'config.json',
    bms_comm_type: 'CAN',
    comm_card_version: 'V1.2.3',
    hc_device_type: '上位机A',
    ems_comm_type: 'Modbus',
    bms_di_device: 'BMS设备1'
  }
])

const {spinning, hide, show} = useSpinning()
const plantInfo = usePlantsStore().plantInfo

// 响应式数据
const searchForm = reactive({
  deviceName: '',
  deviceType: ''
})

// 编辑弹窗相关
const editCentralizedModalVisible = ref(false)
const editFormRef = ref<FormInstance>()

// 设备记录编辑弹窗相关
const recordEditModalVisible = ref(false)
const recordEditFormRef = ref<FormInstance>()

// 设备详情编辑弹窗相关
const detailModalVisible = ref(false)
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
})

// 新增：设备详情展示弹窗
const customDetailModalVisible = ref(false)
const customDeviceDetail = reactive({
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
})


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
})

const recordEditFormRules = {
  code: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
  model: [{required: true, message: '请输入设备型号', trigger: 'blur'}],
  type: [{required: true, message: '请输入设备类型', trigger: 'blur'}],
  sn: [{required: true, message: '请输入序列号', trigger: 'blur'}]
}
const editInfoForm = reactive({
  id: undefined,
  model: undefined,
  modelType: undefined,
  parallel_type: [],
  parallel_amount: null,
  esacaio_rack_amount: null,
  esacaio_pcs_amount: null,
  esacaio_control_way: undefined,
  have_esgu: undefined,
  non_standard_code: undefined,
  param_file_original_name: undefined,
  param_file_obj_name: undefined,
  ems_comm_type: [],
  comm_file_original_name: undefined,
  comm_file_obj_name: undefined,
  comm_card_version: undefined,
  bms_comm_type: undefined,
  bms_di_type: undefined,
  bms_di_device: undefined,
  device_count: null,
  hc_device_type: [],
})

const editFormRules = {
  model: [{required: true, message: '请输入设备型号', trigger: 'blur'}],
}

// 设备表单
const deviceForm = reactive({
  deviceName: '',
  deviceType: '',
  deviceCode: '',
  status: '',
  location: '',
  installDate: null,
  description: ''
})

const deviceModelDict = ref<any>([])


const filterParams = ref({
  plant_id: undefined,
  keyword: undefined,
  model: undefined
})
const reset = () => {
  show()
  filterParams.value = {
    plant_id: undefined,
    keyword: undefined,
    model: undefined
  }
  if (reqParams.value.page !== 1) {
    reqParams.value.page = 1
  } else {
    queryDeviceList()
  }
}
const filterOptions = ref([
  {
    type: 'search',
    placeholder: t('deviceSearchPleaseholder'),
    value: 'keyword',
    width: 330
  },
  {
    type: 'select',
    placeholder: t('pleaseSelectDevice'),
    value: 'model',
    options: deviceTypeSelectList.map(item => ({label: item.model, value: item.model})),
    width: 250
  }
])

const filterSearch = () => {
  show()
  if (reqParams.value.page !== 1) {
    reqParams.value.page = 1
  } else {
    queryDeviceList()
  }
}

const reqParams = ref<any>({
  rows: 10,
  page: 1
})
watch([()=>reqParams.value.page, ()=>reqParams.value.rows], ([page, rows])=>{
  queryDeviceList()
})

const dataSource = ref([
  {
    id: '1',
    code: 'DEV001',
    model: 'Model-A',
    type: '类型1',
    sn: 'SN001',
    status: '正常',
    ip_address: '192.168.1.100'
  },
  {
    id: '2', 
    code: 'DEV002',
    model: 'Model-B',
    type: '类型2',
    sn: 'SN002',
    status: '异常',
    ip_address: '192.168.1.101'
  }
])
const totalNumber = ref<number>(2)

// 分页配置


//字典类型
const deviceType_dictType = ref(null)
const esacaio_control_way_dictType = ref(null)
const ems_comm_type_dictType = ref(null)
const hc_device_type_dictType = ref(null)
const bms_comm_type_dictType = ref(null)
const bms_di_type_dictType = ref(null)
const bms_di_device_dictType = ref(null)

onMounted(() => {
  dict.getDicts({
    codes: [
      'deviceType_dictType',
      'esacaio_control_way_dictType',
      'ems_comm_type_dictType',
      'hc_device_type_dictType',
      'bms_comm_type_dictType',
      'bms_di_type_dictType',
      'bms_di_device_dictType',

    ]
  }).then((res) => {
    deviceType_dictType.value = res.find((item) => item.code === 'deviceType_dictType')
    esacaio_control_way_dictType.value = res.find((item) => item.code === 'esacaio_control_way_dictType')
    ems_comm_type_dictType.value = res.find((item) => item.code === 'ems_comm_type_dictType')
    hc_device_type_dictType.value = res.find((item) => item.code === 'hc_device_type_dictType')
    bms_comm_type_dictType.value = res.find((item) => item.code === 'bms_comm_type_dictType')
    bms_di_type_dictType.value = res.find((item) => item.code === 'bms_di_type_dictType')
    bms_di_device_dictType.value = res.find((item) => item.code === 'bms_di_device_dictType')
  })

  queryDeviceList()
  queryDeviceTotalInfo()
})

const queryDeviceList = async () => {
  console.log(112233, filterParams.value)

  try {
    let {list, total} = await plant.getDeviceList({
      ...filterParams.value,
      ...reqParams.value
    })
    if (total > 0 && list.length === 0) {
      reqParams.value.page = reqParams.value.page - 1
    } else {
      dataSource.value = list
      totalNumber.value = total
    }
    hide()
  } catch (error) {
    hide()
  }
}

// 表格列定义
const columns = [
  {
    title: '设备编号',
    dataIndex: 'code',
    key: 'code',
    width: 100,
    ellipsis: true
  },
  {
    title: '设备型号',
    dataIndex: 'model',
    key: 'model',
    width: 160,
    ellipsis: true
  },
  {
    title: '设备类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    ellipsis: true
  },
  {
    title: '设备SN码',
    dataIndex: 'sn',
    key: 'sn',
    width: 140,
    ellipsis: true
  },
  {
    title: '设备IP地址',
    dataIndex: 'ip_address',
    key: 'ip_address',
    width: 140,
    ellipsis: true
  },
  {
    title: '设备软件版本',
    dataIndex: 'arm_version_main',
    key: 'arm_version_main',
    width: 180,
    ellipsis: true,
    customRender: ({ record }) => {
      // 1. 收集所有需要展示的字段（按顺序）
      const versionFields = [
        record?.arm_version_main,
        record?.arm_version_assist,
        record?.fpga_version,
        record?.menu_version,
        record?.hmi_version
      ];
      // 2. 过滤空值（排除 null/undefined/空字符串/纯空格），保留有效字段
      const validVersions = versionFields.filter(item =>
          item != null && item.toString().trim() !== ''
      );
      // 3. 有效字段用 "/" 拼接（无有效字段时返回空字符串，避免显示无意义内容）
      return validVersions.join('、');
    },
    ellipsis: true // 超出宽度显示省略号，鼠标悬浮看完整内容
  },
  {
    title: '关键零部件',
    dataIndex: 'key_part',
    key: 'key_part',
    width: 180,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 150,
    fixed: 'right'
  }
]

// 处理函数
const handleSearch = () => {
  console.log('搜索', searchForm)
}

const handleExport = () => {
  message.success('导出功能开发中')
}

const handleImport = () => {
  message.success('导入功能开发中')
}

const handleView = (record: any) => {
  console.log('查看详情', record)
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
  })
  detailModalVisible.value = true
}

// 打开设备详情展示的弹窗
const openDetailShowModal = async (record) => {
  let detail = await getDeviceDetail({id: record.id})
  console.log('查看自定义样式详情', detail)
  // 加载设备详情数据
  Object.assign(customDeviceDetail, {
    ...detail
  })
  customDetailModalVisible.value = true
}

const handleEditDevice = (item: any) => {

  editCentralizedModalVisible.value = true
  //加载id和设备型号
  editInfoForm.id = item.id
  editInfoForm.model = item.model
  //modelType: 1是集中式，2是组串式
  editInfoForm.modelType = item.modelType


  // 这里可以根据type加载不同的设备数据
  if (item?.modelType === 1) {
    // 加载集中式设备数据


    console.log('item1212', item)
    Object.assign(editInfoForm, item)
    console.log('editInfoForm', editInfoForm)
  }
  if (item?.modelType === 2) {
    // 加载组串式设备数据
    console.log('item1212', item)
    Object.assign(editInfoForm, item)
    console.log('editInfoForm', editInfoForm)
  }

  // 把多选框的空字符串换成[]
  if(editInfoForm.parallel_type==''){
    editInfoForm.parallel_type=[]
  }
  if(editInfoForm.ems_comm_type==''){
    editInfoForm.ems_comm_type=[]
  }
  if(editInfoForm.hc_device_type==''){
    editInfoForm.hc_device_type=[]
  }
}

const handleEditSubmit = async () => {
  try {
    console.log('editInfoForm?.modelType', editInfoForm?.modelType)
    await editFormRef.value?.validate()
    let sendData = {}
    console.log('editInfoForm?.modelType',editInfoForm?.modelType)
    if (editInfoForm?.modelType === 1) {
      //集中式
      sendData = {
        plant_id: plantInfo?.id,
        model: editInfoForm?.model,
        parallel_type: safeJoin(editInfoForm?.ems_comm_type, '、'),
        parallel_amount: Number(editInfoForm?.parallel_amount),
        have_esgu: editInfoForm?.have_esgu,
        non_standard_code: editInfoForm?.non_standard_code,
        ems_comm_type: safeJoin(editInfoForm?.ems_comm_type, '/'),
        hc_device_type: safeJoin(editInfoForm?.hc_device_type, '/'),
        comm_card_version: editInfoForm?.comm_card_version,
        bms_comm_type: editInfoForm?.bms_comm_type,
        bms_di_type: editInfoForm?.bms_di_type,
        bms_di_device: editInfoForm?.bms_di_device
      }
    }
    if (editInfoForm?.modelType === 2) {
      //组串式
      sendData = {
        plant_id: plantInfo?.id,
        model: editInfoForm?.model,
        esacaio_rack_amount: editInfoForm?.esacaio_rack_amount,
        esacaio_pcs_amount: editInfoForm?.esacaio_pcs_amount,
        esacaio_control_way: editInfoForm?.esacaio_control_way,
        have_esgu: editInfoForm?.have_esgu,
        non_standard_code: editInfoForm?.non_standard_code,
        param_file_original_name: editInfoForm?.param_file_original_name,
        ems_comm_type: safeJoin(editInfoForm?.ems_comm_type, ','),
        hc_device_type: safeJoin(editInfoForm?.hc_device_type, ','),
        comm_file_original_name: editInfoForm?.comm_file_original_name,
        comm_card_version: editInfoForm?.comm_card_version,
        bms_comm_type: editInfoForm?.bms_comm_type,
        bms_di_type: editInfoForm?.bms_di_type,
        bms_di_device: editInfoForm?.bms_di_device

      }
    }
    console.log('sendData',sendData)
    debugger
    await editDeviceTotalInfo({
      ...sendData
    })
    message.success('编辑设备信息成功')
    editCentralizedModalVisible.value = false
    queryDeviceTotalInfo()
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

// 工具函数：安全地将数组拼接为字符串
const safeJoin = (arr: any, separator: string) => {
  // 检查是否为数组，不是则返回原值（或空字符串）
  if (!Array.isArray(arr)) {
    return arr ?? ''; // 若为null/undefined则返回空字符串
  }
  // 过滤数组中的空值后再拼接
  return arr.filter(Boolean).join(separator);
};

const handleEditCancel = () => {
  editCentralizedModalVisible.value = false
  editFormRef.value?.resetFields()
}

const handleEditRecord = (record: any) => {
  console.log('编辑设备记录', record)
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
    key_part_names: record.key_part
        ? record.key_part.map((part: any) => part.name).join('\n')
        : '',
    is_batch_conf: record.is_batch_conf || '',
    ip_address: record.ip_address || ''
  })
  recordEditModalVisible.value = true
}

const handleRecordEditSubmit = async () => {
  try {
    await recordEditFormRef.value?.validate()
    console.log('提交设备记录编辑数据:', recordEditForm)
    message.success('设备信息更新成功')
    recordEditModalVisible.value = false
    // 这里可以调用API更新设备信息
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

const handleRecordEditCancel = () => {
  recordEditModalVisible.value = false
  recordEditFormRef.value?.resetFields()
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    运行: 'green',
    停机: 'red',
    维护中: 'orange',
    故障: 'red'
  }
  return colorMap[status] || 'default'
}


// 设备详情编辑弹窗相关
const detailEditModalVisible = ref(false)
const detailEditFormRef = ref<FormInstance>();
const detailEditForm = reactive({
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
  key_part: [{name: ''}],
  is_batch_conf: '否'
})

const detailEditFormRules = {
  code: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
  model: [{required: true, message: '请输入设备型号', trigger: 'blur'}],
  type: [{required: true, message: '请输入设备类型', trigger: 'blur'}],
  sn: [{required: true, message: '请输入设备SN码', trigger: 'blur'}],
  arm_version_main: [{required: true, message: '请输入主ARM版本', trigger: 'blur'}],
  arm_version_assist: [{required: true, message: '请输入辅ARM版本', trigger: 'blur'}],
  fpga_version: [{required: true, message: '请输入FPGA版本', trigger: 'blur'}],
  menu_version: [{required: true, message: '请输入功能码表版本', trigger: 'blur'}],
  hmi_version: [{required: true, message: '请输入HMI版本', trigger: 'blur'}],
  is_batch_conf: [{required: true, message: '请选择同型号批量配置', trigger: 'change'}]
}

// 添加关键零部件
const addKeyPart = () => {
  detailEditForm.key_part.push({name: ''})
}

// 移除关键零部件
const removeKeyPart = (index: number) => {
  if (detailEditForm.key_part.length <= 1) {
    return
  }
  detailEditForm.key_part.splice(index, 1)
}

// 打开设备详情编辑弹窗
const openDetailEditModal = async (record: any) => {
  let detail = await getDeviceDetail({id: record.id})
  console.log('编辑设备详情', detail)
  // 加载设备详情数据到编辑表单
  Object.assign(detailEditForm, {
    id: detail.id || '',
    code: detail.code || '',
    model: detail.model || '',
    type: detail.type || '',
    sn: detail.sn || '',
    arm_version_main: detail.arm_version_main || '',
    arm_version_assist: detail.arm_version_assist || '',
    fpga_version: detail.fpga_version || '',
    menu_version: detail.menu_version || '',
    hmi_version: detail.hmi_version || '',
    key_part: detail.key_part && detail.key_part.length > 0
        ? [...detail.key_part]
        : [{name: ''}],
    is_batch_conf: detail.is_batch_conf || '否'
  })
  detailEditModalVisible.value = true
}

// 处理设备详情编辑提交
const handleDetailEditSubmit = async () => {
  try {
    await detailEditFormRef.value?.validate()
    console.log('提交设备详情编辑数据:', detailEditForm)
    // 这里可以调用API更新设备信息
    message.success('编辑成功')
    detailEditModalVisible.value = false
    // 刷新设备列表
    await editSingleDeviceDetailData({
      ...detailEditForm,
      plant_id: plantInfo.id,
      //id=0为新增；id!=0为编辑(string型)
    })
    await queryDeviceList()
  } catch (error) {
    console.log('表单验证失败:', error)
  }
}

// 处理设备详情编辑取消
const handleDetailEditCancel = () => {
  detailEditModalVisible.value = false
  detailEditFormRef.value?.resetFields()
}

//设备总体情况查询
const queryDeviceTotalInfo = async () => {
  const deviceTypeSelectListMap = deviceTypeSelectList.reduce((map, item) => {
    map[item.model] = item.modelType;
    return map;
  }, {});

//组串式设备赋值
  const data = await getDeviceTotalInfo({
    plant_id: plantInfo.id,
  })

  deviceTotaInfoList.value = data.list.map(item => {
    // 如果list2中有对应的model，就添加modelType属性
    if (deviceTypeSelectListMap.hasOwnProperty(item.model)) {
      return {
        ...item,
        modelType: deviceTypeSelectListMap[item.model]
      };
    }
    // 没有匹配项则保持原结构
    return item;
  });
  console.log('deviceTotaInfoList', deviceTotaInfoList)
}

//文件下载(设备信息的设备总体情况中点击)
const handleDownloadDeviceFile = async (info: { id: string, type: number }) => {
  console.log('下载信息', info)
  await plant.downloadDeviceFile({
    id: info.id,
    type: info.type,  //int 类型 设备参数文件=1、通讯配置文件=2
  })
}

const paramFileList = ref([])
const commFileList = ref([])
//文件上传
const handleFileUpdate = async (type: number) => {
  // info 参数包含当前文件的状态和信息


  // const { file, fileList } = info;
  //
  // // 只处理上传成功的情况（status 为 'done'）
  // if (file.status !== 'done') {
  //   return; // 非成功状态直接返回，不执行后续逻辑
  // }
  const formData = new FormData()
  if (type === 1) {
    formData.append('file', paramFileList.value[0]?.originFileObj)
  }
  if (type === 2) {
    formData.append('file',commFileList.value[0]?.originFileObj)
  }
  formData.append('plant_code', plantInfo.code)
  formData.append('model', editInfoForm.model)
  //type:设备参数文件=1、通讯配置文件=2
  formData.append('type', type)

  const requestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }

  let data = await plant.updateDeviceFile(formData, requestConfig)

}

const IPMatchModalIsShow=ref(false)
const IPMatchfileList=ref([])
const openUploadDeviceIPMatchModal = ()=>{
  IPMatchModalIsShow.value=true
}
const handleChangeIPMatchFile=async ()=>{

}
const submitIPMatch = async ()=>{
  console.log('IPMatchfileList',IPMatchfileList.value)
  const formData = new FormData()
  formData.append('file', IPMatchfileList.value[0].originFileObj)
  formData.append('plant_id', plantInfo.id)

  const requestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }

  let data = await plant.uploadIpSet(formData, requestConfig)
  IPMatchModalIsShow.value=false
}


//配置设备编号
const equipmentNumberSortModal = ref(false)
const openEquipmentNumberSortModal = async () => {
  equipmentNumberSortModal.value = true
  numberSortForm.value.list=[]
  numberSortForm.value.device_model=undefined
}
//配置设备编号弹窗确定
const handleSortFunc = async () => {
 await setDeviceCode({
    plant_id: plantInfo.id,
    device_model: numberSortForm.value.device_model,
    list: numberSortForm.value.list,
 })
  equipmentNumberSortModal.value = false
  message.success('配置设备编号成功')
  await queryDeviceList()
}

//预览设备编号格式的list
const numberSortForm = ref({
  list: [],
  device_model: '',
  countPerGroup: 1,
  enableAutomaticGrouping: false
})

watch(
    () => numberSortForm.value.enableAutomaticGrouping,
    (newVal, oldVal) => {
      if(numberSortForm.value.enableAutomaticGrouping===false){
        numberSortForm.value.countPerGroup=1
      }
    },
)
const selectModelDeviceCount=ref(0)
watch(
    () => numberSortForm.value.countPerGroup,
    (newVal, oldVal) => {
      if(numberSortForm.value.enableAutomaticGrouping===true){
        let newList=generateFormattedList(selectModelDeviceCount.value, numberSortForm.value.countPerGroup)
        console.log('newLIst',newList)
        numberSortForm.value.list=newList
      }
    },
)

// 设备型号改变时，更新设备编号格式
const changeDeviceModel = (selectedModel) => {
  const selectedItem = deviceTotaInfoList.value.find(
      item => item.model === selectedModel
  );

  if (selectedItem) {
    // 处理选中项的逻辑（例如获取其他属性）
    console.log('选中的设备信息:', selectedItem);
    selectModelDeviceCount.value=Number(selectedItem.device_count)

    numberSortForm.value.list = generateFormattedList(selectModelDeviceCount.value, numberSortForm.value.countPerGroup);

  }
}

const generateFormattedList=(listLength, countPerGroup)=> {
  if (typeof listLength !== 'number' || listLength < 0) {
    throw new Error('listLength必须是非负整数');
  }
  if (typeof countPerGroup !== 'number' || countPerGroup <= 0) {
    throw new Error('countPerGroup必须是正整数');
  }

  // 生成结果数组
  const result = [];

  // 当每组数量为1时，直接生成数字字符串
  if (countPerGroup === 1) {
    for (let i = 1; i <= listLength; i++) {
      result.push(String(i));
    }
    return result;
  }

  // 当每组数量大于1时，生成"组号-组内序号"格式
  for (let i = 0; i < listLength; i++) {
    const groupNumber = Math.floor(i / countPerGroup) + 1;
    const positionInGroup = (i % countPerGroup) + 1;
    result.push(`${groupNumber}-${positionInGroup}`);
  }

  return result;
}


const handleExportParam = async() => {
let data=await plant.exportParam({plant_id: plantInfo.id})
  console.log('121212',data)

  util.downLoad('通讯配置表.csv',data)
  message.success('下载成功')
}
</script>

<style scoped>
.device-info {
  padding: 0;
  height: calc(100vh - 92px);
}

.device-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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

/* 新增：设备详情展示的弹窗样式 */
.custom-device-detail-content {
  padding: 16px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-label {
  display: inline-block;
  width: 100px;
  font-weight: 500;
  color: #333;
}

.detail-value {
  background-color: #F5F7F8;
  padding: 5px 12px;
  border-radius: 4px;
  min-width: 200px;
  display: inline-block;
}

.software-versions {
  margin-top: 8px;
  margin-left: 100px;
}

.version-item {
  margin-bottom: 8px;
}

.version-label {
  display: inline-block;
  width: 80px;
  font-weight: normal;
  color: #666;
}

.version-value {
  background-color: #F5F7F8;
  padding: 5px 12px;
  border-radius: 4px;
  min-width: 200px;
  display: inline-block;
}

.key-parts {
  margin-top: 8px;
  margin-left: 100px;
}

.part-item {
  background-color: #F5F7F8;
  padding: 5px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  min-width: 200px;
  display: inline-block;
}

/* 标题前的彩色条 - 统一为#0099F2 */
.title-bar {
  width: 2px;
  height: 13px;
  border-radius: 2px;
  background-color: #0099F2;
}

.file-name-preview {
  color: #333;
  flex: 1;
  font-size: 14px;
  width: 225px;
  border-radius: 4px;
  border: 1px solid #B1B7C7;
  padding: 4px 12px;
}
</style>