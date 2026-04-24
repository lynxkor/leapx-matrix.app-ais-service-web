<!--
  开发步骤：
  1. 拷贝本页面代码，重命名为新打印模版页面
  2. 从老销服拷贝打印页面，拷贝并替换#printArea区域
  3. 所有有id标签的地方，修改为vue模版代码动态字段
  4. 开发接口获取数据
-->
<template>
    <!-- 以下内容请从销服老系统对应模块拷贝，修改动态字段  -->
    <div id="printArea" class="el-card">
        <div class="el-card__header" style="text-align: center;">
            <h1 id="print_title" style="margin-bottom:20px">{{ info.dealerName }}厅店备件入库单&nbsp;</h1>
            <span id="dt" style="float:left;margin-top:-30px">打印时间：{{ currentTime }}</span>
            <span id="dh" style="float:right;margin-top:-30px">入库单号：{{ info.code }}</span>
        </div>
        <div class="el-card__body">
            <table>
                <thead>
                    <tr>
                        <th>入库单号</th>
                        <th>厅店名称</th>
                        <th>厅店入库类型</th>
                        <th>仓库名称</th>
                    </tr>
                </thead>
                <tbody id="data-main">
                    <tr>
                        <td>{{ info.code }}</td>
                        <td>{{ info.dealerName }}</td>
                        <td>{{ info.inboundTypeLabel }}</td>
                        <td>{{ info.warehouseName }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="el-card__header">
            <h3>本次厅店入库单详细如下：</h3><br>
            <span id="test" style="font-size:15px">合计品项：1,合计数量：2，合计原总价：1200，合计折后总价：1200</span>
        </div>
        <div class="el-card__body">
            <table class="print-repeat-header">
                <thead class="print-header">
                    <tr id="data-title">
                        <th>备件编码</th>
                        <th>备件名称</th>
                        <th>入库数量</th>
                        <th>库位编码</th>
                        <th>原单价</th>
                        <th>原总价</th>
                        <th>折后单价</th>
                        <th>折后总价</th>
                    </tr>
                </thead>

                <tbody id="data-list">
                    <tr v-for="item in tableData" :key="item.id">
                        <td>{{item.sparePartCode}}</td>
                        <td>{{item.sparePartName}}</td>
                        <td>{{item.inboundQty}}</td>
                        <td>{{item.cashUnitPrice}}</td>
                        <td>{{item.cashUnitPrice}}</td>
                        <td>{{item.cashAmount}}</td>
                        <td>{{item.rebateUnitPrice}}</td>
                        <td>{{item.rebateAmount}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="text-align:right"><span id="WarehousePeople" style="margin-right:10px">入库人：{{ info.inboundOperatorName }}</span></div>
    </div>
</template>

<script>
// 对应业务的接口
import { getDetail, inboundOrderDetail } from '@/api/sparepart/inbound/inboundOrder/index';

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
        inboundOrderId: this.id
      };
      const res = await inboundOrderDetail(params);
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

.print_title {
    margin-bottom: 10px;
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
</style>
