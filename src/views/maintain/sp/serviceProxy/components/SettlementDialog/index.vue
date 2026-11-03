<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="结算"
    width="680px"
    :before-close="handleClose"
    custom-class="settlement-dialog"
  >
    <el-form size="small" ref="ruleForm" :model="form" :rules="rules" label-width="200px" label-position="right">
      <el-form-item label="离店类型" prop="departureType">
        <el-radio-group v-model="form.departureType">
          <el-radio v-for="item in departureTypeOptions" :key="item.code" :label="item.code">
            {{ item.message }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="客户反馈故障是否全部解决" prop="isProblemResolved" v-if="hasFault">
        <el-radio-group v-model="form.isProblemResolved">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="未解决问题原因" prop="unresolvedReason" v-if="hasFault && !form.isProblemResolved">
        <el-radio-group v-model="form.unresolvedReason" class="multi-line">
          <el-radio v-for="item in unresolvedReasonOptions" :key="item.code" :label="item.code">
            {{ item.message }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" :loading="confirmLoading" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEnum } from '@/api/maintain/sp/restatement/index';

export default {
  name: 'SettlementDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 本次进店是否存在故障（无故障时不展示故障解决情况项）
    hasFault: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      confirmLoading: false,
      departureTypeOptions: [],
      unresolvedReasonOptions: [],
      form: {
        departureType: '10',
        isProblemResolved: true,
        unresolvedReason: ''
      },
      rules: {
        departureType: [
          { required: true, message: '请选择离店类型', trigger: 'change' }
        ],
        isProblemResolved: [
          { required: true, message: '请选择客户反馈故障是否全部解决', trigger: 'change' }
        ],
        unresolvedReason: [
          {
            validator: (_rule, value, callback) => {
              if (!this.form.isProblemResolved) {
                if (!value) {
                  callback(new Error('请选择未解决问题原因'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ]
      }
    };
  },
  mounted () {
    this.loadEnumData();
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    dialogVisible (val) {
      this.$emit('update:visible', val);
      if (val) {
        this.resetForm();
      } else {
        this.confirmLoading = false;
      }
    },
    'form.isProblemResolved' (val) {
      if (val) {
        this.form.unresolvedReason = '';
        this.$refs.ruleForm.clearValidate('unresolvedReason');
      }
    }
  },
  methods: {
    async loadEnumData () {
      try {
        const [departureRes, reasonRes] = await Promise.all([
          this.fetchOptions('DepartureTypeEnum'),
          this.fetchOptions('UnresolvedIssueReasonEnum')
        ]);
        this.departureTypeOptions = departureRes || [];
        this.unresolvedReasonOptions = reasonRes || [];
      } catch (error) {
        console.error('加载枚举数据失败:', error);
      }
    },
    handleClose () {
      this.dialogVisible = false;
    },
    async fetchOptions (enumCode) {
      if (enumCode) {
        return getEnum(enumCode);
      }
      return [];
    },
    handleConfirm () {
      if (this.confirmLoading) return;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          this.$emit('confirm', {
            departureType: this.form.departureType,
            faultSolve: this.form.isProblemResolved,
            reason: this.form.unresolvedReason
          });
          this.dialogVisible = false;
        }
      });
    },
    resetForm () {
      this.form = {
        departureType: '10',
        isProblemResolved: true,
        unresolvedReason: ''
      };
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.multi-line {
  padding: 8px 0;
  .el-radio {
    margin: 0 16px 16px 0;
  }
}
</style>
