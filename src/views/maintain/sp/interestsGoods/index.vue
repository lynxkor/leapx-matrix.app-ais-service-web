<template>
  <div class="page-common m-interests-goods-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="权益商品名称">
        <el-input
          placeholder="请输入"
          v-model="form.commodityName"
          clearable
        />
      </el-form-item>
      <el-form-item label="权益商品代码">
        <el-input
          placeholder="请输入"
          v-model="form.commodityCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="服务权益类型"  v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="InterestsGoodsServiceInterestsTypeEnum"
          v-model="form.serviceInterestsType"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="权益商品分类">
          <el-input
            placeholder="请输入"
            v-model="form.classificationGoodsName"
            clearable
          />
        </el-form-item>
        <el-form-item label="购买后有效期（月）">
          <el-input
            placeholder="请输入"
            v-model="form.datePurchase"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="whetherShelf"
            enumCode="BooleanEnum"
            v-model="form.whetherShelf"
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
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, addOrUpdate, changeWhetherShelf } from '@/api/maintain/sp/interestsGoods/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  commodityCode: '',
  commodityName: '',
  serviceInterestsType: '',
  classificationGoodsName: '',
  datePurchase: '',
  status: '',
  claimItemAmount: '',
  claimPartsAmount: '',
  claimOtherAmount: '',
  note: '',
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
    Upload
  },
  data () {
    return {
      pageTitle: '权益商品管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-interestsGoods',
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
      optionObj: {
        id: 'interestsGoodsTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'commodityCode',
            label: '权益商品代码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/interestsGoods/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'commodityName', label: '权益商品名称', visible: true, width: 200 },
          { props: 'serviceInterestsTypeLabel', label: '服务权益类型', visible: true, width: 200 },
          { props: 'classificationGoodsName', label: '权益商品分类', visible: true, width: 200 },
          { props: 'datePurchase', label: '购买后有效期（月）', visible: true, width: 200 },
          { props: 'whetherShelfLabel', label: '是否上架', visible: true, width: 200 },
          { props: 'claimItemAmount', label: '索赔项目工时费用（总）', visible: true, width: 200 },
          { props: 'claimPartsAmount', label: '索赔备件费用（总）', visible: true, width: 200 },
          { props: 'claimOtherAmount', label: '索赔费用（总）', visible: true, width: 200 },
          { props: 'note', label: '备注', visible: true, width: 200 },
          { props: 'modifierName', label: '修改者名称', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者名称', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
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
                  path: '/maintain/sp/interestsGoods/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '下架',
              click: (rowIndex, row) => {
                this.toggleWhetherShelf(row.id, 0, row);
              },
              show: (row) => {
                return row.whetherShelf === 1; // Show button only if user has permission
              },
              type: 'info' // Different color for different states
            }, {
              name: '上架',
              click: (rowIndex, row) => {
                this.toggleWhetherShelf(row.id, 1, row);
              },
              show: (row) => {
                return row.whetherShelf === 0; // Show button only if user has permission
              },
              type: 'info' // Different color for different states
            }, {
              name: '删除',
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
        path: '/maintain/sp/interestsGoods/edit'
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
        dataFetchPath: 'maintain/web/sp/interestsGoods/page',
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
          data.createTimeEnd = this.form.createTime[1];
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
    toggleWhetherShelf (id, status, row) {
      const action = status === 1 ? '上架' : '下架';
      this.$confirm(`此操作将${action}该权益商品，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Assuming there's an API endpoint for updating sales status
        // You may need to adjust the API call according to your backend implementation
        changeWhetherShelf({
          id: id,
          whetherShelf: status
        }).then(() => {
          this.$message({
            type: 'success',
            message: `${action}成功!`
          });
          // Update the local row data
          row.whetherShelf = status;
          row.whetherShelfLabel = status === 1 ? '是' : '否';
        }).catch(() => {
          this.$message({
            type: 'error',
            message: `${action}失败!`
          });
        });
      }).catch(() => {
        // User cancelled
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-interests-goods-list {
}
</style>
