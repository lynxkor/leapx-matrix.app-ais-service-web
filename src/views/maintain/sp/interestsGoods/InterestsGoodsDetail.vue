<template>
  <div>
    <section class="common-section">
      <div class="common-section-header">
        <h2>基础信息</h2>
      </div>
      <div class="common-section-body">
        <el-form label-width="120px" :model="repairDetail" :rules="rules" ref="ruleForm" :inline="true" class="form-edit">
          <el-form-item label="项目名称：" prop="repairItemName">
            {{ repairDetail.repairItemName }}
          </el-form-item>
          <el-form-item label="项目代码：" prop="repairItemCode">
            {{ repairDetail.repairItemCode }}
          </el-form-item>
          <el-form-item label="维修类型：" prop="repairItemTypeName" class="is-required">
            {{ repairDetail.repairItemTypeName }}
          </el-form-item>
          <el-form-item label="结算类型：" prop="checkoutTypeName" class="is-required">
            {{ repairDetail.checkoutTypeName }}
          </el-form-item>
          <el-form-item label="保修类型：" prop="warrantyTypeId">
            {{ repairDetail.warrantyTypeName }}
          </el-form-item>
          <el-form-item label="工时单价：" prop="unitPrice">
            {{ repairDetail.unitPrice || 0 }}
          </el-form-item>
          <el-form-item label="工时数量：" prop="workingHours">
            {{ repairDetail.workingHours || 0 }}
          </el-form-item>
          <el-form-item label="优惠金额：" prop="discountAmount">
            <el-input-number size="small" type="number" v-model="repairDetail.discountAmount" clearable @blur="calculateAmount" />
          </el-form-item>
          <el-form-item label="项目金额：" prop="receivableAmount">
            {{ repairDetail.receivableAmount || 0 }}
          </el-form-item>
          <el-form-item label="索赔价格：" prop="claimPrice">
            <el-input-number size="small" type="number" v-model="repairDetail.claimPrice" clearable />
          </el-form-item>
        </el-form>
      </div>
    </section>
    <section class="common-section">
      <div class="common-section-header">
        <h2>配件信息</h2>
      </div>
      <div class="common-section-body">
        <div class="common-section-header">
          <BaseSearch
            :remote-method="queryPartsList"
            remote
            placeholder="搜索零件代码、名称"
            clearable
            value-key="id"
            label-key="partName"
            sub-label-key="partCode"
            @change="handleAddParts"
          />
        </div>
        <div class="common-section-table">
          <vxe-table
            ref="tableRef"
            stripe
            :data="partsTableData"
            show-overflow
            resizable
            border="inner"
            size="medium"
            min-height="0"
            max-height="400px"
          >
            <vxe-column field="partsName" title="零件名称" width="150" />
            <vxe-column field="partsCode" title="零件代码" width="150" />
            <vxe-column field="repairItemTypeName" title="维修类型" width="150" />
            <vxe-column field="checkoutTypeName" title="结算类型" width="150" />
            <vxe-column field="totalAmount" title="数量" width="150">
              <template #default="{ row }">
                <el-input-number size="small" type="number" v-model="row.totalAmount" clearable @blur="calculatePartsAmount(row)" />
              </template>
            </vxe-column>
            <vxe-column field="unitPrice" title="单价" width="100" />
            <vxe-column field="discountAmount" title="优惠金额" width="150">
              <template #default="{ row }">
                <el-input-number size="small" type="number" v-model="row.discountAmount" clearable @blur="calculatePartsAmount(row)" />
              </template>
            </vxe-column>
            <vxe-column field="receivableAmount" title="零件金额" width="100" />
            <vxe-column field="claimPrice" title="索赔价格" width="150">
              <template #default="{ row }">
                <el-input-number size="small" type="number" v-model="row.claimPrice" clearable />
              </template>
            </vxe-column>
            <vxe-column title="操作" width="100" fixed="right">
              <template #default="{ rowIndex }">
                <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteParts(rowIndex)">
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
  </div>
</template>

<script>
import commonMixins from '@/libs/mixins/commonMixins';
import { repairItemType, sparePartList } from '@/api/common';
import { listSettlementType } from '@/api/maintain/basic/checkoutType';
import { getDetail } from '@/api/maintain/basic/repairItem/index';
import BaseSearch from '@/libs/components/BaseSearch';

export default {
  props: {
    repairItemId: {
      type: [String, Number],
      default: ''
    },
    detailData: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [commonMixins],
  components: { BaseSearch },
  data () {
    return {
      repairDetail: {
        repairItemName: '',
        repairItemCode: '',
        repairItemId: '',
        repairItemTypeId: '',
        repairItemTypeName: '',
        checkoutTypeId: '',
        checkoutTypeName: '',
        workingHours: 0,
        unitPrice: 0,
        discount: 0,
        discountAmount: 0,
        claimPrice: 0,
        receivableAmount: 0,
        remark: ''
      },
      partsTableData: [],
      repairItemOptions: [],
      checkoutTypeOptions: [],
      rules: {
        repairItemTypeId: [
          { required: true, message: '请选择维修类型', trigger: 'change' }
        ],
        checkoutTypeId: [
          { required: true, message: '请选择结算类型', trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    repairItemId: {
      handler (val) {
        if (val) {
          // 有id时调用getDetail获取维修项目详情（新增模式）
          this.fetchRepairItemDetail(val);
        } else if (this.detailData && Object.keys(this.detailData).length > 0) {
          // 无id但有数据对象时，使用传过来的数据（编辑模式）
          this.initData(this.detailData);
        }
      },
      immediate: true
    },
    'detailData.id': {
      handler (val) {
        if (val) {
          this.initData(this.detailData);
        }
      }
    },
  },
  mounted () {
    // 加载维修类型和结算类型选项
    this.loadRepairItemOptions();
    this.loadSettlementOptions();
  },
  methods: {
    // 获取维修项目详情（新增模式 - 传了repairItemId）
    async fetchRepairItemDetail (id) {
      try {
        const res = await getDetail(id);
        if (res) {
          // 使用接口返回的数据初始化
          this.repairDetail = {
            ...this.repairDetail,
            repairItemId: res.id,
            // repairItemCode: res.code,
            repairItemTypeName: '精品附件',
            checkoutTypeName: '自费',
            warrantyTypeName: '无',
            workingHours: res.workhour || 0,
            unitPrice: res.workhourPrice || 0,
            // 其他字段重置为默认值
            discount: 0,
            discountAmount: 0,
            claimPrice: 0,
            receivableAmount: 0,
            remark: ''
          };
          for (const item of res.partsRespList) {
            item.repairItemTypeName = '精品附件';
            item.checkoutTypeName = '自费';
            item.warrantyTypeName = '无';
            this.partsTableData.push(item);
          }
          this.calculateAmount();
        }
      } catch (error) {
        console.error('获取维修项目详情失败:', error);
      }
    },
    // 初始化数据（编辑模式 - 传了detailData，不传repairItemId）
    initData (data) {
      this.repairDetail = {
        repairItemName: data.repairItemName || '',
        repairItemCode: data.repairItemCode || '',
        repairItemId: data.repairItemId || '',
        repairItemTypeId: data.repairItemTypeId || '',
        repairItemTypeName: data.repairItemTypeName || '',
        checkoutTypeId: data.checkoutTypeId || '',
        checkoutTypeName: data.checkoutTypeName || '',
        workingHours: data.workingHours || 0,
        unitPrice: data.unitPrice || 0,
        discount: data.discount || 0,
        discountAmount: data.discountAmount || 0,
        claimPrice: data.claimPrice || 0,
        receivableAmount: data.receivableAmount || 0,
        remark: data.remark || ''
      };
      this.partsTableData = data.goodsPartsList || [];
    },
    // 计算应收金额
    calculateAmount () {
      const workingHours = Number(this.repairDetail.workingHours) || 0;
      const unitPrice = Number(this.repairDetail.unitPrice) || 0;
      const discount = Number(this.repairDetail.discount) || 0;
      const discountAmount = Number(this.repairDetail.discountAmount) || 0;

      // 应收金额 = 工时 * 单价 * (1 - 折扣率) - 优惠金额
      let receivable = workingHours * unitPrice;
      if (discount > 0) {
        receivable = receivable * (1 - discount / 100);
      }
      receivable = receivable - discountAmount;
      this.repairDetail.receivableAmount = Math.max(0, receivable.toFixed(2));
    },
    // 计算配件应收金额
    calculatePartsAmount (row) {
      const totalAmount = Number(row.totalAmount) || 0;
      const unitPrice = Number(row.unitPrice) || 0;
      const discount = Number(row.discount) || 0;
      const discountAmount = Number(row.discountAmount) || 0;

      let receivable = totalAmount * unitPrice;
      if (discount > 0) {
        receivable = receivable * (1 - discount / 100);
      }
      receivable = receivable - discountAmount;
      row.receivableAmount = Math.max(0, receivable.toFixed(2));
    },
    // 加载维修类型选项
    async loadRepairItemOptions () {
      try {
        const res = await repairItemType({ categorys: [10] });
        this.repairItemOptions = res?.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        }) || [];
      } catch (error) {
        console.error('Error loading repair item options:', error);
      }
    },
    // 加载结算类型选项
    async loadSettlementOptions () {
      try {
        const res = await listSettlementType({});
        this.checkoutTypeOptions = res?.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        }) || [];
      } catch (error) {
        console.error('Error loading settlement options:', error);
      }
    },
    // 维修类型变更
    handleRepairItemChange (val) {
      const selected = this.repairItemOptions.find(option => option.value === val);
      if (selected) {
        this.repairDetail.repairItemTypeName = selected.label;
      }
    },
    // 结算类型变更
    handleCheckoutTypeChange (val) {
      const selected = this.checkoutTypeOptions.find(option => option.value === val);
      if (selected) {
        this.repairDetail.checkoutTypeName = selected.label;
      }
    },
    // 配件表格维修类型变更
    handlePartsRepairItemChange (row) {
      const selected = this.repairItemOptions.find(option => option.value === row.repairItemTypeId);
      if (selected) {
        row.repairItemTypeName = selected.label;
      }
    },
    // 配件表格结算类型变更
    handlePartsCheckoutTypeChange (row) {
      const selected = this.checkoutTypeOptions.find(option => option.value === row.checkoutTypeId);
      if (selected) {
        row.checkoutTypeName = selected.label;
      }
    },
    // 配件搜索
    async queryPartsList (queryString) {
      if (!queryString) {
        return [];
      }
      try {
        const res = await sparePartList({
          partCodeOrNameLike: queryString,
          oemPart: 1,
          status: 1,
          pageSize: 20,
          pageNum: 1
        });
        return res || [];
      } catch (error) {
        console.error('配件搜索失败:', error);
        return [];
      }
    },
    // 添加配件
    handleAddParts (val, record) {
      if (!record) return;
      const exists = this.partsTableData.some(item => item.partsId === record.id);
      if (exists) {
        this.$message.warning('该配件已存在，请勿重复添加');
        return;
      }
      this.partsTableData.push({
        partsId: record.id,
        partsCode: record.partCode || record.code,
        partsName: record.partName || record.name,
        repairItemTypeName: '精品附件',
        checkoutTypeName: '自费',
        warrantyTypeName: '无',
        totalAmount: 1,
        unitPrice: record.salePrice || 0,
        discount: 0,
        discountAmount: 0,
        claimPrice: 0,
        receivableAmount: record.salePrice || 0
      });
    },
    // 删除配件
    handleDeleteParts (index) {
      this.partsTableData.splice(index, 1);
    },
    // 保存
    async handleSave () {
      // 验证表单
      try {
        await this.$refs.ruleForm.validate();
      } catch (error) {
        return false;
      }

      const params = {
        ...this.repairDetail,
        goodsPartsList: this.partsTableData.map(item => ({
          ...item,
          totalAmount: Number(item.totalAmount) || 0,
          unitPrice: Number(item.unitPrice) || 0,
          discount: Number(item.discount) || 0,
          discountAmount: Number(item.discountAmount) || 0,
          claimPrice: Number(item.claimPrice) || 0,
          receivableAmount: Number(item.receivableAmount) || 0
        }))
      };

      this.$emit('submit', params);
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section{
  &:first-child{
    margin-top: 0;
  }
}
.btn-delete {
  color: #B91919;
  cursor: pointer;
}
</style>
