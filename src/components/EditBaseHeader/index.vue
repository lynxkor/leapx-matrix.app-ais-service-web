<script>
/**
 * @author wangjinqing
 * @description 通用详情页标题组件，提供编辑/查看状态的切换和操作按钮
 *
 * 组件根据 isEditing 状态显示不同的操作按钮：
 * - 编辑状态：显示取消、返回、刷新、保存、保存&关闭按钮
 * - 查看状态：显示编辑按钮
 *
 * 用户交互方法统一前缀：使用 handle 前缀表示用户触发的操作
 *
 * @param {String} title - 详情页标题文本
 * @param {Boolean} isEditing - 是否为编辑状态，控制按钮组的显示，默认 false
 * @param {Boolean} showBackBtn - 是否显示取消按钮，默认 true
 * @param {Boolean} loading - 加载状态，控制保存按钮的加载动画
 * @param {String} backText - 返回按钮文本，默认 '返回'
 * @param {String} saveText - 保存按钮文本，默认 '保存'
 * @param {String} saveAndCloseText - 保存并关闭按钮文本，默认 '保存&关闭'
 * @param {String} refreshText - 刷新按钮文本，默认 '刷新'
 *
 * @event edit - 点击编辑按钮时触发
 * @event cancel - 点击取消按钮时触发
 * @event submit - 点击保存或保存&关闭按钮时触发
 * @event refresh - 点击刷新按钮时触发
 *
 * @method handleCancel - 处理取消操作，触发 cancel 事件
 * @method handleBack - 处理返回操作，从编辑页返回到详情页
 * @method handleEdit - 处理编辑操作，触发 edit 事件
 * @method handleSave - 保存操作，触发 submit 事件
 * @method handleSaveAndClose - 保存并关闭操作，触发 submit 事件并传递延迟对象
 */
</script>
<template>
  <section class="common-title px-5">
    <h2>{{title}}</h2>
    <slot name="header">
      <div v-if="isEditing">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button v-if="showBackBtn" size="small" @click="handleBack">{{backText}}</el-button>
        <el-button size="small" type="primary" @click="$emit('refresh')">{{refreshText}}</el-button>
        <el-button size="small" type="primary" @click="handleSave" :loading="loading">{{saveText}}</el-button>
        <el-button size="small" type="primary" @click="handleSaveAndClose" :loading="loading">{{ saveAndCloseText }}</el-button>
      </div>
      <div v-else>
        <el-button size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </div>
    </slot>
  </section>
</template>
<script>

import { getRouterPath } from '@/router';

export default {
  props: {
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
    /** */
    loading: {
      type: Boolean,
    },
    /**
     * 返回按钮文本
     */
    backText: {
      type: String,
      default: '返回'
    },
    /**
     * 是否显示取消按钮，默认 true
     */
    showBackBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 保存按钮文本
     */
    saveText: {
      type: String,
      default: '保存'
    },
    /**
     * 保存并关闭按钮文本
     */
    saveAndCloseText: {
      type: String,
      default: '保存&关闭'
    },
    /**
     * 刷新按钮文本
     */
    refreshText: {
      type: String,
      default: '刷新'
    },
  },
  data () {
    return {
    };
  },
  mounted () {
  },
  methods: {
    handleCancel () {
      this.$emit('cancel');
    },
    handleBack () {
      const path = getRouterPath();
      const str = '/edit';
      // 在编辑页中进行操作
      if (path.endsWith(str)) {
        const suffixRegex = new RegExp(`${str}$`);
        const _path = path.replace(suffixRegex, '');
        this.$router.push(_path);
      } else {
        // 在列表页进行操作
      }
    },
    handleEdit () {
      this.$emit('edit');
    },
    handleSave () {
      this.$emit('submit');
    },
    handleSaveAndClose () {
      this.$emit('submit', this.handleBack);
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
