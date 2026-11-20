<template>
  <div class="common-section-table pb-0">
  <vxe-table
    ref="editTable"
    :data="tableData"
    stripe
    show-overflow
    resizable
    :row-config="{ isHover: true }"
    border="inner"
    size="medium"
    min-height="0"
    max-height="400px"
    >
    <vxe-column title="是否主因" width="80">
      <template #default="{ row }">
        <el-switch
          v-if="canAddOrUpdate"
          @change="saveRowEdit(row)"
          v-model="row.isMainItem">
        </el-switch>
        <span v-else>{{ row.isMainItem ? '是' : '否' }}</span>
      </template>
    </vxe-column>
    <vxe-column field="repairItemCode" title="工时代码">
      <template #default="{ row }">
        <el-link type="primary" :href="`/service/maintain/basic/repairItem/edit?id=${row.repairItemId}`" target="_blank">{{ row.repairItemCode }}</el-link>
      </template>
    </vxe-column>
    <vxe-column field="repairItemName" title="工时名称"></vxe-column>
    <vxe-column field="workHour" title="工时数"></vxe-column>
    <vxe-column field="workHourUnitPrice" title="工时单价"></vxe-column>
    <vxe-column field="totalCostAmount" title="总金额"></vxe-column>
    <!-- LP261855 套餐核销 5 列（与列表页签口径一致） -->
    <vxe-column field="packageType" title="套餐类型" width="110">
      <template #default="{ row }">
        {{ packageTypeText(row) }}
      </template>
    </vxe-column>
    <vxe-column field="packageCode" title="套餐代码" width="150"></vxe-column>
    <vxe-column field="packageName" title="套餐名称" width="150"></vxe-column>
    <vxe-column field="mallOrderNo" title="商城订单号" width="170"></vxe-column>
    <vxe-column field="rightsOrderSourceLabel" title="权益订单来源" width="120"></vxe-column>
    <vxe-column field="remark" title="备注">
      <template #default="{ row, rowIndex }">
        <el-input
          v-if="editRowIndex === rowIndex"
          v-model="row.remark"
          placeholder="请输入"
          clearable
          size="small"
          :disabled="disabled"
        ></el-input>
        <span v-else>{{ row.remark }}</span>
      </template>
    </vxe-column>
    <vxe-column title="操作" :width="200" align="center" fixed="right" :resizable="false" v-if="canAddOrUpdate">
      <template #default="{ row, rowIndex }">
        <template v-if="editRowIndex === rowIndex">
          <span
            class="action-button btn-edit"
            @click="saveRowEdit(row)"
          >
            保存
          </span>
          <span
            class="action-button btn-edit"
            @click="cancelEdit(row, rowIndex)"
          >
            取消
          </span>
        </template>
        <template v-else>
          <span
            class="action-button btn-edit"
            @click="editRow(row, rowIndex)"
          >
            编辑
          </span>
          <el-popconfirm
            title="确定要删除这条记录吗？"
            @confirm="handleRemoveRow(row, rowIndex)"
          >
            <el-button
              class="action-button btn-delete"
              slot="reference"
              type="text">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </template>
    </vxe-column>
    <template #empty>
      <div class="m-vxe-table-empty-text">
        暂无数据
      </div>
    </template>
  </vxe-table>
  <div class="table-pagination">
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      :current-page="current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</div>
</template>
<script>

import { cloneDeep } from 'lodash';
import { PACKAGE_TYPE_TEXT } from './constants';
import { warrantyApplyWorkhourPage, warrantyApplyWorkhourDelete, warrantyApplyWorkhourUpdate } from '@/api/claimreturn/claim/warrantyapply/warrantyApplyWorkhour';

export default {
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    canAddOrUpdate: {
      type: Boolean,
      default: false,
    },
  },
  components: {
  },
  mixins: [],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      // 正在编辑的行
      editRowIndex: -1,
      originTableData: [],
      //
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    _id: {
      handler (val) {
        this.getDetailPageApi();
      }
    },
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    // LP261855 套餐类型文本映射
    packageTypeText (row) {
      return PACKAGE_TYPE_TEXT[row.packageType] || '';
    },
    // 表格数据
    getDetailPageApi () {
      warrantyApplyWorkhourPage({
        applyId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = (res.records || []).map(item => ({ ...item, isMainItem: item.isMainItem === 1 }));
        this.originTableData = cloneDeep(this.tableData);
        this.total = res.total;
      });
    },
    getOriginRow (id) {
      return this.originTableData.find(row => row.id === id);
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    handleRemoveRow (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
        return;
      }
      warrantyApplyWorkhourDelete([row.id]).then((d) => {
        this.$message.success('删除成功');
        this.getDetailPageApi();
        this.$emit('update');
      }).catch(() => {
      });
    },
    editRow (row, rowIndex) {
      if (this.editRowIndex !== -1) {
        this.$message.info('数据未保存');
        return;
      }
      this.editRowIndex = rowIndex;
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        this.tableData.splice(rowIndex, 1, originRow); // 数据还原
      }
      if (rowIndex === this.editRowIndex) {
        this.editRowIndex = -1;
      }
    },
    // 行保存
    saveRowEdit (row) {
      this.$emit('loading-change', true);
      warrantyApplyWorkhourUpdate({
        id: row.id,
        applyId: this._id,
        isMainItem: row.isMainItem ? 1 : 0,
        remark: row.remark,
      }).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.editRowIndex = -1;
      }).catch(e => {
      }).finally(() => {
        this.$emit('loading-change', false);
      });
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
    // -------------
    handleAdd (partId, row) {
      if (this.editRowIndex !== -1) {
        this.$message.info('请先保存数据，再添加');
        return;
      }
      this.tableData.unshift(row);
      this.$refs.editTable.setEditRow(row);
      this.editRowIndex = 0;
    },
  },
};

</script>
<style lang="scss" scoped>
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.action-button{
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit{
    color:#4C4CD6;
  }
  &.btn-delete{
    color: #b91919 !important;;
  }
  &.disabled{
    cursor: not-allowed;
    color: var(--disabled-color);
  }
}
.eye-icon{
  vertical-align: text-top;
  font-size: 20px;
  margin-left: 10px;
  cursor: pointer;
  color: #009100;
}
</style>
