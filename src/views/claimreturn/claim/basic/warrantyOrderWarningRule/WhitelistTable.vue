<template>
  <!-- 备件白名单列表 -->
  <section class="common-section">
    <div class="common-section-header">
      <base-search
        filterable
        clearable
        remote
        reserve-keyword
        v-model="part"
        :remote-method="partRemote"
        @change="handlePartChange"
        value-key="id"
        label-key="partName"
        sub-label-key="partCode"
        placeholder="请输入备件编码/名称"
      />
    </div>
    <div class="common-section-body">
      <div class="common-section-table">
        <edit-table
          ref="editTable"
          :columns="columns"
          :data="tableData"
          :defaultNewRow="defaultNewRow"
          :show-toolbar="false"
          :options="options"
          :auth="{ edit: false, delete: canDelete }"
          :isFocusNewRow="false"
          :showPagination="true"
          :current="current"
          :pageSize="pageSize"
          :total="total"
          @remove-row="handleRemoveRow"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
        >
          <template #btn-middle="{ row, rowIndex }">
            <el-button
              type="text"
              @click="onReplace(row, rowIndex)"
              class="action-button btn-edit"
            >
              替换件
            </el-button>
          </template>
        </edit-table>
      </div>
    </div>
  </section>
</template>

<script>
import { whitelistPage, whitelistAddOrUpdate, whitelistDelete } from '@/api/claimreturn/claim/basic/warrantyOrderWarningRule/whitelist';
import { sparePartList } from '@/api/common';
import EditTable from '@/libs/components/EditTable';
import BaseSearch from '@/libs/components/BaseSearch';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
    moduleKey: {
      type: String,
      default: '',
    },
  },
  components: { EditTable, BaseSearch },
  mixins: [permissions],
  data () {
    return {
      // EditTable 必须传 defaultNewRow 才会显示内置操作列（含 #btn-middle slot 和删除按钮）
      defaultNewRow: { partId: '', partCode: '', partName: '' },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {},
      columns: [
        { field: 'partCode', title: '备件编码', width: '30%' },
        { field: 'partName', title: '备件名称', width: '30%' },
        { field: 'createTime', title: '创建时间', width: '40%' },
      ],
      part: '',
      curPart: null,
    };
  },
  watch: {
    id: {
      handler () { this.current = 1; this.getDetailPageApi(); },
    },
  },
  mounted () {
    this.getDetailPageApi();
  },
  methods: {
    getDetailPageApi () {
      whitelistPage({ pageSize: this.pageSize, pageNum: this.current }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total || 0;
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
    partRemote (query) {
      return sparePartList({ partCodeOrNameLike: query, oemPart: 1, status: 1 });
    },
    // 选中即保存：直接走后端 addOrUpdate，不走行内 addRow
    handlePartChange (val, record) {
      this.curPart = record;
      this.handleAdd();
    },
    handleAdd () {
      if (!this.part) {
        this.$message.error('请选择零件');
        return;
      }
      const payload = {
        partId: this.part,
        partCode: this.curPart.partCode,
        partName: this.curPart.partName,
        status: 1,
        dataSource: 150,
      };
      whitelistAddOrUpdate(payload).then(() => {
        this.$message.success('添加成功');
        this.part = '';
        this.getDetailPageApi();
      });
    },
    // 删除走 edit-table 自带 @remove-row（不再二次确认，避免双弹窗）
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        defer.resolve();
        return;
      }
      whitelistDelete([row.id]).then(() => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    onReplace (row) {
      this.$emit('open-replace', row);
    },
  },
};
</script>

<style lang="scss" scoped>
.common-section {
  margin: 0;
  .common-section-body { padding: 0; }
  .common-section-header { display: flex; align-items: center; margin-bottom: 8px; }
}
.action-button {
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit { color: #4C4CD6; }
  &.disabled { cursor: not-allowed; color: var(--disabled-color); }
}
</style>
