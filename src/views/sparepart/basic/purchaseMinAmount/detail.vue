<template>
  <div class="page-common-detail m-purchase-min-amount-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>采购申请单类型：{{ info.purchaseOrderTypeLabel }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="订单类型：" prop="purchaseOrderType">
              {{ info.purchaseOrderTypeLabel  }}
            </el-form-item>
            <el-form-item label="类型:" prop="type">
              {{ info.typeLabel  }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ info.dealerCode  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="起订金额：" prop="minimumAmount">
              {{ info.minimumAmount  }}
            </el-form-item>
            <el-form-item label="生效开始日期：" prop="effectiveStartDate">
              {{ info.effectiveStartDate  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/sparepart/basic/purchaseMinAmount/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'purchaseMinAmountDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '新页面',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseMinAmount',
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
        path: '/sparepart/basic/purchaseMinAmount/edit',
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
