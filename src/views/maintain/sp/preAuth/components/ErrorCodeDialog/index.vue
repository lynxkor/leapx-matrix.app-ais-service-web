<template>
  <el-dialog
    title="错误代码维护"
    :visible.sync="dialogVisible"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="error-code-dialog" v-loading="loading">
      <div class="dialog-actions">
        <el-button size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      </div>
      <vxe-table
        ref="tableRef"
        stripe
        :data="tableData"
        show-overflow
        resizable
        border="inner"
        size="medium"
        min-height="0"
        max-height="500px"
      >
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
            <el-switch v-else v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </vxe-column>
        <vxe-column title="操作" width="180">
          <template #default="{ row }">
            <template v-if="row.editing">
              <span class="btn" @click="handleSave(row)">保存</span>
              <span class="btn" @click="handleCancel(row)">取消</span>
            </template>
            <template v-else>
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
      <div class="pagination-container">
        <el-pagination
          :current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getErrorCodeList, addErrorCode, updateErrorCode, deleteErrorCode, enableErrorCode } from '@/api/maintain/sp/preAuth/errorCode';

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
      loading: false,
      tableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editingRow: null
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
      this.dialogVisible = false;
      this.$emit('update:visible', false);
    },
    async getData () {
      try {
        this.loading = true;
        const params = {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        };
        const res = await getErrorCodeList(params);
        this.tableData = (res.records || []).map(item => ({
          ...item,
          editing: false
        }));
        this.pagination.total = res.total || 0;
      } catch (error) {
        console.error('获取错误代码列表失败:', error);
        this.$message.error('获取错误代码列表失败');
      } finally {
        this.loading = false;
      }
    },
    handleAdd () {
      if (this.editingRow) {
        this.$message.warning('请先保存当前编辑的内容');
        return;
      }
      const newRow = {
        code: '',
        content: '',
        status: 1,
        editing: true,
        isNew: true
      };
      this.tableData.unshift(newRow);
      this.editingRow = newRow;
    },
    handleEdit (row) {
      if (this.editingRow) {
        this.$message.warning('请先保存当前编辑的内容');
        return;
      }
      row._originalData = { ...row };
      this.$set(row, 'editing', true);
      this.editingRow = row;
    },
    async handleSave (row) {
      if (!row.code) {
        this.$message.warning('请输入错误代码');
        return;
      }
      if (!row.content) {
        this.$message.warning('请输入错误内容');
        return;
      }
      try {
        this.loading = true;
        const params = {
          code: row.code,
          content: row.content,
          status: row.status
        };
        if (row.isNew) {
          await addErrorCode(params);
        } else {
          await updateErrorCode({
            id: row.id,
            ...params
          });
        }
        this.$message.success('保存成功');
        this.editingRow = null;
        await this.getData();
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      } finally {
        this.loading = false;
      }
    },
    handleCancel (row) {
      const index = this.tableData.findIndex(item => item === row);
      if (index > -1) {
        if (row.isNew) {
          this.tableData.splice(index, 1);
        } else {
          Object.assign(row, row._originalData);
          delete row._originalData;
          this.$set(row, 'editing', false);
        }
      }
      this.editingRow = null;
    },
    async handleDelete (row) {
      try {
        this.loading = true;
        await deleteErrorCode([row.id]);
        this.$message.success('删除成功');
        await this.getData();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      } finally {
        this.loading = false;
      }
    },
    async handleStatusChange (row) {
      try {
        this.loading = true;
        await enableErrorCode({
          id: row.id,
          status: row.status
        });
        this.$message.success('状态更新成功');
      } catch (error) {
        console.error('状态更新失败:', error);
        this.$message.error('状态更新失败');
        row.status = row.status === 1 ? 0 : 1;
      } finally {
        this.loading = false;
      }
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val;
      this.pagination.pageNum = 1;
      this.getData();
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.error-code-dialog {
  .dialog-actions {
    margin-bottom: 20px;
  }
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
.btn {
  margin-right: 10px;
  color: var(--leap-color-link);
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.btn-delete {
  color: var(--leap-color-danger, #f56c6c);
}
</style>
