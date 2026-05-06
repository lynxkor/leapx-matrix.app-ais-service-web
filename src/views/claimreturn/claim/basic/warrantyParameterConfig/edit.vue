<template>
  <div class="page-common-edit">
    <section class="common-section px-5">
      <div class="common-section-header">
        <!-- <h2>基础信息</h2> -->
      </div>
      <div class="common-section-body">
        <div style="font-size: 14px; margin-bottom: 8px;">基础信息</div>
        <el-form :model="form" ref="ruleForm" :rules="rules" class="form-edit">
          <el-form-item class="form-item-full" label="首次提交：" prop="warrantyApplicationFormSubmissionDaysConfig">
            <span>首次提交保修日期 - 结算单创建日期超过</span>
            <el-input v-model="form.warrantyApplicationFormSubmissionDaysConfig" autocomplete="off" style="width: 100px; display: inline-block;"></el-input>
            <span>天，不允许提报，并提醒：您的结算单创建日期距离当天已经超过{{ form.warrantyApplicationFormSubmissionDaysConfig }}天，不允许提报</span>
          </el-form-item>
          <el-form-item class="form-item-full" label="再次提交：" prop="warrantyReSubmissionDaysConfig">
            <span>再次提交保修日期 - 保修单审批日期超过</span>
            <el-input v-model="form.warrantyReSubmissionDaysConfig" autocomplete="off" style="width: 100px; display: inline-block;"></el-input>
            <span>天，不允许提报，并提醒：您的保修单驳回日期距离当天已经超过{{ form.warrantyReSubmissionDaysConfig }}天，不允许提报</span>
          </el-form-item>
          <el-form-item class="form-item-full">
            <el-button size="small" type="primary" :loading="loading" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { update, getConfig } from '@/api/claimreturn/claim/basic/warrantyParameterConfig/index.js';

const defaultForm = {
  warrantyApplicationFormSubmissionDaysConfig: '',
  warrantyReSubmissionDaysConfig: '',
};

export default {
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '保修参数设置',
      pageType: 'edit',
      moduleKey: 'AISCR-',
      form: {
        ...defaultForm
      },
      rules: {
        warrantyApplicationFormSubmissionDaysConfig: [
          { required: true, message: '请输入', trigger: 'change' },
          {
            pattern: /^[0-9]\d*$/,
            message: '必须为整数',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (value && value.toString().length > 8) {
                callback(new Error('最多输入 8 位数字'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          },
        ],
        warrantyReSubmissionDaysConfig: [
          { required: true, message: '请输入', trigger: 'change' },
          {
            pattern: /^[0-9]\d*$/,
            message: '必须为整数',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              if (value && value.toString().length > 8) {
                callback(new Error('最多输入 8 位数字'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          },
        ],
      },
      loading: false,
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    getData () {
      getConfig({
        paramCode: 'warrantyParameterConfig'
      }).then(res => {
        if (res) {
          this.form = {
            warrantyApplicationFormSubmissionDaysConfig: res.warrantyApplicationFormSubmissionDaysConfig ?? '',
            warrantyReSubmissionDaysConfig: res.warrantyReSubmissionDaysConfig ?? '',
          };
        }
      });
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          update({
            warrantyApplicationFormSubmissionDaysConfig: Number(this.form.warrantyApplicationFormSubmissionDaysConfig),
            warrantyReSubmissionDaysConfig: Number(this.form.warrantyReSubmissionDaysConfig),
          }).then(res => {
            this.$message.success('设置成功');
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.px-5{
  padding-left: 16px;
  padding-right: 16px;
}
</style>
