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
        :showBackBtn="showBackBtn"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    clearable
                  />
                </el-form-item>
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
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    disabled
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
                <el-form-item label="调价比例%：" prop="percent">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.percent"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="原价优惠券数：" prop="originalPriceCoupon">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.originalPriceCoupon"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠券有效期：" prop="couponValidityPeriod">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="CouponValidityPeriodEnum"
                    v-model="form.couponValidityPeriod"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠券发放时间：" prop="couponIssueTime">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="CouponIssuanceTimeEnum"
                    v-model="form.couponIssueTime"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="full-width-item">
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
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="名称：" prop="name">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="orderType">
                  {{ form.orderTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="调价比例%：" prop="percent">
                  {{ form.percent }}
                </el-form-item>
                <el-form-item label="原价优惠券数：" prop="originalPriceCoupon">
                  {{ form.originalPriceCoupon }}
                </el-form-item>
                <el-form-item label="优惠券有效期：" prop="couponValidityPeriod">
                  {{ form.couponValidityPeriodLabel }}
                </el-form-item>
                <el-form-item label="优惠券发放时间：" prop="couponIssueTime">
                  {{ form.couponIssueTimeLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="full-width-item">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id || couponId">
            <div class="common-section-header">
              <h2>优惠券信息</h2>
            </div>
            <div class="common-section-body">
              <div>
                <el-form :inline="true" :model="form" ref="ruleForm" label-width="100px" class="form-edit">
                  <el-form-item label="新增原价券数：" prop="name">
                    <el-input
                      type="number"
                      placeholder="请输入"
                      v-model="couponObj.count"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="新增原因：" prop="name">
                    <el-input
                      placeholder="请输入"
                      v-model="couponObj.remark"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button class="ais-button" plain size="small" type="primary" @click="handleSubmit">新增优惠券</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :show-toolbar="false"
                  :defaultNewRow="defaultNewRow"
                  :auth="{
                    add: false,
                    edit: false,
                    delete: false,
                  }"
                  :current="current"
                  :pageSize="pageSize"
                  :total="total"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                >
                  <template #btn-middle="{ row }">
                    <el-popconfirm
                      v-if="row.couponStatus == 10"
                      title="确定要将此优惠券作废吗？"
                      @confirm="disableStatus(row)"
                    >
                      <span
                        slot="reference"
                        class="action-button"
                      >
                      失效
                      </span>
                    </el-popconfirm>
                  </template>
                </edit-table>
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
import { getDetail, addOrUpdate, addCoupon, listCoupon, enableOrDisable } from '@/api/sparepart/basic/purchasePrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  name: '',
  dealerCode: '',
  dealerName: '',
  orderType: '',
  percent: '',
  originalPriceCoupon: '',
  status: '',
  couponValidityPeriod: '',
  couponIssueTime: '',
  remark: '',
};

export default {
  name: 'purchasePriceEdit',
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
    EditPageLayout,
    EditBaseContainer,
    EditTable,
    FetchSelect
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
      pageTitle: '备件特殊采购价设置',
      pageType: 'edit',
      title: '名称：' + form.name,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchasePrice',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      couponObj: {
        count: null,
        remark: ''
      },
      couponId: '',
      current: 1,
      pageSize: 10,
      total: 0,
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'id',
          title: '优惠券ID',
          width: '13%',
        },
        {
          field: 'validStart',
          title: '有效开始日期',
          width: '13%',
        },
        {
          field: 'validEnd',
          title: '有效结束日期',
          width: '13%',
        },
        {
          field: 'couponStatusLabel',
          title: '优惠券状态',
          width: '13%',
        },
        {
          field: 'purchaseOrderId',
          title: '业务单据',
          width: '13%',
        },
        {
          field: 'useTime',
          title: '使用时间',
          width: '13%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '13%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '13%',
        },
      ],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称', trigger: 'change' }
        ],
        orderType: [
          { required: true, message: '请选择订单类型：', trigger: 'change' }
        ],
        percent: [
          { required: true, message: '请输入调价比例%', trigger: 'change' }
        ],
        originalPriceCoupon: [
          { required: true, message: '请输入原价优惠券数', trigger: 'change' }
        ],
        couponValidityPeriod: [
          { required: true, message: '请选择优惠券有效期：', trigger: 'change' }
        ],
        couponIssueTime: [
          { required: true, message: '请选择优惠券发放时间：', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    if (this.$route.query.id) {
      this.getCouponList(this.$route.query.id);
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      addOrUpdate({ ...this.form }).then((res) => {
        this.couponId = res || '';
        this.getCouponList(this.couponId);
      });
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
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
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
    },
    // 门店
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        return [];
      }
    },
    // 点击带出门店名称
    handleDealerChange (val, ele) {
      this.form.dealerName = ele.orgName;
    },
    // 新增优惠券信息
    async handleSubmit () {
      const id = this._id ?? this.couponId;
      const params = {
        purchasePriceId: id,
        count: Number(this.couponObj.count),
        remark: this.couponObj.remark
      };
      await addCoupon(params);
      this.couponObj = {};
      this.getCouponList(id);
    },
    // 请求优惠券信息
    async getCouponList (val) {
      const params = {
        purchasePriceId: val,
        pageNum: this.current,
        pageSize: this.pageSize
      };
      const res = await listCoupon(params);
      this.tableData = res.records || [];
      this.total = res.total || 0;
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      const id = this._id ?? this.couponId;
      this.getCouponList(id);
    },
    currentPageChange (current) {
      this.current = current;
      const id = this._id ?? this.couponId;
      this.getCouponList(id);
    },
    // 停用优惠券
    async disableStatus (row) {
      const id = this._id ?? this.couponId;
      const params = { id: row.id };
      await enableOrDisable(params);
      this.getCouponList(id);
    }
  }
};
</script>
<style lang="scss" scoped>
.full-width-item {
  width: 100%;
}
.ais-button {
  margin-left: 20px;
}
.action-button{
  margin: 0 5px;
  cursor: pointer;
  color: #B91919;
}
</style>
