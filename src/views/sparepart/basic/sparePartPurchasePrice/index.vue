<template>
  <div class="page-common m-spare-part-purchase-price-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="备件编码">
        <tag-input v-model="form.sparePartCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          placeholder="请输入"
          v-model="form.sparePartNameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="定价模式" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="PricingModelEnum"
          v-model="form.pricingModels"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="门店编码">
          <el-input
            placeholder="请输入"
            v-model="form.dealerCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input
            placeholder="请输入"
            v-model="form.dealerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="调价比例（%）">
          <el-input
            placeholder="请输入"
            v-model="form.adjustmentRatio"
            clearable
          />
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.effectiveStartDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="生效结束时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.effectiveEndDatetime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="失效操作人">
          <el-input
            placeholder="请输入"
            v-model="form.invalidOperatorLike"
            clearable
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
      <el-button v-if="canImport" size="small" @click="handleImport">价格导入</el-button>
      <!-- <el-button >集中视图</el-button> -->
      <!-- <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button> -->
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">失效</el-button>
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
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'sparePartPurchasePriceImport'"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/sparepart/basic/sparePartPurchasePrice/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { handleBatchStatusChange, getEndOfDayString } from '@/libs/utils';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  id: '',
  sparePartCode: '',
  sparePartName: '',
  pricingModel: '',
  dealerPurchasePrice: '',
  dealerCode: '',
  dealerName: '',
  adjustmentRatio: '',
  effectiveStartDate: '',
  effectiveEndDatetime: '',
  invalidOperator: '',
  invalidReason: '',
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
    FetchSelect,
    PageSearchAction,
    LPVxeTable,
    Upload,
    TagInput
  },
  data () {
    return {
      storeOptions: [],
      pageTitle: '备件采购价格',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartPurchasePrice',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'sparePartPurchasePriceTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'id',
            label: '价格序号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePartPurchasePrice/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'sparePartCode',
            label: '备件编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/detail',
                  query: {
                    id: row.sparePartId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'pricingModelLabel', label: '定价模式', visible: true, width: 200 },
          { props: 'dealerPurchasePrice', label: '采购价格', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'adjustmentRatio', label: '调价比例（%）', visible: true, width: 200 },
          { props: 'effectiveStartDate', label: '生效开始日期', visible: true, width: 200 },
          { props: 'effectiveEndDatetime', label: '生效结束时间', visible: true, width: 200 },
          { props: 'invalidOperator', label: '失效操作人', visible: true, width: 200 },
          { props: 'invalidReason', label: '失效原因', visible: true, width: 200 },
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
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePartPurchasePrice/edit',
                  query: {
                    id: row.id
                  }
                });
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

    // 门店
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
    },

    // 处理选择门店时拿到所有的数据
    handleStoreChange (val) {
      // 根据 value 在 storeOptions 中查找完整的对象
      const selectedItem = this.storeOptions.find(item => item.orgCode === val);
      this.storeParams = {
        dealerCode: selectedItem.orgCode,
        dealerName: selectedItem.orgName,
        categorySpareId: this.partsId
      };
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/basic/sparePartPurchasePrice/edit'
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
        businessType: '备件采购价格',
        dataFetchPath: 'sparepart/web/basic/sparePartPurchasePrice/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(res => {
        if (res) {
          if (res.excelUrl) {
            window.location.href = res.excelUrl;
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
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
      const params = { ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size };
      // 过滤掉空数组参数
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key]) && params[key].length === 0) {
          delete params[key];
        }
      });
      getList(params)
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

      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = getEndOfDayString(this.form.updateTime[1]);
        }
      }

      if (this.form.effectiveStartDate) {
        delete data.effectiveStartDate;
        if (this.form.effectiveStartDate.length > 1) {
          data.effectiveStartDateStart = this.form.effectiveStartDate[0];
          data.effectiveStartDateEnd = getEndOfDayString(this.form.effectiveStartDate[1]);
        }
      }

      if (this.form.effectiveEndDatetime) {
        delete data.effectiveEndDatetime;
        if (this.form.effectiveEndDatetime.length > 1) {
          data.effectiveEndDatetimeStart = this.form.effectiveEndDatetime[0];
          data.effectiveEndDatetimeEnd = getEndOfDayString(this.form.effectiveEndDatetime[1]);
        }
      }

      if (Array.isArray(this.form.sparePartCodeList) && this.form.sparePartCodeList.length <= 1) {
        delete data.sparePartCodeList;
        data.sparePartCodeLike = this.form.sparePartCodeList[0] || '';
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
  }
};
</script>

<style lang="scss" scoped>
.m-spare-part-purchase-price-list {
}
</style>
