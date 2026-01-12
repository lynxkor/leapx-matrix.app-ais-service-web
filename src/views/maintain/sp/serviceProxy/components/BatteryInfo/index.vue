<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>电池更换信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
        <el-form-item label="电池去向单位：" prop="batteryUnitId">
          <el-input
            placeholder="请输入"
            v-model="form.batteryUnitId"
            clearable
          />
        </el-form-item>
        <el-form-item label="去向单位统一代码：" prop="targetUnitCode">
          <el-input
            placeholder="请输入"
            v-model="form.targetUnitCode"
            clearable
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
  },
  watch: {
    formData: {
      handler (val) {
        if (val) {
          this.form = val;
        }
      }
    }
  },
  data () {
    return {
      form: {}
    };
  }
};

</script>
