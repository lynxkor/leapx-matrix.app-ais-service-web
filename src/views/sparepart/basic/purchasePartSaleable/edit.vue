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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :dataTransform="dataTransform"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="模式：" prop="mode">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="PurchasePartSaleableModeEnum"
                    v-model="form.mode"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="isEdit"
                    @change="handleModeChange"
                  />
                </el-form-item>
                <el-form-item label="订单类型：" prop="orderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="PurchaseOrderTypeEnum"
                    v-model="form.orderType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>

                <!-- 按备件模式：备件编码/名称/是否可售 -->
                <template v-if="form.mode !== '2'">
                  <el-form-item label="备件编码：" prop="partCode">
                    <fetch-select
                      prop="partCode"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.partCode"
                      :remote-method="getSparePart"
                      labelKey="code"
                      valueKey="code"
                      subLabelKey="name"
                      @change="listSparePartChange"
                    />
                  </el-form-item>
                  <el-form-item label="备件名称：" prop="partName">
                    <el-input
                      v-model="form.partName"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                  <el-form-item label="是否可售：" prop="saleableIs">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.saleableIs"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                </template>

                <!-- 按门店模式：可编辑【订单类型】【门店编码】【备注】；【是否可售】固定为否且不可编辑 -->
                <template v-else>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    <fetch-select
                      :remote-method="getDealerList"
                      remote
                      v-model="form.dealerCode"
                      placeholder="请输入门店编码或名称"
                      labelKey="orgCode"
                      valueKey="orgCode"
                      subLabelKey="orgName"
                      clearable
                      collapseTags
                      filterable
                      @change="handleDealerChange"
                    />
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    <el-input
                      v-model="form.dealerName"
                      clearable
                      :disabled="true"
                    />
                  </el-form-item>
                  <el-form-item label="是否可售：" prop="saleableIs">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.saleableIs"
                      placeholder="请选择"
                      :disabled="true"
                    />
                  </el-form-item>
                </template>

                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    show-word-limit
                    maxlength="500"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="模式：" prop="mode">
                  {{ form.modeLabel }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="orderType">
                  {{ form.orderTypeLabel }}
                </el-form-item>
                <template v-if="form.mode !== '2'">
                  <el-form-item label="备件编码：" prop="partCode">
                    <el-link type="primary" :href="`/service/sparepart/basic/sparePart/edit?id=${form.sparePartId}`" target="_blank">
                      {{ form.partCode }}
                    </el-link>
                  </el-form-item>
                  <el-form-item label="备件名称：" prop="partName">
                    {{ form.partName }}
                  </el-form-item>
                  <el-form-item label="是否可售：" prop="saleableIs">
                    {{ form.saleableIsLabel }}
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    {{ form.dealerCode }}
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="是否可售：" prop="saleableIs">
                    {{ form.saleableIsLabel }}
                  </el-form-item>
                </template>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/purchasePartSaleable/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, sparePartListShort, listOrgStoreInfoByParam } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  mode: '',
  modeLabel: '',
  orderType: '',
  orderTypeLabel: '',
  dealerCode: '',
  dealerName: '',
  partCode: '',
  partName: '',
  saleableIs: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  sparePartId: '',
};

export default {
  name: 'purchasePartSaleableEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    // 是否处于编辑（有 id）状态，用于控制【模式】不可改
    isEdit () {
      return !!this._id;
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
    },
    'form.dealerCode': {
      handler (val) {
        // 选中门店时由 change 事件回填名称；编辑回显时若库中门店名称为空，再补查一次
        if (val && this.form.mode === '2' && !this.form.dealerName) {
          this.getDealerName(val);
        }
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '订单类型采购备件设置',
      pageType: 'edit',
      title: '订单类型：' + form.orderTypeLabel,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchasePartSaleable',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      options: {
        // 对应表格里选型枚举
      },
      rules: {
        mode: [
          { required: true, message: '请选择模式', trigger: 'change' }
        ],
        orderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请选择门店', trigger: 'change' }
        ],
        partCode: [
          { required: true, message: '请输入备件编码', trigger: 'change' }
        ],
        partName: [
          { required: true, message: '请输入备件名称', trigger: 'change' }
        ],
        saleableIs: [
          { required: true, message: '请输入是否可售', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ]
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
      // 按门店模式：【是否可售】固定为否，不随前端传值
      if (form.mode === '2') {
        form.saleableIs = '0';
      }
      return addOrUpdate(form);
    },
    // 详情数据转换：按门店模式下【是否可售】固定为否且不可编辑（兼容库中历史空值）
    dataTransform (data) {
      if (data && data.mode === '2') {
        return { ...data, saleableIs: '0' };
      }
      return data;
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getSparePart (query) {
      try {
        const res = await sparePartListShort({ partCodeLikeOrList: query, oemPart: 1 });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    listSparePartChange (val, all) {
      if (all) {
        this.form.sparePartId = all.id;
        this.form.partCode = all.code;
        this.form.partName = all.name;
      } else {
        this.form.sparePartId = '';
        this.form.partCode = '';
        this.form.partName = '';
      }
    },
    // 切换模式时清空对应字段
    handleModeChange (val) {
      this.form.partCode = '';
      this.form.partName = '';
      this.form.sparePartId = '';
      this.form.dealerCode = '';
      this.form.dealerName = '';
      if (val === '2') {
        // 按门店模式，是否可售固定为否
        this.form.saleableIs = '0';
      }
      this.$nextTick(() => {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate();
        }
      });
    },
    // 门店下拉：备件模块统一走 /sp/web/base/common/listDealer
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching dealer list:', error);
        return [];
      }
    },
    // 选中门店后回填门店名称
    handleDealerChange (val, ele) {
      this.form.dealerName = ele && ele.orgName ? ele.orgName : '';
    },
    // 根据门店编码回填门店名称
    getDealerName (dealerCode) {
      listOrgStoreInfoByParam({ orgCodeOrName: dealerCode }).then(res => {
        const list = res || [];
        const dealer = list.find(item => item.orgCode === dealerCode);
        if (dealer) {
          this.form.dealerName = dealer.orgName;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .full-width-item {
    width: 100%;
  }
</style>
