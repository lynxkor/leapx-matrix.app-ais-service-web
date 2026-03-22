<template>
  <div>
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
      <vxe-column title="序号" width="160">
        <template #default="{rowIndex}">
          {{ rowIndex + 1 }}
        </template>
      </vxe-column>
      <vxe-column title="审批人员" width="180">
        <template #default="{ row }">
          <fetch-select
            v-if="row._editing"
            filterable
            clearable
            remote
            reserve-keyword
            v-model="row.approverId"
            :remote-method="userRemote"
            :params="row.approverName"
            @change="(value, option) => onUserChange(row, value, option)"
            placeholder="请输入"
            value-key="id"
            label-key="name"
            sub-label-key="code"
          />
          <span v-else>{{ row.approverName }}</span>
        </template>
      </vxe-column>
      <vxe-column field="approvalStatusCurrentLabel" title="审批时状态" width="160"></vxe-column>
      <vxe-column title="审批后状态" width="160">
        <template #default="{ row }">
          <fetch-select
            v-if="row._editing"
            :request="fetchOptions"
            enumCode="warranty_approval_status"
            v-model="row.approvalStatusAfter"
            placeholder="请选择"
            :disabled="false"
            clearable
            filterable
            @change="(...args) => onAfter(...args, row)"
          />
          <span v-else>{{ row.approvalStatusAfterLabel }}</span>
        </template>
      </vxe-column>
      <vxe-column title="操作" :width="200" align="center" fixed="right" :resizable="false">
        <template #default="{ row, rowIndex }">
          <template v-if="row._editing">
            <span
              class="action-button btn-edit"
              @click="saveRowEdit(row, rowIndex)"
              v-if="canAddOrUpdate"
            >
              保存
            </span>
            <span
              class="action-button btn-edit"
              @click="cancelEdit(row, rowIndex)"
              v-if="canAddOrUpdate"
            >
              取消
            </span>
          </template>
          <template v-else>
            <span
              class="action-button btn-edit"
              @click="editRow(row, rowIndex)"
              v-if="canAddOrUpdate"
            >
              编辑
            </span>
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

import permissions from '@/libs/mixins/permissions';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getUserByNameOrNo, getEnum } from '@/api/common';
import { logPage, logUpdate } from '@/api/claimreturn/claim/basic/warrantyGradeApprovalSetting';
import { cloneDeep } from 'lodash';

export default {
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    moduleKey: {
      type: String,
    }
  },
  components: {
    FetchSelect,
  },
  mixins: [permissions],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      originTableData: [],
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
    // 表格数据
    getDetailPageApi () {
      logPage({
        gradeApprovalId: this._id, // 01B4CC10-65AF-EC11-B0FA-A78BFAB06A24
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.originTableData = cloneDeep(res.records || []);
        this.total = res.total;
      });
    },
    getOriginRow (id) {
      return this.originTableData.find(row => row.id === id);
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    // 行编辑
    editRow (row, rowIndex) {
      this.$set(row, '_editing', true);
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        if (originRow) {
          this.tableData.splice(rowIndex, 1, cloneDeep(originRow));
        }
      }
    },
    // 行保存
    saveRowEdit (row, rowIndex) {
      logUpdate({
        id: row.id,
        approverId: row.approverId,
        approverName: row.approverName,
        approvalStatusAfter: row.approvalStatusAfter,
      }).then(() => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
      }).catch(() => {
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
      const newRow = { ...row, _editing: true };
      this.tableData.unshift(newRow);
      this.$refs.editTable.setEditRow(newRow);
    },
    onUserChange (row, value, option) {
      row.approverCode = option?.code;
      row.approverName = option?.name;
      row.approverId = option?.id;
    },
    userRemote (queryString) {
      return getUserByNameOrNo({ name: queryString });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    onAfter (value, label, row) {
      row.approvalStatusAfterLabel = label;
    }
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
