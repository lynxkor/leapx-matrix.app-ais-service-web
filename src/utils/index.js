import CryptoJS from 'crypto-js';

// 零小跑
const key = CryptoJS.enc.Hex.parse('d86d7bab3d6ac01ad9dc6a897652f2d2');// Hex编码格式的密钥
const schema = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
};

// 用户中心
const UCKey = CryptoJS.enc.Utf8.parse('uuu1234567890bbb');// Hex编码格式的密钥
const UCSchema = {
  iv: CryptoJS.enc.Utf8.parse('uuu1234567890hhh'),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
};

/**
 * 过滤参数
 * @export
 * @param {*} params
 * @returns
 */
export function paramsFilter (params) {
  const obj = {};
  for (var key in params) {
    if (params[key] || params[key] === null) {
      obj[key] = params[key];
    } else if (params[key] === 0) {
      obj[key] = params[key];
    };
  };
  return obj;
};

// 加密-用户中心
export function encryptUC (word) {
  if (typeof word === 'object') {
    try {
      word = JSON.stringify(word);
    } catch (error) {
      console.error(error);
    }
  }

  let hexword = CryptoJS.enc.Utf8.parse(word);// 被加密的对象
  let encrypted = CryptoJS.AES.encrypt(hexword, UCKey, UCSchema);// 加密
  return encrypted.toString();
  // return encrypted;
}

// 解密-用户中心
export function decryptUC (word) {
  let decryptd = CryptoJS.AES.decrypt(word, UCKey, UCSchema);// 解密
  return CryptoJS.enc.Utf8.stringify(decryptd).toString();
}

// 加密
export function encrypt (word) {
  if (typeof word === 'object') {
    try {
      word = JSON.stringify(word);
    } catch (error) {
      console.log('encrypt error', error);
    }
  }

  let hexword = CryptoJS.enc.Utf8.parse(word);// 被加密的对象
  let encrypted = CryptoJS.AES.encrypt(hexword, key, schema);// 加密
  return encrypted.toString();
  // return encrypted;
}

// 解密
export function decrypt (word) {
  let decryptd = CryptoJS.AES.decrypt(word, key, schema);// 解密
  // return CryptoJS.enc.Hex.stringify(decrypt).toString();
  // console.log(CryptoJS.enc.Utf8.stringify(decryptd).toString(), 'decrypt');
  return JSON.parse(CryptoJS.enc.Utf8.stringify(decryptd).toString());
}

/**
 * 时间格式化
 * @export
 * @param {*} val
 * @param {*} type 日期类型，data：年月日，datatime：年月日时分秒, time:时分秒
 * @returns
 */
export function formatDateTime (val, type) {
  var date = '';
  if (val) {
    date = new Date(val);
  } else {
    date = new Date();
  };
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return type === 'data' ? Y + '-' + M + '-' + D : type === 'time' ? h + ':' + m + ':' + s : Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
};

// 递归获取资源路径
export function getSourceUrl (options, arr = []) {
  for (let i = 0; i < options.length; i++) {
    if (options[i].resourceUri) {
      arr.push(options[i].resourceUri);
    }
    // arr.push(options[i].resourceUri);
    if (options[i].children || options[i].children.length > 0) {
      getSourceUrl(options[i].children, arr);
    }
  }
};

// 递归获取资源树,兼容老版本
export function recursionSource (options, arr = []) {
  for (let i = 0; i < options.length; i++) {
    arr.push(options[i].resourceTag);
    if (options[i].children || options[i].children.length > 0) {
      recursionSource(options[i].children, arr);
    }
  }
};

/**
 * 创建防抖搜索函数
 * 该函数返回一个防抖的搜索函数，用于处理搜索输入，避免频繁触发搜索请求
 *
 * @param {Object} options - 配置选项
 * @param {number} [options.delay=300] - 防抖延迟时间，单位毫秒，默认300ms
 * @param {number} [options.minLength=2] - 最小搜索词长度，默认2个字符
 * @param {Array} [options.emptyQueryResult=[]] - 空查询或错误时返回的结果，默认空数组
 * @param {Function} [options.onError] - 错误处理回调函数，可选
 * @returns {Function} 返回一个防抖搜索函数，该函数接受三个参数：searchFn, query, callback
 *
 * @example
 */
export function createDebouncedSearch (options = {}) {
  const {
    delay = 300,
    minLength = 2,
    emptyQueryResult = [],
    onError
  } = options;

  return async function (searchFn, query, callback) {
    // 如果查询词过短，直接返回空结果
    if (query !== '' && query.length < minLength) {
      callback(emptyQueryResult);
      return;
    }

    // 清除之前的定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(async () => {
      this.searchLoading = true;
      try {
        const res = await searchFn(query);
        if (res) {
          callback(res);
        } else {
          callback(emptyQueryResult);
        }
      } catch (error) {
        callback(emptyQueryResult);
        if (onError) {
          onError(error);
        } else {
          this.$message.error('搜索失败');
        }
      } finally {
        this.searchLoading = false;
      }
    }, delay);
  };
};
