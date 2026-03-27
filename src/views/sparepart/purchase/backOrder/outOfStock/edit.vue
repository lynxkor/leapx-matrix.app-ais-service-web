<template>
    <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
      <template #left>
        <!-- TIPS: 如果需要竖排，direction="vertical" -->
        <edit-base-container
          ref="containerRef"
          :id="_id"
          :title="`${title}${form.backOrderCode}`"
          :isEditing.sync="isEditing"
          :form.sync="form"
          :submitRequest="submitRequest"
          :detailRequest="detailRequest"
          :originalForm.sync="originalForm"
        >
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>常规信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <!-- <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="缺货单号：" prop="backOrderCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.backOrderCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="缺货天数：" prop="backDays">
                    <el-input
                      placeholder="请输入"
                      v-model="form.backDays"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dealerCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="当店可用库存：" prop="availableQty">
                    <el-input
                      placeholder="请输入"
                      v-model="form.availableQty"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dealerName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="当店共享库存：" prop="sharedQty">
                    <el-input
                      placeholder="请输入"
                      v-model="form.sharedQty"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="备件编码：" prop="sparePartCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.sparePartCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="营销分类名称：" prop="marketingType">
                    <el-input
                      placeholder="请输入"
                      v-model="form.marketingType"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="备件名称：" prop="sparePartName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.sparePartName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input
                      placeholder="请输入"
                      v-model="form.remark"
                      clearable
                    />
                  </el-form-item>
                </el-form> -->
                <el-form :inline="true" class="form-detail">
                  <el-form-item label="缺货订单：" prop="backOrderCode">
                    {{ form.backOrderCode }}
                  </el-form-item>
                  <el-form-item label="缺货天数：" prop="backDays">
                    {{ form.backDays }}
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    {{ form.dealerCode }}
                  </el-form-item>
                  <el-form-item label="当店可用库存：" prop="availableQty">
                    {{ form.availableQty }}
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="当店共享库存：" prop="sharedQty">
                    {{ form.sharedQty }}
                  </el-form-item>
                  <el-form-item label="备件编码：" prop="sparePartCode">
                    {{ form.sparePartCode }}
                  </el-form-item>
                  <el-form-item label="营销分类名称：" prop="marketingType">
                    {{ form.marketingType }}
                  </el-form-item>
                  <el-form-item label="备件名称：" prop="sparePartName">
                    {{ form.sparePartName }}
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark" style="width: 100%">
                    {{ form.remark }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>预计到货信息</h2>
              </div>
              <div class="common-section-body">
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="预计厂端发货时间：" prop="estimatedFactoryDeliveryTime">
                    {{ form.estimatedFactoryDeliveryTime }}
                  </el-form-item>
                  <el-form-item label="预计到店时间：" prop="estimatedArrivalTime">
                    {{ form.estimatedArrivalTime }}
                  </el-form-item>
                  <el-form-item label="其他解决方案：" prop="otherSolution">
                    {{ form.otherSolution }}
                  </el-form-item>
                  <el-form-item label="厂端缺货说明：" prop="factoryBackDescription">
                    {{ form.factoryBackDescription }}
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="isEditing || !_id">
                  <el-form-item label="预计厂端发货时间：" prop="estimatedFactoryDeliveryTime">
                    <el-date-picker
                      v-model="form.estimatedFactoryDeliveryTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="预计到店时间：" prop="estimatedArrivalTime">
                    <el-date-picker
                      v-model="form.estimatedArrivalTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="其他解决方案：" prop="otherSolution">
                    <el-input
                      placeholder="请输入"
                      v-model="form.otherSolution"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="厂端缺货说明：" prop="factoryBackDescription" style="width: 100%">
                    <el-input
                      type="textarea"
                      placeholder="请输入"
                      maxlength="500"
                      show-word-limit
                      v-model="form.factoryBackDescription"
                      clearable
                    />
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
import { getBackOrderDetailDetail, updateBackOrderDetail } from '@/api/sparepart/purchase/backOrder/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  backOrderCode: '',
  dealerCode: '',
  dealerName: '',
  sparePartCode: '',
  sparePartName: '',
  backDays: '',
  availableQty: '',
  sharedQty: '',
  marketingType: '',
  remark: '',
  id: '',
  factoryBackDescription: '',
  otherSolution: '',
  estimatedArrivalTime: '',
  estimatedFactoryDeliveryTime: '',
};

export default {
  name: 'backOrderLackEdit',
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
    EditBaseContainer
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
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '缺货明细看板',
      pageType: 'edit',
      title: '缺货单号：',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-backOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getBackOrderDetailDetail(id);
      }
    },
    submitRequest () {
      return updateBackOrderDetail({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
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
  }
};
</script>
