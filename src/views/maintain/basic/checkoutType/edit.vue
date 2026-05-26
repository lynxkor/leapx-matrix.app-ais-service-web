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
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="结算类型代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算类型名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算类别：" prop="category">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_checkout_category"
                    v-model="form.category"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否app展示描述：" prop="appShow">
                  <el-input
                    v-model="appShowText"
                    placeholder="否"
                    disabled
                  />
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
                    maxlength="500"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="结算类型代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="结算类型名称：">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="结算类别：">
                  {{ form.categoryLabel }}
                </el-form-item>
                <el-form-item label="是否app展示描述：">
                  {{ form.isAppShowLabel }}
                </el-form-item>
                <el-form-item label="排序：">
                  {{ form.sort }}
                </el-form-item>
                <el-form-item label="备注：" class="form-item-full">
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/checkoutType/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  name: '',
  sort: null,
  remark: '',
  category: '',
  categoryLabel: '',
  appShow: null,
  isAppShowLabel: '',
  statusLabel: '',
};

export default {
  name: 'checkoutTypeEdit',
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
      return '结算类型：' + (this.form.name || '');
    },
    appShowText () {
      return this.form.appShow ? '是' : '否';
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '结算类型',
      pageType: 'edit',
      moduleKey: 'AISMC-checkoutType',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        name: [
          { required: true, message: '请输入结算类型名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择结算类别', trigger: 'change' }
        ],
        sort: [
          {
            required: false,
            validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                callback();
                return;
              }
              const reg = /^[1-9]\d*$/;
              if (!reg.test(value.toString())) {
                callback(new Error('排序必须为正整数'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
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
      const formData = { ...this.form };
      if (!this._id) {
        formData.appShow = 1;
      }
      return addOrUpdate(formData);
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
