<template>
  <div class="page-common-detail m-free-maintenance-policy-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>政策名称：{{ info.policyName }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="政策名称：" prop="policyName">
              {{ info.policyName  }}
            </el-form-item>
            <el-form-item label="维修项目代码：" prop="repairItemCode">
              {{ info.repairItemCode  }}
            </el-form-item>
            <el-form-item label="维修项目名称：" prop="repairItemName">
              {{ info.repairItemName  }}
            </el-form-item>
            <el-form-item label="政策类型（免费保养，终身免费保养）：" prop="policyType">
              {{ info.policyType  }}
            </el-form-item>
            <el-form-item label="免保时间（月）（最小为0）：" prop="freePeriod">
              {{ info.freePeriod  }}
            </el-form-item>
            <el-form-item label="里程（最小为0）：" prop="mileage">
              {{ info.mileage  }}
            </el-form-item>
            <el-form-item label="延后天数（最小为0）：" prop="delayDays">
              {{ info.delayDays  }}
            </el-form-item>
            <el-form-item label="延后里程（最小为0）：" prop="delayMileage">
              {{ info.delayMileage  }}
            </el-form-item>
            <el-form-item label="工时：" prop="workhour">
              {{ info.workhour  }}
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
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="数据来源，140:新销服; 老销服:10：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
            <el-form-item label="维修项目ID：" prop="repairItemId">
              {{ info.repairItemId  }}
            </el-form-item>
            <el-form-item label="备件：" prop="parts">
              {{ info.parts  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <!-- TIPS: 根据实际情况修改标题 -->
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
import { getDetail } from '@/api/claimreturn/claim/basic/freeMaintenancePolicy';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'freeMaintenancePolicyDetail',
  mixins: [permissions, commonMixins],
  components: {
    EditTable
  },
  data () {
    return {
      pageTitle: '新页面',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-freeMaintenancePolicy',
      loading: true,
      info: {},
      tableData: [],
      columns: [
        // TIPS: 根据实际情况修改字段名field和width
        {
          field: 'name',
          title: '姓名',
          width: '33%',
        },
        {
          field: 'age',
          title: '年龄',
          width: '33%',
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
        },
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['免费保养政策', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/claimreturn/claim/basic/freeMaintenancePolicy/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.tableData = res.list || []; // TIPS: 根据实际情况修改表格数据res.list的取值
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
