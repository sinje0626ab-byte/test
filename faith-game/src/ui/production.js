import { world } from '../data/loader.js';
import { SPAWN_MIN_FOLLOWERS } from '../config.js';
import { UNIT_TYPES, UNIT_ORDER } from '../units/unitTypes.js';
import { unitCost, spawnBlocker } from '../units/units.js';
import { esc, int, people } from './format.js';
import { rawIcon } from './icons.js';
import { modal } from './toast.js';

// 생산 시트. 생산할 때마다 onSpawn(type, at) → 결과 { ok, message }
export function openProduction(state, preferredAt, onSpawn) {
  const sites = world.ids.filter((id) => state.countries[id].followers >= SPAWN_MIN_FOLLOWERS)
    .sort((a, b) => state.countries[b].followers - state.countries[a].followers);
  let at = sites.includes(preferredAt) ? preferredAt : sites[0] ?? null;

  const m = modal({ title: '유닛 생산', subtitle: '', content: '' });
  const render = () => {
    m.el.querySelector('.sheet-head p')?.remove();
    const head = m.el.querySelector('.sheet-head > div');
    head.insertAdjacentHTML('beforeend', `<p>보유 신앙력 <b class="num" style="color:var(--label)">${int(state.faith)}</b></p>`);
    m.body.innerHTML = `
      <div class="field" style="margin-bottom:14px"><label for="prod-at">생산 위치</label>
        ${sites.length ? `<select id="prod-at" class="field-select" data-at>${sites.map((id) => `<option value="${id}" ${id === at ? 'selected' : ''}>${esc(world.countries[id].name)} · 신도 ${people(state.countries[id].followers)}명</option>`).join('')}</select>`
          : `<p class="panel-note">신도가 ${SPAWN_MIN_FOLLOWERS}명 이상인 나라가 없습니다.</p>`}
      </div>
      <div class="list">${UNIT_ORDER.map((type) => {
        const t = UNIT_TYPES[type];
        const blocker = spawnBlocker(state, type, at);
        const locked = blocker && blocker.includes('해금');
        return `<div class="prod-item ${locked ? 'is-locked' : ''}">
          <span class="unit-glyph">${rawIcon(t.icon)}</span>
          <div class="prod-text"><b>${t.name}</b><p>${esc(t.desc)}</p>${blocker && blocker !== '신앙력 부족' ? `<div class="lock">${esc(blocker)}</div>` : ''}</div>
          <button class="btn ${blocker ? 'btn-secondary' : 'btn-primary'} btn-sm prod-buy" data-buy="${type}" ${blocker ? 'disabled' : ''}><span class="faith-mark"></span><span class="num">${int(unitCost(state, type))}</span></button>
        </div>`;
      }).join('')}</div>
      <p class="panel-note">보유 유닛이 많을수록 생산 비용이 오릅니다.</p>`;
  };
  m.body.addEventListener('change', (e) => {
    if (e.target.matches('[data-at]')) { at = e.target.value; render(); }
  });
  m.body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-buy]');
    if (!b) return;
    onSpawn(b.dataset.buy, at);
    render();
  });
  render();
  return m;
}
