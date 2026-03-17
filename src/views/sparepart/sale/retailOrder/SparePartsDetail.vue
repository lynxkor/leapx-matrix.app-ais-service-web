<template>
    <div>
        <div class="common-title">备件详情</div>
        <div class="ais-actions">
            <div class="common-section-table" v-if="sparePartDetail">
                <el-form label-width="120px" :form="sparePartDetail" inline class="form-detail">
                    <el-form-item label="备件编码：" prop="partCode">
                        <el-input v-model="sparePartDetail.sparePartCode" placeholder="请输入备件编码" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="销售数量：" prop="qty">
                        <el-input v-model="sparePartDetail.qty" placeholder="请输入销售数量"></el-input>
                    </el-form-item>
                    <el-form-item label="备件名称：" prop="partName">
                        <el-input v-model="sparePartDetail.sparePartName" placeholder="请输入备件名称" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="价格类型：" prop="priceType">
                        <el-input v-model="sparePartDetail.priceType" placeholder="请输入价格类型"></el-input>
                    </el-form-item>
                    <el-form-item label="可用库存：" prop="availableQty">
                        <el-input v-model="sparePartDetail.availableQty" placeholder="请输入可用库存" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="销售单价" prop="unitPrice">
                        <el-input v-model="sparePartDetail.unitPrice" placeholder="请输入销售单价" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="在途数量：" prop="inTransitQty">
                        <el-input v-model="sparePartDetail.inTransitQty" placeholder="请输入在途数量" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="优惠金额：" prop="discountAmount">
                        <el-input v-model="sparePartDetail.discountAmount" placeholder="请输入优惠金额"></el-input>
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

export default {
  props: {
    prepareAttachmentsId: { // 备附件销售ID
      type: [String, Number],
      default: ''
    },
    sparePartId: { // 备件信息ID
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      sparePartDetail: {}, // 备件详情信息
    };
  },
  watch: {
    purchaseApplyId: {
      handler (val) {
        if (val) {
          this.getSparePartDetail();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取备件详情信息
    async getSparePartDetail () {
      const params = {
        retailOrderId: this.prepareAttachmentsId,
        sparePartId: this.sparePartId,
      };
      const res = await getRetailOrderDetail(params);
      this.sparePartDetail = res || {};
    },
    // 保存修改
    async handleSave () {
      const params = {
        ...this.sparePartDetail,
        retailOrderId: this.prepareAttachmentsId,
        sparePartId: this.sparePartId,
      };
      await addOrUpdateRetailOrderDetail(params);
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
