<template>
  <section class="common-section">
    <div class="common-section-body" v-if="id && schemeId">
      <section class="common-section">
        <fetch-tabs
          ref="fetchTabs"
          type="rect"
          v-model="partId"
          :loadParams="loadParams"
          :loadData="loadData"
          :itemConfig="{
            valueKey: 'id',
            labelKey: 'repairItemName',
            disableCloseKey: 'disableClose',
            disableFirst: false,
            labelFormat: '${repairItemName}(${repairItemCode})',
          }"
          :remoteMethod="repairRemote"
          :selectConfig="{
            valueKey: 'id',
            labelKey: 'name',
            labelFormat: '${name}(${code})',
            placeholder: '输入项目零件代码、名称',
          }"
          closeTip="确定删除该项目零件吗？"
          :disabled="!isEditing"
          @remove="onRemove"
          @add="onTabAdd"
          :menus="menus"
          />
        </section>
        <section class="common-section">
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
              <fetch-select
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
              <base-input
                placeholder="请输入"
                v-model="form.discountAmount"
                clearable
                disabled
              />
            </el-form-item>
            <!-- <el-form-item label="工时金额：" prop="amount">
              <base-input
                placeholder="请输入"
                v-model="form.amount"
                clearable
              />
            </el-form-item> -->
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
                @change="() => {this.onUpdate(this.form)}"
                v-model="form.allowDelete">
              </el-switch>
            </el-form-item>
            <el-form-item label="工时是否主因工时：" prop="isMainRepairItem">
              <el-switch
                @change="() => {this.onUpdate(this.form)}"
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
        <section class="common-section">
          <div class="sub-title">
            零件明细
          </div>
          <div
            v-if="canAddOrUpdate && id"
            class="common-section-header"
          >
            <fetch-box>
              <fetch-select
                filterable
                clearable
                remote
                reserve-keyword
                v-model="part"
                :remote-method="partRemote"
                @change="handlePartChange"
                value-key="id"
                label-key="partName"
                placeholder="请输入备件编码/名称"
              />
              <el-button
                type="primary"
                size="small"
                @click="handleAddPart"
                >
                添加
              </el-button>
            </fetch-box>
          </div>
          <part-table
            :moduleKey="moduleKey"
            ref="partTable"
            :id="id"
            :schemeId="schemeId"
            :serviceActivityItemId="partId"
            >
          </part-table>
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
} from '@/api/claimreturn/claim/basic/techServiceActivity';
// 维修保养 -> 维修项目
import { getList as repairList } from '@/api/maintain/basic/repairItem';
import { getList as repairTypeList } from '@/api/maintain/basic/repairItemType';
import permissions from '@/libs/mixins/permissions';
import FetchTabs from '@/libs/components/FetchTabs/index.vue';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum, sparePartList } from '@/api/common';
import PartTable from './PartTable.vue';
import FetchBox from '@/libs/components/FetchBox';
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
    }
  },
  mixins: [permissions],
  components: {
    FetchTabs,
    BaseInput,
    FetchSelect,
    PartTable,
    FetchBox,
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
    loadData (params) {
      return techServiceActivityItemPage(params);
    },
    getDetail (id) {
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
        // this.form
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
        // this.form
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
    },
    // 详情表格相关数据
    handleAddPart: debounce(function () {
      if (!this.part) {
        this.$message.error('请选择零件');
        return null;
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
