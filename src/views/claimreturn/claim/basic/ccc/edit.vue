<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <edit-page-layout ref="editLayout" title="" >
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`CCC编码：${form.cccCode}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        direction="vertical"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="VRT名称：" prop="vrtId">
                  <list-select
                    listUrl="/claimreturn/claim/web/basic/vrt/list"
                    placeholder="请选择"
                    v-model="form.vrtId"
                    query-key="vrtNameLike"
                    auto-load-options
                    no-param-load
                    clearable
                    filterable
                    :params="{}" />
                </el-form-item>
                <el-form-item label="VFG名称：" prop="vfgId">
                  <list-select
                    listUrl="/claimreturn/claim/web/basic/vfg/list"
                    placeholder="请选择"
                    v-model="form.vfgId"
                    query-key="vfgNameLike"
                    auto-load-options
                    clearable
                    filterable
                    :disabled="!Boolean(form.vrtId)"
                    :params="{vrtId: form.vrtId}"
                    />
                </el-form-item>
                <el-form-item label="CCC编码：" prop="cccCode">
                  <el-input
                    placeholder="请输入"
                    :disabled="form.id!==''"
                    v-model="form.cccCode"
                    maxlength="100"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="CCC名称：" prop="cccName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cccName"
                    maxlength="100"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    disabled="disabled"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-width="150px"  class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="VRT名称：" prop="vrtName">
                  {{ form.vrtName }}
                </el-form-item>
                <el-form-item label="VFG名称：" prop="vfgName">
                  {{ form.vfgName }}
                </el-form-item>
                <el-form-item label="CCC编码：" prop="cccCode">
                  {{ form.cccCode }}
                </el-form-item>
                <el-form-item label="CCC名称：" prop="cccName">
                  {{ form.cccName }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/ccc';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import ListSelect from '@/libs/components/list-select/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditPageLayout from '@/libs/components/EditPageLayout';
import commonMixins from '@/libs/mixins/commonMixins';
const defaultForm = {
  // 多选时字段有变化，自行修复
  vrtCode: '',
  vrtName: '',
  vfgCode: '',
  vfgName: '',
  cccCode: '',
  cccName: '',
  status: '1',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  statusDesc: '',
  dataSource: '',
  vfgId: '',
  vrtId: '',
};

export default {
  name: 'cccEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    ListSelect,
    EditBaseContainer,
    EditPageLayout,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: 'CCC',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-ccc',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {

        vrtId: [
          { required: true, message: '请输入VRT名称', trigger: 'blur' }
        ],
        vfgId: [
          { required: true, message: '请输入VFG名称', trigger: 'blur' }
        ],
        cccCode: [
          { required: true, message: '请输入CCC编码', trigger: 'blur' }
        ],
        cccName: [
          { required: true, message: '请输入CCC名称', trigger: 'blur' }
        ]
      },
    };
  },
  mounted () {
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
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
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
