<template>
  <div class="page-common-detail m-battery-unit-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
    >
        <el-descriptions-item label="单位代码">{{ info.code }}</el-descriptions-item>
        <el-descriptions-item label="单位名称">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码">{{ info.buinessLicense }}</el-descriptions-item>
        <el-descriptions-item label="状态描述">{{ info.statusDesc }}</el-descriptions-item>
        <el-descriptions-item label="负责人姓名">{{ info.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.createTime }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="工位状态">{{ info.status }}</el-descriptions-item>
        <el-descriptions-item label="负责人ID">{{ info.ownerId }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/batteryUnit/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';

export default {
  name: 'batteryUnitEdit',
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['电池去向单位', '电池去向单位详情']);
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
