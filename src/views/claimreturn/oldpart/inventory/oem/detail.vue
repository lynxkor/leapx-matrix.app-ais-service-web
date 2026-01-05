<template>
  <div class="page-common-detail m-oem-inventory-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>旧件唯一码：{{ info.oldPartUniqueCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="保修月份：" prop="warrantyMonth">
              {{ info.warrantyMonth  }}
            </el-form-item>
            <el-form-item label="旧件唯一码：" prop="oldPartUniqueCode">
              {{ info.oldPartUniqueCode  }}
            </el-form-item>
            <el-form-item label="接车施工单：" prop="serviceProxyNo">
              {{ info.serviceProxyNo  }}
            </el-form-item>
            <el-form-item label="保修申请单编码：" prop="warrantyNo">
              {{ info.warrantyNo  }}
            </el-form-item>
            <el-form-item label="旧件销毁单编码：" prop="oldPartDestroyOrderNo">
              {{ info.oldPartDestroyOrderNo  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="是否主因零部件：" prop="isMainPart">
              {{ info.isMainPartLabel  }}
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              <LPEncrypted
                :value.sync="info.vin"
                :decryptMethod="() => getDetailDecryptField(info.id, 'vin')"
              />
            </el-form-item>
            <el-form-item label="旧件供应商：" prop="oldPartSupplierName">
              {{ info.oldPartSupplierName  }}
            </el-form-item>
            <el-form-item label="主因件供应商：" prop="mainPartSupplierName">
              {{ info.mainPartSupplierName  }}
            </el-form-item>
            <el-form-item label="责任供应商：" prop="dutySupplierName">
              {{ info.dutySupplierName  }}
            </el-form-item>
            <el-form-item label="旧件编码：" prop="oldPartCode">
              {{ info.oldPartCode  }}
            </el-form-item>
            <el-form-item label="旧件名称：" prop="oldPartName">
              {{ info.oldPartName  }}
            </el-form-item>
            <el-form-item label="换上零件编码：" prop="partCode">
              {{ info.partCode  }}
            </el-form-item>
            <el-form-item label="换上零件名称：" prop="partName">
              {{ info.partName  }}
            </el-form-item>
            <el-form-item label="主机厂库存状态：" prop="oemStatus">
              {{ info.oemStatusLabel  }}
            </el-form-item>
            <el-form-item label="门店入库时间：" prop="dealerInTime">
              {{ info.dealerInTime  }}
            </el-form-item>
            <el-form-item label="门店出库时间：" prop="dealerOutTime">
              {{ info.dealerOutTime  }}
            </el-form-item>
            <el-form-item label="门店回运单：" prop="returnOrderNo">
              {{ info.returnOrderNo  }}
            </el-form-item>
            <el-form-item label="主机厂入库时间：" prop="oemInTime">
              {{ info.oemInTime  }}
            </el-form-item>
            <el-form-item label="主机厂验收时间：" prop="oemCheckTime">
              {{ info.oemCheckTime  }}
            </el-form-item>
            <el-form-item label="主机厂出库单编码：" prop="oemOutboundOrderNo">
              {{ info.oemOutboundOrderNo  }}
            </el-form-item>
            <el-form-item label="主机厂出库时间：" prop="oemOutTime">
              {{ info.oemOutTime  }}
            </el-form-item>
            <el-form-item label="旧件返还类型：" prop="returnType">
              {{ info.returnTypeLabel  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="销毁驳回原因：" prop="destroyRejectReason">
              {{ info.destroyRejectReason  }}
            </el-form-item>
            <el-form-item label="验收备注：" prop="checkRemark">
              {{ info.checkRemark  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="审批通过时间（保修申请单）：" prop="warrantyApproveTime">
              {{ info.warrantyApproveTime  }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ info.dealerCode  }}
            </el-form-item>
            <el-form-item label="门店库存状态：" prop="dealerStatus">
              {{ info.dealerStatusLabel  }}
            </el-form-item>
            <el-form-item label="责任供应商(二次索赔明细)：" prop="dutySupplierId">
              {{ info.dutySupplierId  }}
            </el-form-item>
            <el-form-item label="责任供应商编码：" prop="dutySupplierCode">
              {{ info.dutySupplierCode  }}
            </el-form-item>
            <el-form-item label="不合格编码：" prop="unqualifiedCode">
              {{ info.unqualifiedCode  }}
            </el-form-item>
            <el-form-item label="不合格描述：" prop="unqualifiedDesc">
              {{ info.unqualifiedDesc  }}
            </el-form-item>
            <el-form-item label="是否连带出库：" prop="isAssociatedOut">
              {{ info.isAssociatedOutLabel  }}
            </el-form-item>
            <el-form-item label="仓库编码：" prop="oemWarehouseCode">
              {{ info.oemWarehouseCode  }}
            </el-form-item>
            <el-form-item label="仓库名称：" prop="oemWarehouseName">
              {{ info.oemWarehouseName  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail, getDetailDecryptField } from '@/api/claimreturn/oldpart/inventory/oem';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import LPEncrypted from '@/libs/components/LPEncrypted/index.vue';

export default {
  name: 'oemInventoryDetail',
  mixins: [permissions, commonMixins],
  components: {
    LPEncrypted
  },
  data () {
    return {
      pageTitle: '主机厂旧件库存',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-oldPartOemInventoryDetail',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['主机厂旧件库存', '详情']);
    this.getData();
  },
  methods: {
    getDetailDecryptField,
    handleEdit () {
      this.$router.push({
        path: '/claimreturn/oldpart/oemInventory/edit',
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
