<template>
  <div class="page-common m-warranty-audit-error-config-list">
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px" class="ais-search-form">
      <el-form-item label="错误代码">
        <el-input v-model="form.errorCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="错误类别">
        <el-input v-model="form.errorCategoryLike" placeholder="请输入" clearable />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="是否启用">
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
      <page-search-action v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit" @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd">新增</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <LPVxeTable
      ref="tableRef"
      v-loading="loading"
      is-checkbox
      is-page
      checkboxFixed
      :option-obj="optionObj"
      :get-config="getConfig"
      @paginationChange="paginationChange"
      @handleSelect="handleSelectionChange"
    />
  </div>
</template>

<script>
import { getList, enableItem } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditErrorConfig/index';
import { getTableConfig, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import { handleBatchStatusChange, getEndOfDayString } from '@/libs/utils';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  errorCode: '',
  errorCategoryLike: '',
  statusIncludeList: [],
  createTime: '',
  updateTime: ''
};

const pageSize = 20;

export default {
  name: 'warrantyAuditErrorConfig',
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect
  },
  data () {
    return {
      pageTitle: '审计错误项配置',
      pageType: 'list',
      moduleKey: 'AISCR-warrantyAuditErrorConfig',
      form: { ...defaultForm },
      selectionList: [],
      show: false,
      loading: false,
      optionObj: {
        id: 'warrantyAuditErrorConfigTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'errorCode',
            label: '错误代码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyAuditErrorConfig/edit',
                  query: {
                    id: row.id
                  }
                });
              }
            }]
          },
          { props: 'errorCategory', label: '错误类别', visible: true, width: 200 },
          { props: 'checkItem', label: '检查项目', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 100 },
          { props: 'statusDesc', label: '说明', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 200,
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyAuditErrorConfig/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '启用',
              click: (rowIndex, row) => {
                this.handleSingleEnable(row, 1);
              },
              show: (row) => row.status === 0,
              type: 'info'
            }, {
              name: '停用',
              click: (rowIndex, row) => {
                this.handleSingleEnable(row, 0);
              },
              show: (row) => row.status === 1,
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
    handleAdd () {
      this.$router.push({ path: '/claimreturn/claim/warrantyAuditErrorConfig/edit' });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records;
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    getConfig () {
      return getTableConfig(this.optionObj.id).then(data => ({ data })).catch(() => ({ data: null }));
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.getData();
    },
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });
      if (this.form.createTime && this.form.createTime.length > 1) {
        data.createTimeStart = this.form.createTime[0];
        data.createTimeEnd = this.form.createTime[1];
        delete data.createTime;
      }
      if (this.form.updateTime && this.form.updateTime.length > 1) {
        data.updateTimeStart = this.form.updateTime[0];
        data.updateTimeEnd = getEndOfDayString(this.form.updateTime[1]);
        delete data.updateTime;
      }
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleSingleEnable (row, status) {
      const statusText = status === 1 ? '启用' : '停用';
      this.$confirm(`确认${statusText}该条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableItem({ idSet: [row.id], status }).then(() => {
          this.$message.success(`${statusText}成功`);
          this.getData();
        });
      }).catch(() => {});
    },
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    }
  }
};
</script>
