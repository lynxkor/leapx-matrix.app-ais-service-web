<script>
/**
 * 编辑页容器组件，支持表单自动验证，多表单验证，取消编辑，返回上一页，刷新，保存&关闭、保存&再建一个
 * @author wangjinqing
 * @description 基于
 *
 * @param {String} id - 详情页id
 * @param {String} title - 详情页标题
 * @param {Boolean} isEditing - 是否为编辑状态
 * @param {Boolean} canAddOrUpdate - 编辑权限
 *
 * @event edit - 切换编辑态时触发，没有参数
 * @event cancel - 取消编辑时触发，没有参数
 * @event refresh - 刷新操作时触发，没有参数
 * @event submit - 保存全部数据时触发，保存时没有参数，保存&关闭、保存&再建一个时参数为 defer
 * @event reset - 重置表格时触发
 *
 * @method registerForm - 注册表单引用
 * @method reset - 重置表单
 * @method submit - 提交表单时自动验证
 * @method handleBack - 返回上一页
 *
 *
 * // 使用案例可以查看文件 views/claimreturn/claim/basic/techServiceActivity/edit.vue
 * // 页面访问 http://localhost:7779/service/claimreturn/claim/basic/techServiceActivity
 * @example
 * 编辑页容器
  <edit-base-container
    :id="_id"
    :title="`活动编码：${form.activityCode}`"
    :isEditing="isEditing"
    :submitLoading="submitLoading"
    :canAddOrUpdate="canAddOrUpdate"
    @submit="submitForm"
    @edit="baseMixinEdit"
    @cancel="baseMixinCancel"
    @refresh="baseMixinRefresh"
    @reset="baseMixinReset"
  >
    <template #default="{formApi}">
      <el-form v-form-register="formApi" :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px"  class="form-edit" v-show="isEditing || !_id">
        ...
      </el-form>
    </template>
  </edit-base-container>
 */
</script>
<template>
  <el-container direction="vertical">
    <edit-base-header
      :id="id"
      :title="title"
      :isEditing="isEditing"
      :canAddOrUpdate="canAddOrUpdate"
      :submitLoading="submitLoading"
      @edit="$emit('edit')"
      @cancel="$emit('cancel', formRefs)"
      @refresh="$emit('refresh')"
      @submit="submit"
    />
    <!-- 使用作用域插槽 -->
    <slot :formApi="formApi"></slot>
    <edit-base-footer
      v-if="!id"
      :id="id"
      :canAddOrUpdate="canAddOrUpdate"
      :submitLoading="submitLoading"
      @cancel="handleBack"
      @reset="reset"
      @submit="submit"
    />
  </el-container>
</template>
<script>
import EditBaseHeader from '@/components/EditBaseHeader';
import EditBaseFooter from '@/components/EditBaseFooter';

export default {
  components: {
    EditBaseHeader,
    EditBaseFooter,
  },
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
    },
  },
  data () {
    return {
      // 存储表单引用
      formRefs: [],
    };
  },
  computed: {
    // 提供给插槽的API
    formApi () {
      return {
        // 注册表单
        registerForm: this.registerForm,
      };
    }
  },
  mounted () {

  },
  methods: {
    registerForm (formRef) {
      if (!this.formRefs.includes(formRef)) {
        this.formRefs.push(formRef);
      }
    },
    handleBack () {
      this.$router.back();
    },
    async submit (defer) {
      for (let formRef of this.formRefs) {
        await formRef.validate();
      }
      this.$emit('submit', defer);
    },
    reset () {
      for (let formRef of this.formRefs) {
        formRef.resetFields();
      }
      this.$emit('reset');
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
