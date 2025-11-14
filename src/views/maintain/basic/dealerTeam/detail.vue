<template>
  <div class="page-common-detail m-dealer-team-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>班组代码：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit" icon="el-icon-edit">编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="100px">
            <el-form-item label="班组代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="班组名称：" prop="name">
              {{ info.name  }}
            </el-form-item>
            <el-form-item label="班组类型：" prop="teamType">
              {{ info.teamType  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="负责人姓名：" prop="ownerName">
              {{ info.ownerName  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>标题</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="tableData"
              :show-toolbar="false"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/dealerTeam/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import EditTable from '@/libs/components/EditTable';
export default {
  name: 'dealerTeamEdit',
  components: {
    EditTable
  },
  data () {
    return {
      loading: true,
      info: {},
      tableData: [],
      columns: [
        {
          field: 'userName',
          title: '姓名',
          width: '33%',
        },
        {
          field: 'userId',
          title: '工号',
          width: '33%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '33%',
        },
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['厅店班组信息管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/dealerTeam/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.tableData = res.userRelations || []; // 根据实际情况修改
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
