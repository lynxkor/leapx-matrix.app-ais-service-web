<template>
    <el-dialog class="m-start-work-dialog" title="厅店退货-添加退货明细" width="1000px" :visible.sync="dialogVisible"
        @close="close" @closed="closed">
        <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
            class="ais-search-form">
            <el-form-item label="备件编码/名称">
                <fetch-select prop="sparePartCode" filterable clearable remote reserve-keyword
                    v-model="form.sparePartIdList" :remote-method="listSparePart" labelKey="code" valueKey="code"
                    subLabelKey="name" />
            </el-form-item>
            <el-form-item label="采购单号">
                <tag-input v-model="form.purchaseOrderCodeList" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="入库单号">
                <tag-input v-model="form.inboundOrderCodeList" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="可用库存数量大于0">
                <el-switch v-model="form.availableQtyGreater" active-color="#71e2a3" inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <el-form-item label="可退库存数量大于0">
                <el-switch v-model="form.returnableQtyGreater" active-color="#71e2a3" inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <page-search-action v-model="show" :isExpandable="false" :loading="loading" @submit="onSubmit"
                @reset="onReset" />
        </el-form>
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium"
                :checkbox-config="{ checkField: 'checked' }" @checkbox-change="handleSelectionChange"
                @checkbox-all="handleSelectionChange">
                <vxe-column type="checkbox" width="60" align="center" />
                <vxe-column field="partCode" title="备件编码" />
                <vxe-column field="partName" title="备件名称" />
                <vxe-column field="inboundOrderId" title="入库单号" />
                <vxe-column field="purchaseOrderId" title="采购单号" />
                <vxe-column field="purchaseDate" title="采购日期" />
                <vxe-column field="availableQty" title="可用库存" />
                <vxe-column field="returnableQty" title="可退数量" >
                    <template #default="{ row }">
                        <el-input v-model="row.returnableQty" type="number" min="0" />
                    </template>
                </vxe-column>
                <vxe-column field="remark" title="备注" >
                    <template #default="{ row }">
                        <el-input v-model="row.remark" type="text" />
                    </template>
                </vxe-column>
                <div class="table-pagination">
                    <el-pagination @size-change="(val) => pageSizeChange(val)"
                        @current-change="(val) => currentPageChange(val)" :current-page="current"
                        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">出 库</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { addPartPage } from '@/api/sparepart/return/returnOrder/index';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import TagInput from '@/libs/components/TagInput';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  name: 'AddSpareParts',
  components: {
    PageSearchAction,
    TagInput,
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {};
      }
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      show: false,
      loading: false,
      submitLoading: false,
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      form: {
        sparePartIdList: [],
        purchaseOrderCodeList: [],
        inboundOrderCodeList: [],
        availableQtyGreater: false,
        returnableQtyGreater: false
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
  },
  methods: {
    onSubmit () {
      this.initData();
    },
    onReset () {
      this.current = 1;
      this.pageSize = 10;
      this.initData();
    },
    initData () {
      const params = {
        pageNum: this.current,
        pageSize: this.pageSize,
        warehouseId: this.id,
        ...this.form
      };
      addPartPage(params).then(res => {
        this.tableData = res.records || [];
        this.total = res.total;
      });
    },
    close () {
      this.$emit('close');
    },
    closed () {
      this.$refs.workTable && this.$refs.workTable.clearCheckboxRow();
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    async submit () {
    //   if (!this.selectedRows.length) {
    //     this.$message.warning('请选择需要出库的明细记录');
    //     return;
    //   }

    //   //  构建参数
    //   const params = {
    //     maintenanceOutboundOrderId: this.id,
    //     outboundPartList: this.selectedRows.map(row => ({
    //       id: row.id, // 行数据的唯一标识
    //       picker: row.picker // 领料人ID
    //     }))
    //   };
    //   // 批量更新选中行的实际作业时间
    //   this.submitLoading = true;
    //   try {
    //     await OutboundPeople(params);
    //     this.$message.success('出库成功');
    //     this.submitLoading = false;
    //     this.selectedRows = [];
    //     this.$emit('success');
    //   } catch (error) {
    //     this.$message.error('出库失败');
    //     this.submitLoading = false;
    //   }
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi();
    },
    async listSparePart (query) {
      let res = await getSparePart({ partCodeOrNameLike: query });
      return res;
    },
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
        padding: 8px 12px !important;
    }

    .start-work-content {
        .time-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e8e8e8;

            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }

        .table-section {
            margin-top: 15px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

.table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
}
</style>
