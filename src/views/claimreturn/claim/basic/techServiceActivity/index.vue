<template>
  <div class="page-common m-service-activity-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="活动编码">
        <el-input
          placeholder="请输入"
          v-model="form.activityCodeLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input
          placeholder="请输入"
          v-model="form.activityNameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="活动类型"  v-show="!isServiceCareActivity && (this.visibleCount === 3 || show)">
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
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="daterange"
            unlink-panels
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
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
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
        <el-form-item label="修改时间">
          <el-date-picker
            v-model="form.updateTime"
            type="daterange"
            unlink-panels
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
        <EditPage slot="centralizedViewSlot" :id="clickItemId" :showBackBtn="false"/>
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction/index.vue';
import {
  getList,
  deleteItem,
  enableItem,
  submitPartsPreparation, partsPreparationCompleted
} from '@/api/claimreturn/claim/basic/serviceActivity';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, getEndOfDayString, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  activityCode: '',
  activityName: '',
  activityType: '',
  activityStatus: '',
  startTime: '',
  endTime: '',
  attachmentRequired: '',
  description: '',
  vehicleCount: '',
  updateTime: '',
  finishedVehicleCount: '',
  finishedPercent: '',
  createTime: '',
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
    FetchSelect,
    EditPage
  },
  data () {
    const moduleKey = 'AISCR-' + this.$route.meta.moduleKey;
    return {
      pageTitle: this.$route.meta.name,
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey,
      isServiceCareActivity: this.$route.meta.isServiceCareActivity,
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
        id: 'serviceActivityTable',
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
            width: 120,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: this.getPath(),
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'activityName', label: '活动名称', visible: true, width: 150 },
          { props: 'activityTypeLabel', label: '活动类型', visible: true, width: 120 },
          { props: 'activityStatusLabel', label: '活动状态', visible: true, width: 150 },
          { props: 'startTime', label: '活动开始时间', visible: true, width: 180 },
          { props: 'endTime', label: '活动结束时间', visible: true, width: 180 },
          { props: 'description', label: '活动描述', visible: true, width: 200 },
          { props: 'attachmentRequiredLabel', label: '施工单必需上传附件', visible: true, width: 180 },
          { props: 'vehicleCount', label: '活动数量', visible: true, width: 120 },
          { props: 'finishedVehicleCount', label: '完成数量', visible: true, width: 120 },
          { props: 'finishedPercent', label: '完成情况(%)', visible: true, width: 130 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              // show: (row) => {
              //   return row.activityStatus === '0';
              // },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: this.getPath(),
                  query: {
                    id: row.id,
                    isEditing: true,
                  }
                });
              },
              type: 'info'
            }, {
              name: '提交零配件准备',
              show: (row) => {
                return row.activityStatus === '0' && this.permissions.has(moduleKey + '-submitPartsPreparation');
              },
              click: this.handleSubmitPartsPreparation,
              type: 'info'
            },
            {
              name: '零配件准备完成',
              click: this.partsPreparationCompleted,
              type: 'info',
              show: (row) => {
                return row.activityStatus === '1' && this.permissions.has(moduleKey + '-partsPreparationCompleted');
              },
            }]
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.getData();
  },
  methods: {
    getPath () {
      if (this.isServiceCareActivity) {
        return '/claimreturn/claim/basic/serviceCareActivity/edit?isEditing=1';
      }
      return '/claimreturn/claim/basic/techServiceActivity/edit?isEditing=1';
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: this.getPath(),
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '技术服务活动',
        dataFetchPath: 'claimreturn/claim/web/basic/serviceActivity/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '技术服务活动.xlsx');
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

      getList({
        ...this.getFormData(),
        pageNum: this.optionObj.form.page,
        pageSize: this.optionObj.form.size,
        isServiceCareActivity: this.isServiceCareActivity,
      })
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
    },
    handleSubmitPartsPreparation (index, row) {
      let param = { id: row.id };
      submitPartsPreparation(param).then(res => {
        this.$message({
          type: 'success',
          message: '提交配件准备成功'
        });
        this.getData();
      });
    },
    partsPreparationCompleted (index, row) {
      let param = { id: row.id };
      partsPreparationCompleted(param).then(res => {
        this.$message({
          type: 'success',
          message: '零配件准备完成'
        });
        this.getData();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-service-activity-list {
}
</style>
