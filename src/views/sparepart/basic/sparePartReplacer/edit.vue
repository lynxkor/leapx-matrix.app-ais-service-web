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
                <el-form-item label="替换前备件编码：" prop="beforePartCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.beforePartCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="替换前备件名称：" prop="beforePartName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.beforePartName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="替换类型：" prop="replacementType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.replacementType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="替换后备件编码：" prop="afterPartCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.afterPartCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="替换后备件名称：" prop="afterPartName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.afterPartName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="替换前件号ID：" prop="beforeSparePartId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.beforeSparePartId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="替换后件号ID：" prop="afterSparePartId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.afterSparePartId"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-width="150px" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="替换前备件编码：">
                  {{ form.beforePartCode }}
                </el-form-item>
                <el-form-item label="替换前备件名称：">
                  {{ form.beforePartName }}
                </el-form-item>
                <el-form-item label="替换类型：">
                  {{ form.replacementType }}
                </el-form-item>
                <el-form-item label="替换后备件编码：">
                  {{ form.afterPartCode }}
                </el-form-item>
                <el-form-item label="替换后备件名称：">
                  {{ form.afterPartName }}
                </el-form-item>
                <el-form-item label="备注：" class="form-item-full">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态变更描述：">
                  {{ form.statusDesc }}
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
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="数据来源：" class="form-item-full">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="替换前件号ID：">
                  {{ form.beforeSparePartId }}
                </el-form-item>
                <el-form-item label="替换后件号ID：">
                  {{ form.afterSparePartId }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePartReplacer/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  beforePartCode: '',
  beforePartName: '',
  replacementType: '',
  afterPartCode: '',
  afterPartName: '',
  remark: '',
  statusLabel: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  dataSource: '',
  beforeSparePartId: '',
  afterSparePartId: '',
};

export default {
  name: 'sparePartReplacerEdit',
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
      return '备件替换件关系' + (this.form.id ? ' - ' + this.form.id : '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件替换件关系',
      pageType: 'edit',
      moduleKey: 'AISPART-sparePartReplacer',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        beforePartCode: [
          { required: true, message: '请输入替换前备件编码', trigger: 'blur' }
        ],
        beforePartName: [
          { required: true, message: '请输入替换前备件名称', trigger: 'blur' }
        ],
        replacementType: [
          { required: true, message: '请选择替换类型', trigger: 'change' }
        ],
        afterPartCode: [
          { required: true, message: '请输入替换后备件编码', trigger: 'blur' }
        ],
        afterPartName: [
          { required: true, message: '请输入替换后备件名称', trigger: 'blur' }
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
