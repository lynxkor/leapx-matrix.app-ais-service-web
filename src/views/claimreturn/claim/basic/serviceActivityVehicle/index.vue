<template>
  <div class="page-common m-service-activity-vehicle-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="VIN">
        <tag-input v-model="form.vins" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="活动编码">
        <el-input
          placeholder="请输入"
          v-model="form.activityCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="活动名称"  v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.activityNameLike"
          clearable
        />
      </el-form-item>
      <template v-if="show">

        <el-form-item label="活动状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="claim_activity_state"
            v-model="form.activityStatuses"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="活动类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="claim_activity_type"
            v-model="form.activityTypes"
            :format="filterActivityType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="活动结束时间">
          <el-date-picker
            v-model="form.endTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="计划实施门店名称">
          <dealer-select v-model="form.plannedDealerCodes" multiple/>
        </el-form-item>
        <el-form-item label="是否完成">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.finishedList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="完成时间">
          <el-date-picker
            v-model="form.finishTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="实际施工门店名称">
          <dealer-select v-model="form.actualDealerCodes" multiple/>
        </el-form-item>

        <el-form-item label="接车施工单号">
          <el-input
            placeholder="请输入"
            v-model="form.workOrderNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="车主手机号码">
          <el-input
            placeholder="请输入"
            v-model="form.ownerPhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="施工方案">
          <list-select
            listUrl="/claimreturn/claim/web/basic/techServiceActivityScheme/list"
            placeholder="请选择"
            v-model="form.schemeIds"
            query-key="schemeNameLike"
            auto-load-options
            no-param-load
            multiple
            filterable
            clearable
            :params="{}" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
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
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
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
      id="serviceActivityVehicle"
      @close="handleUploadDialogClose"
    />
    <!-- 完成活动弹窗 -->
    <FinishActDialog
      :visible.sync="finishActDialogVisible"
      :info="finishActDialogInfo"
      @refresh="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList,
  deleteItem,
  enableItem,
  getDetailDecryptField
} from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, getEndOfDayString, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';
import TagInput from '@/libs/components/TagInput/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
import FinishActDialog from './components/finishActDialog.vue';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  activityCode: '',
  vin: '',
  activityName: '',
  activityType: '',
  activityStatus: '',
  startTime: '',
  endTime: '',
  plannedDealerName: '',
  finished: '',
  actualDealerName: '',
  finishTime: '',
  workOrderNo: '',
  ownerPhone: '',
  schemeName: '',
  createTime: '',
  updateTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    DealerSelect,
    TagInput,
    ListSelect,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    Upload,
    FinishActDialog,
    EditPage
  },
  data () {
    return {
      pageTitle: '服务活动车辆',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-serviceActivityVehicle',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      finishActDialogVisible: false,
      clickItemId: '',
      finishActDialogInfo: {},
      optionObj: {
        id: 'serviceActivityVehicleTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'activityCode',
            label: '活动编码',
            visible: true,
            width: 200,
            fixed: 'left',
            centralized: true,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/basic/serviceActivityVehicle/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'vin')
          },
          { props: 'activityName', label: '活动名称', visible: true, width: 200, centralized: true },
          { props: 'activityTypeLabel', label: '活动类型', visible: true, width: 200, centralized: true },
          { props: 'activityStatusLabel', label: '活动状态', visible: true, width: 200 },
          { props: 'startTime', label: '活动开始时间', visible: true, width: 200 },
          { props: 'endTime', label: '活动结束时间', visible: true, width: 200 },
          { props: 'plannedDealerName', label: '计划实施门店名称', visible: true, width: 200 },
          { props: 'finishedLabel', label: '是否完成', visible: true, width: 200 },
          { props: 'actualDealerName', label: '实际施工门店名称', visible: true, width: 200 },
          { props: 'finishTime', label: '完成时间', visible: true, width: 200 },
          { props: 'workOrderNo', label: '接车施工单号', visible: true, width: 200 },
          {
            props: 'ownerPhone',
            label: '车主手机号码',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'ownerPhone')
          },
          { props: 'schemeName', label: '方案名称', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              disabled: row => row.finished === '1',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/basic/serviceActivityVehicle/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              // eslint-disable-next-line no-warning-comments
              name: '完成',
              disabled: row => row.finished === '1',
              click: (rowIndex, row) => {
                this.finishActDialogInfo = row;
                this.finishActDialogVisible = true;
              },
              type: 'info'
            }, {
              name: '删除',
              disabled: row => row.finished === '1',
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
      storeOptions: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/claimreturn/claim/basic/serviceActivityVehicle/edit'
      });
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '服务活动车辆',
        dataFetchPath: '/claimreturn/claim/web/basic/serviceActivityVehicle/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '服务活动车辆.xlsx');
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
    handleListSelect (row) {
      this.clickItemId = row.id;
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
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = getEndOfDayString(this.form.updateTime[1]);
        }
      }

      if (this.form.startTime) {
        delete data.startTime;
        if (this.form.startTime.length > 1) {
          data.startTimeStart = this.form.startTime[0];
          data.startTimeEnd = getEndOfDayString(this.form.startTime[1]);
        }
      }

      if (this.form.endTime) {
        delete data.endTime;
        if (this.form.endTime.length > 1) {
          data.endTimeStart = this.form.endTime[0];
          data.endTimeEnd = getEndOfDayString(this.form.endTime[1]);
        }
      }

      if (this.form.finishTime) {
        delete data.finishTime;
        if (this.form.finishTime.length > 1) {
          data.finishTimeStart = this.form.finishTime[0];
          data.finishTimeEnd = getEndOfDayString(this.form.finishTime[1]);
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

    filterActivityType (options) {
      return options.filter(item => item.code !== '4');
    }
  }
};
</script>

<style lang="scss" scoped>
.m-service-activity-vehicle-list {
}
</style>
