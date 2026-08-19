<template>
  <div class="page-common m-service-statement-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="接车施工单号">
        <tag-input v-model="form.serviceProxyCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="结算单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VIN码">
        <tag-input v-model="form.vehProfileVinList" placeholder="请输入" />
      </el-form-item>
       <el-form-item label="创建时间">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="车牌号">
        <tag-input v-model="form.carPlateList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="门店" v-show="this.visibleCount === 3 || show">
        <dealer-select v-model="form.dealerCodes" multiple />
      </el-form-item>
      <el-form-item label="签字状态" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="SignStatusEnum"
          v-model="form.signStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="签字渠道">
          <fetch-select
            :request="fetchOptions"
            enumCode="SignChannelEnum"
            v-model="form.signChannelList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="签字生成时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.signGeneratedOn"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="签字完成时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.signCompletedOn"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="结算单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="SettlementStatusEnum"
            v-model="form.statementStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="结算单类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatementOrderTypeEnum"
            v-model="form.statementTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="数据来源">
          <fetch-select
            :request="fetchOptions"
            enumCode="ServiceProxyDataSource"
            v-model="form.dataSourceList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="销账标识">
          <fetch-select
            :request="fetchOptions"
            enumCode="WriteOffFlagEnum"
            v-model="form.accountTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="是否已推送满意度">
          <fetch-select
            :request="fetchOptions"
            enumCode="SatisfactionPushStatusEnum"
            v-model="form.isPushVisitResultList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="结算时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.statementTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="收款时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.receiveTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="维修类型（汇总）">
          <!-- <fetch-select
            :remote-method="getRepairItemTypeList"
            remote
            v-model="form.repairItemTypeCollectList"
            placeholder="请输入"
            labelKey="name"
            valueKey="id"
            clearable
            multiple
            filterable
          /> -->
          <el-input
            placeholder="请输入"
            v-model="form.warrantyTypeCollectLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="结算人员">
          <fetch-select
            :remote-method="getUserList"
            remote
            v-model="form.statementPersonNameList"
            placeholder="请输入"
            labelKey="username"
            valueKey="username"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="收款人员">
          <fetch-select
            :remote-method="getUserList"
            remote
            v-model="form.payeeNameList"
            placeholder="请输入"
            labelKey="username"
            valueKey="username"
            clearable
            multiple
            filterable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canPage"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
      <el-button v-if="canImport" size="small" @click="handleImport"
        >导入</el-button
      >
      <el-button
        v-if="canExport"
        :loading="exportLoading"
        size="small"
        @click="exportExcel"
        >导出</el-button
      >
      <el-button
        v-if="canDelete"
        size="small"
        @click="handleBatchDelete"
        :disabled="selectionList.length === 0"
        >批量删除</el-button
      >
      <el-button
        v-if="canEnableOrDisable"
        size="small"
        @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0"
        >批量启用</el-button
      >
      <el-button
        v-if="canEnableOrDisable"
        size="small"
        @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0"
        >批量停用</el-button
      >
    </div>
    <div class="ais-tabs">
      <div
        v-for="(item, index) in tabList"
        :key="item.statementStatusLabel"
        :class="{
          'ais-tabs-item': true,
          active: item.statementStatus == form.statementStatus,
        }"
        @click="handleTabClick(item.statementStatus)"
      >
        {{ item.statementStatusLabel }}
        <span v-if="index">({{ item.count }})</span>
      </div>
    </div>
    <div class="ais-table-c">
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
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList,
  deleteItem,
  enableItem,
  getStatistics,
  getDecrypt,
} from '@/api/maintain/sp/serviceStatement/index';
import {
  getTableConfig,
  tableAddOrUpdate,
  exportTable,
  getEnum,
  repairItemType,
  listVehicleModel,
  getUserByNameOrNo,
} from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import DealerSelect from '@/components/dealer-select';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import moment from 'moment';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  codeList: [],
  serviceProxyCodeList: [],
  vehProfileVinList: [],
  carPlateList: [],
  createReStatement: '',
  statementStatus: '',
  statementStatusList: [],
  statementTypeList: [],
  dataSourceList: [],
  accountTypeList: [],
  isPushVisitResultList: [],
  createTime: [],
  statementTime: [],
  receiveTime: [],
  warrantyTypeCollectLike: '',
  statementPersonNameList: [],
  payeeNameList: [],
  repairItemTypeDetailCollectLike: ''
};

const pageSize = 20;
const mockConfig = {
  data: null,
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    EditPage,
    Upload,
    DealerSelect,
    FetchSelect,
    TagInput
  },
  data () {
    const defaultData = this.getDefautlForm();
    return {
      pageTitle: '结算单表管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceStatement',
      form: {
        ...defaultData,
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'serviceStatementTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize,
        },
        dataProp: [
          {
            props: 'code',
            label: '结算单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [
              {
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/maintain/sp/serviceStatement/edit',
                    query: {
                      id: row.id,
                    },
                  });
                },
                type: 'primary',
              },
            ],
          },
          {
            props: 'dataSourceLabel',
            label: '数据来源',
            visible: true,
            width: 120,
          },
          {
            props: 'statementTypeLabel',
            label: '结算单类型',
            visible: true,
            width: 120,
          },
          {
            props: 'statementStatusLabel',
            label: '结算单状态',
            visible: true,
            width: 120,
          },
          {
            props: 'serviceProxyCode',
            label: '接车施工单',
            visible: true,
            width: 200,
            buttons: [
              {
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/maintain/sp/serviceProxy/edit',
                    query: {
                      id: row.serviceProxyId,
                    },
                  });
                },
                type: 'primary',
              },
            ],
          },

          {
            props: 'warrantyTypeCollect',
            label: '维修类型（汇总）',
            visible: true,
            width: 200,
          },
          {
            props: 'accountTypeLabel',
            label: '销账标识',
            visible: true,
            width: 200,
          },
          {
            props: 'vehProfileVin',
            label: 'VIN码',
            visible: true,
            width: 220,
            copy: true,
            buttons: [
              {
                click: (rowIndex, row) => {
                  window.open(`/service/datacenter/vehicle/vehicleProfile/edit?id=${row.vehProfileId}`, '_blank');
                },
                type: 'primary'
              }
            ]
          },
          {
            props: 'customerName',
            label: '车主姓名',
            visible: true,
            width: 200,
          },
          { props: 'carPlate', label: '车牌号', visible: true, width: 200, mask: true, getValue: (row) => getDecrypt(row.id, 'carPlate') },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'repairItemAmount',
            label: '维修项目金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'repairItemDiscount',
            label: '维修项优惠金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'repairItemPayableAmount',
            label: '维修项应付金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'partAmount',
            label: '零件金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'partDiscount',
            label: '零件优惠金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'partPayableAmount',
            label: '零件应付金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'rightsAmount',
            label: '权益金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'discountAmount',
            label: '优惠总金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'noFractionAmount',
            label: '去零金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'totalAmount',
            label: '总金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'payableAmount',
            label: '实际应付总金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'remainAmount',
            label: '剩余应付款金额',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'nextMaintenanceMileage',
            label: '下次保养里程',
            visible: true,
            width: 200,
            align: 'right',
            headerAlign: 'right'
          },
          {
            props: 'nextMaintenanceTime',
            label: '下次保养时间',
            visible: true,
            width: 200,
          },
          {
            props: 'createReStatementLabel',
            label: '是否已创建反结算申请',
            visible: true,
            width: 200,
          },
          {
            props: 'createWarrantyLabel',
            label: '是否已生成保修单',
            visible: true,
            width: 200,
          },
          {
            props: 'statementPersonName',
            label: '结算人员',
            visible: true,
            width: 200,
          },
          {
            props: 'statementTime',
            label: '结算时间',
            visible: true,
            width: 200,
          },
          { props: 'payeeName', label: '收款人', visible: true, width: 200 },
          {
            props: 'receiveTime',
            label: '收款时间',
            visible: true,
            width: 200,
          },
          {
            props: 'signStatusLabel',
            label: '签字状态',
            visible: true,
            width: 200,
          },
          {
            props: 'signChannelLabel',
            label: '签字渠道',
            visible: true,
            width: 200,
          },
          {
            props: 'signGeneratedOn',
            label: '签字生成时间',
            visible: true,
            width: 200,
          },
          {
            props: 'signCompletedOn',
            label: '签字完成时间',
            visible: true,
            width: 200,
          },
          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true, fixed: 'right' },
        ],
        total: 0,
      },
      tabList: [],
      sortColumns: [{
        column: 'create_time',
        sort: 'DESC'
      }]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    getTabsList () {
      getStatistics({
        ...this.getFormData(),
      }).then((res) => {
        const target = res || {};
        this.tabList = [
          { statementStatusLabel: '全部', statementStatus: '', count: null },
          target.pendingSettlementCount,
          target.pendingReceiptCount,
        ];
      });
    },
    handleTabClick (v) {
      this.form.statementStatus = v;
      this.optionObj.form.page = 1;
      this.debouncedGetData();
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
        path: '/maintain/sp/serviceStatement/edit',
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      const defaultData = this.getDefautlForm() || {};
      this.form = { ...defaultData };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '结算单表管理',
        dataFetchPath: 'maintain/web/sp/serviceStatement/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST',
      })
        .then(async (res) => {
          if (res && res.excelUrl) {
            try {
              await downloadExcel(res.excelUrl, '结算单表管理.xlsx');
            } catch (error) {
              this.$message({
                type: 'error',
                message: '文件导出失败',
              });
            }
          } else {
            this.$confirmExport(
              () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
              { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
            );
          }
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({
        ...this.getFormData(),
        pageNum: this.optionObj.form.page,
        pageSize: this.optionObj.form.size
      })
        .then((res) => {
          this.optionObj.dataList = (res?.records || []).map((item) => {
            return {
              ...item,
              deleteLoading: false,
            };
          });
          this.optionObj.total = res.total;
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
      this.getTabsList();
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id)
          .then((data) => {
            resolve({ data });
          })
          .catch((err) => {
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

      Object.keys(this.form).forEach((key) => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      // 处理 tag-input 批量查询字段：单值时转为模糊字段，多值时保留数组走批量查询
      const tagInputFields = {
        codeList: 'code',
        serviceProxyCodeList: 'serviceProxyCode',
        vehProfileVinList: 'vehProfileVinLike',
        carPlateList: 'carPlateLike'
      };
      Object.keys(tagInputFields).forEach(key => {
        if (Array.isArray(this.form[key])) {
          if (this.form[key].length === 0) {
            delete data[key];
          } else if (this.form[key].length === 1) {
            delete data[key];
            data[tagInputFields[key]] = this.form[key][0];
          }
        }
      });

      // VIN 搜索前后去空格
      if (Array.isArray(data.vehProfileVinList)) {
        data.vehProfileVinList = data.vehProfileVinList.map(v => v.trim());
      }
      if (data.vehProfileVinLike) {
        data.vehProfileVinLike = data.vehProfileVinLike.trim();
      }

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      // 处理签字生成时间
      if (this.form.signGeneratedOn) {
        delete data.signGeneratedOn;
        if (this.form.signGeneratedOn.length > 1) {
          data.signGeneratedOnStart = this.form.signGeneratedOn[0];
          data.signGeneratedOnEnd = this.form.signGeneratedOn[1];
        }
      }
      // 处理签字完成时间
      if (this.form.signCompletedOn) {
        delete data.signCompletedOn;
        if (this.form.signCompletedOn.length > 1) {
          data.signCompletedOnStart = this.form.signCompletedOn[0];
          data.signCompletedOnEnd = this.form.signCompletedOn[1];
        }
      }
      // 处理结算时间
      if (this.form.statementTime) {
        delete data.statementTime;
        if (this.form.statementTime.length > 1) {
          data.statementTimeStart = this.form.statementTime[0];
          data.statementTimeEnd = this.form.statementTime[1];
        }
      }
      // 处理收款时间
      if (this.form.receiveTime) {
        delete data.receiveTime;
        if (this.form.receiveTime.length > 1) {
          data.receiveTimeStart = this.form.receiveTime[0];
          data.receiveTimeEnd = this.form.receiveTime[1];
        }
      }
      // 转换statementStatusList
      data.statementStatusList = this.form.statementStatusList.map((item) => +item);
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getRepairItemTypeList (query) {
      try {
        const res = await repairItemType({ nameOrCodeLike: query });
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    async getUserList (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    async getVehicleModelList (query) {
      try {
        const res = await listVehicleModel({ modelNameLike: query });
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    getDefautlForm () {
      // 获取前30天的日期
      const startTime = moment().subtract(90, 'day').format('YYYY-MM-DD 00:00:00');
      const endTime = moment().format('YYYY-MM-DD 23:59:59');
      return {
        ...defaultForm,
        createTime: [startTime, endTime]
      };
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map((item) => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteItem(ids)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.getData();
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!',
              });
            });
        })
        .catch(() => {});
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData,
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
  },
};
</script>

<style lang="scss" scoped>
.m-service-statement-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 210px);
  }
}
</style>
