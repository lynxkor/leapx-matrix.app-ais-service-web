<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>添加车辆</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="200px" class="form-edit">
        <el-form-item label="VIN：" prop="vin">
          <fetch-select
            filterable
            clearable
            remote
            reserve-keyword
            v-model="form.vin"
            :remote-method="vinSearch"
            :params="form.vin"
            @change="vinChange"
            value-key="vin"
            label-key="vin"
            placeholder="输入VIN"
          />
        </el-form-item>
        <el-form-item label="变更前门店编码：" prop="beforeDealerCode">
          <el-input v-model="form.beforeDealerCode" disabled />
        </el-form-item>
        <el-form-item label="变更前门店名称：" prop="beforeDealerName">
          <el-input v-model="form.beforeDealerName" disabled />
        </el-form-item>
        <el-form-item label="是否用户修改专属服务门店：" prop="isUserChange">
          <el-input :value="form.isUserChange ? '是' : '否'" disabled />
        </el-form-item>
        <el-form-item label="销售日期：" prop="salesDate">
          <el-input v-model="form.salesDate" disabled />
        </el-form-item>
        <el-form-item label="变更后门店编码：" prop="afterDealerCode">
          <fetch-select
            :remote-method="getDealerList"
            remote
            v-model="form.afterDealerCode"
            placeholder="请输入门店编码或名称"
            labelKey="orgCode"
            valueKey="orgCode"
            subLabelKey="orgName"
            clearable
            filterable
            @change="handleDealerChange"
          />
        </el-form-item>
        <el-form-item label="变更后门店名称：" prop="afterDealerName">
          <el-input v-model="form.afterDealerName" disabled />
        </el-form-item>
        <el-form-item label="申请原因：" prop="applyReason">
          <base-input
            v-model="form.applyReason"
            type="textarea"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import BaseInput from '@/libs/components/BaseInput';
import { vehicleListFull } from '@/api/datacenter/vehicle/vehicleProfile';
import { addDetail } from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';
import { listOrgStoreInfo } from '@/api/common';
const defaultForm = {
  vin: '',
  beforeDealerCode: '',
  beforeDealerName: '',
  isUserChange: 0,
  salesDate: '',
  afterDealerCode: '',
  afterDealerName: '',
  afterDealerId: '',
  applyReason: '',
};
export default {
  name: 'AddVehicleForm',
  components: {
    FetchSelect,
    BaseInput,
  },
  props: {
    applyId: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      rules: {
        vin: [
          { required: true, message: '请选择VIN', trigger: 'change' }
        ],
      },
      submitLoading: false,
    };
  },
  methods: {
    vinSearch (query) {
      return vehicleListFull({
        searchVin: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    vinChange (val, record) {
      this.form.beforeDealerCode = record?.vehicleProfileServiceResp.serviceDealerCode;
      this.form.beforeDealerName = record?.vehicleProfileServiceResp.serviceDealerName;
      this.form.salesDate = record?.salesDate;
    },
    getDealerList (query) {
      return listOrgStoreInfo({
        name: query,
        isServiceStore: 1,
      });
    },
    handleDealerChange (val, record) {
      if (record?.orgCode && record.orgCode === this.form.beforeDealerCode) {
        this.$message.warning('变更后的门店和原门店一致，请重新选择');
        this.form.afterDealerCode = '';
        this.form.afterDealerName = '';
        this.form.afterDealerId = '';
        return;
      }
      this.form.afterDealerCode = record?.orgCode;
      this.form.afterDealerName = record?.orgName;
      this.form.afterDealerId = record?.orgId;
    },
    handleCancel () {
      this.resetForm();
      this.$emit('cancel');
    },
    onAddSave () {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (!valid) {
            reject(new Error('验证失败'));
            return;
          }
          this.submitLoading = true;
          addDetail({
            ...this.form,
            applyId: this.applyId,
          }).then((res) => {
            this.$message.success('添加成功');
            this.resetForm();
            resolve(res);
          }).catch((err) => {
            reject(err);
          }).finally(() => {
            this.submitLoading = false;
          });
        });
      });
    },
    resetForm () {
      this.$refs.ruleForm?.resetFields();
      this.form = { ...defaultForm };
    },
  },
};
</script>
