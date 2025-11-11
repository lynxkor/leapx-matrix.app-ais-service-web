<template>
  <div class="page-common-detail m-{{{nameKebabCase}}}-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-descriptions
      v-else title="基本信息"
    >
      {{{#cols}}}
      {{{#isBoolean}}}
        <el-descriptions-item label="{{{ description }}}">{{ yes_no_enum_map[info.{{{key}}}] }}</el-descriptions-item>
      {{{/isBoolean}}}
      {{{^isBoolean}}}
        <el-descriptions-item label="{{{ description }}}">{{ info.{{{key}}} }}</el-descriptions-item>
      {{{/isBoolean}}}
      {{{/cols}}}
    </el-descriptions>
  </div>
</template>

<script>
import { getDetail } from '@/api/{{{{modulePath}}}}/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';

export default {
  name: '{{{nameCamelCase}}}Edit',
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['{{{title}}}', '{{{title}}}详情']);
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
