<template>
  <div class="page-common-detail m-dealer-discount-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
    >
        <el-descriptions-item label="优惠代码">{{ info.code }}</el-descriptions-item>
        <el-descriptions-item label="优惠名称">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item label="门店名称">{{ info.dealerName }}</el-descriptions-item>
        <el-descriptions-item label="工时折扣率:介入0-1之间，包含0、1">{{ info.discountWorkhourRate }}</el-descriptions-item>
        <el-descriptions-item label="备件折扣率:介入0-1之间，包含0、1">{{ info.discountPartRate }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ info.status }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.createTime }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="状态描述">{{ info.statusDesc }}</el-descriptions-item>
        <el-descriptions-item label="门店ID">{{ info.dealerId }}</el-descriptions-item>
        <el-descriptions-item label="门店编码">{{ info.dealerCode }}</el-descriptions-item>
        <el-descriptions-item label="门店用户优惠配置列表">{{ info.dealerUserDiscountRespList }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/dealerDiscount/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';

export default {
  name: 'dealerDiscountEdit',
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店优惠模式管理', '门店优惠模式管理详情']);
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
