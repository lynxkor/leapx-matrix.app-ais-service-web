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
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="错误代码：" prop="errorCode">
                  <el-input v-model="form.errorCode" placeholder="请输入" maxlength="100" clearable :disabled="!!_id" />
                </el-form-item>
                <el-form-item label="错误类别：" prop="errorCategory">
                  <el-input v-model="form.errorCategory" placeholder="请输入" maxlength="100" clearable />
                </el-form-item>
                <el-form-item label="检查项目：" prop="checkItem">
                  <el-input v-model="form.checkItem" placeholder="请输入" maxlength="500" clearable type="textarea" rows="1" />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入" maxlength="500" clearable type="textarea" rows="1" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="错误代码：">{{ form.errorCode }}</el-form-item>
                <el-form-item label="错误类别：">{{ form.errorCategory }}</el-form-item>
                <el-form-item label="检查项目：">{{ form.checkItem }}</el-form-item>
                <el-form-item label="备注：">{{ form.remark }}</el-form-item>
                <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
                <el-form-item label="修改时间：">{{ form.updateTime }}</el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>扣款规则</h2>
            </div>
            <div class="common-section-body">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form :model="form" :rules="rules" ref="ruleForm1" v-if="isEditing || !_id" style="display: block;width:100%;">
                    <el-form-item label="正式工时扣款比例（%）" prop="formalLaborDeductRatio" style="width:60%;">
                      <el-input-number v-model="form.formalLaborDeductRatio" :min="0" :precision="0" :controls="false" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="正式备件扣款比例（%）" prop="formalPartDeductRatio" style="width:60%;">
                      <el-input-number v-model="form.formalPartDeductRatio" :min="0" :precision="0" :controls="false" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="正式其他扣款比例（%）" prop="formalOtherDeductRatio" style="width:60%;">
                      <el-input-number v-model="form.formalOtherDeductRatio" :min="0" :precision="0" :controls="false" placeholder="请输入" />
                    </el-form-item>
                  </el-form>
                  <el-form :model="form" class="form-detail" v-else style="display: block;width:100%;">
                    <el-form-item label="正式工时扣款比例（%）" style="width: 100%">{{ form.formalLaborDeductRatio }}</el-form-item>
                    <el-form-item label="正式备件扣款比例（%）" style="width: 100%">{{ form.formalPartDeductRatio }}</el-form-item>
                    <el-form-item label="正式其他扣款比例（%）" style="width: 100%">{{ form.formalOtherDeductRatio }}</el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="12">
                  <el-form :model="form" :rules="rules" ref="ruleForm2" v-if="isEditing || !_id" style="display: block;width:100%;">
                    <el-form-item label="跟进工时扣款比例（%）" prop="followLaborDeductRatio" style="width:60%;">
                      <el-input-number v-model="form.followLaborDeductRatio" :min="0" :precision="0" :controls="false" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="跟进备件扣款比例（%）" prop="followPartDeductRatio" style="width:60%;">
                      <el-input-number v-model="form.followPartDeductRatio" :min="0" :precision="0" :controls="false" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="跟进其他扣款比例（%）" prop="followOtherDeductRatio" style="width:60%;">
                      <el-input-number v-model="form.followOtherDeductRatio" :min="0" :precision="0" :controls="false" placeholder="请输入" />
                    </el-form-item>
                  </el-form>
                  <el-form :model="form" class="form-detail" v-else style="display: block;width:100%;">
                    <el-form-item label="跟进工时扣款比例（%）" style="width: 100%">{{ form.followLaborDeductRatio }}</el-form-item>
                    <el-form-item label="跟进备件扣款比例（%）" style="width: 100%">{{ form.followPartDeductRatio }}</el-form-item>
                    <el-form-item label="跟进其他扣款比例（%）" style="width: 100%">{{ form.followOtherDeductRatio }}</el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditErrorConfig/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  errorCode: '',
  errorCategory: '',
  checkItem: '',
  remark: '',
  status: 1,
  formalLaborDeductRatio: 0,
  formalPartDeductRatio: 0,
  formalOtherDeductRatio: 0,
  followLaborDeductRatio: 0,
  followPartDeductRatio: 0,
  followOtherDeductRatio: 0,
  createTime: '',
  updateTime: ''
};

export default {
  name: 'warrantyAuditErrorConfigEdit',
  props: {
    id: { type: [String, Number], default: null }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '错误代码：' + (this.form.errorCode || '新增');
    }
  },
  data () {
    return {
      pageTitle: '审计错误项配置',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyAuditErrorConfig',
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        errorCode: [{ required: true, message: '请输入错误代码', trigger: 'change' }],
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    getDefautlForm () {
      return { ...defaultForm };
    }
  }
};
</script>
