<template>
  <el-dialog
    title="补充材料"
    :visible.sync="dialogVisible"
    width="60%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" inline :rules="rules" ref="ruleForm" label-width="150px" :loading="loading">
      <el-form-item label="保修申请单：">
        {{form.warrantyApplyCode}}
      </el-form-item>
      <el-form-item label="vin：">
        {{form.vin}}
      </el-form-item>
      <el-form-item label="审批通过时间：">
        {{form.approvalTime}}
      </el-form-item>
      <el-form-item label="材料补充说明：" prop="materialDesc" style="width: 100%;">
        <el-input
          type="textarea"
          placeholder="请输入材料补充说明"
          v-model="form.materialDesc"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="补充材料" name="first">
        <AttachmentList
          :business-id="form.businessId"
          :config-code="configCode"
          type="card"
        />
      </el-tab-pane>
      <el-tab-pane label="原保修材料" name="second">
        <AisAttachment :businessId="form.id" />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSupplyMaterial, supplyMaterial } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import AisAttachment from './AisAttachment.vue';
import AttachmentList from '@/libs/components/AttachmentList/index.vue';
import { REPAIR_ITEM_TYPES } from '@/libs/utils/repairTypes';
const defaultForm = {
  detailId: '',
  materialDesc: '',
  warrantyApplyCode: '',
  vin: '',
  approvalTime: '',
};

export default {
  name: 'SupplyMaterialDialog',
  components: {
    AisAttachment,
    AttachmentList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionItem: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    configCode () {
      const item = this.repairItemTypeArr.find(i => i.id === this.selectionItem.repairItemTypeId);
      return item ? item.code : '';
    },
  },
  data () {
    return {

      form: { ...defaultForm },
      dialogVisible: false,
      submitLoading: false,
      loading: false,
      activeName: 'first',
      rules: {
        materialDesc: [
          { required: true, message: '请输入材料补充说明', trigger: 'blur' }
        ],
      },
      uploadConfig: {
        acceptSuffix: '.png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.xls,.xlsx',
        maxSize: 10, // 10MB
        maxNum: 5,
        required: '0'
      },
      repairItemTypeArr: REPAIR_ITEM_TYPES
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    async getData () {
      this.loading = true;
      const res = await getSupplyMaterial(this.selectionItem.warrantyApplyId); // 申请单请求
      this.form = res || {};
      this.form.warrantyApplyCode = this.selectionItem.warrantyApplyCode; // 保修材料单id
      this.form.businessId = this.selectionItem.id; // 补充材料id
      this.loading = false;
    },
    handleClose () {
      this.$emit('update:visible', false);
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          supplyMaterial({
            detailId: this.form.businessId,
            materialDesc: this.form.materialDesc
          }).then(() => {
            this.$message.success('补充材料成功');
            this.handleClose();
            this.$emit('success');
          }).catch(() => {
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
