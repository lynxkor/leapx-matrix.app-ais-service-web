import api from '@/axios';

const prefix = '/accountService/desensitizeFieldMapping/';

export function page (data) {
  return api.jsonPost(prefix + 'page', data);
}

export function findById (id) {
  return api.get(prefix + 'findById', { id });
}

export function add (data) {
  return api.jsonPost(prefix + 'add', data);
}

export function update (data) {
  return api.put(prefix + 'update', data);
}

export function updateStatus (data) {
  return api.put(prefix + 'updateStatus', data);
}
