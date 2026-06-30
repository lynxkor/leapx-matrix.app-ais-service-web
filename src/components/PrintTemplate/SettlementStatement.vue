<template>
    <div id="printArea" style="width:1000px; text-align:center;">
        <div>
            <table class="pageTitle">
                <tbody>
                    <tr>
                        <td style="width:30%;text-align:left" id="dealername"></td>
                        <td style="width:40%; text-align:center;" rowspan="3">
                            <h2>结算单</h2>
                        </td>
                        <td style="width:30%; text-align:right" rowspan="3">
                            <img id="logoID"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAfCAYAAAFbkjmmAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAeKADAAQAAAABAAAAHwAAAAAAONyJAAAJ2UlEQVRoBe2aC7BWVRWArxBYaEqmlZECCkhlYRao5OSjAi20mhwaSg0fUZllqb1mnEnSwYG0MbMmqWR8FGlZEmGpUyEiIeEzLbVSUTQfPdEQBazv++9esDicc/+LwNTcuWvmO2vttdY+5+znOeefv6NjM6Vvqf+fovdHaw+BtcU+Hz0X/gHr5EVYa2CbgoHhHpARcDm8A04Bc+4C5YpOtf4YV9YT9k3F/h36lQaQv3eqLXA8gnN4peXlXAeiRdEf7bw72a07s80hg4pxY9G2sT88V8pWGAjbwyPQavezGAa2gxArhRiL8pPFeVEEs27dTnZsLbsPJ/Zi9lmWfAPaiyFrc+cVn/5A/75wVsWn35ypGiG5UtjqkDkY2T+hBC5B/xzs9ythBSi5bti5ftid2eV45galnliIPcC22QV/hjstbG1xzTwOLvEYD6+pP8SFuTP8tTgWoleD+aNhATwPLwN91lX/ExT9yr/B9WjdDmf1KzSKWOkYWFbK56GnwWNwEOwHI8AN4NvwfdgBrgEldhJtL/IZDeQA8AYfsKDkHaTTs+HxNIpL4TfF7Sz2ZvqBd/57mAIHg7Jbp+pwq1KGdqqOT6Od9YPAned6aHWLXSOKOloc5YjnHO24QPgfskKSGcXO9cNuddW6AokrU8UwJ2HEyfWFfXSxoxzaHKVduZU0vXXsPWydHnD11El1aHYn6eG6RHxvh64Wx4PE74UmGU/ALeKWpoTkPwz7l+CCaiduPbbjb9VEnXJECoRP19UQ5bzIjLm1GPOk4krNZX2WB4OiPQ++UWy3lOMg5HsY5oQMwDgZ3KLMbRogQh2LwLrtWJfQ1GBPFou12uA9iU0At7VbYSx4wS+V8ufQe0DIVzGeBnPca919fJh/BPRVG/zx4ke1lT5keA7pD5cl27L0MSnkkDBq9NtqfLqWwIfBhu0Lg+EemFrKPmJnwTRQfGBc1bI6Ov5Q9C7od4EzqSrOkCaxYbEdm+PT0Rkgvp3G7qsdmNOxEKwc6Kuz9V1psEZ2wvcM3FJiE9HmLyrlUPquA/VIiBHGbMneHA8vtsq8S1M5m8bOy46K7Ru0OV3KriVqYiSP6bJGb7C3B3p74P+tB3yDdv36Su6O16Ok7g2pb2mhr/pu47Phg8VXVXbIuKqzUr62Us5Fr/9O8LOknexDwqvgF+0SifuRZjt8g9tIpuCJHdmgz9TYpbM+1mCN+AUZmH9TKusP8QaM+9Gn3h18Pmr7k5DkG/SD0Zidum2xzY9c9VSoio826/m4rRWDEhINvhjHMIh4zolcfb45+YIgltem8priQ7U+KuMc6hNggYEk+n0RCTkJYxL8Gr4VzgZt3XYcad1IivPkBoevmpP9b6SwuGCeX7xRvhBbn9IPwlYPL2VtOaroaPDPKD8AIZGXdcRCx4xxViyHOREInV8tw7cp2h67F/oXom6Uv4hjaHH6hXMbeMN/BF87FW+uTibgHAKXlaB5VUqopa7jaKceVrR70F4Q96Lu8rPOeDvxvdkPgjeAG5AysVO1fhT23fmCUlaNBqf5u8ENsZ1EZzjaQ1Ky6/+lEHFDrn9ffY8voFr7RHSY5Q94iCkSN1yd0rFhmFeVZThOhwEl4AfB1GLvhp4BT5eyve/Ieh47Yfti/wQtY0o5pjTFVu71GhU5h3Ld/eQ0486ojcRA4LDnBjsiEVPXSY7X2VEnN3gczqGQz7m6lFtTr1QyPqrYWVUbvD/Bumtv5Kuu4TxFvIA32U6s4witAr90POd9oIztVOuOPpoUZ8EDLWv9wWs51d3llVM6VccdRXel3CS9j4z5t1d8xlvyFY72htM3j7A3rP/L0E482f1g/vk1yTbI2IgUi1HVH8RNuRSa1vmeKT+dbgPT89VO6Q2yKOQG+8bS4+UltPARiI2oxze4t4G9PdDze8BlPR1c2mdC7/KmE3qSxIMqnpShb6aRB/Skhva0tuT3SlflJ2DkJjRyDLmLwAFfCb6ObQfdlR1JjMnyQvUPGi42Gf93avBLJ+QMjLjuSeHshp5Gjuf2F4mXV/L9+IjXx1ux44uskrbJxaOpEfeqrnuV3eikvrMuhLemiB/0c1NZ0xXsFh1yA8ZS+CTkL5uIq38IE7OjYvs968eB23+d7IDzQyWwHF29p1zHHyC+lhy+sz9Xytei/UHAwfho8b0OPRtGgXmzYA1kOZzCHsUxEP2vHMS2zuTi81defxOYAZ8tPgd3RbGblPcwsxK0T/aq+LyXIck3B/vRVG4yL3B25cFtSqz6/SByJcRqOBT762DHhewXRoO2IaeW2L7oSZAnix9vMcBLsJ1U+XEwn/J4+Bgo/sp7X8va8BBfmqGNOpiXw3yoE1en30wxwPm+Iv84DMniQjgXhmVng30X/roJ4MSJXdD+iT72NGfDNzW6KU84wFtCfsVJzoH8y9GmnNfOjxUX9XLZAZHss87qSEa7bYVk+0Cc8+DNEUT7he3gOCH9FewtcAycBcrCTtV43IfIYtgW/gRO0KdAGQzdWTRPklc3wPqcULfBa0B5CLyGP4JfBFNAuR3e1LIaDltqgBtO36XbbU1C7sRwu3Yg/HFqOoS4QzgQN4MdGyt1LvanoCpOhm2K81K0g6e8Gv7SstYfnDTL4PH1rraWHfticIX3gR3hKbgOhkI7eZiEKxqSvEe/VrL4OLP9VXGi5cmc49+lcKI3978SZ743l7GTLoThcDXsDQPBZ7md8j6YD7mOtivy8xDixHV13w3GQx7FsDw4HOhdwbyzk6875k4k/Rh8HsZgjcP23pu4itgwOAROhjrxHp2cTcxMlZxoTXknmmdHVOWnOO6B0+CaarCm/H58vlw4mzdFnH1Pw6lQfV47qEeCs1BxAO1IV9uNEPIExhdgFfQLJ9pG27b+yafpYD5W8bmiX1/xWTyqxpddtnlUcfjs7Y7kyVaXvwvO2G3q4vpGp8Bu2PZfk6yqG2CTR8I8cBt6FppkLIEfNQXb+B1c5Xzo27LaH7zfyXA2uIIc+EtgKayFduJg2p6uJuOxxH02PwjTwAnv8zLLaymcUBxu7efm4GbY9slv29Qfn+Ir2+Q78VudOwXtanCGZbalrDhDs//ilnf9/wtzbDkxO+mFyqFUdMDinDdg+8kRZbf2dqvL1Rz56mfgdMiPpJtLjp30HrDjMgtK3Po7QxYnf5z/6BxoY5+R6q3Adjdym98UuYjkuLYvYl2KW1lV9sThjHwvxAp2gKdDyCyM48EVfBPMBp+BD8OWFLdYt6S4z0ex7+/mBcaQ56q2E55vqDMI/9CGmG7r3wFOgiwHUegL+hfnQDfsHckZBbF7umqXdKNepAzAEMVHlhNls8Xnccwa9czNPmPvCXp7oLcHNr8H/gs3ouDsSvwOLwAAAABJRU5ErkJggg==">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align:left" id="parentdealername"></td>
                    </tr>
                    <tr>
                        <td style="text-align:left" id="dealerphone"></td>
                    </tr>
                    <tr>
                        <td style="text-align:left" id="dealeraddress"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <table class="gridtable">
                <tbody>
                    <tr>
                        <td
                            style="width:20px; padding:3px;border-right-width:0px; background-color:#00B2F2; vertical-align:middle">
                            车辆状态确认</td>
                        <td style="padding:0px;border:0px;">
                            <table style="width:100%;" class="gridtable">
                                <tbody>
                                    <tr>
                                        <td style="width:100px">开单时间：</td>
                                        <td style="width:150px" id="createdon">{{info.createTime}}</td>
                                        <td style="width:100px">单据编号：</td>
                                        <td style="width:150px" id="mcs_name">{{info.code}}</td>
                                        <td style="width:100px">VIN码：</td>
                                        <td style="width:100px;" id="mcs_vehownerid">{{info.vin}}</td>
                                        <td style="width:100px">结算时间：</td>
                                        <td style="width:100px;" id="mcs_statementon">{{info.settlementTime}}</td>
                                    </tr>
                                    <tr>
                                        <td>车主：</td>
                                        <td id="mcs_carcustomername">{{info.customerName}}</td>
                                        <td>电话：</td>
                                        <td id="mcs_carcustomerphone">todo</td>
                                        <td>车牌号码：</td>
                                        <td id="mcs_carplate">{{info.plateNumber}}</td>
                                        <td>型号：</td>
                                        <td id="_mcs_carmodel_value_formatted">{{info.vehicleModelName}}</td>
                                    </tr>
                                    <tr>
                                        <td>客户姓名</td>
                                        <td id="mcs_customername"></td>
                                        <td>客户电话</td>
                                        <td id="mcs_customerphone">{{ info.customerContactInfo }}</td>
                                        <td>当前里程：</td>
                                        <td id="mcs_nowmileage">{{ info.currentMileage }}</td>
                                        <td>销售日期：</td>
                                        <td id="mcs_saleson">{{ info.saleDate }}</td>
                                    </tr>
                                    <tr>
                                        <td>客户地址：</td>
                                        <td colspan="5" id="mcs_customeraddr" style="text-align:left"></td>
                                        <td>客户经理：</td>
                                        <td id="mcs_sheetcreateduserid">{{ info.orderCreatorName }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:20px; padding:3px;border-right-width:0px; background-color:#CA8C00;"
                            rowspan="7">
                            零售结算单</td>

                    </tr>
                    <tr>
                        <td style="padding:0px;border:0px;">
                            <table class="gridtable">
                                <tbody>
                                    <tr>
                                        <td
                                            style="border-top-width:0px;border-bottom-width:0px;background-color:#D9ECF8;text-align:left">
                                            维修备件</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0px;border:0px;">
                            <table class="gridtable">
                                <thead>
                                    <tr>
                                        <th style="width:60px">序号</th>
                                        <th style="width:150px">备件代码</th>
                                        <th style="width:150px">备件名称</th>
                                        <th style="width:100px">数量</th>
                                        <th style="width:100px">单价</th>
                                        <th style="width:100px">优惠金额</th>
                                        <th style="width:100px">备件金额</th>
                                    </tr>
                                </thead>
                                <tbody id="part-list">
                                    <tr v-for="(item, index) in tableData" :key="item.id">
                                        <td>{{index + 1 }}</td>
                                        <td>{{item.sparePartCode}}</td>
                                        <td>{{item.sparePartName}}</td>
                                        <td>{{item.qty}}</td>
                                        <td>¥{{item.unitPrice}}</td>
                                        <td>¥{{item.discountAmount}}</td>
                                        <td>¥{{item.payableAmount}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0px;border:0px;">
                            <table class="gridtable">
                                <tbody>
                                    <tr>
                                        <td
                                            style="border-top-width:0px;background-color:#D9ECF8;border-bottom-width:0px;text-align:left">
                                            结算说明</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0px;border:0px;">
                            <table class="gridtable">
                                <tbody>
                                    <tr>
                                        <td rowspan="4" style="width:100px;border-bottom-width:0px">费用结算：</td>
                                        <td>费用合计：</td>
                                        <td id="mcs_orderamount">¥{{info.totalAmount}}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>优惠金额小计：</td>
                                        <td id="mcs_discountamount">¥{{info.discountTotalAmount}}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style="border-bottom-width:0px">应付金额合计：</td>
                                        <td style="border-bottom-width:0px" id="mcs_payableamount_formatted">¥{{info.payableTotalAmount}}</td>
                                        <td style="border-bottom-width:0px">未结金额合计：</td>
                                        <td style="border-bottom-width:0px" id="mcs_remainpayableamount">¥{{info.remainingPayableAmount}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0px;border:0px;">
                            <table class="gridtable">
                                <tbody>
                                    <tr>
                                        <td style="width:120px; height:40px">客户经理确认：</td>
                                        <td></td>
                                        <td style="width:120px;">收款人确认：</td>
                                        <td></td>
                                        <td style="width:120px;">客户签字：</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style="border-bottom-width:0px">日期：</td>
                                        <td style="border-bottom-width:0px"></td>
                                        <td style="border-bottom-width:0px">日期：</td>
                                        <td style="border-bottom-width:0px"></td>
                                        <td style="border-bottom-width:0px">日期：</td>
                                        <td style="border-bottom-width:0px"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align:left" id="disclaimer">
                            1、质量说明：零跑汽车C01增程-316智享版车型《保修保养手册》规定，用户自费从零跑汽车服务中心或授权服务店购买并实施安装的原厂纯正配件，自购买发票开具之日起，进入备件保修期。其中易损耗零部件遵循易损耗零部件保修政策执行（易损耗零部件清单详见《保修保养手册》，除易损耗零部件以外的原厂备件（包括原厂附件）质保期为1年或20000公里（以先到者为准）；<br>
                            2、以上项目中“工时代码”为“L”代表原厂服务或原厂零件，为“E”代表外包或非原厂零配件。<br>
                            3、此单若持银行卡结算，本司不分卡主，均由顾客确认后并承担刷卡之全部责任。</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
// 对应业务的接口
import { getDetail, retailOrderDetailPage } from '@/api/sparepart/sale/retailOrder/index';

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
        retailOrderId: this.id
      };
      const res = await retailOrderDetailPage(params);
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
    background-color: #B4D8EF;
    text-align: center;
}

table.gridtable td {
    border-width: 1px;
    padding: 8px;
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

.subTitle {
    text-align: center;
}

.pageTitle {
    width: 100%;
    border-style: solid;
    border-color: #666666;
    border-width: 1px;
    padding: 10px;
    border-bottom-width: 0px;
    font-family: verdana, arial, sans-serif;
    font-size: 11px
}

.detail {
    border-width: 1px;
    border-style: solid;
    border-color: #666666;
    padding: 5px;
    border-top-width: 0px;
    border-left-width: 0px;
}

.detail_two {
    border-width: 1px;
    border-style: solid;
    border-color: #666666;
    padding: 5px;
    border-top-width: 0px;
    border-left-width: 0px;
}

table.gridtable120 {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    width: 100%;
}

table.gridtable120 td {
    border-width: 1px;
    padding: 5px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
    text-align: center;
    border-left-width: 0px;
}

table.grid120 {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    border-collapse: collapse;
    width: 100%;
}

table.grid120 td {
    border-width: 0px;
    padding: 8px;
    background-color: #ffffff;
    text-align: center;
}
</style>
