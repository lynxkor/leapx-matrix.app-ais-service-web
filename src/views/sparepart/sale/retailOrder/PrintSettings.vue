<template>
    <el-dialog class="m-start-work-dialog" title="打印设置" width="500px" :visible.sync="dialogVisible" @close="close">
        <el-form :model="form" ref="ruleForm" label-width="150px" class="common-section-body">
            <el-form-item label="排序">
                <fetch-select :request="fetchOptions" enumCode="MaintenanceOutboundPrintSortEnum"
                    v-model="form.sortOrder" placeholder="请选择" clearable filterable />
            </el-form-item>
            <el-form-item label="默认打印范围">
                <fetch-select :request="fetchOptions" enumCode="MaintenanceOutboundPrintRangeEnum"
                    v-model="form.defaultPrintRange" placeholder="请选择" clearable filterable />
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <div class="dialog-footer">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
            </div>
      </template>
    </el-dialog>
</template>
<script>
import { getEnum } from '@/api/common';
import { getPrintSettingDetail, printSetting } from '@/api/sparepart/sale/retailOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  components: {
    FetchSelect,
  },
  name: 'PrintSettings',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      form: {
        sortOrder: '',
        defaultPrintRange: '',
      },
      submitLoading: false
    };
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
    async initData () {
      const res = await getPrintSettingDetail();
      this.form = res || {};
    },
    close () {
      this.$emit('update:visible', false);
    },
    async submit () {
      this.submitLoading = true;
      try {
        await printSetting(this.form);
        this.close();
        this.$emit('success');
      } finally {
        this.submitLoading = false;
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>
<style lang="scss" scoped>
.m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
        padding: 8px 12px !important;
    }

    .start-work-content {
        .time-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e8e8e8;

            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }

        .table-section {
            margin-top: 15px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}
</style>
