<template>
  <div class="page-common-edit">
    <section class="common-section px-5">
      <div class="common-section-header">
        <!-- <h2>基础信息</h2> -->
      </div>
      <div class="common-section-body">
        <div style="font-size: 14px; margin-bottom: 8px;">同时满足以下条件的门店，自动生成旧件销毁单</div>
        <el-form :model="form" ref="ruleForm" :rules="rules" class="form-edit">
          <el-form-item label="触发时间：保修申请单审核通过：" prop="warrantyApprovedMonth">
            <el-input v-model="form.warrantyApprovedMonth" autocomplete="off"></el-input>
          </el-form-item>
          <span class="item">个月</span>
          <el-form-item label="满足触发时间的旧件数量达到：" prop="oldPartQuantity">
            <el-input v-model="form.oldPartQuantity" autocomplete="off"></el-input>
          </el-form-item>
          <span class="item">件</span>
          <el-form-item class="form-item-full">
            <el-button size="small" type="primary" :loading="loading" @click="submit">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import { YES_NO_ENUM } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { update, getConfig } from '@/api/claimreturn/oldpart/basic/oldPartDestroyConfig/index.js';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  warrantyApprovedMonth: '',
  oldPartQuantity: '',
};

export default {
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '旧件销毁设置',
      pageType: 'edit',
      moduleKey: 'AISCR-',
      form: {
        ...defaultForm
      },
      yes_no_enum: YES_NO_ENUM,
      rules: {
        warrantyApprovedMonth: [
          { required: true, message: '请输入', trigger: 'change' },
          {
            pattern: /^[0-9]\d*$/,
            message: '必须为整数',
            trigger: 'change'
          },
        ],
        oldPartQuantity: [
          { required: true, message: '请输入', trigger: 'change' },
          {
            pattern: /^[0-9]\d*$/,
            message: '必须为整数',
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
        paramCode: 'oldPartDestroyConfig'
      }).then(res => {
        this.form = res;
      });
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          update({
            warrantyApprovedMonth: Number(this.form.warrantyApprovedMonth),
            oldPartQuantity: Number(this.form.oldPartQuantity),
          }).then(res => {
            this.$message.success('设置成功');
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
.item{
  margin-right: 32px;
  margin-left: 4px;
  line-height: 40px;
}
</style>
