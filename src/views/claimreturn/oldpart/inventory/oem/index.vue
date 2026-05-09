<template>
  <div class="page-common m-oem-inventory-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="旧件唯一码">
        <el-input
          placeholder="请输入"
          v-model="form.oldPartUniqueCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="接车施工单">
        <el-input
          placeholder="请输入"
          v-model="form.serviceProxyNo"
          clearable
        />
      </el-form-item>
      <el-form-item label="保修申请单"  v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.warrantyNo"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="旧件销毁单">
          <list-select
            listUrl="/claimreturn/oldpart/web/destroy/oldPartDestroyOrder/list"
            placeholder="请选择"
            v-model="form.oldPartDestroyOrderId"
            query-key="destroyOrderNo"
            clearable
            collapseTags
            :show-code="false"
            filterable
            label-key="code"
            value-key="id"
          />
        </el-form-item>
        <el-form-item v-if="!isDealer" label="门店名称">
          <dealer-select v-model="form.dealerCodes" multiple />
        </el-form-item>
        <el-form-item label="VIN">
          <el-input
            placeholder="请输入"
            v-model="form.vin"
            clearable
          />
        </el-form-item>
        <el-form-item label="旧件编码">
          <el-input
            placeholder="请输入"
            v-model="form.oldPartCode"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="isDealer" label="旧件名称">
          <el-input
            placeholder="请输入"
            v-model="form.oldPartName"
            clearable
          />
        </el-form-item>
        <el-form-item label="门店回运单号">
          <list-select
            listUrl="/claimreturn/oldpart/web/returnorder/oldPartReturnOrder/list"
            placeholder="请选择"
            v-model="form.returnOrderId"
            query-key="returnOrderNo"
            clearable
            collapseTags
            :show-code="false"
            filterable
            label-key="code"
            value-key="id"
          />
        </el-form-item>

        <el-form-item label="旧件返还类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="old_part_return_type"
            v-model="form.returnTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>

        <el-form-item v-if="!isDealer" label="主机厂库存状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="old_part_inventory_oem_status"
            v-model="form.oemStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item v-if="isDealer" label="门店库存状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="old_part_inventory_dealer_status"
            v-model="form.dealerStatus"
            placeholder="请选择"
            clearable
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
      <el-button v-permission="moduleKey + '-batchPrintTag'" size="small" @click="handlePrint"><i class="iconfont"></i>批量打印标签</el-button>
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
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, getDetailDecryptField } from '@/api/claimreturn/oldpart/inventory/oem';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import ListSelect from '@/libs/components/list-select/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
import { loginUserGet } from '@/libs/api/common';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  oldPartUniqueCode: '',
  serviceProxyNo: '',
  warrantyNo: '',
  oldPartDestroyOrderNo: '',
  dealerName: '',
  isMainPart: '',
  vin: '',
  oldPartSupplierName: '',
  dutySupplierName: '',
  oldPartCode: '',
  oldPartName: '',
  partCode: '',
  partName: '',
  oemStatus: '',
  dealerInTime: '',
  dealerOutTime: '',
  returnOrderNo: '',
  returnStatusList: [],
  isCheckedList: [],
  returnDate: '',
  oemInTime: '',
  oemCheckTime: '',
  oemOutboundOrderNo: '',
  oemOutTime: '',
  returnType: '',
  remark: '',
  destroyRejectReason: '',
  checkRemark: '',
  createTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    DealerSelect,
    ListSelect,
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload
  },
  data () {
    return {
      isDealer: null,
      pageTitle: this.$route.meta.name,
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: this.$route.meta.moduleKey,
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
        id: 'oemInventoryTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'warrantyMonth',
            label: '保修月份',
            visible: true,
            width: 120,
            fixed: 'left'
          },
          {
            props: 'oldPartUniqueCode',
            label: '旧件唯一码',
            visible: true,
            width: 220,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                if (this.isDealer) {
                  this.$router.push({
                    path: '/claimreturn/oldpart/inventory/dealer/edit',
                    query: {
                      id: row.id
                    }
                  });
                } else {
                  this.$router.push({
                    path: '/claimreturn/oldpart/inventory/oem/edit',
                    query: {
                      id: row.id
                    }
                  });
                }
              },
              type: 'primary'
            }]
          },
          {
            props: 'serviceProxyNo',
            label: '接车施工单',
            visible: true,
            width: 220,
            fixed: 'left',
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
            props: 'warrantyNo',
            label: '保修申请单',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyApply/edit',
                  query: {
                    id: row.warrantyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'oldPartDestroyOrderNo',
            label: '旧件销毁单',
            visible: true,
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                const path = this.isDealer ? '/claimreturn/oldpart/destroy/dealerOldPartDestroyOrder/edit' : '/claimreturn/oldpart/destroy/oldpartdestroyorder/edit';
                this.$router.push({
                  path,
                  query: {
                    id: row.oldPartDestroyOrderId
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
            width: 240,
            buttons: [{
              click: (rowIndex, row) => {
                this.navigateToRoute({
                  path: '/partner/channelManagement/shopDetail',
                  query: {
                    dealerCode: row.dealerCode,
                  },
                });
              },
              type: 'primary'
            }]
          },
          { props: 'isMainPartLabel', label: '是否主因零部件', visible: true, width: 150 },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 220,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'vin')
          },
          {
            props: 'oldPartSupplierName',
            label: '旧件供应商',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/supplierInfo/detail',
                  query: {
                    id: row.oldPartSupplierId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'mainPartSupplierName',
            label: '主因件供应商',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/supplierInfo/detail',
                  query: {
                    id: row.mainPartSupplierId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dutySupplierName',
            label: '责任供应商(二次索赔明细)',
            visible: true,
            width: 220,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/supplierInfo/detail',
                  query: {
                    id: row.dutySupplierId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'oldPartCode',
            label: '旧件编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/detail',
                  query: {
                    id: row.oldPartId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'oldPartName', label: '旧件名称', visible: true, width: 200 },
          {
            props: 'partCode',
            label: '换上零件编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/detail',
                  query: {
                    id: row.partId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'partName', label: '换上零件名称', visible: true, width: 200 },
          { props: 'oemStatusLabel', label: '主机厂库存状态', visible: true, width: 200 },
          { props: 'dealerInTime', label: '门店入库时间', visible: true, width: 200 },
          { props: 'dealerOutTime', label: '门店出库时间', visible: true, width: 200 },
          {
            props: 'returnOrderNo',
            label: '门店回运单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                let path;
                if (this.isDealer) {
                  if (row.returnType === '40') {
                    path = '/claimreturn/oldpart/dealerReturnorder/fast/edit';
                  } else {
                    path = '/claimreturn/oldpart/returnorder/edit';
                  }
                } else {
                  if (row.returnType === '40') { // 快返
                    path = '/claimreturn/oldpart/returnorder/fast/edit';
                  } else {
                    path = '/claimreturn/oldpart/returnorder/edit';
                  }
                }

                this.$router.push({
                  path,
                  query: {
                    id: row.returnOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'oemInTime', label: '主机厂入库时间', visible: true, width: 200 },
          { props: 'oemCheckTime', label: '主机厂验收时间', visible: true, width: 200 },
          {
            props: 'oemOutboundOrderNo',
            label: '主机厂出库单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/oldpart/outbound/edit',
                  query: {
                    id: row.oemOutboundOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'oemOutTime', label: '主机厂出库时间', visible: true, width: 200 },
          { props: 'returnTypeLabel', label: '旧件返还类型', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'destroyRejectReason', label: '销毁驳回原因', visible: true, width: 200 },
          { props: 'checkRemark', label: '验收备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '查看详情',
              click: (rowIndex, row) => {
                let path = '/claimreturn/oldpart/inventory/oem/edit';
                if (this.isDealer) {
                  path = '/claimreturn/oldpart/inventory/dealer/edit';
                }
                this.$router.push({
                  path,
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
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    loginUserGet().then(data => {
      this.isDealer = data.accountFlag;
    });
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
        path: '/claimreturn/oldpart/oemInventory/edit'
      });
    },
    handlePrint () {
      if (!this.selectionList?.length) {
        this.$message.warning('请选择打印数据');
        return;
      }
      this.$print.show({
        id: new Date().getTime() + '',
        template: 'OldPartMark',
        title: '保修旧件标签',
        data: this.selectionList.map(item => item.id),
        width: 1122,
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
      exportTable({
        businessType: '主机厂旧件库存',
        dataFetchPath: '/claimreturn/oldpart/web/inventory/oldPartOemInventory/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '主机厂旧件库存.xlsx');
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-oem-inventory-list {
}
</style>
