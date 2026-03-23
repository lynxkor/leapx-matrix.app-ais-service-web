<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="结算"
    width="600px"
    :before-close="handleClose"
    custom-class="settlement-dialog"
  >
    <el-form size="small" ref="ruleForm" :model="form" :rules="rules" label-width="200px" label-position="right">
      <el-form-item label="客户反馈故障是否全部解决" prop="isProblemResolved">
        <el-radio-group v-model="form.isProblemResolved">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="未解决问题原因" prop="unresolvedReason">
        <fetch-select
          :request="fetchOptions"
          enumCode="UnresolvedIssueReasonEnum"
          v-model="form.unresolvedReason"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEnum } from '@/api/maintain/sp/restatement/index';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  name: 'SettlementDialog',
  components: {
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        isProblemResolved: true,
        unresolvedReason: ''
      },
      rules: {
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
    // 组件挂载时立即加载枚举数据
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
    // 加载枚举数据
    async loadEnumData () {
      try {
        const response = await this.fetchOptions('UnresolvedIssueReasonEnum');
        console.log('接口返回的原始数据:', response);

        // 处理返回数据，确保是正确的格式
        let enumData = response;
        if (response && response.data) {
          enumData = response.data;
        } else if (response && response.records) {
          enumData = response.records;
        }

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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('confirm', {
            faultSolve: this.form.isProblemResolved,
            reason: this.form.unresolvedReason
          });

          this.dialogVisible = false;
        }
      });
    },
    resetForm () {
      this.form = {
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
</style>
