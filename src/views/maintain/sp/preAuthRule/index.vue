<template>
  <div class="page-common m-pre-auth-rule-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="车系：" prop="vehicleSeriesId">
        <list-select
          listUrl="/datacenter/web/materials/vehicleSeries/list"
          placeholder="请选择"
          v-model="form.vehicleSeriesId"
          query-key="seriesNameLike"
          auto-load-options
          no-param-load
          clearable
          filterable
          :params="{}"
        />
      </el-form-item>
      <el-form-item label="车型：" prop="vehicleModelId">
        <list-select
          listUrl="/datacenter/web/materials/vehicleModel/list"
          placeholder="请选择"
          v-model="form.vehicleModelId"
          query-key="modelNameLike"
          auto-load-options
          collapseTags
          clearable
          filterable
          :params="{seriesIdList: form.vehicleSeriesId?[form.vehicleSeriesId]:[]}"
        />
      </el-form-item>
      <el-form-item label="启用状态"  v-show="this.visibleCount === 3 || show">
       <fetch-select
          :request="fetchOptions"
          enumCode="StatusEnum"
          v-model="form.statusExcludeList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
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
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
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
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/maintain/sp/preAuthRule/index';
import { getTableConfig, tableAddOrUpdate, getEnum, vehicleModelTree, exportTable } from '@/api/common';
import ListSelect from '@/libs/components/list-select/index.vue';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel, handleBatchStatusChange } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  vehicleSeriesId: '',
  vehicleModelId: [],
  status: ''
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
    FetchSelect,
    EditPage
  },
  data () {
    return {
      pageTitle: '预授权参数设置',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-preAuthRule',
      form: {
        ...defaultForm
      },
      selectionList: [],
      statusOptions: [
        { code: '', message: '全部' },
        { code: 1, message: '启用' },
        { code: 0, message: '停用' }
      ],
      exportLoading: false,
      show: false,
      loading: false,
      clickItemId: '',
      optionObj: {
        id: 'preAuthRuleTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '授权规则编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/preAuthRule/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vehicleSeriesNames', label: '车系', visible: true, width: 200 },
          { props: 'vehicleModelNames', label: '车型', visible: true, width: 200 },
          { props: 'authAmount', label: '预售授权金额', visible: true, width: 150 },
          {
            props: 'statusLabel',
            label: '启用状态',
            visible: true,
            width: 120
          },
          { props: 'endTime', label: '有效日期', visible: true, width: 180 },
          { props: 'modifierName', label: '更新人', visible: true, width: 150 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 180 },
          { props: 'creatorName', label: '创建人', visible: true, width: 150 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 280,
            buttons: [
              {
                name: '编辑',
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/maintain/sp/preAuthRule/edit',
                    query: {
                      id: row.id
                    }
                  });
                },
                type: 'info'
              },
              {
                name: '启用',
                click: (rowIndex, row) => {
                  this.handleEnable(row, 1);
                },
                show: (row) => row.status === 0,
                type: 'info',
              },
              {
                name: '停用',
                click: (rowIndex, row) => {
                  this.handleEnable(row, 0);
                },
                type: 'info',
                show: (row) => row.status === 1
              },
              {
                name: '删除',
                popconfirmConfirmButtonType: 'danger',
                popconfirmConfirmButtonText: '删除',
                popconfirmTitle: '此操作将永久删除, 是否继续?',
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
              }
            ]
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
        path: '/maintain/sp/preAuthRule/edit'
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
        businessType: '预授权参数管理',
        dataFetchPath: 'maintain/web/sp/preAuthRule/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '预授权参数管理.xlsx');
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

      const params = {
        ...this.getFormData(),
        pageNum: this.optionObj.form.page,
        pageSize: this.optionObj.form.size
      };

      // 处理状态筛选
      if (this.form.status !== '') {
        params.status = this.form.status;
      }

      // 处理车型筛选
      if (this.form.vehicleModelIds && this.form.vehicleModelIds.length > 0) {
        params.vehicleModelIds = this.form.vehicleModelIds;
      }

      getList(params)
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false,
              statusLabel: item.status === 1 ? '启用' : '停用'
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
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });

      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    // 查询车型树
    queryVehicleModels (queryString) {
      return new Promise(resolve => {
        vehicleModelTree().then(res => {
          // 将数据转换为树状结构
          const treeData = this.buildVehicleTree(res || []);
          resolve(treeData);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    // 构建车型树结构
    buildVehicleTree (data) {
      const map = {};
      const tree = [];

      // 先创建车系列表
      data.forEach(item => {
        if (item.vehSeriesName && !map[item.vehSeriesName]) {
          map[item.vehSeriesName] = {
            id: item.vehSeriesId,
            name: item.vehSeriesName,
            children: []
          };
        }
      });

      // 将车型归类到车系下
      data.forEach(item => {
        if (item.vehSeriesName && map[item.vehSeriesName]) {
          map[item.vehSeriesName].children.push({
            id: item.vehModelId,
            name: item.vehModelName
          });
        }
      });

      // 转换为数组
      Object.values(map).forEach(series => {
        tree.push(series);
      });

      return tree;
    },
    // 批量删除
    handleBatchDelete () {
      // 检查是否有启用的数据
      const enabledItems = this.selectionList.filter(item => item.status === 1);

      if (enabledItems.length > 0) {
        this.$message.warning('该数据尚在使用，请停用后再行删除');
        return;
      }

      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除，是否继续？', '提示', {
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
    // 单个启用停用
    handleEnable (row, status) {
      enableItem({
        idSet: [row.id],
        status: status
      }).then(() => {
        this.$message({
          type: 'success',
          message: status === 1 ? '启用成功' : '停用成功'
        });
        this.getData();
      }).catch(() => {});
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>

<style lang="scss" scoped>
.m-pre-auth-rule-list {
}
</style>
