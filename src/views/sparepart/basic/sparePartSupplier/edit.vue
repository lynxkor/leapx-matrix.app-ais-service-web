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
                <el-form-item label="供应商编码：" prop="supplierCode">
                  <fetch-select
                    prop="supplierCode"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.supplierCode"
                    :remote-method="listSupplier"
                    :disabled="!!_id"
                    labelKey="code"
                    valueKey="id"
                    subLabelKey="name"
                    @change="listSupplierChange"
                  />
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件编码：" prop="partCode">
                  <fetch-select
                    prop="partCode"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.partCode"
                    :remote-method="listSparePart"
                    :disabled="!!_id"
                    labelKey="code"
                    valueKey="id"
                    subLabelKey="name"
                    @change="listSparePartChange"
                  />
                </el-form-item>
                <el-form-item label="备件名称：" prop="partName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配额数值：" prop="quota">
                  <el-input
                    placeholder="请输入"
                    v-model="form.quota"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="供应商编码：">
                  <el-link type="primary" :href="`/sparepart/basic/supplierInfo/edit?id=${form.supplierInfoId}`" target="_blank">
                    {{ form.supplierCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="供应商名称：">
                  {{ form.supplierName }}
                </el-form-item>
                <el-form-item label="备件编码：">
                  <el-link type="primary" :href="`/sparepart/basic/sparePart/edit?id=${form.sparePartId}`" target="_blank">
                    {{ form.partCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="备件名称：">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="是否启用：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="配额数值：">
                  {{ form.quota }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePartSupplier/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';
import { list as getSupplier } from '@/api/sparepart/basic/supplierInfo/index';

const defaultForm = {
  id: '',
  supplierInfoId: '',
  supplierCode: '',
  supplierName: '',
  partCode: '',
  partName: '',
  statusLabel: '',
  sparePartId: '',
  quota: '',
};

export default {
  name: 'sparePartSupplierEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
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
      return '供应商备件关系' + (this.form.id ? ' - ' + this.form.id : '');
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '供应商备件关系',
      pageType: 'edit',
      moduleKey: 'AISPART-sparePartSupplier',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        supplierCode: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        partCode: [
          { required: true, message: '请选择备件', trigger: 'blur' }
        ],
        quota: [
          { required: false, message: '请输入配额数值', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback();
                return;
              }
              const num = Number(value);
              if (isNaN(num)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              if (num < 0) {
                callback(new Error('请输入大于等于0的数'));
                return;
              }
              callback();
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
      return addOrUpdate({ id: this.form.id, ...this.form });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async listSupplier (query) {
      var a = await getSupplier({ supplierCodeOrNameLike: query });
      return a;
    },
    listSupplierChange (val, all) {
      this.form.supplierInfoId = all.id;
      this.form.supplierCode = all.code;
      this.form.supplierName = all.name;
    },
    async listSparePart (query) {
      var a = await getSparePart({ partCodeOrNameLike: query });
      return a;
    },
    listSparePartChange (val, all) {
      this.form.sparePartId = all.id;
      this.form.partCode = all.code;
      this.form.partName = all.name;
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
