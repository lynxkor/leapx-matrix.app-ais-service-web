<template>
    <el-dialog class="m-start-work-dialog" title="不可采购清单" width="800px" :visible.sync="dialogVisible" @close="close">
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="partCode" title="备件编码" />
                <vxe-column field="partName" title="备件名称" />
                <vxe-column field="unPurchaseReason" title="不可采购原因" />
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" :loading="exportLoading" @click="exportExcel">导 出</el-button>
                <el-button size="small" @click="deleteUnPurchaseDetail">删除不可采购备件</el-button>
                <el-button size="small" @click="close">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { purchaseApplyDeleteUnPurchaseDetail } from '@/api/sparepart/purchase/purchaseApply/index';
import { downloadExcel } from '@/libs/utils';
import { exportTable } from '@/api/common';

export default {
  name: 'SubmitDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    purchaseList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      exportLoading: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    purchaseList (val) {
      if (val) {
        this.tableData = val;
      }
    }
  },
  methods: {
    close () {
      this.$emit('close');
    },
    // 删除不可采购备件
    async deleteUnPurchaseDetail () {
      await purchaseApplyDeleteUnPurchaseDetail(this.id);
      this.close();
    },
    // 获取列标题映射
    getTitleMap () {
    // 定义列标题映射关系
      const titleMap = {
        partCode: '备件编码',
        partName: '备件名称',
        unPurchaseReason: '不可采购原因'
      };
      return titleMap;
    },
    exportExcel () {
      console.log('exportExcel', this.$refs.workTable);
      this.exportLoading = true;
      exportTable({
        businessType: '不可采购清单',
        dataFetchPath: '/sp/web/purchase/purchaseApply/listUnPurchaseDetail',
        reqParams: {
          id: this.id
        },
        titleMap: this.getTitleMap(),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '不可采购清单.xlsx');
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

.action-button {
    margin: 0 5px;
    cursor: pointer;

    &.btn-edit {
        color: #4C4CD6;
    }
}
</style>
