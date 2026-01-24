<template>
  <div class="page-common-detail m-supplier-info-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>供应商编码：{{ info.supplierCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="供应商编码：" prop="supplierCode">
              {{ info.supplierCode  }}
            </el-form-item>
            <el-form-item label="供应商名称：" prop="supplierName">
              {{ info.supplierName  }}
            </el-form-item>
            <el-form-item label="供应商简称：" prop="supplierShortName">
              {{ info.supplierShortName  }}
            </el-form-item>
            <!-- <el-form-item label="主键：" prop="id">
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
            </el-form-item> -->
            <el-form-item label="是否启用：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="拼音简码：" prop="pinyinCode">
              {{ info.pinyinCode  }}
            </el-form-item>
            <el-form-item label="供应商类型：" prop="supplierType">
              {{ info.supplierType  }}
            </el-form-item>
            <el-form-item label="是否OEM：" prop="oemFlag">
              {{ info.oemFlagLabel  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="供应商等级：" prop="supplierLevel">
              {{ info.supplierLevel  }}
            </el-form-item>
            <el-form-item label="供应商安全库存系数：" prop="supplierSafetyStock">
              {{ info.supplierSafetyStock  }}
            </el-form-item>
            <el-form-item label="国家：" prop="countryName">
              {{ info.countryCodeLabel  }}
            </el-form-item>
            <el-form-item label="省：" prop="provinceName"
            v-if="oem">
              {{ info.provinceName  }}
            </el-form-item>
            <el-form-item label="市：" prop="cityName"
            v-if="oem">
              {{ info.cityName  }}
            </el-form-item>
            <!-- <el-form-item label="区、县：" prop="districtName">
              {{ info.districtName  }}
            </el-form-item> -->
            <!-- <el-form-item label="省code：" prop="provinceCode">
              {{ info.provinceCode  }}
            </el-form-item>

            <el-form-item label="市code：" prop="cityCode">
              {{ info.cityCode  }}
            </el-form-item>

            <el-form-item label="区&#x2F;县编码：" prop="districtCode">
              {{ info.districtCode  }}
            </el-form-item>-->
            <el-form-item label="详细地址：" prop="address"
            v-if="oem">
              {{ info.address  }}
            </el-form-item>
            <el-form-item label="联系人姓名：" prop="contactName"
            v-if="oem">
              {{ info.contactName  }}
            </el-form-item>
            <el-form-item label="联系人电话：" prop="contactPhone"
            v-if="oem">
              {{ info.contactPhone  }}
            </el-form-item>
            <el-form-item label="联系人邮箱：" prop="contactEmail"
            v-if="oem">
              {{ info.contactEmail  }}
            </el-form-item>
            <el-form-item label="联系人传真：" prop="contactFax"
            v-if="oem">
              {{ info.contactFax  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/sparepart/basic/supplierInfo/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'supplierInfoDetail',
  mixins: [permissions],
  components: {
  },
  data () {
    return {
      oem: false,
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-supplierInfo',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['供应商主数据', '详情']);
    this.getData();
    this.oem = this.$store.state.pageSource?.aisPageSource.includes('AISPART-sparePart-oem');
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/sparepart/basic/supplierInfo/edit',
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
