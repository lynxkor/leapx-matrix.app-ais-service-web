<template>
  <div class="page-common m-stock-taking-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="盘点单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="盘点状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="StockTakingStatusEnum"
          v-model="form.stockStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="门店" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.dealerCodeList"
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
      <template v-if="show">
        <el-form-item label="母公司名称">
          <fetch-select
            :remote-method="getParentCompany"
            remote
            v-model="form.companyCodeList"
            placeholder="请选择"
            labelKey="companyName"
            valueKey="companyCode"
            subLabelKey="companyCode"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="盘点类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="StockTakingTypeEnum"
            v-model="form.stockTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>

        <el-form-item label="计划开始时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.planStartTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="计划完成时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.planCompleteTime"
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
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
      :businessParams="project_id"
      :id="'sparepartStockTakingDetailRes'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
    <!-- 生成差异单弹窗 -->
    <DifferenceDialog
      ref="differenceDialogRef"
      :visible.sync="differenceDialogVisible"
      :differenceId="differenceId"
      :differenceList="differenceTableData"
      @update:visible="val => differenceDialogVisible = val"
      @confirm="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, initializeItem, cancelItem } from '@/api/sparepart/warehouse/stockTaking/index';
import { getExceptionList, initDifferences } from '@/api/sparepart/warehouse/stockTakingDifferences/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getUserByNameOrNo, listOrgStoreInfoByParam, getSparePartCompany, listWarehouse, getPartDealer, getLoginUser } from '@/api/common';
import TagInput from '@/libs/components/TagInput';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import DifferenceDialog from './DifferenceDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  codeList: '',
  dealerCodeList: '',
  dealerName: '',
  companyCodeList: '',
  warehouseId: '',
  stockTypeList: '',
  stockStatusList: '',
  planStartTime: '',
  planCompleteTime: '',
  remark: '',
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
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload,
    TagInput,
    DifferenceDialog
  },
  data () {
    return {
      pageTitle: '库存盘点',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-stockTaking',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      differenceDialogVisible: false, // 生成差异单弹窗
      differenceId: '', // 差异单id
      differenceTableData: [], // 差异单数据
      project_id: '', // 项目id 导入
      clickItemId: '',
      optionObj: {
        id: 'stockTakingTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '盘点单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/warehouse/stockTaking/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 180 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'companyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'stockTypeLabel', label: '盘点类型', visible: true, width: 100 },
          { props: 'stockStatusLabel', label: '盘点状态', visible: true, width: 100 },
          { props: 'planStartTime', label: '计划开始时间', visible: true, width: 200 },
          { props: 'planCompleteTime', label: '计划完成时间', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
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
              show: (row) => {
                return row.stockStatus === '0' || row.stockStatus === '2';
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/warehouse/stockTaking/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
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
              name: '初始化',
              show: (row) => {
                return row.stockStatus === '0' && this.permissions.has('AISPART-stockTaking-initialize');
              },
              popconfirmTitle: '此操作将初始化该库存盘点, 是否继续?',
              click: (rowIndex, row) => {
                initializeItem({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '初始化成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '初始化失败!'
                  });
                });
              },
              type: 'info'
            }, {
              name: '作废',
              show: (row) => {
                return (row.stockStatus === '0' || row.stockStatus === '2') && this.permissions.has('AISPART-stockTaking-cancel');
              },
              popconfirmTitle: '此操作将作废该库存盘点, 是否继续?',
              click: (rowIndex, row) => {
                cancelItem({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '作废成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '作废失败!'
                  });
                });
              },
              type: 'info'
            }, {
              name: '盘点结果导入',
              show: (row) => {
                return row.stockStatus === '2' && this.permissions.has('AISPART-stockTaking-importRes');
              },
              click: (rowIndex, row) => {
                this.handleImport(row);
              },
              type: 'info'
            }, {
              name: '生成差异单',
              show: (row) => {
                return row.stockStatus === '2' && this.permissions.has('AISPART-stockTaking-generateDifferences');
              },
              click: (rowIndex, row) => {
                this.handleDifference(row);
              },
              type: 'info'
            }, {
              name: '打印',
              show: (row) => {
                return this.permissions.has('AISPART-stockTaking-print');
              },
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async getUser (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getParentCompany (query) {
      try {
        const res = await getSparePartCompany({ codeOrNameLike: query });
        res.records = res.records?.map(item => ({
          ...item,
          displayName: item.companyName + `(${item.companyCode})`
        }));
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.accountFlag = res.accountFlag;
      this.currentDealerCode = res.currentDealerCode;// 当前门店code
      this.currentDealerName = res.currentDealerName;// 当前门店名称

      if (this.accountFlag === true) {
        const res = await getPartDealer({ code: this.currentDealerCode });
        this.isPartOrder = res.isPartOrder;
      }
      if (this.accountFlag === false) {
        this.isPartOrder = true;
      }
    },
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
    handleImport (val) {
      this.project_id = val.id;
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/warehouse/stockTaking/edit'
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
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '库存盘点',
        dataFetchPath: 'sparepart/web/warehouse/stockTaking/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '库存盘点.xlsx');
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
      if (this.form.planCompleteTime) {
        delete data.planCompleteTime;
        if (this.form.planCompleteTime.length > 1) {
          data.planCompleteTimeStart = this.form.planCompleteTime[0];
          data.planCompleteTimeEnd = this.form.planCompleteTime[1];
        }
      }
      if (this.form.planStartTime) {
        delete data.planStartTime;
        if (this.form.planStartTime.length > 1) {
          data.planStartTimeStart = this.form.planStartTime[0];
          data.planStartTimeEnd = this.form.planStartTime[1];
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
    // 打印盘点任务单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'InventoryCount', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}厅店库存盘点单`// 可选，打印标题
      });
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
    // 生成差异单
    async handleDifference (row) {
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>此操作将生成差异单, 是否继续?</div>';

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(async () => {
        // 调用 API
        const res = await getExceptionList({ id: row.id });
        if (res.length > 0) {
          this.differenceId = row.id;
          this.differenceTableData = res;
          this.differenceDialogVisible = true;
        } else {
          await initDifferences({ id: row.id });
          this.$message.success('生成差异单成功!');
          this.getData();
        }
      }).catch((err) => {
        // 错误处理
        if (err !== 'cancel') {
          console.error('操作失败:', err);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-stock-taking-list {
}
</style>
