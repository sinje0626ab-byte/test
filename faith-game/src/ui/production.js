import { world } from '../data/loader.js';
import { SPAWN_MIN_FOLLOWERS } from '../config.js';
import { UNIT_TYPES, UNIT_ORDER } from '../units/unitTypes.js';
import { unitCost, spawnBlocker, unitCap } from '../units/units.js';
import { esc, int, people } from './format.js';
import { rawIcon } from './icons.js';
import { modal } from './toast.js';
import { unitAffinity } from '../religion/culture.js';

// 생산 시트. 생산할 때마다 onSpawn(type, at) → 결과 { ok, message }
export function openProduction(state, preferredAt, onSpawn) {
  const sites = world.ids.filter((id) => state.countries[id].followers >= SPAWN_MIN_FOLLOWERS && !state.countries[id].banned)
    .sort((a, b) => state.countries[b].followers - state.countries[a].followers);
  let at = sites.includes(preferredAt) ? preferredAt : sites[0] ?? null;

  const m = modal({ title: '사람 모으기', subtitle: '', content: '', className: 'production-sheet' });
  const render = () => {
    m.el.querySelector('.sheet-head p')?.remove();
    const head = m.el.querySelector('.sheet-head > div');
    head.insertAdjacentHTML('beforeend', `<p>금고 <b class="num">${int(state.faith)}</b> · 정원 <b class="num">${state.units.length}/${unitCap(state)}</b></p>`);
    m.body.innerHTML = `
      <div class="field" style="margin-bottom:14px"><label for="prod-at">어디서 모을까</label>
        ${sites.length ? `<select id="prod-at" class="field-select" data-at>${sites.map((id) => `<option value="${id}" ${id === at ? 'selected' : ''}>${esc(world.countries[id].name)} · 신도 ${people(state.countries[id].followers)}명</option>`).join('')}</select>`
          : `<p class="panel-note">신도가 ${SPAWN_MIN_FOLLOWERS}명 넘는 나라가 아직 없다.</p>`}
      </div>
      <div class="list">${UNIT_ORDER.map((type) => {
        const t = UNIT_TYPES[type];
        const blocker = spawnBlocker(state, type, at);
        const locked = blocker && blocker.includes('해금');
        const f = at ? unitAffinity(at, type) : 1;
        const fit = f > 1.05 ? '<span class="badge fit good">여기선 잘 통함</span>' : f < 0.95 ? '<span class="badge fit bad">여기선 안 통함</span>' : '';
        return `<div class="prod-item ${locked ? 'is-locked' : ''}">
          <span class="unit-glyph">${rawIcon(t.icon)}</span>
          <div class="prod-text"><b>${t.name}</b>${fit}<p>${esc(t.desc)}</p>${blocker && blocker !== '신앙력이 모자란다' ? `<div class="lock">${esc(blocker)}</div>` : ''}</div>
          <button class="btn ${blocker ? 'btn-secondary' : 'btn-primary'} btn-sm prod-buy" data-buy="${type}" ${blocker ? 'disabled' : ''}><span class="faith-mark"></span><span class="num">${int(unitCost(state, type, at))}</span></button>
        </div>`;
      }).join('')}</div>
      <p class="panel-note">사람이 많을수록, 교단이 클수록 한 명 모으는 데 돈이 더 든다. 정원은 교단이 커질 때마다 늘어난다.</p>`;
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
