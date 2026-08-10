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
                <el-form-item label="差价设置代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="vehicleModelId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.vehicleModelId"
                    :remote-method="modelSearch"
                    :params="form.vehicleModelName"
                    @change="handleModelChange"
                    value-key="id"
                    label-key="name"
                  />
                </el-form-item>
                <el-form-item label="单次需补差价：" prop="spreadPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.spreadPrice"
                    type="number"
                    min="0"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购买城市等级：" prop="buyCityLevel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_city_level"
                    v-model="form.buyCityLevel"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="核销城市等级：" prop="verificationCityLevel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_city_level"
                    v-model="form.verificationCityLevel"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效开始日期：" prop="effectiveon">
                  <el-date-picker
                    v-model="form.effectiveon"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.remark"
                    maxlength="100"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="差价设置代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="车型：">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="购买城市等级：">
                  {{ form.buyCityLevelLabel }}
                </el-form-item>
                <el-form-item label="核销城市等级：">
                  {{ form.verificationCityLevelLabel }}
                </el-form-item>
                <el-form-item label="单次需补差价：">
                  {{ form.spreadPrice }}
                </el-form-item>
                <el-form-item label="生效开始日期：">
                  {{ form.effectiveon }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/spreadsSetting/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listVehicleModel } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  vehicleModelId: null,
  vehicleModelName: '',
  buyCityLevel: '',
  buyCityLevelLabel: '',
  verificationCityLevel: '',
  verificationCityLevelLabel: '',
  spreadPrice: '',
  effectiveon: '',
  remark: '',
  statusLabel: '',
};

export default {
  name: 'spreadsSettingEdit',
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
      return '差价设置代码：' + (this.form.code || '');
    }
  },
  data () {
    return {
      pageTitle: '保养套餐差价设置',
      pageType: 'edit',
      moduleKey: 'AISMC-spreadsSetting',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      modelLoading: false,
      modelOptions: [],
      searchTimer: null,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        vehicleModelId: [
          { required: true, message: '请输入车型', trigger: 'change' }
        ],
        buyCityLevel: [
          { required: true, message: '请输入购买城市等级', trigger: 'change' }
        ],
        verificationCityLevel: [
          { required: true, message: '请输入核销城市等级', trigger: 'change' }
        ],
        spreadPrice: [
          { required: true, message: '请输入单次需补差价', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== null && value !== undefined && value !== '' && Number(value) < 0) {
                callback(new Error('单次需补差价不能为负数'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        effectiveon: [
          { required: true, message: '请选择生效开始日期', trigger: 'change' }
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
      return addOrUpdate({ ...this.form });
    },
    handleModelChange (val, record) {
      if (record) {
        this.form.vehicleModelName = record.name;
      }
    },
    async modelSearch (query) {
      return listVehicleModel({ modelNameLike: query });
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
