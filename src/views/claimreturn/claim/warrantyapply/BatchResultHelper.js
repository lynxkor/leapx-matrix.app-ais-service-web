/**
 * 批量操作结果处理帮助函数
 *
 * 用于「批量审批同意 / 批量审批驳回 / 批量审批拒赔 / 批量审核撤回 / 批量申请驳回」
 * 等场景。后端响应形状：
 *   { failedCount: number, failedIds: string[] }
 *
 * 用法（在 Dialog 的 submit() 的 .then(res => {...}) 中）：
 *   import { notifyBatchResult } from '../BatchResultHelper';
 *   notifyBatchResult(this, res, '同意');
 */

/**
 * 汇总批量操作结果并提示用户
 *
 * @param {Vue} vm 当前组件实例（用于访问 this.$message / this.$alert / this.$msgbox）
 * @param {{ failedCount?: number, failedIds?: string[] }} res 后端响应
 * @param {string} actionLabel 操作名称，如"同意 / 驳回 / 拒赔 / 撤回 / 申请驳回"
 * @returns {{ allSuccess: boolean, total: number, successCount: number, failedCount: number, failedIds: string[] }}
 */
export function notifyBatchResult (vm, res, actionLabel) {
  const failedIds = Array.isArray(res?.failedIds) ? res.failedIds : [];
  const failedCount = Number(res?.failedCount ?? failedIds.length) || 0;

  // 注意：total 这里无法从响应直接获取，调用方需要传入或基于入参 ids 推算。
  // 本函数按"已知失败数"维度做提示，成功数由前端配合入参推算。
  if (failedCount === 0) {
    vm.$message.success(`${actionLabel}成功！`);
    return { allSuccess: true, failedCount: 0, failedIds: [] };
  }

  // 有失败明细 → 用 warning 提示 + 询问是否查看明细
  vm.$message.warning(`${actionLabel}部分失败，失败 ${failedCount} 条`);

  // 用 $msgbox.confirm 提供"查看失败明细"入口；用户取消也不影响后续刷新
  try {
    vm.$msgbox({
      title: `${actionLabel}结果`,
      message: buildFailureDetailMessage(failedIds, actionLabel),
      dangerouslyUseHTMLString: true,
      confirmButtonText: '复制失败ID',
      cancelButtonText: '关闭',
      showCancelButton: true,
      customClass: 'batch-result-msgbox',
    })
      .then(() => copyFailedIds(vm, failedIds))
      .catch(() => { /* 用户关闭，无操作 */ });
  } catch (e) {
    // $msgbox 不存在或异常时降级为 $alert
    vm.$alert(buildFailureDetailMessage(failedIds, actionLabel), `${actionLabel}结果`, {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '复制失败ID',
      customClass: 'batch-result-msgbox',
    }).then(() => copyFailedIds(vm, failedIds)).catch(() => {});
  }

  return { allSuccess: false, failedCount, failedIds };
}

/**
 * 构造失败明细 HTML（限长，最多展示 100 条，超过给提示）
 */
function buildFailureDetailMessage (failedIds, actionLabel) {
  const MAX = 100;
  const list = failedIds.slice(0, MAX);
  const items = list.map(id => `<div class="batch-failed-id">${escapeHtml(id)}</div>`).join('');
  const overflow = failedIds.length > MAX
    ? `<div class="batch-failed-overflow">…等共 ${failedIds.length} 条（仅展示前 ${MAX} 条）</div>`
    : '';
  return `
    <div class="batch-result-detail">
      <div class="batch-result-summary">${actionLabel}失败 ${failedIds.length} 条，失败单据 ID 如下：</div>
      <div class="batch-result-list">${items || '<div class="batch-failed-id">无</div>'}${overflow}</div>
    </div>
  `;
}

/**
 * HTML 转义，防止 ID 中存在特殊字符破坏结构
 */
function escapeHtml (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 复制失败 ID 到剪贴板
 */
function copyFailedIds (vm, failedIds) {
  const text = (failedIds || []).join('\n');
  if (!text) {
    vm.$message.info('无失败ID可复制');
    return;
  }
  // 优先使用 Clipboard API；降级使用 execCommand
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => vm.$message.success(`已复制 ${failedIds.length} 条失败ID`))
      .catch(() => fallbackCopy(vm, text, failedIds.length));
  } else {
    fallbackCopy(vm, text, failedIds.length);
  }
}

function fallbackCopy (vm, text, count) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    vm.$message.success(`已复制 ${count} 条失败ID`);
  } catch (e) {
    vm.$message.error('复制失败，请手动选择');
  }
}
