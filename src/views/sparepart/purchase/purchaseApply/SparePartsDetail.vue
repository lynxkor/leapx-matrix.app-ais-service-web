<template>
    <div>
        <div>
            <fetch-select :remote-method="getSparePart" remote v-model="sparePartId"
            placeholder="请输入编码或名称" labelKey="name" valueKey="id" subLabelKey="code" clearable filterable
            @change="handleSparePartChange" />
        </div>
        <div class="common-title">备件详情</div>
        <div class="ais-actions">
            <div class="common-section-table" v-if="sparePartId">
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
                        <el-input type="number" @change="updateSparePartDetail" clearable v-model="sparePartDetail.purchaseQty"></el-input>
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
                        <el-input type="textarea" @change="updateSparePartDetail" maxlength="500" show-word-limit
                            v-model="sparePartDetail.remark" clearable placeholder="请输入采购备注" />
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
                    <template #btn-middle="{ row }">
                        <el-popconfirm
                            title="确定删除此备件吗？"
                            @confirm="handleDel(row)"
                        >
                            <span
                            class="action-button btn-delete"
                            slot="reference"
                            type="text">
                            删除
                            </span>
                        </el-popconfirm>
                    </template>
                </edit-table>
            </div>
        </div>
    </div>
</template>

<script>
import { addDetail, getPurchaseApplyDetail, getPurchaseApplyPage, purchaseApplyDelete } from '@/api/sparepart/purchase/purchaseApply/index';
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
      pageSize: 10,
      current: 1,
      total: 0,
      tableData: [],
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
      spareColumns: [
        {
          field: 'partCode',
          title: '备件编码',
          width: '11%',
        },
        {
          field: 'partName',
          title: '备件名称',
          width: '11%',
        },
        {
          field: 'originalPrice',
          title: '原价',
          width: '11%',
        },
        {
          field: 'purchasePrice',
          title: '采购价',
          width: '11%',
        },
        {
          field: 'purchaseAmount',
          title: '采购金额',
          width: '11%',
        },
        {
          field: 'cashUnitPrice',
          title: '现金单价',
          width: '11%',
        },
        {
          field: 'cashAmount',
          title: '现金金额',
          width: '11%',
        },
        {
          field: 'purchaseQty',
          title: '采购数',
          width: '11%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '11%',
        },
        {
          field: 'originalPriceSource',
          title: '原价来源',
          width: '11%',
        },
      ],
    };
  },
  watch: {
    purchaseApplyId: {
      handler (val) {
        this.getDetailData();
        this.getAddDetail();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async getDetailData () {
      const params = {
        sparePartId: this.sparePartId,
        purchaseApplyId: this.purchaseApplyId,
        pageSize: this.pageSize,
        pageNum: this.current
      };
      const res = await getPurchaseApplyPage(params);
      this.tableData = res.records || [];
      console.log('this.tableData[0]?.sparePartId', this.tableData[0]?.sparePartId);
      this.total = res.total;
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailData();
    },
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
      if (!this.sparePartId) {
        params.sparePartId = this.tableData[0]?.sparePartId;
      }
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
    },
    // 删除事件
    async handleDel (val) {
      await purchaseApplyDelete(val.id);
      this.getDetailData(this.detailId);
    }
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
</style>
