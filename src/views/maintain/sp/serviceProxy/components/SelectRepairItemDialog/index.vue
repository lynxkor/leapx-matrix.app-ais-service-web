<template>
  <el-dialog
    class="m-add-repair-item-dialog"
    title="添加维修项目"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <!-- 顶部信息栏 -->
    <div class="info-bar">
      <div class="info-item">
        <span class="label">VIN:</span>
        <span class="value">{{ vehicleInfo.vehProfileVin || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">车型:</span>
        <span class="value">{{ vehicleInfo.vehModelName || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">门店:</span>
        <span class="value">{{ vehicleInfo.dealerName || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">优惠模式:</span>
        <el-select
          v-model="discountMode"
          placeholder="请选择"
          size="small"
          style="width: 120px;"
          @change="handleDiscountModeChange"
        >
          <el-option :label="item.name" :value="item.code" v-for="item in discountType" :key="item.code"></el-option>
        </el-select>
      </div>
      <div class="info-item">
        <span class="label">维修项目合计:</span>
        <span class="value">¥{{ info.workCostCount || 0 }}</span>
      </div>
      <div class="info-item">
        <span class="label">维修配件合计:</span>
        <span class="value">¥{{ info.barkCostCount || 0 }}</span>
      </div>
      <div class="info-item">
        <span class="label">费用合计:</span>
        <span class="value">¥{{ info.maintenanceCostEstimation || 0 }}</span>
      </div>
    </div>

    <!-- 维修类型标签页 -->
    <!-- <div class="type-tabs">
      <div
        v-for="tab in typeTabs"
        :key="tab.value"
        class="type-tab"
        :class="{ active: activeTypeTab === tab.value }"
        @click="activeTypeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div> -->

    <!-- Tab内容区 -->
    <div class="tab-content">
      <!-- 维修项目 tab -->
      <div class="tab-panel">
        <div class="panel-header">
          <h3>维修项目</h3>
        </div>
        <div class="add-row ais-select-group">
          <el-autocomplete
            v-model="itemSearchKey"
            placeholder="输入维修项目代码、名称、拼音简码"
            :fetch-suggestions="searchRepairItem"
            @select="handleSelect"
            size="small"
            style="width: 500px;"
          >
            <template slot="prepend">
              <div>
                维修类型：
                <el-select v-model="repairType" placeholder="请选择" style="width: 110px;">
                  <el-option v-for="item in itemOptions.repairItemTypeName" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </div>
            </template>
          </el-autocomplete>
          <el-button type="primary" size="small" @click="addItem">添加</el-button>
        </div>
        <edit-table
          ref="itemTable"
          :columns="itemColumns"
          :data="itemData"
          :show-toolbar="false"
          :options="itemOptions"
          :auth="{edit: false, delete: true}"
          :default-new-row="defaultItemRow"
          @remove-row="handleRemoveItemRow"
          emptyText="请添加数据"
          seq
          :actionWidth="100"
        />
      </div>

      <!-- 维修配件 tab -->
      <div class="tab-panel">
        <div class="panel-header">
          <h3>维修配件</h3>
        </div>
        <div class="add-row ais-select-group">
          <el-autocomplete
            v-model="partSearchKey"
            placeholder="输入维修配件代码、名称、拼音简码"
            :fetch-suggestions="searchRepairPart"
            @select="handleSelectPart"
            size="small"
            style="width: 500px;"
          >
            <template slot="prepend">
              <div>
                维修类型：
                <el-select v-model="partRepairType" placeholder="请选择" style="width: 110px;">
                  <el-option v-for="item in itemOptions.repairItemTypeName" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </div>
            </template>
          </el-autocomplete>
          <el-button type="primary" size="small" @click="addPart">添加</el-button>
        </div>
        <edit-table
          ref="partTable"
          :columns="partColumns"
          :data="partData"
          :show-toolbar="false"
          :options="itemOptions"
          :auth="{edit: false, delete: true}"
          :default-new-row="defaultPartRow"
          @remove-row="handleRemovePartRow"
          emptyText="请添加数据"
          seq
          :actionWidth="100"
        />
      </div>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import EditTable from '@/libs/components/EditTable';
import { getEnum, getDiscountType, getRepairItemInfo, filterRepairItem, filterSparePartItem, saveRepairItem } from '@/api/maintain/sp/serviceProxy/index';

export default {
  name: 'SelectRepairItemDialog',
  components: {
    EditTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vehicleInfo: {
      type: Object,
      default: () => ({
        // vin: 'LFZ63AL5XPD080206',
        // model: 'C01增程-316智享版',
        // store: '武汉零跑中心兴业路店'
      })
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      discountMode: '',
      activeTypeTab: 'items',
      itemSearchKey: '',
      partSearchKey: '',
      submitLoading: false,
      repairType: '',
      partRepairType: '',
      selectedRepairItem: null, // 选中的维修项目
      selectedRepairPart: null, // 选中的维修配件

      // 优惠模式
      discountType: [],
      selectedDiscount: 1,

      // 详情信息
      info: {},

      // 维修项目表格配置
      itemData: [],
      defaultItemRow: {
        code: '',
        name: '',
        type: 'maintenance',
        settlementType: 'self',
        warrantyType: 'none',
        laborHours: 0,
        unitPrice: 0,
        discountRate: 1
      },
      itemOptions: {
        type: [
          // { label: '保养', value: 'maintenance' },
          // { label: '一般维修', value: 'general' },
          // { label: '钣喷', value: 'body' },
          // { label: '美容装潢', value: 'beauty' },
          // { label: '精品附件', value: 'premium' },
          // { label: '三电维修', value: 'electric' }
        ],
        settlementType: [
          // { label: '自费', value: 'self' },
          // { label: '保修', value: 'warranty' },
          // { label: '保险', value: 'insurance' }
        ],
        warrantyType: [
          // { label: '无', value: 'none' },
          // { label: '整车保修', value: 'vehicle' },
          // { label: '备件保修', value: 'part' }
        ]
      },

      // 维修配件表格配置
      partData: [
        // {
        //   id: 1,
        //   code: '9217839293',
        //   name: '空调滤芯',
        //   type: 'maintenance',
        //   settlementType: 'self',
        //   warrantyType: 'none',
        //   isOriginal: 'yes',
        //   quantity: 1,
        //   unitPrice: 37.6,
        //   discountRate: 0.5
        // }
      ],
      defaultPartRow: {
        repairItemName: '',
      },
      partOptions: {
        type: [
          // { label: '保养', value: 'maintenance' },
          // { label: '一般维修', value: 'general' },
          // { label: '钣喷', value: 'body' },
          // { label: '美容装潢', value: 'beauty' },
          // { label: '精品附件', value: 'premium' },
          // { label: '三电维修', value: 'electric' }
        ],
        settlementType: [
          // { label: '自费', value: 'self' },
          // { label: '保修', value: 'warranty' },
          // { label: '保险', value: 'insurance' }
        ],
        warrantyType: [
          // { label: '无', value: 'none' },
          // { label: '整车保修', value: 'vehicle' },
          // { label: '备件保修', value: 'part' }
        ],
        isOriginal: [
          // { label: '是', value: 'yes' },
          // { label: '否', value: 'no' }
        ]
      }
    };
  },
  computed: {
    // 维修项目列配置
    itemColumns () {
      return [
        {
          field: 'repairItemCode',
          title: '维修项目代码',
          width: '140px',
        },
        {
          field: 'repairItemName',
          title: '维修项目名称',
          width: '180px',
        },
        {
          field: 'repairItemTypeName',
          title: '维修类型',
          width: '150px',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              size: 'small',
              placeholder: '请选择',
              clearable: true,
              filterable: true
            }
          }
        },
        {
          field: 'checkoutTypeName',
          title: '结算类型',
          width: '120px',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              size: 'small',
              placeholder: '请选择',
              clearable: true,
              filterable: true
            }
          }
        },
        {
          field: 'warrantyTypeName',
          title: '保修类型',
          width: '150px',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              size: 'small',
              placeholder: '请选择',
              clearable: true,
              filterable: true
            }
          }
        },
        {
          field: 'workHour',
          title: '工时',
          width: '120px',
          editable: true,
          editRender: { name: 'ElInput', props: { type: 'number', size: 'small', precision: 1, min: 0, controlsPosition: 'right' } }
        },
        {
          field: 'price',
          title: '单价',
          width: '120px',
        },
        {
          field: 'discountRate',
          title: '折扣率',
          width: '120px',
        },
        {
          field: 'discountAmount',
          title: '优惠金额',
          width: '120px',
          editable: true,
          editRender: { name: 'ElInput', props: { type: 'number', size: 'small', precision: 1, min: 0, controlsPosition: 'right' } }
        },
        {
          field: 'repairAmount',
          title: '项目金额',
          width: '120px',
        },
        {
          field: 'statusDesc',
          title: '维修项目状态',
          width: '120px',
        },
        {
          field: 'packageCode',
          title: '套餐代码',
          width: '120px',
        }
      ];
    },
    // 维修配件列配置
    partColumns () {
      return [
        {
          field: 'partsCode',
          title: '零件代码',
          width: '140px',
        },
        {
          field: 'partsName',
          title: '零件名称',
          width: '180px',
        },
        {
          field: 'repairItemTypeName',
          title: '维修类型',
          width: '150px',
          editable: true,
          editRender: { name: 'ElSelect', props: { size: 'small', placeholder: '请选择' } }
        },
        {
          field: 'checkoutTypeName',
          title: '结算类型',
          width: '120px',
          editable: true,
          editRender: { name: 'ElSelect', props: { size: 'small', placeholder: '请选择' } }
        },
        {
          field: 'warrantyTypeName',
          title: '保修类型',
          width: '150px',
          editable: true,
          editRender: { name: 'ElSelect', props: { size: 'small', placeholder: '请选择' } }
        },
        {
          field: 'isOemPart',
          title: '是否原厂',
          width: '120px',
          formatter: (value) => value === '1' ? '是' : '否'
        },
        {
          field: 'quantity',
          title: '数量',
          width: '120px',
          editable: true,
          editRender: { name: 'ElInput', props: { size: 'small', type: 'number', precision: 1, min: 0, controlsPosition: 'right' } }
        },
        {
          field: 'price',
          title: '单价',
          width: '120px',
          editable: true,
          editRender: { name: 'ElInput', props: { size: 'small', type: 'number', precision: 2, min: 0, controlsPosition: 'right' } },
          // formatter: (value) => `¥${(value || 0).toFixed(2)}`
        },
        {
          field: 'discountRate',
          title: '折扣率',
          width: '120px',
        },
        {
          field: 'discountAmount',
          title: '优惠金额',
          width: '120px',
          editable: true,
          editRender: { name: 'ElInput', props: { size: 'small', type: 'number', precision: 2, min: 0, max: 1, step: 0.1, controlsPosition: 'right' } },
          // formatter: (value) => `${(value || 0).toFixed(2)}`
        },
        {
          field: 'partsAmount',
          title: '配件金额',
          width: '120px',
        },
        {
          field: 'repairItemName',
          title: '维修项目名称',
          width: '180px',
        },
        {
          field: 'packageCode',
          title: '套餐代码',
          width: '120px',
        }
      ];
    },
    // 维修项目合计
    itemTotal () {
      return this.itemData.reduce((sum, item) => {
        return sum + (item.laborHours || 0) * (item.unitPrice || 0) * (item.discountRate || 1);
      }, 0);
    },
    // 维修配件合计
    partTotal () {
      return this.partData.reduce((sum, part) => {
        return sum + (part.quantity || 0) * (part.unitPrice || 0) * (part.discountRate || 1);
      }, 0);
    },
    // 费用合计
    totalCost () {
      return this.itemTotal + this.partTotal;
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getEnumData();
        this.getRepairItemInfo();
      }
    },
    dialogVisible (val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    close () {
      this.dialogVisible = false;
    },
    closed () {
      // 重置数据
      this.itemData = [];
      this.partData = [];
      this.discountMode = '';
      this.activeTypeTab = 'items';
      this.itemSearchKey = '';
      this.partSearchKey = '';
      this.selectedRepairItem = null;
      this.selectedRepairPart = null;
    },
    addItem () {
      // 验证是否选择了维修项目
      if (!this.selectedRepairItem) {
        this.$message.warning('请先选择维修项目');
        return;
      }

      // 验证是否选择了维修类型
      if (!this.repairType) {
        this.$message.warning('请先选择维修类型');
        return;
      }

      const selectedItem = this.selectedRepairItem;

      // 查找维修类型的显示名称
      const repairTypeObj = this.itemOptions.repairItemTypeName?.find(
        item => item.repairItemTypeId === this.repairType
      );

      // 查找结算类型的默认值（取第一个）
      const checkoutTypeObj = this.itemOptions.checkoutTypeName?.[0];

      // 查找保修类型的默认值（取第一个）
      const warrantyTypeObj = this.itemOptions.warrantyTypeName?.[0];

      const newItem = {
        repairItemCode: selectedItem.code || '',
        repairItemName: selectedItem.name || '',
        repairItemId: selectedItem.id,
        repairItemTypeId: this.repairType,
        repairItemTypeName: repairTypeObj?.repairItemTypeName || repairTypeObj?.label || '',
        checkoutTypeId: checkoutTypeObj?.checkoutTypeId || '',
        checkoutTypeName: checkoutTypeObj?.checkoutTypeName || checkoutTypeObj?.label || '',
        warrantyTypeId: warrantyTypeObj?.warrantyTypeId || '',
        warrantyTypeName: warrantyTypeObj?.warrantyTypeName || warrantyTypeObj?.label || '',
        workHour: selectedItem.workhour || 0,
        price: selectedItem.workhourPrice || 0,
        discountRate: 1,
        discountAmount: 0,
        repairAmount: (selectedItem.workhour || 0) * (selectedItem.workhourPrice || 0),
        statusDesc: '',
        packageCode: selectedItem.packageCode || ''
      };

      this.itemData.push(newItem);

      // 清空输入
      this.itemSearchKey = '';
      this.selectedRepairItem = null;

      // 更新顶部合计
      this.updateTotals();
    },
    addPart () {
      // 验证是否选择了维修配件
      if (!this.selectedRepairPart) {
        this.$message.warning('请先选择维修配件');
        return;
      }

      // 验证是否选择了维修类型
      if (!this.partRepairType) {
        this.$message.warning('请先选择维修类型');
        return;
      }

      const selectedPart = this.selectedRepairPart;

      // 查找维修类型的显示名称
      const repairTypeObj = this.itemOptions.repairItemTypeName?.find(
        item => item.repairItemTypeId === this.partRepairType
      );

      // 查找结算类型的默认值（取第一个）
      const checkoutTypeObj = this.itemOptions.checkoutTypeName?.[0];

      // 查找保修类型的默认值（取第一个）
      const warrantyTypeObj = this.itemOptions.warrantyTypeName?.[0];

      const newPart = {
        partsId: selectedPart.id,
        partsCode: selectedPart.partCode || '',
        partsName: selectedPart.partName || '',
        repairItemTypeId: this.partRepairType,
        repairItemTypeName: repairTypeObj?.repairItemTypeName || repairTypeObj?.label || '',
        checkoutTypeId: checkoutTypeObj?.checkoutTypeId || '',
        checkoutTypeName: checkoutTypeObj?.checkoutTypeName || checkoutTypeObj?.label || '',
        warrantyTypeId: warrantyTypeObj?.warrantyTypeId || '',
        warrantyTypeName: warrantyTypeObj?.warrantyTypeName || warrantyTypeObj?.label || '',
        isOemPart: selectedPart.isOemPart || '1',
        quantity: 1,
        price: selectedPart.salePrice || 0,
        discountRate: this.selectedDiscount,
        discountAmount: 0,
        partsAmount: 1,
        repairItemName: selectedPart.repairItemName || '',
        packageCode: selectedPart.packageCode || ''
      };

      this.partData.push(newPart);

      // 清空输入
      this.partSearchKey = '';
      this.selectedRepairPart = null;

      // 更新顶部合计
      this.updateTotals();
    },
    submit () {
      // 验证数据
      if (this.itemData.length === 0 && this.partData.length === 0) {
        this.$message.warning('请至少添加一个维修项目或维修配件');
        return;
      }

      this.submitLoading = true;

      // 模拟提交
      const data = {
        itemList: this.itemData,
        partsList: this.partData,
        discountId: this.discountMode,
        serviceProxyId: this.vehicleInfo.id,
      };

      saveRepairItem(data).then(res => {
        this.$emit('update:visible', false);
        this.submitLoading = false;
        this.$message.success('保存成功');
      }).catch(e => {
        this.submitLoading = false;
      });
    },
    getEnumData () {
      getEnum('MaintenanceTypeEnum').then(res => {
        this.itemOptions.repairItemTypeName = (res || []).map(item => ({
          repairItemTypeId: item.code,
          repairItemTypeName: item.message,
          label: item.message,
          value: item.code
        }));
        this.repairType = res?.[0].code;
        this.partRepairType = res?.[0].code;
      });
      getDiscountType().then(res => {
        this.discountType = (res || []);
        // test
        // this.discountType.push({
        //   code: 0.5,
        //   name: 0.5,
        //   discountPartRate: 0.5,
        //   discountWorkhourRate: 0.5,
        // });
      });
      getEnum('StatementTypeEnum').then(res => {
        this.itemOptions.checkoutTypeName = (res || []).map(item => ({
          checkoutTypeId: item.code,
          checkoutTypeName: item.message,
          label: item.message,
          value: item.code
        }));
      });
      getEnum('WarrantyTypeEnum').then(res => {
        this.itemOptions.warrantyTypeName = (res || []).map(item => ({
          warrantyTypeId: item.code,
          warrantyTypeName: item.message,
          label: item.message,
          value: item.code
        }));
      });
    },
    getRepairItemInfo () {
      getRepairItemInfo(this.vehicleInfo.id).then(res => {
        this.info = res;
        this.itemData = res.repairItemRespList || [];
        this.partData = res.sparePartRespList || [];
      });
    },
    searchRepairItem (queryString, cb) {
      if (!queryString) return;
      filterRepairItem({ nameOrCodeOrPinyinLike: queryString, serviceProxyId: this.vehicleInfo.id }).then(res => {
        const data = res.map(item => ({
          ...item,
          value: item.code
        }));
        cb(data);
      });
    },
    handleSelect (item) {
      this.selectedRepairItem = item;
    },
    searchRepairPart (queryString, cb) {
      if (!queryString) return;
      filterSparePartItem({ nameOrCodeOrPinyinLike: queryString, serviceProxyId: this.vehicleInfo.id }).then(res => {
        const data = res.map(item => ({
          ...item,
          value: item.partName
        }));
        cb(data);
      });
    },
    handleSelectPart (item) {
      this.selectedRepairPart = item;
    },
    handleDiscountModeChange (value) {
      // 查找选中的优惠模式
      const selectedDiscount = this.discountType.find(item => item.code === value);
      this.selectedDiscount = selectedDiscount;
      if (!selectedDiscount) return;

      const { discountPartRate, discountWorkhourRate } = selectedDiscount;

      // 更新维修项目的折扣率
      this.itemData.forEach(item => {
        item.discountRate = discountWorkhourRate || 1;
        // 重新计算优惠金额和项目金额
        const originalAmount = item.workHour * item.price;
        item.discountAmount = originalAmount * (1 - item.discountRate);
        item.repairAmount = originalAmount * item.discountRate;
      });

      // 更新维修配件的折扣率
      this.partData.forEach(part => {
        part.discountRate = discountPartRate || 1;
        // 重新计算优惠金额和配件金额
        const originalAmount = part.quantity * part.price;
        part.discountAmount = originalAmount * (1 - part.discountRate);
        part.partsAmount = originalAmount * part.discountRate;
      });

      // 更新顶部的合计信息
      this.updateTotals();
    },
    updateTotals () {
      // 计算维修项目合计
      this.info.workCostCount = this.itemData.reduce((sum, item) => {
        const amount = parseFloat(item.repairAmount) || 0;
        return sum + amount;
      }, 0);

      // 计算维修配件合计
      this.info.barkCostCount = this.partData.reduce((sum, part) => {
        const amount = parseFloat(part.partsAmount) || 0;
        return sum + amount;
      }, 0);

      // 计算费用合计
      this.info.maintenanceCostEstimation = this.info.workCostCount + this.info.barkCostCount;
    },
    // 处理维修项目表格删除行
    handleRemoveItemRow (removedRow, index, defer) {
      // 从 itemData 中移除该行数据（表格组件内部已经移除了，这里只需要同步）
      this.itemData.splice(index, 1);
      // 更新顶部合计
      this.updateTotals();
    },
    // 处理维修配件表格删除行
    handleRemovePartRow (removedRow, index, defer) {
      // 从 partData 中移除该行数据（表格组件内部已经移除了，这里只需要同步）
      this.partData.splice(index, 1);
      // 更新顶部合计
      this.updateTotals();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-add-repair-item-dialog {
  .info-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    background-color: var(--leap-color-default-light-5);

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 25%;

      .label {
        color: var(--leap-color-default-light-1);
        font-weight: 400;
        font-size: 14px;
      }

      .value {
        color: var(--leap-color-default-dark-1);
        font-size: 14px;
        font-weight: 500;

        &.highlight {
          color: var(--leap-color-primary);
        }

        &.total {
          color: var(--leap-color-primary);
          font-weight: bold;
        }
      }
    }
  }

  .type-tabs {
    display: flex;
    margin-bottom: 16px;

    .type-tab {
      padding: 5px 16px;
      cursor: pointer;
      font-size: 14px;
      color: var(--leap-color-default-light-1);
      transition: all 0.3s;
      border: 1px solid var(--leap-color-default-light-4);
      background-color: #ffffff;
      position: relative;
      margin-left: -1px;

      &:first-child {
        border-radius: 4px 0 0 4px;
        margin-left: 0;
      }

      &:last-child {
        border-radius: 0 4px 4px 0;
      }

      &:hover {
        border-color: var(--leap-color-primary);
        color: var(--leap-color-primary);
        z-index: 1;
      }

      &.active {
        background-color: var(--leap-color-primary);
        color: #ffffff;
        border-color: var(--leap-color-primary);
        z-index: 2;
      }
    }
  }

  .tab-content {
    .tab-panel {
      margin-bottom: 20px;
      .panel-header {
        margin-bottom: 8px;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--leap-color-default);
          margin: 0;
        }
      }

      .add-row {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
    }
    .el-select{
      color: var(--leap-color-default);
    }
    ::v-deep .el-select .el-input .el-select__caret {
      color: var(--leap-color-default);
    }
  }
}
</style>
