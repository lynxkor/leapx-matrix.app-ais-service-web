<template>
  <!-- 替换件面板 -->
  <section v-if="replacePart && replacePart.id" class="common-section">
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
        placeholder="请输入替换件编码/名称"
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
          :auth="{ edit: canAddOrUpdate, delete: canDelete }"
          :isFocusNewRow="false"
          :enableSingleRowSave="true"
          :showPagination="true"
          :current="current"
          :pageSize="pageSize"
          :total="total"
          @save-row-edit="saveRowEdit"
          @remove-row="handleRemoveRow"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
        >
          <template #btn-before>
            <span class="replace-hide-edit-marker"></span>
          </template>
        </edit-table>
      </div>
    </div>
  </section>
</template>

<script>
import {
  whitelistReplacePage,
  whitelistReplaceAddOrUpdate,
  whitelistReplaceDelete,
} from '@/api/claimreturn/claim/basic/warrantyOrderWarningRule/whitelist';
import { sparePartList } from '@/api/common';
import EditTable from '@/libs/components/EditTable';
import BaseSearch from '@/libs/components/BaseSearch';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    replacePart: {
      type: Object,
      default: () => null,
    },
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
      // EditTable 必须传 defaultNewRow 才会显示内置操作列（含删除按钮）
      defaultNewRow: { replacePartId: '', replacePartCode: '', replacePartName: '' },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {},
      columns: [
        { field: 'prevPartCode', title: '替换前零件', width: '33%' },
        { field: 'replacePartCode', title: '替换后零件', width: '33%' },
        { field: 'replacePartName', title: '零件名称', width: '33%' },
      ],
      part: '',
      curPart: null,
    };
  },
  watch: {
    replacePart: {
      handler () { this.current = 1; this.getDetailPageApi(); },
      immediate: true,
    },
  },
  mounted () {
    this.getDetailPageApi();
  },
  methods: {
    getDetailPageApi () {
      if (!this.replacePart || !this.replacePart.id) return;
      whitelistReplacePage({
        whitelistId: this.replacePart.id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        const records = res?.records || [];
        this.tableData = records.map((item) => ({
          ...item,
          prevPartCode: this.replacePart.partCode,
        }));
        this.total = res?.total || 0;
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
    // 选中后作为待保存行加入表格（不直接调接口，统一走每行的保存按钮）
    handlePartChange (val, record) {
      this.curPart = record;
      this.handleAddRow();
    },
    handleAddRow () {
      if (!this.part) {
        this.$message.error('请选择替换件');
        return;
      }
      if (!this.replacePart || !this.replacePart.id) {
        this.$message.error('主白名单缺失');
        return;
      }
      const partId = this.part;
      const cur = this.curPart;
      this.part = '';

      const newItem = {
        prevPartCode: this.replacePart.partCode,
        replacePartId: partId,
        replacePartCode: cur.partCode,
        replacePartName: cur.partName,
      };
      this.$refs.editTable.addRow(newItem);
    },
    // 行保存：每行一个保存按钮，新增/编辑都走这里
    saveRowEdit (row, defer) {
      const payload = {
        whitelistId: this.replacePart.id,
        replacePartId: row.replacePartId,
        replacePartCode: row.replacePartCode,
        replacePartName: row.replacePartName,
        dataSource: 150,
      };
      whitelistReplaceAddOrUpdate(payload).then((id) => {
        if (id && typeof id === 'string') {
          row.id = id;
        }
        defer.resolve(id);
        this.$message.success('保存成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 删除走 edit-table 自带 @remove-row（不再二次确认，避免双弹窗）
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        defer.resolve();
        return;
      }
      whitelistReplaceDelete([row.id]).then(() => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.common-section { margin: 0; }
.common-section-body { padding: 0; }
.common-section-header { display: flex; align-items: center; margin-bottom: 8px; }
// 隐藏编辑按钮：btn-before 插槽在查看模式(v-else分支)渲染，后面紧跟编辑按钮
// 编辑模式(v-if分支)不渲染 btn-before，所以保存/取消按钮不受影响
::v-deep .replace-hide-edit-marker + .btn-edit {
  display: none;
}
</style>
