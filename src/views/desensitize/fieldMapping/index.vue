<template>
  <div class="page-common m-desensitize-field-mapping-list">
    <el-form :inline="true" :model="form" size="small" class="ais-search-form">
      <el-form-item label="VO类名">
        <el-input v-model="form.voClass" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="VO字段">
        <el-input v-model="form.voField" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="数据库名" v-show="show">
        <el-input v-model="form.dbName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="表名" v-show="show">
        <el-input v-model="form.tableName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="字段名" v-show="show">
        <el-input v-model="form.columnName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态" v-show="show">
        <el-select v-model="form.status" placeholder="请选择" clearable>
          <el-option :value="1" label="启用" />
          <el-option :value="0" label="停用" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" v-show="show">
        <el-date-picker
          v-model="form.createTime"
          type="daterange"
          unlink-panels
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="更新时间" v-show="show">
        <el-date-picker
          v-model="form.updateTime"
          type="daterange"
          unlink-panels
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>

    <div class="ais-actions">
      <el-button size="small" type="primary" @click="handleAdd">
        <i class="iconfont icon-lxppc-plus"></i>新增
      </el-button>
      <el-button size="small" :disabled="selectionList.length === 0" @click="handleBatchStatus(1)">
        批量启用
      </el-button>
      <el-button size="small" :disabled="selectionList.length === 0" @click="handleBatchStatus(0)">
        批量停用
      </el-button>
    </div>

    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        is-checkbox
        centralized
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { handleBatchStatusChange } from '@/libs/utils';
import { getTableConfig } from '@/api/common';
import { page, updateStatus } from '@/api/desensitize/fieldMapping';

const pageSize = 20;
const defaultForm = {
  voClass: '',
  voField: '',
  dbName: '',
  tableName: '',
  columnName: '',
  status: '',
  createTime: '',
  updateTime: ''
};

export default {
  name: 'desensitizeFieldMapping',
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: { LPVxeTable, PageSearchAction },
  data () {
    return {
      pageTitle: '脱敏字段映射',
      pageType: 'list',
      moduleKey: 'AISSECURITY-desensitizeFieldMapping',
      form: { ...defaultForm },
      show: false,
      loading: false,
      selectionList: [],
      sortColumns: [{ column: 'update_time', sort: 'DESC' }],
      optionObj: {
        id: 'desensitizeFieldMappingTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          {
            props: 'voClass',
            label: 'VO类名',
            visible: true,
            width: 280,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/desensitize/fieldMapping/edit',
                  query: { id: row.id }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'voField', label: 'VO字段', visible: true, width: 180 },
          { props: 'dbName', label: '数据库名', visible: true, width: 180 },
          { props: 'tableName', label: '表名', visible: true, width: 180 },
          { props: 'columnName', label: '字段名', visible: true, width: 180 },
          { props: 'statusLabel', label: '状态', visible: true, width: 100 },
          { props: 'creatorName', label: '创建人', visible: true, width: 120 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'modifierName', label: '修改人', visible: true, width: 120 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => this.handleEdit(row),
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
      this.$router.push({ path: '/desensitize/fieldMapping/edit' });
    },
    handleEdit (row) {
      this.$router.push({ path: '/desensitize/fieldMapping/edit', query: { id: row.id, isEditing: true } });
    },
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    handleBatchStatus (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: updateStatus,
        refreshFunc: this.getData
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.sortColumns = [{ column: 'update_time', sort: 'DESC' }];
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      page({ ...this.getFormData(), page: this.optionObj.form.page, size: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = ((res && res.records) || []).map(row => ({
            ...row,
            statusLabel: row.status === 1 ? '启用' : '停用'
          }));
          // 后端 PaginationModel 总条数字段为 totals
          this.optionObj.total = Number(res?.totals ?? 0);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null) delete data[key];
      });
      if (this.form.createTime && this.form.createTime.length > 1) {
        delete data.createTime;
        data.createStartTime = this.form.createTime[0];
        data.createEndTime = this.form.createTime[1];
      }
      if (this.form.updateTime && this.form.updateTime.length > 1) {
        delete data.updateTime;
        data.updateStartTime = this.form.updateTime[0];
        data.updateEndTime = this.form.updateTime[1];
      }
      data.sortColumns = this.sortColumns;
      return data;
    },
    paginationChange (type, num) {
      if (type === 'page') this.optionObj.form.page = num;
      else this.optionObj.form.size = num;
      this.debouncedGetData();
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return getTableConfig(this.optionObj.id).then(data => ({ data })).catch(() => ({ data: null }));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
