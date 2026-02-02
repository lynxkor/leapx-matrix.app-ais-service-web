<template>
    <el-dialog class="m-start-work-dialog" title="厅店退货-添加退货明细" width="80%" :visible.sync="dialogVisible"
        @close="close" @closed="closed">
        <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
            class="ais-search-form">
            <el-form-item label="备件编码/名称">
                <fetch-select prop="sparePartCode" filterable clearable remote reserve-keyword multiple
                    v-model="form.sparePartIdList" :remote-method="listSparePart" labelKey="code" valueKey="id"
                    subLabelKey="name" />
            </el-form-item>
            <el-form-item label="采购单号">
                <tag-input v-model="form.purchaseOrderCodeList" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="入库单号">
                <tag-input v-model="form.inboundOrderCodeList" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="可用库存数量大于0">
                <el-switch v-model="form.availableQtyGreater">
                </el-switch>
            </el-form-item>
            <el-form-item label="可退库存数量大于0">
                <el-switch v-model="form.returnableQtyGreater">
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
                        <el-input v-model="row.returnQty" type="number" min="0" />
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
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { addPartPage, returnOrderUpdate } from '@/api/sparepart/return/returnOrder/index';
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
    },
    returnOrderId: {
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
      selectedRows: [],
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
      this.form = {
        sparePartIdList: [],
        purchaseOrderCodeList: [],
        inboundOrderCodeList: [],
        availableQtyGreater: false,
        returnableQtyGreater: false
      };
      this.initData();
    },
    initData () {
      const params = {
        ...this.form,
        pageNum: this.current,
        pageSize: this.pageSize,
        warehouseId: this.id,
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
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请选择需要添加的明细记录');
        return;
      }

      // 验证选中行中的必填字段
      const invalidRows = this.selectedRows.filter(row => {
        // 检查可退数量是否有效
        if (!row.returnQty || Number(row.returnQty) <= 0) {
          return true;
        }
        // 可以根据需要添加其他验证逻辑

        return false;
      });

      if (invalidRows.length > 0) {
        this.$message.warning('请填写有效的可退数量');
        return;
      }

      // 构建参数
      const parts = this.selectedRows.map(row => ({
        sparePartId: row.sparePartId, // 备件ID，根据实际数据结构调整
        returnQty: Number(row.returnQty), // 可退数量，转为数字类型
        remark: row.remark || '' // 备注，为空则设为''
      }));

      const params = {
        returnOrderId: this.returnOrderId, // 退货订单ID，根据实际数据结构调整
        parts: parts
      };

      this.submitLoading = true;
      try {
        await returnOrderUpdate(params);
        this.$message.success('操作成功');
        this.submitLoading = false;
        this.$emit('success'); // 触发成功事件
      } catch (error) {
        this.$message.error('操作失败');
        this.submitLoading = false;
      }
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
