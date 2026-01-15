<template>
  <div class="page-common m-fast-return-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="门店回运单号">
        <el-input
          placeholder="请输入"
          v-model="form.returnOrderNo"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店名称">
        <el-input
          placeholder="请输入"
          v-model="form.dealerNameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店编码"  v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.dealerCode"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="回运状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="old_part_return_order_status"
            v-model="form.returnStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
<!--        <el-form-item label="旧件返回类型">-->
<!--          <fetch-select-->
<!--            :request="fetchOptions"-->
<!--            enumCode="old_part_return_type"-->
<!--            v-model="form.returnTypeList"-->
<!--            placeholder="请选择"-->
<!--            clearable-->
<!--            multiple-->
<!--            filterable-->
<!--          />-->
<!--        </el-form-item>-->
        <el-form-item label="是否验收完成">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isCheckedList"
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
      <el-button v-if="canAddOrUpdate&&isFastReturn" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button  v-if="canDelete"  size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button  v-if="canSign"  size="small" @click="handleBatchSign" :disabled="selectionList.length === 0">批量签收</el-button>
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
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction/index.vue';
import { getList, deleteItem, enableItem, publish, signByIds } from '@/api/claimreturn/oldpart/returnorder';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import Upload from '@/libs/components/UploadDialog/index.vue';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  returnOrderNo: '',
  dealerName: '',
  dealerCode: '',
  returnStatus: '',
  isChecked: '',
  returnDate: '',
  returnType: '',
  receiverAddress: '',
  receiverContact: '',
  logisticsTrackingNo: '',
  logisticsCompany: '',
  estimatedArrivalDate: '',
  returnUnit: '',
  signReceiveDate: '',
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
      pageTitle: '旧件快返回运单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      form: {
        ...defaultForm
      },
      moduleKey: this.$route.meta.moduleKey,
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
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
            props: 'returnOrderNo',
            label: '门店回运单号',
            visible: true,
            width: 240,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: this.editPath,
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 220,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.goToDealer(row.dealerCode);
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 140 },
          { props: 'returnStatusLabel', label: '回运状态', visible: true, width: 110 },
          { props: 'isCheckedLabel', label: '是否验收完成', visible: true, width: 140 },
          { props: 'returnDate', label: '回运日期', visible: true, width: 200 },
          { props: 'returnTypeLabel', label: '旧件返回类型', visible: true, width: 140 },
          { props: 'receiverAddress', label: '回运地址', visible: true, width: 200 },
          { props: 'receiverContact', label: '收货联系人', visible: true, width: 200 },
          { props: 'logisticsTrackingNo', label: '物流单号', visible: true, width: 200 },
          { props: 'logisticsCompany', label: '物流商', visible: true, width: 200 },
          { props: 'estimatedArrivalDate', label: '预计到达日期', visible: true, width: 200 },
          { props: 'returnUnit', label: '回运件数（纸箱/木架）', visible: true, width: 200 },
          { props: 'signReceiveDate', label: '签收日期', visible: true, width: 200 },
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
                  path: this.editPath,
                  query: {
                    id: row.id,
                    isEditing: true,
                  }
                });
              },
              type: 'info'
            },
            {
              name: '下发',
              show: (row) => {
                return row.returnStatus === '10' && this.canPublish;
              },
              popconfirmTitle: '是否下发?',
              click: (rowIndex, row) => {
                publish(row.id).then(() => {
                  this.$message({
                    type: 'success',
                    message: '下发成功!'
                  });
                  this.getData();
                }).catch(() => {
                });
              },
              type: 'info'
            }, {
              name: '删除',
              show: (row) => {
                return row.returnStatus === '10' && this.canDelete;
              },
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
      }
    };
  },
  beforeCreate () {
    defaultForm.returnType = this.$route.meta.returnType;
  },
  created () {
    this.pageTitle = this.$route.meta.name;
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  computed: {
    isFastReturn () {
      return this.$route.meta.returnType === '40';
    },
    editPath () {
      return this.isFastReturn ? '/claimreturn/oldpart/returnorder/fast/edit' : '/claimreturn/oldpart/returnorder/edit';
    },
    canPublish () {
      return this.permissions.has(`${this.moduleKey}-publish`);
    },
    canSign () {
      return this.permissions.has(`${this.moduleKey}-sign`);
    }
  },
  methods: {
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
        path: this.editPath
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
        businessType: '新页面',
        dataFetchPath: 'claimreturn/web/oldpart/returnorder/fastReturnOrder/page',
        reqParams: this.getFormData(),
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
      this.selectionList.forEach(item => {
        if (item.returnStatus !== '10') {
          this.$message({
            type: 'error',
            message: '仅草稿状态数据允许删除!'
          });
          throw new Error('仅草稿状态数据允许删除!');
        }
      });
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
    // 批量签收
    handleBatchSign () {
      this.selectionList.forEach(item => {
        if (item.returnStatus !== '30') {
          this.$message({
            type: 'error',
            message: '仅已回运状态数据允许签收!'
          });
          throw new Error('仅已回运状态数据允许签收!');
        }
      });
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('是否签收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        signByIds(ids).then(() => {
          this.$message({
            type: 'success',
            message: '签收成功!'
          });
          this.getData();
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-fast-return-order-list {
}
</style>
