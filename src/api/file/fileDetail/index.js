import api from '@/axios';

const prefix = 'file/fileService/';

/**
 * 分页查询文件下载日志
 * @param {Object} data - 查询参数
 */
export function refreshFileAuthUrl (data) {
  return api.jsonPost(prefix + 'getAuthFileUrl', data);
}
