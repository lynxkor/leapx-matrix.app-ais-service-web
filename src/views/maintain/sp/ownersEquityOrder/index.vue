<template>
  <div class="page-common m-owners-equity-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="商城订单号">
        <tag-input v-model="form.mallOrderNumberList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="商品代码">
        <tag-input v-model="form.interestsGoodsCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="商品名称" v-show="this.visibleCount === 3 || show">
          <el-input
            placeholder="请输入"
            v-model="form.interestsGoodsNameLike"
            clearable
          />
        </el-form-item>
      <template v-if="show">
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
        <el-form-item label="核销时间">
          <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="form.writeOffDate"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="OwnersEquityOrderStatusEnum"
            v-model="form.orderStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="施工单号">
          <el-input
            placeholder="请输入"
            v-model="form.serviceProxyCodeLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="VIN码">
          <tag-input v-model="form.vehProfileVinList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="购买人">
          <el-input
            placeholder="请输入"
            v-model="form.purchaserLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="购买人电话">
          <el-input
            placeholder="请输入"
            v-model="form.purchaserPhoneLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="服务门店" v-if="!this.isDealer">
          <el-select
            v-model="form.dealerCodeList"
            multiple
            filterable
            clearable
            remote
            placeholder="请选择"
            :remote-method="getStoreByName"
            collapse-tags
            >
            <el-option
              v-for="item in storeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.statusIncludeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
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
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
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
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, getDecrypt } from '@/api/maintain/sp/ownersEquityOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import { loginUserGet } from '@/libs/api/common';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  mallOrderNumberList: [],
  goodInterestsType: '',
  interestsGoodsCodeList: [],
  interestsGoodsName: '',
  orderStatus: '',
  status: '',
  dealerCode: '',
  serviceProxyCode: '',
  vehProfileVinList: [],
  purchaser: '',
  purchaserPhone: '',
  saleDate: '',
  referralCode: '',
  logisticsCompanies: '',
  logisticsOrder: '',
  claimWorkHourAmount: '',
  claimPartsAmount: '',
  claimAmount: '',
  writeOffUserName: '',
  writeOffDate: '',
  unsubscribeDate: '',
  remark: '',
  invalidDate: '',
  modifierName: '',
  updateTime: '',
  creatorName: '',
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
    EditPage,
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: '商城订单管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-ownersEquityOrder',
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
      storeOptions: [],
      isDealer: '',
      optionObj: {
        id: 'ownersEquityOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'mallOrderNumber',
            label: '商城订单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/ownersEquityOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'goodInterestsTypeLabel', label: '服务权益类型', visible: true, width: 200 },
          { props: 'interestsGoodsCode', label: '商品代码', visible: true, width: 200 },
          { props: 'interestsGoodsName', label: '商品名称', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 100 },
          { props: 'statusLabel', label: '启用状态', visible: true, width: 100 },
          {
            props: 'dealerName',
            label: '服务门店',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'serviceProxyCode',
            label: '施工单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.serviceProxyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'vehProfileVin',
            label: 'VIN',
            visible: true,
            width: 200,
            copy: true,
            // getValue: (row) => getDecrypt(row.id, 'vehProfileVin'),
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/vehicle/vehicleProfile/edit?id=${row.vehProfileId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'purchaser',
            label: '购买人',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDecrypt(row.id, 'purchaser')
          },
          {
            props: 'purchaserPhone',
            label: '购买人电话',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDecrypt(row.id, 'purchaserPhone')
          },
          { props: 'saleDate', label: '购买时间', visible: true, width: 200 },
          { props: 'referralCode', label: '推荐码', visible: true, width: 200 },
          { props: 'logisticsCompanies', label: '物流商', visible: true, width: 200 },
          { props: 'logisticsOrder', label: '物流单号', visible: true, width: 200 },
          { props: 'claimWorkHourAmount', label: '工时索赔合计', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'claimPartsAmount', label: '零件索赔合计', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'claimAmount', label: '索赔合计', visible: true, width: 200, align: 'right', headerAlign: 'right' },
          { props: 'writeOffUserName', label: '核销人', visible: true, width: 200 },
          { props: 'writeOffDate', label: '核销时间', visible: true, width: 200 },
          { props: 'unsubscribeDate', label: '退订时间', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'validUntil', label: '有效截止时间', visible: true, width: 200 },
          { props: 'modifierName', label: '更新人', visible: true, width: 200 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 200 },
          { props: 'creatorName', label: '创建人', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '详情',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/ownersEquityOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }
            // , {
            //   name: '删除',
            //   popconfirmConfirmButtonType: 'danger',
            //   popconfirmConfirmButtonText: '删除',
            //   popconfirmTitle: '此操作将永久删除, 是否继续?',
            //   click: (rowIndex, row) => {
            //     deleteItem([row.id]).then(() => {
            //       this.$message({
            //         type: 'success',
            //         message: '删除成功!'
            //       });
            //       this.getData();
            //     }).catch(() => {
            //       this.$message({
            //         type: 'error',
            //         message: '删除失败!'
            //       });
            //     });
            //   },
            //   type: 'danger'
            // }
            ]
          }
        ],
        total: 0
      },
      sortColumns: [
        {
          column: 'create_time',
          sort: 'DESC'
        }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    loginUserGet().then(data => {
      this.isDealer = data.accountFlag;
    });
    this.getData();
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
        path: '/maintain/sp/ownersEquityOrder/edit'
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
        businessType: '新页面',
        dataFetchPath: 'maintain/web/sp/ownersEquityOrder/page',
        reqParams,
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

      // 处理 tag-input 批量查询字段：单值时转为普通字段，多值时保留数组
      const tagInputFields = {
        mallOrderNumberList: 'mallOrderNumber',
        interestsGoodsCodeList: 'interestsGoodsCode',
        vehProfileVinList: 'vehProfileVin'
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
      if (this.form.writeOffDate) {
        delete data.writeOffDate;
        if (this.form.writeOffDate.length > 1) {
          data.writeOffDateStart = this.form.writeOffDate[0];
          data.writeOffDateEnd = this.form.writeOffDate[1];
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
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    },
    getStoreByName (query) {
      listOrgStoreInfo({
        name: query
      }).then(res => {
        this.storeOptions = res?.map(item => {
          return {
            ...item,
            value: item.orgCode,
            label: item.orgName
          };
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-owners-equity-order-list {
}
</style>
