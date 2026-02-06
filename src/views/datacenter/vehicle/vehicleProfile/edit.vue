<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="VIN码：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车物料ID：" prop="vehicleMaterialId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleMaterialId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售日期：" prop="salesDate">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.salesDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="车牌号：" prop="vehiclePlateNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePlateNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="商城订单号：" prop="shopcode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.shopcode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="生产日期：" prop="productionTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.productionTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="VDC入库日期：" prop="vdcInboundOn">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.vdcInboundOn"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="电池型号：" prop="batteryModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.batteryModel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="电池序列号：" prop="batterySerialNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.batterySerialNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enginenNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="变速箱号：" prop="gearboxCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.gearboxCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="制造日期：" prop="manufacturingDate">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.manufacturingDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="电机型号：" prop="motorModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.motorModel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="电机序列号：" prop="motorSerialNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.motorSerialNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="公告车型ID：" prop="carSaleSversionId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carSaleSversionId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售公告车型名称：" prop="carSalesVersionName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carSalesVersionName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="合格证号：" prop="certNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.certNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="电驱序列号：" prop="electricnumberAfter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.electricnumberAfter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="电驱序列号：" prop="electricnumberBefore">
                  <el-input
                    placeholder="请输入"
                    v-model="form.electricnumberBefore"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发动机型号：" prop="enginenModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.enginenModel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="制造工厂ID：" prop="factoryinfoId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.factoryinfoId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="制造工厂名称：" prop="factoryinfoName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.factoryinfoName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车身颜色：" prop="vehicleColor">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleColor"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆品牌：" prop="vehicleDepartment">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleDepartment"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆出厂时间：" prop="vehicleDepartureTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.vehicleDepartureTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="车辆生产企业名称：" prop="vehicleEnterpriseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleEnterpriseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="燃料种类：" prop="vehicleFuelType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.vehicleFuelType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车型通用名称：" prop="vehicleModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleModel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆名称：" prop="vehicleName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆产地：" prop="vehiclePlaceOrigin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehiclePlaceOrigin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型ID：" prop="vehicleModelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleModelId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehicleModelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleModelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年型ID：" prop="vehicleYearId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleYearId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年型：" prop="vehicleYearName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleYearName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆属性：" prop="usageType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.usageType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售门店统一编码CODE：" prop="salesDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="salesDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售顾问ID：" prop="salesUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售顾问名称：" prop="salesUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付门店统一编码CODE：" prop="deliveryDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付顾问ID：" prop="deliveryUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交付顾问名称：" prop="deliveryUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否企业客户订单：" prop="isEnterpriseOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isEnterpriseOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车订单ID：" prop="vehicleOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车订单：" prop="vehicleOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="vehicleEnterpriseOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleEnterpriseOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="档案归属门店CODE 数据权限字段：" prop="ownerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerCode"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="VIN码：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="整车物料ID：" prop="vehicleMaterialId">
                  {{ form.vehicleMaterialId }}
                </el-form-item>
                <el-form-item label="销售日期：" prop="salesDate">
                  {{ form.salesDate }}
                </el-form-item>
                <el-form-item label="车牌号：" prop="vehiclePlateNo">
                  {{ form.vehiclePlateNo }}
                </el-form-item>
                <el-form-item label="交付门店名称：" prop="deliveryDealerName">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="商城订单号：" prop="shopcode">
                  {{ form.shopcode }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="生产日期：" prop="productionTime">
                  {{ form.productionTime }}
                </el-form-item>
                <el-form-item label="VDC入库日期：" prop="vdcInboundOn">
                  {{ form.vdcInboundOn }}
                </el-form-item>
                <el-form-item label="电池型号：" prop="batteryModel">
                  {{ form.batteryModel }}
                </el-form-item>
                <el-form-item label="电池序列号：" prop="batterySerialNumber">
                  {{ form.batterySerialNumber }}
                </el-form-item>
                <el-form-item label="发动机号：" prop="enginenNumber">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="变速箱号：" prop="gearboxCode">
                  {{ form.gearboxCode }}
                </el-form-item>
                <el-form-item label="制造日期：" prop="manufacturingDate">
                  {{ form.manufacturingDate }}
                </el-form-item>
                <el-form-item label="电机型号：" prop="motorModel">
                  {{ form.motorModel }}
                </el-form-item>
                <el-form-item label="电机序列号：" prop="motorSerialNumber">
                  {{ form.motorSerialNumber }}
                </el-form-item>
                <el-form-item label="公告车型ID：" prop="carSaleSversionId">
                  {{ form.carSaleSversionId }}
                </el-form-item>
                <el-form-item label="销售公告车型名称：" prop="carSalesVersionName">
                  {{ form.carSalesVersionName }}
                </el-form-item>
                <el-form-item label="合格证号：" prop="certNumber">
                  {{ form.certNumber }}
                </el-form-item>
                <el-form-item label="电驱序列号：" prop="electricnumberAfter">
                  {{ form.electricnumberAfter }}
                </el-form-item>
                <el-form-item label="电驱序列号：" prop="electricnumberBefore">
                  {{ form.electricnumberBefore }}
                </el-form-item>
                <el-form-item label="发动机型号：" prop="enginenModel">
                  {{ form.enginenModel }}
                </el-form-item>
                <el-form-item label="制造工厂ID：" prop="factoryinfoId">
                  {{ form.factoryinfoId }}
                </el-form-item>
                <el-form-item label="制造工厂名称：" prop="factoryinfoName">
                  {{ form.factoryinfoName }}
                </el-form-item>
                <el-form-item label="车身颜色：" prop="vehicleColor">
                  {{ form.vehicleColor }}
                </el-form-item>
                <el-form-item label="车辆品牌：" prop="vehicleDepartment">
                  {{ form.vehicleDepartment }}
                </el-form-item>
                <el-form-item label="车辆出厂时间：" prop="vehicleDepartureTime">
                  {{ form.vehicleDepartureTime }}
                </el-form-item>
                <el-form-item label="车辆生产企业名称：" prop="vehicleEnterpriseName">
                  {{ form.vehicleEnterpriseName }}
                </el-form-item>
                <el-form-item label="燃料种类：" prop="vehicleFuelType">
                  {{ form.vehicleFuelType }}
                </el-form-item>
                <el-form-item label="车型通用名称：" prop="vehicleModel">
                  {{ form.vehicleModel }}
                </el-form-item>
                <el-form-item label="车辆名称：" prop="vehicleName">
                  {{ form.vehicleName }}
                </el-form-item>
                <el-form-item label="车辆产地：" prop="vehiclePlaceOrigin">
                  {{ form.vehiclePlaceOrigin }}
                </el-form-item>
                <el-form-item label="基本车型ID：" prop="vehicleModelId">
                  {{ form.vehicleModelId }}
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehicleModelName">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="年型ID：" prop="vehicleYearId">
                  {{ form.vehicleYearId }}
                </el-form-item>
                <el-form-item label="年型：" prop="vehicleYearName">
                  {{ form.vehicleYearName }}
                </el-form-item>
                <el-form-item label="车辆属性：" prop="usageType">
                  {{ form.usageType }}
                </el-form-item>
                <el-form-item label="销售门店统一编码CODE：" prop="salesDealerCode">
                  {{ form.salesDealerCode }}
                </el-form-item>
                <el-form-item label="销售门店名称：" prop="salesDealerName">
                  {{ form.salesDealerName }}
                </el-form-item>
                <el-form-item label="销售顾问ID：" prop="salesUserId">
                  {{ form.salesUserId }}
                </el-form-item>
                <el-form-item label="销售顾问名称：" prop="salesUserName">
                  {{ form.salesUserName }}
                </el-form-item>
                <el-form-item label="交付门店统一编码CODE：" prop="deliveryDealerCode">
                  {{ form.deliveryDealerCode }}
                </el-form-item>
                <el-form-item label="交付顾问ID：" prop="deliveryUserId">
                  {{ form.deliveryUserId }}
                </el-form-item>
                <el-form-item label="交付顾问名称：" prop="deliveryUserName">
                  {{ form.deliveryUserName }}
                </el-form-item>
                <el-form-item label="是否企业客户订单：" prop="isEnterpriseOrder">
                  {{ form.isEnterpriseOrder }}
                </el-form-item>
                <el-form-item label="整车订单ID：" prop="vehicleOrderId">
                  {{ form.vehicleOrderId }}
                </el-form-item>
                <el-form-item label="整车订单：" prop="vehicleOrder">
                  {{ form.vehicleOrder }}
                </el-form-item>
                <el-form-item label="企业客户整车订单：" prop="vehicleEnterpriseOrder">
                  {{ form.vehicleEnterpriseOrder }}
                </el-form-item>
                <el-form-item label="档案归属门店CODE 数据权限字段：" prop="ownerCode">
                  {{ form.ownerCode }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datacenter/vehicle/vehicleProfile/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  vin: '',
  vehicleMaterialId: '',
  salesDate: '',
  vehiclePlateNo: '',
  deliveryDealerName: '',
  shopcode: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  productionTime: '',
  vdcInboundOn: '',
  batteryModel: '',
  batterySerialNumber: '',
  enginenNumber: '',
  gearboxCode: '',
  manufacturingDate: '',
  motorModel: '',
  motorSerialNumber: '',
  carSaleSversionId: '',
  carSalesVersionName: '',
  certNumber: '',
  electricnumberAfter: '',
  electricnumberBefore: '',
  enginenModel: '',
  factoryinfoId: '',
  factoryinfoName: '',
  vehicleColor: '',
  vehicleDepartment: '',
  vehicleDepartureTime: '',
  vehicleEnterpriseName: '',
  vehicleFuelType: '',
  vehicleModel: '',
  vehicleName: '',
  vehiclePlaceOrigin: '',
  vehicleModelId: '',
  vehicleModelName: '',
  vehicleYearId: '',
  vehicleYearName: '',
  usageType: '',
  salesDealerCode: '',
  salesDealerName: '',
  salesUserId: '',
  salesUserName: '',
  deliveryDealerCode: '',
  deliveryUserId: '',
  deliveryUserName: '',
  isEnterpriseOrder: '',
  vehicleOrderId: '',
  vehicleOrder: '',
  vehicleEnterpriseOrder: '',
  ownerCode: '',
};

export default {
  name: 'vehicleProfileEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '车辆档案管理',
      pageType: 'edit',
      title: 'VIN码：' + form.vin,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehicleProfile',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        vin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        vehicleMaterialId: [
          { required: true, message: '请输入整车物料ID', trigger: 'change' }
        ],
        salesDate: [
          { required: true, message: '请选择销售日期', trigger: 'change' }
        ],
        vehiclePlateNo: [
          { required: true, message: '请输入车牌号', trigger: 'change' }
        ],
        deliveryDealerName: [
          { required: true, message: '请输入交付门店名称', trigger: 'change' }
        ],
        shopcode: [
          { required: true, message: '请输入商城订单号', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        productionTime: [
          { required: true, message: '请选择生产日期', trigger: 'change' }
        ],
        vdcInboundOn: [
          { required: true, message: '请选择VDC入库日期', trigger: 'change' }
        ],
        batteryModel: [
          { required: true, message: '请输入电池型号', trigger: 'change' }
        ],
        batterySerialNumber: [
          { required: true, message: '请输入电池序列号', trigger: 'change' }
        ],
        enginenNumber: [
          { required: true, message: '请输入发动机号', trigger: 'change' }
        ],
        gearboxCode: [
          { required: true, message: '请输入变速箱号', trigger: 'change' }
        ],
        manufacturingDate: [
          { required: true, message: '请选择制造日期', trigger: 'change' }
        ],
        motorModel: [
          { required: true, message: '请输入电机型号', trigger: 'change' }
        ],
        motorSerialNumber: [
          { required: true, message: '请输入电机序列号', trigger: 'change' }
        ],
        carSaleSversionId: [
          { required: true, message: '请输入公告车型ID', trigger: 'change' }
        ],
        carSalesVersionName: [
          { required: true, message: '请输入销售公告车型名称', trigger: 'change' }
        ],
        certNumber: [
          { required: true, message: '请输入合格证号', trigger: 'change' }
        ],
        electricnumberAfter: [
          { required: true, message: '请输入电驱序列号', trigger: 'change' }
        ],
        electricnumberBefore: [
          { required: true, message: '请输入电驱序列号', trigger: 'change' }
        ],
        enginenModel: [
          { required: true, message: '请输入发动机型号', trigger: 'change' }
        ],
        factoryinfoId: [
          { required: true, message: '请输入制造工厂ID', trigger: 'change' }
        ],
        factoryinfoName: [
          { required: true, message: '请输入制造工厂名称', trigger: 'change' }
        ],
        vehicleColor: [
          { required: true, message: '请输入车身颜色', trigger: 'change' }
        ],
        vehicleDepartment: [
          { required: true, message: '请输入车辆品牌', trigger: 'change' }
        ],
        vehicleDepartureTime: [
          { required: true, message: '请选择车辆出厂时间', trigger: 'change' }
        ],
        vehicleEnterpriseName: [
          { required: true, message: '请输入车辆生产企业名称', trigger: 'change' }
        ],
        vehicleFuelType: [
          { required: true, message: '请选择燃料种类', trigger: 'change' }
        ],
        vehicleModel: [
          { required: true, message: '请输入车型通用名称', trigger: 'change' }
        ],
        vehicleName: [
          { required: true, message: '请输入车辆名称', trigger: 'change' }
        ],
        vehiclePlaceOrigin: [
          { required: true, message: '请输入车辆产地', trigger: 'change' }
        ],
        vehicleModelId: [
          { required: true, message: '请输入基本车型ID', trigger: 'change' }
        ],
        vehicleModelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        vehicleYearId: [
          { required: true, message: '请输入年型ID', trigger: 'change' }
        ],
        vehicleYearName: [
          { required: true, message: '请输入年型', trigger: 'change' }
        ],
        usageType: [
          { required: true, message: '请选择车辆属性', trigger: 'change' }
        ],
        salesDealerCode: [
          { required: true, message: '请输入销售门店统一编码CODE', trigger: 'change' }
        ],
        salesDealerName: [
          { required: true, message: '请输入销售门店名称', trigger: 'change' }
        ],
        salesUserId: [
          { required: true, message: '请输入销售顾问ID', trigger: 'change' }
        ],
        salesUserName: [
          { required: true, message: '请输入销售顾问名称', trigger: 'change' }
        ],
        deliveryDealerCode: [
          { required: true, message: '请输入交付门店统一编码CODE', trigger: 'change' }
        ],
        deliveryUserId: [
          { required: true, message: '请输入交付顾问ID', trigger: 'change' }
        ],
        deliveryUserName: [
          { required: true, message: '请输入交付顾问名称', trigger: 'change' }
        ],
        isEnterpriseOrder: [
          { required: true, message: '请输入是否企业客户订单', trigger: 'change' }
        ],
        vehicleOrderId: [
          { required: true, message: '请输入整车订单ID', trigger: 'change' }
        ],
        vehicleOrder: [
          { required: true, message: '请输入整车订单', trigger: 'change' }
        ],
        vehicleEnterpriseOrder: [
          { required: true, message: '请输入企业客户整车订单', trigger: 'change' }
        ],
        ownerCode: [
          { required: true, message: '请输入档案归属门店CODE 数据权限字段', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
