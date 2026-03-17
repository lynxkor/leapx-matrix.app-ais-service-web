<template>
  <div class="m-repair-item-dialog">
    <el-dialog
      class="m-add-repair-item-dialog"
      title="添加维修项目"
      width="100%"
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
            @clear="handleDiscountModeChange"
            clearable
          >
            <el-option :label="item.name" :value="item.id" v-for="item in discountType" :key="item.id"></el-option>
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
      <div class="container">
        <div class="leftmenu">
          <div class="left-manual-add">
            <h3>手动添加</h3>
            <h4>选择维修类型</h4>
            <div
              v-for="tab in itemOptions.repairItemTypeName"
              :key="tab.value"
              class="type-tab"
              :class="{ active: repairType === tab.value }"
              @click="handleTypeChange(tab.value)"
            >
              {{ tab.label }}
            </div>
            <h4>添加维修项目</h4>
            <el-autocomplete
              v-model="itemSearchKey"
              placeholder="输入维修项目代码、名称"
              :fetch-suggestions="searchRepairItem"
              @select="handleSelect"
              size="small"
              :trigger-on-focus="false"
              clearable
            >
              <template #suffix>
                <i class="iconfont icon-lxppc-search"></i>
              </template>
              <template #default="{item}">
                <div v-if="item.value === 'empty'" style="pointer-events: none;">您当前搜索的项目，不适用{{vehicleInfo.vehModelName}}车型，请联系服务工程</div>
                <div v-else>
                  {{ item.value }}
                </div>
              </template>
            </el-autocomplete>
            <h4>添加维修配件</h4>
            <el-autocomplete
              v-model="partSearchKey"
              placeholder="输入维修配件代码、名称"
              :fetch-suggestions="searchRepairPart"
              @select="handleSelectPart"
              size="small"
              :trigger-on-focus="false"
              clearable
            >
              <template #suffix>
                <i class="iconfont icon-lxppc-search"></i>
              </template>
              <template #default="{item}">
                <div v-if="item.value === 'empty'" style="pointer-events: none;">未搜索到配件</div>
                <div v-else>
                  {{ item.value }}
                </div>
              </template>
            </el-autocomplete>
          </div>
          <div class="left-fast-add">
            <h3>快捷添加</h3>
            <ul class="fast-add-list">
              <li v-for="item in packageType" :key="item.code" @click="handleOpenDialog(item.code)">
                <span>{{ item.message }}</span>
                <span>
                  <span v-if="item.value > 0" class="item-num">{{ item.value }}</span>
                  <i class="iconfont icon-lxppc-right"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- Tab内容区 -->
        <div class="tab-content">
          <!-- 维修项目 tab -->
          <div class="tab-panel">
            <div class="panel-header">
              <h3>维修项目</h3>
            </div>
            <vxe-table
              ref="itemTable"
              :data="itemData"
              stripe
              show-overflow
              resizable
              :row-config="{ isHover: true }"
              :row-class-name="getItemRowClassName"
              border="inner"
              size="medium"
              min-height="0"
              max-height="400px"
            >
              <vxe-column type="seq" width="70" title="序号" />
              <vxe-column field="repairItemCode" title="维修项目代码" width="140px" />
              <vxe-column field="repairItemName" title="维修项目名称" width="180px" >
               <template #default="{ row }">
                  <template v-if="row.id || row.repairItemId !== '999999' || row.packageId">{{ row?.repairItemName }}</template>
                   <el-input
                    v-else
                    v-model="row.repairItemName"
                    size="small"
                  />
                </template>
              </vxe-column>
              <vxe-column field="repairItemTypeName" title="维修类型" width="150px">
                <template #default="{ row }">
                  <template v-if="row.id || row.packageId || row.repairItemDisabled">{{ row?.repairItemTypeName }}</template>
                  <el-select
                    v-else
                    v-model="row.repairItemTypeName"
                    size="small"
                    placeholder="请选择"
                    filterable
                    @change="handleRepairItemTypeChange(row)"
                  >
                    <el-option
                      v-for="item in itemOptions.repairItemTypeName"
                      :key="item.repairItemTypeId"
                      :label="item.repairItemTypeName"
                      :value="item.repairItemTypeName"
                    />
                  </el-select>
                </template>
              </vxe-column>
              <vxe-column field="checkoutTypeName" title="结算类型" width="120px">
                <template #default="{ row }">
                  <template v-if="row.id || row.packageId">{{ row?.repairItemTypeName }}</template>
                  <el-select
                    v-else
                    v-model="row.checkoutTypeName"
                    size="small"
                    placeholder="请选择"
                    filterable
                    @change="handleCheckoutTypeChange(row)"
                  >
                    <el-option
                      v-for="item in filteredRepairItemCheckoutTypes"
                      :key="item.checkoutTypeId"
                      :label="item.checkoutTypeName"
                      :value="item.checkoutTypeName"
                      :disabled="row.repairItemId === '999999' && checkoutTypeIncluded(item.checkoutTypeId)"
                    />
                  </el-select>
                </template>
              </vxe-column>
              <vxe-column field="warrantyTypeName" title="保修类型" width="150px">
                <template #default="{ row }">
                  <el-select
                    v-model="row.warrantyTypeName"
                    size="small"
                    placeholder="请选择"
                    filterable
                    @change="handleWarrantyTypeChange(row)"
                  >
                    <el-option
                      v-for="item in getFilteredWarrantyTypesForRow(row, 'repairItem')"
                      :key="item.warrantyTypeId"
                      :label="item.warrantyTypeName"
                      :value="item.warrantyTypeName"
                      :disabled="!checkIfWarrantyTypeEditable(row, item.warrantyTypeId)"
                />
                  </el-select>
                </template>
              </vxe-column>
              <vxe-column field="workHour" title="工时" width="160px">
                <template #default="{ row }">
                  <template v-if="!checkIfTimeEditable(row)">{{ row?.workHour }}</template>
                  <el-input-number
                    v-else
                    v-model="row.workHour"
                    size="small"
                    :precision="1"
                    :min="0"
                    controls-position="right"
                    @change="handleWorkHourChange(row)"
                  />
                </template>
              </vxe-column>
              <vxe-column field="price" title="单价" width="120px" />
              <vxe-column field="discountRate" title="折扣率" width="120px" />
              <vxe-column field="discountAmount" title="优惠金额" width="160px">
                <template #default="{ row }">
                  <template v-if="checkoutTypeIncluded(row.checkoutTypeId)">{{ row?.discountAmount | tofixed2 }}</template>
                  <el-input-number
                    v-else
                    v-model="row.discountAmount"
                    size="small"
                    :precision="2"
                    :step="0.1"
                    :min="0"
                    :max="+row.workHour*row.price"
                    controls-position="right"
                    @change="handleItemDiscountAmountChange(row)"
                  />
                </template>
              </vxe-column>
              <vxe-column field="repairAmount" title="项目金额" width="120px">
                <template #default="{ row }">
                  <template>{{ row?.repairAmount | tofixed2 }}</template>
                </template>
              </vxe-column>
              <vxe-column field="statusLabel" title="维修项目状态" width="120px" />
              <vxe-column field="packageCode" title="套餐代码" width="120px" />
              <vxe-column title="操作" width="100" align="center" fixed="right">
                <template #default="{ row, rowIndex }">
                  <span v-if="row.packageId" :class="['btn-delete', {'disabled': row.workRecordStatus === 40}]" @click="handleRemoveItemRow(rowIndex, row)">删除</span>
                  <el-popconfirm v-else title="确定要删除这条记录吗？" @confirm="handleRemoveItemRow(rowIndex, row)">
                    <span slot="reference" :class="['btn-delete'/*, {'disabled': row.workRecordStatus === 40}*/]">删除</span>
                  </el-popconfirm>
                </template>
              </vxe-column>
              <template #empty>
                <div class="m-vxe-table-empty-text">可搜索添加，或选择维修套餐/权益套餐等</div>
              </template>
            </vxe-table>
          </div>
          <!-- 维修配件 tab -->
          <div class="tab-panel">
            <div class="panel-header">
              <h3>维修配件</h3>
            </div>
            <vxe-table
              ref="partTable"
              :data="partData"
              stripe
              show-overflow
              resizable
              border="inner"
              size="medium"
              min-height="0"
              max-height="400px"
            >
              <vxe-column type="seq" width="70" title="序号" />
              <vxe-column field="partsCode" title="零件代码" width="140px" />
              <vxe-column field="partsName" title="零件名称" width="180px" />
              <vxe-column field="repairItemTypeName" title="维修类型" width="150px">
                <template #default="{ row }">
                  <el-select
                    v-model="row.repairItemTypeName"
                    size="small"
                    placeholder="请选择"
                    filterable
                    :disabled="row.repairItemDisabled"
                  @change="handlePartRepairItemTypeChange(row)"
                  >
                    <el-option
                      v-for="item in itemOptions.repairItemTypeName"
                      :key="item.repairItemTypeId"
                      :label="item.repairItemTypeName"
                      :value="item.repairItemTypeName"
                    />
                  </el-select>
                </template>
              </vxe-column>
              <vxe-column field="checkoutTypeName" title="结算类型" width="120px">
                <template #default="{ row }">
                  <el-select
                    v-model="row.checkoutTypeName"
                    size="small"
                    placeholder="请选择"
                    filterable
                        @change="handlePartCheckoutTypeChange(row)"
                  >
                    <el-option
                      v-for="item in filteredPartCheckoutTypes"
                      :key="item.checkoutTypeId"
                      :label="item.checkoutTypeName"
                      :value="item.checkoutTypeName"
                      :disabled="row.isOemPart != 1 && checkoutTypeIncluded(item.checkoutTypeId)"
                    />
                  </el-select>
                </template>
              </vxe-column>
              <vxe-column field="warrantyTypeName" title="保修类型" width="150px">
                <template #default="{ row }">
                  <el-select
                    v-model="row.warrantyTypeName"
                    size="small"
                    placeholder="请选择"
                    filterable
                    @change="handlePartWarrantyTypeChange(row)"
                  >
                    <el-option
                      v-for="item in getFilteredWarrantyTypesForRow(row, 'part')"
                      :key="item.warrantyTypeId"
                      :label="item.warrantyTypeName"
                      :value="item.warrantyTypeName"
                      :disabled="!checkIfWarrantyTypeEditable(row, item.warrantyTypeId)"
                />
                  </el-select>
                </template>
              </vxe-column>
              <vxe-column
                field="isOemPart"
                title="是否原厂"
                width="120px"
              >
                <template #default="{ row }">
                  <span>{{ row.isOemPart == 1 ? '是' : '否' }}</span>
                </template>
              </vxe-column>
              <vxe-column field="quantity" title="数量" width="160px">
                <template #default="{ row }">
                  <template v-if="row.isOutstock">{{ row.quantity }}</template>
                  <el-input-number
                    v-else
                    v-model="row.quantity"
                    size="small"
                    :min="0"
                    controls-position="right"
                    @change="handlePartQuantityChange(row)"
                  />
                </template>
              </vxe-column>
              <vxe-column field="price" title="单价" width="120px" />
              <vxe-column field="discountRate" title="折扣率" width="120px" />
              <vxe-column field="discountAmount" title="优惠金额" width="160px">
                <template #default="{ row }">
                  <template v-if="checkoutTypeIncluded(row.checkoutTypeId)">{{ row?.discountAmount | tofixed2 }}</template>
                  <el-input-number
                    v-else
                    v-model="row.discountAmount"
                    size="small"
                    :precision="2"
                    :min="0"
                    :max="+row.quantity*row.price"
                    :step="0.1"
                    controls-position="right"
                    clearable
                    @change="handlePartDiscountAmountChange(row)"
                  />
                </template>
              </vxe-column>
              <vxe-column field="partsAmount" title="配件金额" width="120px">
                <template #default="{ row }">
                  <template>{{ row?.partsAmount | tofixed2 }}</template>
                </template>
              </vxe-column>
              <vxe-column field="repairItemName" title="维修项目名称" width="180px">
                <template #default="{ row }">
                  <el-select
                    v-model="row.repairItemName"
                    size="small"
                    placeholder="请选择"
                    filterable
                    :disabled="!!row.autoImport"
                    clearable
                  @change="handlePartRepairItemNameChange(row)"
                  >
                    <el-option
                      v-for="item in repairItemNameOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </vxe-column>
              <vxe-column field="packageCode" title="套餐代码" width="120px" />
              <vxe-column title="操作" width="150" align="center" fixed="right">
                <template #default="{ row, rowIndex }">
                  <span slot="reference" v-if="row.packageId" :class="['btn-delete', {'disabled': !!row.isOutstock}]" @click="handleRemovePartRow(rowIndex, row)">删除</span>
                  <el-popconfirm v-else title="确定要删除这条记录吗？" @confirm="handleRemovePartRow(rowIndex, row)" :disabled="!!!!row.isOutstock">
                    <span slot="reference" :class="['btn-delete', {'disabled': !!row.isOutstock}]">删除</span>
                  </el-popconfirm>
                  <el-dropdown v-if="row.replaceSparePartRespList && row.replaceSparePartRespList.length > 0" trigger="click" @command="v => handlePartReplaceChange(v, row)">
                    <span class="el-dropdown-link">
                      替换件<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" placement="bottom-start" style="max-height: 200px;overflow-y: auto;overflow-x: hidden;">
                      <el-dropdown-item v-for="el in row.replaceSparePartRespList" :command="el" :key="el.id">{{el.partsName}}-库存:{{el.stockCount || 0}}-{{el.partsCode}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </vxe-column>
              <template #empty>
                <div class="m-vxe-table-empty-text">可搜索添加，或选择维修套餐/权益套餐等</div>
              </template>
            </vxe-table>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button size="small" :loading="submitLoading" type="primary" @click="submit">保 存</el-button>
        </div>
      </template>
    </el-dialog>
    <UpdateActivityDialog
      :visible.sync="updateDialogVisible"
      :vehicleInfo="vehicleInfo"
      :packageType="packageType"
      :currentPackageType="currentPackageType"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script>
// import EditTable from '@/libs/components/EditTable';
import { getEnum, getDiscountType, getRepairItemInfo, filterRepairItem, filterSparePartItem, saveRepairItem, getRepairItemTypeList, getDealerPermission } from '@/api/maintain/sp/serviceProxy/index';
import UpdateActivityDialog from '../UpdateActivityDialog';

export default {
  name: 'SelectRepairItemDialog',
  components: {
    UpdateActivityDialog
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
      updateDialogVisible: false,
      discountMode: '',
      activeTypeTab: '',
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
      itemOptions: {
        repairItemTypeName: [],
        checkoutTypeName: [],
        warrantyTypeName: []
      },

      // 维修配件表格配置
      partData: [],
      // 结算类型和保修类型映射关系
      checkoutTypeMap: {},
      // 原始数据
      originalDataJson: null,

      // 套餐类型
      packageType: [
        { label: '维修套餐' },
        { label: '权益套餐' },
        { label: '商城订单' },
        { label: '免保项目' },
        { label: '服务活动' }
      ],
      currentPackageType: 1,
      partReplaceList: [],
      // 经销商权限配置
      dealerPermission: {
        repairItemHasPermission: false,
        partHasPermission: false,
        repairItem: { checkoutTypeIds: [], warrantyTypeIds: [] },
        part: { checkoutTypeIds: [], warrantyTypeIds: [] }
      }
    };
  },
  computed: {
    // 维修配件的维修项目名称下拉选项（动态从已添加的维修项目获取）
    repairItemNameOptions () {
      return this.itemData.map(item => ({
        label: item.repairItemName,
        value: item.repairItemName
      }));
    },
    // 维修项目的结算类型过滤选项
    filteredRepairItemCheckoutTypes () {
      // 如果维修项目没有权限限制，显示所有选项
      if (!this.dealerPermission.repairItemHasPermission) {
        return this.itemOptions.checkoutTypeName;
      }
      const allowedIds = this.dealerPermission.repairItem.checkoutTypeIds;
      return this.itemOptions.checkoutTypeName.filter(item =>
        allowedIds.includes(item.checkoutTypeId)
      );
    },
    // 维修项目的保修类型过滤选项
    filteredRepairItemWarrantyTypes () {
      // 如果维修项目没有权限限制，显示所有选项
      if (!this.dealerPermission.repairItemHasPermission) {
        return this.itemOptions.warrantyTypeName;
      }
      // API的repairItemTypeId映射到选项的warrantyTypeId
      const allowedIds = this.dealerPermission.repairItem.warrantyTypeIds;
      return this.itemOptions.warrantyTypeName.filter(item =>
        allowedIds.includes(item.warrantyTypeId)
      );
    },
    // 零件的结算类型过滤选项
    filteredPartCheckoutTypes () {
      // 如果零件没有权限限制，显示所有选项
      if (!this.dealerPermission.partHasPermission) {
        return this.itemOptions.checkoutTypeName;
      }
      const allowedIds = this.dealerPermission.part.checkoutTypeIds;
      return this.itemOptions.checkoutTypeName.filter(item =>
        allowedIds.includes(item.checkoutTypeId)
      );
    },
    // 零件的保修类型过滤选项
    filteredPartWarrantyTypes () {
      // 如果零件没有权限限制，显示所有选项
      if (!this.dealerPermission.partHasPermission) {
        return this.itemOptions.warrantyTypeName;
      }
      // API的repairItemTypeId映射到选项的warrantyTypeId
      const allowedIds = this.dealerPermission.part.warrantyTypeIds;
      return this.itemOptions.warrantyTypeName.filter(item =>
        allowedIds.includes(item.warrantyTypeId)
      );
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getEnumData();
        this.getRepairItemInfo();
        this.discountMode = this.vehicleInfo.discountId;
      }
    },
    dialogVisible (val) {
      this.$emit('update:visible', val);
    }
  },
  filters: {
    tofixed2 (v) {
      if (v && parseFloat(v) !== 'NaN') {
        return parseFloat(v).toFixed(2);
      }
      return v;
    }
  },
  methods: {
    /**
     * 根据结算类型获取可用的保修类型选项
     * @param {Object} checkoutTypeObj - 结算类型对象
     * @param {String} itemType - 项目类型 'repairItem' | 'part'
     * @returns {Array} 过滤后的保修类型选项
     */
    getWarrantyTypeOptions (checkoutTypeObj, itemType = 'part') {
      let warrantyTypeNameOption = this.checkoutTypeMap[checkoutTypeObj?.checkoutTypeName];
      let finalWarrantyOptions;
      if (warrantyTypeNameOption) {
        // 如果有checkoutTypeMap映射，应用权限过滤
        const filteredTypes = itemType === 'repairItem' ? this.filteredRepairItemWarrantyTypes : this.filteredPartWarrantyTypes;
        const allowedIds = new Set(filteredTypes.map(item => item.warrantyTypeId));
        finalWarrantyOptions = warrantyTypeNameOption.filter(item => allowedIds.has(item.warrantyTypeId));
      } else {
        finalWarrantyOptions = this.filteredPartWarrantyTypes;
      }

      return finalWarrantyOptions;
    },
    showMsg (msg) {
      return new Promise((resolve) => {
        const message = `<div class="ais-leave-tips-main warn"><i class="iconfont icon-lxppc-prompt"></i>提醒</div><div class="ais-leave-tips-sub">${msg}</div>`;
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          resolve(true);
        }).catch(() => {
          resolve(false);
        });
      });
    },
    handleOpenDialog (type) {
      this.currentPackageType = type;
      this.updateDialogVisible = true;
    },
    close () {
      this.dialogVisible = false;
    },
    closed () {
      // 重置数据
      this.itemData = [];
      this.partData = [];
      this.discountMode = '';
      this.activeTypeTab = '';
      this.itemSearchKey = '';
      this.partSearchKey = '';
      this.selectedRepairItem = null;
      this.selectedRepairPart = null;
      this.selectedDiscount = {};
      this.checkoutTypeMap = {};
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

      // 查找结算类型的默认值（取第一个，考虑权限过滤）
      let checkoutTypeObj = this.filteredRepairItemCheckoutTypes?.[0];
      if (selectedItem.id === '999999') {
        checkoutTypeObj = this.filteredRepairItemCheckoutTypes?.filter(item => !this.checkoutTypeIncluded(item.checkoutTypeId))?.[0];
      }

      // 获取保修类型选项（维修项目）
      const finalWarrantyOptions = this.getWarrantyTypeOptions(checkoutTypeObj, 'repairItem');
      const warrantyTypeObj = finalWarrantyOptions?.[0];

      const newItem = {
        repairItemCode: selectedItem.code || '',
        repairItemName: selectedItem.name || '',
        repairItemId: selectedItem.id,
        repairItemTypeId: selectedItem.repairItemTypeId || this.repairType,
        repairItemTypeName: selectedItem.repairItemTypeName || repairTypeObj?.repairItemTypeName || repairTypeObj?.label || '',
        repairItemDisabled: !!selectedItem.repairItemTypeId,
        checkoutTypeId: checkoutTypeObj?.checkoutTypeId || '',
        checkoutTypeName: checkoutTypeObj?.checkoutTypeName || checkoutTypeObj?.label || '',
        warrantyTypeId: warrantyTypeObj?.warrantyTypeId || '',
        warrantyTypeName: warrantyTypeObj?.warrantyTypeName || warrantyTypeObj?.label || '',
        workHour: selectedItem.workhour || 0,
        price: selectedItem.workhourPrice || 0,
        discountRate: this.selectedDiscount?.discountWorkhourRate || 0,
        discountAmount: 0,
        repairAmount: (selectedItem.workhour || 0) * (selectedItem.workhourPrice || 0),
        statusLabel: '',
        packageCode: selectedItem.packageCode || '',
        isWarranty: selectedItem.isWarranty || 0,
        isProdType: selectedItem.isProdType || 0
      };

      this.itemData.push(newItem);

      // 如果维修项目带有关联零件列表，自动添加这些零件
      if (selectedItem.partsRespList && selectedItem.partsRespList.length > 0) {
        // 获取保修类型选项（配件）
        const finalWarrantyOptions = this.getWarrantyTypeOptions(checkoutTypeObj, 'part');
        const warrantyTypeObj2 = finalWarrantyOptions?.[0];
        selectedItem.partsRespList.forEach(part => {
          const discountAmount = Number(part.price || 0) * (Number(this.selectedDiscount?.discountPartRate || 0) || 0);
          const newPart = {
            partsId: part.id,
            partsCode: part.partsCode || '',
            partsName: part.partsName || '',
            repairItemTypeId: selectedItem.repairItemTypeId || this.repairType,
            repairItemTypeName: selectedItem.repairItemTypeName || repairTypeObj?.repairItemTypeName || repairTypeObj?.label || '',
            repairItemDisabled: !!selectedItem.repairItemTypeId,
            checkoutTypeId: checkoutTypeObj?.checkoutTypeId || '',
            checkoutTypeName: checkoutTypeObj?.checkoutTypeName || checkoutTypeObj?.label || '',
            warrantyTypeId: warrantyTypeObj2?.warrantyTypeId || '',
            warrantyTypeName: warrantyTypeObj2?.warrantyTypeName || warrantyTypeObj2?.label || '',
            isOemPart: part.isOemPart || 0,
            quantity: part.quantity || 1,
            price: part.price || 0,
            discountRate: this.selectedDiscount?.discountPartRate || 0,
            discountAmount: discountAmount,
            partsAmount: part.price - discountAmount,
            repairItemName: selectedItem.name || '',
            packageCode: part.packageCode || '',
            repairItemId: newItem.repairItemId, // 关联维修项目ID
            repairitemcode: selectedItem.code,
            isBindltem: 1,
            autoImport: 1 // 标记为自动导入
          };
          this.partData.push(newPart);
        });
      }

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

      // 查找结算类型的默认值（取第一个，考虑权限过滤）
      const checkoutTypeObj = this.filteredPartCheckoutTypes?.[0];

      // 查找保修类型的默认值（取第一个，考虑权限过滤和checkoutTypeMap）
      const finalWarrantyOptions = this.getWarrantyTypeOptions(checkoutTypeObj, 'part');
      const warrantyTypeObj = finalWarrantyOptions?.[0];

      const discountAmount = Number(selectedPart.salePrice) * (1 - (Number(this.selectedDiscount?.discountPartRate) || 1));
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
        isOemPart: parseInt(selectedPart.oemPart),
        quantity: 1,
        price: selectedPart.salePrice || 0,
        discountRate: this.selectedDiscount?.discountPartRate || 0,
        discountAmount: discountAmount,
        partsAmount: selectedPart.salePrice - discountAmount,
        repairItemName: selectedPart.repairItemName || '',
        isBindltem: 0, // 手动添加的零件，标记为非自动导入
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
      // if (this.itemData.length === 0 && this.partData.length === 0) {
      //   this.$message.warning('请至少添加一个维修项目或维修配件');
      //   return;
      // }
      // 保修类型为售前保修只能单独开单
      const el = this.itemData.find(item => item.warrantyTypeId === 'ED68D3F0-C1FB-E911-B0BB-FC82BA5F9EDF');
      if (el && this.itemData.length > 1) {
        this.$message.warning('售前保修只能单独开单');
        return;
      }
      this.submitLoading = true;

      const data = {
        itemList: this.itemData,
        partsList: this.partData,
        discountId: this.discountMode,
        serviceProxyId: this.vehicleInfo.id,
      };

      if (JSON.stringify(data) === this.originalDataJson) {
        this.$emit('update:visible', false);
        this.submitLoading = false;
        return;
      }

      saveRepairItem(data).then(res => {
        this.$emit('update:visible', false);
        this.submitLoading = false;
        this.$message.success('保存成功');
        this.$emit('refresh');
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
      this.getPermissions();
    },
    getRepairItemInfo () {
      getRepairItemInfo(this.vehicleInfo.id).then(res => {
        this.info = res || {};
        this.itemData = res.repairItemRespList || [];
        this.partData = (res.sparePartRespList || []).map(part => ({
          ...part,
          // 如果零件有关联的维修项目ID，标记为自动导入
          isBindltem: !!part.repairItemId
        }));

        setTimeout(() => {
          const data = {
            itemList: this.itemData,
            partsList: this.partData,
            discountId: this.discountMode,
            serviceProxyId: this.vehicleInfo.id,
          };
          this.originalDataJson = JSON.stringify(data);
        }, 300);

        getEnum('PackageTypeEnum').then(res2 => {
          this.packageType = (res2 || []).map(item => {
            const el = this.info.packageRespList?.find(item2 => +item.code === item2.packageType);
            return {
              ...item,
              value: el?.packageCount || 0
            };
          });
        });
      });
    },
    searchRepairItem (queryString, cb) {
      if (!queryString) return;
      filterRepairItem({ nameOrCodeOrPinyinLike: queryString, serviceProxyId: this.vehicleInfo.id }).then(res => {
        const data = res.map(item => ({
          ...item,
          value: `${item.name}-${item.code}`
        })) || [];
        if (data.length === 0) {
          data.push({ value: 'empty' });
        }
        cb(data);
      });
    },
    handleSelect (item) {
      if (item.value === 'empty') {
        this.itemSearchKey = '';
        return;
      }
      // 校验是否重复添加
      const target = this.itemData.filter(el => el.repairItemId !== '999999' && el.workRecordStatus !== 40).find(el => el.repairItemId === item.id);
      if (target) {
        this.$message.error('维修项目已存在，请勿重复添加');
        return;
      }
      this.selectedRepairItem = item;
      this.addItem();
    },
    searchRepairPart (queryString, cb) {
      if (!queryString) return;
      filterSparePartItem({ nameOrCodeOrPinyinLike: queryString, serviceProxyId: this.vehicleInfo.id }).then(res => {
        const data = res.map(item => ({
          ...item,
          isOemPart: item.oemPart,
          value: `${item.partName}-库存:${item.availableQty || 0}-${item.partCode}`
        })) || [];
        if (data.length === 0) {
          data.push({ value: 'empty' });
        }
        cb(data);
      });
    },
    handleSelectPart (item) {
      if (item.value === 'empty') {
        this.partSearchKey = '';
        return;
      }
      if (Number(item.salePrice) > 0) {
        // 校验是否重复添加
        const target = this.partData.find(el => el.partsId === item.id);
        if (target) {
          this.$message.error('该零件已存在，请勿重复添加');
          return;
        }
        this.selectedRepairPart = item;
        this.addPart();
      } else {
        this.$message.warning('请先维护零件的销售价格');
      }
    },
    handleDiscountModeChange (value) {
      // 查找选中的优惠模式
      const selectedDiscount = this.discountType.find(item => item.id === value);
      this.selectedDiscount = selectedDiscount || {};

      const { discountPartRate = 0, discountWorkhourRate = 0 } = this.selectedDiscount;

      // 更新维修项目的折扣率
      this.itemData.forEach(item => {
        if (!this.checkoutTypeIncluded(item.checkoutTypeId)) {
          item.discountRate = discountWorkhourRate || 0;
          // 重新计算优惠金额和项目金额
          const originalAmount = item.workHour * item.price;
          item.discountAmount = originalAmount * item.discountRate;
          item.repairAmount = originalAmount - item.discountAmount;
        }
      });

      // 更新维修配件的折扣率
      this.partData.forEach(part => {
        if (!this.checkoutTypeIncluded(part.checkoutTypeId)) {
          part.discountRate = discountPartRate || 0;
          // 重新计算优惠金额和配件金额
          const originalAmount = part.quantity * part.price;
          part.discountAmount = originalAmount * part.discountRate;
          part.partsAmount = originalAmount - part.discountAmount;
        }
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
        const amount = parseFloat(part.partsAmount);
        return sum + amount;
      }, 0);

      // 计算费用合计
      this.info.maintenanceCostEstimation = this.info.workCostCount + this.info.barkCostCount;
      // 保留2位小数
      this.info.maintenanceCostEstimation = parseFloat(this.info.maintenanceCostEstimation).toFixed(2);
      this.info.workCostCount = parseFloat(this.info.workCostCount).toFixed(2);
      this.info.barkCostCount = parseFloat(this.info.barkCostCount).toFixed(2);
    },
    // 处理维修项目表格删除行
    async handleRemoveItemRow (index, row) {
      let flag = true;
      if (row.packageId) {
        flag = await this.showMsg('本操作视为您取消核销本次权益套餐，请确认');
      }
      if (!flag) return;
      const deleted = this.deleteRights(row);
      if (!deleted) return;
      const removedRow = this.itemData[index];
      // 从 itemData 中移除该行数据
      this.itemData.splice(index, 1);

      // 删除该项目自动引入的零件
      if (removedRow.repairItemId) {
        // 找到所有关联该维修项目的自动导入零件
        const autoImportedPartIndices = [];
        this.partData.forEach((part, idx) => {
          if (part.repairItemId === removedRow.repairItemId) {
            autoImportedPartIndices.push(idx);
          }
        });

        // 从后往前删除，避免索引变化
        for (let i = autoImportedPartIndices.length - 1; i >= 0; i--) {
          this.partData.splice(autoImportedPartIndices[i], 1);
        }
      }
      // 更新顶部合计
      this.updateTotals();
    },
    // 处理维修配件表格删除行
    async handleRemovePartRow (index, row) {
      let flag = true;
      if (row.packageId) {
        flag = await this.showMsg('本操作视为您取消核销本次权益套餐，请确认');
      }
      if (!flag) return;
      // 从 partData 中移除该行数据
      const deleted = this.deleteRights(row);
      if (!deleted) return;
      this.partData.splice(index, 1);
      // 更新顶部合计
      this.updateTotals();
    },
    deleteRights (row) {
      if (row.packageId) {
        const el = this.partData.find(part => part.isOutstock && part.packageId === row.packageId);
        if (el) {
          this.$message.error(`权益导入的零件编码：${el.partsCode}已经领料出库，不允许删除对应权益，请全部退料后再操作，谢谢`);
          return false;
        }
        this.partData = this.partData.filter(part => part.packageId !== row.packageId);
        this.itemData = this.itemData.filter(item => item.packageId !== row.packageId);
        return true;
      }
    },
    // ==================== 维修项目表格事件处理 ====================
    // 维修类型变化
    handleRepairItemTypeChange (row) {
      const selected = this.itemOptions.repairItemTypeName.find(item => item.repairItemTypeName === row.repairItemTypeName);
      if (selected) {
        row.repairItemTypeId = selected.repairItemTypeId;
      }
    },
    // 结算类型变化
    handleCheckoutTypeChange (row) {
      const selected = this.itemOptions.checkoutTypeName.find(item => item.checkoutTypeName === row.checkoutTypeName);
      if (selected) {
        row.checkoutTypeId = selected.checkoutTypeId;
        // 使用提取的方法获取过滤后的保修类型选项
        const checkoutTypeObj = this.filteredRepairItemCheckoutTypes.find(item => item.checkoutTypeName === row.checkoutTypeName) || selected;
        const warrantyTypes = this.getWarrantyTypeOptions(checkoutTypeObj, 'repairItem');
        row.warrantyTypeId = warrantyTypes?.[0]?.warrantyTypeId;
        row.warrantyTypeName = warrantyTypes?.[0]?.warrantyTypeName;
      }
    },
    // 保修类型变化
    handleWarrantyTypeChange (row) {
      const selected = this.itemOptions.warrantyTypeName.find(item => item.warrantyTypeName === row.warrantyTypeName);
      if (selected) {
        row.warrantyTypeId = selected.warrantyTypeId;
      }
    },
    // 工时变化
    handleWorkHourChange (row) {
      const workHour = Number(row.workHour) || 0;
      const originalAmount = workHour * row.price;
      row.discountAmount = originalAmount * row.discountRate;
      row.repairAmount = originalAmount - row.discountAmount;
      this.updateTotals();
    },
    // 优惠金额变化
    handleItemDiscountAmountChange (row) {
      const originalAmount = row.workHour * row.price;
      row.discountAmount = Number(row.discountAmount) || 0;
      row.repairAmount = originalAmount - row.discountAmount;
      row.discountRate = (row.discountAmount / originalAmount).toFixed(8);
      this.updateTotals();
    },

    // ==================== 维修配件表格事件处理 ====================
    // 维修类型变化
    handlePartRepairItemTypeChange (row) {
      const selected = this.itemOptions.repairItemTypeName.find(item => item.repairItemTypeName === row.repairItemTypeName);
      if (selected) {
        row.repairItemTypeId = selected.repairItemTypeId;
      }
    },
    // 结算类型变化
    handlePartCheckoutTypeChange (row) {
      const selected = this.itemOptions.checkoutTypeName.find(item => item.checkoutTypeName === row.checkoutTypeName);
      if (selected) {
        row.checkoutTypeId = selected.checkoutTypeId;
        // 使用提取的方法获取过滤后的保修类型选项
        const checkoutTypeObj = this.filteredPartCheckoutTypes.find(item => item.checkoutTypeName === row.checkoutTypeName) || selected;
        const warrantyTypes = this.getWarrantyTypeOptions(checkoutTypeObj, 'part');
        row.warrantyTypeId = warrantyTypes?.[0]?.warrantyTypeId;
        row.warrantyTypeName = warrantyTypes?.[0]?.warrantyTypeName;
      }
    },
    // 保修类型变化
    handlePartWarrantyTypeChange (row) {
      const selected = this.itemOptions.warrantyTypeName.find(item => item.warrantyTypeName === row.warrantyTypeName);
      if (selected) {
        row.warrantyTypeId = selected.warrantyTypeId;
      }
    },
    // 数量变化
    handlePartQuantityChange (row) {
      const quantity = Number(row.quantity) || 0;
      const originalAmount = quantity * row.price;
      row.discountAmount = originalAmount * row.discountRate;
      row.partsAmount = originalAmount - row.discountAmount;
      this.updateTotals();
    },
    // 优惠金额变化
    handlePartDiscountAmountChange (row) {
      const originalAmount = row.quantity * row.price;
      row.discountAmount = Number(row.discountAmount) || 0;
      row.partsAmount = originalAmount - row.discountAmount;
      row.discountRate = (row.discountAmount / originalAmount).toFixed(8);
      this.updateTotals();
    },
    // 维修项目名称变化
    handlePartRepairItemNameChange (row) {
      const selectedItem = this.itemData.find(item => item.repairItemName === row.repairItemName);
      if (selectedItem) {
        row.repairItemId = selectedItem.repairItemId;
        row.repairItemTypeName = selectedItem.repairItemTypeName;
        row.repairItemTypeId = selectedItem.repairItemTypeId;
        row.checkoutTypeName = selectedItem.checkoutTypeName;
        row.checkoutTypeId = selectedItem.checkoutTypeId;
        row.isBindltem = 1;
      } else {
        row.repairItemId = null;
        row.isBindltem = 0;
      }
    },
    // 结算类型是否为合同、保修
    checkoutTypeIncluded (type) {
      // SELF_PAY("352BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "自费"),
      // INSURANCE("372BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "保险"),
      // WARRANTY("392BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "保修"),
      // CONTRACT("3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "合同"),
      // INTERNAL_SETTLEMENT("3D2BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "内部结算");
      return type === '392BB70C-82AC-E911-B0BB-FC82BA5F9EDF' || type === '3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF';
    },

    // 【结算类型】为保修，【保修类型】为：技术服务活动 选不到
    // 【结算类型】为合同，【保修类型】为：免费保养、终身保养、保养套餐 选不到
    checkIfWarrantyTypeEditable (row, id) {
      if (row.checkoutTypeId === '392BB70C-82AC-E911-B0BB-FC82BA5F9EDF' && id === '64A3066F-82AC-E911-B0BB-FC82BA5F9EDF') {
        return false;
      }
      const warrantyTypes = [
        '60A3066F-82AC-E911-B0BB-FC82BA5F9EDF', // 免费保养
        '4EC01DDD-DD79-EC11-B0F9-9216EACB73F2', // 终身保养
        'BA408917-12AE-EF11-B1BC-B6F71A4539C1' // 保养套餐
      ];
      if (row.checkoutTypeId === '3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF' && warrantyTypes.includes(id)) {
        return false;
      }
      return true;
    },
    // 根据权限获取保修类型过滤选项
    getFilteredWarrantyTypesForRow (row, type) {
      // 获取基础选项：优先使用checkoutTypeMap映射
      const baseOptions = this.checkoutTypeMap[row.checkoutTypeName];
      if (baseOptions) {
        // 如果有checkoutTypeMap映射，需要再应用权限过滤
        const filteredOptions = type === 'repairItem'
          ? this.filteredRepairItemWarrantyTypes
          : this.filteredPartWarrantyTypes;
        const allowedIds = new Set(filteredOptions.map(item => item.warrantyTypeId));
        return baseOptions.filter(item => allowedIds.has(item.warrantyTypeId));
      }
      // 如果没有checkoutTypeMap映射，直接使用权限过滤后的选项
      return type === 'repairItem'
        ? this.filteredRepairItemWarrantyTypes
        : this.filteredPartWarrantyTypes;
    },
    // 获取维修项目表格行样式类名
    getItemRowClassName ({ row }) {
      if (row.status === 0) {
        return 'row-status-danger';
      }
      return '';
    },
    // 2、【结算类型】为：合同、保修  且 {维修项目} 【是否保修专用为：是】或【是否生产类专用为：是】，支持编辑工时，否则不可编辑工时；
    // 3、【结算类型】为：内部结算、保险、自费  且 非万能工时，不可编辑工时；
    // 4、万能工时 且 项目未完工，支持编辑工时；已完工，不可编辑；
    checkIfTimeEditable (row) {
      if (this.checkoutTypeIncluded(row.checkoutTypeId) && (row.isWarranty || row.isProdType)) {
        return true;
      }
      // if (!this.checkoutTypeIncluded(row.checkoutTypeId) && row.repairItemId !== '999999') {
      //   return false;
      // }
      if (row.repairItemId === '999999' && row.workRecordStatus !== 40) {
        return true;
      }
      return false;
    },
    getRepairItemTypeList () {
      getRepairItemTypeList({
        categorys: [20]
      }).then(res => {
        const d = (res || []).reduce((p, c) => {
          const item = {
            ...c,
            warrantyTypeId: c.id,
            warrantyTypeName: c.name
          };
          if (p[c.checkoutTypeName]) {
            p[c.checkoutTypeName].push(item);
          } else {
            p[c.checkoutTypeName] = [item];
          }
          return p;
        }, {});
        this.checkoutTypeMap = d;
      });
    },
    getPermissions () {
      getDealerPermission({}).then(res => {
        const list = res || [];
        // Process permissions by permissionType
        const repairItemPerms = list.filter(item => item.permissionType === 10);
        const partPerms = list.filter(item => item.permissionType === 20);

        this.dealerPermission = {
          // 分别判断维修项目和零件是否有权限限制
          repairItemHasPermission: repairItemPerms.length > 0,
          partHasPermission: partPerms.length > 0,
          repairItem: {
            checkoutTypeIds: [...new Set(repairItemPerms.map(p => p.checkoutTypeId))],
            warrantyTypeIds: [...new Set(repairItemPerms.map(p => p.repairItemTypeId))]
          },
          part: {
            checkoutTypeIds: [...new Set(partPerms.map(p => p.checkoutTypeId))],
            warrantyTypeIds: [...new Set(partPerms.map(p => p.repairItemTypeId))]
          }
        };
        this.getRepairItemTypeList();
      });
    },
    handleTypeChange (v) {
      this.repairType = v;
      this.partRepairType = v;
    },
    handleRefresh () {
      this.getRepairItemInfo();
    },
    // ----------替换件逻辑-----------------
    handlePartReplaceChange (current, row) {
      const discountAmount = Number(current.price || 0) * (Number(this.selectedDiscount?.discountPartRate || 0) || 0);
      Object.assign(row, {
        partsId: current.partsId,
        partsCode: current.partsCode,
        partsName: current.partsName,
        repairItemTypeId: row.repairItemTypeId,
        repairItemTypeName: row.repairItemTypeName,
        checkoutTypeId: row?.checkoutTypeId,
        checkoutTypeName: row?.checkoutTypeName,
        warrantyTypeId: row?.warrantyTypeId,
        warrantyTypeName: row?.warrantyTypeName,
        isOemPart: parseInt(current.isOemPart) || 0,
        quantity: 1,
        price: current.price || 0,
        discountRate: this.selectedDiscount?.discountPartRate || 0,
        discountAmount: discountAmount,
        partsAmount: current.price - discountAmount,
        repairItemName: current.repairItemName || '',
        repairItemId: current.repairItemId || '',
        isBindltem: 0, // 手动添加的零件，标记为非自动导入
        packageCode: row.packageCode || '',
        packageId: row.packageId || ''
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-add-repair-item-dialog {
  // 维保3.0
  ::v-deep .el-dialog{
    height: 100%!important;
    width: 100%!important;
    margin: 0!important;
    border-radius: 0;
  }
  ::v-deep .el-dialog .el-dialog__body {
    height: calc(100% - 110px);
    max-height: calc(100% - 110px);
    padding: 20px;
  }
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px!important;
  }
  .m-vxe-table-empty-text {
    text-align: left;
  }
  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }
   ::v-deep .el-input__suffix-inner {
    line-height: 32px;
  }
  .el-dropdown-link{
    margin-left: 10px;
    color: var(--leap-color-link);
  }
  .btn-delete {
    color: var(--leap-color-danger);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: var(--leap-color-danger-dark-1);
    }
    &.disabled{
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  .info-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-radius: 4px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--leap-color-default-light-4);
    // background-color: var(--leap-color-default-light-5);

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
  .container {
    display: flex;
    gap: 16px;
    height: calc(100% - 85px);

    .leftmenu {
      width: 280px;
      flex-shrink: 0;
      background-color: var(--leap-color-default-light-5);
      border-radius: 4px;
      padding: 12px;
      box-sizing: border-box;
      h4{
        color: var(--leap-color-default);
        font-weight: normal;
        margin-top: 20px;
      }
      .type-tab {
        color: var(--leap-color-default);
        border: 1px solid #E6E6E5;
        display: inline-block;
        border-radius: 4px;
        padding: 3px 12px;
        margin: 8px 8px 0px 0px;
        cursor: pointer;
        background-color: #fff;
        &.active {
          background-color: var(--leap-color-primary);
          color: #fff;
          border: 1px solid var(--leap-color-primary);
        }
      }
      .el-autocomplete{
        margin-top: 8px;
        width: 100%;
      }
      .left-fast-add{
        margin-top: 32px;
      }
      .fast-add-list{
        li {
          height: 32px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 5px;
          box-sizing: border-box;
          margin-top: 8px;
          &:hover{
            background-color: var(--leap-color-primary-light-9);
          }
        }
        .item-num{
          height: 16px;
          line-height: 16px;
          border-radius: 8px;
          padding: 0 5px;
          text-align: center;
          background-color: var(--leap-color-primary);
          color: #fff;
          display: inline-block;
          font-size: 12px;
          vertical-align: bottom;
          margin-bottom: 2px;
        }
      }
    }

    .tab-content {
      flex: 1;
      min-width: 0;
      padding-top: 12px;

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

  // 维修项目表格行高亮样式
  ::v-deep .vxe-table .row-status-danger {
    background-color: rgba(245, 108, 108, 0.1) !important;
    .vxe-body--column {
      background-color: rgba(245, 108, 108, 0.2) !important;
    }
  }
}
</style>
