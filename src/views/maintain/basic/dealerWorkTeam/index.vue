<template>
  <div class="page-common m-dealer-team-list">
    <div>
      <el-form
        :inline="true"
        :model="form"
        size="small"
        label-position="right"
        label-width="150px"
        class="ais-search-form"
      >
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="form.createTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="班组名称">
          <el-input
            placeholder="请输入"
            v-model="form.name"
            clearable
          />
        </el-form-item>
        <el-form-item label="门店名称" v-show="visibleCount === 3 || show">
          <el-select
            v-model="form.dealerIds"
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
        <template v-if="show">
          <el-form-item label="状态">
            <fetch-select
              :request="fetchOptions"
              enumCode="StatusEnum"
              v-model="form.statusIncludeList"
              multiple
              placeholder="请选择"
              clearable
              collapse-tags
            />
          </el-form-item>
          <el-form-item label="班组类型">
            <fetch-select
              :request="fetchOptions"
              enumCode="mc_station_type"
              v-model="form.teamTypes"
              multiple
              placeholder="请选择"
              clearable
              collapse-tags
            />
          </el-form-item>
        </template>
        <page-search-action
          v-model="show"
          is-expandable
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
      </el-form>
      <div class="ais-actions">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
        <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
        <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
        <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
        <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
      </div>
    </div>
    <div
      class="ais-table-c"
      :class="{ 'z-form-show': show }"
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
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/maintain/basic/dealerWorkTeam/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, getEndOfDayString } from '@/libs/utils';

const defaultForm = {
  name: '',
  dealerName: '',
  statusIncludeList: '',
  teamTypes: '',
  dealerIds: [],
  createTime: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect
  },
  data () {
    return {
      form: {
        ...defaultForm
      },
      selectionList: [],
      storeOptions: [],
      yes_no_enum: YES_NO_ENUM,
      moduleKey: 'AISMC-dealerWorkTeam',
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'dealerWorkTeamTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '班组代码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/basic/dealerWorkTeam/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'name', label: '班组名称', visible: true, width: 200 },
          { props: 'teamTypeLabel', label: '班组类型', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopBasicsMessageDetails?num=2&id=${row.dealerId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'remark', label: '说明', visible: true, width: 200 },
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
                  path: '/maintain/basic/dealerWorkTeam/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmTitle: '此操作将删除选中班组信息，您无法撤销此操作，是否继续？',
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
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['厅店班组信息']);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/maintain/basic/dealerWorkTeam/edit'
      });
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '厅店班组信息',
        dataFetchPath: '/maintain/web/basic/dealerWorkTeam/page',
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

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
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
    getStoreByName (query) {
      listOrgStoreInfo({
        name: query
      }).then(res => {
        this.storeOptions = res?.map(item => {
          return {
            ...item,
            value: item.orgId,
            label: item.orgName
          };
        });
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-dealer-team-list {
}
</style>
