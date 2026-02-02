module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    __webpack_public_path__: 'writeable', // 声明为全局可写变量
    localStorage: 'writeable',
    sessionStorage: 'writeable'
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'space-before-function-paren': ['error', 'always'], // 函数定义时括号前后必须要有空格
    'eol-last': ['error', 'always'], // 文件最后必须有一个换行符
    'no-extra-semi': 0, // 不允许有多余冒号，比如var x = 5;;
    semi: ['error', 'always'], // 语句后必须有分号
    eqeqeq: ['error', 'always'], // 必须使用全等
    // "no-undef": 0, // 不可以有未定义的变量

    // 警告
    'no-extra-parens': 1, // 非必要的括号
    'no-empty': 1, // 块语句中的内容不能为空
    'no-use-before-define': [1, 'nofunc'], // 未定义前不能使用
    'no-unused-vars': 1, // 不能有声明后未被使用的变量或参数

    // 错误
    'comma-dangle': [2, 'only-multiline'],
    'no-debugger': 2, // 禁止使用debugger
    'no-constant-condition': 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    'no-dupe-args': 2, // 函数参数不能重复
    'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-duplicate-case': 2, // switch中的case标签不能重复
    'no-empty-character-class': 2, // 正则表达式中的[]内容不能为空
    'no-invalid-regexp': 2, // 禁止无效的正则表达式
    'no-func-assign': 2, // 禁止重复的函数声明
    'valid-typeof': 2, // 必须使用合法的typeof的值
    'no-unreachable': 2, // 不能有无法执行的代码
    'no-unexpected-multiline': 2, // 避免多行表达式
    'no-sparse-arrays': 2, // 禁止稀疏数组， 如：[1,,2]
    'no-shadow-restricted-names': 2, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
    'no-global-assign': 2, // 不能重写native对象，比如window,Object等
    requireReturnType: 0,
    // 代码风格
    // "no-else-return": 1, // 如果if语句里面有return,后面不能跟else语句
    'no-multi-spaces': 1, // 不能用多余的空格，例如：var a ==    1;
    'key-spacing': [1, { // 对象字面量中冒号的前后空格
      beforeColon: false, // 对象键和冒号之间不允许存在空格
      afterColon: true // 冒号和值之间必须要有一个空格
    }],
    'block-scoped-var': 2, // 禁止块中的变量在外部使用
    'accessor-pairs': 0, // 允许在对象中使用getter/setter
    'dot-location': ['error', 'property'], // 对象访问符的位置，换行的时候在行首
    'no-lone-blocks': 2, // 禁止不必要的嵌套块
    'no-labels': 2, // 禁止标签声明,比如：break label;
    'no-extend-native': 2, // 禁止扩展native对象
    'no-floating-decimal': 2, // 禁止省略浮点数中的0 .5 3.
    'no-loop-func': 2, // 禁止在循环中使用函数（不形成闭包则可以使用）
    'no-new-func': 2, // 禁止使用new Function创建函数
    'no-self-compare': 2, // 不能比较自身
    'no-sequences': 2, // 禁止使用逗号运算符，如var a = (3, 5)，但是如果是序列表达式中是可以允许的，比如for (var a = 0, j = 0; i < 10; i++, j--) {}
    'no-throw-literal': 2, // 禁止抛出字面量错误 throw "error"，可以使用throw Error('error').
    'no-redeclare': [2, { // 禁止重复声明变量
      builtinGlobals: true
    }],
    'prefer-const': 'off', // 允许使用let
    'no-unused-expressions': [2, { // 禁止无用的表达式
      allowShortCircuit: true,
      allowTernary: true
    }],
    'no-useless-call': 2, // 禁止不必要的call和apply
    'no-useless-concat': 2,
    'no-void': 2, // 禁用void操作符
    'no-with': 2, // 禁用with
    'space-infix-ops': 2, // 中缀操作符周围要不要有空格
    'no-warning-comments': [2, { // 不能有警告备注
      terms: ['todo', 'fixme', 'any other term'],
      location: 'anywhere'
    }],
    camelcase: 0,
    'no-tabs': 0, // 禁用 tab
    'no-mixed-spaces-and-tabs': 0, // 禁止空格和 tab 的混合缩进
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-v-bind-sync': 'off',
    'vue/no-deprecated-v-on-native-modifier': 'off'
  }
};
