<template>
  <div class="page-common m-old-part-destroy-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="门店销毁单号：">
        <el-input
          placeholder="请输入"
          v-model="form.destroyOrderNo"
          clearable
        />
      </el-form-item>
      <el-form-item label="厅店名称：">
        <el-input
          placeholder="请输入"
          v-model="form.dealerNameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="销毁单状态："  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="old_part_destroy_status"
          v-model="form.destroyStatusList"
          placeholder="请选择"
          :format="filterActivityType"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="销毁日期：">
          <el-date-picker
            v-model="form.destroyDate"
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
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/claimreturn/oldpart/destroy/oldPartDestroyOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel, formatDateTime, getEndOfDayString } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { loginUserGet } from '@/libs/api/common';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  destroyOrderNo: '',
  dealerName: '',
  destroyStatus: '',
  destroyDate: '',
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
    Upload
  },
  data () {
    const moduleKey = 'AISCR-' + this.$route.meta.moduleKey;
    return {
      pageTitle: this.$route.meta.name,
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey,
      form: {
        ...defaultForm
      },
      isDealer: null,
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      //
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
    };
  },
  computed: {
    optionObj () {
      return {
        id: this.moduleKey,
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'destroyOrderNo',
            label: '门店销毁单号',
            visible: true,
            width: 240,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                let path = '/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit';
                if (this.isDealer) {
                  path = '/claimreturn/oldpart/destroy/dealerOldPartDestroyOrder/edit';
                }
                this.$router.push({
                  path,
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/partner/channelManagement/shopDetail',
                  query: {
                    dealerCode: row.dealerCode,
                  },
                });
              },
              type: 'primary'
            }]
          },
          { props: 'destroyStatusLabel', label: '销毁单状态', visible: true, width: 140 },
          { props: 'destroyerName', label: '销毁人', visible: true, width: 120 },
          { props: 'destroyDate', label: '销毁日期', visible: true, width: 200 },
          { props: 'destroyRemark', label: '销毁说明', visible: true, width: 200 },
          { props: 'approverName', label: '销毁审批人', visible: true, width: 120 },
          { props: 'approveRemark', label: '销毁审批说明', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              show: (row) => {
                return false;
              },
              click: (rowIndex, row) => {
                let path = '/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit';
                if (this.isDealer) {
                  path = '/claimreturn/oldpart/destroy/dealerOldPartDestroyOrder/edit';
                }
                this.$router.push({
                  path,
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }]
          }
        ],
        total: this.tableTotal,
      };
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();

    loginUserGet().then(data => {
      this.isDealer = data.accountFlag;
    });
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
        path: '/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit'
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
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '新页面',
        dataFetchPath: 'claimreturn/web/oldpart/destroy/oldPartDestroyOrder/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '新页面.xlsx');
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

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.form.destroyDate) {
        delete data.destroyDate;
        if (this.form.destroyDate.length > 1) {
          data.destroyDateStart = this.form.destroyDate[0];
          data.destroyDateEnd = getEndOfDayString(formatDateTime(this.form.destroyDate[1]));
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
      return options.filter(item => !['10', '20', '30'].includes(item.code));
    }
  }
};
</script>

<style lang="scss" scoped>
.m-old-part-destroy-order-list {
}
</style>
