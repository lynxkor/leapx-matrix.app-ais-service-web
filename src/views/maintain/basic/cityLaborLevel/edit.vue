<template>
  <edit-page-layout ref="editLayout" :title="pageTitleComputed" showPaneFooter @save="handleSaveClick"
    @cancel="handleCancelClick">
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest">
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="行政区域名称：" prop="areaName">
                  <fetch-select :request="getAreaList" v-model="form.areaName" placeholder="请选择" clearable filterable
                    remote value-key="name" label-key="name" @change="handleAreaChange" />
                </el-form-item>
                <el-form-item label="行政区域代码：" prop="areaCode">
                  <el-input placeholder="请输入" v-model="form.areaCode" clearable disabled />
                </el-form-item>
                <el-form-item label="行政区域级别：" prop="areaLevel">
                  <el-input placeholder="请输入" v-model="form.areaLevel" clearable disabled />
                </el-form-item>
                <el-form-item label="父级代码：" prop="parentId">
                  <el-input placeholder="请输入" v-model="form.parentId" clearable disabled />
                </el-form-item>
                <el-form-item label="父级行政区名称：" prop="parentName">
                  <el-input placeholder="请输入" v-model="form.parentName" clearable disabled />
                </el-form-item>
                <el-form-item label="城市工时等级：" prop="laborLevel">
                  <fetch-select :options="laborLevelEnum" v-model="form.laborLevel" placeholder="请选择" clearable
                    filterable value-key="code" label-key="message" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="行政区域名称：" prop="areaName">
                  {{ form.areaName }}
                </el-form-item>
                <el-form-item label="行政区域代码：" prop="areaCode">
                  {{ form.areaCode }}
                </el-form-item>
                <el-form-item label="行政区域级别：" prop="areaLevel">
                  {{ form.areaLevel }}
                </el-form-item>
                <el-form-item label="父级代码：" prop="parentId">
                  {{ form.parentId }}
                </el-form-item>
                <el-form-item label="父级行政区名称：" prop="parentName">
                  {{ form.parentName }}
                </el-form-item>
                <el-form-item label="城市工时等级：" prop="laborLevel">
                  {{ getLaborLevelLabel(form.laborLevel) }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status === 1 ? '可用' : '停用' }}
                </el-form-item>
              </el-form>
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/cityLaborLevel/index';
import { getAreaTree } from '@/api/user';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1, // 默认可用状态
  statusDesc: '',
  areaCode: '',
  areaName: '',
  areaLevel: '',
  parentId: '',
  parentName: '',
  laborLevel: '',
  createTime: '',
};

export default {
  name: 'cityLaborLevelEdit',
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
    _id() {
      return this.id || this.$route.query.id || this.form.id;
    },
    pageTitleComputed() {
      if (this._id) {
        return '城市工时等级详情';
      } else {
        return '新增城市工时等级';
      }
    }
  },
  watch: {
    id: {
      handler(val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data() {
    const form = this.getDefautlForm();
    return {
      pageTitle: '城市工时等级配置表管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-cityLaborLevel',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      areaOptions: [], // 行政区域选项数据
      laborLevelEnum: [ // 城市工时等级枚举
        { code: '1', message: '一类' },
        { code: '2', message: '二类' },
        { code: '3', message: '三类' },
        { code: '4', message: '四类' },
        { code: '5', message: '五类' }
      ],
      rules: {
        areaName: [
          { required: true, message: '请选择行政区名称', trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '请输入行政区代码', trigger: 'change' }
        ],
        areaLevel: [
          { required: true, message: '请输入行政区域级别', trigger: 'change' }
        ],
        laborLevel: [
          { required: false, message: '请选择城市工时等级', trigger: 'change' }
        ],
      }
    };
  },
  mounted() {
    this.loadAreaTree();
  },
  methods: {
    // 加载行政区域树数据
    async loadAreaTree() {
      try {
        const res = await getAreaTree();
        this.areaOptions = res || [];
      } catch (error) {
        console.error('Failed to load area tree:', error);
      }
    },
    // 获取行政区域列表（用于下拉框搜索）
    async getAreaList(params) {
      try {
        // 从 areaTree 中过滤数据
        const searchKey = typeof params === 'string' ? params : '';
        const result = this.filterAreaTree(this.areaOptions, searchKey);
        return result;
      } catch (error) {
        console.error('Error fetching area list:', error);
        return [];
      }
    },
    // 递归过滤行政区域树
    filterAreaTree(tree, keyword) {
      let result = [];
      for (const node of tree) {
        if (!keyword || node.name.includes(keyword) || node.code.includes(keyword)) {
          result.push({ ...node });
        }
        if (node.child && node.child.length > 0) {
          const childResult = this.filterAreaTree(node.child, keyword);
          result = result.concat(childResult);
        }
      }
      return result;
    },
    // 行政区域选择变化时，自动填充相关字段
    handleAreaChange(val, record) {
      if (record) {
        this.form.areaCode = record.code;
        this.form.areaLevel = this.getAreaLevelLabel(record.level);
        this.form.parentId = record.parentCode || '';
        this.form.parentName = record.parentName || '';
      }
    },
    // 根据行政区域级别代码返回标签
    getAreaLevelLabel(level) {
      const levelMap = {
        1: '省',
        2: '市',
        3: '区县'
      };
      return levelMap[level] || '';
    },
    detailRequest() {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest() {
      // 校验必填项
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // 检查行政区域代码是否重复
            this.checkAreaCodeDuplicate().then(isDuplicate => {
              if (isDuplicate) {
                this.$message.error('该行政区域代码已存在，请勿重复添加');
                reject(new Error('行政区域代码重复'));
                return;
              }
              // 设置默认状态为可用
              this.form.status = 1;
              // 格式化创建时间为年月日时分
              this.form.createTime = this.formatDateTime(new Date());

              addOrUpdate({ ...this.form }).then(res => {
                this.$message.success('城市工时等级新增成功');
                resolve(res);
              }).catch(error => {
                reject(error);
              });
            });
          } else {
            this.$message.error('请填写必填项');
            reject(new Error('表单验证失败'));
          }
        });
      });
    },
    // 检查行政区域代码是否重复
    async checkAreaCodeDuplicate() {
      // TODO: 需要调用后端接口检查行政区域代码是否重复
      // 这里是示例代码，实际需要根据后端接口实现
      // const res = await checkAreaCode({ areaCode: this.form.areaCode });
      // return res && res.count > 0;
      return false; // 暂时返回 false，表示不重复
    },
    // 格式化日期时间为 yyyy-MM-dd HH:mm
    formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    // 处理保存按钮点击
    handleSaveClick() {
      this.submitRequest();
    },
    // 处理取消按钮点击
    handleCancelClick() {
      // 关闭侧边栏
      this.$refs.editLayout.closePane();
      // 如果有 id，说明是编辑模式，需要返回列表页
      if (this._id) {
        this.$router.push({ name: 'cityLaborLevel' });
      }
    },
    // 打开侧边栏
    openPane() {
      this.$refs.editLayout.openPane();
    },
    // 获取城市工时等级标签
    getLaborLevelLabel(value) {
      const item = this.laborLevelEnum.find(item => item.code === value);
      return item ? item.message : '';
    },
    // 删除子表数据
    handleDeleteRow(index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData(queryString) {
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
    handleAddTableData(val, record) {
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
    getDefautlForm() {
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
    async fetchOptions(code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
