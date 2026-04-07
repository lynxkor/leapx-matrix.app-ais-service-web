<template>
    <div id="printArea" class="el-card">
        <div class="el-card__header" style="text-align: center;">
            <h1 id="print_title">{{info.dealerName}}厅店备件出库单</h1>
        </div>
        <div class="el-card__header displayserviceproxy" id="header_serviceproxy">
            <div class="el-row">
                <div class="el-col-12">
                    <label>施工单：</label>
                    <span id="info_serviceno"> </span>
                </div>
                <div class="el-col-12">
                    <label>车牌：</label>
                    <span id="info_carplate"> </span>
                </div>
            </div>
            <div class="el-row">
                <div class="el-col-12">
                    <label>VIN码：</label>
                    <span id="info_vin"> </span>
                </div>
                <div class="el-col-12">
                    <label>车主：</label>
                    <span id="info_customername"> </span>
                </div>
            </div>
        </div>
        <div class="el-card__body">
            <table>
                <thead>
                    <tr>
                        <th style="width:25%">出库单号</th>
                        <th style="width:25%">出库类型</th>
                        <th style="width:25%">厅店名称</th>
                        <th style="width:25%">签字栏</th>
                    </tr>
                </thead>
                <tbody id="data-main">
                    <tr>
                        <td>{{info.code}}</td>
                        <td>内部领料出库</td>
                        <td>{{info.dealerName}}</td>
                        <td></td>
                        <td> </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="el-card__header">
            <h3> 本次厅店备件出库单详细如下：</h3>
        </div>
        <div class="el-card__body" id="tablebodyid">
            <div class="el-card__header">
                <h4>仓库名称：<span>{{info.warehouseName}}</span></h4>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 20%">零件编码</th>
                        <th style="width: 20%">零件名称</th>
                        <th style="width: 10%">仓库库位</th>
                        <th style="width: 10%">出库数量</th>
                        <th style="width: 10%">是否出库</th>
                        <th>领料人</th>
                        <th>领料日期</th>
                        <th>销售单价</th>
                        <th>成本单价</th>
                        <th>备注</th>
                    </tr>
                </thead>
                <tbody id="data-list">
                    <tr v-for="item in tableData" :key="item.id">
                        <td>{{item.sparePartCode}}</td>
                        <td>{{item.sparePartName}}</td>
                        <td>{{item.locationName}}</td>
                        <td>{{item.qty}}</td>
                        <td>{{info.outboundStatusLabel}}</td>
                        <td>{{info.outboundOperatorName}}</td>
                        <td>{{info.outboundTime}}</td>
                        <td>¥{{item.salesUnitPrice}}</td>
                        <td>{{ item.costUnitPrice }}</td>
                        <td>{{ item.remark || '--' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
// 对应业务的接口
import { getDetail, orderDetailPage } from '@/api/sparepart/outbound/dealerOutboundOrder/index';

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      info: {},
      currentTime: '', // 添加当前时间数据
      tableData: []
    };
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.info = {};
          this.getData();
          this.getList();
        }
      },
      immediate: true
    }
  },
  created () {
    // 组件创建时设置当前时间
    this.currentTime = this.getCurrentTime();
  },
  methods: {
    getData () {
      getDetail(this.id).then(res => {
        this.info = res;
      });
    },
    async getList () {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        dealerOutboundOrderId: this.id
      };
      const res = await orderDetailPage(params);
      this.tableData = res.records || [];
    },
    getCurrentTime () {
      const now = new Date();
      return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-'); // 将日期分隔符 / 替换为 -
    }
  },
};
</script>

<style scoped>
.el-card {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #333;
    border-radius: 4px;
    color: #000;
    background: #fff;
    -webkit-transition: .3s;
    transition: .3s;
    font-size: 14px;
}

.el-card__header {
    padding: 0 10px;
    border-bottom: 1px solid #333;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.el-card__body {
    padding: 5px 8px;
    word-break: break-all;
}

.el-card__footer {
    padding: 10px;
    text-align: right;
    box-sizing: border-box;
}

.el-row {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    display: flex;
}

.el-col-4 {
    width: 16.66667%;
}

.el-col-6 {
    width: 25%
}

.el-col-8 {
    width: 33.33333%
}

.el-col-12 {
    width: 50%
}

.el-col-24 {
    width: 100%
}

[class*=el-col-] {
    float: left;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

label {
    min-width: 60px;
    line-height: 35px;
    text-align: right;
}

span {
    line-height: 35px;
}

table {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    font-size: 14px;
    color: #606266;
    table-layout: fixed;
}

table tr {
    background: #fff;
}

table tr:hover {
    background-color: #ecf5ff
}

table td,
table th {
    clear: both;
    padding: 5px;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    border-bottom: 1px solid #333;
    color: #000;
}

table th,
table th:hover {
    user-select: none;
    background-color: #ecf5ff;
}

.el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    width: auto;
}

.el-button--primary {
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
}

.el-button--primary:hover {
    background-color: #2391ff;
}

.displayserviceproxy {
    display: none;
}
</style>
