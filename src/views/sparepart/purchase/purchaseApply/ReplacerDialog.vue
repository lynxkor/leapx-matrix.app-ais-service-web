<template>
  <el-dialog class="m-start-work-dialog" title="可采购替换件" width="800px" :visible.sync="dialogVisible" append-to-body @close="close">
    <div class="table-section">
      <vxe-table ref="workTable" :data="list" stripe show-overflow resizable border="inner" size="medium">
        <vxe-column field="afterPartCode" title="替换后件号" min-width="150" />
        <vxe-column field="afterPartName" title="替换后名称" min-width="180" />
        <vxe-column field="replacementTypeLabel" title="替换类型" min-width="120" />
        <vxe-column field="remark" title="备注" min-width="150" />
      </vxe-table>
    </div>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'ReplacerDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}
</style>
