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
            filterable
            clearable
            remote
            reserve-keyword
            v-model="row.approverId"
            :remote-method="userRemote"
            :params="row.approver"
            @change="(value, option) => onUserChange(row, value, option)"
            placeholder="请输入"
            value-key="id"
            label-key="name"
            sub-label-key="code"
          />
        </template>
      </vxe-column>
      <vxe-column field="approvalStatusCurrentLabel" title="审批时状态" width="160"></vxe-column>
      <vxe-column title="审批后状态" width="160">
        <template #default="{ row }">
          <fetch-select
            :request="fetchOptions"
            enumCode="warranty_approval_status"
            v-model="row.approvalStatusAfter"
            placeholder="请选择"
            :disabled="false"
            clearable
            filterable
            @change="(...args) => onAfter(...args, row)"
          />
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

export default {
  props: {
    id: {
      type: String,
    },
    moduleKey: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
    isServiceCareActivity: {
      type: Boolean,
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
        gradeApprovalId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    // 行保存
    saveRowEdit (row) {
      logUpdate({
        id: row.id,
      }).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
      }).catch(e => {
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
      this.tableData.unshift(row);
      this.$refs.editTable.setEditRow(row);
    },
    onUserChange (row, value, option) {
      // row.plannedDealerCode = option?.orgCode;
      // row.plannedDealerName = option?.orgName;
      // row.plannedDealerId = option?.orgId;
    },
    userRemote (queryString) {
      getUserByNameOrNo({ name: queryString });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    onAfter (...args) {
      console.log(args);
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
