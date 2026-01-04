
<template>
  <el-footer height="60px">
    <el-button size="small" @click="handleCancel">返回</el-button>
    <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="save" :loading="submitLoading">保存</el-button>
    <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="saveAndClose" :loading="submitLoading">保存&关闭</el-button>
    <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="saveAndNext" :loading="submitLoading">保存&再建一个</el-button>
  </el-footer>
</template>
<script>
import { createDefer } from '@/libs/utils/defer';
import { getRouterPath } from '@/router';

export default {
  props: {
    /**
     * 详情页id
     */
    id: {
      type: String,
    },
    /**
     * 编辑权限 必须传递
     */
    canAddOrUpdate: {
      type: Boolean,
      required: true,
    },
    submitLoading: {
      type: Boolean,
    }
  },
  methods: {
    handleCancel () {
      this.$router.back();
    },
    submitForm (params = {}) {
      const defer = createDefer();
      defer.promise.then(id => {
        if (params?.close) {
          this.handleCancel();
        } else if (params?.next) {
          this.$emit('reset');
        } else {
          const path = getRouterPath();
          this.$router.push({
            path,
            query: {
              id,
            }
          });
        }
      });
      this.$emit('submit', defer);
    },
    save () {
      this.submitForm();
    },
    saveAndClose () {
      this.submitForm({ close: true });
    },
    saveAndNext () {
      this.submitForm({ next: true });
    }
  }
};
</script>
