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
        <el-input
          placeholder="请输入"
          v-model="form.code"
          clearable
        />
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input
          placeholder="请输入"
          v-model="form.carPlate"
          clearable
        />
      </el-form-item>
      <el-form-item label="VIN码" v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.vehProfileVin"
          clearable
        />
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
          <el-input
            placeholder="请输入"
            v-model="form.appointmentNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="门店">
          <dealer-select v-model="form.dealerCodes" multiple/>
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
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, getStatistics } from '@/api/maintain/sp/serviceProxy/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import DealerSelect from '@/components/dealer-select/index.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  dataSource: '',
  orderStatus: '',
  warrantyTypeCollect: '',
  customerName: '',
  custType: '',
  vehModelName: '',
  carPlate: '',
  dealerName: '',
  appointmentNo: '',
  mileage: '',
  lastMileage: '',
  startWarrantyDate: '',
  exclusiveServiceDealerName: '',
  expectFinishAt: '',
  createStatementInfoDate: '',
  serviceOwnerId: '',
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
    DealerSelect
  },
  data () {
    return {
      pageTitle: '接车施工单管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceProxy',
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
          { props: 'orderStatusLabel', label: '工单状态', visible: true, width: 200 },
          { props: 'vehProfileVin', label: 'VIN', visible: true, width: 200 },
          { props: 'warrantyTypeCollect', label: '保修类型（汇总）', visible: true, width: 200 },
          { props: 'customerName', label: '车主姓名', visible: true, width: 200 },
          { props: 'custType', label: '客户类型', visible: true, width: 200 },
          {
            props: 'vehModelName',
            label: '车型',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/sales/datacenter/materials/vehicleModel/detail?id=${row.vehModelId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'carPlate', label: '车牌号', visible: true, width: 200 },
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
          { props: 'mileage', label: '进店里程数', visible: true, width: 200 },
          { props: 'lastMileage', label: '上次进店里程数', visible: true, width: 200 },
          { props: 'startWarrantyDate', label: '保修开始日期', visible: true, width: 200 },
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
          { props: 'createTime', label: '开单时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '保存',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                deleteItem([row.id]).then(() => {
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
              },
              type: 'danger'
            }]
          }
        ],
        total: 0
      },
      tabList: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.getTabsList();
  },
  methods: {
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
        path: '/maintain/sp/serviceProxy/edit'
      });
    },
    onSubmit () {
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
        businessType: '接车施工单管理',
        dataFetchPath: 'maintain/web/sp/serviceProxy/page',
        reqParams: this.getFormData(),
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
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

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
      getStatistics().then(res => {
        const target = res || {};
        this.tabList = [
          { orderStatusLabel: '全部', orderStatus: '', count: null },
          target.preCheckCount,
          target.makeOrderCount,
          target.dispatchCount,
          target.constructionCount,
          target.finalCheckCount,
          target.outboundCount,
        ];
      });
    }
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
