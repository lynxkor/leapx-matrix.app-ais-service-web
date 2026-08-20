<template>
  <div class="container">
  <edit-page-layout ref="editLayout" :title="paneTitle">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        title=""
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <LPCopy :value="form.vin">
            <span style="overflow: visible;">VIN码：{{ form.vin }}</span>
          </LPCopy>
        </template>
        <template #extraButtons>
          <el-button v-if="canReturn" size="small" type="primary" @click="onReturn">退车</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>常规信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-sub-header">
                <h3>归属信息</h3>
                <el-button v-if="canViewLifetimeBenefits" size="small" @click="onBenefit">查看终身权益</el-button>
                <el-button v-if="canWarrantyForecast && form.warrantyStartdate" size="small" @click="onWarranty">重新预测质保期</el-button>
              </div>
              <!-- <el-form :inline="true" :model="form" label-width="150px" class="form-detail"> -->
              <el-form label-width="150px" :inline="true" :model="form" :rules="rules" ref="ruleForm1" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车订单：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.vehicleOrder"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.vehicleEnterpriseOrder"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="商城订单号：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.shopcode"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.salesDealerName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="销售顾问：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.salesUserName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="交付门店：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="交付顾问：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.deliveryUserName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="服务门店：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.serviceDealerName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="服务顾问：">
                  <el-input clearable
                    placeholder="请输入"
                    v-model="form.serviceUserName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="是否用户修改服务门店：">
                  <el-input
                    clearable
                    placeholder="请输入"
                    :value="form.isUserChangeDealer === 0 ? '否' : '是'"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="城市交付顺序：">
                  <el-input clearable v-model="form.cityDeliveryNo" placeholder="请输入" disabled maxLength="50" />
                </el-form-item>
                <el-form-item label="全国交付顺序：">
                  <el-input clearable v-model="form.countryDeliveryNo" placeholder="请输入" disabled maxLength="50" />
                </el-form-item>
                <el-form-item label="特殊备注：" prop="remark" v-if="!accountFlag">
                  <el-input clearable v-model="form.remark" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车订单：">
                  <el-link
                    v-if="form.vehicleOrderId"
                    type="primary"
                    :href="`/sales/vehretail/orderManager/retailOrderInfo/edit?id=${form.vehicleOrderId}`"
                    target="_blank"
                  >{{ form.vehicleOrder }}</el-link>
                  <span v-else>{{ form.vehicleOrder }}</span>
                </el-form-item>
                <el-form-item label="企业客户整车订单：">
                  <el-link
                    v-if="form.vehicleEnterpriseOrderId"
                    type="primary"
                    :href="`/sales/vehwholesale/entorder/entVehicleOrder/edit?id=${form.vehicleEnterpriseOrderId}`"
                    target="_blank"
                  >{{ form.vehicleEnterpriseOrder }}</el-link>
                  <span v-else>{{ form.vehicleEnterpriseOrder }}</span>
                </el-form-item>
                <el-form-item label="商城订单号：">
                  <el-link
                    v-if="form.shopcode"
                    type="primary"
                    :href="`/sales/vehretail/orderManager/retailOrderInfo/edit?id=${form.vehicleOrderId}`"
                    target="_blank"
                  >{{ form.shopcode }}</el-link>
                  <span v-else>{{ form.shopcode }}</span>
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-link
                    v-if="form.salesDealerCode"
                    type="primary"
                    :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.salesDealerCode}`"
                    target="_blank"
                  >{{ form.salesDealerName }}</el-link>
                  <span v-else>{{ form.salesDealerName }}</span>
                </el-form-item>
                <el-form-item label="销售顾问：">
                  {{ form.salesUserName }}
                </el-form-item>
                <el-form-item label="交付门店：">
                  <el-link
                    v-if="form.deliveryDealerCode"
                    type="primary"
                    :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.deliveryDealerCode}`"
                    target="_blank"
                  >{{ form.deliveryDealerName }}</el-link>
                  <span v-else>{{ form.deliveryDealerName }}</span>
                </el-form-item>
                <el-form-item label="交付顾问：">
                  {{ form.deliveryUserName }}
                </el-form-item>
                <el-form-item label="服务门店：">
                  <el-link
                    v-if="form.serviceDealerCode"
                    type="primary"
                    :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.serviceDealerCode}`"
                    target="_blank"
                  >{{ form.serviceDealerName }}</el-link>
                  <span v-else>{{ form.serviceDealerName }}</span>
                </el-form-item>
                <el-form-item label="服务顾问：">
                  {{ form.serviceUserName }}
                </el-form-item>
                <el-form-item label="是否用户修改服务门店：">
                  {{ form.isUserChangeDealer === 0 ? '否' : '是' }}
                </el-form-item>
                <el-form-item label="城市交付顺序：">
                  {{ form.cityDeliveryNo }}
                </el-form-item>
                <el-form-item label="全国交付顺序：">
                  {{ form.countryDeliveryNo }}
                </el-form-item>
                <el-form-item label="特殊备注：" prop="remark" v-if="!accountFlag">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>保修信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="保修开始日期：">
                  <el-input clearable v-model="form.warrantyStartdate" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="整车是否在保(预测)：">
                  <el-input clearable v-model="form.isLifetimeWarrantyForecastLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="整车保修结束日期(预测)：">
                  <el-input clearable v-model="form.warrantyEnddateForecast" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="保修开始日期：">
                  {{ form.warrantyStartdate }}
                </el-form-item>
                <el-form-item label="整车是否在保(预测)：">
                  {{ form.isLifetimeWarrantyForecastLabel }}
                </el-form-item>
                <el-form-item label="整车保修结束日期(预测)：">
                  {{ form.warrantyEnddateForecast }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>保养信息</h3>
                <el-button v-if="syncPad" size="small" @click="onSync">同步车机</el-button>
                <el-button v-if="modifyMaintenanceRecord" size="small" @click="onInfo">调整保养信息</el-button>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="最近保养时间：">
                  {{ form.lastMaintainDate }}
                </el-form-item>
                <el-form-item label="最近保养里程：">
                  {{ form.lastMaintainMileages }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="最近保养时间：">
                  {{ form.lastMaintainDate }}
                </el-form-item>
                <el-form-item label="最近保养里程：">
                  {{ form.lastMaintainMileages }}
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" :model="form" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="下次保养时间：" prop="nextMaintainDate">
                  {{ form.nextMaintainDate }}
                </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintainMileages">
                  {{ form.nextMaintainMileages }}
                </el-form-item>
                <el-form-item class="form-item-full">
                  <next-table
                    v-if="isEditing || !_id"
                    ref="nextTable"
                    :id="form.id"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="下次保养时间：" prop="nextMaintainDate">
                  {{ form.nextMaintainDate }}
                </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintainMileages">
                  {{ form.nextMaintainMileages }}
                </el-form-item>
                <el-form-item class="form-item-full">
                  <next-table
                    v-if="!(isEditing || !_id)"
                    ref="nextTable"
                    :id="form.id"
                  />
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>物料信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车物料：">
                  <el-input clearable v-model="form.vehicleMaterialCode" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="物料描述：">
                  <el-input clearable v-model="form.vehicleMaterialDesc" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="基本车系：">
                  <el-input clearable v-model="form.vehicleSeriesName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="基本车型：">
                  <el-input clearable v-model="form.vehicleModelName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="选配续航：">
                  <el-input clearable v-model="form.drivingRangeName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="选配动力：">
                  <el-input clearable v-model="form.rangePowerName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="外饰风格：">
                  <el-input clearable v-model="form.exteriorName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="内饰风格：">
                  <el-input clearable v-model="form.interiorName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="选配轮毂：">
                  <el-input clearable v-model="form.wheelHubName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="电池电芯：">
                  <el-input clearable v-model="form.batteryCellName" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车物料：">
                  <el-link
                    v-if="form.vehicleMaterialId"
                    type="primary"
                    :href="`/sales/datacenter/materials/vehicleMaterials/edit?id=${form.vehicleMaterialId}`"
                    target="_blank"
                  >{{ form.vehicleMaterialCode }}</el-link>
                  <span v-else>{{ form.vehicleMaterialCode }}</span>
                </el-form-item>
                <el-form-item label="物料描述：">
                  {{ form.vehicleMaterialDesc }}
                </el-form-item>
                <el-form-item label="基本车系：">
                  {{ form.vehicleSeriesName }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="选配续航：">
                  {{ form.drivingRangeName }}
                </el-form-item>
                <el-form-item label="选配动力：">
                  {{ form.rangePowerName }}
                </el-form-item>
                <el-form-item label="外饰风格：">
                  {{ form.exteriorName }}
                </el-form-item>
                <el-form-item label="内饰风格：">
                  {{ form.interiorName }}
                </el-form-item>
                <el-form-item label="选配轮毂：">
                  {{ form.wheelHubName }}
                </el-form-item>
                <el-form-item label="电池电芯：">
                  {{ form.batteryCellName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>车主信息<el-button v-if="canKeyInfoChangeLog" style="margin-left: 6px;" size="small" @click="onHistory">查看关键信息变更日志</el-button></h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-sub-header">
                <h3>车主信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" :rules="rules" ref="ruleForm2" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="称呼：" prop="gender">
                  <fetch-select
                    disabled
                    :request="fetchOptions"
                    enumCode="vehicle_profile_gender"
                    v-model="form.gender"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车主姓名：">
                  {{ form.ownerName }}
                </el-form-item>
                <el-form-item label="车主手机号码：">
                  {{ form.mobilephone }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  <el-input clearable v-model="form.idcardTypeLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="证件号码：">
                  {{ form.idcardNo }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="称呼：" prop="gender">
                  {{ form.genderLabel }}
                </el-form-item>
                <el-form-item label="车主姓名：">
                  {{ form.ownerName }}
                </el-form-item>
                <el-form-item label="车主手机号码：">
                  {{ form.mobilephone }}
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.idcardTypeLabel }}
                </el-form-item>
                <el-form-item label="证件号码：">
                  {{ form.idcardNo }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>绑车人信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="绑车人用户ID号：">
                  <el-input clearable v-model="form.bindingUserid" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="绑车人姓名：">
                  {{ form.bindingUser }}
                </el-form-item>
                <el-form-item label="绑车人手机：">
                  {{ form.bindingPhone }}
                </el-form-item>
                <el-form-item label="绑车人证件类型：">
                  <el-input clearable v-model="form.bindingIdtypeLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="绑车人证件号码：">
                  {{ form.bindingIdno }}
                </el-form-item>
                <el-form-item label="绑车时间：">
                  <el-input clearable v-model="form.bindingOn" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="绑车人用户ID号：">
                  {{form.bindingUserid}}
                </el-form-item>
                <el-form-item label="绑车人姓名：">
                  {{ form.bindingUser }}
                </el-form-item>
                <el-form-item label="绑车人手机：">
                  {{ form.bindingPhone }}
                </el-form-item>
                <el-form-item label="绑车人证件类型：">
                  {{ form.bindingIdtypeLabel }}
                </el-form-item>
                <el-form-item label="绑车人证件号码：">
                  {{ form.bindingIdno }}
                </el-form-item>
                <el-form-item label="绑车时间：">
                  {{ form.bindingOn }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>实名认证信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="实名状态：">
                  <el-input clearable v-model="form.realnameStatusLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="卡ICCID：">
                  <el-input clearable v-model="form.iccid" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="卡MSISDN：">
                  <el-input clearable v-model="form.msisdn" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="受理时间：">
                  <el-input clearable v-model="form.acceptTime" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="实名驳回原因：">
                  <el-input clearable v-model="form.realnameRejectreason" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
              <div class="common-section-table" v-if="!(isEditing || !_id)">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="code" title="记录编号" min-width="10%" />
                  <vxe-column field="vin" title="VIN" min-width="10%" />
                  <vxe-column field="realnameStatusLabel" title="实名状态" min-width="10%" />
                  <vxe-column field="operateTime" title="操作时间" min-width="10%" />
                  <vxe-column field="remark" title="描述" min-width="10%" />
                  <vxe-column field="iccid" title="卡ICCID" min-width="10%" />
                  <vxe-column field="msisdn" title="卡MSISDN" min-width="10%" />
                  <vxe-column field="operatore" title="运营商" min-width="10%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination
                    v-if="tableData.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </div>
              </div>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="实名状态：">
                  {{ form.realnameStatusLabel }}
                </el-form-item>
                <el-form-item label="卡ICCID：">
                  {{ form.iccid }}
                </el-form-item>
                <el-form-item label="卡MSISDN：">
                  {{ form.msisdn }}
                </el-form-item>
                <el-form-item label="受理时间：">
                  {{ form.acceptTime }}
                </el-form-item>
                <el-form-item label="实名驳回原因：">
                  {{ form.realnameRejectreason }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>其他信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" :rules="rules" ref="ruleForm3" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="住宅电话：">
                  <el-input clearable v-model="form.telephone2" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="办公电话：">
                  <el-input clearable v-model="form.telephone1" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="身份证所在地：">
                  <el-input clearable v-model="form.address" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="生日：" prop="birthdate">
                  <el-date-picker
                    disabled
                    v-model="form.birthdate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="邮箱：">
                  <el-input clearable v-model="form.email1" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="住宅电话：">
                  {{ form.telephone2 }}
                </el-form-item>
                <el-form-item label="办公电话：">
                  {{ form.telephone1 }}
                </el-form-item>
                <el-form-item label="身份证所在地：">
                  {{ form.address }}
                </el-form-item>
                <el-form-item label="生日：" prop="birthdate">
                  {{ form.birthdate }}
                </el-form-item>
                <el-form-item label="邮箱：">
                  {{ form.email1 }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>地址信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" :rules="rules" ref="ruleForm4" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="省市区：" prop="districtCode">
                  <el-cascader
                    disabled
                    placeholder="请选择省市区"
                    v-model="form.districtCode"
                    :props="orgProps"
                    :options="areaOptions"
                    filterable
                    @change="handleCascaderChange"
                    clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="家庭地址：" prop="homeAddress">
                  <el-input disabled clearable v-model="form.homeAddress" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="工作地址：" prop="workAddress">
                  <el-input disabled clearable v-model="form.workAddress" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="省市区：">
                  {{ (form.provinceName || '') + (form.cityName || '') + (form.districtName || '') }}
                </el-form-item>
                <el-form-item label="家庭地址：" prop="homeAddress">
                  {{ form.homeAddress }}
                </el-form-item>
                <el-form-item label="工作地址：" prop="workAddress">
                  {{ form.workAddress }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>送修人信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" :rules="rules" ref="ruleForm5" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="送修人：" prop="shuttleName">
                  <el-input disabled clearable v-model="form.shuttleName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="送修人手机：" prop="shuttlePhone">
                  <el-input disabled clearable v-model="form.shuttlePhone" placeholder="请输入" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="送修人：" prop="shuttleName">
                  {{ form.shuttleName }}
                </el-form-item>
                <el-form-item label="送修人手机：" prop="shuttlePhone">
                  {{ form.shuttlePhone }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>车辆信息<el-button v-if="serviceProxyHis" @click="onService" style="margin-left: 6px;" size="small">查看维修履历</el-button></h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-sub-header">
                <h3>车辆基础信息</h3>
              </div>
              <el-form label-width="150px" :inline="true" :model="form" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="VIN：">
                  <LPCopy :value="form.vin">
                    {{ form.vin }}
                  </LPCopy>
                </el-form-item>
                <el-form-item label="车牌号：">
                  {{ form.vehiclePlateNo }}
                </el-form-item>
                <el-form-item label="合格证号：">
                  <el-input clearable v-model="form.certNumber" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="公告车型：">
                  <el-input clearable v-model="form.carSalesVersionName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆属性：">
                  <el-input clearable v-model="form.usageTypeLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆类型：">
                  <el-input clearable v-model="form.vehicleTypeLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆名称：">
                  <el-input clearable v-model="form.vehicleName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车型通用名称：">
                  <el-input clearable v-model="form.vehicleModel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车身颜色：">
                  <el-input clearable v-model="form.vehicleColor" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="燃料种类：">
                  <el-input clearable v-model="form.vehicleFuelTypeLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车型：">
                  <el-input clearable v-model="form.vehicleModelName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="年款：">
                  <el-input clearable v-model="form.vehicleYearName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="发动机型号：">
                  <el-input clearable v-model="form.enginenModel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="发动机号：">
                  <el-input clearable v-model="form.enginenNumber" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="电池型号：">
                  <el-input clearable v-model="form.batteryModel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="电池序列号：">
                  <el-input clearable v-model="form.batterySerialNumber" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="电机型号：">
                  <el-input clearable v-model="form.motorModel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="电机序列号：">
                  <el-input clearable v-model="form.motorSerialNumber" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="电驱序列号(前)：">
                  <el-input clearable v-model="form.electricnumberBefore" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="电驱序列号(后)：">
                  <el-input clearable v-model="form.electricnumberAfter" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆品牌：">
                  <el-input clearable v-model="form.vehicleDepartment" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆生产企业名称：">
                  <el-input clearable v-model="form.vehicleEnterpriseName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆产地：">
                  <el-input clearable v-model="form.vehiclePlaceOriginLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="制造工厂：">
                  <el-input clearable v-model="form.factoryinfoName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="制造日期：">
                  <el-input clearable v-model="form.manufacturingDate" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="VDC入库日期：">
                  <el-input clearable v-model="form.vdcInboundOn" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆出厂时间：">
                  <el-input clearable v-model="form.vehicleDepartureTime" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="销售日期：">
                  <el-input clearable v-model="form.salesDate" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="车辆销售变更时间：" prop="vehicleStaffupDatetime">
                  <el-date-picker disabled v-model="form.vehicleStaffupDatetime" type="date" value-format="yyyy-MM-dd" placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="车辆状态：">
                  <el-input clearable v-model="form.vehicleStatusLabel" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="VIN：">
                  <LPCopy :value="form.vin">
                    {{ form.vin }}
                  </LPCopy>
                </el-form-item>
                <el-form-item label="车牌号：">
                  {{ form.vehiclePlateNo }}
                </el-form-item>
                <el-form-item label="合格证号：">
                  {{ form.certNumber }}
                </el-form-item>
                <el-form-item label="公告车型：">
                  {{ form.carSalesVersionName }}
                </el-form-item>
                <el-form-item label="车辆属性：">
                  {{ form.usageTypeLabel }}
                </el-form-item>
                <el-form-item label="车辆类型：">
                  {{ form.vehicleTypeLabel }}
                </el-form-item>
                <el-form-item label="车辆名称：">
                  {{ form.vehicleName }}
                </el-form-item>
                <el-form-item label="车型通用名称：">
                  {{ form.vehicleModel }}
                </el-form-item>
                <el-form-item label="车身颜色：">
                  {{ form.vehicleColor }}
                </el-form-item>
                <el-form-item label="燃料种类：">
                  {{ form.vehicleFuelTypeLabel }}
                </el-form-item>
                <el-form-item label="车型：">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="年款：">
                  {{ form.vehicleYearName }}
                </el-form-item>
                <el-form-item label="发动机型号：">
                  {{ form.enginenModel }}
                </el-form-item>
                <el-form-item label="发动机号：">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="电池型号：">
                  {{ form.batteryModel }}
                </el-form-item>
                <el-form-item label="电池序列号：">
                  {{ form.batterySerialNumber }}
                </el-form-item>
                <el-form-item label="电机型号：">
                  {{ form.motorModel }}
                </el-form-item>
                <el-form-item label="电机序列号：">
                  {{ form.motorSerialNumber }}
                </el-form-item>
                <el-form-item label="电驱序列号(前)：">
                  {{ form.electricnumberBefore }}
                </el-form-item>
                <el-form-item label="电驱序列号(后)：">
                  {{ form.electricnumberAfter }}
                </el-form-item>
                <el-form-item label="车辆品牌：">
                  {{ form.vehicleDepartment }}
                </el-form-item>
                <el-form-item label="车辆生产企业名称：">
                  {{ form.vehicleEnterpriseName }}
                </el-form-item>
                <el-form-item label="车辆产地：">
                  {{ form.vehiclePlaceOriginLabel }}
                </el-form-item>
                <el-form-item label="制造工厂：">
                  {{ form.factoryinfoName }}
                </el-form-item>
                <el-form-item label="制造日期：">
                  {{ form.manufacturingDate }}
                </el-form-item>
                <el-form-item label="VDC入库日期：">
                  {{ form.vdcInboundOn }}
                </el-form-item>
                <el-form-item label="车辆出厂时间：">
                  {{ form.vehicleDepartureTime }}
                </el-form-item>
                <el-form-item label="销售日期：">
                  {{ form.salesDate }}
                </el-form-item>
                <el-form-item label="车辆销售变更时间：" prop="vehicleStaffupDatetime">
                  {{ form.vehicleStaffupDatetime }}
                </el-form-item>
                <el-form-item label="车辆状态：">
                  {{ form.vehicleStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
        <benefit-dialog
          v-if="visible"
          :visible.sync="visible"
          :id="form.id"
        />
        <info-dialog
          v-if="infoDialogVisible"
          :visible.sync="infoDialogVisible"
          :vehicleProfileId="form.id"
          :data="infoDialogData"
          :vin="form.vin"
          :canReset="modifyMaintenanceRecord"
          @vehicle-reset="onVehicleReset"
          @update="onInfoSuccess"
        />
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <change-history
          v-if="paneType === 'history'"
          :id="form.id"
        />
        <service-history
          v-if="paneType === 'service'"
          :id="form.id"
        />
      </div>
    </template>
  </edit-page-layout>
  <return-dialog
    v-if="returnDialogVisible"
    :visible.sync="returnDialogVisible"
    :id="form.id"
    @update="onReturnSuccess"
  />
  </div>
</template>

<script>
import { getDetail, getDetailDecryptField, syncMaintenance, updateFlat, warrantyForecast, realnameRecordPage } from '@/api/datacenter/vehicle/vehicleProfile/index';
import moment from 'moment';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import LPCopy from '@/libs/components/LPCopy/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum } from '@/api/common';
import { getAreaInfo, getAreaTree } from '@/utils';
import ChangeHistory from './ChangeHistory';
import ServiceHistory from './ServiceHistory';
import NextTable from './NextTable.vue';
import BenefitDialog from './BenefitDialog';
import InfoDialog from './InfoDialog';
import ReturnDialog from './ReturnDialog';
import { loginUserGet } from '@/libs/api/common';

const defaultForm = {
  // 基础信息
  vin: '',
  vehiclePlateNo: '',
  vehicleMaterialId: '',
  vehicleMaterialCode: '',
  vehicleMaterialDesc: '',
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
  vehicleFuelTypeLabel: '',
  vehicleModel: '',
  vehicleName: '',
  vehiclePlaceOrigin: '',
  vehicleModelId: '',
  vehicleModelName: '',
  vehicleYearId: '',
  vehicleYearName: '',
  usageType: '',
  usageTypeLabel: '',
  salesDate: '',
  salesDealerCode: '',
  salesDealerName: '',
  salesUserId: '',
  salesUserName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  deliveryUserId: '',
  deliveryUserName: '',
  shopcode: '',
  isEnterpriseOrder: '',
  vehicleOrderId: '',
  vehicleOrder: '',
  vehicleEnterpriseOrder: '',
  ownerCode: '',
  cityDeliveryNo: '',
  countryDeliveryNo: '',
  isNoticeActivate: '',
  noticeActivateTime: '',
  noticeFailReason: '',
  vehicleType: '',
  vehicleSeriesId: '',
  vehicleSeriesName: '',

  // 车主信息
  ownerName: '',
  idcardNo: '',
  idcardType: '',
  mobilephone: '',
  gender: '',
  enterpriseName: '',
  address: '',
  areaCode: '',
  birthdate: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  email1: '',
  email2: '',
  fax: '',
  faxareaCode: '',
  homeAddress: '',
  openId: '',
  qq: '',
  remark: '',
  telephone1: '',
  telephone2: '',
  telephone3: '',
  weibo: '',
  weixin: '',
  workAddress: '',
  zipCode: '',
  bindingIdno: '',
  bindingIdtype: '',
  bindingIdtypeLabel: '',
  bindingOn: '',
  bindingPhone: '',
  bindingUser: '',
  bindingUserid: '',
  isBinding: '',
  acceptTime: '',
  customerCertNumber: '',
  customerName: '',
  iccid: '',
  msisdn: '',
  operatore: '',
  realnameStatus: '',
  realnameRejectreason: '',
  userId: '',
  enterpriseId: '',
  provinceCode: '',
  cityCode: '',
  districtCode: '',
  needRealName: '',

  // 服务信息
  isLifetimeFreeMaintain: '',
  isLifetimeWarranty: '',
  warrantyStartdate: '',
  warrantyEnddate: '',
  warrantyperiod: '',
  lifetimeWarrantyinfo: '',
  serviceDealerCode: '',
  serviceDealerName: '',
  serviceUserId: '',
  serviceUserName: '',
  isUserChangeDealer: '',
  maintainNum: '',
  lastMileage: '',
  lastNetMileage: '',
  lastMaintainDate: '',
  lastMaintainMileages: '',
  nextMaintainDate: '',
  nextMaintainMileages: '',
  shuttleName: '',
  shuttlePhone: '',
  warrantyEnddateForecast: '',
  isLifetimeWarrantyForecast: '',
  vehicleStatus: '',
  vehicleStaffupDatetime: '',
};

export default {
  name: 'vehicleProfileEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    LPCopy,
    EditPageLayout,
    EditBaseContainer,
    ChangeHistory,
    NextTable,
    ServiceHistory,
    BenefitDialog,
    InfoDialog,
    ReturnDialog,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    _vin () {
      return this.vin || this.$route.query.vin || this.form.vin;
    }
  },
  watch: {
    _id: {
      handler (val) {
        if (val) {
          this.$refs.containerRef?.loadDetail();
          this.getData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      areaOptions: getAreaTree(),
      pageTitle: '车辆档案管理',
      pageType: 'edit',
      title: 'VIN码：' + form.vin,
      moduleKey: 'AISMC-vehicleProfile',
      loading: false,
      submitLoading: false,
      isEditing: false,
      form: { ...form },
      originalForm: { ...form },
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      rules: {},
      //
      paneType: '',
      paneTitle: '',
      //
      visible: false,
      // 退车弹窗
      returnDialogVisible: false,
      // 调整保养信息弹窗
      infoDialogVisible: false,
      infoDialogData: {},
      // 权限
      canReturn: false,
      canViewLifetimeBenefits: false,
      syncPad: false,
      modifyMaintenanceRecord: false,
      canKeyInfoChangeLog: false,
      canWarrantyForecast: false,
      serviceProxyHis: false,
      pageNum: 1, // 实名认证记录分页
      pageSize: 10,
      total: 0,
      tableData: [],
      accountFlag: false, // 是否是[店端账号]?， true:是店端账号;false:ㄏ端账号
    };
  },
  created () {
    this.canReturn = this.permissions.has(`${this.moduleKey}-return`);
    this.canViewLifetimeBenefits = this.permissions.has(`${this.moduleKey}-viewLifetimeBenefits`);
    this.syncPad = this.permissions.has(`${this.moduleKey}-syncPad`);
    this.modifyMaintenanceRecord = this.permissions.has(`${this.moduleKey}-modifyMaintenanceRecord`);
    this.canKeyInfoChangeLog = this.permissions.has(`${this.moduleKey}-keyInfoChangeLog`);
    this.canWarrantyForecast = this.permissions.has(`${this.moduleKey}-warrantyForecast`);
    this.serviceProxyHis = !!(this.$store.state.pageSource?.aisPageSource || []).find(item => (item === 'AISMC-serviceProxyHis-page'));
  },
  mounted () {
    loginUserGet().then(data => {
      this.accountFlag = data.accountFlag;
    });
  },
  methods: {
    onBenefit () {
      this.visible = true;
    },
    onReturn () {
      this.returnDialogVisible = true;
    },
    onWarranty () {
      if (!this.form.usageType) {
        this.$message.error('车辆属性为空，无法准确预测质保期');
        return;
      }
      warrantyForecast(this._id).then(res => {
        this.$message.success('预测成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    onHistory () {
      this.paneType = 'history';
      this.paneTitle = '查看关键信息变更日志';
      this.$refs.editLayout.openPane();
    },
    onService () {
      this.paneType = 'service';
      this.paneTitle = '查看维修履历';
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      const vin = this._vin;
      console.log(id, vin);
      if (id || vin) {
        // 使用平铺接口
        return getDetail({ id, vin });
      }
    },
    submitRequest () {
      // 明细页不需要提交功能
      if (this.form.districtCode) {
        let areaInfo = getAreaInfo(this.form.districtCode);
        this.form.provinceName = areaInfo.provinceName;
        this.form.provinceCode = areaInfo.provinceCode;
        this.form.cityName = areaInfo.cityName;
        this.form.cityCode = areaInfo.cityCode;
        this.form.districtName = areaInfo.districtName;
        this.form.districtCode = areaInfo.districtCode;
      }
      return updateFlat({ ...this.getFormData() });
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (Array.isArray(data[key]) && !data[key].length) {
          delete data[key];
        }
        // if (data[key] === '' || data[key] === null) {
        //   delete data[key];
        // }
      });

      return data;
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    getDetailDecryptField (id, field) {
      return getDetailDecryptField(id, field);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleCascaderChange (value) {
    },
    onSync () {
      syncMaintenance(this._id).then(res => {
        this.$message.success('同步成功');
      });
    },
    onInfo () {
      this.infoDialogData = {
        nextMaintainDate: this.form.nextMaintainDate,
        nextMaintainMileages: this.form.nextMaintainMileages,
      };
      this.infoDialogVisible = true;
    },
    onInfoSuccess () {
      this.$refs?.nextTable?.getDetailPageApi();
      this.$refs?.containerRef?.loadDetail();
    },
    onVehicleReset (res) {
      if (!res) return;
      this.form.nextMaintainDate = res.nextMaintainDate && moment(res.nextMaintainDate).isValid()
        ? moment(res.nextMaintainDate).format('YYYY-MM-DD HH:mm:ss')
        : null;
      this.form.nextMaintainMileages = res.nextMaintainMileages ?? '';
    },
    onReturnSuccess () {
      this.$refs.containerRef.loadDetail();
    },
    // 获取实名认证记录
    async getData () {
      const params = {
        vehicleProfileId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await realnameRecordPage(params);
      this.total = res.total || 0;
      this.tableData = res.records || [];
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
  }
};
</script>
<style lang="scss" scoped>
.common-section-sub-header{
  display: flex;
  margin-bottom: 8px;
  h3 {
    color: #0A0E0A;
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
    margin-right: 15px;
  }
}
.container{
  width: 100%;
  height: 100%;
}

</style>
