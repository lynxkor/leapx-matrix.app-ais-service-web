<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>电池更换信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
        <el-form-item label="电池去向单位：" prop="batteryUnitId">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.businessType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="去向单位统一代码：" prop="targetUnitCode">
          <el-input
            placeholder="请输入"
            v-model="form.targetUnitCode"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="更换前编号：" prop="beforeChangeCode">
          <el-input
            placeholder="请输入"
            v-model="form.beforeChangeCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="更换后编号：" prop="afterChangeCode">
          <el-input
            placeholder="请输入"
            v-model="form.afterChangeCode"
            clearable
          />
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="form-detail" v-else>
        <el-form-item label="电池去向单位：" prop="batteryUnitId">
          {{ form.batteryUnitId }}
        </el-form-item>
        <el-form-item label="去向单位统一代码：" prop="targetUnitCode">
          {{ form.targetUnitCode }}
        </el-form-item>
        <el-form-item label="更换前编号：" prop="beforeChangeCode">
          {{ form.beforeChangeCode }}
        </el-form-item>
        <el-form-item label="更换后编号：" prop="afterChangeCode">
          {{ form.afterChangeCode }}
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    _id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    FetchSelect
  },
  watch: {
    formData: {
      handler (val) {
        if (val) {
          this.form = val;
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      form: {}
    };
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getFormData () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve(this.form);
          }
        });
      });
    },
    clearValidate () {
      this.$refs.ruleForm.clearValidate();
    }
  }
};

</script>
