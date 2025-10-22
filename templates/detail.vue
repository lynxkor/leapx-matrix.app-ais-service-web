<template>
  <div class="m-{{{nameKebabCase}}}-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
      :labelStyle="{
        width: '150px',
        fontWeight: 'bold',
        justifyContent: 'right'
      }"
    >
      <el-descriptions-item label="colName1">{{ info.col1 }}</el-descriptions-item>
      <el-descriptions-item label="colName2">{{ info.col2 }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ info.date }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/{{{nameCamelCase}}}';

export default {
  name: 'vehiclePartsMaintenanceDetail',
  data () {
    return {
      loading: true,
      info: null
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['列表', '']);
    this.getData();
  },
  methods: {
    getData () {
      getDetail({ id: this.$route.query.id }).then(res => {
        this.loading = false;
        this.info = res;
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['列表', '详情']);
      });
    }
  }
};
</script>
