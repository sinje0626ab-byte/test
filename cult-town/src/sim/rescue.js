// 1단계 구제 (28장 A-3): 1단계에선 게임 오버 대신 첫 신도·엄마·통장님이 한 번씩 손을 내민다. 대가는 빚·의심으로 남는다.
// 2단계부터는 구제가 없다 (빚 갚기만 이어진다). endDay 가 부른다: 월세날 payRent 앞 → rescueRent, checkOver 앞 → rescueBeforeOver.
import { RESCUE, SANCTUARY, RUMOR } from '../config.js';
import { RESCUE_TEXT } from '../data/rescue.js';
import { rentNow } from './space.js';
import { addMoney, clamp } from './leader.js';
import { memberCount, activeCast } from './faith.js';
import { goalOf, difficultyOf } from './goals.js';

const won = (n) => `${Math.round(n).toLocaleString('ko-KR')}원`;
const fillT = (t, o) => t.replace('{돈}', o.돈 ?? '').replace('{n}', o.n ?? '');

// 월세날: 지난 빚 갚기 → (1단계) 신도가 모자라면 친구 → (1단계) 돈이 모자라면 엄마 대출
export function rescueRent(s) {
  const out = [];
  s.debt ??= 0;
  if (s.debt > 0) {
    if (s.leader.money - s.debt >= (s.phase === 1 ? 0 : rentNow(s)) || s.phase >= 2) {
      const pay = Math.min(s.debt, Math.max(0, s.leader.money));
      addMoney(s, -pay);
      s.debt -= pay;
      out.push({ type: 'rescue', kind: 'repay', text: fillT(s.debt > 0 ? RESCUE_TEXT.repayShort : RESCUE_TEXT.repay, { 돈: won(s.debt > 0 ? s.debt : pay) }) });
    } else out.push({ type: 'rescue', kind: 'repay', text: fillT(RESCUE_TEXT.repayShort, { 돈: won(s.debt) }) });
  }
  if (s.phase !== 1) return out;
  s.rescue ??= {};
  // 신도가 조금 모자라면 친구가 동기들을 데려온다 (한 번)
  const gap = goalOf(s, 1).members - memberCount(s);
  if (gap > 0 && gap <= difficultyOf(s).rescueGap && !s.rescue.friends) {
    s.rescue.friends = s.day;
    s.followers += gap;
    const cost = gap * RESCUE.friendCost;
    s.debt += cost;
    for (const c of activeCast(s)) s.cast[c].sus = clamp(s.cast[c].sus + RESCUE.castSus);
    out.push({ type: 'rescue', kind: 'friends', n: gap, text: fillT(RESCUE_TEXT.friends, { n: gap, 돈: won(cost) }) });
  }
  // 돈이 모자라면 엄마가 빌려준다 (1단계 동안 매달)
  const rent = rentNow(s);
  if (s.leader.money < rent) {
    const lend = rent - s.leader.money;
    addMoney(s, lend);
    s.debt += lend;
    s.rescue.loans = (s.rescue.loans ?? 0) + 1;
    out.push({ type: 'rescue', kind: 'momLoan', text: fillT(RESCUE_TEXT.momLoan, { 돈: won(lend) }) });
  }
  return out;
}

// 하루 끝 checkOver 앞: 1단계에선 평판 바닥·신도 0 을 막는다 (몇 번이든, 대가는 그때마다)
export function rescueBeforeOver(s) {
  const out = [];
  if (s.phase !== 1) return out;
  s.rescue ??= {};
  if (s.rep <= RUMOR.silentAt) {
    s.rescue.tong = (s.rescue.tong ?? 0) + 1;
    s.rep = RESCUE.tongRep;
    s.res.tong.sus = clamp(s.res.tong.sus + RESCUE.tongSus);
    out.push({ type: 'rescue', kind: 'tong', text: RESCUE_TEXT.tong });
  }
  if (memberCount(s) === 0) {
    s.rescue.empty = (s.rescue.empty ?? 0) + 1;
    s.followers += RESCUE.emptyFollowers;
    out.push({ type: 'rescue', kind: 'empty', text: fillT(RESCUE_TEXT.empty, { n: RESCUE.emptyFollowers }) });
  }
  if (s.sanctuary.arrears >= SANCTUARY.maxArrears) s.sanctuary.arrears = SANCTUARY.maxArrears - 1;   // 1단계에선 쫓겨나지 않는다 (엄마 대출이 막는다)
  return out;
}
