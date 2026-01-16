<template>
  <fetch-select
    filterable
    clearable
    remote
    reserve-keyword
    :value="formData.repairItemTypeId"
    :remote-method="repairItemTypeRemote"
    :params="formData.repairItemTypeName"
    @change="handleRepairItem"
    value-key="id"
    label-key="name"
  />
</template>
<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getList as repairGetList } from '@/api/maintain/basic/repairItemType';
export default {
  components: {
    FetchSelect,
  },
  props: {
    // 接收父组件传递的 form 对象
    formData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    repairItemTypeRemote (query) {
      return repairGetList({
        nameLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    // 维修类型
    handleRepairItem (val, record) {
      // 方法1：直接修改父组件传递的对象（需要确保是响应式的）
      this.$set(this.formData, 'repairItemTypeId', val);
      this.$set(this.formData, 'repairItemTypeName', record ? record.name : '');
      // if (record) {
      //   this.form.repairItemTypeName = record.name;
      // }
    },
  }
};
</script>
<style></style>
