<template>
  <el-dialog class="m-cancel-rights-lock-dialog" title="取消权益锁定" width="800px" :visible.sync="dialogVisible" @close="close"
    @closed="closed">
    <div class="cancel-rights-lock-content">
      <!-- 数据表格 -->
      <div class="table-section">
        <vxe-table ref="rightsTable" :data="tableData" stripe :row-config="{ isHover: true }" resizable max-height="400"
          border="inner" size="medium" :checkbox-config="{ checkField: 'checked' }">
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column field="useId" title="权益ID" min-width="150" show-overflow="tooltip" />
          <vxe-column field="rightsName" title="权益名称" min-width="150" show-overflow="tooltip" />
          <vxe-column field="applicableMaintenanceType" title="适用维修类型" min-width="150" />
          <vxe-column field="rightsUseStateLabel" title="权益状态" min-width="120" align="center" />
          <template #empty>
            <div class="m-vxe-table-empty-text">暂无数据</div>
          </template>
        </vxe-table>
      </div>
    </div>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" :loading="submitLoading" :disabled="!hasSelectedItems" type="primary"
          @click="confirmSubmit">取消权益锁定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { rightsUnlock } from '@/api/maintain/sp/serviceStatement/index';

export default {
  name: 'CancelRightsLockDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      tableData: [],
    };
  },
  computed: {
    // 是否有选中的权益券
    hasSelectedItems () {
      return this.tableData.some(row => row.checked);
    },
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
  },
  methods: {
    // 从结算单已锁定的权益记录取数
    initData () {
      this.tableData = (this.formData.rightsUsageRecordResps || []).map(item => ({
        ...item,
        checked: false,
      }));
    },
    confirmSubmit () {
      const selectedRows = this.tableData.filter(row => row.checked);
      if (selectedRows.length === 0) {
        this.$message.warning('请选择要解锁的权益');
        return;
      }
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>是否要取消锁定权益？</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        this.submit(selectedRows);
      }).catch(() => {
      });
    },
    // 提交取消权益锁定
    async submit (selectedRows) {
      try {
        this.submitLoading = true;
        await rightsUnlock(selectedRows);
        this.$message.success('取消权益锁定成功');
        this.$emit('refresh');
        this.close();
      } catch (error) {
        console.error('取消权益锁定异常:', error);
      } finally {
        this.submitLoading = false;
      }
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.tableData = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.m-cancel-rights-lock-dialog {
  .table-section {
    margin-top: 15px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .m-vxe-table-empty-text {
    text-align: left;
  }
}
</style>
