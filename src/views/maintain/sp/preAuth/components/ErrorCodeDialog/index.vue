<template>
  <el-dialog
    title="错误代码维护"
    :visible.sync="dialogVisible"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="error-code-dialog">
      <div class="dialog-actions">
        <el-button size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
        <!-- <el-button size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      </div>
      <vxe-table
        ref="tableRef"
        stripe
        :data="tableData"
        show-overflow
        resizable
        border="inner"
        size="medium"
        min-height="0px"
        max-height="500px"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionChange"
      >
        <!-- <vxe-column type="checkbox" width="50" /> -->
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="code" title="错误代码" min-width="120">
          <template #default="{ row }">
            <el-input v-if="row.editing" v-model="row.code" size="small" placeholder="请输入错误代码" />
            <span v-else>{{ row.code }}</span>
          </template>
        </vxe-column>
        <vxe-column field="content" title="错误内容" min-width="200">
          <template #default="{ row }">
            <el-input v-if="row.editing" v-model="row.content" size="small" placeholder="请输入错误内容" />
            <span v-else>{{ row.content }}</span>
          </template>
        </vxe-column>
        <vxe-column field="status" title="启用状态" width="120">
          <template #default="{ row }">
            <el-select v-if="row.editing" v-model="row.status" size="small" placeholder="请选择">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
            <span v-else>{{ row.status === 1 ? '启用' : '禁用' }}</span>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="200">
          <template #default="{ row, $rowIndex }">
            <template v-if="row.editing">
              <span class="btn" @click="handleSave(row)">保存</span>
              <span class="btn" @click="handleCancel(row)">取消</span>
            </template>
            <template v-else>
              <span class="btn" :disabled="$rowIndex === 0" @click="handleMoveUp(row, $rowIndex)">上移</span>
              <span class="btn" :disabled="$rowIndex === tableData.length - 1" @click="handleMoveDown(row, $rowIndex)">下移</span>
              <span class="btn" @click="handleEdit(row)">编辑</span>
              <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row)" confirm-button-type="danger">
                <span slot="reference" class="btn btn-delete">删除</span>
              </el-popconfirm>
            </template>
          </template>
        </vxe-column>
        <template #empty>
          <div class="m-vxe-table-empty-text">暂无数据</div>
        </template>
      </vxe-table>
    </div>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'ErrorCodeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      selectionList: [],
      editingRow: null // 记录当前编辑的行数据
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:visible', false);
    },
    getData () {
      // Mock数据
      this.tableData = [
        { id: '1', code: 'E001', content: '系统异常，请稍后重试', status: 1, editing: false },
        { id: '2', code: 'E002', content: '参数错误，请检查输入', status: 1, editing: false },
        { id: '3', code: 'E003', content: '网络连接超时', status: 0, editing: false },
        { id: '4', code: 'E004', content: '权限不足，无法操作', status: 1, editing: false }
      ];
    },
    handleSelectionChange ({ records }) {
      this.selectionList = records;
    },
    handleAdd () {
      const newRow = {
        id: Date.now().toString(),
        code: '',
        content: '',
        status: 1,
        editing: true
      };
      this.tableData.push(newRow);
      this.editingRow = newRow;
    },
    handleEdit (row) {
      // 保存原始数据用于取消时恢复
      row._originalData = { ...row };
      this.$set(row, 'editing', true);
      this.editingRow = row;
    },
    handleSave (row) {
      if (!row.code) {
        this.$message.warning('请输入错误代码');
        return;
      }
      if (!row.content) {
        this.$message.warning('请输入错误内容');
        return;
      }
      this.$set(row, 'editing', false);
      this.editingRow = null;
      this.$message.success('保存成功');
    },
    handleCancel (row) {
      if (row._originalData) {
        // 编辑模式取消，恢复原始数据
        Object.assign(row, row._originalData);
        delete row._originalData;
      } else {
        // 新增模式取消，删除该行
        const index = this.tableData.findIndex(item => item.id === row.id);
        if (index > -1) {
          this.tableData.splice(index, 1);
        }
      }
      this.editingRow = null;
    },
    handleDelete (row) {
      const index = this.tableData.findIndex(item => item.id === row.id);
      if (index > -1) {
        this.tableData.splice(index, 1);
        this.$message.success('删除成功');
      }
    },
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id);
      this.tableData = this.tableData.filter(item => !ids.includes(item.id));
      this.selectionList = [];
      this.$message.success('批量删除成功');
    },
    handleMoveUp (row, index) {
      if (index === 0) return;
      const temp = this.tableData[index - 1];
      this.$set(this.tableData, index - 1, row);
      this.$set(this.tableData, index, temp);
    },
    handleMoveDown (row, index) {
      if (index === this.tableData.length - 1) return;
      const temp = this.tableData[index + 1];
      this.$set(this.tableData, index + 1, row);
      this.$set(this.tableData, index, temp);
    }
  }
};
</script>

<style lang="scss" scoped>
.error-code-dialog {
  max-height: 500px;
  overflow-y: auto;
  .dialog-actions{
    margin-bottom: 20px;
  }
}
.btn {
  margin-right: 10px;
  color: var(--leap-color-link);
  cursor: pointer;
}
.btn-delete {
  color: var(--leap-color-danger, #f56c6c);
}
</style>
