// 작은 DOM 도우미
export const $ui = () => document.getElementById('ui');

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

// 화면 하나 띄우기 (같은 id 는 바꿔 끼운다)
export function mount(id, el) {
  unmount(id);
  el.dataset.id = id;
  $ui().append(el);
  return el;
}
export function unmount(id) {
  $ui().querySelector(`[data-id="${id}"]`)?.remove();
}
export const isOpen = (id) => !!$ui().querySelector(`[data-id="${id}"]`);

export const won = (n) => `${Math.round(n).toLocaleString('ko-KR')}원`;
