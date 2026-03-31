<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>故障名称</h2>
    </div>
    <div class="common-section-body" v-if="id">
      <section class="common-section">
        <ccc-search
          @update="addData"
          :isAdd="true"
        />
      </section>
      <section class="common-section"  v-if="canAddOrUpdate">
        <fault-table
          :moduleKey="moduleKey"
          ref="faultTable"
          :id="id"
          />
      </section>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
  </section>
</template>
<script>

import {
  serviceActivityFaultUpdate
} from '@/api/claimreturn/claim/basic/serviceActivity';
import permissions from '@/libs/mixins/permissions';
import { getEnum } from '@/api/common';
import FaultTable from './FaultTable.vue';
import CccSearch from '@/components/CccSearch/index.vue';

export default {
  props: {
    id: {
      type: String,
    },
    isEditing: {
      type: Boolean,
      default: true,
    },
    moduleKey: {
      type: String,
      required: true,
    }
  },
  mixins: [permissions],
  components: {
    FaultTable,
    CccSearch,
  },
  data () {
    return {
      ccc: '',
      selectRef: null,
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
  },
  methods: {
    onSelectRef (el) {
      this.selectRef = el;
    },
    getData () {
      this.$refs.faultTable.getDetailPageApi();
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    addData ({ data }) {
      // 新增
      serviceActivityFaultUpdate({
        cccId: data.id,
        activityId: this.id,
      }).then(res => {
        this.getData();
      });
    }
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}

</style>
