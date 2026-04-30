<template>
  <div class="page-common m-service-dealer-change-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="申请单号">
        <TagInput
          v-model="form.applyNoList"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="申请状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="vehicle_service_dealer_change_status"
          v-model="form.applyStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="申请人">
          <el-input
            placeholder="请输入"
            v-model="form.applierNameLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.applyTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="一级审批人">
          <el-input
            placeholder="请输入"
            v-model="form.firstApproverNameLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="一级审批时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.firstApproveTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="最终审批人">
          <el-input
            placeholder="请输入"
            v-model="form.finalApproverNameLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="最终审批时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.finalApproveTime"
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
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
    <!-- 一级审批驳回弹窗 -->
    <FirstApproveRejectDialog
      :visible.sync="firstApproveDialogVisible"
      :id="currentApproveId"
      @success="getData"
    />
    <!-- 最终审批驳回弹窗 -->
    <FinalApproveRejectDialog
      :visible.sync="finalApproveDialogVisible"
      :id="currentApproveId"
      @success="getData"
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
  firstApprovePass,
  finalApprovePass,
  submit,
} from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';
import { getTableConfig, tableAddOrUpdate, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import FirstApproveRejectDialog from './FirstApproveRejectDialog/index.vue';
import FinalApproveRejectDialog from './FinalApproveRejectDialog/index.vue';
import { APPLY_STATUS } from './constant';

const defaultForm = {
  createTime: '',
  updateTime: '',
  applyNoList: [],
  applyStatusList: [],
  applierNameLike: '',
  applyTime: '',
  firstApproverNameLike: '',
  firstApproveTime: '',
  finalApproverNameLike: '',
  finalApproveTime: '',
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
    EditPage,
    Upload,
    TagInput,
    FirstApproveRejectDialog,
    FinalApproveRejectDialog,
  },
  data () {
    return {
      pageTitle: '专属服务门店变更',
      pageType: 'list',
      moduleKey: 'AISMC-serviceDealerChangeApply',
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
      firstApproveDialogVisible: false,
      currentApproveId: '',
      finalApproveDialogVisible: false,
      canSubmit: false,
      canFirstApprove: false,
      canFinalApprove: false,
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      sortColumns: [],
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'serviceDealerChangeApplyTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'applyNo',
            label: '申请单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/serviceDealerChangeApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'applyStatusLabel', label: '申请状态', visible: true, width: 200 },
          { props: 'applierName', label: '申请人', visible: true, width: 200 },
          { props: 'applyTime', label: '申请时间', visible: true, width: 200 },
          { props: 'applyReason', label: '申请原因', visible: true, width: 200 },
          { props: 'vehicleCount', label: '申请数量', visible: true, width: 200 },
          { props: 'firstApproverName', label: '一级审批人', visible: true, width: 200 },
          { props: 'firstApproveTime', label: '一级审批时间', visible: true, width: 200 },
          { props: 'firstApproveComment', label: '一级审批说明', visible: true, width: 200 },
          { props: 'finalApproverName', label: '最终审批人', visible: true, width: 200 },
          { props: 'finalApproveTime', label: '最终审批时间', visible: true, width: 200 },
          { props: 'finalApproveComment', label: '最终审批说明', visible: true, width: 200 },
          {
            props: 'createTime',
            label: '创建时间',
            visible: true,
            width: 200,
          },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '提交',
              click: (rowIndex, row) => {
                this.handleSubmit(row);
              },
              type: 'info',
              show: (row) => {
                if (!this.canSubmit) { return false; }
                return row.applyStatus === APPLY_STATUS.DRAFT || row.applyStatus === APPLY_STATUS.REJECTED;
              },
            }, {
              name: '一级审批通过',
              click: (rowIndex, row) => {
                this.handleFirstApprovePass(row);
              },
              type: 'info',
              show: (row) => {
                if (!this.canFirstApprove) { return false; }
                return row.applyStatus === APPLY_STATUS.FIRST_PENDING;
              },
            }, {
              name: '一级审批驳回',
              click: (rowIndex, row) => {
                this.handleFirstApproveReject(row);
              },
              type: 'danger',
              show: (row) => {
                if (!this.canFirstApprove) { return false; }
                return row.applyStatus === APPLY_STATUS.FIRST_PENDING;
              },
            }, {
              name: '最终审批通过',
              click: (rowIndex, row) => {
                this.handleFinalApprovePass(row);
              },
              type: 'info',
              show: (row) => {
                if (!this.canFinalApprove) { return false; }
                return row.applyStatus === APPLY_STATUS.FINAL_PENDING;
              },
            }, {
              name: '最终审批驳回',
              click: (rowIndex, row) => {
                this.handleFinalApproveReject(row);
              },
              type: 'danger',
              show: (row) => {
                if (!this.canFinalApprove) { return false; }
                return row.applyStatus === APPLY_STATUS.FINAL_PENDING;
              },
            }]
          }
        ],
        total: this.tableTotal
      };
    },
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.canSubmit = this.permissions.has(`${this.moduleKey}-submit`);
    this.canFirstApprove = this.permissions.has(`${this.moduleKey}-firstApprove`);
    this.canFinalApprove = this.permissions.has(`${this.moduleKey}-finalApprove`);
  },
  methods: {
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
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
        path: '/datacenter/vehicle/serviceDealerChangeApply/edit'
      });
    },
    onSubmit () {
      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.tableForm.page = 1;
      this.tableForm.pageSize = pageSize;
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.tableTotal = res.total;
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
        this.tableForm.page = num;
      } else {
        this.tableForm.size = num;
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

      // 动态处理所有日期范围字段
      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }
      if (this.form.applyTime) {
        delete data.applyTime;
        if (this.form.applyTime.length > 1) {
          data.applyTimeStart = this.form.applyTime[0];
          data.applyTimeEnd = this.form.applyTime[1];
        }
      }
      if (this.form.firstApproveTime) {
        delete data.firstApproveTime;
        if (this.form.firstApproveTime.length > 1) {
          data.firstApproveTimeStart = this.form.firstApproveTime[0];
          data.firstApproveTimeEnd = this.form.firstApproveTime[1];
        }
      }
      if (this.form.finalApproveTime) {
        delete data.finalApproveTime;
        if (this.form.finalApproveTime.length > 1) {
          data.finalApproveTimeStart = this.form.finalApproveTime[0];
          data.finalApproveTimeEnd = this.form.finalApproveTime[1];
        }
      }

      // 排序字段
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
    // 提交
    handleSubmit (row) {
      submit({ id: row.id }).then(() => {
        this.$message.success('提交成功');
        this.getData();
      });
    },
    // 一级审批通过
    handleFirstApprovePass (row) {
      firstApprovePass({ id: row.id }).then(() => {
        this.$message.success('操作成功');
        this.getData();
      });
    },
    // 一级审批驳回
    handleFirstApproveReject (row) {
      this.currentApproveId = row.id;
      this.firstApproveDialogVisible = true;
    },
    // 最终审批通过
    handleFinalApprovePass (row) {
      finalApprovePass({ id: row.id }).then(() => {
        this.$message.success('操作成功');
        this.getData();
      });
    },
    // 最终审批驳回
    handleFinalApproveReject (row) {
      this.currentApproveId = row.id;
      this.finalApproveDialogVisible = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.m-service-dealer-change-apply-list {
}
</style>
