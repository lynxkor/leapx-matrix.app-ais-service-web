<template>
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
              <el-form-item label="价格设置代码" prop="priceCode">
                <el-input
                  placeholder="自动生成"
                  v-model="form.priceCode"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="门店名称" prop="dealerName">
                <InputLink
                  v-model="form.dealerName"
                  :link="`/partner/channelManagement/shopBasicsMessageDetails?num=2&id=${form.dealerId}&_blank=true`"
                  placeholder="请输入"
                  readonly
                />
              </el-form-item>
              <el-form-item label="工时单价" prop="workhourPrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.workhourPrice"
                  type="number"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>特殊价格</h2>
            <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="columns"
                :data="tableData"
                :defaultNewRow="defaultNewRow"
                :show-toolbar="false"
                :options="options"
                :delTitle="delTitle"
                :auth="{edit: canAddOrUpdate, delete: canDelete}"
              />
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button> -->
        <el-button size="small" @click="handleBack">取消</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerWorkhourPriceSetting/index';
import EditTable from '@/libs/components/EditTable';
import { getEnum, listVehicleYearTypeFull } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import InputLink from '@/libs/components/InputLink';

const defaultForm = {
  // 多选时字段有变化，自行修复
  priceCode: '',
  dealerName: '',
  dealerCode: '',
  workhourPrice: '',
};

export default {
  name: 'dealerWorkhourPriceSettingEdit',
  mixins: [routeGuard, permissions],
  components: {
    EditTable,
    InputLink
  },
  data () {
    const form = this.getDefautlForm();
    return {
      moduleKey: 'AISMC-dealerWorkhourPriceSetting',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: {
        ...form,
        dealerName: this.$store.state.user.userInfo.orgPostUserList.find(item => item.position === '1')?.orgName,
      },
      originalForm: { ...form },
      defaultNewRow: {
        vehicleModelName: '',
        workhourPrice: null,
        createTime: '',
      },
      tableData: [],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
        vehicleModelName: []
      },
      delTitle: '此操作将删除此 特殊价格信息，您无法撤消此操作，是否继续？',
      columns: [
        {
          field: 'vehicleModelName',
          title: '基本车型',
          width: '27%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择基本车型',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '基本车型不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'workhourPrice',
          title: '工时单价',
          editable: true,
          width: '27%',
          editRender: { name: 'ElInput', props: { type: 'number' } },
          rules: [
            { required: true, message: '工时单价不能为空', trigger: 'blur' },
          ]
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '27%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        priceCode: [
          { required: false, message: '请输入价格设置代码', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        workhourPrice: [
          { required: true, message: '请输入工时单价', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                callback();
                return;
              }

              // 检查是否为数字
              if (isNaN(Number(value))) {
                callback(new Error('请输入有效的数字'));
                return;
              }

              // 检查小数位数
              const strValue = value.toString();
              if (strValue.includes('.')) {
                const decimalPart = strValue.split('.')[1];
                if (decimalPart.length > 2) {
                  callback(new Error('最多只能输入两位小数'));
                  return;
                }
              }

              callback();
            },
            trigger: 'blur'
          }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['工时价格设置管理', `${id ? '编辑' : '新增'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
          this.tableData = res.modelWorkhourPriceRespList || [];
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        // 判断是否编辑数据 是的话删除详情接口所带的字段数组 modelWorkhourPriceRespList
        if (this.$route.query.id) {
          this.$delete(this.form, 'modelWorkhourPriceRespList');
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            addOrUpdate({ ...this.form, modelWorkhourPriceList: tableData }).then(res => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              const id = this.$route.query.id;
              if (rest || !id) {
                this.resetForm(formName);
              } else {
                this.getDetailData();
              }
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        ownerId: userInfo.userId,
        ownerName: userInfo.userName,
        dealerName: userInfo.orgPostUserList.find(item => item.position === '1')?.orgName,
      };
    },
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
    // },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 车型名称远程搜索
    querySearchAsync (queryString, cb) {
      listVehicleYearTypeFull({ modelNameLike: queryString, status: 1 }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.modelName,
            vehicleModelName: item.modelName,
            vehicleModelId: item.id,
          };
        }) || [];
        this.options.vehicleModelName = list;
      });
    },
  }
};
</script>
