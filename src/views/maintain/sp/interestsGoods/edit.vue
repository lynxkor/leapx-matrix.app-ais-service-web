<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="权益商品代码：" prop="commodityCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.commodityCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益商品名称：" prop="commodityName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.commodityName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="服务权益类型：" prop="serviceInterestsType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="InterestsGoodsServiceInterestsTypeEnum"
                    v-model="form.serviceInterestsType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="购买后有效期（月）：" prop="datePurchase">
                  <el-input
                    placeholder="请输入"
                    v-model="form.datePurchase"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否上架" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.whetherShelf"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="note">
                  <el-input
                    placeholder="请输入"
                    v-model="form.note"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="权益商品代码：" prop="commodityCode">
                  {{ form.commodityCode }}
                </el-form-item>
                <el-form-item label="权益商品名称：" prop="commodityName">
                  {{ form.commodityName }}
                </el-form-item>
                <el-form-item label="服务权益类型：" prop="serviceInterestsType">
                  {{ form.serviceInterestsTypeLabel }}
                </el-form-item>
                <el-form-item label="购买后有效期（月）：" prop="datePurchase">
                  {{ form.datePurchase }}
                </el-form-item>
                <el-form-item label="索赔项目工时费用（总）：" prop="claimItemAmount">
                  {{ form.claimItemAmount }}
                </el-form-item>
                <el-form-item label="索赔备件费用（总）：" prop="claimPartsAmount">
                  {{ form.claimPartsAmount }}
                </el-form-item>
                <el-form-item label="索赔费用（总）：" prop="claimOtherAmount">
                  {{ form.claimOtherAmount }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="是否上架：" prop="whetherShelf">
                  {{ form.whetherShelfLabel }}
                </el-form-item>
                <el-form-item label="上架时间：" prop="shelfTime">
                  {{ form.shelfTime }}
                </el-form-item>
                <el-form-item label="上架人员：" prop="systemUserName">
                  {{ form.systemUserName }}
                </el-form-item>
                <el-form-item label="下架时间：" prop="frameTime">
                  {{ form.frameTime }}
                </el-form-item>
                <el-form-item label="下架人员：" prop="helvesPerUserName">
                  {{ form.helvesPerUserName }}
                </el-form-item>
                <el-form-item label="备注：" prop="note">
                  {{ form.note }}
                </el-form-item>
                <!-- <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item> -->
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/sp/interestsGoods/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import api from '@/axios';

const defaultForm = {
  // 多选时字段有变化，自行修复
  commodityCode: '',
  commodityName: '',
  serviceInterestsType: '',
  classificationGoodsName: '',
  datePurchase: '',
  status: '',
  claimItemAmount: '',
  claimPartsAmount: '',
  claimOtherAmount: '',
  note: '',
  modifierName: '',
  updateTime: '',
  creator: '',
  creatorName: '',
  createTime: '',
  id: '',
  modifier: '',
  remark: '',
  statusDesc: '',
  code: '',
  classificationGoodsId: '',
  whetherShelf: '',
  shelfTime: '',
  systemUserId: '',
  systemUserName: '',
  frameTime: '',
  helvesPerUserId: '',
  helvesPerUserName: '',
};

export default {
  name: 'interestsGoodsEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '权益商品代码：' + this.form.commodityCode;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '权益商品管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-interestsGoods',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        commodityCode: [
          { required: true, message: '请输入权益商品代码', trigger: 'change' }
        ],
        commodityName: [
          { required: true, message: '请输入权益商品名称', trigger: 'change' }
        ],
        serviceInterestsType: [
          { required: true, message: '请选择服务权益类型', trigger: 'change' }
        ],
        classificationGoodsName: [
          { required: true, message: '请输入权益商品分类', trigger: 'change' }
        ],
        datePurchase: [
          { required: true, message: '请输入购买后有效期（月）', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        claimItemAmount: [
          { required: true, message: '请输入索赔项目工时费用（总）', trigger: 'change' }
        ],
        claimPartsAmount: [
          { required: true, message: '请输入索赔备件费用（总）', trigger: 'change' }
        ],
        claimOtherAmount: [
          { required: true, message: '请输入索赔费用（总）', trigger: 'change' }
        ],
        note: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'change' }
        ],
        classificationGoodsId: [
          { required: true, message: '请输入权益商品分类id', trigger: 'change' }
        ],
        whetherShelf: [
          { required: true, message: '请输入是否上架', trigger: 'change' }
        ],
        shelfTime: [
          { required: true, message: '请选择上架时间', trigger: 'change' }
        ],
        systemUserId: [
          { required: true, message: '请输入上架人员', trigger: 'change' }
        ],
        systemUserName: [
          { required: true, message: '请输入上架人员', trigger: 'change' }
        ],
        frameTime: [
          { required: true, message: '请选择下架时间', trigger: 'change' }
        ],
        helvesPerUserId: [
          { required: true, message: '请输入下架人员', trigger: 'change' }
        ],
        helvesPerUserName: [
          { required: true, message: '请输入下架人员', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getClassificationGoods () {
      return api.jsonPost('/maintain/web/sp/classificationGoods/list', {});
    },
    listClassificationGoodsChange (val, all) {
      this.form.classificationGoodsId = all.id;
      this.form.classificationGoodsName = all.classificationName;
    }
  }
};
</script>
