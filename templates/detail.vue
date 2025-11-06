<template>
  <div class="page-common-detail m-{{{nameKebabCase}}}-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
    >
      {{{#cols}}}
      <el-descriptions-item label="{{{ description }}}：">{{ info.{{{key}}} }}</el-descriptions-item>
      {{{/cols}}}
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/{{{{modulePath}}}}/index';

export default {
  name: '{{{nameCamelCase}}}Edit',
  data () {
    return {
      loading: true,
      info: {}
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
