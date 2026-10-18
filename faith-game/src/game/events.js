// 아주 작은 이벤트 버스. 게임 로직은 화면을 모르고, 화면은 여기서 소식을 듣는다.
//   'change'   — 상태가 바뀜 (다시 그리기)
//   'notify'   — { title, body, tone }
//   'stage'    — { from, to }
//   'turn'     — 턴 보고서
//   'gameover' — { result: 'victory' | 'defeat' }
const handlers = new Map();

export function on(type, fn) {
  if (!handlers.has(type)) handlers.set(type, new Set());
  handlers.get(type).add(fn);
  return () => handlers.get(type).delete(fn);
}

export function emit(type, payload) {
  for (const fn of handlers.get(type) ?? []) fn(payload);
}
