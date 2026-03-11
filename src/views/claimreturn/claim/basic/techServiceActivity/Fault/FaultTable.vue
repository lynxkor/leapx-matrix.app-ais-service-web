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
    :edit-rules="{
      quantity: [{ required: true },]
    }"
    >
    <vxe-column field="vrtName" title="VRT名称" width=""></vxe-column>
    <vxe-column field="vfgName" title="VFG名称" width=""></vxe-column>
    <vxe-column field="cccName" title="CCC名称" width="">
      <template #default="{ row, rowIndex }">
        <fault-search
          v-if="eidtRowIndex === rowIndex"
          :id="id"
          @update="(data) => onUpdate(row, data)"
          :value="row.cccName"
        />
        <span v-else>{{ row.cccName }}</span>
      </template>
    </vxe-column>
    <vxe-column field="createTime" title="创建时间" width=""></vxe-column>
    <vxe-column title="操作" :width="200" align="center" fixed="right" :resizable="false">
      <template #default="{ row, rowIndex }">
        <template v-if="eidtRowIndex === rowIndex">
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
          <el-popconfirm
            title="确定要删除这条记录吗？"
            @confirm="handleRemoveRow(row, rowIndex)"
            v-if="canAddOrUpdate"
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
import {
  serviceActivityFaultPage,
  serviceActivityFaultUpdate,
  serviceActivityFaultDelete,
} from '@/api/claimreturn/claim/basic/serviceActivity';

import permissions from '@/libs/mixins/permissions';
import FaultSearch from './FaultSearch.vue';
import { cloneDeep } from 'lodash';

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
  },
  components: {
    FaultSearch,
  },
  mixins: [permissions],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      // 正在编辑的行
      eidtRowIndex: -1,
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
    // 表格数据
    getDetailPageApi () {
      serviceActivityFaultPage({
        activityId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.originTableData = cloneDeep(res.records);
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
      serviceActivityFaultDelete([row.id]).then((d) => {
        this.$message.success('删除成功');
        this.getDetailPageApi();
      }).catch(() => {
      });
    },
    editRow (row, rowIndex) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('数据未保存');
        return;
      }
      this.eidtRowIndex = rowIndex;
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        this.tableData.splice(rowIndex, 1, originRow); // 数据还原
      }
      if (rowIndex === this.eidtRowIndex) {
        this.eidtRowIndex = -1;
      }
    },
    // 行保存
    saveRowEdit (row) {
      serviceActivityFaultUpdate({
        id: row.id,
        activityId: this._id,
        cccId: row.cccId,
      }).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.eidtRowIndex = -1;
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
    onUpdate (row, data) {
      row.cccName = data.name;
      row.cccId = data.id;
      row.cccCode = data.code;
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
