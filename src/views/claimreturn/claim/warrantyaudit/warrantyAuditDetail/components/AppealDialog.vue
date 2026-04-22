<template>
  <el-dialog
    title="申诉"
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
      <el-form-item label="申诉说明：" prop="appealDesc" style="width: 100%;">
        <el-input
          type="textarea"
          placeholder="请输入申诉说明"
          v-model="form.appealDesc"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="审计说明：" style="width: 100%;">
        {{form.auditDesc}}
      </el-form-item>
      <el-form-item label="错误代码：" style="width: 100%;">
        {{errorCategoryText}}
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
import { getSupplyMaterial, appeal } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import AisAttachment from './AisAttachment.vue';
import AttachmentList from '@/libs/components/AttachmentList/index.vue';
import { REPAIR_ITEM_TYPES } from '@/libs/utils/repairTypes';
const defaultForm = {
  detailId: '',
  auditDesc: '',
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
    // 错误项 信息
    errorCategoryText () {
      // 1. 安全检查：如果列表为空或不存在，返回空字符串
      if (!this.selectionItem?.errorList || this.selectionItem.errorList.length === 0) {
        return '';
      }
      // 2. 处理数据：
      // 使用 map 遍历，item 是当前项，index 是索引
      // 返回格式为 "1) 内容" 的新数组
      const list = this.selectionItem.errorList.map((item, index) => {
        return `${index + 1}) ${item.errorCategory}`;
      });

      // 3. 拼接字符串：用逗号分隔
      return list.join(', ');
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
        appealDesc: [
          { required: true, message: '请输入申诉说明', trigger: 'blur' }
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
      this.form.auditDesc = this.selectionItem.auditDesc || '';
      this.loading = false;
    },
    handleClose () {
      this.form = { ...defaultForm };
      this.$emit('update:visible', false);
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          appeal({
            detailId: this.form.businessId,
            appealDesc: this.form.appealDesc
          }).then(() => {
            this.$message.success('申诉成功');
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
