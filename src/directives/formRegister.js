// directives/formRegister.js
export default {
  inserted (el, binding, vnode) {
    const { value } = binding;
    if (value.registerForm) {
      value.registerForm(vnode.componentInstance);
    }
  }
};
