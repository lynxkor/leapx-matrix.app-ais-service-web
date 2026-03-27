<template>
    <div class="el-card is-never-shadow" id="printArea" visible="visible" modal="false" show-close="false"><!---->
        <div class="el-card__body">
            <div class="el-row">
                <div class="el-col el-col-4"><img id="logoID"
                        src="data:image/png;base64,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">
                </div>
                <div class="el-col el-col-20"
                    style="font-size: 18px; font-weight: 600; text-align: center; height: 45px; line-height: 45px;">
                    回运粘贴标识
                </div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-5">索赔单号</div>
                <div class="el-col el-col-7">{{ info.code }}</div>
                <div class="el-col el-col-5">SO单号</div>
                <div class="el-col el-col-7">{{ info.purchaseOrderCode }}</div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-5">箱号</div>
                <div class="el-col el-col-7"></div>
                <div class="el-col el-col-5">箱数</div>
                <div class="el-col el-col-7"></div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-5">门店代码</div>
                <div class="el-col el-col-7">{{ info.dealerCode }}</div>
                <div class="el-col el-col-5">联系人</div>
                <div class="el-col el-col-7">{{ info.receiverName }}</div>
            </div>
            <div class="el-row">
                <div class="el-col el-col-5">门店名称</div>
                <div class="el-col el-col-7">{{ info.dealerName }}</div>
                <div class="el-col el-col-5">电话</div>
                <div class="el-col el-col-7">{{ info.receiverPhone }}</div>
            </div>
            <div class="last-row el-row">
                <div class="el-col el-col-5">收货地址</div>
                <div class="el-col el-col-19">{{ info.address }}</div>
            </div>
            <div class="table-section" style="margin-top: 30px;">
                <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
                    table-layout="fixed" style="width: 100%;">
                    <div class="hidden-columns">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="el-table__header-wrapper">
                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header"
                            style="width: 994px;">
                            <colgroup>
                                <col name="el-table_1_column_1" width="102">
                                <col name="el-table_1_column_2" width="198">
                                <col name="el-table_1_column_3" width="248">
                                <col name="el-table_1_column_4" width="99">
                                <col name="el-table_1_column_5" width="347">
                                <col name="gutter" width="0">
                            </colgroup>
                            <thead class="has-gutter">
                                <tr class="">
                                    <th colspan="1" rowspan="1"
                                        class="el-table_1_column_1  is-center   is-leaf el-table__cell"
                                        style="background: rgb(245, 247, 250); color: rgb(96, 98, 102); font-weight: bold;">
                                        <div class="cell">序号</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_1_column_2     is-leaf el-table__cell"
                                        style="background: rgb(245, 247, 250); color: rgb(96, 98, 102); font-weight: bold;">
                                        <div class="cell">备件编码</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_1_column_3     is-leaf el-table__cell"
                                        style="background: rgb(245, 247, 250); color: rgb(96, 98, 102); font-weight: bold;">
                                        <div class="cell">备件名称</div>
                                    </th>
                                    <th colspan="1" rowspan="1"
                                        class="el-table_1_column_4  is-center   is-leaf el-table__cell"
                                        style="background: rgb(245, 247, 250); color: rgb(96, 98, 102); font-weight: bold;">
                                        <div class="cell">数量</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="el-table_1_column_5     is-leaf el-table__cell"
                                        style="background: rgb(245, 247, 250); color: rgb(96, 98, 102); font-weight: bold;">
                                        <div class="cell">备注</div>
                                    </th>
                                    <th class="el-table__cell gutter" style="width: 0px; display: none;"></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="el-table__body-wrapper is-scrolling-none">
                        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 994px;">
                            <colgroup>
                                <col name="el-table_1_column_1" width="102">
                                <col name="el-table_1_column_2" width="198">
                                <col name="el-table_1_column_3" width="248">
                                <col name="el-table_1_column_4" width="99">
                                <col name="el-table_1_column_5" width="347">
                            </colgroup>
                            <tbody>
                                <tr class="el-table__row" v-for="item, index in tableData" :key="item.id">
                                    <td rowspan="1" colspan="1" class="el-table_1_column_1 is-center  el-table__cell">
                                        <div class="cell">{{ index + 1 }}</div>
                                    </td>
                                    <td rowspan="1" colspan="1" class="el-table_1_column_2   el-table__cell">
                                        <div class="cell">{{ item.sparePartCode }}</div>
                                    </td>
                                    <td rowspan="1" colspan="1" class="el-table_1_column_3   el-table__cell">
                                        <div class="cell">{{ item.sparePartName }}</div>
                                    </td>
                                    <td rowspan="1" colspan="1" class="el-table_1_column_4 is-center  el-table__cell">
                                        <div class="cell">{{ item.claimQty }}</div>
                                    </td>
                                    <td rowspan="1" colspan="1" class="el-table_1_column_5   el-table__cell">
                                        <div class="cell"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="el-table__column-resize-proxy" style="display: none;"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getDetail, getDetailList } from '@/api/sparepart/claim/sparePartClaim/index';
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
        claimOrderId: this.id
      };
      const res = await getDetailList(params);
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
span.underline {
    text-decoration: underline;
}

.el-card {
    border: none;
}

.el-card__body {
    padding: 10px;
}

.el-row {
    margin-bottom: 1px;
}

.el-col {
    min-height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-top: 1px solid #111;
    border-left: 1px solid #111;
    font-size: 14px;
}

.el-col:last-child {
    border-right: 1px solid #111;
}

.el-row:last-child {
    border-bottom: 1px solid #111;
}

.none_border {
    border: none;
}

.last-row {

    border-bottom: 1px solid #111;

}

.table-section {
    margin-top: 30px;
}
</style>
