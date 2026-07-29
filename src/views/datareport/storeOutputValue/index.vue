<template>
  <div class="page-common m-store-output-value">
    <!-- 搜索区(产值报表 tab 才有查询条件,指标定义 tab 不需要) -->
    <div v-show="activeTab === 'report'" class="search-form-wrap">
      <el-form :inline="true" :model="form" size="small" class="ais-search-form">
        <el-form-item label="门店" required>
          <fetch-select
            :remote-method="getDealerList"
            remote
            v-model="form.dealerCodes"
            placeholder="请输入门店编码或名称(可多选)"
            label-key="orgName"
            value-key="orgCode"
            sub-label-key="orgCode"
            clearable
            multiple
            collapse-tags
            filterable
            style="width: 280px;"
          />
        </el-form-item>
        <el-form-item label="收款/审批时间" required>
          <el-date-picker
            v-model="form.receiveTime"
            type="daterange"
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <page-search-action
          v-if="canList"
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset" />
      </el-form>
    </div>

    <!--
      tab 放在查询条件下方(产值报表 tab 时)
      或直接顶部(指标定义 tab 时)
      接车施工单风格:搜索 → tab 筛选 → 表格
    -->
    <div class="ais-tabs">
      <div
        v-for="item in tabList"
        :key="item.name"
        :class="['ais-tabs-item', { active: activeTab === item.name }]"
        @click="activeTab = item.name"
      >
        {{ item.label }}
      </div>
    </div>

    <div class="tab-pane">
      <div v-show="activeTab === 'report'" class="ais-table-c report-pane">
        <LPVxeTable
          ref="tableRef"
          v-loading="loading"
          is-page
          :option-obj="optionObj"
          :get-config="getConfig"
          :save-or-update="saveOrUpdate"
          @paginationChange="paginationChange"
        />
      </div>

      <div v-show="activeTab === 'definition'" class="definition-pane">
        <el-table
          :data="indicatorTableData"
          border
          stripe
          :cell-style="{ padding: '14px 12px' }"
          :row-style="{ height: 'auto', minHeight: '64px' }"
        >
          <el-table-column prop="name" label="指标" width="160" fixed="left" :show-overflow-tooltip="false" />
          <el-table-column
            v-for="col in typeCols"
            :key="col.key"
            :prop="col.key"
            :label="col.label"
            min-width="220"
            :show-overflow-tooltip="false"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { pageStoreOutputValue } from '@/api/datareport/storeOutputValue';
import { listOrgStoreInfoByParam, getTableConfig, tableAddOrUpdate } from '@/api/common';
import { INDICATOR_DEFINITIONS } from './constants';

const pageSize = 100;

/**
 * 14 个指标列配置(产值报表)
 * percent: true 表示后端返回 0~1 小数,前端 ×100 显示百分比
 */
const METRIC_COLS = [
  { props: 'factoryCount', label: '出厂台次' },
  { props: 'settledCount', label: '已结算施工单数' },
  { props: 'outputValue', label: '产值' },
  { props: 'singleCarOutputValue', label: '单车产值' },
  { props: 'partsCost', label: '备件成本' },
  { props: 'grossProfit', label: '毛利' },
  { props: 'grossProfitRate', label: '毛利率', percent: true },
  { props: 'workhourIncome', label: '工时收入' },
  { props: 'partsIncome', label: '备件收入' },
  { props: 'workhourRatio', label: '工时占比', percent: true },
  { props: 'partsRatio', label: '备件占比', percent: true },
  { props: 'partsGrossProfit', label: '备件毛利' },
  { props: 'partsGrossProfitRate', label: '备件毛利率', percent: true },
  { props: 'repairRatio', label: '维修占比', percent: true }
];

function fmtNumber (v) {
  if (v === null) return '-';
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 2 });
}

function fmtPercent (v) {
  if (v === null) return '-';
  const pct = Number(v) * 100;
  return pct.toFixed(2).replace(/\.?0+$/, '') + '%';
}

const defaultForm = {
  dealerCodes: [],
  receiveTime: []
};

export default {
  name: 'StoreOutputValue',
  mixins: [responsiveSearchForm, permissions],
  components: { LPVxeTable, PageSearchAction, FetchSelect },
  data () {
    const dataProp = [
      { props: 'dealerCode', label: '门店编码', visible: true, width: 120, fixed: 'left' },
      { props: 'dealerName', label: '门店名称', visible: true, width: 180, fixed: 'left' },
      { props: 'type', label: '类型', visible: true, width: 100, fixed: 'left' },
      ...METRIC_COLS.map(m => ({
        props: m.props,
        label: m.label,
        visible: true,
        width: 140,
        align: 'right'
      }))
    ];

    return {
      pageTitle: '门店产值报表',
      pageType: 'list',
      moduleKey: 'AISDR-storeOutputValue',
      activeTab: 'report',
      tabList: [
        { name: 'report', label: '产值报表' },
        { name: 'definition', label: '指标定义' }
      ],
      typeCols: [
        { key: 'selfPaid', label: '自费' },
        { key: 'insurance', label: '保险' },
        { key: 'internalSettlement', label: '内部结算' },
        { key: 'contract', label: '合同' },
        { key: 'warranty', label: '保修' },
        { key: 'total', label: '总计' }
      ],
      indicatorTableData: INDICATOR_DEFINITIONS,
      form: { ...defaultForm },
      loading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date(); end.setHours(23, 59, 59, 999);
            const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 7); start.setHours(0, 0, 0, 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date(); end.setHours(23, 59, 59, 999);
            const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 30); start.setHours(0, 0, 0, 0);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      optionObj: {
        id: 'storeOutputValueTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp,
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    const now = new Date();
    const start = new Date(now.getTime() - 3600 * 1000 * 24 * 30);
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    start.setHours(0, 0, 0, 0); now.setHours(23, 59, 59, 999);
    this.form.receiveTime = [fmt(start), fmt(now)];
  },
  /**
   * 覆盖 commonMixins.activated:进入/切回页面不自动刷新,
   * 必须用户手动点"查询"才调接口。
   */
  activated () {
    // 仅保留面包屑更新,跳过 getData 自动调用
    if (this.$route.meta.keepAlive && this.pageTitle && this.pageType === 'list') {
      this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    }
  },
  methods: {
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('门店列表加载失败:', error);
        return [];
      }
    },
    onSubmit () {
      if (!this.form.dealerCodes || this.form.dealerCodes.length === 0) {
        return this.$message({ type: 'warning', message: '请选择门店(必填)' });
      }
      if (!this.form.receiveTime || this.form.receiveTime.length < 2) {
        return this.$message({ type: 'warning', message: '请选择收款/审批时间范围(必填)' });
      }
      const [startStr, endStr] = this.form.receiveTime;
      const diffDays = Math.ceil((new Date(endStr).getTime() - new Date(startStr).getTime()) / (3600 * 1000 * 24));
      if (diffDays > 31) {
        return this.$message({ type: 'warning', message: '时间范围不能超过 31 天,请重新选择' });
      }
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.optionObj.dataList = [];
      this.optionObj.total = 0;
    },
    getData () {
      this.loading = true;
      const payload = this.getFormData();
      pageStoreOutputValue({ ...payload, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          const records = res.records || [];
          this.optionObj.dataList = records.map(item => this.formatRow(item));
          this.optionObj.total = res.total || 0;
        })
        .catch(err => {
          console.error('门店产值报表查询失败:', err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatRow (item) {
      const out = { ...item };
      METRIC_COLS.forEach(m => {
        const raw = item[m.props];
        out[m.props] = m.percent ? fmtPercent(raw) : fmtNumber(raw);
        out[`_${m.props}Raw`] = raw;
      });
      return out;
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(data).forEach(k => {
        const v = data[k];
        if (v === '' || v === null) delete data[k];
        else if (Array.isArray(v) && v.length === 0) delete data[k];
      });
      if (data.receiveTime && data.receiveTime.length === 2) {
        data.receiveStartTime = data.receiveTime[0];
        data.receiveEndTime = data.receiveTime[1];
        delete data.receiveTime;
      }
      return data;
    },
    getConfig () {
      return new Promise((resolve) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          console.error(err);
          resolve({ data: null });
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300)
  }
};
</script>

<style lang="scss">
/* 高度布局:flex+min-height:0 让内部 ais-table-c 正确分配高度 */
.m-store-output-value {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}
.m-store-output-value > .search-form-wrap {
  flex: 0 0 auto;
}
.m-store-output-value > .ais-tabs {
  flex: 0 0 auto;
}
.m-store-output-value > .tab-pane {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.m-store-output-value .report-pane {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.m-store-output-value .definition-pane {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}
.m-store-output-value .ais-table-c {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
