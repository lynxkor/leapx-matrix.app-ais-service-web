<template>
    <div>
        <div>
            <fetch-select :remote-method="getSparePart" remote v-model="sparePartId"
            placeholder="请输入编码或名称" labelKey="name" valueKey="id" subLabelKey="code" clearable filterable
            @change="handleSparePartChange" />
        </div>
        <div class="common-title">备件详情</div>
        <div class="ais-actions">
            <div class="common-section-table">
                <el-form label-width="120px" :inline="true" class="form-detail">
                    <el-form-item label="备件编码：" prop="partCode">
                        {{ sparePartDetail.partCode }}
                    </el-form-item>
                    <el-form-item label="备件名称：" prop="partName">
                        {{ sparePartDetail.partName }}
                    </el-form-item>
                    <el-form-item label="是否可售：" prop="saleableIs">
                        {{ sparePartDetail.saleableIs }}
                    </el-form-item>
                    <el-form-item label="替换后件号：" prop="afterPartCode">
                        {{ sparePartDetail.afterPartCode }}
                    </el-form-item>
                    <el-form-item label="替换后名称：" prop="afterPartName">
                        {{ sparePartDetail.afterPartName }}
                    </el-form-item>
                    <el-form-item label="替换备注：" prop="specialCode">
                        {{ sparePartDetail.specialCode }}
                    </el-form-item>
                    <el-form-item label="采购提醒：" prop="reminderContent">
                        {{ sparePartDetail.reminderContent }}
                    </el-form-item>
                    <el-form-item label="本次采购：" prop="purchaseQty">
                        <el-input type="number" @blur="updateSparePartDetail" v-model="sparePartDetail.purchaseQty"></el-input>
                    </el-form-item>
                    <el-form-item label="OEM库存：" prop="oemInventoryIs">
                        {{ sparePartDetail.oemInventoryIs }}
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
                        <el-input type="textarea" @blur="updateSparePartDetail" maxlength="500" show-word-limit
                            v-model="sparePartDetail.remark" placeholder="请输入采购备注" />
                    </el-form-item>
                </el-form>
                <div class="common-title">共享库存(外)</div>
                <div class="common-section-table">
                    <edit-table ref="editTable" :columns="columns" :data="outsideTableData" :show-toolbar="false" />
                </div>
            </div>
            <div class="common-title">备件列表</div>
            <div class="common-section-table">
                <edit-table ref="editTableRight" :columns="spareColumns" :data="tableData"
                    :defaultNewRow="defaultNewRow" :show-toolbar="false" @page-size-change="pageSizeChange"
                    :current="current" :pageSize="pageSize" :showPagination="true" :total="total"
                    @current-page-change="currentPageChange" :auth="{ edit: false, delete: false }">
                    <template #btn-middle="{ row, rowIndex }">
                        <el-button type="text" @click="openPane(row, rowIndex)" class="action-button btn-delete">
                            删除
                        </el-button>
                    </template>
                </edit-table>
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
    }
  },
  components: { EditTable, FetchSelect },
  data () {
    return {
      sparePartId: '', // 备件信息ID
      sparePartDetail: {}, // 备件详情信息
      detailId: '', // 详情ID
      tableData: [],
      outsideTableData: [],
      defaultNewRow: {
        name: '',
      },
      columns: [
        {
          field: 'name',
          title: '门店编码',
          width: '12.5%',
        },
        {
          field: 'age',
          title: '门店名称',
          width: '12.5%',
        },
        {
          field: 'email',
          title: '联系人',
          width: '12.5%',
        },
        {
          field: 'email',
          title: '联系人方式',
          width: '12.5%',
        },
        {
          field: 'email',
          title: '共享库存',
          width: '12.5%',
        },
        {
          field: 'email',
          title: '价格',
          width: '12.5%',
        },
        {
          field: 'email',
          title: '距离(KM)',
          width: '12.5%',
        },
        {
          field: 'email',
          title: '上架说明',
          width: '12.5%',
        },
      ],
      spareColumns: [
        {
          field: 'email',
          title: '备件编码',
          width: '11%',
        },
        {
          field: 'email',
          title: '备件名称',
          width: '11%',
        },
        {
          field: 'email',
          title: '原价',
          width: '11%',
        },
        {
          field: 'email',
          title: '采购价',
          width: '11%',
        },
        {
          field: 'email',
          title: '采购金额',
          width: '11%',
        },
        {
          field: 'email',
          title: '现金单价',
          width: '11%',
        },
        {
          field: 'email',
          title: '现金金额',
          width: '11%',
        },
        {
          field: 'email',
          title: '采购数',
          width: '11%',
        },
        {
          field: 'email',
          title: '备注',
          width: '11%',
        },
        {
          field: 'email',
          title: '原价来源',
          width: '11%',
        },
      ],
    };
  },
  watch: {
    purchaseApplyId: {
      handler (val) {
        console.log('purchaseApplyId', val);
      },
      immediate: true,
      deep: true
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
        this.getSparePartDetail(res);
      });
    },
    // 获取备件详情
    async getAddDetail (params) {
      const res = await addDetail(params);
      this.detailId = res || '';
    },
    // 获取备件详情信息
    async getSparePartDetail (id) {
      const res = await getPurchaseApplyDetail(id);
      this.sparePartDetail = res || {};
      this.outsideTableData = res.sharedInventoryList || [];
    },
    // 失焦事件
    async updateSparePartDetail () {
      const params = {
        id: this.detailId,
        sparePartId: this.sparePartId,
        purchaseApplyId: this.purchaseApplyId,
        remark: this.sparePartDetail.remark,
        purchaseQty: this.sparePartDetail.purchaseQty
      };
      await this.getAddDetail(params);
      this.getSparePartDetail(this.detailId);
    }
  }
};

</script>

<style lang="scss" scoped>
.btn-delete{
  color:#B91919;
}
.common-title {
  font-size: 16px;
  font-weight: 600;
  color: #0A0E0A;
  margin-bottom: 10px;
}
</style>
