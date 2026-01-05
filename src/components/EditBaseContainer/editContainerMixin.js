
export default {
  data () {
    return {
      isEditing: false,
    };
  },
  created () {
  },
  mounted () {
  },
  methods: {
    baseMixinEdit () {
      this.isEditing = true;
    },
    baseMixinCancel (formRefs) {
      for (let formRef of formRefs) {
        formRef.clearValidate();
      }
      this.isEditing = false;
      this.baseMixinRefresh();
    },
    baseMixinRefresh () {
      if (this.originalForm && this.form) {
        this.form = JSON.parse(JSON.stringify(this.originalForm));
      }
    },
    baseMixinReset () {
      if (this.form && this.defaultForm) {
        this.form = JSON.parse(JSON.stringify(this.defaultForm));
      }
    },
  }
};
