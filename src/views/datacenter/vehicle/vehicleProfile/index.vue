<template>
  <div class="page-common m-vehicle-profile-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN码">
        <el-input
          placeholder="请输入"
          v-model="form.vin"
          clearable
        />
      </el-form-item>
      <el-form-item label="车主手机号">
        <el-input
          placeholder="请输入"
          v-model="form.ownerMobilephone"
          clearable
        />
      </el-form-item>
      <template v-if="visibleCount === 3 || show">
        <el-form-item label="车牌号">
          <el-input
            placeholder="请输入"
            v-model="form.vehiclePlateNoLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.salesDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="整车订单">
          <tag-input v-model="form.vehicleOrderList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="商城订单">
          <tag-input v-model="form.shopcodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="企业整车订单">
          <tag-input v-model="form.vehicleEnterpriseOrderList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="保修开始日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.warrantyStartdate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="车主姓名">
          <el-input
            placeholder="请输入"
            v-model="form.ownerNameLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="车主证件类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="vehretail_id_card_type"
            v-model="form.idcardTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="车主证件">
          <el-input
            placeholder="请输入"
            v-model="form.idcardNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="绑车人姓名">
          <el-input
            placeholder="请输入"
            v-model="form.bindingUserLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="绑车人ID">
          <el-input
            placeholder="请输入"
            v-model="form.bindingUserid"
            clearable
          />
        </el-form-item>
        <el-form-item label="绑车人手机">
          <el-input
            placeholder="请输入"
            v-model="form.bindingPhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="绑车时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.bindingOn"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="销售门店">
          <dealer-select v-model="form.salesDealerCodeList" multiple/>
        </el-form-item>
        <el-form-item label="交付门店">
          <dealer-select v-model="form.deliveryDealerCodeList" multiple/>
        </el-form-item>
        <el-form-item label="服务门店">
          <dealer-select v-model="form.serviceDealerCodeList" multiple/>
        </el-form-item>
        <el-form-item label="整车物料">
          <el-input
            placeholder="请输入"
            v-model="form.vehicleMaterialCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="物料描述">
          <el-input
            placeholder="请输入"
            v-model="form.vehicleMaterialDescLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="VDC入库时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.vdcInboundOn"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="车系">
          <list-select
            listUrl="/datacenter/web/materials/vehicleSeries/list"
            placeholder="请选择"
            v-model="form.vehicleSeriesIdList"
            query-key="seriesNameLike"
            clearable
            collapseTags
            auto-load-options
            no-param-load
            multiple
            filterable
            :params="{}" />
        </el-form-item>
        <el-form-item label="车型">
          <list-select
            listUrl="/datacenter/web/materials/vehicleModel/list"
            placeholder="请选择"
            v-model="form.vehicleModelIdList"
            query-key="modelNameLike"
            clearable
            auto-load-options
            collapseTags
            multiple
            filterable
            :params="{seriesIdList: form.vehicleSeriesIdList}"
            />
        </el-form-item>
        <el-form-item label="动力">
          <list-select
            listUrl="/datacenter/web/materials/vehicleRangePower/list"
            placeholder="请选择"
            v-model="form.rangePowerIdList"
            query-key="rangePowerNameLike"
            clearable
            auto-load-options
            collapseTags
            multiple
            filterable
            :params="{}"
            />
        </el-form-item>
        <el-form-item label="续航">
          <list-select
            listUrl="/datacenter/web/materials/vehicleDrivingRange/list"
            placeholder="请选择"
            v-model="form.drivingRangeIdList"
            query-key="drivingRangeNameLike"
            clearable
            auto-load-options
            collapseTags
            multiple
            filterable
            :params="{}"
            />
        </el-form-item>
        <el-form-item label="外饰">
          <list-select
            listUrl="/datacenter/web/materials/vehicleExterior/list"
            placeholder="请选择"
            v-model="form.exteriorIdList"
            query-key="exteriorNameLike"
            clearable
            auto-load-options
            collapseTags
            multiple
            filterable
            :params="{}"
            />
        </el-form-item>
        <el-form-item label="内饰">
          <list-select
            listUrl="/datacenter/web/materials/vehicleInterior/list"
            placeholder="请选择"
            v-model="form.interiorIdList"
            query-key="interiorNameLike"
            clearable
            auto-load-options
            collapseTags
            multiple
            filterable
            :params="{}"
            />
        </el-form-item>
        <el-form-item label="轮毂">
          <list-select
            listUrl="/datacenter/web/materials/vehicleWheelHub/list"
            placeholder="请选择"
            v-model="form.wheelHubIdList"
            query-key="wheelHubNameLike"
            clearable
            auto-load-options
            collapseTags
            multiple
            filterable
            :params="{}"
            />
        </el-form-item>
        <el-form-item label="下次保养时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.nextMaintainDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      id="vehicle_profile"
      @close="handleUploadDialogClose"
    />
    <return-dialog
      :visible.sync="visible"
    />
    <el-drawer
      title="查看关键信息变更日志"
      :visible.sync="drawerVisible"
      size="40%"
    >
      <div class="page-common-edit">
        <change-history
          :id="clickItemId"
        />
      </div>
    </el-drawer>
    <el-drawer
      title="查看维修履历"
      :visible.sync="drawerVisible2"
      size="40%"
    >
      <div class="page-common-edit">
        <service-history
          :id="clickItemId"
        />
      </div>
    </el-drawer>
    <benefit-dialog
      v-if="benefitVisible"
      :visible.sync="benefitVisible"
      :id="benefitId"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getDetailDecryptField, getList, deleteItem, enableItem } from '@/api/datacenter/vehicle/vehicleProfile/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import DealerSelect from '@/components/dealer-select';
import ListSelect from '@/libs/components/list-select';
import TagInput from '@/libs/components/TagInput';
import FetchSelect from '@/libs/components/FetchSelect';
import { vehicleRangePower } from '@/libs/api/common';
import ReturnDialog from './ReturnDialog';
import ChangeHistory from './ChangeHistory';
import ServiceHistory from './ServiceHistory';
import BenefitDialog from './BenefitDialog';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  vin: '',
  vehicleMaterialCode: '',
  salesDate: '',
  vehiclePlateNoLike: '',
  deliveryDealerCodeList: [],
  serviceDealerCodeList: [],
  salesDealerCodeList: [],
  ownerNameLike: '',
  ownerMobilephone: '',
  idcardTypeList: [],
  bindingUserLike: '',
  vdcInboundOn: '',
  vehicleSeriesIdList: [],
  vehicleModelIdList: [],
  rangePowerIdList: [],
  drivingRangeIdList: [],
  exteriorIdList: [],
  interiorIdList: [],
  wheelHubIdList: [],
  nextMaintainDate: '',
  createTime: '',
  updateTime: '',
  bindingOn: '',
  vehicleOrderId: '',
  vehicleOrder: '',
  vehicleOrderList: [],
  shopcode: '',
  shopcodeList: [],
  vehicleEnterpriseOrder: '',
  vehicleEnterpriseOrderList: [],
  serviceDealerName: '',
  serviceDealerCode: '',
  salesDealerName: '',
  salesDealerCode: '',
  vehicleMaterialDescLike: '',
  warrantyStartdate: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    EditPage,
    Upload,
    DealerSelect,
    ListSelect,
    TagInput,
    FetchSelect,
    ReturnDialog,
    ChangeHistory,
    BenefitDialog,
    ServiceHistory,
  },
  data () {
    return {
      pageTitle: '车辆档案管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehicleProfile',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      //
      benefitVisible: false,
      benefitId: '',
      optionObj: {
        id: 'vehicleProfileTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'vin'),
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleProfile/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'vehiclePlateNo',
            label: '车牌号',
            visible: true,
            width: 150,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'vehiclePlateNo')
          },
          { props: 'salesDate', label: '销售日期', visible: true, width: 160 },
          {
            props: 'vehicleOrder',
            label: '整车订单',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/sales/vehretail/orderManager/retailOrderInfo/edit',
                  query: {
                    id: row.vehicleOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'shopcode',
            label: '商城订单',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.shopcode) {
                  this.navigateToRoute({
                    path: '/sales/vehretail/productManager/productCenter/edit',
                    query: {
                      code: row.shopcode
                    }
                  });
                }
              },
              type: 'primary'
            }]
          },
          {
            props: 'vehicleEnterpriseOrder',
            label: '企业整车订单',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/sales/vehwholesale/entorder/entVehicleOrder/edit',
                  query: {
                    id: row.vehicleEnterpriseOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'warrantyStartdate', label: '保修开始日期', visible: true, width: 160 },
          {
            props: 'ownerName',
            label: '车主姓名',
            visible: true,
            width: 150,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'ownerName')
          },
          {
            props: 'mobilephone',
            label: '车主手机',
            visible: true,
            width: 150,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'mobilephone')
          },
          { props: 'idcardTypeLabel', label: '车主证件类型', visible: true, width: 120 },
          {
            props: 'idcardNo',
            label: '车主证件',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'idcardNo')
          },
          {
            props: 'bindingUser',
            label: '绑车人姓名',
            visible: true,
            width: 150,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'bindingUser')
          },
          { props: 'bindingUserid', label: '绑车人ID', visible: true, width: 180 },
          {
            props: 'bindingPhone',
            label: '绑车人手机',
            visible: true,
            width: 150,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'bindingPhone')
          },
          { props: 'bindingOn', label: '绑车时间', visible: true, width: 180 },
          { props: 'salesDealerCode', label: '销售门店编码', visible: true, width: 150 },
          { props: 'salesDealerName', label: '销售门店名称', visible: true, width: 200 },
          { props: 'deliveryDealerCode', label: '交付门店编码', visible: true, width: 150 },
          { props: 'deliveryDealerName', label: '交付门店名称', visible: true, width: 200 },
          { props: 'serviceDealerCode', label: '服务门店编码', visible: true, width: 150 },
          { props: 'serviceDealerName', label: '服务门店名称', visible: true, width: 200 },
          {
            props: 'vehicleMaterialCode',
            label: '整车物料',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.vehicleMaterialId) {
                  this.navigateToRoute({
                    path: '/sales/datacenter/materials/vehicleMaterials/detail',
                    query: {
                      id: row.vehicleMaterialId,
                    },
                  });
                }
              },
              type: 'primary'
            }]
          },
          { props: 'vehicleMaterialDesc', label: '物料描述', visible: true, width: 250 },
          { props: 'vdcInboundOn', label: 'VDC入库时间', visible: true, width: 180 },
          { props: 'vehicleSeriesName', label: '车系', visible: true, width: 150 },
          { props: 'vehicleModelName', label: '车型', visible: true, width: 150 },
          { props: 'rangePowerName', label: '动力', visible: true, width: 100 },
          { props: 'drivingRangeName', label: '续航', visible: true, width: 100 },
          { props: 'exteriorName', label: '外饰', visible: true, width: 100 },
          { props: 'interiorName', label: '内饰', visible: true, width: 100 },
          { props: 'wheelHubName', label: '轮毂', visible: true, width: 100 },
          { props: 'nextMaintainDate', label: '下次保养时间', visible: true, width: 160 },
          { props: 'nextMaintainMileage', label: '下次保养里程', visible: true, width: 150 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            width: 200,
            fixed: 'right',
            buttons: [
              {
                name: '退车',
                click: (rowIndex, row) => {
                  this.visible = true;
                },
                type: 'info'
              },
              {
                name: '关键日志',
                click: (rowIndex, row) => {
                  this.clickItemId = row.id;
                  this.drawerVisible = true;
                },
                type: 'info'
              },
              {
                name: '维修履历',
                click: (rowIndex, row) => {
                  this.clickItemId = row.id;
                  this.drawerVisible2 = true;
                },
                type: 'info'
              },
              {
                name: '终身权益',
                click: (rowIndex, row) => {
                  this.benefitVisible = true;
                  this.benefitId = row.id;
                },
                type: 'info'
              }
            ]
          }
        ],
        total: 0
      },
      // 退车
      visible: false,
      // 关键日志
      drawerVisible: false,
      // 维修履历
      drawerVisible2: false,
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    onBenefit () {

    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/datacenter/vehicle/vehicleProfile/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '车辆档案管理',
        dataFetchPath: 'datacenter/web/vehicle/vehicleProfile/pageFlat',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '车辆档案管理.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (Array.isArray(data[key]) && !data[key].length) {
          delete data[key];
        }
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      const keys = [
        'salesDate',
        'vdcInboundOn',
        'nextMaintainDate',
        'createTime',
        'updateTime',
        'bindingOn',
        'warrantyStartdate',
      ];
      keys.forEach(key => {
        if (this.form[key]) {
          delete data[key];
          if (this.form[key].length > 1) {
            data[key + 'Start'] = this.form[key][0];
            data[key + 'End'] = this.form[key][1];
          }
        }
      });

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    vehicleRangePower (query) {
      return vehicleRangePower({
        rangePowerNameLike: query,
      });
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
      // const ids = this.selectionList.map(item => item.id) || [];
      // this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   enableItem({
      //     idSet: ids,
      //     status
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!'
      //     });
      //     this.getData();
      //   }).catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '操作失败!'
      //     });
      //   });
      // });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-profile-list {
}
</style>
