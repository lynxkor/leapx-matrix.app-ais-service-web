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
      if (query && query.length < 2) {
        return;
      }
      listOrgStoreInfo({ name: query }).then(res => {
        this.options = res.map(item => {
          return {
            ...item
          };
        });
      });
    },
    handleChange (val) {
      console.log('handleChange', val);
    }
  }
};
</script>

<style scoped lang="scss">
  .org_name {
    color: #333333;
    font-size: 14px;
    height: 20px;
  }
  .org_code {
    color: #999999;
    height: 20px;
  }
</style>
