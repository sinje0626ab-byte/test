// 포교 대화 판정. 선택지 → 호감·의심·피로 변화와 반응 대사 키.
// 원칙: 교주의 실제 설득 문장은 만들지 않는다. 결과는 숫자와 주민 반응으로만 보인다.
import { TALK, RUMOR, SECT_FX } from '../config.js';
import { RESIDENT_BY_ID } from '../data/residents.js';
import { FAMILIES, SECTS } from '../data/sects.js';
import { LINES } from '../data/lines.js';
import { HINTS, NEED_NAMES } from '../data/topics.js';
import { SPECIAL_TEXT } from '../data/bulletin.js';
import { CLERGY } from '../data/clergy.js';
import { rand, pick, shuffle } from './rng.js';
import { clamp, addFatigue, exhausted, shiftBelief, addMoney } from './leader.js';
import { checkCurious, setStage, relationsOf } from './faith.js';
import { nextWorshipDay } from './clock.js';
import { topNeeds } from './residents.js';

const LIKE_TRAITS = ['kind', 'simple', 'curious', 'lonely', 'cheerful', 'easygoing', 'gentle'];
const SUS_TRAITS = ['sharp', 'careful', 'strict', 'blunt', 'stubborn', 'shrewd', 'oversee'];
const RELIGIOUS_SPECIAL = ['doomsday', 'messiah', 'fortune', 'shaman'];   // 종교색이 드러나는 특기

export function sameFamily(s, id) {
  const r = RESIDENT_BY_ID[id];
  return s.leader.family && FAMILIES[s.leader.family].religions.includes(r.religion);
}

function mods(s, id) {
  const r = RESIDENT_BY_ID[id];
  const fx = SECT_FX[s.leader.sect];
  let like = 1;
  let sus = 1;
  if (sameFamily(s, id)) like *= TALK.sameFamilyLike;
  if (r.age >= fx.ages[0] && r.age <= fx.ages[1]) like *= 1.2;
  if (r.traits.some((t) => LIKE_TRAITS.includes(t))) like *= 1.1;
  if (r.traits.some((t) => SUS_TRAITS.includes(t))) { like *= 0.9; sus *= 1.3; }
  return { like, sus, fx, r };
}

// 말 걸 수 있나
export function canTalk(s, id) {
  const st = s.res[id];
  if (s.rep <= RUMOR.silentAt) return { ok: false, reason: 'silent' };
  if (exhausted(s)) return { ok: false, reason: 'tired' };
  if (st.talked === s.day) return { ok: false, reason: 'already' };
  if (st.sus >= RUMOR.refuseSus) return { ok: false, reason: 'refuse' };
  return { ok: true };
}

// 대화 시작: 인사 + 지금 고민의 단서 + 선택지
export function startTalk(s, id) {
  const st = s.res[id];
  const r = RESIDENT_BY_ID[id];
  const top = topNeeds(st);
  if (!st.hint) st.hint = rand(s) < 0.7 ? top[0] : top[1];        // 단서가 늘 정확하진 않다
  const greet = st.met ? pick(s, [r.greet[1], LINES[r.voice].smalltalk]) : r.greet[0];
  return { greet, hint: pick(s, HINTS[st.hint]), options: optionsFor(s, id), cards: cardsFor(s, id) };
}

export function optionsFor(s, id) {
  const st = s.res[id];
  const sect = SECTS[s.leader.sect];
  const opts = ['smalltalk', 'listen'];
  const invitable = st.stage === 'curious' && st.like >= TALK.invite.likeGate;
  if (invitable) opts.push('invite');
  else if (st.stage === 'none' || st.stage === 'curious') opts.push('preach');
  opts.push('special');
  return opts.map((o) => ({ id: o, special: o === 'special' ? sect.terms.special : null }));
}

// 고민 카드 3장: 진짜 지금 고민 1장 + 다른 2장
export function cardsFor(s, id) {
  const top = topNeeds(s.res[id]);
  const others = shuffle(s, top.slice(1)).slice(0, 2);
  return shuffle(s, [top[0], ...others]);
}

// 선택지 실행. 반환: { line, narr, dLike, dSus, stage, money }
export function act(s, id, opt, card) {
  const st = s.res[id];
  const { like: mL, sus: mS, fx, r } = mods(s, id);
  const voice = LINES[r.voice];
  const same = sameFamily(s, id);
  const secular = r.religion === 'none';
  const before = { like: st.like, sus: st.sus, stage: st.stage };
  let dl = 0; let ds = 0; let line = ''; let narr = ''; let money = 0;

  if (!st.met) {
    st.met = true;
    if (relationsOf(id).some((x) => s.res[x.id].stage === 'member')) dl += TALK.friendBonus;
  }

  if (opt === 'smalltalk') {
    dl += TALK.smalltalk.like * mL;
    line = voice.smalltalk;
  } else if (opt === 'listen') {
    const order = topNeeds(st);
    const topic = (fx.topic[card] ?? 1) * (fx.listenBonus ?? 1);
    if (card === order[0]) {
      dl += TALK.listen.match * topic * mL;
      st.needs[card] = Math.max(0, st.needs[card] - 10);
      st.known = true;
      line = voice.hit;
    } else if (card === order[1]) {
      dl += TALK.listen.partial * topic * mL;
      line = voice.partial;
    } else {
      dl += TALK.listen.miss;
      line = voice.miss;
    }
    narr = `${NEED_NAMES[card]} 얘기를 들었다.`;
  } else if (opt === 'preach') {
    let sus = TALK.preach.sus * fx.preachSus * mS;
    if (secular) sus *= 1.6 * fx.secularSus;
    if (!secular && !same && r.traits.includes('devout')) sus *= 1.5;
    if (same) { dl += (TALK.preach.like + TALK.preach.sameFamilyBonus) * mL; sus *= 0.5; }
    else if (st.like >= TALK.preach.likeGate) { dl += TALK.preach.like * mL; sus *= 0.6; }
    else { dl += 1; sus *= 1.5; }
    ds += sus;
    line = dl >= TALK.preach.like ? voice.preachGood : voice.preachBad;
    if (dl >= TALK.preach.like) shiftBelief(s, 2);
  } else if (opt === 'invite') {
    const p = TALK.invite.accept * fx.invite - st.sus / 150 + (st.like - TALK.invite.likeGate) / 200;
    if (rand(s) < p) {
      setStage(s, id, 'visitor');
      st.attendDay = nextWorshipDay(s.day, s.minute);
      if (st.attendDay === s.day && !s.attend.includes(id)) s.attend.push(id);   // 오늘 저녁 예배면 바로 온다
      line = voice.inviteYes;
    } else {
      ds += TALK.invite.refuseSus * mS;
      line = voice.inviteNo;
    }
  } else if (opt === 'special') {
    const top = topNeeds(st)[0];
    const good = specialGood(s.leader.sect, top, r);
    let sus = TALK.special.sus * mS;
    if (s.leader.sect === 'messiah') sus *= 2;
    if (s.leader.sect === 'meditation') sus = 0;
    if (secular && RELIGIOUS_SPECIAL.includes(s.leader.sect)) sus *= 1.3 * fx.secularSus;
    if (good) {
      dl += TALK.special.like * mL * (fx.topic[top] ?? 1);
      if (s.leader.sect === 'shaman') { money = 10_000; addMoney(s, money); shiftBelief(s, -2); }
    } else {
      dl += 2;
      sus *= 2;
    }
    ds += sus;
    if (s.leader.sect === 'qigong') s.res.pharmacist.sus = clamp(s.res.pharmacist.sus + 2 * fx.pharmacistSus);
    narr = SPECIAL_TEXT[s.leader.sect][good ? 'good' : 'bad'].replaceAll('{이름}', r.name);
  }

  st.like = clamp(st.like + dl);
  st.sus = clamp(st.sus + ds);
  st.talked = s.day;
  s.week.talks++;
  addFatigue(s, TALK.fatiguePerTalk);
  checkCurious(s, id);
  return {
    line, narr, money,
    dLike: Math.round(st.like - before.like), dSus: Math.round(st.sus - before.sus),
    stageFrom: before.stage, stageTo: st.stage,
  };
}

function specialGood(sect, top, r) {
  switch (sect) {
    case 'doomsday': return top === 'future';
    case 'messiah': return top === 'lonely';
    case 'meditation': return top === 'meaning' || top === 'health';
    case 'fortune': return (top === 'money' || top === 'lonely') && r.age >= 40;
    case 'shaman': return top === 'future' || top === 'money';
    case 'qigong': return top === 'health';
    default: return false;
  }
}

// 성직자에게 말 걸기 (포교 선택지는 없다. 진지한 대화만)
export function talkClergy(s, clergyId) {
  const c = CLERGY.find((x) => x.id === clergyId);
  const st = s.clergy[clergyId];
  const line = c.greet[st.greetIdx % c.greet.length];
  st.greetIdx++;
  return { name: `${c.name} ${c.title}`, line };
}

