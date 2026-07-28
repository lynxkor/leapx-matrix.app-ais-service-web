<!--
  门店利润明细报表
  数据源: 后端 5 路 UNION ALL(自费备件/自费工时/索赔备件/索赔工时/索赔其他)
  路由: /datareport/profit/profitDetail
  接口: POST /datareport/web/profit/profitDetail/page
-->
<template>
  <div class="page-common m-profit-detail-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="门店">
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
      <el-form-item label="收款/审批时间">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.receiveTime"
          type="daterange"
          unlink-panels
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
        @reset="onReset"
      />
    </el-form>

    <div class="ais-actions">
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">
        <i class="iconfont icon-lxppc-export"></i>导出
      </el-button>
    </div>

    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        :show-footer="optionObj.dataList.length > 0"
        :footer-method="footerMethod"
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import FetchSelect from '@/libs/components/FetchSelect';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import { pageProfitDetail } from '@/api/datareport/profitDetail';
import { listOrgStoreInfoByParam, exportTable, getTableConfig, tableAddOrUpdate } from '@/api/common';
import { downloadExcel } from '@/libs/utils';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const pageSize = 20;

const defaultForm = {
  dealerCodes: [],
  receiveTime: []
};

export default {
  name: 'ProfitDetail',
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: { PageSearchAction, FetchSelect, LPVxeTable },
  data () {
    return {
      pageTitle: '门店利润明细',
      pageType: 'list',
      moduleKey: 'AISDR-profitDetail',
      form: { ...defaultForm },
      loading: false,
      exportLoading: false,
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
      // 字段顺序严格按 Excel 【业务已确认】门店利润明细 sheet 第 3-37 行(A 列从上到下)
      optionObj: {
        id: 'profitDetailTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          { props: 'region', label: '区域', visible: true, width: 120 },
          { props: 'province', label: '省', visible: true, width: 100 },
          { props: 'city', label: '市', visible: true, width: 100 },
          { props: 'county', label: '区', visible: true, width: 100 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 140 },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 120 },
          { props: 'companyName', label: '母公司名称', visible: true, width: 180 },
          { props: 'companyCode', label: '母公司编码', visible: true, width: 140 },
          { props: 'vin', label: 'VIN', visible: true, width: 180 },
          { props: 'carPlate', label: '车牌号', visible: true, width: 130 },
          { props: 'serviceProxyCode', label: '接车施工单', visible: true, width: 200 },
          { props: 'repairType', label: '维修类型', visible: true, width: 150 },
          { props: 'statementCode', label: '结算单号', visible: true, width: 200 },
          { props: 'warrantyApplyCode', label: '保修申请单', visible: true, width: 200 },
          { props: 'serviceOrderCreateTime', label: '开单日期', visible: true, width: 170 },
          { props: 'orderStatusLabel', label: '工单状态', visible: true, width: 110 },
          { props: 'factoryOutTime', label: '出厂日期', visible: true, width: 170 },
          { props: 'receiveOrApproveTime', label: '收款/审批通过日期', visible: true, width: 170 },
          { props: 'statementTypeLabel', label: '结算类型', visible: true, width: 110 },
          { props: 'creatorName', label: '开单人', visible: true, width: 110 },
          { props: 'latestPurchasePrice', label: '最新采购价格', visible: true, width: 130, align: 'right', sum: true },
          { props: 'costPrice', label: '成本价格', visible: true, width: 120, align: 'right', sum: true },
          { props: 'quantity', label: '数量', visible: true, width: 100, align: 'right', sum: true },
          { props: 'costAmount', label: '成本金额', visible: true, width: 130, align: 'right', sum: true },
          { props: 'retailPrice', label: '零售/索赔价格', visible: true, width: 140, align: 'right', sum: true },
          { props: 'discountAmount', label: '零售优惠金额', visible: true, width: 130, align: 'right', sum: true },
          { props: 'retailAmount', label: '零售/索赔金额', visible: true, width: 140, align: 'right', sum: true },
          { props: 'profit', label: '利润', visible: true, width: 140, align: 'right', sum: true },
          { props: 'itemCode', label: '项目编码', visible: true, width: 160 },
          { props: 'itemName', label: '项目名称', visible: true, width: 200 },
          { props: 'itemCategory', label: '项目分类', visible: true, width: 110 },
          { props: 'warrantyTypeLabel', label: '保修类型', visible: true, width: 120 },
          { props: 'pickerName', label: '领料人', visible: true, width: 120 },
          { props: 'repairTechnicianName', label: '维修技师', visible: true, width: 120 }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    // 默认近一个月
    const now = new Date();
    const start = new Date(now.getTime() - 3600 * 1000 * 24 * 30);
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    start.setHours(0, 0, 0, 0); now.setHours(23, 59, 59, 999);
    this.form.receiveTime = [fmt(start), fmt(now)];
    // 首次进入页面加载数据(commonMixins.activated 故意跳过首次激活,首次加载由页面 created 负责)
    this.getData();
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
      // 校验时间范围
      if (!this.form.receiveTime || this.form.receiveTime.length < 2) {
        this.$message({ type: 'warning', message: '请选择收款/审批时间范围(必填)' });
        return;
      }
      const [startStr, endStr] = this.form.receiveTime;
      const start = new Date(startStr).getTime();
      const end = new Date(endStr).getTime();
      const diffDays = Math.ceil((end - start) / (3600 * 1000 * 24));
      if (diffDays > 31) {
        this.$message({ type: 'warning', message: '时间范围不能超过 31 天,请重新选择' });
        return;
      }
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      const now = new Date();
      const start = new Date(now.getTime() - 3600 * 1000 * 24 * 30);
      const pad = n => String(n).padStart(2, '0');
      const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      start.setHours(0, 0, 0, 0); now.setHours(23, 59, 59, 999);
      this.form.receiveTime = [fmt(start), fmt(now)];
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.getData();
    },
    getData () {
      this.loading = true;
      const payload = this.getFormData();
      pageProfitDetail({ ...payload, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res.records || []).map(item => ({ ...item }));
          this.optionObj.total = res.total || 0;
        })
        .catch(err => {
          console.error('门店利润明细查询失败:', err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getFormData () {
      const data = { ...this.form };
      // 清除空值(空数组也清掉,让后端走"全权限"分支)
      Object.keys(data).forEach(k => {
        const v = data[k];
        if (v === '' || v === null) delete data[k];
        else if (Array.isArray(v) && v.length === 0) delete data[k];
      });
      // 时间区间拆分
      if (data.receiveTime && data.receiveTime.length === 2) {
        data.receiveStartTime = data.receiveTime[0];
        data.receiveEndTime = data.receiveTime[1];
        delete data.receiveTime;
      }
      return data;
    },
    // vxe-table 原生 footer:首列显示"本页合计",sum 列显示累加,其余空
    footerMethod ({ columns }) {
      const list = this.optionObj.dataList || [];
      const sumProps = this.optionObj.dataProp.filter(c => c.sum).map(c => c.props);
      return [
        columns.map(col => {
          const field = col.field;
          if (field === columns[0].field) return '本页合计';
          if (sumProps.includes(field)) {
            const total = list.reduce((acc, row) => {
              const v = Number(row[field]);
              return acc + (isNaN(v) ? 0 : v);
            }, 0);
            return this.formatMoney(total);
          }
          return '';
        })
      ];
    },
    formatMoney (val) {
      if (val === null || val === undefined || isNaN(Number(val))) return '';
      return Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    // ---- LPVxeTable 列配置回调 ----
    getConfig () {
      return new Promise(resolve => {
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
    }, 300),
    exportExcel () {
      if (!this.form.receiveTime || this.form.receiveTime.length < 2) {
        this.$message({ type: 'warning', message: '请先选择收款/审批时间范围' });
        return;
      }
      this.exportLoading = true;
      exportTable({
        businessType: '门店利润明细',
        dataFetchPath: 'datareport/web/profit/profitDetail/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店利润明细.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-profit-detail-list {
  .ais-actions {
    margin-bottom: 12px;
  }
}
</style>
