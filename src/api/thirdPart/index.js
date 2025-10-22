import api from '@/axios';

/**
 * 外链api
 * @export
 * @returns
 */
export function getOutLink (url) {
  return api.post(url);
};
