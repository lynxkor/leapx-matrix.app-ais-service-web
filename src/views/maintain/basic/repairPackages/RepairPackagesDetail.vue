<template>
    <div>
        <el-main>
            <section class="common-section">
                <div class="common-section-header">
                    <h2>基础信息</h2>
                </div>
                <div class="common-section-body">
                    <el-form label-width="120px" :roles="roles" :form="repairDetail" :inline="true" class="form-edit">
                        <el-form-item label="项目名称：" prop="name">
                            {{ repairDetail.repairItemName }}
                        </el-form-item>
                        <el-form-item label="项目代码：" prop="code">
                            {{ repairDetail.repairItemCode }}
                        </el-form-item>
                        <el-form-item label="维修类型：" prop="repairItemTypeId">
                            <fetch-select
                                :remote-method="repairItemSearch"
                                remote
                                v-model="repairDetail.repairItemTypeId"
                                placeholder="请选择维修类型名称"
                                labelKey="label"
                                valueKey="value"
                                clearable
                                filterable
                                @change="handleRepairItemChange"
                            />
                        </el-form-item>
                        <el-form-item label="结算类型：" prop="checkoutTypeId">
                            <fetch-select
                                filterable
                                clearable
                                remote
                                v-model="repairDetail.checkoutTypeId"
                                :remote-method="settlementSearch"
                                placeholder="请选择结算类型名称"
                                @change="handleCheckoutTypeChange"
                                value-key="value"
                                label-key="label"
                            />
                        </el-form-item>
                        <el-form-item label="优惠金额：" prop="discountAmount">
                            <el-input type="number" @blur="handleDiscountAmountBlur" clearable size="small"
                                v-model="repairDetail.discountAmount"></el-input>
                        </el-form-item>
                        <el-form-item label="工时单价：" prop="price">
                            {{ repairDetail.price }}
                        </el-form-item>
                        <el-form-item label="工时数量：" prop="workHour">
                            {{ repairDetail.workHour }}
                        </el-form-item>
                        <el-form-item label="项目金额：" prop="purchaseQty">
                            {{ repairDetail.actualAmount || 0 }}
                        </el-form-item>
                        <el-form-item style="width: 100%;" label="备注：" prop="remark">
                            <el-input type="textarea" maxlength="500" show-word-limit
                                v-model="repairDetail.remark" clearable placeholder="请输入备注" />
                        </el-form-item>
                    </el-form>
                </div>
            </section>
            <section class="common-section">
                <div class="common-section-header">
                    <h2>零件信息</h2>
                </div>
                <div class="common-section-body">
                    <div class="common-section-header">
                        <div class="ais-select-group">
                            <base-search
                                style="width: 300px;"
                                :remote-method="queryListData"
                                remote
                                placeholder="搜索维修零件代码、名称"
                                clearable
                                value-key="value"
                                label-key="label"
                                @change="handleAddTableData"
                            />
                        </div>
                    </div>
                    <div class="common-section-table">
                        <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner"
                            size="medium" min-height="0" max-height="400px">
                            <vxe-column field="partsName" title="零件名称" width="150">
                                <template #default="{ row }">
                                    <fetch-select
                                        v-model="row.partsCode"
                                        :remote-method="queryListData"
                                        remote
                                        placeholder="请输入"
                                        clearable
                                        filterable
                                        value-key="value"
                                        label-key="label"
                                    />
                                </template>
                            </vxe-column>
                            <vxe-column field="partsCode" title="零件代码" width="120" />
                            <vxe-column field="repairItemTypeId" title="维修类型" width="150">
                                <template #default="{ row }">
                                    <fetch-select
                                        :remote-method="repairItemSearch"
                                        remote
                                        v-model="row.repairItemTypeId"
                                        placeholder="请选择维修类型名称"
                                        labelKey="label"
                                        valueKey="value"
                                        clearable
                                        filterable
                                    />
                                </template>
                            </vxe-column>
                            <vxe-column field="checkoutTypeId" title="结算类型" width="150">
                                <template #default="{ row }">
                                    <fetch-select
                                        filterable
                                        clearable
                                        remote
                                        v-model="row.checkoutTypeId"
                                        :remote-method="settlementSearch"
                                        placeholder="请选择结算类型名称"
                                        @change="handleCheckoutTypeChange"
                                        value-key="value"
                                        label-key="label"
                                    />
                                </template>
                            </vxe-column>
                            <vxe-column field="quantity" title="数量" width="120">
                                <template #default="{ row }">
                                    <el-input type="number" v-model="row.quantity" clearable></el-input>
                                </template>
                            </vxe-column>
                            <vxe-column field="price" title="单价" width="80" />
                            <vxe-column field="discountAmount" title="优惠金额" width="120">
                                <template #default="{ row }">
                                    <el-input type="number" v-model="row.discountAmount" clearable></el-input>
                                </template>
                            </vxe-column>
                            <vxe-column title="操作" width="100" fixed="right">
                                <template #default="{ rowIndex }">
                                    <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                                    </el-popconfirm>
                                </template>
                            </vxe-column>
                            <template #empty>
                                <div class="m-vxe-table-empty-text">暂无数据</div>
                            </template>
                        </vxe-table>
                    </div>
                </div>
            </section>
        </el-main>
    </div>
</template>

<script>
import { getPackagesPart, getAddOrUpdate, repairItemDetail } from '@/api/maintain/basic/repairPackages/index';
import { getDetail } from '@/api/maintain/basic/repairItem/index';
import { repairItemType, sparePartList } from '@/api/common';
import BaseSearch from '@/libs/components/BaseSearch';
import { listSettlementType } from '@/api/maintain/basic/checkoutType';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  props: {
    repairPackagesId: { // 维修套餐ID
      type: [String, Number],
      default: ''
    },
    repairItemId: { // 维修项目ID
      type: [String, Number],
      default: ''
    },
    judgment: { // 判断是下拉还是编辑 进入的侧边栏详情
      type: String,
      default: ''
    },
  },
  mixins: [commonMixins],
  components: { BaseSearch },
  data () {
    return {
      repairDetail: {
        price: null,
        workHour: null,
        discountAmount: null,
        actualAmount: null
      }, // 维修套餐详情信息
      detailId: '', // 维修套餐详情ID
      repairTableData: [], // 维修套餐详情列表
      repairItemOptions: [], // 维修类型选项
      checkoutTypeOptions: [], // 结算类型选项
      sparePartOptions: [], // 零件信息选项
      tableData: [], // 零件信息列表
      rules: {
        code: [
          { required: true, message: '请输入套餐代码', trigger: 'change' }
        ],
      }
    };
  },
  watch: {
    repairItemId: {
      async handler (val) {
        await this.getDetail(val);
        // await this.getSparePartList();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 获取维修项目详情信息
    async getDetail (id) {
      let fathApi = getDetail;
      if (this.judgment === 'add') {
        fathApi = getDetail;
      } else {
        fathApi = repairItemDetail;
      }
      const res = await fathApi(id);
      if (this.judgment === 'add') {
        this.repairDetail.price = res.workhourPrice;
        this.repairDetail.workHour = res.workhour;
        this.repairDetail.repairItemId = res.id;
        this.repairDetail.repairItemCode = res.code;
        this.repairDetail.repairItemName = res.name;
        console.log(res.partsRespList);
        if (res.partsRespList && Array.isArray(res.partsRespList)) {
          for (let item of res.partsRespList) {
            this.tableData.push({
              price: item.price,
              partsId: item.partsId,
              partsCode: item.partsCode,
              partsName: item.partsName,
              isOemPart: item.isOemPart,
              remark: item.remark
            });
          }
        }
      } else {
        this.repairDetail = res || {};
        this.tableData = res.partRespList || [];
      }
      if (this.repairDetail.discountAmount) { // 有优惠金额时，计算项目金额
        this.repairDetail.actualAmount = Number(this.repairDetail.price) * Number(this.repairDetail.workHour) - Number(this.repairDetail.discountAmount);
      } else {
        this.repairDetail.actualAmount = Number(this.repairDetail.price) * Number(this.repairDetail.workHour);
      }
    },
    // 获取零件信息
    async getSparePartList () {
      const res = await getPackagesPart({ repairPackagesId: this.repairItemId });
      this.tableData = res || [];
    },
    // 维修类型模糊搜索方法
    async repairItemSearch (query) {
      try {
        const res = await repairItemType({ nameLike: query, categorys: [10] });
        this.repairItemOptions = res?.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
        return this.repairItemOptions;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 处理维修类型选择变更事件
    handleRepairItemChange (val) {
      const selectedVal = this.repairItemOptions.find(option => option.value === val);
      if (selectedVal) {
        this.repairDetail.repairItemTypeName = selectedVal.label;
      }
    },
    // 结算类型模糊搜索方法
    async settlementSearch (query) {
      try {
        const res = await listSettlementType({ nameLike: query });
        this.checkoutTypeOptions = res?.map(item => {
          return {
            value: item.id,
            label: item.nameAndCategory
          };
        });
        return this.checkoutTypeOptions;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 处理结算类型选择变更事件
    handleCheckoutTypeChange (val) {
      const selectedVal = this.checkoutTypeOptions.find(option => option.value === val);
      if (selectedVal) {
        this.repairDetail.checkoutTypeName = selectedVal.label;
      }
    },
    // 处理优惠金额失焦以后计算项目金额
    handleDiscountAmountBlur () {
      const price = Number(this.repairDetail.price) || 0;
      const hour = Number(this.repairDetail.workHour) || 0;
      const discount = Number(this.repairDetail.discountAmount) || 0;

      const result = (price * hour) - discount;
      // 重新赋值
      this.repairDetail = {
        ...this.repairDetail,
        actualAmount: result
      };
    },
    // 零件信息模糊搜索方法
    async queryListData (queryString) {
      try {
        const res = await sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 50 });
        this.sparePartOptions = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.partCode + ' - ' + item.partName
          };
        });
        return this.sparePartOptions;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 备件信息 点击添加table行
    handleAddTableData (val) {
      const selectedVal = this.sparePartOptions.find(option => option.value === val);
      this.tableData.push({
        partsCode: selectedVal.partCode,
        partsName: selectedVal.partName,
        price: selectedVal.salePrice,
        partTotalPrice: selectedVal.price,
        partsId: selectedVal.id
      });
    },
    // 删除零件表格列
    handleDeleteRow (index) {
      this.tableData.splice(index, 1);
    },
    // 处理保存按钮点击事件
    handleSave () {
      const cleanList = this.tableData.map(row => {
        return {
          ...row,
          repairItemTypeId: row.repairItemTypeId?.value || row.repairItemTypeId || null,

          checkoutTypeId: row.checkoutTypeId?.value || row.checkoutTypeId || null,

          // 同样处理零件名称，如果它是对象
          partsName: row.partsName?.value || row.partsName || null,

          // 确保数字类型正确
          quantity: Number(row.quantity) || 0,
          price: Number(row.price) || 0,
          discountAmount: Number(row.discountAmount) || 0
        };
      });
      const params = {
        ...this.repairDetail,
        repairPackagesPartList: cleanList,
        repairItemId: this.repairItemId, // 维修项目ID 下拉选择框传入
        repairPackagesId: this.repairPackagesId // 维修套餐ID 父组件传入
      };
      // 如果是新增模式，确保不携带 id 传给后端（防止后端误判为更新）
      if (this.judgment === 'add') {
        if (params.id) {
          delete params.id;
        }
      }
      getAddOrUpdate(params).then(() => {
        this.$message.success('保存成功');
        this.$emit('refresh');
      });
    }
  }
};

</script>

<style lang="scss" scoped>
.btn-delete {
    color: #B91919;
    cursor: pointer;
}

.table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
}
</style>
