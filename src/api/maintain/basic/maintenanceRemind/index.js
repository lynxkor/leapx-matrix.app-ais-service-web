import api from '@/axios';

const prefix = 'maintain/web/basic/maintenanceRemind/';

/**
 * 重置整车保养里程和时间
 * @param {Object} data - { vin }
 */
export function resetVehicle (data) {
  return api.jsonPost(prefix + 'resetVehicle', data);
}

/**
 * 重置零件保养里程和时间
 * @param {Object} data - { vin, maintenancePartCode }
 */
export function resetPart (data) {
  return api.jsonPost(prefix + 'resetPart', data);
}
