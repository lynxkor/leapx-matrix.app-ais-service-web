<template>
  <div class="page-common m-service-proxy-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="单据编号">
        <tag-input v-model="form.codes" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input placeholder="请输入" v-model="form.carPlateLike" clearable />
      </el-form-item>
      <el-form-item label="VIN码" v-show="this.visibleCount === 3 || show">
        <el-input placeholder="请输入" v-model="form.vehProfileVinLike" clearable />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="车主姓名">
          <el-input
            placeholder="请输入"
            v-model="form.customerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="车主手机">
          <el-input
            placeholder="请输入"
            v-model="form.customerPhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="送修人手机">
          <el-input
            placeholder="请输入"
            v-model="form.shuttlePhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="预约单号">
          <tag-input v-model="form.appointmentNoList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="门店">
          <fetch-select
            :remote-method="getDealerList"
            remote
            v-model="form.dealerCodes"
            placeholder="请输入门店编码或名称"
            labelKey="orgName"
            valueKey="orgCode"
            subLabelKey="orgCode"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="签字状态">
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
        <el-form-item label="工单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="OrderStatusEnum"
            v-model="form.orderStatusList"
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
        <el-form-item label="业务类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="BusinessTypeEnum"
            v-model="form.businessTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="三包预警">
          <fetch-select
            :request="fetchOptions"
            enumCode="alarm_level"
            v-model="form.alarmLevelList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="开单时间">
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
        <el-form-item label="预计交车时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.expectFinishAt"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="保修开始日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.startWarrantyDate"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="销售日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.saleDate"
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
            v-model="form.repairItemTypeDetailCollectLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="登记人">
          <fetch-select
            :remote-method="getUserList"
            remote
            v-model="form.createNameList"
            placeholder="请输入"
            labelKey="username"
            valueKey="username"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="车型">
          <fetch-select
            :remote-method="getVehicleModelList"
            remote
            v-model="form.vehModelNameList"
            placeholder="请输入"
            labelKey="name"
            valueKey="name"
            clearable
            multiple
            filterable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-show="canList"
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
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button> -->
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <div class="ais-tabs">
      <div v-for="(item, index) in tabList" :key="item.orderStatusLabel" :class="{'ais-tabs-item': true, 'active': item.orderStatus == form.orderStatus}" @click="handleTabClick(item.orderStatus)">
        {{item.orderStatusLabel}}
        <span v-if="index">({{ item.count }})</span>
      </div>
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
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
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
import { getList, deleteItem, enableItem, getStatistics, getDecrypt } from '@/api/maintain/sp/serviceProxy/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, repairItemType, listVehicleModel, getUserByNameOrNo } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import EditPage from './edit.vue';
import moment from 'moment';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  codes: [],
  dataSource: '',
  orderStatus: '',
  repairItemTypeDetailCollectLike: '',
  customerName: '',
  custType: '',
  vehModelName: '',
  carPlateLike: '',
  vehProfileVinLike: '',
  dealerName: '',
  appointmentNoList: [],
  mileage: '',
  lastMileage: '',
  startWarrantyDate: [],
  saleDate: [],
  exclusiveServiceDealerName: '',
  expectFinishAt: [],
  createStatementInfoDate: '',
  serviceOwnerId: '',
  orderStatusList: [],
  dataSourceList: [],
  businessTypeList: [],
  alarmLevelList: [],
  createTime: [],
  repairItemTypeCollectList: [],
  createNameList: [],
  vehModelNameList: [],
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
    FetchSelect,
    TagInput
  },
  data () {
    const defaultData = this.getDefautlForm();
    return {
      pageTitle: '接车施工单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceProxy',
      form: {
        ...defaultData
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'serviceProxyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '单据编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '工单状态', visible: true, width: 120 },
          { props: 'alarmLevelLabel', label: '三包预警', visible: true, width: 120 },
          { props: 'businessTypeLabel', label: '业务类型', visible: true, width: 120 },
          {
            props: 'vehProfileVin',
            label: 'VIN',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDecrypt(row.id, 'vehProfileVin'),
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/vehicle/vehicleProfile/edit?id=${row.vehProfileId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'repairItemTypeDetailCollect', label: '维修类型（汇总）', visible: true, width: 200 },
          { props: 'customerName', label: '车主姓名', visible: true, width: 200, mask: true, getValue: (row) => getDecrypt(row.id, 'customerName') },
          { props: 'customerPhone', label: '车主电话', visible: true, width: 200, mask: true, getValue: (row) => getDecrypt(row.id, 'customerPhone') },
          { props: 'shuttleName', label: '送修人姓名', visible: true, width: 200, mask: true, getValue: (row) => getDecrypt(row.id, 'shuttleName') },
          { props: 'shuttlePhone', label: '送修人电话', visible: true, width: 200, mask: true, getValue: (row) => getDecrypt(row.id, 'shuttlePhone') },
          { props: 'custTypeLabel', label: '客户类型', visible: true, width: 200 },
          {
            props: 'vehModelName',
            label: '车型',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleModel/edit?id=${row.vehModelId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'carPlate', label: '车牌号', visible: true, width: 200, mask: true, getValue: (row) => getDecrypt(row.id, 'carPlate') },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'appointmentNo', label: '预约单号', visible: true, width: 200 },
          { props: 'mileage', label: '进店里程数(KM)', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'lastMileage', label: '上次进店里程数(KM)', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'startWarrantyDate', label: '保修开始日期', visible: true, width: 200 },
          { props: 'saleDate', label: '销售日期', visible: true, width: 200 },
          {
            props: 'exclusiveServiceDealerName',
            label: '专属服务门店',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'expectFinishAt', label: '预计交车时间', visible: true, width: 200 },
          { props: 'creatorName', label: '登记人', visible: true, width: 200 },
          { props: 'signStatusLabel', label: '签字状态', visible: true, width: 200 },
          { props: 'signChannelLabel', label: '签字渠道', visible: true, width: 200 },
          { props: 'signGeneratedOn', label: '签字生成时间', visible: true, width: 200 },
          { props: 'signCompletedOn', label: '签字完成时间', visible: true, width: 200 },
          { props: 'createTime', label: '开单时间', visible: true, width: 200, sortable: true, fixed: 'right' },
        ],
        total: 0
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
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/maintain/sp/serviceProxy/edit'
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
        businessType: '接车施工单管理',
        dataFetchPath: 'maintain/web/sp/serviceProxy/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '接车施工单管理.xlsx');
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
          if (!res || !res.records) {
            this.$message.warning('数据获取失败，请稍后重试');
            this.optionObj.dataList = [];
            this.optionObj.total = 0;
            return;
          }
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total || 0;
        }).catch(() => {
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
        }).finally(() => {
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
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      // 处理 tag-input 批量查询字段：单值时转为普通字段，多值时保留数组
      const tagInputFields = {
        codes: 'code',
        appointmentNoList: 'appointmentNo'
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
      // 处理预计交车时间
      if (this.form.expectFinishAt) {
        delete data.expectFinishAt;
        if (this.form.expectFinishAt.length > 1) {
          data.expectFinishAtStart = this.form.expectFinishAt[0];
          data.expectFinishAtEnd = this.form.expectFinishAt[1];
        }
      }
      // 处理保修开始日期
      if (this.form.startWarrantyDate) {
        delete data.startWarrantyDate;
        if (this.form.startWarrantyDate.length > 1) {
          data.startWarrantyDateStart = this.form.startWarrantyDate[0];
          data.startWarrantyDateEnd = this.form.startWarrantyDate[1];
        }
      }
      // 处理销售日期
      if (this.form.saleDate) {
        delete data.saleDate;
        if (this.form.saleDate.length > 1) {
          data.saleDateStart = this.form.saleDate[0];
          data.saleDateEnd = this.form.saleDate[1];
        }
      }
      // 转数字
      if (this.form.alarmLevelList.length) {
        const list = this.form.alarmLevelList.map(item => Number(item));
        data.alarmLevelList = [...list];
      }
      data.sortColumns = this.sortColumns;
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
    handleTabClick (v) {
      this.form.orderStatus = v;
      this.optionObj.form.page = 1;
      this.debouncedGetData();
    },
    getTabsList () {
      getStatistics({ ...this.getFormData() }).then(res => {
        const target = res || {};
        this.tabList = [
          { orderStatusLabel: '全部', orderStatus: '', count: null },
          target.preCheckCount || {},
          target.makeOrderCount || {},
          target.dispatchCount || {},
          target.constructionCount || {},
          target.finalCheckCount || {},
          target.outboundCount || {},
        ];
      }).catch(() => {
        this.tabList = [
          { orderStatusLabel: '全部', orderStatus: '', count: null },
        ];
      });
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
  }
};
</script>

<style lang="scss" scoped>
.m-service-proxy-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
}
</style>
