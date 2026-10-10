<template>
  <div class="page-common m-new-car-quality-config-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="配置编码">
        <el-input
          placeholder="请输入"
          v-model="form.code"
          clearable
        />
      </el-form-item>
      <el-form-item label="车系">
        <list-select
          listUrl="/datacenter/web/materials/vehicleSeries/list"
          placeholder="请选择"
          v-model="form.vehSeriesId"
          query-key="seriesNameLike"
          auto-load-options
          no-param-load
          clearable
          filterable
          :params="{}"
          @change="handleSeriesChange"
        />
      </el-form-item>
      <el-form-item label="车型" v-show="visibleCount === 3 || show">
        <list-select
          listUrl="/datacenter/web/materials/vehicleModel/list"
          placeholder="请选择"
          v-model="form.vehModelIds"
          query-key="modelNameLike"
          multiple
          auto-load-options
          collapseTags
          clearable
          filterable
          :params="{seriesIdList: form.vehSeriesId ? [form.vehSeriesId] : []}"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="年款">
          <list-select
            listUrl="/datacenter/web/materials/vehicleYearType/list"
            placeholder="请选择"
            v-model="form.vehYearTypeId"
            query-key="yearTypeNameLike"
            collapseTags
            auto-load-options
            no-param-load
            clearable
            filterable
            :params="{}" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            placeholder="请输入"
            v-model="form.remark"
            clearable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
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
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/maintain/basic/newCarQualityConfig/index';
import { getTableConfig, tableAddOrUpdate } from '@/api/common';
import ListSelect from '@/libs/components/list-select/index.vue';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  code: '',
  vehSeriesId: '',
  vehModelIds: [],
  vehYearTypeId: '',
  remark: '',
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
    ListSelect,
    EditPage
  },
  data () {
    return {
      pageTitle: '新车质量反馈设置',
      pageType: 'list',
      moduleKey: 'AISMC-newCarQualityConfig',
      form: {
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      clickItemId: '',
      optionObj: {
        id: 'newCarQualityConfigTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '配置编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/basic/newCarQualityConfig/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vehSeriesName', label: '车系', visible: true, width: 150 },
          {
            props: 'vehModelName',
            label: '车型',
            visible: true,
            width: 200,
            getValue: row => row.vehModelName || '全车型'
          },
          { props: 'vehYearTypeName', label: '年款', visible: true, width: 120 },
          { props: 'launchDate', label: '上市时间', visible: true, width: 120 },
          { props: 'newCarPeriod', label: '新车期（月）', visible: true, width: 120 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'modifierName', label: '修改人', visible: true, width: 120 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 170 },
          { props: 'statusLabel', label: '状态', visible: true, width: 100 },
          { props: 'createTime', label: '创建时间', visible: true, width: 170 },
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
                  path: '/maintain/basic/newCarQualityConfig/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '仅停用状态的配置可删除，此操作将永久删除, 是否继续?',
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
            }]
          }
        ],
        total: 0
      },
      sortColumns: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
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
    handleAdd () {
      this.$router.push({
        path: '/maintain/basic/newCarQualityConfig/edit'
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
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          const records = res?.records || [];
          this.optionObj.dataList = records.map(item => {
            return {
              ...item,
              // 车型为空（全车型配置）时默认展示“全车型”
              vehModelName: item.vehModelName || '全车型',
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
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
    // 车系变化时联动清空车型
    handleSeriesChange () {
      this.form.vehModelIds = [];
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (Array.isArray(data.vehModelIds) && data.vehModelIds.length === 0) {
        delete data.vehModelIds;
      }

      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('仅停用状态的配置可删除，此操作将永久删除, 是否继续?', '提示', {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-new-car-quality-config-list {
}
</style>
