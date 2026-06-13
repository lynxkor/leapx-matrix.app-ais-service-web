<template>
  <div id="printArea" class="outbound" style="width:1000px; padding:1px; text-align:center">
    <div id="printArea2" style="width:100%; text-align:center;">
      <div>
        <div style="float:left;"><img id="img_logo"
            src="data:image/png;base64,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">
        </div>
        <div style="width:75%;">
          <h1>旧件出库单-明细</h1>
        </div>
      </div>
      <div>
        <table class="gridtable" style="font-size: 12pt;font-family: SimHei;color: black;">
          <thead>
            <tr>
              <th style="width:20%">出库单号</th>
              <th style="width:10%">供应商代码</th>
              <th style="width:20%">供应商名称</th>
              <th style="width:10%">备注</th>
              <th style="width:15%">出库原因</th>
              <th style="width:8%">出库时间</th>
            </tr>
          </thead>
          <tbody id="data-main">
            <tr>
              <td>{{ form.outboundOrderNo }}</td>
              <td>{{ form.supplierCode }}</td>
              <td>{{ form.supplierName }}</td>
              <td>{{ form.remark }}</td>
              <td>{{ form.outboundTypeLabel }}</td>
              <td>{{ form.outboundTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div style=" text-align:left">
      <h3>旧件明细：</h3>
    </div>
    <div>
      <table class="gridtable" style="font-size: 12pt;font-family: SimHei;color: black;">
        <thead>
          <tr>
            <th style="width:5%">序号</th>
            <th style="width:20%">唯一码</th>
            <th style="width:20%">零件代码</th>
            <th style="width:15%">零件名称</th>
            <th style="width:18%;">车架号</th>
            <th style="width:8%;">工时费用总计</th>
            <th style="width:6%;">是否快返</th>
            <th style="width:100px;">备注</th>
          </tr>
        </thead>
        <tbody id="data-list">
          <tr v-for="(item, index) in tableData" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.oldPartUniqueCode }}</td>
            <td>{{ item.partCode }}</td>
            <td>{{ item.partName }}</td>
            <td>{{ item.vin }}</td>
            <td></td>
            <td>{{ item.returnType === '40' ? '是': '否'}}</td>
            <td style=" overflow: hidden; white-space: nowrap; text-overflow: ellipsis;max-width: 100px;">{{ item.remark }}</td>
          </tr>
          <tr>
            <td></td>
            <td colspan="3">合计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style=" text-align:left">
      <h3>签字栏：</h3>
    </div>
    <div style="text-align: left; font-size: 10px; margin-bottom: 2px;">
      <span style="font-size: 12pt;color: black;">本出库单一式四联，第一联服务部，第二联质量部，第三联供应链，第四联供应商</span>
    </div>
    <div style="margin-bottom:50px;">
      <table class="gridtable">
        <thead>
          <tr style="height:60px;">
            <th style="width:25%;padding-top: 30px;">
              <h3 style="font-size: 14pt;line-height: 60px;color: black;">零跑旧件库负责人</h3>
            </th>
            <td style="width:25%"></td>
            <th style="width:25%;padding-top: 30px;">
              <h3 style="font-size: 14pt;line-height: 60px;color: black;">供应商代表</h3>
            </th>
            <td style="width:25%;"></td>
          </tr>
        </thead>
        <tbody id="data-list"></tbody>
      </table>
    </div>
  </div>
</template>
<script>

import { getDetail } from '@/api/claimreturn/oldpart/outbound/index';
import {
  getPrintDetail, // 旧件库存
} from '@/api/claimreturn/oldpart/inventory/oem/index';
export default {
  components: {
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {},
      tableData: [],
      total_oldPartQuantity: 0,
    };
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.init();
        }
      },
      immediate: true,
    }
  },
  methods: {
    init () {
      this.form = {};
      this.tableData = [];
      getDetail(this.id).then((res) => {
        this.form = res;
      });
      getPrintDetail({
        oemOutboundOrderId: this.id, // 主机厂出库单ID
        pageSize: 5000,
        pageNum: 1,
      }).then((res) => {
        this.tableData = res.records;
        this.total_oldPartQuantity = this.tableData.reduce((val, cur) => {
          const n = parseFloat(cur.oldPartQuantity);
          if (isNaN(n)) {
            return val;
          }
          return val + n;
        }, 0);
      });
    },
    transformDate (time) {
      if (!time) {
        return '';
      }
      const date = new Date(time);
      var Y = date.getFullYear();
      const _m = date.getMonth() + 1;
      var M = (_m < 10 ? '0' + (_m) : _m);
      const _d = date.getDate();
      var D = _d < 10 ? '0' + _d : _d;
      return `${Y}/${M}/${D}`;
    }
  },
};
</script>
<style lang="scss" scoped>
.outbound {
  table.gridtable th {
    border-width: 1px;
    padding: 10px;
    border-style: solid;
    border-color: #666666 !important;
    background-color: #dedede !important;
    text-align: center;
  }

  table.gridtable td {
    border-width: 1px;
    padding: 4px;
    border-style: solid;
    border-color: #666666 !important;
    background-color: #ffffff !important;
    text-align: center;
  }

  h1 {
    font-size: 32px;
    margin: 0.67em 0;
  }

  h3 {
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
}
</style>
