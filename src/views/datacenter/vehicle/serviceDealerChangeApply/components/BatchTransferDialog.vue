<template>
  <el-dialog
    title="批量转移"
    width="520px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="130px" class="form-edit" >
            <el-form-item class="form-item-full" label="转移前门店编码：" prop="beforeDealerCode">
              <fetch-select
                :remote-method="getDealerList"
                remote
                v-model="form.beforeDealerCode"
                placeholder="请输入门店编码或名称"
                labelKey="orgCode"
                valueKey="orgCode"
                subLabelKey="orgName"
                clearable
                filterable
                @change="handleBeforeDealerChange"
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="转移前门店名称：" prop="beforeDealerName">
              <el-input
                v-model="form.beforeDealerName"
                disabled
                clearable
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="申请原因：" prop="applyReason">
              <base-input
                type="textarea"
                placeholder="请输入申请原因"
                v-model="form.applyReason"
                clearable
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="转移后门店编码：" prop="afterDealerCode">
              <fetch-select
                :remote-method="getDealerList"
                remote
                v-model="form.afterDealerCode"
                placeholder="请输入门店编码或名称"
                labelKey="orgCode"
                valueKey="orgCode"
                subLabelKey="orgName"
                clearable
                filterable
                @change="handleAfterDealerChange"
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="转移后门店名称：" prop="afterDealerName">
              <el-input
                v-model="form.afterDealerName"
                disabled
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
      </section>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import { batchTransfer } from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';
import { listOrgStoreInfo } from '@/api/common';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  beforeDealerCode: '',
  beforeDealerName: '',
  applyReason: '',
  afterDealerCode: '',
  afterDealerName: '',
};

export default {
  name: 'BatchTransferDialog',
  components: {
    BaseInput,
    FetchSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    applyId: {
      type: String,
      required: true
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      dialogVisible: this.visible,
      submitLoading: false,
      rules: {
        beforeDealerCode: [
          { required: true, message: '请选择转移前门店编码', trigger: 'change' }
        ],
        afterDealerCode: [
          { required: true, message: '请选择转移后门店编码', trigger: 'change' }
        ],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (!val) {
        this.onReset();
      }
    },
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.onReset();
    },
    submit () {
      this.$refs.ruleForm?.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.submitLoading = true;
        batchTransfer({
          applyId: this.applyId,
          beforeDealerCode: this.form.beforeDealerCode,
          applyReason: this.form.applyReason,
          afterDealerCode: this.form.afterDealerCode,
        }).then(res => {
          this.close();
          this.$message.success('批量转移成功！');
          this.$emit('success');
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.form = {
        ...defaultForm,
      };
    },
    getDealerList (query) {
      return listOrgStoreInfo({
        name: query,
      });
    },
    handleBeforeDealerChange (val, record) {
      this.form.beforeDealerCode = record?.orgCode || '';
      this.form.beforeDealerName = record?.orgName || '';
    },
    handleAfterDealerChange (val, record) {
      if (record?.orgCode && record.orgCode === this.form.beforeDealerCode) {
        this.$message.warning('转移后的门店和原门店一致，请重新选择');
        this.form.afterDealerCode = '';
        this.form.afterDealerName = '';
        return;
      }
      this.form.afterDealerCode = record?.orgCode || '';
      this.form.afterDealerName = record?.orgName || '';
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
