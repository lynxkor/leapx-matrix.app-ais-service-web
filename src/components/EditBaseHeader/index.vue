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
 * @param {Boolean} showBackBtn - 是否显示返回按钮，默认 true
 * @param {Boolean} showCancelBtn - 是否显示取消按钮，默认 true
 * @param {Boolean} showRefreshBtn - 是否显示刷新按钮，默认 true
 * @param {Boolean} showSaveBtn - 是否显示保存按钮，默认 true
 * @param {Boolean} showSaveAndCloseBtn - 是否显示保存并关闭按钮，默认 true
 * @param {Boolean} showEditBtn - 是否显示编辑按钮，默认 true
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
  <section class="common-title px-5 edit-base-header" ref="headerRef">
    <slot name="header">
      <h2 ref="titleRef" class="left-content">
        <slot name="title">{{ title }}</slot>
      </h2>
      <div :style="{width: buttonGroupWidth}" class="right-content">
        <ButtonGroup>
          <slot name="extraButtons"></slot>
          <template v-if="isEditing && canAddOrUpdate">
            <el-button v-if="showCancelBtn" size="small" @click="handleCancel">{{cancelText}}</el-button>
            <el-button v-if="showBackBtn" size="small" @click="handleBack">{{backText}}</el-button>
            <el-button v-if="showRefreshBtn" size="small" type="primary" @click="$emit('refresh')">{{refreshText}}</el-button>
            <el-button v-if="showSaveBtn" size="small" type="primary" @click="handleSave" :loading="loading">{{saveText}}</el-button>
            <el-button v-if="showSaveAndCloseBtn" size="small" type="primary" @click="handleSaveAndClose" :loading="loading">{{ saveAndCloseText }}</el-button>
          </template>
          <template v-else-if="canAddOrUpdate">
            <el-button v-if="showEditBtn" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>{{editText}}</el-button>
          </template>
        </ButtonGroup>
      </div>
    </slot>
  </section>
</template>
<script>

import { getRouterPath } from '@/router';
import permissions from '@/libs/mixins/permissions';
import ButtonGroup from '@/libs/components/ButtonGroup';

export default {
  components: {
    ButtonGroup,
  },
  props: {
    /**
     * 详情页标题
     */
    title: {
      type: String,
      default: '',
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
      default: false,
    },
    /**
     * 取消按钮文本
     */
    cancelText: {
      type: String,
      default: '取消'
    },
    /**
     * 返回按钮文本
     */
    backText: {
      type: String,
      default: '返回'
    },
    /**
     * 是否显示返回按钮，默认 true
     */
    showBackBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示取消按钮，默认 true
     */
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示刷新按钮，默认 true
     */
    showRefreshBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示保存按钮，默认 true
     */
    showSaveBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示保存并关闭按钮，默认 true
     */
    showSaveAndCloseBtn: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示编辑按钮，默认 true
     */
    showEditBtn: {
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
    /**
     * 编辑按钮文本
     */
    editText: {
      type: String,
      default: '编辑'
    }
  },
  inject: ['moduleKey'],
  mixins: [permissions],
  data () {
    return {
      buttonGroupWidth: undefined,
      buttonGroupKey: 0,
      resizeObserver: null
    };
  },
  watch: {
    isEditing() {
      // 当编辑状态改变时重新计算宽度
      this.$nextTick(() => {
        this.calculateButtonGroupWidth();
      });
    },
    title() {
      // 当标题改变时重新计算宽度
      this.$nextTick(() => {
        this.calculateButtonGroupWidth();
      });
    }
  },
  created () {
    if (!this.moduleKey) {
      console.log(`%c未能获取到moduleKey，按钮权限丢失`, 'color: red; font-weight: bold;');
    }
  },
  mounted() {
    this.calculateButtonGroupWidth();

    // 监听窗口大小变化
    window.addEventListener('resize', this.updateGroupWidth, false);

    // 使用 ResizeObserver 监听元素大小变化
    if (this.$refs.headerRef && this.$refs.titleRef) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateGroupWidth();
      });
      this.resizeObserver.observe(this.$refs.headerRef);
      this.resizeObserver.observe(this.$refs.titleRef);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateGroupWidth);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
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
    },
    updateGroupWidth () {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.calculateButtonGroupWidth();
      }, 100);
    },
    calculateButtonGroupWidth() {
      this.$nextTick(() => {
        if (!this.$refs.headerRef || !this.$refs.titleRef) return;
        const headerWidth = this.$refs.headerRef.offsetWidth;
        const titleWidth = this.$refs.titleRef.offsetWidth;

        // 计算可用宽度：header总宽度减去title宽度，再减去一些边距
        const availableWidth = headerWidth - titleWidth - 40; // 40px是左右padding的值

        if (availableWidth > 0) {
          // 确保最小宽度，防止按钮组过窄
          const minWidth = 200; // 最小200px
          this.buttonGroupWidth = `${Math.max(availableWidth, minWidth)}px`;

          // 强制重新渲染ButtonGroup以确保maxWidth生效
          this.buttonGroupKey += 1;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.px-5{
  padding-left: 20px;
  padding-right: 20px;
}
.edit-base-header{
  .left-content{
    flex: 1;
    display: flex;
    align-items: center;
    text-overflow: inherit;
    overflow: visible;
  }
  .right-content{
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>
