<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>方案信息</h2>
    </div>
    <div class="common-section-body" v-if="id">
      <section class="common-section">
        <enhanced-tabs
          ref="tabs"
          type="menu"
          v-model="schemeId"
          :load-params="loadParams"
          :load-data="loadData"
          :item-config="{
            valueKey: 'id',
            labelKey: 'name',
            disableCloseKey: 'disableClose',
            disableFirst: false,
          }"
          close-tip="确定删除该方案吗？"
          closeText="删除"
          @remove="onRemove"
          @add="onTabAdd"
          :menus="menus"
          @command="command"
          />
        </section>
        <section class="common-section"  v-if="canDetail && schemeId">
          <div
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
            <el-form-item v-if="!isServiceCareActivity" label="是否允许修改旧件：" prop="allowModifyOldPart">
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
            <template v-if="!isServiceCareActivity">
            <el-form-item label="主因零部件：" prop="mainPartName">
              <fetch-select
                ref="mainPartSelectRef"
                remote
                v-model="selectedPartKey"
                :remote-method="partRemote"
                :params="form.mainPartName"
                :format="formatPartOptions"
                @change="partChange"
                labelKey="displayLabel"
                valueKey="partAndSupplierId"
                filterable
              >
                <template #option="{ item }">
                  <span v-if="item.disabled">{{ item.placeholder }}</span>
                  <span v-else>{{ item.displayLabel }}</span>
                </template>
              </fetch-select>
            </el-form-item>
            <el-form-item label="主因供应商：" prop="mainSupplierId">
              <fetch-select
                ref="supplierSelect"
                :options="supplierOptions"
                v-model="form.mainSupplierId"
                placeholder="请选择"
                clearable
                filterable
                disabled
                value-key="value"
                label-key="label"
              />
            </el-form-item>
            <el-form-item label="VRT名称：" prop="vrtId">
              <fetch-select
                ref="vrtSelect"
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.vrtId"
                :remote-method="vrtRemote"
                :params="form.vrtName"
                @change="vrtChange"
                @clear="() => vrtChange()"
                value-key="id"
                label-key="vrtName"
              />
            </el-form-item>
            <el-form-item label="VFG名称：" prop="vfgId">
              <fetch-select
                ref="vfgSelect"
                filterable
                clearable
                :disabled="!form.vrtId"
                v-model="form.vfgId"
                :options="vfgOptions"
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
            </template>
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
          <el-form
            v-else
            :inline="true"
            class="form-detail"
          >
            <el-form-item label="方案名称：">
              {{ form.schemeName }}
            </el-form-item>
            <el-form-item v-if="!isServiceCareActivity" label="是否允许修改旧件：">
              {{ form.allowModifyOldPart ? '是' : '否' }}
            </el-form-item>
            <el-form-item label="是否启用：">
              {{ form.status ? '是' : '否' }}
            </el-form-item>
            <template v-if="!isServiceCareActivity">
            <el-form-item label="主因零部件：">
              {{ form.mainPartName }}
            </el-form-item>
            <el-form-item label="主因供应商：">
              {{ form.mainSupplierName }}
            </el-form-item>
            <el-form-item label="VRT名称：">
              {{ form.vrtName }}
            </el-form-item>
            <el-form-item label="VFG名称：">
              {{ form.vfgName }}
            </el-form-item>
            <el-form-item label="责任部门：">
              {{ form.responsibleDeptLabel }}
            </el-form-item>
            </template>
            <el-form-item style="width:100%" label="方案说明：">
              {{ form.description }}
            </el-form-item>
          </el-form>

          <div
            class="common-section-header"
          >
            项目零件
          </div>
          <item-info
            v-if="id && schemeId"
            :id="id"
            :moduleKey="moduleKey"
            :schemeId="schemeId"
            :isServiceCareActivity="isServiceCareActivity"
            @part-saved="onPartSaved"
          />
        </section>
        <div class="common-section-body not-commit" v-else>
          点击「+」添加方案
        </div>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
  </section>
</template>
<script>
import {
  serviceActivitySchemeCopy,
  serviceActivitySchemeDelete,
  serviceActivitySchemeGet, serviceActivitySchemeList, serviceActivitySchemeUpdate
} from '../../../../../api/claimreturn/claim/basic/serviceActivity';
import { getDetail as getSparePartDetail } from '@/api/sparepart/basic/sparePart/index';
import { getLists as sparePartList } from '../../../../../api/sparepart/basic/sparePartSupplier';
import permissions from '@/libs/mixins/permissions';
import EnhancedTabs from '@/libs/components/EnhancedTabs/index.vue';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum } from '@/api/common';
import { getList as getVrtList } from '../../../../../api/claimreturn/claim/basic/vrt';
import { getList as getVfgList } from '../../../../../api/claimreturn/claim/basic/vfg';
import ItemInfo from './ItemInfo/index.vue';

export default {
  props: {
    id: {
      type: String,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    moduleKey: {
      type: String,
      required: true,
    },
    isServiceCareActivity: {
      type: Boolean,
    },
    activityStatus: {
      type: String,
      default: '',
    }
  },
  mixins: [permissions],
  components: {
    EnhancedTabs,
    BaseInput,
    FetchSelect,
    ItemInfo,
  },
  data () {
    return {
      schemeId: '',
      selectedPartKey: '',
      form: {
        id: '',
        activityId: '',
        schemeName: '',
        allowModifyOldPart: false, // true, '1'
        status: false, // true, 1
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
        responsibleDeptLabel: ''
      },
      rules: {
        checkoutTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
        ],
        mainPartName: [
          { required: true, message: '请选择主因零部件', trigger: 'blur' }
        ]
      },
      supplierOptions: [],
      vfgOptions: [],
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
    isDraft () {
      return this.activityStatus === '0';
    },
    loadParams () {
      return {
        activityId: this.id,
      };
    }
  },
  watch: {
    schemeId: {
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
        this.schemeId = res;
      });
    },
    // 更新方案
    updatePlan (data) {
      return serviceActivitySchemeUpdate({
        ...data,
        allowModifyOldPart: data.allowModifyOldPart ? '1' : '0',
        status: data.status ? 1 : 0,
        activityId: this.id,
      });
    },
    loadData (params) {
      return serviceActivitySchemeList(params);
    },
    getDetail (id) {
      serviceActivitySchemeGet(id).then(data => {
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

        // 同步 selectedPartKey 用于 fetch-select v-model
        this.selectedPartKey = data.mainPartId && data.mainSupplierId
          ? String(data.mainPartId) + String(data.mainSupplierId)
          : data.mainPartId || '';

        // 如果有主因零部件，获取零部件详情设置供应商选项
        if (data.mainPartId) {
          sparePartList({
            id: data.mainPartId,
            pageSize: 1,
            pageNum: 1,
            status: 1
          }).then(partData => {
            const partRecord = partData?.records?.[0] || partData?.[0] || partData;
            if (partRecord?.sparePartSupplierRespList) {
              this.supplierOptions = partRecord.sparePartSupplierRespList?.map(item => {
                return {
                  label: item.supplierName,
                  value: item.supplierInfoId
                };
              }) || [];
            }
          });
        }

        // 设置 VRT 下拉组件的选项数据，确保正确显示名称
        if (data.vrtId && data.vrtName && this.$refs.vrtSelect) {
          this.$refs.vrtSelect.remoteOptions = [{
            id: data.vrtId,
            vrtName: data.vrtName
          }];
          this.$refs.vrtSelect.initialLoaded = true;
        }

        // 加载 VFG 下拉选项
        if (data.vrtId) {
          this.loadVfgOptions();
        }

        this.$emit('change', data.id);
      });
    },
    onRemove (item, index, defer) {
      const prevSchemeId = this.schemeId;
      serviceActivitySchemeDelete([item.value]).then(() => {
        this.$message.success('操作成功');
        defer.resolve();
      }).catch(() => {
        defer.reject();
        this.schemeId = prevSchemeId;
      });
    },
    // 主因零部件下拉接口
    formatPartOptions (list) {
      return list.map(item => {
        const code = item.partCode || '';
        const name = item.partName || '';
        const label = code || name ? `${code}/${name}` : (item.sparePartId || '');
        const suffix = item.supplierCode ? `-${item.supplierName || ''}-${item.supplierCode}` : '';
        return {
          ...item,
          displayLabel: label + suffix
        };
      });
    },
    partRemote (query) {
      return new Promise((resolve, reject) => {
        sparePartList({
          pageNum: 1,
          pageSize: 20,
          oemPart: 1,
          partCodeOrNameLike: query,
          status: 1,
        }).then(res => {
          if (!res?.length) {
            resolve([
              {
                placeholder: `备件编码：${query}不存在备件供应商关系信息`,
                disabled: true,
              }
            ]);
          } else {
            const records = res.map(item => {
              return {
                ...item,
                partAndSupplierId: String(item.sparePartId) + String(item.supplierInfoId),
              };
            });
            resolve(records);
          }
        });
      });
    },
    // 主因供应商列表
    async partChange (val, record) {
      // 零部件id
      if (val && record) {
        // 先清空所有 id，避免显示 id
        this.form.mainSupplierId = '';
        this.form.vrtId = '';
        this.form.vfgId = '';

        // fetch-select 只更新 id，需手动同步 name
        this.form.mainPartId = record.sparePartId || '';
        this.form.mainPartName = record.partName || '';

        // 设置供应商选项
        this.supplierOptions = record.supplierInfoId ? [{
          label: record.supplierName,
          value: record.supplierInfoId
        }] : [];

        // 获取备件详情
        const detail = await getSparePartDetail(record.sparePartId);
        const { vrtId, vrtName, vfgId, vfgName } = detail || {};

        // 设置值用于反显
        if (vrtId) {
          this.form.vrtName = vrtName || '';
          this.form.vrtId = vrtId || '';
        }
        if (vfgId) {
          this.form.vfgName = vfgName || '';
          this.form.vfgId = vfgId || '';
        }

        // 使用 nextTick 填充下拉选项数据
        this.$nextTick(() => {
          // 设置 VRT 下拉组件的选项数据
          if (vrtId && this.$refs.vrtSelect) {
            this.$refs.vrtSelect.remoteOptions = [{
              id: vrtId,
              vrtName: vrtName
            }];
            this.$refs.vrtSelect.initialLoaded = true;
          }
          // 加载 VFG 下拉选项
          if (vrtId) {
            this.loadVfgOptions().then(() => {
              if (vfgId) {
                // 确保目标 VFG 在 options 中，模糊搜索可能漏掉
                const exists = this.vfgOptions.some(o => String(o.id) === String(vfgId));
                if (!exists) {
                  this.vfgOptions.push({ id: vfgId, vfgName: vfgName || '' });
                }
              }
            });
          }

          // 选中第一个供应商
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
      } else {
        // 清空选择
        this.form.mainPartId = '';
        this.form.mainPartName = '';
        this.form.mainSupplierId = '';
        this.form.mainSupplierName = '';
        this.form.vrtId = '';
        this.form.vrtName = '';
        this.form.vfgId = '';
        this.form.vfgName = '';
        this.supplierOptions = [];
        this.updatePlan(this.form);
      }
    },
    // vrt
    vrtRemote (query) {
      return getVrtList({
        vrtNameLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    vrtChange (val, record) {
      if (val) {
        this.form.vrtName = record.vrtName;
      } else {
        this.form.vrtName = '';
        this.form.vrtId = '';
        this.form.vrtCode = '';
      }
      // 切换VRT时清除VFG
      this.form.vfgId = '';
      this.form.vfgName = '';
      this.form.vfgCode = '';
      this.vfgOptions = [];
      // 加载新VRT下的VFG选项
      if (val) {
        this.loadVfgOptions();
      }
      this.updatePlan(this.form);
    },
    // vfg
    loadVfgOptions () {
      return getVfgList({
        vrtNameLike: this.form.vrtName,
        pageSize: 100,
        pageNum: 1,
      }).then(res => {
        this.vfgOptions = res?.records || res || [];
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
    // 零件保存后刷新方案详情（后端已更新主因零部件、供应商、VRT、VFG）
    onPartSaved () {
      if (this.schemeId) {
        this.getDetail(this.schemeId);
      }
    },
    command (command, item, index) {
      console.log(command, item, index);
      switch (command) {
        case 'copy':
          serviceActivitySchemeCopy({
            id: item.value,
            activityId: this.id,
          }).then(() => {
            this.$refs.tabs.refresh();
          });
          break;
        case 'delete':
          this.$refs.tabs.onTabClose(item, index);
          break;
      }
    },
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}
</style>
