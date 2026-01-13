<template>
  <el-select :remote="true" v-bind="$attrs" v-model="orgId" filterable placeholder="请选择" :remote-method="storeSearch" :multiple="multiple" clearable @change="handleChange" collapse-tags>
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
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
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
    }
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
    defaultDealerName (val, old) {
      if (val && !old) {
        this.storeSearch(val);
      }
    },
    value (val, old) {
      this.orgId = val;
    }
  },
  mounted () {
    if (this.value) {
      this.orgId = this.value;
    }
  },
  methods: {
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
