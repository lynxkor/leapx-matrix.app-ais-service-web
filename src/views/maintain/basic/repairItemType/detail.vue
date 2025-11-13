<template>
  <div class="page-common-detail m-repair-item-type-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
    >
        <el-descriptions-item label="维修类型代码">{{ info.code }}</el-descriptions-item>
        <el-descriptions-item label="维修类别 TypeCategoryEnum ">{{ info.category }}</el-descriptions-item>
        <el-descriptions-item label="维修类型名称">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ info.sort }}</el-descriptions-item>
        <el-descriptions-item label="结算类型名称">{{ info.checkoutTypeName }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ info.status }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ info.remark }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.createTime }}</el-descriptions-item>
        <el-descriptions-item label="">{{ info.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="状态描述">{{ info.statusDesc }}</el-descriptions-item>
        <el-descriptions-item label="类别描述">{{ info.categoryDesc }}</el-descriptions-item>
        <el-descriptions-item label="结算类型id">{{ info.checkoutTypeId }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/repairItemType/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';

export default {
  name: 'repairItemTypeEdit',
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['维修类型管理', '维修类型管理详情']);
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
