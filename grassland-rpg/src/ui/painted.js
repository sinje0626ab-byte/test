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
