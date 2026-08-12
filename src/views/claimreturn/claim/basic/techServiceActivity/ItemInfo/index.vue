<template>
  <section class="common-section">
    <div class="" v-if="id && schemeId">
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
            subLabelKey: 'code',
            labelFormat: '${name}(${code})',
            placeholder: '维修项目代码/名称',
          }"
          close-tip="确定删除该项目零件吗？"
          closeText="删除"
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
                @change="handleDiscountAmount(form, true)"
                :disabled="!isServiceCareActivity"
                :precision="2"
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
            <el-form-item v-if="isServiceCareActivity" label="门店支持费用：" prop="dealerSupportAmount">
              <base-input
                placeholder="请输入"
                v-model="form.dealerSupportAmount"
                clearable
                @change="onSubmit(form)"
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
                sub-label-key="code"
              />
            </el-form-item>
            <el-form-item label="工时是否允许删除：" prop="allowDelete">
              <el-switch
                @change="onSubmit(form)"
                v-model="form.allowDelete">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="!isServiceCareActivity" label="工时是否主因工时：" prop="isMainRepairItem">
              <el-switch
                @change="onSubmit(form)"
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
              class="common-section"
              v-if="canDetail && id"
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
                label-key="displayText"
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
            @saved="onPartSaved"
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
  techServiceActivityPartUpdate,
} from '@/api/claimreturn/claim/basic/serviceActivity';
// 维修保养 -> 维修项目
import { getList as repairList } from '@/api/maintain/basic/repairItem';
import { getList as repairTypeList } from '@/api/maintain/basic/repairItemType';
import permissions from '@/libs/mixins/permissions';
import EnhancedTabs from '@/libs/components/EnhancedTabs/index.vue';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum, sparePartList } from '@/api/common';
import { getLists } from '@/api/sparepart/basic/sparePartSupplier/index';
import PartTable from './PartTable.vue';
import BaseSearch from '@/libs/components/BaseSearch';
import { debounce } from 'lodash';

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
  dealerSupportAmount: ''
};
const repairItemTypeCode = 'WXLX002';
const repairItemTypeId = '898A364C-DD79-EC11-B0F9-9216EACB73F2';
const repairItemTypeName = '一般维修';

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
        repairItemTypeName: [
          { required: true, message: '请选择维修类型', trigger: 'change' }
        ]
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
  methods: {
    handleDiscountAmount (row, isUpdate) {
      const maxDiscount = row.quantity * row.unitPrice;
      this.$set(row, 'amount', (maxDiscount - row.discountAmount).toFixed(2));
      if (isUpdate) {
        this.onSubmit(this.form);
      }
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
        // 前后端都是写死的
        repairItemTypeCode,
        repairItemTypeId,
        repairItemTypeName,
      }).then(res => {
        defer.resolve(res);
        this.partId = res;
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
    onSubmit (data) {
      techServiceActivityItemUpdate({
        ...data,
        allowDelete: data.allowDelete ? '1' : '0',
        isMainRepairItem: data.isMainRepairItem ? '1' : '0',
      }).then(res => {
        this.$message.success('保存成功');
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
            this.form[key] = data[key];
          } else {
            this.resetForm();
          }
        });
      });
    },
    onRemove (item, index, defer) {
      techServiceActivityItemDelete([item.value]).then(() => {
        this.$message.success('操作成功');
        defer.resolve();
      }).catch(() => {
        defer.reject();
      });
    },
    // 工时下拉接口
    repairRemote (query) {
      return repairList({
        nameOrCodeOrPinyinLike: query,
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
      this.form.repairItemTypeName = record?.name;
      this.form.repairItemTypeCode = record?.code;
      this.form.repairItemTypeId = record?.id;
      this.onSubmit(this.form);
    },
    // ------------
    // 零件
    // partRemote (query) {
    //   // 是否OEM, 是否启用
    //   return sparePartList({ partCodeOrNameLike: query, oemPart: 1, status: 1 });
    // },
    partRemote (query) {
      return new Promise((resolve, reject) => {
        getLists({
          pageNum: 1,
          pageSize: 20,
          oemPart: 1,
          partCodeOrNameLike: query,
          status: 1,
        }).then(res => {
          if (!res?.length) {
            resolve([
              {
                displayText: `备件编码：${query}不存在备件供应商关系信息`,
                disabled: true,
              }
            ]);
          } else {
            const records = res.map(item => {
              return {
                ...item,
                displayText: `${item.partCode}/${item.partName}${item.supplierCode ? `-${item.supplierName}-${item.supplierCode}` : ''}`,
              };
            });
            resolve(records);
          }
        });
      });
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

      const cur = this.curPart;
      this.part = '';

      const newItem = {
        partId: cur.sparePartId,
        partCode: cur.partCode,
        partName: cur.partName,
        oldPartId: cur.sparePartId,
        oldPartCode: cur.partCode,
        oldPartName: cur.partName,
        oldSupplierId: cur.supplierInfoId, // 旧件供应商
        // returnType: cur.oldReturnType,
        // returnTypeLabel: cur.oldReturnTypeLabel,
        discountAmount: 0,
        quantity: 1,
        unitPrice: cur.purchasePrice, // 【单价】：默认备件主数据采购价格
        // 前后端都是写死的
        repairItemTypeCode,
        repairItemTypeId,
        repairItemTypeName,
        activityId: this.id,
        schemeId: this.schemeId,
        serviceActivityItemId: this.getServiceActivityItemId(),
        allowDelete: '1',
        mainPart: '0',
      };

      // 直接调用接口保存
      techServiceActivityPartUpdate(newItem).then(() => {
        this.$message.success('添加成功');
        this.$refs.partTable.getDetailPageApi();
      }).catch(() => {
      });
    }, 200),
    getServiceActivityItemId () {
      return this.partId === '全部备件' ? '' : this.partId;
    },
    // 零件保存后通知父组件刷新方案信息
    onPartSaved () {
      this.$emit('part-saved');
    },
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}
.sub-title{
  color: var(--leap-color-default);
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
