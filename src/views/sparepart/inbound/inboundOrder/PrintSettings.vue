<template>
    <el-dialog class="m-start-work-dialog" title="打印设置" width="500px" :visible.sync="dialogVisible" @close="close">
        <el-form :model="form" ref="ruleForm" label-width="120px" class="common-section-body">
            <el-form-item label="排序">
                <fetch-select size="small" :request="fetchOptions" enumCode="MaintenanceOutboundPrintSortEnum"
                    v-model="form.sortOrder" placeholder="请选择" clearable filterable />
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
import { getMySet, saveMySet } from '@/api/sparepart/inbound/inboundOrder/index';
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
      form: {},
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
      const res = await getMySet();
      this.form = res || {};
    },
    close () {
      this.$emit('close');
    },
    async submit () {
      if (!this.form.sortOrder) {
        this.$message.warning('请选择排序方式');
        return;
      }
      this.submitLoading = true;
      try {
        // 注意：后端 @RequestBody String，这里直接传字符串字面量，不是对象
        await saveMySet(this.form.sortOrder);
        this.$message.success('保存成功');
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
.m-start-work-dialog {}
</style>
