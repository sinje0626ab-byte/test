// 수치를 말로 바꾼다. 정확한 숫자는 '교단 장부' 화면에서만 보여 준다.

// 성공 확률 → 3단계
export function odds(p) {
  if (p >= 0.65) return { label: '자신 있음', tone: 'good' };
  if (p >= 0.4) return { label: '반반', tone: '' };
  return { label: '도박', tone: 'bad' };
}

// 결속 → 간부들 분위기 (5단계)
const MOOD = [
  [80, '다들 교주님 얘기만 나오면 눈이 반짝인다', 'good'],
  [60, '회의 끝나면 다 같이 국밥 먹으러 간다', ''],
  [40, '슬슬 서로 눈치 보는 중', ''],
  [20, '단톡방이 조용하다. 다들 개인 톡으로 옮겼다', 'warn'],
  [0, '누가 먼저 짐 싸나 보는 중', 'bad'],
];
export function mood(unity) {
  const [, text, tone] = MOOD.find(([min]) => unity >= min) ?? MOOD.at(-1);
  return { text, tone };
}

// 정부 경계 → 단계 문장 (본거지면 동네 말투)
export function alertWord(alert, { banned = false, home = false } = {}) {
  if (banned) return { text: '활동 금지. 간판도 못 건다', tone: 'bad' };
  if (alert >= 0.7) return { text: home ? '압수수색 영장이 나왔다는 소문' : '당국이 문을 두드리기 직전', tone: 'bad' };
  if (alert >= 0.5) return { text: home ? '경고장 받음. 담당 형사가 생겼다' : '경고장이 왔다', tone: 'warn' };
  if (alert >= 0.25) return { text: home ? '동네 지구대가 이름을 안다' : '당국이 이름을 적어 갔다', tone: '' };
  return { text: '아무도 관심 없다', tone: 'good' };
}

// 거부감 → 단계 문장
export function aversionWord(v) {
  if (v >= 0.45) return { text: '이름만 들어도 문을 닫는다', tone: 'bad' };
  if (v >= 0.25) return { text: '전단지를 받자마자 찢는다', tone: 'warn' };
  if (v >= 0.1) return { text: '뒤에서 수군거린다', tone: '' };
  return { text: '아직 잘 모른다', tone: 'good' };
}

// 그림자 장부 → 말
export function shadowWord(points) {
  if (points >= 12) return '장부가 두 권째다';
  if (points >= 6) return '서랍 깊숙이 넣어 둔 장부가 있다';
  if (points >= 1) return '태울까 말까 한 영수증이 몇 장 있다';
  return '깨끗하다';
}
