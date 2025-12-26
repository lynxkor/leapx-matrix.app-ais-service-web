<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>方案信息</h2>
    </div>
    <div class="common-section-body" v-if="id">
      <section class="common-section">
        <fetch-tabs
          ref="fetchTabs"
          type="menu"
          v-model="schemaId"
          :loadParams="loadParams"
          :loadData="loadData"
          :itemConfig="{
            valueKey: 'id',
            labelKey: 'name',
            disableCloseKey: 'disableClose',
            disableFirst: false,
          }"
          closeTip="确定删除该方案吗？"
          :disabled="!isEditing"
          @remove="onRemove"
          @add="onTabAdd"
          :menus="menus"
          @command="command"
          />
        </section>
        <section class="common-section">
          <div
            v-if="canAddOrUpdate"
            class="common-section-header"
          >
            基础信息
          </div>
          <el-form
            v-if="isEditing"
            :inline="true"
            :model="form"
            :rules="rules"
            ref="form"
            label-width="150px"
            class="form-edit"
            >
            <el-form-item label="方案名称：" prop="schemeName">
              <base-input
                placeholder="请输入"
                v-model="form.schemeName"
                clearable
                @blur="() => {this.updatePlan(this.form)}"
              />
            </el-form-item>
            <el-form-item label="是否允许修改旧件：" prop="allowModifyOldPart">
              <el-switch
                @change="() => {this.updatePlan(this.form)}"
                v-model="form.allowModifyOldPart">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否启用：" prop="status">
              <el-switch
                @change="() => {this.updatePlan(this.form)}"
                v-model="form.status">
              </el-switch>
            </el-form-item>
            <el-form-item label="主因零部件：" prop="mainPartName">
              <fetch-select
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.mainPartId"
                :remote-method="partRemote"
                :params="form.mainPartName"
                @change="partChange"
                value-key="id"
                label-key="partName"
              />
            </el-form-item>
            <el-form-item label="主因供应商：" prop="mainSupplierId">
              <fetch-select
                :options="supplierOptions"
                v-model="form.mainSupplierId"
                placeholder="请选择"
                clearable
                filterable
                :disabled="!form.mainPartId"
                value-key="value"
                label-key="label"
              />
            </el-form-item>
            <el-form-item label="VRT名称：" prop="vrtId">
              <fetch-select
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.vrtId"
                :remote-method="vrtRemote"
                :params="form.vrtName"
                @change="vrtChange"
                value-key="id"
                label-key="vrtName"
              />
            </el-form-item>
            <el-form-item label="VFG名称：" prop="vfgId">
              <fetch-select
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.vfgId"
                :remote-method="vfgRemote"
                :params="form.vfgName"
                @change="vfgChange"
                value-key="id"
                label-key="vfgName"
              />
            </el-form-item>
            <el-form-item label="责任部门：" prop="responsibleDept">
              <fetch-select
                :request="fetchOptions"
                enumCode="claim_responsible_dept"
                v-model="form.responsibleDept"
                placeholder="请选择"
                clearable
                filterable
                @change="() => {this.updatePlan(this.form)}"
              />
            </el-form-item>
            <el-form-item style="width:100%" label="方案说明：" prop="description">
              <base-input
                type="textarea"
                placeholder="请输入"
                v-model="form.description"
                clearable
                :rows="2"
                @blur="() => {this.updatePlan(this.form)}"
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-else>
            <el-form-item label="方案名称：">
              {{form.schemeName}}
            </el-form-item>
            <el-form-item label="是否允许修改旧件：">
              {{form.allowModifyOldPart ? '是': '否'}}
            </el-form-item>
            <el-form-item label="是否启用：">
              {{ form.status ? '是': '否'}}
            </el-form-item>
            <el-form-item label="主因零部件：">
              {{ form.mainPartName }}
            </el-form-item>
            <el-form-item label="主因供应商：">
              {{form.mainSupplierName}}
            </el-form-item>
            <el-form-item label="VRT名称：">
              {{form.vrtName}}
            </el-form-item>
            <el-form-item label="VFG名称：">
              {{ form.vfgName }}
            </el-form-item>
            <el-form-item label="责任部门：">
              {{ form.responsibleDept }}
            </el-form-item>
            <el-form-item label="方案说明：">
              {{ form.description }}
            </el-form-item>
          </el-form>
        </section>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
  </section>
</template>
<script>
import {
  techServiceActivitySchemeCopy,
  techServiceActivitySchemeDelete,
  techServiceActivitySchemeGet, techServiceActivitySchemeList, techServiceActivitySchemeUpdate
} from '../../../../../api/claimreturn/claim/basic/techServiceActivity';
import { getList as partList } from '../../../../../api/sparepart/basic/sparePart';
import { getList as sparePartList } from '../../../../../api/sparepart/basic/sparePartSupplier';
import permissions from '@/libs/mixins/permissions';
import FetchTabs from '@/libs/components/FetchTabs/index.vue';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum } from '@/api/common';
import { getList as getVrtList } from '../../../../../api/claimreturn/claim/basic/vrt';
import { getList as getVfgList } from '../../../../../api/claimreturn/claim/basic/vfg';

export default {
  props: {
    id: {
      type: String,
    },
    isEditing: {
      type: Boolean,
    }
  },
  mixins: [permissions],
  components: {
    FetchTabs,
    BaseInput,
    FetchSelect,
  },
  data () {
    return {
      moduleKey: 'AISCR-techServiceActivity',
      schemaId: '',
      form: {
        id: '',
        activityId: '',
        schemeName: '',
        allowModifyOldPart: '', // true, '1'
        status: 0, // true, 1
        mainPartId: '',
        mainPartName: '',
        mainSupplierId: '',
        mainSupplierName: '',
        vrtId: '',
        vrtName: '',
        vfgId: '',
        vfgName: '',
        responsibleDept: '',
        description: '',
      },
      rules: {
        checkoutTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
        ],
        mainPartName: [
          { required: true, message: '请选择主因零部件', trigger: 'change' }
        ]
      },
      supplierOptions: [],
      menus: [
        {
          label: '复制',
          value: 'copy',
        },
        {
          label: '删除',
          value: 'delete',
        },
      ]
    };
  },
  computed: {
    loadParams () {
      return {
        activityId: this.id,
      };
    }
  },
  watch: {
    schemaId: {
      handler (newVal) {
        if (newVal) {
          this.getDetail(newVal);
        }
      }
    },
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 方案
    onTabAdd (item, defer) {
      return this.updatePlan({
        schemeName: item.label,
        activityId: this.id,
      }).then(res => {
        defer.resolve(res);
      });
    },
    // 更新方案
    updatePlan (data) {
      return techServiceActivitySchemeUpdate({
        ...data,
        allowModifyOldPart: data.allowModifyOldPart ? '1' : '0',
        status: data.status ? 1 : 0,
      });
    },
    loadData (params) {
      return techServiceActivitySchemeList(params);
    },
    getDetail (id) {
      techServiceActivitySchemeGet(id).then(data => {
        Object.keys(this.form).forEach(key => {
          if (key === 'allowModifyOldPart') {
            if (data[key] === '1') {
              this.form[key] = true;
            } else {
              this.form[key] = false;
            }
            return;
          }
          if (key === 'status') {
            if (data[key] === 1) {
              this.form[key] = true;
            } else {
              this.form[key] = false;
            }
            return;
          }
          this.form[key] = data[key];
        });
      });
    },
    onRemove (item, index, defer) {
      techServiceActivitySchemeDelete([item.value]).then(() => {
        this.$message.success('操作成功');
      });
    },
    // 主因零部件下拉接口
    partRemote (query) {
      return partList({
        partCodeOrNameLike: query,
        pageSize: 20,
        pageNum: 1,
      }).then(res => {
        // this.form
        return res;
      });
    },
    // 主因供应商列表
    partChange (val, record) {
      // 零部件id
      if (val) {
        // this.form.vrtId = record.vrtId;
        // this.form.vfgId = record.vfgId;
        sparePartList({
          sparePartId: val,
          pageNum: 1,
          pageSize: 100,
        }).then(res => {
          this.supplierOptions = res.records.map(item => {
            return {
              label: item.supplierName,
              value: item.supplierInfoId
            };
          });
          // 选中第一个
          if (this.supplierOptions.length) {
            const item = this.supplierOptions[0];
            this.form.mainSupplierId = item.value;
            this.form.mainSupplierName = item.label;
          } else {
            this.form.mainSupplierId = '';
            this.form.mainSupplierName = '';
          }
          // 更新
          this.updatePlan(this.form);
        });
      }
      //
    },
    // vrt
    vrtRemote (query) {
      return getVrtList({
        vrtNameLike: query,
        vrtCodeLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    vrtChange (val, record) {
      if (val) {
        this.form.vrtName = record.vrtName;
      } else {
        this.form.vrtName = '';
      }
      this.updatePlan(this.form);
    },
    // vfg
    vfgRemote (query) {
      return getVfgList({
        vfgNameLike: query,
        vfgCodeLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    vfgChange (val, record) {
      if (val) {
        this.form.vfgName = record.vfgName;
      } else {
        this.form.vfgName = '';
      }
      this.updatePlan(this.form);
    },
    command (command, item, index) {
      console.log(command, item, index);
      switch (command) {
        case 'copy':
          techServiceActivitySchemeCopy({
            id: item.id,
            activityId: this.id,
          }).then(() => {
            this.$refs.fetchTabs.refresh();
          });
          break;
        case 'delete':
          this.$refs.fetchTabs.onTabClose(item, index);
          break;
      }
    },
  }
};

</script>
<style lang="scss" scoped>

</style>
