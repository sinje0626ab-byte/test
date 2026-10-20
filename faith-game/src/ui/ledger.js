import { world } from '../data/loader.js';
import { totalFollowers, presenceCount } from '../game/state.js';
import { faithIncome } from '../game/turn.js';
import { resistance, share } from '../religion/spread.js';
import { PRESENCE_MIN } from '../config.js';
import { CAST, CAST_ORDER, castOf, castAge, STATUS_LABEL } from '../story/cast.js';
import { mood, shadowWord } from '../story/words.js';
import { esc, people, pct, int } from './format.js';
import { flagImg } from './flags.js';
import { stamp } from './portrait.js';
import { castStatusLine } from './voice.js';
import { modal } from './toast.js';

// 교단 장부: 화면 곳곳에서 말로만 보여 주는 수치를 여기서는 숫자 그대로 보여 준다.
export function showLedger(state) {
  const rows = world.ids
    .filter((id) => state.countries[id].followers >= 1 || state.units.some((u) => u.at === id))
    .sort((a, b) => state.countries[b].followers - state.countries[a].followers);
  const m = mood(state.unity);
  modal({
    title: '교단 장부',
    subtitle: `${esc(state.religion.name || '이름 없는 모임')} · 서랍 맨 아래 칸`,
    wide: true,
    className: 'ledger-sheet',
    content: `
      <div class="ledger-sum">
        <div><small>전 세계 신도</small><b class="num">${people(totalFollowers(state))}</b></div>
        <div><small>진출 국가</small><b class="num">${presenceCount(state, PRESENCE_MIN)}</b></div>
        <div><small>신앙력 / 다음 달</small><b class="num">${int(state.faith)} <em>${faithIncome(state) >= 0 ? '+' : ''}${int(faithIncome(state))}</em></b></div>
        <div><small>결속</small><b class="num">${Math.round(state.unity)} / 100</b><em>${esc(m.text)}</em></div>
        <div><small>그림자 장부</small><b class="num">${state.riskPoints}점</b><em>${esc(shadowWord(state.riskPoints))}</em></div>
      </div>
      <h3 class="ledger-h">사람</h3>
      <div class="ledger-cast">${CAST_ORDER.map((id) => {
        const c = castOf(state, id);
        return `<div class="ledger-person ${c.status}">${stamp(id, { state, size: 34 })}
          <div><b>${esc(CAST[id].name)}</b> <small>${c.status === 'out' ? '' : `${castAge(state, id)}세 · `}${esc(CAST[id].job)}</small>
          <p>${esc(castStatusLine(state, id))}</p></div>
          <span class="ledger-status">${STATUS_LABEL[c.status]}</span></div>`;
      }).join('')}</div>
      <h3 class="ledger-h">나라별</h3>
      <div class="ledger-table-wrap"><table class="ledger-table">
        <thead><tr><th>나라</th><th>신도</th><th>비율</th><th>경계</th><th>거부감</th><th>저항</th></tr></thead>
        <tbody>${rows.map((id) => {
          const cs = state.countries[id];
          return `<tr><td>${flagImg(world.countries[id], 'flag flag-sm')}${esc(world.countries[id].name)}${cs.banned ? ' <em class="bad">금지</em>' : ''}</td>
            <td class="num">${people(cs.followers)}</td><td class="num">${pct(share(state, id))}</td>
            <td class="num ${cs.alert >= 0.5 ? 'bad' : ''}">${Math.round(cs.alert * 100)}%</td>
            <td class="num">${Math.round(cs.aversion * 100)}%</td><td class="num">${Math.round(resistance(state, id) * 100)}%</td></tr>`;
        }).join('') || '<tr><td colspan="6">아직 아무 데도 없다.</td></tr>'}</tbody>
      </table></div>
      <p class="panel-note">경계 50%면 경고장, 70%면 압수수색, 100%면 그 나라 활동 금지. 60% 아래로 내려가면 금지가 풀린다.</p>`,
  });
}
