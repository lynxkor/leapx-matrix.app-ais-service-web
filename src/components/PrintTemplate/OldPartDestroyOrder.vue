<template>
  <div id="printArea" style="width:100%; text-align:center">
    <!-- 标题：年/月取销毁单创建时间 -->
    <div class="print-title">《零跑汽车旧件{{ titleYear }}年{{ titleMonth }}月销毁清单》</div>
    <table class="gridtable">
      <tbody>
        <tr>
          <td colspan="7" class="dealer-row">门店名称：{{ form.dealerName }}</td>
        </tr>
      </tbody>
    </table>
    <table class="gridtable">
      <thead>
        <tr>
          <th style="width:110px">保修类型</th>
          <th style="width:150px">旧件编码</th>
          <th>旧件名称</th>
          <th style="width:80px">零件单价</th>
          <th style="width:70px">旧件数量</th>
          <th style="width:90px">是否已完成销毁</th>
          <th style="width:90px">备注</th>
        </tr>
      </thead>
      <tbody>
        <!-- 保修类型分组行，同类型合并单元格 -->
        <template v-for="group in groupedRows">
          <tr v-for="(row, idx) in group.rows" :key="row.id">
            <td v-if="idx === 0" :rowspan="group.rows.length">{{ group.typeName }}</td>
            <td>{{ row.oldPartCode }}</td>
            <td>{{ row.oldPartName }}</td>
            <td>{{ row.partUnitPrice }}</td>
            <td>{{ row.oldPartQuantity }}</td>
            <td></td>
            <td></td>
          </tr>
        </template>
        <!-- 汇总：应销毁取数量合计，实际/未完成留空线下手写 -->
        <tr>
          <td :rowspan="3">汇总</td>
          <td>本次应销毁</td>
          <td colspan="5">{{ totalQuantity }}件</td>
        </tr>
        <tr>
          <td>本次实际销毁</td>
          <td colspan="5"></td>
        </tr>
        <tr>
          <td>未完成销毁</td>
          <td colspan="5"></td>
        </tr>
      </tbody>
    </table>
    <!-- 底部栏：全部留空线下手写 -->
    <div class="print-footer">
      <span>具体销毁时间(年/月/日/时/分)：</span>
      <span>申请人：</span>
      <span>服务店长签字：</span>
      <span>签字日期：</span>
    </div>
  </div>
</template>
<script>
import { getDetail } from '@/api/claimreturn/oldpart/destroy/oldPartDestroyOrder/index';
import {
  getList, // 旧件库存详情分页查询
} from '@/api/claimreturn/oldpart/inventory/oem/index';
import { pinyin } from 'pinyin-pro';
export default {
  name: 'PrintOldPartDestroyOrder',
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
    };
  },
  computed: {
    // 标题年/月取销毁单创建时间
    titleYear () {
      return (this.form.createTime || '').split(' ')[0].split('-')[0] || '';
    },
    titleMonth () {
      const m = (this.form.createTime || '').split(' ')[0].split('-')[1] || '';
      return String(Number(m));
    },
    // 保修类型分组（已排序数据按类型连续切分），组内按【零件编码+零件单价】合并，数量累加
    groupedRows () {
      const groups = [];
      let current = null;
      this.tableData.forEach((row) => {
        if (!current || current.typeName !== row.repairItemTypeName) {
          current = { typeName: row.repairItemTypeName, rows: [] };
          groups.push(current);
        }
        const merged = current.rows.find((r) =>
          r.oldPartCode === row.oldPartCode && r.partUnitPrice === row.partUnitPrice);
        if (merged) {
          merged.oldPartQuantity = (Number(merged.oldPartQuantity) + Number(row.oldPartQuantity || 0)).toFixed(2);
        } else {
          current.rows.push({ ...row, oldPartQuantity: Number(row.oldPartQuantity || 0).toFixed(2) });
        }
      });
      return groups;
    },
    // 本次应销毁 = 旧件数量列合计
    totalQuantity () {
      return this.tableData.reduce((sum, row) => sum + Number(row.oldPartQuantity || 0), 0);
    },
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
      getDetail(this.id).then((res) => {
        this.form = res || {};
      });
      getList({
        oldPartDestroyOrderId: this.id,
        pageNum: 1,
        pageSize: 5000
      }).then((res) => {
        this.tableData = this.sortPrintDetail(res.records || []);
      });
    },
    // 打印明细排序：保修类型拼音首字母 A-Z → 零件单价倒序 → 旧件唯一码正序 → 添加时间倒序
    sortPrintDetail (list) {
      return [...list].sort((a, b) => {
        const typeCompare = this.compareByText(a.repairItemTypeName || '', b.repairItemTypeName || '');
        if (typeCompare !== 0) {
          return typeCompare;
        }
        const priceA = Number(a.partUnitPrice || 0);
        const priceB = Number(b.partUnitPrice || 0);
        if (priceA !== priceB) {
          return priceB - priceA;
        }
        const codeCompare = String(a.oldPartUniqueCode || '').localeCompare(String(b.oldPartUniqueCode || ''));
        if (codeCompare !== 0) {
          return codeCompare;
        }
        return String(b.createTime || '').localeCompare(String(a.createTime || ''));
      });
    },
    // 生成排序键：中文转拼音首字母，英文/数字保留原字符，统一大写
    sortKey (str) {
      return pinyin(str, { pattern: 'first', toneType: 'none', type: 'array' })
        .join('')
        .toUpperCase();
    },
    // 基于拼音首字母键做 A-Z 比较
    compareByText (a, b) {
      return this.sortKey(a).localeCompare(this.sortKey(b), 'en', { sensitivity: 'base', numeric: true });
    },
  },
};
</script>
<style lang="scss" scoped>
.print-title {
  padding: 8px;
  font-weight: 800;
  font-size: 16px;
}

.dealer-row {
  text-align: left;
  font-weight: 800;
}

table {
  font-family: verdana, arial, sans-serif;
  font-size: 12px;
  color: #333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

table th,
table td {
  border-width: 1px;
  border-style: solid;
  border-color: #666666;
  text-align: center;
  height: 30px;
  word-wrap: break-word;
  word-break: break-all;
}

table th {
  background-color: #dedede !important;
}

.print-footer {
  display: flex;
  justify-content: space-between;
  /* 右侧留白，给"签字日期"手写留空间 */
  padding: 24px 130px 0 8px;
  font-size: 13px;
}
</style>
