// 사람 외형 (26장): LimeZu Modern Interiors 캐릭터 생성기 부위 조합.
//   { body, eyes, hair: '모양_색' | null(대머리), outfit: ['추운 달', '더운 달'] ('종류_색'), acc: '번호_색' | null }
//   또는 { addon: 'Postman_1' } (Modern Exteriors 캐릭터 애드온, 완성된 사람)
//   머리 색 번호: 01 금갈색 · 02 밝은 갈색 · 03 갈색 · 04 짙은 갈색 · 05 흰머리 · 06 회색 · 07 검정
//   몸: 2 밝은 · 3 복숭아 · 7 그을린 · 1 짙게 그을린 · 눈: 1 갈색
// tools/build-assets.py 가 이 조합대로 미리 합성해 public/assets/lz/people.png 에 한 줄씩 넣는다 (부위 시트는 공개 레포에 넣지 않는다).
// 주민·첫 신도·성직자·기자·라이벌의 look 은 각 데이터 파일에 있고, 여기는 이름 없는 사람과 교주.
export const LEADER_LOOK = { body: 3, eyes: 1, hair: '02_07', outfit: ['26_01', '12_01'], acc: null };
// 28장 B-2: 단계가 오르면 교주 옷차림이 바뀐다 (2 양복 · 3 흰 셔츠 · 4 흰 두루마기). 아틀라스 줄 이름 leader2 · leader3 · leader4
export const LEADER_STAGE_LOOKS = {
  leader2: { ...LEADER_LOOK, outfit: ['05_02', '05_03'] },
  leader3: { ...LEADER_LOOK, outfit: ['14_01', '14_02'] },
  leader4: { ...LEADER_LOOK, outfit: ['33_01', '33_02'] },
};
// 따라온 사람 (예배·방에 앉는 이름 없는 신도) 8명
export const FOLLOWER_LOOKS = [
  { body: 3, eyes: 1, hair: '05_04', outfit: ['21_02', '01_03'], acc: null },
  { body: 2, eyes: 1, hair: '09_06', outfit: ['02_03', '13_03'], acc: null },
  { body: 7, eyes: 1, hair: '19_04', outfit: ['18_02', '01_08'], acc: null },
  { body: 2, eyes: 1, hair: '23_04', outfit: ['23_04', '11_02'], acc: null },
  { body: 3, eyes: 1, hair: '12_03', outfit: ['10_05', '01_10'], acc: '15_06' },
  { body: 2, eyes: 1, hair: '10_05', outfit: ['05_02', '17_02'], acc: null },
  { body: 7, eyes: 1, hair: '22_06', outfit: ['20_01', '07_02'], acc: null },
  { body: 3, eyes: 1, hair: '15_06', outfit: ['21_04', '13_04'], acc: null },
];
// 큰 날 구경꾼 6명
export const EXTRA_LOOKS = [
  { body: 2, eyes: 1, hair: '03_04', outfit: ['03_03', '01_01'], acc: null },
  { body: 7, eyes: 1, hair: '17_06', outfit: ['10_01', '25_03'], acc: '11_02' },
  { body: 3, eyes: 1, hair: '04_06', outfit: ['02_02', '13_01'], acc: null },
  { body: 2, eyes: 1, hair: '21_03', outfit: ['18_04', '01_06'], acc: '04_03' },
  { body: 1, eyes: 1, hair: '08_05', outfit: ['22_02', '07_04'], acc: null },
  { body: 3, eyes: 1, hair: '24_04', outfit: ['23_02', '14_02'], acc: '03_02' },
];
