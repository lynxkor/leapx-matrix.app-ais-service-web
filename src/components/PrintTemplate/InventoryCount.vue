<template>
    <div id="printArea" style="width:1050px; text-align:center">
        <div style="margin-bottom: 20px;">
            <h1 id="print_title">{{info.dealerName}}{{info.warehouseName}}盘点任务单</h1>
        </div>
        <div>
            <table class="gridtable">
                <thead>
                    <tr>
                        <th style="width:14%">盘点单号</th>
                        <th style="width:14%">仓库名称</th>
                        <th style="width:14%">盘点类型</th>
                        <!--<th style="width:14%">创建用户</th>
                        <th style="width:14%">创建时间</th>-->
                        <th style="width:16%">备注</th>
                        <th style="width:14%">计划盘点时间</th>
                    </tr>
                </thead>
                <tbody id="data-main">
                    <tr>
                        <td>{{info.code}}</td>
                        <td>{{info.warehouseName}}</td>
                        <td>{{info.stockTypeLabel}}</td>
                        <!--<td>{{data.createUser}}</td>
                        <td>{{data.createTime}}</td>-->
                        <td>{{info.remark}}</td>
                        <td>{{info.planStartTime}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style=" text-align:left; margin: 20px 0;">
            <h3>本次盘点详细如下：</h3>
        </div>
        <div>
            <table class="gridtable">
                <thead>
                    <tr>
                        <th>零件号</th>
                        <th>零件名称</th>
                        <!--<th>库区</th>-->
                        <th>库位</th>
                        <!--<th>库存数量</th>-->
                        <th>实盘数量</th>
                        <th>其中损坏数量</th>
                        <th>操作人</th>
                        <!--<th>操作时间</th>-->
                        <!--<th>盘点是否完成</th>-->
                    </tr>
                </thead>
                <tbody id="data-list">
                    <tr v-for="item in tableData" :key="item.id">
                        <td>{{item.sparePartCode}}</td>
                        <td>{{item.sparePartName}}</td>
                        <td>{{item.locationName}}</td>
                        <td>{{item.actualQty}}</td>
                        <td>{{item.outboundIsLabel}}</td>
                        <td>{{item.operatorName}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
// 对应业务的接口
import { getDetail, stockTakingDetailPage } from '@/api/sparepart/warehouse/stockTaking/index';

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
        stockTakingId: this.id
      };
      const res = await stockTakingDetailPage(params);
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
</style>
