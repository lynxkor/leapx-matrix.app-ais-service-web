<template>
  <div class="page-common-detail m-checkout-type-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>结算类型代码：{{ info.code }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <el-form-item label="结算类型代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="结算类型名称：" prop="name">
              {{ info.name  }}
            </el-form-item>
            <el-form-item label="结算类别：" prop="category">
              {{ info.categoryLabel  }}
            </el-form-item>
            <el-form-item label="是否app展示：" prop="appShow">
              {{ info.isAppShowLabel }}
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
              {{ info.sort  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark" class="form-item-full">
              {{ info.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/checkoutType/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'checkoutTypeEdit',
  mixins: [permissions],
  components: {
  },
  data () {
    return {
      moduleKey: 'AISMC-checkoutType',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['结算类型', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/checkoutType/edit',
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
