import api from '@/axios';

const prefix = 'file/web/attachment/fileDownloadLog/';

/**
 * 分页查询文件下载日志
 * @param {Object} data - 查询参数
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}
