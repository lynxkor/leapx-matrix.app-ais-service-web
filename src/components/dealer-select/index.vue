<template>
  <el-select :remote="true" v-bind="$attrs" v-model="orgId" filterable placeholder="请输入门店编码/名称" :remote-method="storeSearch" :multiple="multiple" clearable @change="handleChange" collapse-tags>
    <el-option
      v-for="item in options"
      :key="item.orgId"
      :label="item.orgName"
      style="height: 50px"
      :value="item.orgCode">
      <div class="org_name">{{ item.orgName }}</div>
      <div class="org_code">{{ item.orgCode }}</div>
    </el-option>
  </el-select>
</template>
<script>
/**
 * 门店选择组件
 */
import { listOrgStoreInfo } from '@/api/common';

export default {
  name: 'DealerSelect',
  props: {
    value: {
      type: [String, Array, Number],
      default: null
    },
    params: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    defaultDealerName: {
      type: String,
      default: null
    },
  },
  data () {
    return {
      orgId: null,
      options: [],
      selectedOptions: []
    };
  },
  watch: {
    orgId (val) {
      this.$emit('input', val);
    },
    defaultDealerName: {
      handler (val) {
        this.ensureSelectedOption(this.value, val);
      },
      // 组件可能晚于详情数据挂载（如被 v-if 包裹），挂载时名称已就位也需兜底
      immediate: true
    },
    value (val) {
      this.orgId = val;
      this.ensureSelectedOption(val, this.defaultDealerName);
    }
  },
  mounted () {
    if (this.value) {
      this.orgId = this.value;
    }
  },
  methods: {
    // 回显兜底：用已知编码+名称直接构造选项，不依赖搜索接口结果（搜索可能因主数据改名而查不到）
    ensureSelectedOption (orgCode, orgName) {
      if (!orgCode || !orgName) {
        return;
      }
      const rest = this.options.filter(item => item.orgCode !== orgCode && item.orgId !== null);
      this.options = [...rest, { orgId: null, orgCode, orgName }];
    },
    // 门店模糊搜索方法（带防抖）
    storeSearch (query) {
      if (!query || (query && query.length < 2)) {
        return;
      }
      listOrgStoreInfo({ name: query }).then(res => {
        this.options = [];
        res.forEach(item1 => {
          this.options.push(item1);
        });
        this.selectedOptions.forEach(item1 => {
          if (!this.options.find(item => item.orgCode === item1.orgCode)) {
            this.options.push(item1);
          }
        });
      });
    },
    handleChange (val) {
      let selectValArray = val;
      if (!this.multiple) {
        if (val) {
          selectValArray = [val];
        } else {
          selectValArray = [];
        }
      }
      // 同步 selectedOptions
      let selectedOptionsLength = this.selectedOptions.length;
      if (selectedOptionsLength > 0) {
        let existed = false;
        while (selectedOptionsLength--) {
          for (let selectValArrayElement of selectValArray) {
            if (selectValArrayElement === this.selectedOptions[selectedOptionsLength].orgCode) {
              existed = true;
            }
          }
          if (!existed) {
            this.selectedOptions.splice(selectedOptionsLength, 1);
          }
        }
      }
      for (let selectVal of selectValArray) {
        let find = this.selectedOptions.find(item => item.orgCode === selectVal);
        if (!find) {
          let selectedOption = this.options.find(item => item.orgCode === selectVal);
          this.selectedOptions.push(selectedOption);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .org_name {
    font-size: 14px;
    height: 20px;
  }
  .org_code {
    height: 20px;
  }
  .el-select {
    ::v-deep .el-select__tags {
      max-width: 100% !important;
    }
  }
</style>
