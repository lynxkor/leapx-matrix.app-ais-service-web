<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
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
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="编码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店分类：" prop="dealerType">
                  <el-input
                      v-model="form.dealerType"
                      placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input
                      type="textarea"
                      v-model="form.remark"
                      placeholder="请输入"
                      maxlength="500"
                      show-word-limit
                      clearable
                    />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店分类：" prop="dealerType">
                  {{ form.dealerType }}
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>规则详情</h2>
            </div>
            <div class="common-section-body">
              <div class="rule-builder-container">
                <rule-group-item
                  v-if="form.ruleDetail"
                  :relation.sync="form.ruleDetail.relation"
                  :rule-item-list.sync="form.ruleDetail.ruleItemList"
                  :is-root="true"
                  :is-editing="isEditing || !_id"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/predictDealerType/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import RuleGroupItem from './RuleGroupItem.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerType: '',
  status: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  dataSource: '',
  ruleDetail: {
    relation: 'and',
    item: null,
    ruleItemList: [
      {
        relation: null,
        item: { field: '', symbol: '', fieldValue: '' },
        ruleItemList: []
      }
    ]
  },
};

export default {
  name: 'predictDealerTypeEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    RuleGroupItem
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '编码：' + this.form.code;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
        } else {
          // 当没有 id 时（新增模式），重置表单为初始状态
          const form = this.getDefautlForm();
          this.form = form;
          this.originalForm = JSON.parse(JSON.stringify(form));
          this.$nextTick(() => {
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
          });
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件预测门店分类',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-predictDealerType',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        code: [
          { required: false, message: '请输入编码', trigger: 'change' }
        ],
        dealerType: [
          { required: true, message: '请选择门店分类', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        createTime: [
          { required: false, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: false, message: '请选择修改时间', trigger: 'change' }
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
      const form = { ...this.form };
      if (form.ruleDetail && !form.ruleDetail.relation) {
        form.ruleDetail.relation = 'and';
      }
      if (form.ruleDetail && form.ruleDetail.item === undefined) {
        form.ruleDetail.item = null;
      }
      return addOrUpdate(form);
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return JSON.parse(JSON.stringify(defaultForm));
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
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
.rule-builder-container {
  padding: 0 50px;
}
</style>
