<template>
    <div>
        <div>
            <fetch-select :remote-method="getSparePart" remote v-model="sparePartId"
            placeholder="请输入编码或名称" labelKey="name" valueKey="id" subLabelKey="code" clearable filterable
            @change="handleSparePartChange" />
        </div>
        <div class="common-title">备件详情</div>
        <div class="ais-actions">
            <div class="common-section-table" v-if="sparePartDetail">
                <el-form label-width="120px" :form="sparePartDetail" :inline="true" class="form-detail">
                    <el-form-item label="备件编码：" prop="partCode">
                        {{ sparePartDetail.partCode }}
                    </el-form-item>
                    <el-form-item label="备件名称：" prop="partName">
                        {{ sparePartDetail.partName }}
                    </el-form-item>
                    <el-form-item label="是否可售：" prop="saleableIs">
                        {{ sparePartDetail.saleableIsLabel }}
                    </el-form-item>
                    <el-form-item label="替换后件号：" prop="afterPartCode">
                        {{ sparePartDetail.afterPartCode }}
                        <el-button v-if="sparePartDetail.afterPartCode" size="mini" @click="handleSparePartChange(sparePartDetail.afterSparePartId)">转替换件</el-button>
                    </el-form-item>
                    <el-form-item label="替换后名称：" prop="afterPartName">
                        {{ sparePartDetail.afterPartName }}
                    </el-form-item>
                    <el-form-item label="替换备注：" prop="specialCode">
                        {{ sparePartDetail.replaceRemark }}
                    </el-form-item>
                    <el-form-item label="采购提醒：" prop="reminderContent">
                        {{ sparePartDetail.reminderContent }}
                    </el-form-item>
                    <el-form-item label="本次采购：" prop="purchaseQty">
                        <el-input type="number" @change="updateSparePartDetail" clearable v-model="sparePartDetail.purchaseQty"></el-input>
                    </el-form-item>
                    <el-form-item label="OEM库存：" prop="oemInventoryIs">
                        {{ sparePartDetail.oemInventoryIs }}
                    </el-form-item>
                    <el-form-item label="可用库存：" prop="inTransitQty">
                        {{ sparePartDetail.availableQty }}
                    </el-form-item>
                    <el-form-item label="在途数量：" prop="inTransitQty">
                        {{ sparePartDetail.inTransitQty }}
                    </el-form-item>
                    <el-form-item label="共享库存(内)：" prop="sharedQtyCurrent">
                        {{ sparePartDetail.sharedQtyCurrent }}
                    </el-form-item>
                    <el-form-item label="共享库存(外)：" prop="sharedQtyOut">
                        {{ sparePartDetail.sharedQtyOut }}
                    </el-form-item>
                    <el-form-item label="最小订购量：" prop="minOrderQuantity">
                        {{ sparePartDetail.minOrderQuantity }}
                    </el-form-item>
                    <el-form-item label="建议采购量：" prop="suggestionQty">
                        {{ sparePartDetail.suggestionQty }}
                    </el-form-item>
                    <el-form-item style="width: 100%;" label="采购备注：" prop="remark">
                        <el-input type="textarea" @change="updateSparePartDetail" maxlength="500" show-word-limit
                            v-model="sparePartDetail.remark" clearable placeholder="请输入采购备注" />
                    </el-form-item>
                </el-form>
                <div class="common-title">共享库存(外)</div>
                <div class="common-section-table">
                    <edit-table ref="editTable" :columns="columns" :data="outsideTableData" :show-toolbar="false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { addDetail, getPurchaseApplyDetail, getPurchaseApplyPage } from '@/api/sparepart/purchase/purchaseApply/index';
import EditTable from '@/libs/components/EditTable';
import { sparePartListShort } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  props: {
    purchaseApplyId: { // 采购申请单ID
      type: [String, Number],
      default: ''
    },
    purchaseApplyDeleteId: { // 采购申请单详情ID
      type: [String, Number],
      default: ''
    }
  },
  components: { EditTable, FetchSelect },
  data () {
    return {
      sparePartId: '', // 备件信息ID
      sparePartDetail: {}, // 备件详情信息
      detailId: '', // 详情ID
      outsideTableData: [],
      defaultNewRow: {
        name: '',
      },
      columns: [
        {
          field: 'dealerCode',
          title: '门店编码',
          width: '12.5%',
        },
        {
          field: 'dealerName',
          title: '门店名称',
          width: '12.5%',
        },
        {
          field: 'sharedContactPerson',
          title: '联系人',
          width: '12.5%',
        },
        {
          field: 'sharedContactInfo',
          title: '联系人方式',
          width: '12.5%',
        },
        {
          field: 'sharedQty',
          title: '共享库存',
          width: '12.5%',
        },
        {
          field: 'suggestedSharedPrice',
          title: '价格',
          width: '12.5%',
        },
        {
          field: 'distance',
          title: '距离(KM)',
          width: '12.5%',
        },
        {
          field: 'sharedDescription',
          title: '上架说明',
          width: '12.5%',
        },
      ],
    };
  },
  watch: {
    purchaseApplyDeleteId: {
      async handler (val) {
        if (val) {
          await this.getSparePartDetail(val);
        };
      },
      immediate: true,
    }
  },
  methods: {
    // 备件远程搜索
    async getSparePart (query) {
      try {
        const res = await sparePartListShort({ partCodeLikeOrList: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 备件远程选择change事件
    handleSparePartChange (val) {
      if (!val) {
        return;
      };
      this.sparePartId = val;
      const params = {
        sparePartId: val,
        purchaseApplyId: this.purchaseApplyId
      };
      addDetail(params).then(res => {
        this.detailId = res || '';
        this.getSparePartDetail(res); // 拿到获取的 备件列表id 去查询详情
        this.$emit('submit');
      });
    },
    // 备件采购申请明细表新增/编辑
    async getAddDetail (params) {
      const res = await addDetail(params);
      this.detailId = res || '';
    },
    // 获取备件详情信息
    async getSparePartDetail (id) {
      const res = await getPurchaseApplyDetail(id);
      this.sparePartDetail = res || {};
      this.outsideTableData = res?.sharedInventoryList || [];
    },
    // 失焦事件
    async updateSparePartDetail () {
      const params = {
        id: this.sparePartDetail.id,
        sparePartId: this.sparePartDetail.sparePartId,
        purchaseApplyId: this.purchaseApplyId,
        remark: this.sparePartDetail.remark,
        purchaseQty: this.sparePartDetail.purchaseQty
      };
      await this.getAddDetail(params);
      this.getSparePartDetail(this.detailId);
      this.$emit('submit');
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
