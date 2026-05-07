<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
        <template #status>
          <span v-if="form.status" class="status primary">{{ form.status }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="_id" size="small" type="primary" @click="handlePrint">打印</el-button>
          <el-button v-if="_id && form.signStatus === '0'" size="small" type="primary" @click="handleSign">签收</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="调拨入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="调拨出库单：" prop="transferOutboundCode">
                  {{ form.transferOutboundCode }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库仓库：" prop="inboundWarehouseId">
                  {{ form.inboundWarehouseName }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  {{ form.signUserName }}
                </el-form-item>
                <el-form-item label="签收状态：" prop="signStatus">
                  {{ form.signStatusLabel }}
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  {{ form.signTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="调拨入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="调拨出库单：" prop="transferOutboundCode">
                  {{ form.transferOutboundCode }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库仓库：" prop="inboundWarehouseId">
                  {{ form.inboundWarehouseName }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  {{ form.signUserName }}
                </el-form-item>
                <el-form-item label="签收状态：" prop="signStatus">
                  {{ form.signStatusLabel }}
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  {{ form.signTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>入库明细</h2>
            </div>
            <div class="common-section-body">
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
                  <vxe-column field="sparePartName" title="备件名称" min-width="10%" />
                  <vxe-column field="locationName" title="库位" min-width="10%" />
                  <vxe-column field="availableQty" title="可用库存" min-width="10%" />
                  <vxe-column field="purchasePriceTax" title="采购价格(含税)" min-width="10%" />
                  <vxe-column field="purchasePriceNotax" title="采购价格(不含税)" min-width="10%" />
                  <vxe-column field="purchaseAmountTax" title="金额（含税）" min-width="10%" />
                  <vxe-column field="transferQty" title="调拨数量" min-width="10%"/>
                  <vxe-column field="remark" title="备注" min-width="10%"/>
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
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
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, transferInboundDetailPage, getSign } from '@/api/sparepart/transfer/transferInbound/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  transferOutboundCode: '',
  inboundDealerCode: '',
  inboundDealerName: '',
  inboundWarehouseId: '',
  outboundDealerCode: '',
  outboundDealerName: '',
  signStatus: '',
  remark: '',
  createTime: '',
  updateTime: '',
  signTime: '',
};

export default {
  name: 'transferInboundEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
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
      return '调拨入库单号：' + this.form.code;
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
    'form.code': {
      handler (val) {
        if (val) {
          this.getData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件调拨入库',
      pageType: 'edit',
      moduleKey: 'AISPART-transferInbound',
      loading: false,
      submitLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    queryListData (queryString) {
      return new Promise(resolve => {
        resolve([]);
      });
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
    },
    // 获取调拨明细
    async getData () {
      const params = {
        transferInboundId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await transferInboundDetailPage(params);
      this.total = res.total || 0;
      this.tableData = res.records || [];
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
    // 打印调拨入库单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'TransferInventory', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}厅店调拨入库单`// 可选，打印标题
      });
    },
    // 签收调拨入库单
    async handleSign () {
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>此操作将签收调拨入库单, 是否继续?</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(async () => {
        // 调用接口
        await getSign({ id: this._id });
        this.$message({
          type: 'success',
          message: '签收成功!'
        });
        this.$refs.containerRef.loadDetail();
      }).catch(() => {
      });
    },
  }
};
</script>
