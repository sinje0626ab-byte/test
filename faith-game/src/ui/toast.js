import { icon } from './icons.js';
import { esc } from './format.js';

// 위에서 내려오는 알림 배너
let host;
// key가 같은 배너가 떠 있으면 그것을 바꿔 끼운다
export function toast({ title, body = '', tone = 'info', iconName = 'rise', duration = 3600, key = null }) {
  host ??= Object.assign(document.body.appendChild(document.createElement('div')), { className: 'toasts' });
  const el = document.createElement('div');
  el.className = `toast glass tone-${tone}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `<div class="toast-mark">${icon(iconName)}</div><div><b>${esc(title)}</b>${body ? `<span>${esc(body)}</span>` : ''}</div>`;
  const prev = key && host.querySelector(`[data-key="${key}"]`);
  if (key) el.dataset.key = key;
  if (prev) { prev.replaceWith(el); el.style.animationName = 'none'; }
  if (!prev) host.appendChild(el);
  while (host.children.length > 3) host.firstChild.remove();
  const leave = () => { el.style.animationName = ''; el.classList.add('is-leaving'); setTimeout(() => el.remove(), 300); };
  const t = setTimeout(leave, duration);
  el.addEventListener('click', () => { clearTimeout(t); leave(); });
}

// 모달 시트. content는 HTML 문자열, actions는 [{ label, kind, onClick, close=true }]
// 돌려받은 객체로 닫거나 본문 요소에 접근한다.
export function modal({ title = '', subtitle = '', content = '', actions = [], wide = false, dismissable = true, className = '', onClose }) {
  const overlay = document.createElement('div');
  overlay.className = `overlay ${className}`;
  overlay.innerHTML = `
    <div class="sheet ${wide ? 'sheet-wide' : ''}" role="dialog" aria-modal="true" ${title ? `aria-label="${esc(title)}"` : ''}>
      ${title ? `<div class="sheet-head"><div><h2>${esc(title)}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>
        ${dismissable ? `<button class="icon-btn panel-close" data-close aria-label="닫기">${icon('close')}</button>` : ''}</div>` : ''}
      <div class="sheet-body">${content}</div>
      ${actions.length ? `<div class="sheet-foot">${actions.map((a, i) => `<button class="btn btn-${a.kind ?? 'secondary'}" data-action="${i}">${esc(a.label)}</button>`).join('')}</div>` : ''}
    </div>`;
  document.body.appendChild(overlay);
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKey);
    overlay.classList.add('is-leaving');
    setTimeout(() => overlay.remove(), 250);
    onClose?.();
  };
  const onKey = (e) => { if (e.key === 'Escape' && dismissable) close(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && dismissable) return close();
    if (e.target.closest('[data-close]')) return close();
    const btn = e.target.closest('[data-action]');
    if (btn) {
      const a = actions[Number(btn.dataset.action)];
      a.onClick?.();
      if (a.close !== false) close();
    }
  });
  return { el: overlay, body: overlay.querySelector('.sheet-body'), close };
}

export function confirmModal({ title, text, confirmLabel = '확인', onConfirm, danger = false }) {
  return modal({
    title,
    content: `<p class="modal-text" style="margin-top:0">${esc(text)}</p>`,
    actions: [{ label: '취소' }, { label: confirmLabel, kind: danger ? 'primary danger' : 'primary', onClick: onConfirm }],
  });
}
