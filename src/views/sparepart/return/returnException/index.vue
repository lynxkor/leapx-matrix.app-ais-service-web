<template>
  <div class="page-common m-return-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="退货单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="门店">
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
      <el-form-item label="备件仓库"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :remote-method="getWarehouse"
          remote
          v-model="form.warehouseIdList"
          placeholder="请选择"
          labelKey="name"
          valueKey="id"
          subLabelKey="code"
          clearable
          multiple
          collapseTags
          filterable
        />
    </el-form-item>
      <template v-if="show">
        <el-form-item label="入库状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="ReturnWarehousingStatusEnum"
            v-model="form.warehousingStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="发货时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.deliveryTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="退货完成时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.returnCompleteTime"
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
        <el-form-item label="修改时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
import { getList, deleteItem, enableItem, returnOrderCancel, returnOrderAgree, returnOrderRevoke, returnOrderReject, returnExceptionInbound } from '@/api/sparepart/return/returnOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listWarehouse } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';
import EditPage from './edit.vue';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  dealerCode: '',
  warehouseId: '',
  returnReason: '',
  returnStatus: '',
  deliveryTime: '',
  remark: '',
  createTime: '',
  updateTime: '',
  warehousingStatusList: [],
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
    Upload,
    TagInput,
    EditPage
  },
  data () {
    return {
      pageTitle: '备件退货异常订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-returnOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      shipmentDialogVisible: false, // 发运弹窗
      shipmentId: '', // 发运弹窗id
      clickItemId: '',
      optionObj: {
        id: 'returnOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '备件退货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/return/returnExceptionalOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'warehousingStatusLabel', label: '入库状态', visible: true, width: 120 },
          { props: 'deliveryTime', label: '发货时间', visible: true, width: 200 },
          { props: 'returnCompleteTime', label: '退货完成时间', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '入库',
              show: (row) => {
                return row.warehousingStatus === '20' && this.permissions.has('AISPART-returnOrder-inboundExceptional');
              },
              click: (rowIndex, row) => {
                this.handleSubmit(row);
              },
              type: 'info'
            }]
          }
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
    // 提交
    async handleSubmit (val) {
      this.$confirm('确认入库吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await returnExceptionInbound({ id: val.id });
        this.$message.success('入库成功!');
        this.getData();
      }).catch(() => {});
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
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
        path: '/sparepart/return/returnOrder/edit'
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
      };
      exportTable({
        businessType: '备件退货单',
        dataFetchPath: 'sp/web/purchase/returnOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件退货单.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), exceptionDetail: true, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
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
      if (this.form.deliveryTime) {
        delete data.deliveryTime;
        if (this.form.deliveryTime.length > 1) {
          data.deliveryTimeStart = this.form.deliveryTime[0];
          data.deliveryTimeEnd = this.form.deliveryTime[1];
        }
      }
      if (this.form.returnCompleteTime) {
        delete data.returnCompleteTime;
        if (this.form.returnCompleteTime.length > 1) {
          data.returnCompleteTimeStart = this.form.returnCompleteTime[0];
          data.returnCompleteTimeEnd = this.form.returnCompleteTime[1];
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
    // 打印退货单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SparePartsReturn', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}备件退货单`// 可选，打印标题
      });
    },
    // 打印退货标签
    handlePrintLabel (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SparePartsReturnLabel', // 必选，对应 ./template/文件名.vue
        title: '备件退货标签'// 可选，打印标题
      });
    },
    // 发运
    handleShipment (val) {
      this.shipmentId = val.id;
      this.shipmentDialogVisible = true;
    },
    handleShipmentDialogClose () {
      this.shipmentDialogVisible = false;
    },
    handleShipmentDialogSuccess () {
      this.shipmentDialogVisible = false;
      this.getData();
    },
    // 作废
    async handleVoid (val) {
      const result = await this.$prompt('请输入作废说明', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const reviewDescription = result.value;
      if (!reviewDescription) {
        return this.$message.warning('请输入作废说明');
      }
      const params = { id: val.id, reviewDescription };
      await returnOrderCancel(params);
      this.getData();
    },
    // 驳回
    async handleReject (val) {
      const result = await this.$prompt('请输入审批意见', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const reviewDescription = result.value;
      if (!reviewDescription) {
        return this.$message.warning('请输入审批意见');
      }
      const params = { id: val.id, reviewDescription };
      await returnOrderReject(params);
      this.getData();
    },
  }
};
</script>

<style lang="scss" scoped>
.m-return-order-list {
}
</style>
