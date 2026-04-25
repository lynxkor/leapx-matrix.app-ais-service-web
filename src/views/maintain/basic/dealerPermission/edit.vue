<template>
  <edit-page-layout ref="editLayout" :title="title" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="true"
      >
        <template #status>
          <span class="status primary">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="建店类型代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权限类型：" prop="permissionType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_permission_type"
                    v-model="form.permissionType"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算类型：" prop="checkoutTypeId">
                  <fetch-select
                    filterable
                    clearable
                    v-model="form.checkoutTypeId"
                    :options="settlementOptions"
                    @change="handleSettlementChange"
                    value-key="id"
                    label-key="nameAndCategory"
                  />
                </el-form-item>
                <el-form-item label="建店类型：" prop="dealerType">
                  <el-cascader
                    class="cascader"
                    v-model="form.dealerTypeArray"
                    :options="storeTypeOptions"
                    @change="handleCascaderChange"
                  />
                </el-form-item>
                <el-form-item label="保修类型：" prop="repairItemTypeId">
                  <fetch-select
                    filterable
                    clearable
                    v-model="form.repairItemTypeId"
                    :options="repairItemOptions"
                    @change="handleRepairItemChange"
                    value-key="id"
                    label-key="name"
                    :disabled="!form.checkoutTypeId"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-width="150px" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="建店类型代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="权限类型：">
                  {{ form.permissionTypeLabel }}
                </el-form-item>
                <el-form-item label="结算类型名称：">
                  {{ form.checkoutTypeName }}
                </el-form-item>
                <el-form-item label="建店类型：">
                  {{ form.dealerTypeLabel }}
                </el-form-item>
                <el-form-item label="保修类型名称：">
                  {{ form.repairItemTypeName }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerPermission/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getBuildType } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { listSettlementType } from '@/api/maintain/basic/checkoutType';
import { listItem } from '@/api/maintain/basic/repairItemType';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  permissionType: '',
  permissionTypeLabel: '',
  dealerType: '',
  dealerTypeLabel: '',
  dealerTypeArray: [],
  checkoutTypeName: '',
  repairItemTypeName: '',
  remark: '',
  checkoutTypeId: '',
  repairItemTypeId: '',
  statusLabel: '',
};

export default {
  name: 'dealerPermissionEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '建店类型代码：' + (this.form.code || '');
    }
  },
  data () {
    return {
      pageTitle: '门店施工单权限',
      pageType: 'edit',
      moduleKey: 'AISMC-dealerPermission',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      storeTypeOptions: [],
      settlementOptions: [],
      repairItemOptions: [],
      rules: {
        permissionType: [
          { required: true, message: '请选择权限类型', trigger: 'change' }
        ],
        dealerType: [
          { required: true, message: '请选择建店类型', trigger: 'change' }
        ],
        checkoutTypeId: [
          { required: true, message: '请选择结算类型名称', trigger: 'change' }
        ],
        repairItemTypeId: [
          { required: true, message: '请选择维修类型名称', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getStore();
    this.loadSettlementOptions();
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    async getStore () {
      const res = await getBuildType();
      this.storeTypeOptions = res || [];
    },
    handleCascaderChange (value) {
      if (value && value.length > 0) {
        const lastValue = value[value.length - 1];
        this.form.dealerType = lastValue;
        this.form.dealerTypeArray = value;
      } else {
        this.form.dealerType = '';
        this.form.dealerTypeArray = [];
      }
    },
    handleSettlementChange (val, record) {
      if (record) {
        this.form.checkoutTypeName = record.name;
      }
      this.form.repairItemTypeId = null;
      this.form.repairItemTypeName = '';
      this.loadRepairItemOptions();
    },
    async loadSettlementOptions () {
      const res = await listSettlementType({});
      this.settlementOptions = res || [];
    },
    async loadRepairItemOptions () {
      if (this.form.checkoutTypeId) {
        const res = await listItem({ checkoutTypeId: this.form.checkoutTypeId });
        this.repairItemOptions = res || [];
      } else {
        this.repairItemOptions = [];
      }
    },
    handleRepairItemChange (val, record) {
      if (record) {
        this.form.repairItemTypeName = record.name;
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.status.primary {
  color: var(--leap-color-primary);
  font-weight: 500;
}
.cascader {
  width: 100%;
}
</style>
