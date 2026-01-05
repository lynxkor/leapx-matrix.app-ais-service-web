
<template>
  <section class="common-title px-5" v-if="id">
    <h2>{{title}}</h2>
    <div v-if="isEditing">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" @click="handleBack">返回</el-button>
      <el-button size="small" type="primary" @click="$emit('refresh')">刷新</el-button>
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="save" :loading="submitLoading">保存</el-button>
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="saveAndClose" :loading="submitLoading">保存&关闭</el-button>
    </div>
    <div v-else>
      <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
    </div>
  </section>
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
     * 详情页标题
     */
    title: {
      type: String
    },
    /**
     * 是否为编辑状态
     */
    isEditing: {
      type: Boolean,
      default: false,
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
      this.$emit('cancel');
    },
    handleBack () {
      const path = getRouterPath();
      const str = '/edit';
      const suffixRegex = new RegExp(`${str}$`);
      const _path = path.replace(suffixRegex, '');
      this.$router.push(_path);
    },
    handleEdit () {
      this.$emit('edit');
    },
    save () {
      this.$emit('submit');
    },
    saveAndClose () {
      const defer = createDefer();
      defer.promise.then(() => {
        this.handleBack();
      });
      this.$emit('submit', defer);
    }
  }
};
</script>
<style lang="scss" scoped>
.px-5{
  padding-left: 20px;
  padding-right: 20px;
}
</style>
