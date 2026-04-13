<template>
  <edit-page-layout ref="editLayout" :title="repairDetailName" showPaneFooter @save="handleSave" :width="60">
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
                <el-form-item label="权益商品代码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    @input="handleCodeInput"
                  />
                </el-form-item>
                <el-form-item label="权益商品名称：" prop="commodityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.commodityName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="服务权益类型：" prop="serviceInterestsType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="InterestsGoodsServiceInterestsTypeEnum"
                    v-model="form.serviceInterestsType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="购买后有效期（月）：" prop="datePurchase">
                  <el-input
                    placeholder="请输入"
                    v-model="form.datePurchase"
                    clearable
                    @input="handleDatePurchaseInput"
                  />
                </el-form-item>
                <el-form-item label="是否上架：" prop="whetherShelf">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.whetherShelf"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="note" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.note"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="权益商品名称：" prop="commodityName">
                  {{ form.commodityName }}
                </el-form-item>
                <el-form-item label="权益商品代码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="服务权益类型：" prop="serviceInterestsType">
                  {{ form.serviceInterestsTypeLabel }}
                </el-form-item>
                <el-form-item label="购买后有效期（月）：" prop="datePurchase">
                  {{ form.datePurchase }}
                </el-form-item>
                <el-form-item label="是否上架：" prop="whetherShelf">
                  {{ form.whetherShelfLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="note" class="form-item-full">
                  {{ form.note }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>维修项目</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <BaseSearch
                  :remote-method="queryRepairItemList"
                  remote
                  placeholder="搜索维修项目代码、名称、拼音简码"
                  clearable
                  value-key="id"
                  label-key="name"
                  @change="handleAddRepairItem"
                />
                <!-- 右侧：合计信息 -->
                <div class="summary-box">
                  <span class="summary-item">项目索赔合计：￥{{ claimItemAmount }}</span>
                  <span class="summary-item">零件索赔合计：￥{{ claimPartsAmount }}</span>
                  <span class="summary-item">索赔费用合计：￥{{ totalClaimAmount }}</span>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="repairItemTableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="repairItemCode" title="项目代码" width="200" />
                  <vxe-column field="repairItemName" title="项目名称" width="200" />
                  <vxe-column field="repairItemTypeName" title="维修类型" width="150" />
                  <vxe-column field="checkoutTypeName" title="结算类型" width="150" />
                  <vxe-column field="discountAmount" title="优惠金额" width="150" />
                  <vxe-column field="claimPrice" title="索赔价格" width="150" />
                  <vxe-column field="unitPrice" title="工时单价" width="150" />
                  <vxe-column field="workingHours" title="工时数量" width="150" />
                  <vxe-column field="receivableAmount" title="项目金额" width="150" />
                  <vxe-column title="操作" width="150" fixed="right" v-if="canDelete">
                    <template #default="{ row }">
                      <span @click="handleEditRepairItem(row)" class="action-button btn-edit">编辑</span>
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRepairItem(row)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>零件明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tablePartData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="repairItemName" title="维修项目" width="14.3%" />
                  <vxe-column field="repairItemCode" title="维修项目代码" width="14.3%" />
                  <vxe-column field="partsName" title="零件名称" width="14.3%" />
                  <vxe-column field="partsCode" title="零件代码" width="14.3%" />
                  <vxe-column field="repairItemTypeName" title="维修类型" width="14.3%" />
                  <vxe-column field="checkoutTypeName" title="结算类型" width="14.3%" />
                  <vxe-column field="totalAmount" title="数量" width="14.3%" />
                  <vxe-column field="unitPrice" title="单价" width="14.3%" />
                  <vxe-column field="discountAmount" title="优惠金额" width="14.3%" />
                  <vxe-column field="receivableAmount" title="零件金额" width="14.3%" />
                  <vxe-column field="claimPrice" title="索赔金额" width="14.3%" />
                  <!-- <vxe-column title="操作" width="150" fixed="right" v-if="canDelete">
                    <template #default="{ row }">
                      <span @click="handleEditRow(row)" class="action-button btn-edit">编辑</span>
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(row)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column> -->
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <InterestsGoodsDetail
          ref="interestsGoodsDetail"
          :repairItemId="currentRepairItemId"
          :detailData="currentDetailData"
          @submit="handleDetailSubmit"
        />
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, deleteGoodsRepairItem } from '@/api/maintain/sp/interestsGoods/index';
import { getPage as getRepairItemPage } from '@/api/maintain/basic/repairItem/index';
import FetchSelect from '@/libs/components/FetchSelect';
import BaseSearch from '@/libs/components/BaseSearch';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import InterestsGoodsDetail from './InterestsGoodsDetail.vue';

const defaultForm = {
  commodityCode: '',
  commodityName: '',
  serviceInterestsType: '',
  classificationGoodsName: '',
  datePurchase: '',
  status: '',
  claimItemAmount: '',
  claimPartsAmount: '',
  claimOtherAmount: '',
  note: '',
  modifierName: '',
  updateTime: '',
  creator: '',
  creatorName: '',
  createTime: '',
  id: '',
  modifier: '',
  remark: '',
  statusDesc: '',
  code: '',
  classificationGoodsId: '',
  whetherShelf: '',
  shelfTime: '',
  systemUserId: '',
  systemUserName: '',
  frameTime: '',
  helvesPerUserId: '',
  helvesPerUserName: '',
};

export default {
  name: 'interestsGoodsEdit',
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
    FetchSelect,
    InterestsGoodsDetail,
    BaseSearch
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '权益商品代码：' + this.form.code;
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
    'form.id': {
      handler (val) {
        if (val) {
          this.getRepairItemList();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '权益商品管理',
      pageType: 'edit',
      moduleKey: 'AISMC-interestsGoods',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '暂无数据',
      repairItemTableData: [],
      currentRepairItemId: '',
      currentDetailData: {},
      repairDetailName: '',
      tablePartData: [],
      claimItemAmount: 0.00, // 项目索赔合计
      claimPartsAmount: 0.00, // 零件索赔合计
      totalClaimAmount: 0.00, // 索赔费用合计
      rules: {
        code: [
          { required: true, message: '请输入权益商品代码', trigger: 'change' }
        ],
        commodityName: [
          { required: true, message: '请输入权益商品名称', trigger: 'change' }
        ],
        serviceInterestsType: [
          { required: true, message: '请选择服务权益类型', trigger: 'change' }
        ],
        datePurchase: [
          { required: true, message: '请输入购买后有效期（月）', trigger: 'change' },
          { validator: this.validateDatePurchase, trigger: 'blur' } // 添加自定义校验
        ],
      }
    };
  },
  mounted () {
    if (!this._id) {
      this.initDefaultValues();
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
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 关闭侧边栏
    closePane () {
      this.$refs.editLayout.closePane();
    },
    // 获取维修项目列表
    async getRepairItemList () {
      const res = await this.detailRequest();
      if (res && res.goodsRepairItemList) {
        this.repairItemTableData = res.goodsRepairItemList;
        let itemClaimTotal = 0;
        let partsClaimTotal = 0;
        // 循环获取零件信息放入tablePartData
        this.tablePartData = [];
        res.goodsRepairItemList.forEach(item => {
          const itemClaimPrice = Number(item.claimPrice) || 0;
          itemClaimTotal = itemClaimTotal + itemClaimPrice;
          if (item.goodsPartsList) {
            // 计算零件金额
            for (const part of item.goodsPartsList) {
              const totalAmount = Number(part.totalAmount) || 0;
              const unitPrice = Number(part.unitPrice) || 0;
              const discountAmount = Number(part.discountAmount) || 0;
              const partClaimPrice = Number(part.claimPrice) || 0;

              let receivable = totalAmount * unitPrice;
              receivable = receivable - discountAmount;
              part.receivableAmount = Math.max(0, receivable.toFixed(2));
              partsClaimTotal = partsClaimTotal + partClaimPrice;
            }
            this.tablePartData = this.tablePartData.concat(item.goodsPartsList);
          }
        });
        this.claimItemAmount = itemClaimTotal;
        this.claimPartsAmount = partsClaimTotal;
        this.totalClaimAmount = itemClaimTotal + partsClaimTotal;
      }
    },
    // 搜索维修项目
    queryRepairItemList (queryString) {
      return new Promise(resolve => {
        getRepairItemPage({ nameOrCodeOrPinyinLike: queryString, status: 1, limitSize: 20, isActivity: 0 }).then(res => {
          const list = res || [];
          resolve(list);
        });
      });
    },
    // 新增维修项目
    handleAddRepairItem (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      const exists = this.repairItemTableData.some(item => item.repairItemId === record.id);
      if (exists) {
        this.$message.warning('该维修项目已存在，请勿重复添加');
        return;
      }
      this.repairDetailName = record.name || '';
      // 新增模式：传repairItemId，不传detailData，子组件会调用getDetail
      this.currentRepairItemId = record.id;
      this.currentDetailData = {};
      this.openPane();
    },
    // 编辑维修项目
    handleEditRepairItem (row) {
      this.repairDetailName = row.repairItemName || '';
      // 编辑模式：不传repairItemId，传detailData，子组件直接使用
      this.currentRepairItemId = '';
      this.currentDetailData = { ...row };
      this.openPane();
    },
    // 删除维修项目
    async handleDeleteRepairItem (row) {
      const index = this.repairItemTableData.findIndex(item => item.repairItemId === row.repairItemId);
      if (index === -1) {
        this.$message.warning('未找到要删除的数据');
        return;
      }

      try {
        // 先从列表中移除
        const tempList = [...this.repairItemTableData];
        tempList.splice(index, 1);

        // 调用接口删除
        await deleteGoodsRepairItem([row.id]).then(() => {
          // 成功后更新本地数据
          // this.repairItemTableData = tempList;
          this.$message.success('删除成功');
          this.getRepairItemList();
        });

        // 成功后更新本地数据
        // this.repairItemTableData = tempList;
        // this.$message.success('删除成功');
        // this.getRepairItemList();
      } catch (error) {
        this.$message.error('删除失败');
        console.error('删除维修项目失败:', error);
      }
    },
    // 侧边栏保存回调
    async handleDetailSubmit (data) {
      try {
        // 构建新的列表
        const index = this.repairItemTableData.findIndex(item => item.repairItemId === data.repairItemId);
        let tempList;
        if (index > -1) {
          // 编辑：更新已有数据
          tempList = [...this.repairItemTableData];
          tempList[index] = data;
        } else {
          // 新增：添加到列表
          tempList = [...this.repairItemTableData, data];
        }

        // 先调用接口保存
        await addOrUpdate({ ...this.form, goodsRepairItemList: tempList });

        // 成功后更新本地数据
        // this.repairItemTableData = tempList;
        this.closePane();
        this.$message.success('保存成功');
        this.getRepairItemList();
      } catch (error) {
        this.$message.error('保存失败');
        console.error('保存维修项目失败:', error);
      }
    },
    // 保存侧边栏
    async handleSave () {
      await this.$refs.interestsGoodsDetail?.handleSave();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return await getEnum(code);
      }
      return [];
    },
    handleCodeInput (val) {
      this.form.code = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    },
    /**
     * 处理购买后有效期输入，只允许输入正整数
     */
    handleDatePurchaseInput (val) {
      // 移除所有非数字字符
      const cleaned = val.replace(/\D/g, '');
      // 如果清理后的值与原值不同，则更新模型
      if (cleaned !== val) {
        this.form.datePurchase = cleaned;
      }
    },

    /**
     * 自定义校验规则：必须为大于0的整数
     */
    validateDatePurchase (rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入购买后有效期（月）'));
      }
      // 检查是否为整数
      if (!Number.isInteger(Number(value))) {
        return callback(new Error('请输入有效的整数'));
      }

      // 检查是否大于0
      if (Number(value) <= 0) {
        return callback(new Error('有效期必须大于0'));
      }

      callback();
    },
    /**
     * 初始化新增时的默认值
     */
    async initDefaultValues () {
      const enumData = await getEnum('InterestsGoodsServiceInterestsTypeEnum');
      this.form.serviceInterestsType = enumData[0].code;
      // 同时设置是否上架 默认选中第一个
      this.form.whetherShelf = 1;
    },
  }
};
</script>

<style lang="scss" scoped>
.action-button {
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit {
    color: #4C4CD6;
  }
  &.btn-delete {
    color: #b91919 !important;
  }
}
.btn-delete {
  margin-left: 5px;
  cursor: pointer;
  color: #b91919;
}

.summary-box {
  display: flex;
  gap: 8px;
  font-size: 14px;
  margin-right: 10px;
}

.summary-item {
  white-space: nowrap;
}

</style>
