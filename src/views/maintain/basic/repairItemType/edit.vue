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
                <el-form-item label="维修类型代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="类别：" prop="category">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_type_category"
                    v-model="form.category"
                    placeholder="请选择"
                    clearable
                    @change="handleCategoryChange"
                  />
                </el-form-item>
                <el-form-item label="维修类型名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    clearable
                    maxLength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="结算类型名称：" prop="checkoutTypeName">
                  <el-select
                    v-model="form.checkoutTypeName"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    :disabled="form.category == 10"
                    @change="handleSettlementChange"
                    :remote-method="settlementSearch"
                    :loading="settlementLoading">
                    <el-option
                      v-for="item in settlementOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.sort"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxLength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="维修类型代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="维修类别：">
                  {{ form.categoryLabel }}
                </el-form-item>
                <el-form-item label="维修类型名称：">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="结算类型名称：">
                  {{ form.checkoutTypeName }}
                </el-form-item>
                <el-form-item label="排序：">
                  {{ form.sort }}
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/repairItemType/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { listSettlementType } from '@/api/maintain/basic/checkoutType';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  category: null,
  categoryLabel: '',
  name: '',
  sort: null,
  remark: '',
  checkoutTypeId: null,
  checkoutTypeName: '',
  statusLabel: '',
};

export default {
  name: 'repairItemTypeEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '维修类型：' + (this.form.name || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '维修类型',
      pageType: 'edit',
      moduleKey: 'AISMC-repairItemType',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      settlementLoading: false,
      settlementOptions: [],
      settlementTimer: null,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        category: [
          { required: true, message: '请选择维修类别', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入维修类型名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('请输入排序'));
                return;
              }
              const num = Number(value);
              if (isNaN(num)) {
                callback(new Error('排序必须为数字'));
                return;
              }
              if (!Number.isInteger(num)) {
                callback(new Error('排序必须为整数'));
                return;
              }
              if (num <= 0) {
                callback(new Error('排序必须为正整数'));
                return;
              }
              if (num > 9999) {
                callback(new Error('排序不能超过9999'));
                return;
              }
              callback();
            },
          }
        ],
      }
    };
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
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        ownerId: userInfo.userId,
        ownerName: userInfo.userName,
        dealerName: userInfo.orgPostUserList.find(item => item.position === '1')?.orgName,
      };
    },
    handleCategoryChange (val) {
      if (Number(val) === 10) {
        this.form.checkoutTypeId = '';
        this.form.checkoutTypeName = '';
      }
    },
    handleSettlementChange (val) {
      const selectedVal = this.settlementOptions.find(option => option.value === val);
      if (selectedVal) {
        this.form.checkoutTypeName = selectedVal.label;
        this.form.checkoutTypeId = val;
      } else {
        this.form.checkoutTypeName = '';
        this.form.checkoutTypeId = '';
      }
    },
    async settlementSearch (query) {
      if (query !== '' && query.length < 2) {
        this.settlementOptions = [];
        return;
      }
      if (this.settlementTimer) {
        clearTimeout(this.settlementTimer);
      }
      this.settlementTimer = setTimeout(async () => {
        this.settlementLoading = true;
        try {
          const res = await listSettlementType({ name: query });
          if (res) {
            this.settlementOptions = res?.map(item => ({
              value: item.id,
              label: item.name
            }));
          } else {
            this.settlementOptions = [];
          }
        } catch (error) {
          this.settlementOptions = [];
          this.$message.error('搜索失败');
        } finally {
          this.settlementLoading = false;
        }
      }, 300);
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
</style>
