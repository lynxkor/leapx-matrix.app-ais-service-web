<template>
  <section class="common-section">
    <div class="common-section-body" v-if="id && schemeId">
      <section class="common-section">
        <enhanced-tabs
          ref="tabs"
          type="rect"
          v-model="partId"
          :load-params="loadParams"
          :load-data="loadData"
          :autoSelectFirst="true"
          :item-config="{
            valueKey: 'id',
            labelKey: 'repairItemName',
            disableCloseKey: 'disableClose',
            disableFirst: true,
            labelFormat: '${repairItemName}(${repairItemCode})',
          }"
          :remote-method="repairRemote"
          :select-config="{
            valueKey: 'id',
            labelKey: 'name',
            labelFormat: '${name}(${code})',
            placeholder: '输入项目零件代码/名称',
          }"
          close-tip="确定删除该项目零件吗？"
          :disabled="!isEditing"
          @remove="onRemove"
          @add="onTabAdd"
          :menus="menus"
          />
        </section>
        <section class="common-section" v-if="partId && isShow">
          <el-form
            v-if="isEditing"
            :inline="true"
            :model="form"
            :rules="rules"
            ref="form"
            label-width="150px"
            class="form-edit"
            >
            <el-form-item label="工时名称：" prop="repairItemName">
              <!-- <fetch-select
                :key="form.repairItemId"
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.repairItemId"
                :remote-method="repairRemote"
                :params="form.repairItemName"
                @change="repairChange"
                value-key="id"
                label-key="name"
                disabled
              /> -->
              <base-input
                placeholder="请输入"
                v-model="form.repairItemName"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="工时代码：" prop="repairItemCode">
              <base-input
                placeholder="请输入"
                v-model="form.repairItemCode"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="工时数：" prop="quantity">
              <base-input
                placeholder="请输入"
                v-model="form.quantity"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="工时单价：" prop="unitPrice">
              <base-input
                placeholder="请输入"
                v-model="form.unitPrice"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="优惠金额：" prop="discountAmount">
              <el-input-number
                v-model="form.discountAmount"
                :min="0"
                :max="form.quantity * form.unitPrice"
                size="small"
                placeholder="请输入"
                @change="handleDiscountAmount(form)"
                :disabled="!isServiceCareActivity"
                />
            </el-form-item>
            <el-form-item v-if="isServiceCareActivity" label="工时金额：" prop="amount">
              <base-input
                placeholder="请输入"
                v-model="form.amount"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="维修类型：" prop="repairItemTypeName">
              <fetch-select
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.repairItemTypeId"
                :remote-method="repairItemRemote"
                :params="form.repairItemTypeName"
                @change="repairItemChange"
                value-key="id"
                label-key="name"
              />
            </el-form-item>
            <el-form-item label="工时是否允许修改：" prop="allowDelete">
              <el-switch
                @change="onUpdate(form)"
                v-model="form.allowDelete">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="!isServiceCareActivity" label="工时是否主因工时：" prop="isMainRepairItem">
              <el-switch
                @change="onUpdate(form)"
                v-model="form.isMainRepairItem">
              </el-switch>
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-else>
            <!-- <el-form-item label="方案名称：">
              {{form.schemeName}}
            </el-form-item> -->
          </el-form>
        </section>
        <section class="common-section" v-if="partId">
          <div v-if="isShow">
            <div class="sub-title">
              零件明细
            </div>
            <div
              v-if="canAddOrUpdate && id"
              class="common-section-header"
            >
              <base-search
                filterable
                clearable
                remote
                reserve-keyword
                v-model="part"
                :remote-method="partRemote"
                @change="handlePartChange"
                value-key="id"
                label-key="partName"
                subLabelKey="partCode"
                placeholder="请输入备件编码/名称"
              />
            </div>
          </div>
          <part-table
            :moduleKey="moduleKey"
            ref="partTable"
            :id="id"
            :schemeId="schemeId"
            :serviceActivityItemId="partId"
            :isServiceCareActivity="isServiceCareActivity"
            />
        </section>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
  </section>
</template>
<script>
import {
  techServiceActivityItemPage,
  techServiceActivityItemGet,
  techServiceActivityItemUpdate,
  techServiceActivityItemDelete,
} from '@/api/claimreturn/claim/basic/serviceActivity';
// 维修保养 -> 维修项目
import { getList as repairList } from '@/api/maintain/basic/repairItem';
import { getList as repairTypeList } from '@/api/maintain/basic/repairItemType';
import permissions from '@/libs/mixins/permissions';
import EnhancedTabs from '@/libs/components/EnhancedTabs/index.vue';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum, sparePartList } from '@/api/common';
import PartTable from './PartTable.vue';
import BaseSearch from '@/libs/components/BaseSearch';
import { debounce } from 'lodash';
import { getValidHourlyPrice } from '@/api/claimreturn/claim/basic/warrantyHourSetting';

const defaultForm = {
  id: '',
  schemeId: '',
  activityId: '',
  quantity: 0,
  unitPrice: 0,
  discountAmount: 0,
  amount: 0, // 工时金额 = 工时数 * 工时单价 - 优惠金额
  repairItemName: '',
  repairItemId: '',
  repairItemCode: '',
  allowDelete: false,
  isMainRepairItem: false,
  repairItemTypeName: '',
  repairItemTypeId: '',
};

export default {
  props: {
    id: {
      type: String,
    },
    schemeId: {
      type: String,
    },
    isEditing: {
      type: Boolean,
      default: true,
    },
    moduleKey: {
      type: String,
      required: true,
    },
    isServiceCareActivity: {
      type: Boolean,
    }
  },
  mixins: [permissions],
  components: {
    EnhancedTabs,
    BaseInput,
    FetchSelect,
    PartTable,
    BaseSearch,
  },
  data () {
    return {
      partId: '',
      form: { ...defaultForm },
      rules: {
        checkoutTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
        ],
      },
      supplierOptions: [],
      menus: [
        {
          label: '复制',
          value: 'copy',
        },
        {
          label: '删除',
          value: 'delete',
        },
      ],
      // ----
      currentVehicleId: '',
      part: '',
      curPart: null,
      // ----
      isShow: true,
      //
      unitPrice: 0, // 标准工时单价
    };
  },
  computed: {
    loadParams () {
      return {
        activityId: this.id,
        schemeId: this.schemeId,
        pageNum: 1,
        pageSize: 999,
      };
    }
  },
  watch: {
    schemeId: {
      handler () {
        this.resetForm();
      }
    },
    partId: {
      handler (newVal) {
        if (newVal) {
          this.getDetail(newVal);
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    getUnitPrice () {
      return new Promise((resolve) => {
        if (this.unitPrice) {
          return resolve(this.unitPrice);
        }
        if (this.isServiceCareActivity) {
          getValidHourlyPrice().then(data => {
            this.unitPrice = data;
            resolve(this.unitPrice);
          });
        }
      });
    },
    handleDiscountAmount (row) {
      const maxDiscount = row.quantity * row.unitPrice;
      this.$set(row, 'amount', (maxDiscount - row.discountAmount).toFixed(2));
    },
    resetForm () {
      this.form = {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    onTabAdd (item, defer) {
      return this.onUpdate({
        repairItemId: item.value,
        activityId: this.id,
        schemeId: this.schemeId,
      }).then(res => {
        defer.resolve(res);
      }).catch((e) => {
        defer.reject(e);
      });
    },
    onUpdate (data) {
      return techServiceActivityItemUpdate({
        ...data,
        allowDelete: data.allowDelete ? '1' : '0',
        isMainRepairItem: data.isMainRepairItem ? '1' : '0',
      });
    },
    // 获取项目零件列表
    loadData (params) {
      return techServiceActivityItemPage(params).then(res => {
        res.records.unshift({
          id: '全部备件',
          repairItemName: '全部备件',
          repairItemCode: '全部备件',
          noFormat: true,
        });
        return res;
      });
    },
    getDetail (id) {
      if (id === '全部备件') {
        this.isShow = false;
        return;
      }
      this.isShow = true;
      // 获取项目零件
      techServiceActivityItemGet(id).then(data => {
        Object.keys(this.form).forEach(key => {
          if (key === 'allowDelete' || key === 'isMainRepairItem') {
            if (data && data[key] === '1') {
              this.form[key] = true;
            } else {
              this.form[key] = false;
            }
            return;
          }
          if (data) {
            if (this.isServiceCareActivity && key === 'unitPrice') {
              this.getUnitPrice().then(data => {
                this.form.unitPrice = data;
                this.handleDiscountAmount(this.form);
              });
            } else {
              this.form[key] = data[key];
            }
          } else {
            this.resetForm();
          }
        });
        console.log(this.form);
      });
    },
    onRemove (item, index, defer) {
      techServiceActivityItemDelete([item.value]).then(() => {
        this.$message.success('操作成功');
      });
    },
    // 工时下拉接口
    repairRemote (query) {
      return repairList({
        codeLike: query,
        nameLike: query,
        pageSize: 20,
        pageNum: 1,
      }).then(res => {
        return res;
      });
    },
    //
    repairChange (val, record) {
    },
    // 维修类型下拉
    repairItemRemote (query) {
      return repairTypeList({
        codeLike: query,
        nameLike: query,
        pageSize: 20,
        pageNum: 1,
        categorys: [10], // 维修记录
      }).then(res => {
        return res;
      });
    },
    repairItemChange (val, record) {
      this.onUpdate(this.form);
    },
    // ------------
    // 零件
    partRemote (query) {
      // 是否OEM, 是否启用
      return sparePartList({ partCodeOrNameLike: query, oemPart: 1, status: 1 });
    },
    handlePartChange (val, record) {
      this.curPart = record;
      this.handleAddPart();
    },
    // 详情表格相关数据
    handleAddPart: debounce(function () {
      if (!this.part) {
        return null;
      }
      const list = this.$refs.partTable.getTableData();
      const existItem = list.find(item => item.partCode === this.curPart.partCode);
      if (existItem) {
        this.$message.error('零件重复');
        return;
      }

      const partId = this.part;
      const cur = this.curPart;
      this.part = '';

      const newItem = {
        partId: partId,
        partCode: cur.partCode,
        partName: cur.partName,
        oldPartId: partId,
        oldPartCode: cur.partCode,
        oldPartName: cur.partName,
        returnType: cur.oldReturnType,
        returnTypeLabel: cur.oldReturnTypeLabel,
        discountAmount: 0,
        quantity: 1,
        unitPrice: cur.purchasePrice, // 【单价】：默认备件主数据采购价格
      };
      this.$refs.partTable.handleAdd(partId, newItem);
    }, 200),
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}
.sub-title{
  color: #6C6E6C;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
