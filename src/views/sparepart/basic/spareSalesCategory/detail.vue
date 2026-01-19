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
            <el-form-item label="建店类型：" prop="categoryBuildTypeRespList">
              {{ info.categoryBuildTypeRespList.map(item => item.buildTypeName).join('、')  }}
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
                showPagination
                :current="procurable.current"
                :pageSize="procurable.pageSize"
                :total="procurable.total"
                @page-size-change="pageSizeChange"
                @current-page-change="currentPageChange"
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
                :columns="columns"
                :data="noTableData"
                :show-toolbar="false"
                :isFocusNewRow="false"
                showPagination
                :current="noProcurable.current"
                :pageSize="noProcurable.pageSize"
                :total="noProcurable.total"
                @page-size-change="noPageSizeChange"
                @current-page-change="noCurrentPageChange"
              />
            </div>
          </div>
        </section>
    </template>
  </div>
</template>

<script>
import { getDetail, categoryPurchaseDealer } from '@/api/sparepart/basic/spareSalesCategory/index';
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
      procurable: {
        pageSize: 10,
        total: 0,
        current: 1,
      },
      noProcurable: {
        pageSize: 10,
        total: 0,
        current: 1,
      },
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
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件营销分类', '详情']);
    this.getData();
    this.getPurchaseDealer(this.$route.query.id);
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
        this.noTableData = res.notCategoryPurchaseDealerRespList || [];
      }).catch(() => {
        this.loading = false;
      });
    },
    // 查询可采购门店数据
    async getPurchaseDealer (val, status) {
      const [status0Res, status1Res] = await Promise.all([
        categoryPurchaseDealer({ // 不可采购门店
          categorySpareId: val,
          purchaseStatus: 0,
          pageSize: this.noProcurable.pageSize,
          pageNum: this.noProcurable.current,
        }),
        categoryPurchaseDealer({ // 可采购门店
          categorySpareId: val,
          purchaseStatus: 1,
          pageSize: this.procurable.pageSize,
          pageNum: this.procurable.current,
        })
      ]);
      // 区分状态，分别存储
      this.noTableData = status0Res?.records || [];
      this.noProcurable.total = status0Res?.total || 0;
      this.tableData = status1Res?.records || [];
      this.procurable.total = status1Res?.total || 0;
    },
    pageSizeChange (pageSize) {
      this.handleSizeChange(pageSize);
    },

    noPageSizeChange (pageSize) {
      this.handleSizeChange(pageSize);
    },

    currentPageChange (current) {
      this.handleCurrentChange(current);
    },

    noCurrentPageChange (current) {
      this.handleCurrentChange(current);
    },

    // 实际的处理函数
    handleSizeChange (pageSize) {
      this.procurable.pageSize = pageSize;
      this.procurable.current = 1;
      this.getPurchaseDealer(this.$route.query.id);
    },

    handleCurrentChange (current) {
      this.procurable.current = current;
      this.getPurchaseDealer(this.$route.query.id);
    }
  }
};
</script>
