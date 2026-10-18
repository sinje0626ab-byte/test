import { interpolateRgb } from 'd3-interpolate';
import { world } from '../data/loader.js';
import { share, dominant } from '../religion/spread.js';

// 지도 색칠 모드. 새 모드(2단계: 정부 경계, 거부감 등)는 여기에 항목을 추가한다.
//   fill(state, id, theme) → CSS 색
//   legend(state, theme) → { type: 'gradient', from, to, labels } | { type: 'swatches', items }
// theme: { land, accent } — CSS 변수에서 읽은 현재 색

const VISIBLE_MIN = 50;               // 이보다 적은 나라는 지도에 칠하지 않는다
const SHARE_MIN_LOG = -5;              // 0.001%
const SHARE_MAX_LOG = Math.log10(0.5); // 50%

export function shareT(s) {
  if (s <= 0) return 0;
  return Math.max(0, Math.min(1, (Math.log10(s) - SHARE_MIN_LOG) / (SHARE_MAX_LOG - SHARE_MIN_LOG)));
}

export const COLOR_MODES = {
  ours: {
    label: '우리 종교',
    fill(state, id, theme) {
      const s = share(state, id);
      if (state.countries[id].followers < VISIBLE_MIN) return theme.land;
      return interpolateRgb(theme.land, theme.accent)(0.14 + 0.86 * shareT(s));
    },
    legend(state, theme) {
      return { type: 'gradient', from: interpolateRgb(theme.land, theme.accent)(0.14), to: theme.accent, labels: ['0.001%', '0.1%', '50%'] };
    },
  },
  dominant: {
    label: '기존 종교',
    fill(state, id, theme) {
      const d = dominant(state, id);
      const color = d.key === 'ours' ? theme.accent : world.religions[d.key].color;
      return interpolateRgb(theme.land, color)(0.45 + 0.55 * d.share);
    },
    legend(state, theme) {
      const items = world.religionOrder.map((k) => ({ color: world.religions[k].color, label: world.religions[k].name }));
      items.unshift({ color: theme.accent, label: state.religion.name });
      return { type: 'swatches', items };
    },
  },
};
