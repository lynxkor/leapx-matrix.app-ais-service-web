<!--
  开发步骤：
  1. 拷贝本页面代码，重命名为新打印模版页面
  2. 从老销服拷贝打印页面，拷贝并替换#printArea区域
  3. 所有有id标签的地方，修改为vue模版代码动态字段
  4. 开发接口获取数据
-->
<template>
    <!-- 以下内容请从销服老系统对应模块拷贝，修改动态字段  -->
    <div id="printArea" style="width:1050px; text-align:center">
        <div style="margin-bottom: 20px;">
            <h1 id="print_title">{{ info.dealerName }}备件退货单</h1>
        </div>
        <div id="dv_qrcode" style="float: right;margin-top: -60px;margin-right: 30px;" title="RO-250624165225225461">
            <canvas width="70" height="70" style="display: none;"></canvas><img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAFDklEQVR4AeyagZrbNgyD/ff937kzrEKGbcrx7dJva6N+4YECQTqDeOmt7Y9lWX5+J37GL88Jqs9O7i6vZnxV7xnfQRmz9s/X2YFuzHory1fiPCjPwAItPBPaeaSDYx3aGegtwDa3Ey8SP/sp5rhuTJIzX5aLMcB2K1DjnWnVzVjvms/CihOvcE0I7b2IP4fqijOfZ2j9UGNqnV+MceHTcRoz2IC3GgP1qgKDxzda3wqOxhy/umYELt/ux47vn95qzPffzv9nwm8xxjeb6P9k2G/7jnNNCK1HuaKaK/6d8VuMeecb/K9mTWMGzl+MyTWt8sGcAw1t9YHOA9sHZs7sxUhcD6qn0GbAjnd6N1ozQusSL8Zk8ZPzbgzstwCv8zvT8magzTIH7Qzcjdi2C1hYw71u8FkIbFrXEqHV4BlmbzcmyZkvyw+5/p1IEz2n4oDhzab+Lr+bn33WfQfnxqSjkU9jwoxMb42B8frDuJYPgKMu1xuOtex7qsuecw5tPlwxtXCt3xqTzZ+Wd2OgufbUAN8otD6o0TrPhV1nzhqhuUTxCnOwz4CWuyaEI6deh+qjsEbYjRmJP5Wfxgxu/gcc1y51WikFNA3Qy8D2c4nq5+iiSKwJqv+tBLRZUGP2KPcsoc7nEK8wD/tcc69wbszAoVtjoDmdvdA43Yiiqr3iXIfjrPO8s87nRPUooM0Csrzlqjs2Yv0CbBsPrKf2Ajp3a0yTf+bXbszZUdlhrkLY3YWWW6deR8Wda9D6gf65475E2HXQ8vMs6eFYsyZRunNkvRuTZJ1/FjuNGdx3/2MH16GtIWCqfyDBznkNu+hh4j4hsM3OVnjGZc8512zFmc8ztOcAnVaPY25Mt+WYdGOA7fbsmNBS5Q5oOmhojRAaZ60QGgdXVH0UsOs1W1FpxStg10PLrYd2BiQdBrB5AFz/tcMyf20O9I3ZTvNLd+D2/5W6KhKvpzFK/WcQ2FfS9UrvWoXWJ1oH+3xouWtC9yhX+CzUWaHcAdcZc2PkUhEXY6C5B3Q50D+U4Jh30ZpAq63p8OVbEsJVD42DHT0MGudzouY5zMNYb43QfYkXYyScsczflUZL0H/yzTVy7iafhWfOZ6Hq5xCfAfRvS2uzXuXQet6h9wxoM4HqkXNjSldW8vLbNdBvFFq+6i4vuNbgyvmGPMBnobkKVT+HdWdeZ2BxWFdhpTGXOD98K/dWrn/GrPnlpZtQpJMWiT+Ha4nuNefzCCuduafo9+VnZJ9rFaZubky6Efk0JszI9PLhmyvmVUzOza4lWnfHWZPomcLknYtXeK5yxxPOmlfomcK5MXKhiEcfvtnnW6zQN5L6M+dzYs7KXufWWmc+0bUKK90rbm5MOhT5NCbMyLR/+Hpdv4o5zGtcca5V+OqZ7rEu51f5U925188Rzo05u/Pr3I2RS1+JX/0vwbdXYdXs95A197rmszB1zq3zOVE9iuSqvBtTFT+ZuxgjN+/iq2b59ir0rKzdcX5fld61Cj0zMWdUPRdjsvlf539B4zRmcIlvNcYr+WpNrTMO3lunc57yXniRSKtImc6KV9xbjcmH/en5W43RTSi+Y8rdFlU1PU+Rz9RZUemtc01oLvGtxuTgPz2fxgxu8GKMVvAuBnMOtNbTcSish5y9Hh+9RrPU7NrTuZW+4i7G6GEzlv0v3OzaU7wzL2/vnOf8aob1d7q7mma67lniHBXnWuLcmHQj8mlMmJHpPwAAAP//EROfywAAAAZJREFUAwCxj0ZHt14inAAAAABJRU5ErkJggg=="
                style="display: block;">
        </div>
        <div id="printdate" style="text-align: left;">打印时间：{{ currentTime }}</div>
        <div>
            <table class="gridtable">
                <thead>
                    <tr>
                        <th style="width:14%">退货单号</th>
                        <!--<th style="width:16%">货损货差申请单号</th>-->
                        <th style="width:14%">门店编码</th>
                        <th style="width:14%">厅店名称</th>
                        <th style="width:14%">仓库名称</th>
                        <th style="width:14%">物流单号</th>
                        <th style="width:14%">物流商</th>
                        <th style="width:14%">创建时间</th>
                    </tr>
                </thead>
                <tbody id="data-main">
                    <tr>
                        <td>{{ info.code }}</td>
                        <td>{{ info.dealerCode }}</td>
                        <td>{{ info.dealerName }}</td>
                        <td>{{ info.warehouseName }}</td>
                        <td>{{ info.logisticsOrderNo }}</td>
                        <td>{{ info.logisticsProvider }}</td>
                        <td>{{ info.createTime }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style=" text-align:left; margin: 20px 0;">
            <h4>退货单明细：</h4>
        </div>
        <div class="el-card__body">
            <table class="gridtable print-repeat-header">
                <thead class="print-header">
                    <tr id="data-title">
                        <th>厅店入库单号</th>
                        <th>采购订单号</th>
                        <th>备件编码</th>
                        <th>备件名称</th>
                        <th>备件数量</th>
                    </tr>
                </thead>

                <tbody id="data-list">
                    <tr v-for="item in tableData" :key="item.id">
                        <td>{{item.inboundOrderCode}}</td>
                        <td>{{item.purchaseOrderCode}}</td>
                        <td>{{item.partCode}}</td>
                        <td>{{item.partName}}</td>
                        <td>{{item.returnQty}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
// 对应业务的接口
import { getDetail, returnOrderPage } from '@/api/sparepart/return/returnOrder/index';

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
        returnOrderId: this.id
      };
      const res = await returnOrderPage(params);
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
<style lang="scss" scoped>
// 已经在index.vue中注入公共样式，若样式不正常，视情况修改

table.gridtable {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    width: 100%;
}

table.gridtable th {
    border-width: 1px;
    padding: 10px;
    border-style: solid;
    border-color: #666666;
    background-color: #dedede;
    text-align: center;
}

table.gridtable td {
    border-width: 1px;
    padding: 10px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
    text-align: center;
}

#btn_div_bottom {
    width: 100%;
    height: 40px;
    margin: 0 auto;
    position: fixed;
    bottom: 0px;
    background: #f8f8f8;
    text-align: right;
}

#btn_div_bottom span {
    display: inline-block;
    padding: 5px 15px 5px 5px;
    cursor: pointer;
    font-size: 13px;
    color: #444444;
    margin-right: 10px;
    margin-top: 7px;
    width: 60px;
}

#btn_div_bottom span:hover {
    background: #C2E5F9;
}

#btn_div_bottom span img {
    background: transparent url(/_imgs/ribbon/entity32_4204.png) no-repeat scroll -581px -37px;
    width: 16px;
    height: 16px;
    overflow: hidden;
    border: none;
    vertical-align: top;
    margin-right: 6px;
    margin-top: 4px;
}

.print-repeat-header {
    border-collapse: collapse;
    width: 100%;
}

.print-header {
    display: table-header-group; /* 在打印时强制将thead显示在每页顶部 */
}

.print-header th {
    background-color: #ecf5ff !important; /* 确保表头背景色在打印时可见 */
    font-weight: bold;
}

// 打印样式优化
@media print {
    .print-header {
        display: table-header-group !important;
    }

    /* 防止在行中间分页 */
    .print-repeat-header tr {
        page-break-inside: avoid;
    }

    /* 确保表头始终显示在每页顶部 */
    .print-header tr {
        page-break-before: auto;
        page-break-inside: avoid;
    }

    /* 对于tbody中的内容，每几行可以分页 */
    #data-list tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }
}

.el-card__body {
    padding: 5px 8px;
    word-break: break-all;
}
</style>
