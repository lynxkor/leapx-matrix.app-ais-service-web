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
      <el-form-item label="营销分类" v-if="activeName === 'homePage'">
        <el-input
          placeholder="请输入"
          v-model="form.categoryIdList"
          clearable
        />
      </el-form-item>
      <el-form-item label="备件工程师" v-if="activeName === 'spareParts'">
        <el-input
          placeholder="请输入"
          v-model="form.partsEngineerLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="供应商名称" v-if="activeName === 'spareParts'">
        <el-input
          placeholder="请输入"
          v-model="form.supplierNameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="备件编码" v-if="activeName === 'spareParts'" v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.categoryName"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="备件名称" v-if="activeName === 'spareParts'">
          <el-input
            placeholder="请输入"
            v-model="form.categoryName"
            clearable
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <div class="ais-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按营销分组" name="homePage"></el-tab-pane>
        <el-tab-pane label="按备件分组" name="spareParts"></el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="ais-table-c"
      v-if="activeName === 'homePage'"
    >
      <LPVxeTable
        key="tableRef"
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
        @listSelect="handleListSelect"
      >
      </LPVxeTable>
    </div>
    <div
      class="ais-table-c"
      v-if="activeName === 'spareParts'"
    >
      <LPVxeTable
        key="tableRefSpareParts"
        ref="tableRefSpareParts"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObjSpareParts"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
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
import { categoryPage, sparePartPage, deleteItem, enableItem } from '@/api/sparepart/purchase/backOrderReport/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  categoryName: '',
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
    Upload
  },
  data () {
    return {
      pageTitle: '备件缺货看板',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-backOrderReport',
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
      activeName: 'homePage',
      optionObj: {
        id: 'backOrderReportTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'categoryName', label: '分类名称', visible: true, width: 180 },
          { props: 'orderCount', label: '订单行数', visible: true, width: 120 },
          { props: 'backPartQtyTotal', label: '缺货总数', visible: true, align: 'right', width: 120 },
          { props: 'backPartGroupTotal', label: '备件种类', visible: true, width: 120 },
          { props: 'backTotalAmount', label: '缺货总金额', visible: true, align: 'right', width: 120 },
          { props: 'now', label: '取值时间', visible: true, width: 200 },
        ],
        total: 0
      },
      optionObjSpareParts: {
        id: 'backOrderReportTableSpareParts',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'sparePartCode', label: '备件编码', visible: true, width: 180 },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'pendingPartQtyTotal', label: '缺货总数', visible: true, align: 'right', width: 120 },
          { props: 'purchasePrice', label: '采购价格', visible: true, align: 'right', width: 120 },
          { props: 'days', label: '缺货天数', visible: true, align: 'right', width: 120 },
          { props: 'detailCount', label: '缺货订单行数', visible: true, width: 120 },
          { props: 'partsEngineer', label: '备件工程师', visible: true, width: 120 },
          { props: 'supplierName', label: '供应商名称', visible: true, width: 180 },
          { props: 'categoryName', label: '营销分类名称', visible: true, width: 180 },
          { props: 'now', label: '取数时间', visible: true, width: 200 },
        ],
        total: 0
      }
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
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },

    onSubmit () {
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else if (this.activeName === 'spareParts') {
        optionObj = this.optionObjSpareParts;
      }
      optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else if (this.activeName === 'spareParts') {
        optionObj = this.optionObjSpareParts;
      }
      optionObj.form.page = 1;
      optionObj.form.pageSize = pageSize;
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
        businessType: '备件缺货看板',
        dataFetchPath: 'sparepart/web/purchase/backOrderReport/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件缺货看板.xlsx');
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
      let fathApi = categoryPage;
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        fathApi = categoryPage;
        optionObj = this.optionObj;
      } else if (this.activeName === 'spareParts') {
        fathApi = sparePartPage;
        optionObj = this.optionObjSpareParts;
      }
      fathApi({ ...this.getFormData(), pageNum: optionObj.form.page, pageSize: optionObj.form.size })
        .then(res => {
          console.log(res);
          optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else if (this.activeName === 'spareParts') {
        optionObj = this.optionObjSpareParts;
      }
      return new Promise((resolve, reject) => {
        getTableConfig(optionObj.id).then(data => {
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
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else if (this.activeName === 'spareParts') {
        optionObj = this.optionObjSpareParts;
      }
      if (type === 'page') {
        optionObj.form.page = num;
      } else {
        optionObj.form.size = num;
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
        if (data[key] === '' || data[key] === null || data[key].length === 0) {
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
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
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
    },
    // 点击tabs栏切换
    handleClick (item) {
      this.activeName = item.name;
      this.getData();
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
  .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
