/* =====================================================================
   인터넷가입센터 상담 콘솔 — 요금/지원금 DATA (검수용 초안)
   ---------------------------------------------------------------------
   - 모든 상품 3년약정 기준
   - support(지원금) 단위: 만원 (15 = 15만원, 현금 지원금)
   - 금액(원) 단위: 원
   - feeVat = 시트에 적힌 월요금 (KT/LG/스카이 시트는 VAT 포함 금액으로 판단 // TODO 확인필요)
   - feeExVat = feeVat / 1.1 (KT/LG/스카이는 계산값, SKB는 시트값)
   - 미확정 칸("가이드", KT "상품권/이마트", LG 5G "정책군/고객지원")은 넣지 않음
   - 화면 구현 단계에서 이 객체가 index.html 상단에 그대로 들어감
   ===================================================================== */

const DATA = {

  /* ───────────────────────── KT ───────────────────────── */
  kt: {
    baseMonth: '2026-10', // 기준월 // TODO 확인필요 (시트에 기준월 표기 없음)
    name: 'KT',
    phone: '100',
    feeIsVat: true, // 시트 월요금 = VAT 포함 // TODO 확인필요
    // 설치비: 평일 / 주말(평일대비 25% 할증). 익월 요금에 1회 합산 청구
    install: {
      net: { weekday: 36000, weekend: 45000 },
      tv:  { weekday: 56200, weekend: 71250 },
      addTv: { weekday: 15400, weekend: 19250 },
    },
    products: [
      // type: net=인터넷 단독, tv=인터넷+TV
      { id: 'kt-100',      type: 'net', speed: '100M', tv: null,            name: '인터넷 슬림(100M) 와이파이',          support: 15, feeVat: 23100, parts: { net: 22000, wifi: 1100 } },
      { id: 'kt-500',      type: 'net', speed: '500M', tv: null,            name: '인터넷 베이직(500M) 와이파이',        support: 18, feeVat: 34100, parts: { net: 33000, wifi: 1100 } },
      { id: 'kt-1g',       type: 'net', speed: '1G',   tv: null,            name: '인터넷 에센스(1기가) 와이파이',       support: 20, feeVat: 38500, parts: { net: 38500, wifi: 0 } }, // 와이파이 무료
      { id: 'kt-100-otv',  type: 'tv',  speed: '100M', tv: 'OTV베이직(236개)', name: '인터넷 슬림와이파이 + OTV베이직(236개)', support: 41, feeVat: 39600, parts: { net: 22000, tv: 12100, settop: 4400, wifi: 1100 } },
      { id: 'kt-100-all',  type: 'tv',  speed: '100M', tv: '모든G',          name: '인터넷 슬림와이파이 + 모든G',          support: 52, feeVat: 47300, parts: { net: 22000, tv: 16500, settop: 4400, wifi: 1100 } }, // 세부합계가 월요금보다 3,300원 적음(시트 원문) — 월요금 기준 사용 // TODO 확인필요
      { id: 'kt-500-otv',  type: 'tv',  speed: '500M', tv: 'OTV베이직(236개)', name: '인터넷 베이직와이파이 + OTV베이직(236개)', support: 51, feeVat: 45100, parts: { net: 27500, tv: 12100, settop: 4400, wifi: 1100 } },
      { id: 'kt-500-all',  type: 'tv',  speed: '500M', tv: '모든G',          name: '인터넷 베이직 와이파이 + 모든G',       support: 62, feeVat: 52800, parts: { net: 27500, tv: 16500, settop: 4400, wifi: 1100 } }, // 세부합계가 월요금보다 3,300원 적음(시트 원문) — 월요금 기준 사용 // TODO 확인필요
      { id: 'kt-1g-otv',   type: 'tv',  speed: '1G',   tv: 'OTV베이직(236개)', name: '인터넷 에센스 와이파이 + OTV베이직(236개)', support: 55, feeVat: 49500, parts: { net: 33000, tv: 12100, settop: 4400, wifi: 0 } },
      { id: 'kt-1g-all',   type: 'tv',  speed: '1G',   tv: '모든G',          name: '인터넷 에센스 와이파이 + 모든G',       support: 66, feeVat: 57200, parts: { net: 33000, tv: 16500, settop: 4400, wifi: 0 } }, // 세부합계가 월요금보다 3,300원 적음(시트 원문) — 월요금 기준 사용 // TODO 확인필요
    ],
    // 추가 상품 / 차감 (support 만원, fee 원/월 VAT포함)
    addons: [
      { id: 'kt-addtv',   name: '추가티비 베이직(지니A)',          support: 3,  feeVat: 10670, install: 'addTv' },
      { id: 'kt-buddy',   name: '버디패키지 WIFI 증폭기(500M이상)', support: 1,  feeVat: 1650, minSpeed: '500M' },
    ],
    deductions: [
      { id: 'kt-ttaro',   name: '따로살아도결합',                support: -9 },
      { id: 'kt-settop',  name: '지니3 / 사운드바 셋톱 외 차감',  support: -3 },
      { id: 'kt-common',  name: '공통사항신청서 작성시',          support: -5 }, // 시트 상단 문구 // TODO 확인필요 (적용 조건)
    ],
    // 추가TV 채널별 이용료 + 셋톱별 임대료 (3년약정시)
    addTvOptions: [
      { channel: '베이직', settop: '지니A', tvFee: 7370, settopFee: 3300, total: 10670 },
      { channel: '에센스', settop: '지니A', tvFee: 8800, settopFee: 3300, total: 12100 },
      { channel: '베이직', settop: '지니3', tvFee: 7370, settopFee: 4400, total: 11770 },
      { channel: '에센스', settop: '지니3', tvFee: 8800, settopFee: 4400, total: 13200 },
    ],
    // 유심 동판 (KT 유심 80k 이상 / 접수일 정책기준). 인터넷 지원금에 "추가"되는 금액(만원)
    // 시트 상단: "KT USIM 요금제 37k 요금제 이상 필수", "따로 살아도 가족결합 진행불가"
    usim: {
      tierLabel: '유심 80k 이상',
      // 추가정책(유심 37K/49K/61K 이상) 칸은 비어 있음 → 미적용
      general: { 'kt-100': 31, 'kt-500': 34, 'kt-1g': 36,
                 'kt-100-otv': 40, 'kt-500-otv': 43, 'kt-500-all': 48, 'kt-1g-otv': 48, 'kt-1g-all': 48,
                 'kt-100-all': 40 /* 시트는 "100+에센스+유심" — 모든G와 같은 상품인지 // TODO 확인필요 */ },
      family:  { 'kt-100': 17, 'kt-500': 20, 'kt-1g': 23,
                 'kt-100-otv': 23, 'kt-500-otv': 28, 'kt-1g-otv': 30,
                 'kt-100-all': 23, 'kt-500-all': 28, 'kt-1g-all': 30 /* 시트는 "에센스" 표기 // TODO 확인필요 */ },
    },
    // 휴대폰 결합 (KT 총액 결합할인, 휴대폰 월정액 총액 구간별, VAT 포함 할인액)
    combine: {
      type: '총액결합할인',
      brackets: ['22,000원 미만', '22,000원 이상', '64,900원 이상', '108,900원 이상', '141,900원 이상', '174,900원 이상'],
      netDiscount: {
        '100M':     [1650, 3300, 5500, 5500, 5500, 5500],
        '500M/1G':  [2200, 5500, 5500, 5500, 5500, 5500],
      },
      mobileDiscount: {
        '100M':     [0, 0, 3300, 14300, 18700, 23100],
        '500M/1G':  [0, 0, 5500, 16610, 22110, 27610],
      },
      // 정액 결합할인 (모바일 요금제별): 인터넷 할인 5,500원 고정
      flat: { netDiscount: 5500, brackets: ['37,000원 미만', '37,000원 이상', '61,000원 이상', '77,000원 이상'], mobileDiscount: [0, 3000, 5000, 7000] },
    },
    rules: {
      rejoinDays: 280,       // KT 해지 후 280일 이내 재가입시 환수
      downgradeDays: 365,    // 실사용 365일 안에 하향시 상품권/지원금 환수
      usimKeepMonths: 7,
      toSkyDeduct: 10,       // KT → SKY 차감 10만원 / SKY → KT 차감 없음
    },
  },

  /* ───────────────────────── LG U+ ───────────────────────── */
  lg: {
    baseMonth: '2026-10', // 기준월 // TODO 확인필요 (시트에 기준월 표기 없음)
    name: 'LG U+',
    phone: '101',
    feeIsVat: true, // TODO 확인필요
    install: {
      net: { weekday: 36300, weekend: 45375 },
      tv:  { weekday: 56100, weekend: 70125 },
      addSettop: { weekday: 22000, weekend: 27500 },
    },
    // support = 일반 지원금 합계, soho = 소호(사업자/사업장 설치) 지원금
    products: [
      { id: 'lg-100',      type: 'net', speed: '100M', tv: null,               name: 'WIFI요금제광랜안심',                     support: 18, soho: 28, feeVat: 22000, parts: { net: 22000 } },
      { id: 'lg-500',      type: 'net', speed: '500M', tv: null,               name: 'WIFI요금제기가슬림안심',                 support: 30, soho: 35, feeVat: 33000, parts: { net: 33000 } },
      { id: 'lg-1g',       type: 'net', speed: '1G',   tv: null,               name: 'WIFI요금제기가안심',                     support: 34, soho: 39, feeVat: 38500, parts: { net: 38500 } },
      { id: 'lg-100-s',    type: 'tv',  speed: '100M', tv: '실속형(219개)',     name: 'WIFI요금제광랜안심 + TV 실속형(219개) UHD4',   support: 43, soho: 51, feeVat: 39600, parts: { net: 22000, tv: 13200, settop: 4400 } },
      { id: 'lg-100-b',    type: 'tv',  speed: '100M', tv: '기본형(225개)',     name: 'WIFI요금제광랜안심 + TV 기본형(225개) UHD4',   support: 43 /* 시트 "〃"(위와 같음) */, soho: null /* 시트 빈칸 // TODO 확인필요 */, feeVat: 40700, parts: { net: 22000, tv: 14300, settop: 4400 } },
      { id: 'lg-100-p',    type: 'tv',  speed: '100M', tv: '프리미엄(252개)',   name: 'WIFI요금제광랜안심 + TV 프리미엄(252개) UHD4', support: 46, soho: 55, feeVat: 42900, parts: { net: 22000, tv: 16500, settop: 4400 } },
      { id: 'lg-500-s',    type: 'tv',  speed: '500M', tv: '실속형(219개)',     name: 'WIFI요금제광랜안심 + TV 실속형(219개) UHD4 (기가슬림)', support: 52, soho: 59, feeVat: 45100, parts: { net: 27500, tv: 13200, settop: 4400 } },
      { id: 'lg-500-b',    type: 'tv',  speed: '500M', tv: '기본형(225개)',     name: 'WIFI요금제광랜안심 + TV 기본형(225개) UHD4 (기가슬림)', support: 52 /* 〃 */, soho: null /* TODO 확인필요 */, feeVat: 46200, parts: { net: 27500, tv: 14300, settop: 4400 } },
      { id: 'lg-500-p',    type: 'tv',  speed: '500M', tv: '프리미엄(252개)',   name: 'WIFI요금제기가슬림안심 + TV 프리미엄(252개) UHD4', support: 55, soho: 62, feeVat: 48400, parts: { net: 27500, tv: 16500, settop: 4400 } },
      { id: 'lg-1g-s',     type: 'tv',  speed: '1G',   tv: '실속형(219개)',     name: 'WIFI요금제 1기가 + TV 실속형(219개) UHD4',     support: 55, soho: 67, feeVat: 50600, parts: { net: 33000, tv: 13200, settop: 4400 } },
      { id: 'lg-1g-b',     type: 'tv',  speed: '1G',   tv: '기본형(225개)',     name: 'WIFI요금제 1기가 + TV 기본형(225개) UHD4',     support: 55 /* 〃 */, soho: null /* TODO 확인필요 */, feeVat: 51700, parts: { net: 33000, tv: 14300, settop: 4400 } },
      { id: 'lg-1g-p',     type: 'tv',  speed: '1G',   tv: '프리미엄(252개)',   name: 'WIFI요금제1기가안심 + TV 프리미엄(252개) UHD4', support: 59, soho: 69, feeVat: 53900, parts: { net: 33000, tv: 16500, settop: 4400 } },
      // ※ 기본형(225개) 3개 행은 WIFI "포함" 칸과 설치비 칸이 비어 있음 → 같은 설치비로 가정 // TODO 확인필요
    ],
    addons: [
      { id: 'lg-addsettop', name: '추가셋톱',                   support: 9, feeVat: null /* 아래 addTvOptions 참고 */, install: 'addSettop' },
      { id: 'lg-easy2',     name: '우리집 지킴이 Easy2플러스 IOT', support: 8, feeVat: 14300, discontinued: true /* 판매가이드: "우리집 지킴이 EASY2 판매종료" */ },
      { id: 'lg-addwifi',   name: '추가 와이파이',              support: 0, feeVat: 2200 },
    ],
    deductions: [
      { id: 'lg-settop', name: '메인 UHD3,4 셋톱 외', support: -1 },
    ],
    addTvOptions: [
      { channel: '베이직(100메가)',   settop: '고급형',     tvFee: 7150, settopFee: 3300, total: 10450 },
      { channel: '베이직(500메가↑)',  settop: 'UHD3',       tvFee: 7150, settopFee: 2200, total: 9350 },
      { channel: '프리미엄(500메가↑)', settop: 'UHD4',      tvFee: 9350, settopFee: 4400, total: 13750 },
      { channel: '베이직',            settop: '크롬캐스트', tvFee: 7150, settopFee: 2750, total: 9900 },
    ],
    usim: null, // LG 시트에 유심 동판 표 없음 (5G 요금제 "고객지원" 칸은 의미 미확정으로 제외)
    combine: {
      type: '참쉬운가족결합',
      // 인터넷 속도에 따른 인터넷 할인(인터넷 1대당, 최대 3회선)
      netDiscount: { '100M': 5500, '500M': 9900, '1G': 13200 },
      // 모바일 요금에 따른 모바일 할인(1대당, 최대 10회선): [69,000 미만, 69,000 이상, 88,000 이상]
      mobileDiscount: { '1명': [0, 0, 0], '2명': [2200, 3300, 4400], '3명': [3300, 5500, 6600], '4~5명': [4400, 6600, 8800] },
      together: { netDiscount500M1G: 11000, net100M: null /* 결합불가 */ },
    },
    rules: {
      rejoinDays: 90,
      bannedBiz: ['유흥업소', '노래방', '고시텔', '숙박업소', 'PC방', '성인게임장'],
    },
  },

  /* ───────────────────────── SKB / SKT ───────────────────────── */
  sk: {
    baseMonth: '2026-10', // 기준월 // TODO 확인필요 (시트에 기준월 표기 없음)
    name: 'SKB/SKT',
    phone: 'SKB 106 / SKT 1600-2000',
    // SKB 시트: 미결합/결합 = VAT 제외, 우리집 = 미결합 VAT 포함, 요즘가족 = 결합 VAT 포함
    install: {
      net: { weekday: 36300, weekend: 45375 },
      tv:  { weekday: 56100, weekend: 70125 },
      addSettop: { weekday: 17600, weekend: 22000 },
    },
    products: [
      { id: 'sk-100',      type: 'net', speed: '100M', tv: null,       name: '광랜100M (WiFi통합)',                     support: 15, exVat: 21000, combExVat: 17000, feeVat: 23100, combVat: 18700 },
      { id: 'sk-500',      type: 'net', speed: '500M', tv: null,       name: '기가라이트500M (WiFi통합)',               support: 22, exVat: 31000, combExVat: 21000, feeVat: 34100, combVat: 23100 },
      { id: 'sk-1g',       type: 'net', speed: '1G',   tv: null,       name: '기가1G (WiFi통합)',                       support: 23, exVat: 36000, combExVat: 24000, feeVat: 39600, combVat: 26400 },
      { id: 'sk-100-eco',  type: 'tv',  speed: '100M', tv: '이코노미(178개)', name: '광랜100M + TV이코노미(스마트3)',     support: 35, exVat: 33000, combExVat: 29000, feeVat: 36300, combVat: 31900 },
      { id: 'sk-100-std',  type: 'tv',  speed: '100M', tv: '스탠다드(219개)', name: '광랜100M + TV스탠다드(스마트3)',     support: 46, exVat: 36000, combExVat: 32000, feeVat: 39600, combVat: 35200 },
      { id: 'sk-100-all',  type: 'tv',  speed: '100M', tv: 'ALL(251개)',     name: '광랜100M + TV ALL(스마트3)',          support: 50, exVat: 39000, combExVat: 35000, feeVat: 42900, combVat: 38500 },
      { id: 'sk-500-eco',  type: 'tv',  speed: '500M', tv: '이코노미(178개)', name: '기가라이트500M + TV 이코노미(스마트3)', support: 42, exVat: 39000, combExVat: 33000, feeVat: 42900, combVat: 36300 },
      { id: 'sk-500-std',  type: 'tv',  speed: '500M', tv: '스탠다드(219개)', name: '기가라이트500M + TV스탠다드(스마트3)', support: 53, exVat: 42000, combExVat: 36000, feeVat: 46200, combVat: 39600 },
      { id: 'sk-500-all',  type: 'tv',  speed: '500M', tv: 'ALL(251개)',     name: '기가라이트500M + TV ALL(스마트3)',     support: 57, exVat: 45000, combExVat: 39000, feeVat: 49500, combVat: 42900 },
      { id: 'sk-1g-eco',   type: 'tv',  speed: '1G',   tv: '이코노미(178개)', name: '기가1G + TV 이코노미(스마트3)',       support: 42, exVat: 44000, combExVat: 36000, feeVat: 48400, combVat: 39600 },
      { id: 'sk-1g-std',   type: 'tv',  speed: '1G',   tv: '스탠다드(219개)', name: '기가1G + TV 스탠다드(스마트3)',       support: 53, exVat: 47000, combExVat: 39000, feeVat: 51700, combVat: 42900 },
      { id: 'sk-1g-all',   type: 'tv',  speed: '1G',   tv: 'ALL(251개)',     name: '기가1G + TV ALL(스마트3)',            support: 57, exVat: 50000, combExVat: 42000, feeVat: 55000, combVat: 46200 },
    ],
    addons: [
      { id: 'sk-settop-eco', name: 'SKB 추가셋톱 이코노미', support: 2, feeVat: 8250,  install: 'addSettop' },
      { id: 'sk-settop-std', name: 'SKB 추가셋톱 스탠다드', support: 4, feeVat: 9900,  install: 'addSettop' },
      { id: 'sk-settop-all', name: 'SKB 추가셋톱 ALL',     support: 6, feeVat: 11550, install: 'addSettop' },
      { id: 'sk-oss',        name: 'OSS 원스탑전환 (SKB/SKT 모두가능)', support: 1, feeVat: 0 },
      { id: 'sk-wings',      name: '윙즈(와이파이증폭기)',  support: 0, feeVat: 1650 },
    ],
    deductions: [
      { id: 'sk-common', name: '공통사항신청서 작성시', support: -5 }, // 시트 상단 문구 // TODO 확인필요 (적용 조건)
    ],
    // 유심 동판 추가지급 (인터넷 개통일 기준 유심 +30일 안에 개통). 인터넷 지원금에 "추가"
    usim: {
      tiers: ['33', '43', '69', '89'], // 유심 요금제 이상
      netOnly:   { '33': null, '43': null, '69': null, '89': null }, // 인터넷+유심: 시트 빈칸 // TODO 확인필요
      tv:        { '33': 30, '43': 35, '69': 38, '89': 40 },         // (인터넷+티비)+유심, 본인명의 인터넷 + 본인명의 유심
      familyAdd: { '33': 20, '43': 25, '69': 27, '89': 30 }, // 가족 추가유심: 본인 인터넷+본인 유심+가족명의 추가유심
      familyOnly:{ '33': null, '43': null, '69': null, '89': null }, // 가족 단독 유심(본인 인터넷+가족명의 유심): 빈칸 // TODO 확인필요
    },
    combine: {
      type: '요즘가족결합',
      // 이동전화 할인(괄호는 회선당 금액). 인터넷 할인은 요금표(combExVat/combVat)에 이미 반영됨
      mobile100M: { '1회선': 3500, '2회선': 7000, '3회선': 18000 },
      mobile500M: { '1회선': 3500, '2회선': 7000, '3회선': 18000, '4~5회선': 24000 },
    },
    rules: {
      combineWithinDays: 30, // SK 모든 결합은 30일 내로만 가능
    },
  },

  /* ───────────────────────── 스카이라이프 ───────────────────────── */
  sky: {
    baseMonth: '2026-10', // 기준월 // TODO 확인필요 (시트에 기준월 표기 없음)
    name: '스카이라이프',
    phone: '1588-3002',
    feeIsVat: true, // TODO 확인필요
    install: {
      net: { weekday: 36000, weekend: 45000 },
      tv:  { weekday: 48500, weekend: 48500 }, // 시트에 평일/주말 칸이 합쳐져 48,500원 하나만 표기 // TODO 확인필요
      skyOnly: { weekday: 27500, weekend: 27500 }, // TODO 확인필요 (칸 합쳐짐)
      addSky:  { weekday: 10000, weekend: 10000 }, // TODO 확인필요 (칸 합쳐짐)
    },
    // support = 지원금 합계 (★KT 전환시 10만원 차감은 rules에서 자동 반영)
    products: [
      { id: 'sky-100',      type: 'net', speed: '100M', tv: null,        name: '인터넷(100M)',          support: 11, feeVat: 23100, parts: { net: 22000, wifi: 1100 } },
      { id: 'sky-200',      type: 'net', speed: '200M', tv: null,        name: '기가(200M)',            support: 13, feeVat: 25300, parts: { net: 25300, wifi: 0 } },
      { id: 'sky-500',      type: 'net', speed: '500M', tv: null,        name: '기가콤팩트(500M)',      support: 22, feeVat: 33000, parts: { net: 33000, wifi: 0 } },
      { id: 'sky-1g',       type: 'net', speed: '1G',   tv: null,        name: '기가(1G)',              support: 24, feeVat: 38500, parts: { net: 38500, wifi: 0 } },
      { id: 'sky-100-b',    type: 'tv',  speed: '100M', tv: 'IPTV 베이직', name: '100M + IPTV 베이직',   support: 43, feeVat: 34100, parts: { net: 19800, tv: 9900,  settop: 3300, wifi: 1100 } },
      { id: 'sky-200-b',    type: 'tv',  speed: '200M', tv: 'IPTV 베이직', name: '200M + IPTV 베이직',   support: 43, feeVat: 35200, parts: { net: 22000, tv: 9900,  settop: 3300, wifi: 0 } },
      { id: 'sky-500-b',    type: 'tv',  speed: '500M', tv: 'IPTV 베이직', name: '500M + IPTV 베이직',   support: 52, feeVat: 40700, parts: { net: 27500, tv: 9900,  settop: 3300, wifi: 0 } },
      { id: 'sky-1g-b',     type: 'tv',  speed: '1G',   tv: 'IPTV 베이직', name: '1G + IPTV 베이직',     support: 55, feeVat: 46200, parts: { net: 33000, tv: 9900,  settop: 3300, wifi: 0 } },
      { id: 'sky-100-p',    type: 'tv',  speed: '100M', tv: 'IPTV 플러스', name: '100M + IPTV 플러스',   support: 43, feeVat: 35200, parts: { net: 19800, tv: 11000, settop: 3300, wifi: 1100 } },
      { id: 'sky-200-p',    type: 'tv',  speed: '200M', tv: 'IPTV 플러스', name: '200M + IPTV 플러스',   support: 43, feeVat: 36300, parts: { net: 22000, tv: 11000, settop: 3300, wifi: 0 } },
      { id: 'sky-500-p',    type: 'tv',  speed: '500M', tv: 'IPTV 플러스', name: '500M + IPTV 플러스',   support: 52, feeVat: 41800, parts: { net: 27500, tv: 11000, settop: 3300, wifi: 0 } },
      { id: 'sky-1g-p',     type: 'tv',  speed: '1G',   tv: 'IPTV 플러스', name: '1G + IPTV 플러스',     support: 55, feeVat: 47300, parts: { net: 33000, tv: 11000, settop: 3300, wifi: 0 } },
      // 홈결합30% (KT 전환 차감 없음 / 기존 KT·HCN 전환 시 불가). 지원금 0, "가이드없음 추가 사은품으로 접수 요망"
      { id: 'sky-home-100', type: 'tv',  speed: '100M', tv: 'SKY ALL',    name: '홈결합30% + 100M + SKY ALL', support: 0, feeVat: 22000, home30: true, parts: { wifi: 1100 } },
      { id: 'sky-home-200', type: 'tv',  speed: '200M', tv: 'SKY ALL',    name: '홈결합30% + 200M + SKY ALL', support: 0, feeVat: 23100, home30: true, parts: { wifi: 0 } },
    ],
    addons: [
      { id: 'sky-only',  name: '단독 sky All (238채널)',            support: 1, feeVat: 13200, install: 'skyOnly' }, // TV단독 상품은 VOD다시보기, 넷플릭스 불가
      { id: 'sky-add',   name: '추가 sky All 안드로이드5 (할인형)', support: 1, feeVat: 6600,  install: 'addSky' },  // 9,900원 → 프로모션 할인가 6,600원
      { id: 'sky-oss',   name: 'OSS (동일주소지만 가능)',           support: 1, feeVat: 0 },
    ],
    // 메인TV 그외 요금제 (참고)
    mainTvOther: [
      { name: 'SKY 포인트', channels: 238, tvFee: 11000, settopFee: 1100 },
      { name: 'SKY 초이스', channels: 238, tvFee: 16500, settopFee: 1100 },
    ],
    usim: null,    // 스카이 시트에 유심 동판 표 없음
    combine: null, // 스카이 시트에 결합 할인표 없음 (휴대폰 결합은 스카이알뜰폰만 가능) // TODO 확인필요
    rules: {
      rejoinDays: 280,
      fromKtDeduct: 10,           // KT 전환 차감 -10만원 (단독+번들). 정책 마이너스 되지 않게 주의
      home30BlockedFrom: ['KT', 'HCN'], // 기존 KT, HCN 전환 시 30% 홈결합 불가
      // 전통신사 : LG, SK, 티브로드, 딜라이브, CMB, 헬로
    },
  },

  /* ───────────────────────── 공통 주의사항 ───────────────────────── */
  common: {
    clawback: ['설치 후 실사용일수 1년이내 일반해지', '요금 미납 / 단 한번도 접속하지 않아 가개통 의심 직권해지',
               '1년이내 명의변경 / 일시정지', '1년이내 인터넷 또는 TV상품을 낮은 요금으로 하향'],
    usim: { keepMonths: 7, selectPlan: [12, 24], firstBill: '신규유심비 7,700원 + 번이 수수료 800원' },
    docs: '이사로 인한 신규가입시 이사주소지 기재된 부동산 매매계약서 또는 임대차 계약서가 필요할 수 있음',
  },
};
