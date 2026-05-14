<template>
  <div class="page-common m-repair-item-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
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
      <el-form-item label="维修项目代码">
        <el-input
          placeholder="请输入"
          v-model="form.codeLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="维修项目名称"  v-show="visibleCount === 3 || show">
        <el-input
        placeholder="请输入"
        v-model="form.nameLike"
        clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.statusIncludeList"
            placeholder="请选择"
            clearable
            multiple
          />
        </el-form-item>
        <el-form-item label="保养项目分类">
          <fetch-select
            :request="fetchOptions"
            enumCode="mc_maintenance_item"
            v-model="form.maintenanceItemTypes"
            placeholder="请选择"
            clearable
            multiple
          />
        </el-form-item>

      </template>
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport('IMPORT-202512031408158502')">项目导入</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport('IMPORT-202512031408158503')">配件导入</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport('IMPORT-202512031408158504')">车型导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div
      class="ais-table-c"
      :class="{ 'z-form-show': show }"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <Upload
      :visible="uploadDialogVisible"
      :id="uploadDialogId"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/maintain/basic/repairItem/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { handleBatchStatusChange, getEndOfDayString, downloadExcel } from '@/libs/utils';

const defaultForm = {
  // 多选时字段有变化，自行修复
  codeLike: '',
  nameLike: '',
  statusIncludeList: '',
  maintenanceItemTypes: [],
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
    Upload
  },
  data () {
    return {
      pageTitle: '维修项目',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      moduleKey: 'AISMC-repairItem',
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      uploadDialogId: 'IMPORT-202512031408158502',
      optionObj: {
        id: 'repairItemTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '维修项目代码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/basic/repairItem/edit',
                  query: {
                    id: row.id,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'name', label: '维修项目名称', visible: true, width: 200 },
          { props: 'pinyinCode', label: '拼音简码', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          { props: 'workhour', label: '工时', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'workhourPrice', label: '工时单价', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'maintenanceItemTypeLabel', label: '保养项目分类', visible: true, width: 200 },
          { props: 'maintenanceTime', label: '保养时间（月）', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'maintenanceMileage', label: '保养里程（KM）', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'isBatteryRepairLabel', label: '是否电池维修专用', visible: true, width: 200 },
          { props: 'isActivityLabel', label: '是否活动专用', visible: true, width: 200 },
          { props: 'isWarrantyLabel', label: '是否保修专用', visible: true, width: 200 },
          { props: 'isProdTypeLabel', label: '是否生产类专用', visible: true, width: 200 },
          { props: 'isReservationLabel', label: '是否预约专用', visible: true, width: 200 },
          { props: 'appointmentItemName', label: '预约项目名称', visible: true, width: 200 },
          {
            props: 'modifierName',
            label: '修改者',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/user/list/detail?userId=${row.modifier}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'creatorName',
            label: '创建者',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/user/list/detail?userId=${row.creator}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
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
                  path: '/maintain/basic/repairItem/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '此操作将删除选中维修项目信息，您无法撤销此操作，是否继续？',
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
            }, {
              name: '日志',
              click: (rowIndex, row) => {
                this.$auditLog.show({ id: row.id });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImport (val) {
      this.uploadDialogId = val;
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/maintain/basic/repairItem/edit'
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
        businessType: '维修项目',
        dataFetchPath: '/maintain/web/basic/repairItem/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '维修项目.xlsx');
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
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
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
    // 批量启用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-repair-item-list {
}
</style>
