<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>电池更换信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
        <el-form-item label="电池去向单位：" prop="batteryUnitId">
          <fetch-select
            v-model="form.batteryUnitId"
            :remote-method="searchBatteryUnit"
            value-key="id"
            label-key="name"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请选择电池去向单位"
            @change="handleBatteryUnitChange"
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
        <el-form-item label="电池去向单位：" prop="targetUnitName">
          {{ form.targetUnitName }}
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
import { getListData } from '@/api/maintain/basic/batteryUnit/index';

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
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              resolve(this.form);
            }
          });
        } else {
          resolve(this.form);
        }
      });
    },
    clearValidate () {
      this.$refs.ruleForm.clearValidate();
    },
    // 搜索电池去向单位
    async searchBatteryUnit (query) {
      try {
        const res = await getListData({ name: query });
        return res || [];
      } catch (error) {
        console.error('搜索电池去向单位失败', error);
        return [];
      }
    },
    handleBatteryUnitChange (val, record) {
      if (record) {
        this.form.targetUnitCode = record.code;
        this.form.targetUnitName = record.name;
      }
    }
  }
};

</script>
