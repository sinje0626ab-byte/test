// 선 아이콘 (24×24)
const PATHS = {
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  menu: '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5S9.5 6.1 12 3.5Z"/>',
  rise: '<path d="M4 17 10 11l3.5 3.5L20 8"/><path d="M15 8h5v5"/>',
  flag: '<path d="M5 21V4.5M5 4.5c4-2 7 2 11 0v9c-4 2-7-2-11 0"/>',
  alert: '<path d="M12 4 21 19.5H3L12 4Z"/><path d="M12 10v4M12 17v.01"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.5a2.4 2.4 0 1 1 3.3 2.2c-.6.3-1 .9-1 1.6v.4M12 16.8v.01"/>',
  build: '<path d="M12 4v16M4 12h16"/>',
  people: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5"/><circle cx="16.5" cy="9.5" r="2.4"/><path d="M15.5 14.2c2.3.2 4.1 1.9 4.6 4.8"/>',
};

export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name] ?? ''}</svg>`;
export const rawIcon = (inner, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;

// 시작 화면 표지: 한 점에서 퍼져 나가는 동심원
export const MARK = `<svg class="title-mark" viewBox="0 0 84 84" aria-hidden="true">
  <circle cx="42" cy="42" r="40" fill="none" stroke="var(--accent)" stroke-opacity=".14" stroke-width="1.5"/>
  <circle cx="42" cy="42" r="28" fill="none" stroke="var(--accent)" stroke-opacity=".3" stroke-width="1.5"/>
  <circle cx="42" cy="42" r="16" fill="none" stroke="var(--accent)" stroke-opacity=".55" stroke-width="1.5"/>
  <circle cx="42" cy="42" r="6" fill="var(--accent)"/>
</svg>`;
