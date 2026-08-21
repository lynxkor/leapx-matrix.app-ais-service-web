<template>
  <div class="page-common m-company-health-info-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="创建时间:">
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
      <el-form-item label="门店:">
        <dealer-select v-model="form.dealerCodeList" multiple />
      </el-form-item>
      <el-form-item label="健康档案状态:"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="HealthStatusEnum"
          v-model="form.healthStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
      <el-form-item label="门店状态:" >
        <fetch-select
          :request="fetchOptions"
          enumCode="DealerStatusEnum"
          v-model="form.dealerStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
        <el-form-item label="母公司名称:" >
          <fetch-select
            :remote-method="handleCompanyList"
            v-model="form.companyIdList"
            placeholder="请选择"
            clearable
            multiple
            remote
            labelKey="companyName"
            valueKey="companyId"
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
      <el-button v-if="canExport" :Loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
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
    <!-- TIPS: 填入项目 id 即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
    <!-- 申请开通健康档案对话框 -->
    <el-dialog
      :visible.sync="applyDialogVisible"
      title="健康档案 (若以下信息和维修企业注册信息不一致，请联系区域进行调整后再申请开通)"
      width="600px"
      :close-on-click-modal="false"
      @close="handleApplyDialogClose"
    >
      <el-form :model="applyForm" label-width="150px" label-position="left">
        <el-form-item label="维修企业名称" required>
          <el-input v-model="applyForm.dealerName" disabled />
        </el-form-item>
        <el-form-item label="统一社会信用代码" required>
          <el-input v-model="applyForm.creditCode" disabled />
        </el-form-item>
        <el-form-item label="注册区域编码" required>
          <el-input v-model="applyForm.areaCode" disabled />
        </el-form-item>
        <el-form-item label="申请备注">
          <el-input
            v-model="applyForm.applyReason"
            type="textarea"
            :rows="4"
            placeholder="请输入申请备注"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="applyLoading" @click="handleSubmitApply">申请开通</el-button>
      </span>
    </el-dialog>
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
  companyList,
  openUpload
} from '@/api/maintain/sp/companyInfo';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import Upload from '@/libs/components/UploadDialog/index.vue';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel, getEndOfDayString } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import DealerSelect from '@/components/dealer-select';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  shopName: '',
  companyNameLike: '',
  dealerStatusList: [],
  companyIdList: [],
  healthStatusList: [],

};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    DealerSelect,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '维修企业档案',
      pageType: 'list',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: 'AISMC-dealerHealthInfo',

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
      applyDialogVisible: false, // 申请对话框
      applyLoading: false, // 申请提交中
      applyForm: { // 申请表单
        id: '',
        dealerName: '',
        creditCode: '',
        areaCode: '',
        applyReason: ''
      },
      //
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      //
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'companyHealthInfoTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [
              {
                click: (rowIndex, row) => {
                  if (!row.dealerCode) {
                    this.$message.warning('该门店暂无编码，无法跳转');
                    return;
                  }
                  const url = `/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`;
                  window.open(url, '_blank');
                },
                type: 'primary'
              }
            ]
          },

          { props: 'dealerStatusLabel', label: '门店状态', visible: true, width: 120 },
          { props: 'companyName', label: '母公司名称', visible: true, width: 200 },
          { props: 'healthStatusLabel', label: '健康档案状态', visible: true, width: 120 },
          { props: 'venueId', label: '场所ID', visible: true, width: 200 },
          { props: 'creditCode', label: '统一社会信用代码', visible: true, width: 200 },
          { props: 'areaCode', label: '注册区域编码', visible: true, width: 200 },
          { props: 'repairCode', label: '维修企业唯一标识', visible: true, width: 200 },
          { props: 'applyReason', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',

            buttons: [{
              name: '申请开通健康档案',

              click: (rowIndex, row) => {
                this.handleOpenApplyDialog(row.parentCompany);
              },
              type: 'info',
              show: (row) => row.parentCompany && row.parentCompany.healthStatus === 10 && this.permissions.has('AISMC-dealerHealthInfo-openUpload')
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
  },
  mounted () {
    // 初始化由 remote-select-with-scroll 组件自动处理
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
    // 打开申请对话框
    handleOpenApplyDialog (row) {
      this.applyForm = {
        id: row.id,
        dealerName: row.dealerName || '',
        creditCode: row.creditCode || '',
        areaCode: row.areaCode || '',
        applyReason: row.applyReason || '',
        healthStatus: 20
      };
      this.applyDialogVisible = true;
    },
    // 关闭申请对话框
    handleApplyDialogClose () {
      this.applyForm = {
        id: '',
        dealerName: '',
        creditCode: '',
        areaCode: '',
        applyReason: ''
      };
    },
    // 提交申请
    handleSubmitApply () {
      this.applyLoading = true;
      // 调用 API 提交申请
      openUpload({
        ...this.applyForm
      }).then(res => {
        this.$message({
          type: 'success',
          message: '申请提交成功!'
        });
        this.applyDialogVisible = false;
        this.getData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '申请提交失败!'
        });
      }).finally(() => {
        this.applyLoading = false;
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
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '维修企业健康档案',
        dataFetchPath: '/maintain/web/sp/dealerHealthInfo/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '维修企业健康档案.xlsx');
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

      getList({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = (res?.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.tableTotal = res?.total || 0;
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

    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 获取母公司列表（支持远程搜索和分页）
    async handleCompanyList (query, pageNum = 1, pageSize = 100) {
      const param = {
        isParentCompany: 1,
        companyNameLike: query || '',
        pageNum,
        pageSize
      };
      try {
        const res = await getList(param);
        // 直接返回完整的响应对象，组件内部会处理 data.records
        return res.records;
      } catch (error) {
        console.error('Error fetching company list:', error);
        return { data: { records: [], total: 0, totalPage: 0 } };
      }
    },
    companyList: async function (code) {
      if (code) {
        const data = { isParentCompany: code };
        return companyList(data);
      }
      return [];
    },

    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
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

    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将删除选中维修企业健康档案信息，您无法撤销此操作，是否继续？', '提示', {
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
  }
};
</script>

<style lang="scss" scoped>
.m-company-health-info-list {
}
</style>
