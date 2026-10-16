/**
 * 批量操作结果处理帮助函数
 *
 * 用于「批量审批同意 / 批量审批驳回 / 批量审批拒赔 / 批量审核撤回 / 批量申请驳回」
 * 以及「追溯单批量审核下发 / 追溯单批量作废」等场景。后端响应形状：
 *   { failedCount: number, failedIds: string[], failedApplyNos?: string[], failedTraceCodes?: string[] }
 *   （failedApplyNos 为失败单申请单号、failedTraceCodes 为失败追溯单号，均与 failedIds 同序；
 *     旧版本后端未返回时回退展示 failedIds）
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
  // 展示单号优先级：申请单号（保修单场景）→ 追溯单号（追溯单场景）→ ID 兜底
  const displayNos = (Array.isArray(res?.failedApplyNos) && res.failedApplyNos.length)
    ? res.failedApplyNos
    : (Array.isArray(res?.failedTraceCodes) && res.failedTraceCodes.length)
      ? res.failedTraceCodes
      : failedIds;
  const failedCount = Number(res?.failedCount ?? failedIds.length) || 0;
  // 单号标签按后端实际返回的单号类型自动判定（申请单号/追溯单号/单号兜底）
  const noLabel = (Array.isArray(res?.failedApplyNos) && res.failedApplyNos.length)
    ? '申请单号'
    : (Array.isArray(res?.failedTraceCodes) && res.failedTraceCodes.length)
      ? '追溯单号'
      : '单号';

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
      message: buildFailureDetailMessage(displayNos, actionLabel, noLabel),
      dangerouslyUseHTMLString: true,
      confirmButtonText: '复制单号',
      cancelButtonText: '关闭',
      showCancelButton: true,
      customClass: 'batch-result-msgbox',
    })
      .then(() => copyFailedNos(vm, displayNos))
      .catch(() => { /* 用户关闭，无操作 */ });
  } catch (e) {
    // $msgbox 不存在或异常时降级为 $alert
    vm.$alert(buildFailureDetailMessage(displayNos, actionLabel, noLabel), `${actionLabel}结果`, {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '复制单号',
      customClass: 'batch-result-msgbox',
    }).then(() => copyFailedNos(vm, displayNos)).catch(() => {});
  }

  return { allSuccess: false, failedCount, failedIds };
}

/**
 * 构造失败明细 HTML（限长，最多展示 100 条，超过给提示）
 *
 * @param {string[]} displayList 展示列表——后端返回的失败单号（申请单号/追溯单号，与 failedIds 同序；
 *   后端未返回时由调用方回退为 failedIds）
 * @param {string} noLabel 单号类型标签（申请单号/追溯单号/单号）
 */
function buildFailureDetailMessage (displayList, actionLabel, noLabel) {
  const MAX = 100;
  const list = displayList.slice(0, MAX);
  const items = list.map(no => `<div class="batch-failed-id">${escapeHtml(no)}</div>`).join('');
  const overflow = displayList.length > MAX
    ? `<div class="batch-failed-overflow">…等共 ${displayList.length} 条（仅展示前 ${MAX} 条）</div>`
    : '';
  return `
    <div class="batch-result-detail">
      <div class="batch-result-summary">${actionLabel}失败 ${displayList.length} 条，失败单据（${noLabel}）如下：</div>
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
 * 复制失败单号到剪贴板
 */
function copyFailedNos (vm, nos, noLabel) {
  const label = noLabel || '单号';
  const text = (nos || []).join('\n');
  if (!text) {
    vm.$message.info(`无${label}可复制`);
    return;
  }
  // 优先使用 Clipboard API；降级使用 execCommand
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => vm.$message.success(`已复制 ${nos.length} 条${label}`))
      .catch(() => fallbackCopy(vm, text, nos.length, label));
  } else {
    fallbackCopy(vm, text, nos.length, label);
  }
}

function fallbackCopy (vm, text, count, noLabel) {
  const label = noLabel || '单号';
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    vm.$message.success(`已复制 ${count} 条${label}`);
  } catch (e) {
    vm.$message.error('复制失败，请手动选择');
  }
}
