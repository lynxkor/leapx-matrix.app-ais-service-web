<template>
  <!-- .png,.jpg,.jpeg,.gif,.pdf,.ppt,.pptx,.xlsx,.xls,.docx,.doc,.rar,.zip,.mp4 -->
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`门店回运单号：${form.returnOrderNo}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        direction="horizontal"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <span class="status" :class="{
            primary: form.returnStatus === '10',
            warning: form.returnStatus === '20',
            success: form.returnStatus === '30',
            success: form.returnStatus === '40',
          }">
            {{ form.returnStatusLabel }}
          </span>
        </template>
        <template #extraButtons>
          <template v-if="form.returnStatus==='10'">
            <el-button v-if="canDelete" @click="onRemove" size="small">删除</el-button>
            <el-button v-if="canAddOrUpdate" @click="onNext" size="small">下发</el-button>
          </template>
          <template v-if="form.returnStatus==='20'">
            <el-button v-if="canAddOrUpdate" @click="onOutbound" size="small">回运出库</el-button>
          </template>
          <template v-if="form.returnStatus==='30'">
            <el-button v-if="canAddOrUpdate" @click="onSign" size="small">签收</el-button>
          </template>
          <template v-if="form.returnStatus==='40'">
            <el-button v-if="canAddOrUpdate" @click="onCompleteAcceptance" size="small">验收完成</el-button>
            <el-button v-if="canAddOrUpdate" @click="onSingleAcceptance" size="small">单件验收</el-button>
          </template>
          <el-button v-if="canAddOrUpdate" @click="onPrintReturnOrder" size="small">打印回运单</el-button>
          <el-button v-if="canAddOrUpdate" @click="onPrintMark" size="small">打印标签</el-button>
          <el-button v-if="canAddOrUpdate" @click="onPrintWrapper" size="small">打印外包装标签</el-button>
        </template>
        <el-main>
          <div v-if="isEditing" class="header-desc">
            保修月份：{{ form.warrantyMonth }}&nbsp;&nbsp;|&nbsp;&nbsp;旧件返还类型：{{ form.returnTypeLabel }}
          </div>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                <el-form-item label="门店回运单号：" prop="returnOrderNo">
                  <base-input
                    placeholder="请输入"
                    v-model="form.returnOrderNo"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="回运状态：" prop="returnStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_return_order_status"
                    v-model="form.returnStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="旧件返回类型：" prop="returnType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_return_type"
                    v-model="form.returnType"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerCode">
                  <fetch-select
                    :disabled="form.returnStatus!=='10'"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.dealerCode"
                    :remote-method="dealerSearch"
                    :params="form.dealerCode"
                    @change="dealerChange"
                    value-key="orgCode"
                    label-key="orgName"
                  />
                </el-form-item>
                <el-form-item label="回运地址：" prop="receiverAddress">
                  <base-input
                    placeholder="请输入"
                    v-model="form.receiverAddress"
                    clearable
                    :disabled="form.returnStatus!=='10'"
                  />
                </el-form-item>
                <el-form-item label="回运日期：" prop="returnDate">
                  <el-date-picker
                    :disabled="form.returnStatus==='40'"
                    v-model="form.returnDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="收货联系人：" prop="receiverContact">
                  <base-input
                    placeholder="请输入"
                    v-model="form.receiverContact"
                    clearable
                    :disabled="form.returnStatus!=='10'"
                  />
                </el-form-item>
                <el-form-item label="收货电话：" prop="receiverPhone">
                  <base-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                    maxlength="11"
                    :disabled="form.returnStatus!=='10'"
                  />
                </el-form-item>
                <el-form-item label="回运件数（纸箱/木架）：" prop="returnUnit">
                  <base-input
                    placeholder="请输入"
                    v-model="form.returnUnit"
                    clearable
                    :disabled="form.returnStatus==='40'"
                  />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompany">
                  <base-input
                    placeholder="请输入"
                    v-model="form.logisticsCompany"
                    clearable
                    :disabled="form.returnStatus==='40'"
                  />
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsTrackingNo">
                  <base-input
                    placeholder="请输入"
                    v-model="form.logisticsTrackingNo"
                    clearable
                    :disabled="form.returnStatus==='40'"
                  />
                </el-form-item>
                <el-form-item label="是否验收完成：" prop="isChecked">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isChecked"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="form.returnStatus!=='40'"
                  />
                </el-form-item>
                <el-form-item label="签收日期：" prop="signReceiveDate">
                  <el-date-picker
                    v-model="form.signReceiveDate"
                    disabled
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预计到达日期：" prop="estimatedArrivalDate">
                  <el-date-picker
                    :disabled="form.returnStatus!=='20'"
                    v-model="form.estimatedArrivalDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item class="form-item-full" label="备注：" prop="remark">
                  <base-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxlength="1000"
                    type="textarea"
                    :disabled="form.returnStatus==='40'"
                  />
                </el-form-item>
                <el-form-item class="form-item-full" label="签收备注：" prop="signRemark">
                  <base-input
                    placeholder="请输入"
                    v-model="form.signRemark"
                    clearable
                    maxlength="1000"
                    type="textarea"
                    :disabled="form.returnStatus!=='40'"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-else>
                <el-form-item label="门店回运单号：">
                  {{ form.returnOrderNo }}
                </el-form-item>
                <el-form-item label="回运状态：">
                  {{ form.returnStatusLabel }}
                </el-form-item>
                <el-form-item label="旧件返回类型：">
                  {{ form.returnTypeLabel }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/partner/channelManagement/shopDetail',
                      query: {
                        dealerCode: form.dealerCode,
                      },
                    })"
                    type="text">{{form.dealerName}}</el-button>
                </el-form-item>
                <el-form-item label="回运地址：">
                  {{ form.receiverAddress }}
                </el-form-item>
                <el-form-item label="回运日期：">
                  {{ form.returnDate }}
                </el-form-item>
                <el-form-item label="收货联系人：">
                  {{ form.receiverContact }}
                </el-form-item>
                <el-form-item label="收货电话：">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="回运件数（纸箱/木架）：">
                  {{ form.returnUnit }}
                </el-form-item>
                <el-form-item label="物流商：">
                  {{ form.logisticsCompany }}
                </el-form-item>
                <el-form-item label="物流单号：">
                  {{ form.logisticsTrackingNo }}
                </el-form-item>
                <el-form-item label="是否验收完成：">
                  {{ form.isChecked == '1' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="签收日期：">
                  {{ form.signReceiveDate }}
                </el-form-item>
                <el-form-item label="预计到达日期：">
                  {{ form.estimatedArrivalDate }}
                </el-form-item>
                <el-form-item class="form-item-full" label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item class="form-item-full" label="签收备注：">
                  {{ form.signRemark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <ReturnOrderTable
            ref="returntable"
            :disabled="form.returnStatus !== '10'"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
            :dealerCode="dealerCode"
            @getTableData="getTableData"
            @checkboxChange="checkboxChange"
          />
          <SingleDialog
            :visible.sync="visible"
            :_id="_id"
            @refresh="refreshTable"
          />
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
import { getDetail, addOrUpdate, deleteItem, publish, dealerOutbound, signByIds, checkFinished } from '@/api/claimreturn/oldpart/returnorder';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditPageLayout from '@/libs/components/EditPageLayout';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import ReturnOrderTable from './ReturnOrderTable.vue';
import SingleDialog from './SingleDialog/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  returnOrderNo: '',
  dealerName: '',
  dealerCode: '',
  returnStatus: '10', // 10 草稿; 20待回运; 30 已回运; 40 已签收
  isChecked: '',
  returnDate: '',
  returnType: '40', // 10 无旧件; 20 不返件; 30 正常返件; 40 快速返还
  receiverAddress: '',
  receiverContact: '',
  logisticsTrackingNo: '',
  logisticsCompany: '',
  estimatedArrivalDate: '',
  returnUnit: '',
  signReceiveDate: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  warrantyMonth: '',
  receiverPhone: '',
  signRemark: '',
};

export default {
  name: 'ReturnOrderEdit',
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
    FetchSelect,
    EditBaseContainer,
    BaseInput,
    ReturnOrderTable,
    SingleDialog,
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
    const isFast = location.pathname.includes('/fast/');

    return {
      pageTitle: isFast ? '旧件快返回运单' : '门店旧件回运单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: this.$route.meta.moduleKey,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      rules: {},
      dealerCode: '',
      existTableData: false,
      selectedRows: [],
      // 单件验收
      visible: false,
    };
  },
  created () {
    this.updateRules(this.form.returnStatus);
  },
  mounted () {
  },
  methods: {
    getTableData (data) {
      this.existTableData = Boolean(data?.length > 0);
    },
    checkboxChange (records) {
      this.selectedRows = records;
    },
    // 门店名称搜索
    async dealerSearch (query) {
      return listOrgStoreInfo({
        name: query || '',
      });
    },
    dealerChange (val, record) {
      if (record) {
        this.form.dealerCode = record.orgCode;
        this.form.dealerName = record.orgName;
      }
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    updateRules (returnStatus) {
      const status10 = returnStatus === '10'; // 草稿
      const status20 = returnStatus === '20'; // 待回运
      const status30 = returnStatus === '30'; // 已回运
      const status40 = returnStatus === '40'; // 已签收

      this.rules = {
        dealerCode: [
          { required: status10, message: '请选择门店', trigger: 'change' }
        ],
        receiverAddress: [
          { required: status10, message: '请输入回运地址', trigger: 'change' }
        ],
        returnDate: [
          { required: status20 || status30, message: '请选择回运日期', trigger: 'change' }
        ],
        returnUnit: [
          { required: status20 || status30, message: '请输入回运件数', trigger: 'change' }
        ],
        logisticsCompany: [
          { required: status20 || status30, message: '请输入物流商', trigger: 'change' }
        ],
        logisticsTrackingNo: [
          { required: status20 || status30, message: '请输入物流单号', trigger: 'change' }
        ],
        receiverContact: [
          { required: status10, message: '请输入收货联系人', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        warrantyMonth: [
          { required: true, message: '请输入保修月份', trigger: 'change' }
        ],
        estimatedArrivalDate: [
          { required: status20, message: '请选择预计到达日期', trigger: 'change' }
        ],
        receiverPhone: [
          { required: status10, message: '请输入收货电话', trigger: 'change' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        // signRemark: [
        //   { required: status40, message: '请输入签收备注', trigger: 'change' }
        // ],
      };
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(data => {
          this.dealerCode = data.dealerCode;
          this.updateRules(data.returnStatus);
          return data;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({
        ...this.form,
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    onBack () {
      this.$router.back();
    },
    onRemove () {
      this.$confirm('确认是否要删除回运单，删除后无法撤回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem([this._id]).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.onBack();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    onNext () {
      if (!this.existTableData) {
        this.$message.warning('当前旧件回运单没有添加明细');
        return;
      }
      // 是否确认下发
      this.$confirm('是否确认下发？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        publish(this._id).then(() => {
          this.$message({
            type: 'success',
            message: '下发成功'
          });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {

        });
      }).catch(() => {});
    },
    onPrintReturnOrder () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'ReturnOrder',
        title: '打印回运单',
        width: 1122,
      });
    },
    onPrintMark () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择旧件库存明细进行打印');
        return;
      };
      const ids = this.selectedRows.map(item => item.id);
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'OldPartMark',
        title: '打印回运单',
        width: 1122,
        data: ids,
      });
    },
    onPrintWrapper () {
      //
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'PrintOuterLabel',
        title: '打印外包装标签',
        width: 1090,
      });
    },
    onOutbound () {
      if (!this.form.estimatedArrivalDate) {
        this.$message({
          type: 'warning',
          message: '请填写预计到达日期'
        });
        return;
      }
      // 是否确认回运出库
      this.$confirm('您确定要回运出库吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dealerOutbound(this._id).then(() => {
          this.$message({
            type: 'success',
            message: '回运出库成功'
          });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {

        });
      });
    },
    onSign () {
      // 是否确认签收
      this.$confirm('您确定要签收吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        signByIds([this._id]).then(() => {
          this.$message({
            type: 'success',
            message: '签收成功'
          });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {

        });
      });
    },
    onCompleteAcceptance () {
      // 验收完成
      this.$confirm('您确定要验收吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkFinished(this._id).then(() => {
          this.$message({
            type: 'success',
            message: '您已经完成验收'
          });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {

        });
      });
    },
    onSingleAcceptance () {
      // 单件验收
      this.visible = true;
    },
    refreshTable () {
      this.$refs.returntable.getTableData();
    }
  }
};
</script>
<style lang="scss" scoped>
.header-desc {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: #6C6E6C;
  margin-top: 8px;
}

</style>
