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

      <el-form-item label="未解决问题原因" prop="unresolvedReasons" v-if="!form.isProblemResolved">
        <el-checkbox-group v-model="form.unresolvedReasons">
          <el-checkbox :label="1">厂家无库存备件</el-checkbox>
          <el-checkbox :label="2">厂家备件缺货</el-checkbox>
          <el-checkbox :label="3">故障未复现</el-checkbox>
          <el-checkbox :label="4">无解决方案</el-checkbox>
          <el-checkbox :label="5">用户自费不修车</el-checkbox>
          <el-checkbox :label="6">车辆超保</el-checkbox>
          <el-checkbox :label="7">约定下次进店检查</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SettlementDialog',
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
        unresolvedReasons: []
      },
      rules: {
        isProblemResolved: [
          { required: true, message: '请选择客户反馈故障是否全部解决', trigger: 'change' }
        ],
        unresolvedReasons: [
          {
            validator: (_rule, value, callback) => {
              if (!this.form.isProblemResolved) {
                if (!value || value.length === 0) {
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
        this.form.unresolvedReasons = [];
        this.$refs.ruleForm.clearValidate('unresolvedReasons');
      }
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false;
    },
    handleConfirm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('confirm', {
            isProblemResolved: this.form.isProblemResolved,
            unresolvedReasons: this.form.unresolvedReasons
          });
          this.dialogVisible = false;
        }
      });
    },
    resetForm () {
      this.form = {
        isProblemResolved: true,
        unresolvedReasons: []
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
