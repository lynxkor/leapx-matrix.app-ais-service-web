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
          <el-form :inline="true" ref="ruleForm" label-width="120px">
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
              {{ info.oemPart  }}
            </el-form-item>
            <el-form-item label="门店名称（组织名称）：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="是否可销售：" prop="saleableIs">
              {{ info.saleableIs  }}
            </el-form-item>
            <el-form-item label="是否常备库存件：" prop="standingInventoryIs">
              {{ info.standingInventoryIs  }}
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
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
              {{ info.modifierName  }}
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
            <el-form-item label="门店ID（组织ID）：" prop="dealerId">
              {{ info.dealerId  }}
            </el-form-item>
            <el-form-item label="门店编码（组织code）：" prop="dealerCode">
              {{ info.dealerCode  }}
            </el-form-item>
            <el-form-item label="物料分类（工程）ID：" prop="categorySpareEngineeringId">
              {{ info.categorySpareEngineeringId  }}
            </el-form-item>
            <el-form-item label="物料分类（销售）ID：" prop="categorySpareSalesId">
              {{ info.categorySpareSalesId  }}
            </el-form-item>
            <el-form-item label="物料分类（供应）ID：" prop="categorySpareSupplyId">
              {{ info.categorySpareSupplyId  }}
            </el-form-item>
            <el-form-item label="营销分类：" prop="marketingType">
              {{ info.marketingType  }}
            </el-form-item>
            <el-form-item label="采购状态：" prop="purchaseType">
              {{ info.purchaseType  }}
            </el-form-item>
            <el-form-item label="旧件返还类型：" prop="oldReturnType">
              {{ info.oldReturnType  }}
            </el-form-item>
            <el-form-item label="物料来源：" prop="materialSourceType">
              {{ info.materialSourceType  }}
            </el-form-item>
            <el-form-item label="是否关键件：" prop="keyPartIs">
              {{ info.keyPartIs  }}
            </el-form-item>
            <el-form-item label="是否翻包：" prop="needRepackIs">
              {{ info.needRepackIs  }}
            </el-form-item>
            <el-form-item label="是否可快递：" prop="expressAvailableIs">
              {{ info.expressAvailableIs  }}
            </el-form-item>
            <el-form-item label="是否追溯件：" prop="traceableIs">
              {{ info.traceableIs  }}
            </el-form-item>
            <el-form-item label="BO调拨 允许，禁止；默认禁止：" prop="boTransferIs">
              {{ info.boTransferIs  }}
            </el-form-item>
            <el-form-item label="技术是否启用：" prop="technicalIs">
              {{ info.technicalIs  }}
            </el-form-item>
            <el-form-item label="保修是否拆分数量：" prop="maintenanceSplitQuantityIs">
              {{ info.maintenanceSplitQuantityIs  }}
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
              {{ info.baseUnit  }}
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
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', '详情']);
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
