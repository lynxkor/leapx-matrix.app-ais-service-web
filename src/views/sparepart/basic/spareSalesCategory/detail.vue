<template>
  <div class="page-common-detail m-spare-sales-category-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>营销分类编码：{{ info.categoryCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="营销分类名称：" prop="categoryName">
              {{ info.categoryName  }}
            </el-form-item>
            <el-form-item label="是否启用：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
          <div class="common-section-header">
            <h2>可采购门店</h2>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="columns"
                :data="tableData"
                :show-toolbar="false"
                :isFocusNewRow="false"
              />
            </div>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>不可采购门店</h2>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="columnsNo"
                :data="noTableData"
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
import { getDetail } from '@/api/sparepart/basic/spareSalesCategory/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import EditTable from '@/libs/components/EditTable';

export default {
  name: 'spareSalesCategoryDetail',
  mixins: [permissions],
  components: {
    EditTable
  },
  data () {
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-spareSalesCategory',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP,
      tableData: [], // 可采购门店列表
      noTableData: [], // 不可采购门店列表
      columns: [ // 适配车型
        {
          field: 'dealerName',
          title: '门店名称',
          width: '25%',
        },
        {
          field: 'dealerCode',
          title: '门店编码',
          width: '25%',
        },
        {
          field: 'createTime',
          title: '添加时间',
          width: '25%',
        },
        {
          field: 'creatorName',
          title: '操作人',
          width: '25%',
        }
      ],
      columnsNo: [
        {
          field: 'buildTypeName',
          title: '门店名称',
          width: '25%',
        },
        {
          field: 'buildTypeCode',
          title: '门店编码',
          width: '25%',
        },
        {
          field: 'createTime',
          title: '添加时间',
          width: '25%',
        },
        {
          field: 'creatorName',
          title: '操作人',
          width: '25%',
        }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件营销分类', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/sparepart/basic/spareSalesCategory/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.tableData = res.categoryPurchaseDealerRespList || [];
        this.noTableData = res.categoryBuildTypeRespList || [];
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
