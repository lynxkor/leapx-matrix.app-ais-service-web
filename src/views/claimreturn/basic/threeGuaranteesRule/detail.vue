<template>
  <div class="page-common-detail m-three-guarantees-rule-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>三包规则编码：{{ info.ruleCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="三包规则编码：" prop="ruleCode">
              {{ info.ruleCode  }}
            </el-form-item>
            <el-form-item label="判断依据：" prop="judgmentBasis">
              {{ info.judgmentBasis  }}
            </el-form-item>
            <el-form-item label="判断单位（次数，天数）：" prop="determineUnit">
              {{ info.determineUnit  }}
            </el-form-item>
            <el-form-item label="累计方式（单一零件，任意零件）：" prop="accumulation">
              {{ info.accumulation  }}
            </el-form-item>
            <el-form-item label="车辆属性（家用，营运，B级车，J级车，J1级车，专车，报废灭失）：" prop="vehicleProperty">
              {{ info.vehicleProperty  }}
            </el-form-item>
            <el-form-item label="销售开始日期：" prop="saleStartDate">
              {{ info.saleStartDate  }}
            </el-form-item>
            <el-form-item label="销售结束日期：" prop="saleEndDate">
              {{ info.saleEndDate  }}
            </el-form-item>
            <el-form-item label="预警车龄起：" prop="warningVehicleAgeFrom">
              {{ info.warningVehicleAgeFrom  }}
            </el-form-item>
            <el-form-item label="预警车龄止：" prop="warningVehicleAgeTo">
              {{ info.warningVehicleAgeTo  }}
            </el-form-item>
            <el-form-item label="预警里程起：" prop="warningMileageFrom">
              {{ info.warningMileageFrom  }}
            </el-form-item>
            <el-form-item label="预警里程止：" prop="warningMileageTo">
              {{ info.warningMileageTo  }}
            </el-form-item>
            <el-form-item label="绿色预警区间1：" prop="greenWarning1">
              {{ info.greenWarning1  }}
            </el-form-item>
            <el-form-item label="绿色预警区间2：" prop="greenWarning2">
              {{ info.greenWarning2  }}
            </el-form-item>
            <el-form-item label="黄色预警区间2：" prop="yellowWarning2">
              {{ info.yellowWarning2  }}
            </el-form-item>
            <el-form-item label="黄色预警区间1：" prop="yellowWarning1">
              {{ info.yellowWarning1  }}
            </el-form-item>
            <el-form-item label="红色预警区间1：" prop="redWarning1">
              {{ info.redWarning1  }}
            </el-form-item>
            <el-form-item label="红色预警区间2：" prop="redWarning2">
              {{ info.redWarning2  }}
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
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="数据来源，140:新销服; 老销服:10：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
            <el-form-item label="警示条款：" prop="reminderItem">
              {{ info.reminderItem  }}
            </el-form-item>
            <el-form-item label="警示内容：" prop="reminderContent">
              {{ info.reminderContent  }}
            </el-form-item>
            <el-form-item label="预警内容：" prop="warningContent">
              {{ info.warningContent  }}
            </el-form-item>
            <el-form-item label="明细：" prop="details">
              {{ info.details  }}
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
import { getDetail } from '@/api/claimreturn/basic/threeGuaranteesRule/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'threeGuaranteesRuleDetail',
  mixins: [permissions, commonMixins],
  components: {
    EditTable
  },
  data () {
    return {
      pageTitle: '三包配置规则',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-threeGuaranteesRule',
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
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['三包配置规则', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/claimreturn/basic/threeGuaranteesRule/edit',
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
