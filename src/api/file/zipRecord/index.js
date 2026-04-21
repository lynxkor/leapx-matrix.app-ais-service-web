import api from '@/axios';

const prefix = 'file/web/attachment/zipRecord/';

/**
 * 分页查询文件下载记录
 * @param {Object} data - 查询参数
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 获取下载链接
 * @param {Object} data - { zipRecordId: string }
 */
export function download (data) {
  return api.jsonPost(prefix + 'download', data);
}
