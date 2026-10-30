<template>
  <div class="page-common-detail m-spare-part-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>备件编码：{{ info.partCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="备件编码：" prop="partCode">
              <!-- {{ info.partCode  }} -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <span>{{ info.partCode }}</span>
                <el-button size="mini" @click="handleDigitalModel">数模</el-button>
              </div>
            </el-form-item>
            <el-form-item label="备件名称：" prop="partName">
              {{ info.partName  }}
            </el-form-item>
            <el-form-item label="拼音简码：" prop="pinyinCode">
              {{ info.pinyinCode  }}
            </el-form-item>
            <el-form-item label="基本计量单位：" prop="baseUnit">
              {{ info.baseUnitLabel  }}
            </el-form-item>
            <el-form-item label="备件工程师：" prop="partsEngineer">
              {{ info.partsEngineer  }}
            </el-form-item>
            <el-form-item label="是否OEM件：" prop="oemPart">
              {{ info.oemPartLabel  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="是否可销售：" prop="saleableIs">
              {{ info.saleableIsLabel  }}
            </el-form-item>
            <el-form-item label="最小订购量：" prop="minOrderQuantity">
              {{ info.minOrderQuantity  }}
            </el-form-item>
            <el-form-item label="采购价格：" prop="purchasePrice">
              {{ info.purchasePrice  }}
            </el-form-item>
            <el-form-item label="销售价格：" prop="salePrice">
              {{ info.salePrice  }}
            </el-form-item>
            <el-form-item label="BO调拨：" prop="boTransferIs">
              {{ info.boTransferIsLabel  }}
            </el-form-item>
            <el-form-item label="是否常备库存件：" prop="standingInventoryIs">
              {{ info.standingInventoryIsLabel  }}
            </el-form-item>
            <el-form-item label="OEM备注：" prop="oemRemark" v-if="permissions.has('AISPART-sparePart-oem')">
              {{ info.oemRemark  }}
            </el-form-item>
            <el-form-item label="采购状态：" prop="purchaseType">
              {{ info.purchaseTypeLabel  }}
            </el-form-item>
            <el-form-item label="旧件返还类型：" prop="oldReturnType">
              {{ info.oldReturnTypeLabel  }}
            </el-form-item>
            <el-form-item label="营销分类：" prop="marketingType">
              {{ info.marketingTypeLabel  }}
            </el-form-item>
            <el-form-item label="销售物料分类：" prop="categorySpareSalesId">
              {{ info.categorySpareSalesName  }}
            </el-form-item>
            <el-form-item label="VFG：" prop="vfgId">
              {{ info.vfgName  }}
            </el-form-item>
            <el-form-item label="VRT：" prop="vrtId">
              {{ info.vrtName  }}
            </el-form-item>
            <el-form-item label="技术是否启用：" prop="technicalIs">
              {{ info.technicalIsLabel  }}
            </el-form-item>
          </el-form>
        </div>
        <div class="common-section-header">
          <h2>其他信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm">
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="是否启用：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="供应商起订量：" prop="supplierMinOrderQuantity">
              {{ info.supplierMinOrderQuantity  }}
            </el-form-item>
            <el-form-item label="是否追溯件：" prop="traceableIs">
              {{ info.traceableIsLabel  }}
            </el-form-item>
            <el-form-item label="是否可快递：" prop="expressAvailableIs">
              {{ info.expressAvailableIsLabel  }}
            </el-form-item>
            <el-form-item label="保修是否拆分数量：" prop="maintenanceSplitQuantityIs">
              {{ info.maintenanceSplitQuantityIsLabel  }}
            </el-form-item>
            <el-form-item label="是否关键件：" prop="keyPartIs">
              {{ info.keyPartIsLabel  }}
            </el-form-item>
            <!-- 【LP260102】新增字段：门店账号的可见性由后端置空实现，前端不做隐藏 -->
            <el-form-item label="分库是否备货：" prop="subLibraryStockIs">
              {{ info.subLibraryStockIsLabel  }}
            </el-form-item>
            <el-form-item label="是否EOP产品：" prop="eopProductIs">
              {{ info.eopProductIsLabel  }}
            </el-form-item>
            <el-form-item label="是否一次性备货：" prop="oneTimeStockIs">
              {{ info.oneTimeStockIsLabel  }}
            </el-form-item>
            <el-form-item label="国内包装前长（mm）：" prop="domesticPrePackageLengthMm">
              {{ info.domesticPrePackageLengthMm  }}
            </el-form-item>
            <el-form-item label="国内包装前宽（mm）：" prop="domesticPrePackageWidthMm">
              {{ info.domesticPrePackageWidthMm  }}
            </el-form-item>
            <el-form-item label="国内包装前高（mm）：" prop="domesticPrePackageHeightMm">
              {{ info.domesticPrePackageHeightMm  }}
            </el-form-item>
            <el-form-item label="国内包装前体积（cm³）：" prop="domesticPrePackageVolumeCm3">
              {{ info.domesticPrePackageVolumeCm3  }}
            </el-form-item>
            <el-form-item label="国内包装前重量（kg）：" prop="domesticPrePackageWeightKg">
              {{ info.domesticPrePackageWeightKg  }}
            </el-form-item>
            <el-form-item label="是否翻包：" prop="needRepackIs">
              {{ info.needRepackIsLabel  }}
            </el-form-item>
            <el-form-item label="供应物料分类：" prop="categorySpareSupplyId">
              {{ info.categorySpareSupplyName  }}
            </el-form-item>
            <el-form-item label="国内包装后长（mm）：" prop="domesticPostPackageLengthMm">
              {{ info.domesticPostPackageLengthMm  }}
            </el-form-item>
            <el-form-item label="国内包装后宽（mm）：" prop="domesticPostPackageWidthMm">
              {{ info.domesticPostPackageWidthMm  }}
            </el-form-item>
            <el-form-item label="国内包装后高（mm）：" prop="domesticPostPackageHeightMm">
              {{ info.domesticPostPackageHeightMm  }}
            </el-form-item>
            <el-form-item label="国内包装后体积（cm³）：" prop="domesticPostPackageVolumeCm3">
              {{ info.domesticPostPackageVolumeCm3  }}
            </el-form-item>
            <el-form-item label="国内包装后重量（kg）：" prop="domesticPostPackageWeightKg">
              {{ info.domesticPostPackageWeightKg  }}
            </el-form-item>
            <el-form-item label="工程物料分类：" prop="categorySpareEngineeringId">
              {{ info.categorySpareEngineeringName  }}
            </el-form-item>
            <el-form-item label="物料来源：" prop="materialSourceType">
              {{ info.materialSourceTypeLabel  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
          <div class="common-section-header">
            <h2>供应商信息</h2>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="supplierColumns"
                :data="supplierData"
                :show-toolbar="false"
                :isFocusNewRow="false"
              />
            </div>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>车型信息</h2>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="modelColumns"
                :data="modelData"
                :show-toolbar="false"
                :isFocusNewRow="false"
              />
            </div>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>替换件信息</h2>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="replacementColumns"
                :data="replacementData"
                :show-toolbar="false"
                :isFocusNewRow="false"
              />
            </div>
          </div>
        </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/sparepart/basic/sparePart/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditTable from '@/libs/components/EditTable';

export default {
  name: 'sparePartDetail',
  mixins: [permissions, commonMixins],
  components: {
    EditTable
  },
  data () {
    return {
      pageTitle: '备件主数据',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePart',
      loading: true,
      info: {},
      modelData: [], // 车型信息
      supplierData: [], // 供应商信息
      replacementData: [], // 替换件信息
      supplierColumns: [
        {
          field: 'supplierCode',
          title: '供应商代码',
          width: '30%',
        },
        {
          field: 'supplierName',
          title: '供应商名称',
          width: '70%',
        }
      ],
      modelColumns: [
        {
          field: 'vehicleYearTypeName',
          title: '车辆年型',
          width: '30%',
        },
        {
          field: 'vehicleModelName',
          title: '车型名称',
          width: '70%',
        }
      ],
      replacementColumns: [
        {
          field: 'replacementTypeLabel',
          title: '替换关系',
          width: '20%',
        },
        {
          field: 'beforePartCode',
          title: '替换前件号',
          width: '20%',
        },
        {
          field: 'beforePartName',
          title: '替换前名称',
          width: '20%',
        },
        {
          field: 'afterPartCode',
          title: '替换后件号',
          width: '20%',
        },
        {
          field: 'afterPartName',
          title: '替换后名称',
          width: '20%',
        }
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件主数据', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/sparepart/basic/sparePart/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.supplierData = res.sparePartSupplierRespList || []; // 供应商信息
        this.modelData = res.sparePartVehicleModelRespList || []; // 车型信息
        this.replacementData = res.sparePartReplacerRespList || []; // 替换件信息
      }).catch(() => {
        this.loading = false;
      });
    },
    // 跳转数模
    handleDigitalModel () {
      window.open(`https://usercenter.leapmotor.com/auth/oauth/authorize?response_type=code&client_id=ITP&redirect_uri=https://itp.leapmotor.com/?source=UC&code=HwjqYG3d4Qfw#/detailsPart?detailsPartCode=${this.info.partCode}`, '_blank');
    }
  }
};
</script>
