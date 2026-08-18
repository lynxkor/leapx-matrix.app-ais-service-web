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
                    :disabled="isEditing || _id"
                  />
                </el-form-item>
                <el-form-item label="订单类型：" prop="orderType">
                  <fetch-select
                    :options="orderTypeOptions"
                    v-model="form.orderType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="isEditing || _id"
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="名称：" prop="name">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="orderType">
                  {{ form.orderTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
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
                <el-form :inline="true" :model="form" ref="couponForm" :rules="rulesCoupon" label-width="100px" class="form-edit">
                  <el-form-item label="新增原价券数：" prop="count">
                    <el-input
                      type="number"
                      placeholder="请输入"
                      v-model="couponObj.count"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="新增原因：" prop="remark">
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
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="id" title="优惠券ID" min-width="13%" />
                  <vxe-column field="validStart" title="有效开始日期" min-width="13%" />
                  <vxe-column field="validEnd" title="有效结束日期" min-width="13%" />
                  <vxe-column field="couponStatusLabel" title="优惠券状态" min-width="13%" />
                  <vxe-column field="purchaseCode" title="业务单据" min-width="13%" >
                    <template #default="{ row }">
                      <el-link type="success" :href="`/service/sparepart/purchase/purchaseApply/edit?id=${row.purchaseOrderId}`">{{ row.purchaseCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="useTime" title="使用时间" min-width="13%" />
                  <vxe-column field="remark" title="备注" min-width="13%" />
                  <vxe-column field="createTime" title="创建时间" min-width="13%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="canDelete">
                    <template #default="{ row }">
                      <el-popconfirm v-if="row.couponStatus == 10" title="确定要将此优惠券作废吗？" confirm-button-text="失效" confirm-button-type="danger" @confirm="disableStatus(row)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </div>
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
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
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
  // 订单类型下拉框已写死只允许"紧急订单"（枚举值 '1'），创建时默认带出该值
  orderType: '1',
  percent: '',
  originalPriceCoupon: '',
  status: '',
  couponValidityPeriod: '',
  couponIssueTime: '',
  remark: '',
};

// 订单类型：写死只保留紧急订单，枚举值 '1'
const orderTypeOptions = [
  { code: '1', message: '紧急订单' }
];

export default {
  name: 'purchasePriceEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
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
      pageSize: 10,
      pageNum: 1,
      total: 0,
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
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
      },
      rulesCoupon: {
        remark: [
          { required: false, message: '请输入优惠券新增原因', trigger: 'blur' }
        ]
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
        this.$refs.containerRef.loadDetail();
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
      if (this.couponObj.count > 10) {
        this.$message.warning('优惠券新增数不能大于10');
        return; // 阻断提交
      }

      if (this.couponObj.count && !this.couponObj.remark) {
        this.$message.warning('请填写添加优惠券说明');
        return;
      }
      const id = this._id ?? this.couponId;
      const params = {
        purchasePriceId: id,
        count: Number(this.couponObj.count),
        remark: this.couponObj.remark
      };
      await addCoupon(params);
      this.couponObj = {};
      this.getCouponList(id);
      this.$refs.containerRef.loadDetail();
    },
    // 请求优惠券信息
    async getCouponList (val) {
      const params = {
        purchasePriceId: val,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      const res = await listCoupon(params);
      this.tableData = res.records || [];
      this.total = res.total || 0;
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      const id = this._id ?? this.couponId;
      this.getCouponList(id);
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
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
