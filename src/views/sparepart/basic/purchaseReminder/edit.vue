<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form inline :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="提醒类别" prop="reminderCategory">
                <el-input
                  placeholder="请输入"
                  v-model="form.reminderCategory"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否启用" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="提醒内容" prop="reminderContent">
                <el-input
                  placeholder="请输入"
                  v-model="form.reminderContent"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>零件清单</h2>
          </div>
          <div class="common-section-body">
            <div class="ais-select-group" v-if="remindId">
              <el-select
                style="width: 305px;"
                v-model="sparePartCode"
                filterable
                clearable
                remote
                placeholder="请选择"
                :remote-method="getPartByName"
                @change="handleSparePartChange"
                collapse-tags
                >
                  <el-option
                    v-for="item in partOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-button
                type="primary"
                @click="handleAddPart()"
                size="small"
              >
                添加
              </el-button>
              <el-button
                type="primary"
                @click="handleImport()"
                size="small"
              >
                导入零件
              </el-button>
            </div>
            <div class="common-section-table">
              <el-table
                :data="tableData"
                style="width: 100%"
                fit
                stripe
                highlight-current-row
              >
                <el-table-column prop="sparePartCode" label="零件编码" width="280"></el-table-column>
                <el-table-column prop="sparePartName" label="零件名称" width="280"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="280"></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-popconfirm
                      title="确认删除该门店吗？"
                      @confirm="handleDeletePart(scope.row.id)"
                    >
                      <span
                        slot="reference"
                        class="action-button btn-delete"
                      >
                        删除
                      </span>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
      <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :businessParams = "_id"
      id="purchaseReminderPartImport"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import { getDetail, addOrUpdate, getPartDetailPage, addPart, deletePart } from '@/api/sparepart/basic/purchaseReminder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, sparePartListShort } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import Upload from '@/libs/components/UploadDialog';

const defaultForm = {
  // 多选时字段有变化，自行修复
  reminderCategory: '',
  reminderContent: '',
  status: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  statusDesc: '',
  dataSource: '',
};

export default {
  name: 'purchaseReminderEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    Upload
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseReminder',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      sparePartData: [],
      partOptions: [],
      tableData: [],
      sparePartCode: '',
      remindId: null,
      uploadDialogVisible: false,
      rules: {
        reminderCategory: [
          { required: true, message: '请输入提醒类别', trigger: 'change' }
        ],
        reminderContent: [
          { required: true, message: '请输入提醒内容，最大2000字符', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
    this.partDetailPage(this.$route.query.id);
    this.remindId = this._id;
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件采购提醒设置', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.remindId = res || '';
            const id = this.$route.query.id;
            console.log('this.remindId' + this.remindId);
            if (res) {
              this.form.id = res;
              this.getDetailData();
              this.partDetailPage(res);
              return;
            }
            if (res || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
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
    // 选择零件
    getPartByName (query) {
      sparePartListShort({
        partCodeOrNameLike: query
      }).then(res => {
        this.partOptions = res?.map(item => {
          return {
            ...item,
            value: item.code,
            label: item.name
          };
        });
      });
    },
    async handleAddPart (val) {
      await addPart(this.sparePartData);
      this.partDetailPage(this._id);
      this.sparePartCode = '';
    },
    async handleDeletePart (val) {
      await deletePart([val]);
      this.partDetailPage(this._id);
    },
    handleSparePartChange (val) {
      const selectedItem = this.partOptions.find(item => item.code === val);
      this.sparePartData = {
        ...this.sparePartData,
        sparePartId: selectedItem.id,
        sparePartCode: selectedItem.code,
        sparePartName: selectedItem.name,
        purchaseReminderId: this._id
      };
    },
    async partDetailPage (val) {
      const partRes = await getPartDetailPage({
        purchaseReminderId: val
      });
      this.tableData = partRes?.records || [];
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
  }
};
</script>
