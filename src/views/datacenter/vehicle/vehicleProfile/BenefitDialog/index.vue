<template>
  <el-dialog
    class="m-return-dialog"
    title="权益"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="dialog-content">
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
        <vxe-column
          title="序号"
          width="80"
        >
          <template #default="{rowIndex }">
            {{ rowIndex + 1 }}
          </template>
        </vxe-column>
        <vxe-column field="rightsCode" title="权益编号"></vxe-column>
        <vxe-column field="rightsName" title="权益名称"></vxe-column>
        <vxe-column field="rightsRuleDesc" title="权益规则说明"></vxe-column>
        <template #empty>
          <div class="m-vxe-table-empty-text">
            暂无数据
          </div>
        </template>
      </vxe-table>
    </div>
  </el-dialog>
</template>

<script>
import { rightsQuery } from '@/api/datacenter/vehicle/vehicleProfile';

export default {
  name: 'ReturnDialog',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      tableData: [],
    };
  },
  computed: {
    _id () {
      return this.id;
    },
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    }
  },
  mounted () {
    this.getDetailPageApi();
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      rightsQuery({
        vehicleProfileId: this._id,
      }).then((res) => {
        this.tableData = res;
      });
    },
    close () {
      this.$emit('update:visible', false);
    },
  }
};
</script>

<style lang="scss" scoped>
.m-return-dialog {
  ::v-deep .el-dialog__body {
    padding: 20px;
    min-height: 400px;
  }

  .form-edit {
    .el-form-item {
      margin-bottom: 18px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
