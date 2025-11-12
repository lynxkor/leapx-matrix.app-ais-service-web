<template>
  <div class="page-common-detail m-checkout-type-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
    >
        <el-descriptions-item label="结算类型代码">{{ info.code }}</el-descriptions-item>
        <el-descriptions-item label="结算类型名称">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item label="结算类别描述">{{ info.categoryDesc }}</el-descriptions-item>
        <el-descriptions-item label="状态描述">{{ info.statusDesc }}</el-descriptions-item>
        <el-descriptions-item label="是否app展示描述">{{ info.appShowDesc }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ info.sort }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ info.remark }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.createTime }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ info.status }}</el-descriptions-item>
        <el-descriptions-item label="结算类别 CheckoutCategoryEnum ">{{ info.category }}</el-descriptions-item>
        <el-descriptions-item label="是否app展示">{{ yes_no_enum_map[info.appShow] }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/checkoutType/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';

export default {
  name: 'checkoutTypeEdit',
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['结算类型管理', '结算类型管理详情']);
    this.getData();
  },
  methods: {
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
