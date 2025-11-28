<template>
  <div class="page-common-detail m-{{{nameKebabCase}}}-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
      {{{#top1List}}}
        <h2>{{{description}}}：{{ info.{{{key}}} }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      {{{/top1List}}}
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
          {{{#cols}}}
            <el-form-item label="{{{description}}}：" prop="{{{key}}}">
              {{{#isBoolean}}}
              {{ yes_no_enum_map[info.{{{key}}}] }}
              {{{/isBoolean}}}
              {{{^isBoolean}}}
              {{ info.{{{key}}}  }}
              {{{/isBoolean}}}
            </el-form-item>
          {{{/cols}}}
          </el-form>
        </div>
      </section>
    {{{#isProForm}}}
      <section class="common-section">
        <div class="common-section-header">
          <!-- TIPS: 根据实际情况修改标题 -->
          <h2>标题</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="tableData"
              :show-toolbar="false"
            />
          </div>
        </div>
      </section>
    {{{/isProForm}}}
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/{{{{modulePath}}}}/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
{{{#isProForm}}}
import EditTable from '@/libs/components/EditTable';
{{{/isProForm}}}
import permissions from '@/libs/mixins/permissions';

export default {
  name: '{{{nameCamelCase}}}Detail',
  mixins: [permissions],
  components: {
    {{{#isProForm}}}
    EditTable
    {{{/isProForm}}}
  },
  data () {
    return {
      loading: true,
      info: {},
      {{{#isProForm}}}
      tableData: [],
      columns: [
        // TIPS: 根据实际情况修改字段名field和width
        {
          field: 'name',
          title: '姓名',
          width: '33%',
        },
        {
          field: 'age',
          title: '年龄',
          width: '33%',
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
        },
      ],
      {{{/isProForm}}}
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['{{{title}}}', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/{{{{modulePath}}}}/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        {{{#isProForm}}}
        this.tableData = res.list || []; // TIPS: 根据实际情况修改表格数据res.list的取值
        {{{/isProForm}}}
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
