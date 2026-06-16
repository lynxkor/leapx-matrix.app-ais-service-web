<template>
  <el-main class="page-common-edit">
    <section
      v-for="module in modules"
      :key="module.key"
      class="common-section"
    >
      <div class="common-section-header">
        <h2>{{ module.title }}</h2>
      </div>
      <div class="common-section-body">
        <section class="common-section">
          <div class="common-section-header">
            <h3>产品演示</h3>
          </div>
          <div class="common-section-table">
            <vxe-table
              border="inner"
              stripe
              show-overflow
              resizable
              size="medium"
              min-height="0"
              :data="module.demo"
            >
              <vxe-column field="title" title="标题" min-width="400">
                <template #default="{ row }">
                  <el-link
                    type="primary"
                    v-if="row.url"
                    :href="row.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ row.title }}</el-link>
                  <span v-else>{{ row.title }}</span>
                </template>
              </vxe-column>
              <vxe-column field="owner" title="责任人" width="300" />
              <vxe-column field="date" title="更新日期" width="200" />
              <vxe-column title="操作" width="160">
                <template #default="{ row }">
                  <span
                    class="action-button"
                    :disabled="!row.url"
                    @click="handleView(row)"
                  >查看</span>
                  <span
                    class="action-button"
                    :disabled="!row.url"
                    @click="handleDownload(row)"
                  >下载</span>
                </template>
              </vxe-column>
              <template #empty>
                <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
              </template>
            </vxe-table>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h3>操作手册</h3>
          </div>
          <div class="common-section-table">
            <vxe-table
              border="inner"
              stripe
              show-overflow
              resizable
              min-height="0"
              size="medium"
              :data="module.manual"
            >
              <vxe-column field="title" title="标题" min-width="400">
                <template #default="{ row }">
                  <el-link
                    type="primary"
                    v-if="row.url"
                    :href="row.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ row.title }}</el-link>
                  <span v-else>{{ row.title }}</span>
                </template>
              </vxe-column>
              <vxe-column field="owner" title="责任人" width="300" />
              <vxe-column field="date" title="更新日期" width="200" />
              <vxe-column title="操作" width="160">
                <template #default="{ row }">
                  <span
                    class="action-button"
                    :disabled="!row.url"
                    @click="handleView(row)"
                  >查看</span>
                  <span
                    class="action-button"
                    :disabled="!row.url"
                    @click="handleDownload(row)"
                  >下载</span>
                </template>
              </vxe-column>
              <template #empty>
                <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
              </template>
            </vxe-table>
          </div>
        </section>
      </div>
    </section>
  </el-main>
</template>

<script>
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import docsData from './data.json';

const defaultForm = {};

export default {
  name: 'docs',
  mixins: [routeGuard, permissions, commonMixins],
  computed: {
    _id () {
      return 'docs';
    },
    title () {
      return '产品演示和使用文档';
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.title]);
  },
  data () {
    const form = { ...defaultForm };
    return {
      pageTitle: '产品演示和使用文档',
      pageType: 'edit',
      moduleKey: 'AISMC-docs',
      form,
      originalForm: { ...form },
      emptyText: '暂无数据',
      modules: docsData.modules || []
    };
  },
  methods: {
    handleView (row) {
      if (!row.url) return;
      window.open(row.url, '_blank', 'noopener,noreferrer');
    },
    handleDownload (row) {
      if (!row.url) return;
      const link = document.createElement('a');
      link.href = row.url;
      link.download = row.title || '';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>
<style scoped lang="scss">
.common-section-header h3 {
    font-size: 14px;
}
</style>
