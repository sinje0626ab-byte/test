// 새로 그린 그림 목록 (src/art/<종류>/<id>.webp, tools/art-import.mjs 로 넣는다).
// 그림이 있으면 코드 그림(SVG·3D 사진) 대신 쓴다. 노드 도구(가이드·카탈로그)에선 import.meta.env 가 없어 늘 빈 목록
// (import.meta.glob 의 두 번째 인자는 문자 그대로 써야 한다)
const byId = (g) => Object.fromEntries(Object.entries(g).map(([f, url]) => [f.split('/').pop().replace(/\.\w+$/, ''), url]));

export const PAINTED = import.meta.env
  ? {
    items: byId(import.meta.glob('../art/items/*.{webp,png}', { eager: true, query: '?url', import: 'default' })),
    skills: byId(import.meta.glob('../art/skills/*.{webp,png}', { eager: true, query: '?url', import: 'default' })),
    build: byId(import.meta.glob('../art/build/*.{webp,png}', { eager: true, query: '?url', import: 'default' })),
    portraits: byId(import.meta.glob('../art/portraits/*.{webp,png}', { eager: true, query: '?url', import: 'default' })),
    ui: byId(import.meta.glob('../art/ui/*.{webp,png}', { eager: true, query: '?url', import: 'default' })),
  }
  : { items: {}, skills: {}, build: {}, portraits: {}, ui: {} };

// UI 그림 한 장 (없으면 예전 글자·기호 fallback). 크기는 CSS(.ui-ic, 기본 1.2em)
export const uiImg = (id, fallback = '', cls = '') => (PAINTED.ui[id] ? `<img class="ui-ic ${cls}" src="${PAINTED.ui[id]}" alt="" draggable="false">` : fallback);

// CSS 에서 쓰도록 모든 UI 그림을 --ui-<id> 변수로 (가상 요소 ::before 등). body.ui-art 가 붙으면 CSS 가 글자 대신 그림을 쓴다
export function installUiVars() {
  const root = document.documentElement;
  for (const [id, url] of Object.entries(PAINTED.ui)) root.style.setProperty(`--ui-${id.replace(/_/g, '-')}`, `url("${url}")`);
  if (PAINTED.ui.ic_close && PAINTED.ui.note_info) document.body.classList.add('ui-art');
}
