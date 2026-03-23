<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整 label-width="150px"，使得 label 不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="auto" class="form-edit" v-show="isEditing || !_id">
                <el-form-item class="form-item-line">
                  <span>除当前保修申请单外，创建日期大于等于当前日期- </span>
                  <el-input
                    placeholder="请输入天数"
                    v-model="form.judgeDays"
                    clearable
                    style="width: 150px;"
                  />
                  <span> 的其他保修单，若【VIN】【主因故障零件】等于当前保修申请单且是已提交、审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款的记录数大于</span>
                  <el-input
                    placeholder="请输入次数"
                    v-model="form.judgeTimes"
                    clearable
                    style="width: 150px;"
                  />
                  笔记录则提醒
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入提醒内容"
                    v-model="form.remindContent"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item class="form-item-line" prop="judgeDays">
                  <span>除当前保修申请单外，创建日期大于等于当前日期- </span>
                  <el-input
                    placeholder="请输入天数"
                    v-model="form.judgeDays"
                    clearable
                    style="width: 150px;"
                    disabled
                  />
                  <span> 的其他保修单，若【VIN】【主因故障零件】等于当前保修申请单且是已提交、审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款的记录数大于</span>
                  <el-input
                    placeholder="请输入次数"
                    v-model="form.judgeTimes"
                    clearable
                    style="width: 150px;"
                    disabled
                  />
                  笔记录则提醒
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入提醒内容"
                    v-model="form.remindContent"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/warrantyOrderWarningRule/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  judgeDays: '',
  statusList: [],
  judgeTimes: '',
  remindContent: ''
};

export default {
  name: 'warrantyOrderWarningRuleEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return this.form.ruleName || '保修单预警规则';
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '保修单预警规则',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-warrantyOrderWarningRule',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        judgeDays: [
          { required: true, message: '请输入判定天数', trigger: 'change' }
        ],
        statusList: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        judgeTimes: [
          { required: true, message: '请输入判定次数', trigger: 'change' }
        ],
        remindContent: [
          { required: true, message: '请输入提醒内容', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      if (!this.form.judgeDays) {
        this.$message.error('请输入判定天数');
        return;
      }
      if (!this.form.judgeTimes) {
        this.$message.error('请输入判定次数');
        return;
      }
      if (!this.form.remindContent) {
        this.$message.error('请输入提醒内容');
        return;
      }
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
<style lang="scss" scoped>
.page-common-edit .el-form-item {
  width: auto;
  line-height: 22px;
  ::v-deep .el-form-item__content{
    line-height: 40px;
  }
}
.el-textarea{
  width: auto;
  vertical-align: top;
}
</style>
