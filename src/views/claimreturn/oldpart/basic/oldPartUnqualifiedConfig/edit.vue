<template>
  <edit-base-container
    ref="containerRef"
    :id="_id"
    :title="`代码：${form.unqualifiedCode}`"
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
            <el-form label-width="120px" :inline="true" :model="form" :rules="rules" ref="ruleForm"  class="form-edit" v-show="isEditing || !_id">
              <el-form-item label="代码：" prop="unqualifiedCode">
                <el-input
                  v-model="form.unqualifiedCode"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="描述：" prop="unqualifiedDesc">
                <el-input
                  placeholder="请输入"
                  v-model="form.unqualifiedDesc"
                  maxlength="50"
                  clearable
                />
              </el-form-item>
            </el-form>
            <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
              <el-form-item label="代码：" prop="unqualifiedCode">
                {{form.unqualifiedCode}}
              </el-form-item>
              <el-form-item label="描述：" prop="unqualifiedDesc">
                {{form.unqualifiedDesc}}
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
  </edit-base-container>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/oldpart/basic/oldPartUnqualifiedConfig/index';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditBaseContainer from '@/libs/components/EditBaseContainer';

const defaultForm = {
  // 多选时字段有变化，自行修复
  unqualifiedCode: '',
  unqualifiedDesc: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
};

export default {
  name: 'oldPartUnqualifiedConfigEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
      pageTitle: '旧件不合格配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-oldPartUnqualifiedConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        unqualifiedDesc: [
          { required: true, message: '请输入描述', trigger: 'change' }
        ],
      }
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
    handleBack () {
      this.$router.back();
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
