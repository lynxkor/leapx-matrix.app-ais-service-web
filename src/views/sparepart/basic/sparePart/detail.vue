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
          <el-form :inline="true" ref="ruleForm" label-width="180px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="备件编码：" prop="partCode">
              {{ info.partCode  }}
            </el-form-item>
            <el-form-item label="备件名称：" prop="partName">
              {{ info.partName  }}
            </el-form-item>
            <el-form-item label="最小订购量：" prop="minOrderQuantity">
              {{ info.minOrderQuantity  }}
            </el-form-item>
            <el-form-item label="销售价格：" prop="salePrice">
              {{ info.salePrice  }}
            </el-form-item>
            <el-form-item label="采购价格：" prop="purchasePrice">
              {{ info.purchasePrice  }}
            </el-form-item>
            <el-form-item label="是否OEM件：" prop="oemPart">
              {{ info.oemPartLabel  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="是否可销售：" prop="saleableIs">
              {{ info.saleableIsLabel  }}
            </el-form-item>
            <el-form-item label="是否常备库存件：" prop="standingInventoryIs">
              {{ info.standingInventoryIsLabel  }}
            </el-form-item>
            <el-form-item label="备件工程师：" prop="partsEngineer">
              {{ info.partsEngineer  }}
            </el-form-item>
            <el-form-item label="VFG：" prop="vfgId">
              {{ info.vfgId  }}
            </el-form-item>
            <el-form-item label="VRT：" prop="vrtId">
              {{ info.vrtId  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="OEM备注：" prop="oemRemark">
              {{ info.oemRemark  }}
            </el-form-item>
            <el-form-item label="拼音简码：" prop="pinyinCode">
              {{ info.pinyinCode  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerId">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ info.dealerCode  }}
            </el-form-item>
            <el-form-item label="物料分类（工程）" prop="categorySpareEngineeringId">
              {{ info.categorySpareEngineeringName  }}
            </el-form-item>
            <el-form-item label="物料分类（销售）" prop="categorySpareSalesId">
              {{ info.categorySpareSalesName  }}
            </el-form-item>
            <el-form-item label="物料分类（供应）" prop="categorySpareSupplyId">
              {{ info.categorySpareSupplyName  }}
            </el-form-item>
            <el-form-item label="营销分类：" prop="marketingType">
              {{ info.marketingType  }}
            </el-form-item>
            <el-form-item label="采购状态：" prop="purchaseType">
              {{ info.purchaseTypeLabel  }}
            </el-form-item>
            <el-form-item label="旧件返还类型：" prop="oldReturnType">
              {{ info.oldReturnTypeLabel  }}
            </el-form-item>
            <el-form-item label="物料来源：" prop="materialSourceType">
              {{ info.materialSourceTypeLabel  }}
            </el-form-item>
            <el-form-item label="是否关键件：" prop="keyPartIs">
              {{ info.keyPartIsLabel  }}
            </el-form-item>
            <el-form-item label="是否翻包：" prop="needRepackIs">
              {{ info.needRepackIsLabel  }}
            </el-form-item>
            <el-form-item label="是否可快递：" prop="expressAvailableIs">
              {{ info.expressAvailableIsLabel  }}
            </el-form-item>
            <el-form-item label="是否追溯件：" prop="traceableIs">
              {{ info.traceableIsLabel  }}
            </el-form-item>
            <el-form-item label="BO调拨：" prop="boTransferIs">
              {{ info.boTransferIsLabel  }}
            </el-form-item>
            <el-form-item label="技术是否启用：" prop="technicalIs">
              {{ info.technicalIsLabel  }}
            </el-form-item>
            <el-form-item label="保修是否拆分数量：" prop="maintenanceSplitQuantityIs">
              {{ info.maintenanceSplitQuantityIsLabel  }}
            </el-form-item>
            <el-form-item label="国内包装前重量（kg）：" prop="domesticPrePackageWeightKg">
              {{ info.domesticPrePackageWeightKg  }}
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
            <el-form-item label="国内包装后重量（kg）：" prop="domesticPostPackageWeightKg">
              {{ info.domesticPostPackageWeightKg  }}
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
            <el-form-item label="基本计量单位：" prop="baseUnit">
              {{ info.baseUnitLabel  }}
            </el-form-item>
            <el-form-item label="供应商起订量：" prop="supplierMinOrderQuantity">
              {{ info.supplierMinOrderQuantity  }}
            </el-form-item>
          </el-form>
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

export default {
  name: 'sparePartDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '备件主数据',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePart',
      loading: true,
      info: {},
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
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
