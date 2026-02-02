<!--
  开发步骤：
  1. 拷贝本页面代码，重命名为新打印模版页面
  2. 从老销服拷贝打印页面，拷贝并替换#printArea区域
  3. 所有有id标签的地方，修改为vue模版代码动态字段
  4. 开发接口获取数据
-->
<template>
    <!-- 以下内容请从销服老系统对应模块拷贝，修改动态字段  -->
    <div id="printArea" style="width:1110px;">
        <div class="divMain">
            <div class="div_tag">
                <table style="page-break-inside: avoid;">
                    <tbody>
                        <tr>
                            <td colspan="2"><img
                                    src="data:image/png;base64,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">
                            </td>
                            <td colspan="2" class="tdtitle">退货备件标签</td>
                        </tr>
                        <tr style="font-size: 14px;height: 50px;">
                            <td>门店代码：</td>
                            <td>950000</td>
                            <td>门店名称：</td>
                            <td>海外拓展部</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">备件信息：</td>
                        </tr>
                        <tr style="font-size: 14px;">
                            <td>零件编码：</td>
                            <td>C11ST100101</td>
                            <td>零件名称：</td>
                            <td>C11ST100101</td>
                        </tr>
                        <tr>
                            <td>数量：</td>
                            <td>1 - 1</td>
                            <td colspan="2" rowspan="6">
                                <div class="dv_qrcode" id="dv_qrcode_0_1" style="padding:20px;" data="C11ST100101"
                                    title="C11ST100101"><canvas width="180" height="180"
                                        style="display: none;"></canvas><img
                                        src="data:image/png;base64,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"
                                        style="display: block;"></div>
                            </td>
                        </tr>
                        <tr style="height: 30px;">
                            <td style="font-weight: bold;">订单信息：</td>
                        </tr>
                        <tr style="font-size: 14px;height: 40px;">
                            <td>退货单号：</td>
                            <td>RO-250310105512533063</td>
                        </tr>
                        <tr style="font-size: 14px;height: 40px;">
                            <td>退货单明细：</td>
                            <td>ROD-250310105658393664</td>
                        </tr>
                        <tr style="font-size: 14px;height: 40px;">
                            <td>厅店入库单号：</td>
                            <td>SI-250307141407285876</td>
                        </tr>
                        <tr style="font-size: 14px;height: 40px;">
                            <td>采购订单号：</td>
                            <td>SO-250114200908955080</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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

.divMain {
    display: grid;
    grid-template-columns: repeat(2, 1fr);  // 创建两列网格
    gap: 10px;  // 设置间距
    margin: 10px 0;
}

.div_tag {
    box-sizing: border-box;
    page-break-inside: avoid;
    border: 1px solid #222;
}

.div_tag:nth-child(2n+1) {
    border-right-style: dashed;
}

.div_tag:nth-child(2n) {
    border-left-style: none;
}

.tdtitle {
    padding-left: 10px;
    font-size: 23px;
    font-weight: bold;
    padding-bottom: 10px;
}

element.style {
    position: fixed;
    top: 20px;
    right: 20px;
}

#btn_div_bottom {
    position: fixed;
    float: right;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background: #dddddd;
}
</style>
