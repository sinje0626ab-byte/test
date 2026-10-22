// 개업 첫날 (3월 2일) 짜인 흐름의 효과 (25장 B). 화면(ui/opening.js)과 봇(tools/simulate.mjs)이 같은 함수를 부른다.
//   첫날: 간판(창문 시트지, 무료) → 통장님 첫 대화 → 민호 → 하윤서 → 저녁 첫 모임(작은 예배) → 주보 0호
//   첫 신도 전환: 이름 있는 신도가 아직 없으면 새신자 → 신도 호감 문턱을 낮춘다 (sanctuary.js holdWorship)
import { OPENING } from '../config.js';
import { clamp } from './leader.js';
import { setStage } from './faith.js';

export const isOpeningDay = (s) => s.day === 0;
export const openingDone = (s, step) => !!s.flags.opening?.[step];
const mark = (s, step) => { s.flags.opening ??= {}; s.flags.opening[step] = true; };

// 간판: 엄마가 사 온 시트지 (돈 안 듦) → 메인 퀘스트 '간판 달기'
export function openingSign(s) {
  if (openingDone(s, 'sign')) return;
  mark(s, 'sign');
  s.sanctuary.sign = Math.max(s.sanctuary.sign ?? 0, 1);
}

// 통장님 첫 대화. choice: 'study' (무난) · 'name' (교단 이름부터)
export function openingTong(s, choice = 'study') {
  if (openingDone(s, 'tong')) return;
  mark(s, 'tong');
  const st = s.res.tong;
  const F = OPENING.tong[choice] ?? OPENING.tong.study;
  st.met = true;
  st.like = clamp(st.like + F.like);
  st.sus = clamp(st.sus + F.sus);
  s.quest.tong = true;                              // 개업 퀘스트 '통장님께 인사'는 이걸로 끝난다
}

// 민호: 이미 첫 신도라 효과는 작다 (첫 신도들의 결속)
export function openingMinho(s) {
  if (openingDone(s, 'minho')) return;
  mark(s, 'minho');
  if (s.cast?.stranger) s.cast.stranger.sus = 0;
}

// 하윤서가 소리를 듣고 올라온다 → 오늘 저녁 첫 모임에 앉는다
export function openingVisitor(s) {
  if (openingDone(s, 'visitor')) return;
  mark(s, 'visitor');
  const id = OPENING.visitor;
  const st = s.res[id];
  st.met = true;
  st.like = Math.max(st.like, OPENING.visitorLike);
  if (st.stage === 'none' || st.stage === 'curious') setStage(s, id, 'visitor');
  st.attendDay = s.day;
  if (!s.attend.includes(id)) s.attend.push(id);
  s.flags.firstConvertId = id;
}

// 첫날 저녁엔 월요일이어도 첫 모임(작은 예배)을 열 수 있다
export const openingWorshipOpen = (s) => isOpeningDay(s) && s.sanctuary.worshipDay !== s.day;

// 첫 모임 뒤: 하윤서를 수요일에 다시 부른다
export function afterOpeningWorship(s) {
  const id = s.flags.firstConvertId;
  if (!id) return;
  const st = s.res[id];
  st.attendDay = OPENING.nextWorshipDay;
  st.like = clamp(st.like + OPENING.afterLike);
}

// 봇·건너뛰기: 낮의 짜인 일을 한 번에
export function applyOpeningDay(s) {
  openingSign(s);
  openingTong(s, 'study');
  openingMinho(s);
  openingVisitor(s);
}
