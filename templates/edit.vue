<template>
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" size="small">
            {{{#cols}}}
            {{{#isDate}}}
              <el-form-item label="{{{description}}}：" prop="{{{key}}}">
                <el-date-picker
                  v-model="form.{{{key}}}"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
            {{{/isDate}}}
            {{{#isSelect}}}
              <el-form-item label="{{{description}}}：" prop="{{{key}}}">
                <fetch-select
                  :request="() => fetchOptions('xxx')"
                  v-model="form.{{{key}}}"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
            {{{/isSelect}}}
            {{{#isBoolean}}}
              <el-form-item label="{{{description}}}：">
                <fetch-select
                  :options="yes_no_enum"
                  v-model="form.{{{key}}}"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
            {{{/isBoolean}}}
            {{{#isNormal}}}
              <el-form-item label="{{{description}}}：" prop="{{{key}}}">
                <el-input
                  placeholder="请输入"
                  v-model="form.{{{key}}}"
                  clearable
                />
              </el-form-item>
            {{{/isNormal}}}
            {{{/cols}}}
            </el-form>
          </div>
        </section>
        <!-- <section class="common-section">
          <div class="common-section-header">
            <h2>维修工程师</h2>
            <el-button size="small" icon="el-icon-plus" @click="addEvent">添加</el-button>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <LPVxeTable
                ref="tableRef"
                :show-table-setting="false"
                :get-config="getConfig"
                v-loading="loading"
                show-index
                is-page
                :option-obj="optionObj"
              />
            </div>
          </div>
        </section> -->
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" v-loading="submitLoading">保存</el-button>
        <el-button size="small" type="primary">保存并关闭</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// import { LPVxeTable } from '@leapmotor/design';
import { getList, getDetail, addOrUpdate } from '@/api/{{{{modulePath}}}}/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  {{{#cols}}}
  {{{key}}}: '',
  {{{/cols}}}
};

export default {
  name: '{{{nameCamelCase}}}Edit',
  components: {
    // LPVxeTable,
    FetchSelect
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: {
        ...defaultForm
      },
      /*
      optionObj: {
        id: 'VehiclePartsMaintenanceTable',
        dataList: [],
        form: {
          page: 1,
          size: 20
        },
        dataProp: [
          { props: 'id', label: 'ID', width: 100, visible: true },
          { props: 'name', label: '保养方案', visible: true },
          { props: 'partsMaintenanceId', label: '保养零件代码', visible: true },
          { props: 'partsMaintenanceName', label: '保养零件名称', visible: true },
          { props: 'nextDate', label: '下次保养时间', width: 100, visible: true },
          { props: 'nextMileage', label: '下次保养里程(KM)', width: 140, visible: true },
          { props: 'nextDuemileage', label: '下次保养间隔里程(KM)', width: 170, visible: true },
          { props: 'nextDuetime', label: '下次保养间隔时间(月)', width: 160, visible: true },
          { props: 'vehicleProfileId', label: '整车档案ID', visible: true },
          { props: 'vehicleProfileName', label: '整车档案名称', visible: true },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '保存',
              // click: (rowIndex, row) => {
              //   this.$router.push({
              //     path: '/vehiclePartsMaintenance/detail',
              //     query: {
              //       id: row.id
              //     }
              //   });
              // },
              type: 'info'
            }, {
              name: '取消',
              // click: (rowIndex, row) => {
              //   this.$router.push({
              //     path: '/vehiclePartsMaintenance/add',
              //     query: {
              //       id: row.id
              //     }
              //   });
              //   // this.editInfo = row;
              //   // this.editDialogVisible = true;
              // },
              type: 'danger'
            }]
          }
        ],
        total: 0
      },
      */
      rules: {
      {{{#cols}}}
      {{{#isDate}}}
        {{{key}}}: [
          { required: true, message: '请选择{{{description}}}', trigger: 'change' }
        ],
      {{{/isDate}}}
      {{{#isSelect}}}
        {{{key}}}: [
          { required: true, message: '请选择{{{description}}}', trigger: 'change' }
        ],
      {{{/isSelect}}}
      {{{#isNormal}}}
        {{{key}}}: [
          { required: true, message: '请输入{{{description}}}', trigger: 'blur' }
        ],
      {{{/isNormal}}}
      {{{/cols}}}
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
    // this.getData();
  },
  methods: {
    getDetailData () {
      const id = this.$route.query.id;
      if (id) {
        getDetail({ id }).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          this.$store.commit('SET_ACTIVE_BREADCRUMB', ['{{{title}}}', '{{{title}}}详情']);
        });
      }
    },
    /*
    async getConfig () {
      return {};
    },
    getData () {
      this.loading = true;

      getList({ pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ id: this.info.id, ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
