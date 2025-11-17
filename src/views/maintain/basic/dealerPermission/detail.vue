<!--
 * @Author: P2500465 P2500465@leapmotor.com
 * @Date: 2025-11-17 09:41:02
 * @LastEditors: P2500465 P2500465@leapmotor.com
 * @LastEditTime: 2025-11-17 11:03:30
 * @FilePath: \app-ais-aftersale-front\src\views\maintain\basic\dealerPermission\detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="page-common-detail m-dealer-permission-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>建店类型代码：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit" icon="el-icon-edit">编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <el-form-item label="建店类型代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="权限类型：" prop="permissionType">
              {{ info.permissionType  }}
            </el-form-item>
            <el-form-item label="结算类型名称：" prop="checkoutTypeName">
              {{ info.checkoutTypeName  }}
            </el-form-item>
            <el-form-item label="建店类型：" prop="dealerType">
              {{ info.dealerType  }}
            </el-form-item>
            <el-form-item label="保修类型名称：" prop="repairItemTypeName">
              {{ info.repairItemTypeName  }}
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
import { getDetail } from '@/api/maintain/basic/dealerPermission/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'dealerPermissionDetail',
  components: {
  },
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店施工单权限管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/dealerPermission/edit',
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
