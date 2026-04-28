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
                <el-form-item label="备件编码：" prop="sparePartCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.sparePartCode"
                    :remote-method="listSparePart"
                    :disabled="!!_id"
                    labelKey="code"
                    valueKey="id"
                    subLabelKey="name"
                    @change="listSparePartChange"
                  />
                </el-form-item>
                <el-form-item label="备件名称：" prop="sparePartName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sparePartName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售价格：" prop="dealerSalesPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerSalesPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效开始日期：" prop="effectiveStartDate">
                  <el-date-picker
                    v-model="form.effectiveStartDate"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件编码：">
                  {{ form.sparePartCode }}
                </el-form-item>
                <el-form-item label="备件名称：">
                  {{ form.sparePartName }}
                </el-form-item>
                <el-form-item label="门店销售价格：">
                  {{ form.dealerSalesPrice }}
                </el-form-item>
                <el-form-item label="生效开始日期：">
                  {{ form.effectiveStartDate }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="主键：">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="状态变更描述：">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="数据来源：">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="备件ID：">
                  {{ form.sparePartId }}
                </el-form-item>
                <el-form-item label="门店ID：">
                  {{ form.dealerId }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePartSalesPrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';

const defaultForm = {
  sparePartCode: '',
  sparePartName: '',
  dealerSalesPrice: '',
  effectiveStartDate: '',
  statusLabel: '',
};

export default {
  name: 'sparePartSalesPriceEdit',
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
      return '备件销售价格' + (this.form.id ? ' - ' + this.form.id : '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件销售价格',
      pageType: 'edit',
      moduleKey: 'AISPART-sparePartSalesPrice',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        sparePartCode: [
          { required: true, message: '请输入备件编码', trigger: 'blur' }
        ],
        sparePartName: [
          { required: true, message: '请输入备件名称', trigger: 'blur' }
        ],
        dealerSalesPrice: [
          { required: true, message: '请输入销售价格', trigger: 'blur' },
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
              if (num <= 0) {
                callback(new Error('请输入大于0的数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        effectiveStartDate: [
          { required: true, message: '请输入生效开始日期', trigger: 'blur' }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
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
    async listSparePart (query) {
      var a = await getSparePart({ partCodeOrNameLike: query });
      return a;
    },
    listSparePartChange (val, all) {
      this.form.sparePartId = all.id;
      this.form.sparePartCode = all.code;
      this.form.sparePartName = all.name;
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
