<template>
  <div class="m-vehiclePartsMaintenance-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
      :labelStyle="{
        width: '150px',
        fontWeight: 'bold',
        justifyContent: 'right'
      }"
    >
      <el-descriptions-item label="保养方案">{{ info.name }}</el-descriptions-item>
      <el-descriptions-item label="保养零件代码">{{ info.partsMaintenanceId }}</el-descriptions-item>
      <el-descriptions-item label="保养零件名称">{{ info.partsMaintenanceName }}</el-descriptions-item>
      <el-descriptions-item label="下次保养时间">{{ info.nextDate }}</el-descriptions-item>
      <el-descriptions-item label="下次保养里程(KM)">{{ info.nextMileage }}</el-descriptions-item>
      <el-descriptions-item label="下次保养间隔里程(KM)">{{ info.nextDuemileage }}</el-descriptions-item>
      <el-descriptions-item label="下次保养间隔时间(月)">{{ info.nextDuetime }}</el-descriptions-item>
      <el-descriptions-item label="整车档案ID">{{ info.vehicleProfileId }}</el-descriptions-item>
      <el-descriptions-item label="整车档案名称">{{ info.vehicleProfileName }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/vehiclePartsMaintenance';

export default {
  name: 'vehiclePartsMaintenanceDetail',
  data () {
    return {
      loading: true,
      info: null
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['车辆零件保养', '']);
    this.getData();
  },
  methods: {
    getData () {
      getDetail({ id: this.$route.query.id }).then(res => {
        this.loading = false;
        this.info = res;
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['车辆零件保养', this.info.name]);
      });
    }
  }
};
</script>
