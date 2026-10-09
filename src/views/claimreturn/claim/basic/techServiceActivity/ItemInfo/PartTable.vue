<template>
  <div>
  <vxe-table
    ref="editTable"
    :data="tableData"
    stripe
    show-overflow
    resizable
    :row-config="{ isHover: true }"
    border="inner"
    size="medium"
    min-height="0"
    max-height="400px"
    :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
    >
    <vxe-column field="partCode" title="零件编码" width="160"></vxe-column>
    <vxe-column field="partName" title="零件名称" width="160"></vxe-column>
    <vxe-column field="quantity" width="160">
      <template #header>
        <span class="ais-required">数量</span>
      </template>
      <template #default="{ row, rowIndex }">
        <el-input
          v-if="eidtRowIndex === rowIndex"
          v-model="row.quantity"
          placeholder="请输入"
          @change="handleQuantityChange(row, rowIndex)"
          />
        <span v-else>{{ row.quantity }}</span>
      </template>
    </vxe-column>
    <template v-if="isServiceCareActivity">
      <vxe-column field="unitPrice" title="单价" width="160"></vxe-column>
      <vxe-column title="优惠金额" width="160">
        <template #default="{ row, rowIndex }">
          <el-input-number
            v-if="eidtRowIndex === rowIndex"
            v-model="row.discountAmount"
            :min="0"
            :max="row.quantity * row.unitPrice"
            size="small"
            placeholder="请输入"
            @change="handleDiscountAmount(row)"
            />
          <span v-else>{{ row.discountAmount }}</span>
        </template>
      </vxe-column>
      <!-- 【金额】=【数量】*【单价】-【优惠金额】（变量发生变化，要实时计算） -->
      <vxe-column field="amount" title="金额" width="160"></vxe-column>
      <vxe-column title="门店支持费用" width="160">
        <template #default="{ row, rowIndex }">
          <el-input v-if="eidtRowIndex === rowIndex" v-model="row.dealerSupportAmount" placeholder="请输入"/>
          <span v-else>{{ row.dealerSupportAmount }}</span>
        </template>
      </vxe-column>
    </template>
    <vxe-column field="allowDelete" title="是否允许删除" width="160">
      <template #default="{ row, rowIndex }">
        <el-switch
          v-if="eidtRowIndex === rowIndex"
          v-model="row.allowDelete"
          active-value="1"
          inactive-value="0"
          >
        </el-switch>
        <span v-else>{{ row.allowDeleteLabel }}</span>
      </template>
    </vxe-column>
    <template v-if="!isServiceCareActivity">
      <vxe-column field="mainPart" title="是否主因件" width="160">
        <template #default="{ row, rowIndex }">
          <el-switch
            v-if="eidtRowIndex === rowIndex"
            v-model="row.mainPart"
            active-value="1"
            inactive-value="0">
          </el-switch>
          <span v-else>{{ row.mainPartLabel }}</span>
        </template>
      </vxe-column>
      <vxe-column field="oldPartCode" title="旧件编码" width="160">
        <template #default="{ row, rowIndex }">
          <fetch-select
            v-if="eidtRowIndex === rowIndex"
            ref="oldPartSelect"
            filterable
            clearable
            remote
            reserve-keyword
            v-model="editingOldPartKey"
            :remote-method="partRemote"
            :params="row.oldPartName"
            :format="formatPartOptions"
            @change="(value, option) => onOldPartCodeChange(row, value, option)"
            placeholder="请输入"
            value-key="partAndSupplierId"
            label-key="displayLabel"
          >
            <template #option="{ item }">
              <span v-if="item.disabled">{{ item.placeholder }}</span>
              <span v-else>{{ item.displayLabel }}</span>
            </template>
          </fetch-select>
          <span v-else>{{ row.oldPartCode }}</span>
        </template>
      </vxe-column>
      <vxe-column field="oldSupplierId" title="旧件供应商" width="160">
        <template #default="{ row, rowIndex }">
          <el-select
            v-if="eidtRowIndex === rowIndex"
            v-model="row.oldSupplierId"
            placeholder="请选择"
            @change="(val) => onOldSupplierChange(val, row)"
            >
            <el-option
              v-for="item in row.__options__?.oldSupplierId || []"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
          <span v-else>{{ row.oldSupplierName }}</span>
        </template>
      </vxe-column>
      <vxe-column field="returnType" title="旧件返还类型" width="160">
        <template #default="{ row, rowIndex }">
          <el-select v-if="eidtRowIndex === rowIndex" v-model="row.returnType"
            placeholder="请选择"
            >
            <el-option
              v-for="item in options.returnType"
              :key="item.returnType"
              :label="item.returnTypeLabel"
              :value="item.returnType"
              >
            </el-option>
          </el-select>
          <span v-else>{{ row.returnTypeLabel }}</span>
        </template>
      </vxe-column>
    </template>
    <vxe-column field="repairItemTypeId" title="维修类型" width="160">
      <template #header>
        <span class="ais-required">维修类型</span>
      </template>
      <template #default="{ row, rowIndex }">
        <fetch-select
          v-if="eidtRowIndex === rowIndex"
          filterable
          clearable
          remote
          reserve-keyword
          v-model="row.repairItemTypeId"
          :remote-method="repairItemTypeRemote"
          :params="row.repairItemTypeName"
          @change="(value, option) => onRepairChange(row, value, option)"
          placeholder="请输入"
          value-key="id"
          label-key="name"
          sub-label-key="code"
        />
        <span v-else>{{ row.repairItemTypeName }}</span>
      </template>
    </vxe-column>
    <vxe-column title="操作" :width="120" fixed="right" :resizable="false" v-if="canAddOrUpdate">
      <template #default="{ row, rowIndex }">
        <template v-if="eidtRowIndex === rowIndex">
          <span
            class="action-button btn-edit"
            @click="saveRowEdit(row, rowIndex)"
          >
            保存
          </span>
          <span
            class="action-button btn-edit"
            @click="cancelEdit(row, rowIndex)"
          >
            取消
          </span>
        </template>
        <template v-else>
          <span
            class="action-button btn-edit"
            @click="editRow(row, rowIndex)"
          >
            编辑
          </span>
          <el-popconfirm
            title="确定要删除这条记录吗？"
            @confirm="handleRemoveRow(row, rowIndex)"
            confirm-button-text="删除"
            confirm-button-type="danger"
          >
            <el-button
              class="action-button btn-delete"
              slot="reference"
              type="text">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </template>
    </vxe-column>
    <template #empty>
      <div class="m-vxe-table-empty-text">
        {{ _id ? '暂无数据' : '新增后，即可添加' }}
      </div>
    </template>
  </vxe-table>
  <div class="table-pagination">
    <el-pagination
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
      :current-page="current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</div>
</template>
<script>
import {
  techServiceActivityPartPage,
  techServiceActivityPartDelete,
  techServiceActivityPartUpdate,
} from '@/api/claimreturn/claim/basic/serviceActivity';

import permissions from '@/libs/mixins/permissions';
import popconfirmScrollClose from '@/libs/mixins/popconfirmScrollClose';
import { getEnum, repairItemType } from '@/api/common';
import { getLists as sparePartList } from '@/api/sparepart/basic/sparePartSupplier';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { cloneDeep } from 'lodash';

const FAST_RETURN = '40'; // 快速返件类型

export default {
  props: {
    schemeId: {
      type: String,
    },
    id: {
      type: String,
    },
    serviceActivityItemId: {
      type: String,
    },
    moduleKey: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
    isServiceCareActivity: {
      type: Boolean,
    }
  },
  components: {
    FetchSelect,
  },
  mixins: [permissions, popconfirmScrollClose],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      // 正在编辑的行
      eidtRowIndex: -1,
      // 当前编辑行的旧件编码复合键 String(oldPartId)+String(oldSupplierId)，仅用于 fetch-select v-model 反显
      editingOldPartKey: '',
      originTableData: [],
      //
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      editConfig: {
        trigger: 'click',
        mode: 'row'
      },
      options: {
        returnType: [],
        oldPartCode: [],
      },
      defaultNewRow: {
        id: '',
        activityId: '',
        schemeId: '',
        serviceActivityItemId: '',
        // 零件信息
        partId: '',
        partCode: '',
        partName: '',
        // 维修类型
        repairItemTypeId: '',
        repairItemTypeCode: '',
        repairItemTypeName: '',
        // 旧件信息
        oldPartId: '',
        oldPartCode: '',
        oldPartName: '',
        oldSupplierId: '',
        oldSupplierCode: '',
        oldSupplierName: '',
        // 数量金额
        quantity: '',
        unitPrice: '',
        discountAmount: '',
        amount: '',
        dealerSupportAmount: '',
        // 开关状态
        mainPart: '0',
        allowDelete: '1',
        // 旧件返还类型
        returnType: '',
        returnTypeLabel: '',
      },
      selectedRow: {},
    };
  },
  watch: {
    schemeId: {
      handler () {
        this.getDetailPageApi();
      }
    },
    _id: {
      handler (val) {
        this.getDetailPageApi();
      }
    },
    serviceActivityItemId: {
      handler (val) {
        this.getDetailPageApi();
      }
    }
  },
  mounted () {
    this.getDetailPageApi();
    this.returnTypeRemote();
  },
  beforeDestroy () {
  },
  methods: {
    handleQuantityChange (row, rowIndex) {
      const maxDiscount = row.quantity * row.unitPrice;
      if (row.discountAmount > maxDiscount) {
        this.$set(row, 'discountAmount', maxDiscount);
      }
      this.$set(row, 'amount', (maxDiscount - row.discountAmount).toFixed(2));
    },
    handleDiscountAmount (row) {
      const maxDiscount = row.quantity * row.unitPrice;
      this.$set(row, 'amount', (maxDiscount - row.discountAmount).toFixed(2));
    },
    getServiceAcitivityItemId () {
      return this.serviceActivityItemId === '全部备件' ? '' : this.serviceActivityItemId;
    },
    // 表格数据
    getDetailPageApi () {
      techServiceActivityPartPage({
        schemeId: this.schemeId || '',
        activityId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
        serviceActivityItemId: this.getServiceAcitivityItemId(),
      }).then((res) => {
        this.tableData = res.records;
        this.originTableData = cloneDeep(res.records);
        this.total = res.total;
      });
    },
    getOriginRow (id) {
      return this.originTableData.find(row => row.id === id);
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    handleRemoveRow (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
        return;
      }
      techServiceActivityPartDelete([row.id]).then((d) => {
        this.$message.success('删除成功');
        this.getDetailPageApi();
      }).catch(() => {
      });
    },
    editRow (row, rowIndex) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('数据未保存');
        return;
      }
      this.eidtRowIndex = rowIndex;
      // 同步当前编辑行的旧件编码复合键，供 fetch-select v-model 反显
      this.editingOldPartKey = row.oldPartId && row.oldSupplierId
        ? String(row.oldPartId) + String(row.oldSupplierId)
        : row.oldPartId || '';
      // 由行已有供应商数据构造旧件供应商下拉（单选项）
      // 注意：__options__ 多为运行期新增字段，需用 $set 保证响应式，并调用 updateData 强制刷新下拉，否则名称无法反显
      this.$nextTick(() => {
        if (!row.__options__) {
          this.$set(row, '__options__', {});
        }
        this.$set(row.__options__, 'oldSupplierId', row.oldSupplierId ? [{
          label: row.oldSupplierName,
          value: row.oldSupplierId,
          labelDesc: row.oldSupplierCode,
        }] : []);
        this.$refs.editTable.updateData(row, row);
      });
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        this.tableData.splice(rowIndex, 1, originRow); // 数据还原
      }
      if (rowIndex === this.eidtRowIndex) {
        this.eidtRowIndex = -1;
      }
    },
    // 数量验证
    validateQuantity (quantity) {
      if (!quantity) {
        this.$message.warning('请输入数量');
        return false;
      }

      if (!/^\d+(\.\d+)?$/.test(quantity)) {
        this.$message.warning('请输入有效的数字');
        return false;
      }

      if (parseFloat(quantity) <= 0) {
        this.$message.warning('数量必须大于0');
        return false;
      }
      return true;
    },
    // 行保存
    saveRowEdit (row) {
      const parmas = {};
      Object.keys(this.defaultNewRow).forEach(key => {
        if (key === 'allowDelete' || key === 'mainPart') {
          parmas[key] = row[key] === '1' ? '1' : '0';
          return;
        }
        parmas[key] = row[key];
      });
      parmas.activityId = this._id;
      parmas.schemeId = this.schemeId;
      parmas.serviceActivityItemId = row.serviceActivityItemId || this.serviceActivityItemId;
      if (!this.validateQuantity(parmas.quantity)) {
        return;
      }
      if (!parmas.repairItemTypeId) {
        this.$message.warning('请选中维修类型');
        return;
      }

      techServiceActivityPartUpdate(parmas).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.eidtRowIndex = -1;
        // 保存后通知父组件刷新方案信息（主因零部件、供应商、VRT、VFG）
        this.$emit('saved');
      }).catch(e => {
        // axios 拦截器已统一弹错，此处仅回滚表格显示，避免开关状态残留在内存与库不一致
        this.getDetailPageApi();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi();
    },
    handleAdd (partId, row) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('请先保存数据，再添加');
        return;
      }
      this.tableData.unshift(row);
      this.$refs.editTable.setEditRow(row);
      this.eidtRowIndex = 0;
      // 新增行时重置旧件编码复合键，旧件信息待用户选择旧件编码时带出
      this.editingOldPartKey = '';
    },
    // 维修类型
    repairItemTypeRemote (query) {
      return repairItemType({
        nameLike: query,
        categorys: [10]
      });
    },
    onRepairChange (row, value, option) {
      row.repairItemTypeName = option?.name || '';
      row.repairItemTypeCode = option?.code || '';
    },
    // 旧件返回类型接口
    returnTypeRemote () {
      getEnum('old_part_return_type').then(res => {
        // 无旧件，不返件，正常返件，过滤40=快速返件
        const list = res?.filter(item => item.code !== FAST_RETURN).map(item => {
          return {
            returnType: item.code,
            returnTypeLabel: item.message,
          };
        }) || [];
        this.options.returnType = list;
      });
    },
    // 旧件供应商下拉
    onOldSupplierChange (value, row) {
      const options = row.__options__?.oldSupplierId || [];
      const option = options.find((item) => item.value === value);
      row.oldSupplierId = option?.value;
      row.oldSupplierName = option?.label;
      row.oldSupplierCode = option?.labelDesc;
      this.$refs.editTable.updateData(row, row);
    },
    // 旧件编码下拉：选择后由记录直接带出供应商（单选项）
    onOldPartCodeChange (row, value, option) {
      if (!row.__options__) {
        this.$set(row, '__options__', {});
      }
      if (value && option) {
        row.oldPartId = option.sparePartId || '';
        row.oldPartCode = option.partCode || '';
        row.oldPartName = option.partName || '';
        // 旧件供应商由所选记录带出，下拉仅此一项
        const supplierOption = option.supplierInfoId ? [{
          label: option.supplierName,
          value: option.supplierInfoId,
          labelDesc: option.supplierCode,
        }] : [];
        this.$set(row.__options__, 'oldSupplierId', supplierOption);
        if (supplierOption.length) {
          const item = supplierOption[0];
          row.oldSupplierId = item.value;
          row.oldSupplierName = item.label;
          row.oldSupplierCode = item.labelDesc;
        } else {
          row.oldSupplierId = '';
          row.oldSupplierName = '';
          row.oldSupplierCode = '';
        }
        this.$refs.editTable.updateData(row, row);
      } else {
        // 清空选择
        row.oldPartId = '';
        row.oldPartCode = '';
        row.oldPartName = '';
        row.oldSupplierId = '';
        row.oldSupplierName = '';
        row.oldSupplierCode = '';
        this.$set(row.__options__, 'oldSupplierId', []);
        this.$refs.editTable.updateData(row, row);
      }
    },
    // 旧件编码下拉接口（件+供应商组合，参照主因零部件）
    partRemote (query) {
      return new Promise((resolve) => {
        sparePartList({
          pageNum: 1,
          pageSize: 20,
          oemPart: 1,
          partCodeOrNameLike: query,
          status: 1,
        }).then(res => {
          if (!res?.length) {
            resolve([
              {
                placeholder: `备件编码：${query}不存在备件供应商关系信息`,
                disabled: true,
              }
            ]);
          } else {
            const records = res.map(item => {
              return {
                ...item,
                partAndSupplierId: String(item.sparePartId) + String(item.supplierInfoId),
              };
            });
            resolve(records);
          }
        });
      });
    },
    // 旧件编码下拉格式化
    formatPartOptions (list) {
      return list.map(item => {
        const code = item.partCode || '';
        const name = item.partName || '';
        const label = code || name ? `${code}/${name}` : (item.sparePartId || '');
        const suffix = item.supplierCode ? `-${item.supplierName || ''}-${item.supplierCode}` : '';
        return {
          ...item,
          displayLabel: label + suffix
        };
      });
    },
  },
};

</script>
<style lang="scss" scoped>
  .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }

  .action-button{
    margin: 0 5px;
    cursor: pointer;
    &.btn-edit{
      color:#4C4CD6;
    }
    &.btn-delete{
      color: #b91919 !important;;
    }
    &.disabled{
      cursor: not-allowed;
      color: var(--disabled-color);
    }
  }
</style>
