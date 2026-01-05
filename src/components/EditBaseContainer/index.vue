<script>
/**
 * 编辑页容器组件，支持表单自动验证，多表单验证，取消编辑，返回上一页，刷新，保存&关闭、保存&再建一个
 * @author wangjinqing
 * @description 基于
 *
 * @param {String} id - 详情页id
 * @param {String} title - 详情页标题
 * @param {Boolean} isEditing - 是否为编辑状态
 * @param {Function} submitRequest 保存接口
 * @param {Function} detailRequest 详情接口
 *
 * @event submit - 没有传递submitRequest时，会触发submit提交
 *
 * 用户交互方法统一前缀：使用 handle 前缀表示用户触发的操作
 * @method handleSubmit
 * @method handleCancel
 * @method handleReset
 * @method handleRefresh
 * @method handleEdit
 *
 * @method registerForm - (内部注册方法)
 * @method updateForm - (内部更新方法)
 * @method updateIsEditing - (内部状态更新方法)
 * @method cancelEdit - (内部业务逻辑方法)
 * @method resetToOriginal - (内部业务逻辑方法)
 * @method resetToDefault - (内部业务逻辑方法)
 *
 *
 * 使用案例可以查看文件 views/claimreturn/claim/basic/techServiceActivity/edit.vue
 * 页面访问 http://localhost:7779/service/claimreturn/claim/basic/techServiceActivity/edit
 *
 * @example
 * 编辑页容器
  <edit-base-container
    :id="_id"
    :title="`活动编码：${form.activityCode}`"
    :isEditing.sync="isEditing"
    :form.sync="form"
    :originalForm="originalForm"
    :defaultForm="defaultForm"
    :submitRequest="submitRequest"
    :detailRequest="getDetailData"
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
      v-bind="$attrs"
      :id="id"
      :title="title"
      :isEditing="isEditing"
      :loading="loading"
      @edit="handleEdit"
      @cancel="handleCancel"
      @refresh="handleRefresh"
      @submit="handleSubmit"
    >
      <!-- 使用具名插槽传递 header -->
      <template v-if="$slots.header" #header>
        <slot name="header"></slot>
      </template>
    </edit-base-header>
    <!-- 使用作用域插槽 -->
    <slot :formApi="formApi"></slot>
    <edit-base-footer
      v-if="!id"
      v-bind="$attrs"
      :id="id"
      :loading="loading"
      @cancel="handleBack"
      @reset="handleReset"
      @submit="handleSubmit"
    >
      <!-- 使用具名插槽传递 footer -->
      <template v-if="$slots.footer" #footer>
        <slot name="footer"></slot>
      </template>
    </edit-base-footer>
  </el-container>
</template>
<script>
import EditBaseHeader from '@/components/EditBaseHeader';
import EditBaseFooter from '@/components/EditBaseFooter';

export default {
  name: 'EditBaseContainer',
  inheritAttrs: false,
  components: {
    EditBaseHeader,
    EditBaseFooter,
  },
  props: {
    /**
     * 表单数据
     */
    form: Object,
    /**
     * 表单详情数据
     */
    originalForm: Object,
    /**
     * 表单默认初始数据
     */
    defaultForm: Object,
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
     * 保存提交接口
     */
    submitRequest: {
      type: Function,
      default: null,
    },
    /**
     * 获取详情接口
     */
    detailRequest: {
      type: Function,
      default: null,
    },
  },
  data () {
    return {
      // 存储表单引用
      formRefs: [],
      loading: false,
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
    // 表单注册
    registerForm (formRef) {
      if (!this.formRefs.includes(formRef)) {
        this.formRefs.push(formRef);
      }
    },
    handleBack () {
      this.$router.back();
    },
    // 保存操作
    async handleSubmit (defer) {
      for (let formRef of this.formRefs) {
        await formRef.validate();
      }
      if (this.submitRequest) {
        this.loading = true;
        const promise = this.submitRequest?.();
        if (promise instanceof Promise) {
          promise.then((res) => {
            // 新建保存时需要用到这个id
            let id;
            if (typeof res === 'string') {
              id = res;
            }

            // 编辑时必须调用
            if (this.id) {
              if (defer) { // 保存并关闭，回到列表页
                defer.resolve();
              } else if (this.detailRequest) {
                this.detailRequest?.(); // 普通保存重新获取数据（留在当页）
              }
            } else if (defer) {
              // 新建时必须调用
              defer.resolve(id);
            }
            this.showSuccessMessage();
          }).finally(() => {
            this.loading = false;
          })
        } else {
          this.loading = false;
        }
      } else {
        function success(id) {
          defer.resolve(id);
        }
        this.$emit('submit', success);
      }
    },
    // 新建时，再建一个
    handleReset () {
      for (let formRef of this.formRefs) {
        formRef.resetFields();
      }
      this.resetToDefault();
    },
    // 编辑时，取消操作
    handleCancel () {
      // 清除验证
      for (let formRef of this.formRefs) {
        formRef.clearValidate();
      }
      this.cancelEdit();
    },
    handleRefresh () {
      this.resetToOriginal();
    },
    updateForm (newForm) {
      this.$emit('update:form', newForm);
    },
    handleEdit () {
      this.updateIsEditing(true);
    },
    updateIsEditing (val) {
      this.$emit('update:isEditing', val);
    },
    // 编辑，点击取消按钮
    cancelEdit () {
      this.updateIsEditing(false);
      this.resetToOriginal();
    },
    // 编辑，操作刷新时需要恢复操作前状态
    resetToOriginal () {
      this.updateForm(JSON.parse(JSON.stringify(this.originalForm)));
    },
    // 保存&再建一个 操作成功后需要初始化
    resetToDefault () {
      this.updateForm(JSON.parse(JSON.stringify(this.defaultForm)));
    },
    // 显示成功消息
    showSuccessMessage () {
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    },
  }
};
</script>
<style lang="scss" scoped>

</style>
