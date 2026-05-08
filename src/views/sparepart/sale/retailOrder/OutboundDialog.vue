<template>
    <el-dialog
      class="m-start-work-dialog"
      :title="title"
      width="70%"
      :visible.sync="dialogVisible"
      @close="close"
    >
        <!-- 数据表格 -->
        <div class="table-section">
          <vxe-table
            ref="workTable"
            :data="tableData"
            stripe
            show-overflow
            resizable
            border="inner"
            size="medium"
          >
            <vxe-column field="sparePartCode" title="备件编码" width="16%" />
            <vxe-column field="sparePartName" title="备件名称" width="16%" />
            <vxe-column field="locationName" title="库位" width="16%" />
            <vxe-column field="availableQty" title="可用库存" width="16%" />
            <vxe-column field="qty" :title="titleDialog === '1' ? '出库数量' : '退料数量'" width="16%" />
            <vxe-column :title="titleDialog === '1' ? '领料人' : '入库操作人'" width="16%">
              <template #default="{ row, rowIndex }">
                <el-select
                  v-model="row.picker"
                  size="mini"
                  placeholder="请选择"
                  filterable
                  remote
                  :remote-method="(query) => querySearchAsync(query, rowIndex)"
                  @change="handleWorkstationChange(row, rowIndex, $event)"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </vxe-column>
          </vxe-table>
          <div class="table-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>

      <!-- 底部按钮 -->
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" :loading="submitLoading" @click="submit">{{ btnTitle }}</el-button>
        </div>
      </template>
    </el-dialog>
  </template>

<script>
import { getUserByNameOrNo } from '@/api/common';
import { retailOrderDetailPage, shipOrder, returnMaterialInbound, cancelOrderInbound } from '@/api/sparepart/sale/retailOrder/index';

export default {
  name: 'OutboundDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    titleDialog: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      selectedRows: [],
      // 领料人
      userList: [],
      // 模拟表格数据
      tableData: [],
      title: '销售出库',
      btnTitle: '出 库',
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
    titleDialog (val) {
      if (val === '1') {
        this.title = '销售出库';
        this.btnTitle = '出 库';
      } else if (val === '2') {
        this.title = '退料入库';
        this.btnTitle = '入库';
      } else if (val === '3') {
        this.title = '退订入库';
        this.btnTitle = '入库';
      }
    }
  },
  methods: {
    initData () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        retailOrderId: this.id,
      };
      if (this.titleDialog === '1') {
        params.outboundIs = '0';
      }
      if (this.titleDialog === '2') {
        params.applyReturnMaterialIs = '1';
        params.outboundIs = '1';
      }
      retailOrderDetailPage(params).then(res => {
        this.tableData = res.records || [];
        this.total = res.total || 0;
      });
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.initData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.initData();
    },
    close () {
      this.$emit('update:visible', false);
    },
    async submit () {
      // 检查所有记录是否都选择了领料人
      const rowNumbers = [];
      this.tableData.forEach((row, index) => {
        if (!row.picker) {
          rowNumbers.push(index + 1); // 在原始索引基础上加1
        }
      });

      if (rowNumbers.length > 0) {
        this.$message.warning(`第 ${rowNumbers.join('、')} 行未选择${this.titleDialog === '1' ? '领料人' : '入库操作人'}`);
        return;
      }
      let flanApi = shipOrder;
      if (this.titleDialog === '1') {
        flanApi = shipOrder;
      } else if (this.titleDialog === '2') {
        flanApi = returnMaterialInbound;
      } else if (this.titleDialog === '3') {
        flanApi = cancelOrderInbound;
      };
      //  构建参数
      const params = {
        id: this.id,
        detailList: this.tableData.map(row => {
          // 根据 picker（userId）查找对应的用户名
          const selectedUser = this.userList.find(user => user.value === row.picker);
          return {
            detailId: row.id, // 行数据的唯一标识
            operator: row.picker, // 领料人ID
            operatorName: selectedUser ? selectedUser.label : '' // 领料人名称
          };
        })
      };
      // 批量更新选中行的实际作业时间
      this.submitLoading = true;
      try {
        await flanApi(params);
        this.$message.success('操作成功');
        this.submitLoading = false;
        this.close();
        this.$emit('success');
      } catch (error) {
        this.$message.error('操作失败');
        this.submitLoading = false;
      }
    },
    // 远程搜索方法，接收行索引参数
    querySearchAsync (queryString, rowIndex) {
      getUserByNameOrNo({ name: queryString }).then(res => {
        const list = res?.map(item => {
          return {
            value: item.userId,
            label: item.username
          };
        }) || [];

        this.userList = list;
      }).catch(error => {
        console.log('搜索用户失败:', error);
        this.userList = [];
      });
    },

    // 处理领料人选择变化
    handleWorkstationChange (row, rowIndex, ele) {
      // 设置当前行的领料人
      row.picker = ele;

      // 检查是否所有其他行都没有领料人值
      const allEmpty = this.tableData.every((r, idx) => idx === rowIndex || !r.picker);

      if (allEmpty && this.tableData.length > 1) {
        // 如果所有其他行都没有值，则将所有行设置为当前选择的值
        this.tableData.forEach((r, idx) => {
          if (idx !== rowIndex) {
            r.picker = ele;
          }
        });
      }
    },
  }
};
</script>

  <style lang="scss" scoped>
  .m-start-work-dialog {
    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
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
  </style>
