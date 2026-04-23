import api from '@/axios';

const prefix = 'maintain/web/sp/spEquity/';

export function getSpEquity (data) {
  return api.jsonPost(prefix + 'get', data);
}
