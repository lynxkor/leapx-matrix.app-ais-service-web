<template>
    <div>
        <el-form ref="form" :model="formData" label-width="70px">
            <el-form-item label="用户名称" prop="userId">
                <fetch-select
                    v-model="formData.userId"
                    :remote-method="searchUser"
                    value-key="userId"
                    label-key="username"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请选择用户"
                    style="width: 100%;"
                    @change="handleQualityCheckerChange"
                />
            </el-form-item>
            <el-form-item label="省">
                <fetch-select
                    filterable
                    clearable
                    remote
                    multiple
                    v-model="formData.provinceList"
                    :remote-method="getProvince"
                    value-key="code"
                    label-key="name"
                />
            </el-form-item>
            <el-form-item label="市" prop="cityCode">
                <fetch-select
                    filterable
                    clearable
                    remote
                    multiple
                    v-model="formData.cityList"
                    :params="formData.cityName"
                    :remote-method="getCityList"
                    value-key="areaCode"
                    label-key="areaName"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { notificationGroupAdd } from '@/api/sparepart/notify/notificationGroup/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { cityListByName, getProvinceTree, getRigion, getUserByNameOrNo } from '@/api/common';

export default {
  props: {
    notificationGroupId: { // 采购申请单ID
      type: [String, Number],
      default: ''
    },
    notificationForm: { // 通知对象列表
      type: Array,
      default: () => {}
    }
  },
  components: { FetchSelect },
  data () {
    return {
      formData: {},
    };
  },
  watch: {
    notificationForm: {
      handler (val) {
        if (val) {
          this.formData = { ...val };
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async getCityList (params) {
      return cityListByName({ cityName: params });
    },
    // 查询所有省市区
    async getProvince (params) {
      const res = await getProvinceTree();
      let list = res || [];
      if (params && params.trim()) {
        const searchText = params.trim().toLowerCase();
        list = list.filter(item => item.name && item.name.toLowerCase().includes(searchText));
      }
      return list;
    },
    async getRegionList (params) {
      return getRigion({ orgName: params });
    },
    // 搜索用户
    async searchUser (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res || [];
      } catch (error) {
        console.error('搜索用户失败', error);
        return [];
      }
    },
    async handleSave () {
      if (this.formData.provinceList === '' || this.formData.provinceList === null) {
        this.formData.provinceList = [];
      }
      if (this.formData.cityList === '' || this.formData.cityList === null) {
        this.formData.cityList = [];
      }
      const params = {
        notificationGroupId: this.notificationGroupId,
        ...this.formData,
      };
      await notificationGroupAdd(params);
      this.$emit('submit');
    }
  }
};

</script>

<style lang="scss" scoped>
</style>
