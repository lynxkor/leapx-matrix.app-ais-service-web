<template>
    <div>
        <div class="common-title">备件详情</div>
        <div class="ais-actions">
            <div class="common-section-table" v-if="sparePartDetail">
                <el-form label-width="100px" :form="sparePartDetail" inline >
                    <el-form-item label="备件编码：" prop="partCode">
                        <el-input v-model="sparePartDetail.sparePartCode" placeholder="请输入备件编码" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="销售数量：" prop="qty">
                        <el-input v-model="sparePartDetail.qty" type="number" :disabled="!(isNumber && outboundIs === '0')" placeholder="请输入销售数量"></el-input>
                    </el-form-item>
                    <el-form-item label="备件名称：" prop="partName">
                        <el-input v-model="sparePartDetail.sparePartName" placeholder="请输入备件名称" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="价格类型：" prop="priceType">
                        <fetch-select :request="fetchOptions" enumCode="RetailOrderPriceTypeEnum" v-model="sparePartDetail.priceType"
                          placeholder="请选择价格类型" clearable filterable :disabled="!isEditSpare" />
                    </el-form-item>
                    <el-form-item label="可用库存：" prop="availableQty">
                        <el-input v-model="sparePartDetail.availableQty" placeholder="请输入可用库存" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="销售单价：" prop="unitPrice">
                        <el-input v-model="sparePartDetail.unitPrice" placeholder="请输入销售单价" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="在途数量：" prop="inTransitQty">
                        <el-input v-model="sparePartDetail.inTransitQty" placeholder="请输入在途数量" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="优惠金额：" prop="discountAmount">
                        <el-input v-model="sparePartDetail.discountAmount" type="number" :disabled="!isEditSpare" placeholder="请输入优惠金额"></el-input>
                    </el-form-item>
                    <el-form-item label="共享库存：" prop="sharedQty">
                        <el-input v-model="sparePartDetail.sharedQty" placeholder="请输入共享库存" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="应付金额：" prop="payableAmount">
                        <el-input v-model="sparePartDetail.payableAmount" placeholder="请输入应付金额" disabled></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { getRetailOrderDetail, addOrUpdateRetailOrderDetail } from '@/api/sparepart/sale/retailOrder/index';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  props: {
    sparePartId: { // 备件信息ID
      type: [String, Number],
      default: ''
    },
    outboundIs: { // 是否出库  是否编辑编辑备件的【销售数量】
      type: String,
      default: ''
    },
    isEditSpare: { // 是否编辑【价格类型】【优惠金额】
      type: Boolean,
      default: false
    },
    isNumber: { // 是否可编辑销售数量
      type: Boolean,
      default: false
    }
  },
  components: {
    FetchSelect
  },
  data () {
    return {
      sparePartDetail: {}, // 备件详情信息
    };
  },
  watch: {
    sparePartId: {
      handler (val) {
        if (val) {
          this.getSparePartDetail();
          console.log('this.sparePartDetail', this.isNumber);
          console.log('this.sparePartDetail', this.outboundIs);
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取备件详情信息
    async getSparePartDetail () {
      const res = await getRetailOrderDetail(this.sparePartId);
      this.sparePartDetail = res || {};
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 保存修改
    async handleSave () {
      await addOrUpdateRetailOrderDetail(this.sparePartDetail);
      this.$message({
        message: '保存成功',
        type: 'success',
      });
    },
  }
};

</script>

<style lang="scss" scoped>
.btn-delete{
  color:#B91919;
  cursor: pointer;
}
.common-title {
  font-size: 16px;
  font-weight: 600;
  color: #0A0E0A;
  margin-bottom: 10px;
}
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
