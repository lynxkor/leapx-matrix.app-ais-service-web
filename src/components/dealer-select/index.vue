<template>
  <fetch-select
    v-bind="$attrs"
    :remote="true"
    :remoteMethod="storeSearch"
    :format="formatDealer"
    v-model="orgId"
    placeholder="请选择"
    labelKey="label"
    valueKey="orgId"
    :params="defaultDealerName"
    clearable
    :multiple="multiple"
    filterable
  />
</template>
<script>
/**
 * 门店选择组件
 */
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { listOrgStoreInfo } from '@/api/common';

export default {
  name: 'DealerSelect',
  components: { FetchSelect },
  props: {
    value: {
      type: [String, Array],
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
      orgId: null
    };
  },
  watch: {
    orgId (val) {
      this.$emit('input', val);
    },
    value (val) {
      if (val && !this.multiple) {
        this.orgId = val + '';
      } else {
        this.orgId = val;
      }
    }
  },
  mounted () {
    if (this.value) {
      this.orgId = this.value + '';
    }
  },
  methods: {
    // 门店模糊搜索方法（带防抖）
    storeSearch (query) {
      if (query && query.length < 2) {
        return;
      }
      return listOrgStoreInfo({ name: query });
    },
    formatDealer (resp) {
      for (let ele of resp) {
        ele.orgId = ele.orgId + '';
        ele.label = ele.orgCode + ' ' + ele.orgName;
      }
      return resp;
    },
  }
};
</script>

<style scoped lang="scss">

</style>
