// data/*.json을 읽고, 문법 오류는 위치까지 찾아 알려 주고, 내용을 점검해 게임이 쓸 모양으로 정리한다.
// 내용 문제(없는 인물, 잘못된 수치 이름 등)는 게임을 멈추지 않고 경고로만 모은다.

import { STATS, STAT_MIN, STAT_MAX, DATA_FILES } from './config.js';

const STAT_KEYS = STATS.map((s) => s.key);

export class ContentError extends Error {
  constructor(file, message, detail = {}) {
    super(message);
    this.file = file;
    this.line = detail.line ?? null;
    this.column = detail.column ?? null;
    this.snippet = detail.snippet ?? '';
  }
}

export async function loadContent() {
  const [rawCards, rawCharacters, rawEndings] = await Promise.all([
    fetchJSON(DATA_FILES.cards),
    fetchJSON(DATA_FILES.characters),
    fetchJSON(DATA_FILES.endings),
  ]);
  const warnings = [];
  const characters = normalizeCharacters(rawCharacters, warnings);
  const endings = normalizeEndings(rawEndings, warnings);
  const cards = normalizeCards(rawCards, characters, warnings);
  return { cards, characters, endings, warnings };
}

async function fetchJSON(path) {
  let res;
  try {
    res = await fetch(path, { cache: 'no-cache' });
  } catch {
    throw new ContentError(path, '파일을 불러오지 못했습니다. 인터넷 연결을 확인하거나, 내 컴퓨터에서 여는 중이라면 로컬 서버로 열어야 합니다.');
  }
  if (!res.ok) {
    throw new ContentError(path, `파일을 찾을 수 없습니다 (HTTP ${res.status}). 파일 이름과 위치를 확인하세요.`);
  }
  const text = (await res.text()).replace(/^﻿/, '');
  try {
    return JSON.parse(text);
  } catch (e) {
    const found = locateJsonError(text);
    const pos = found ? found.pos : 0;
    const { line, column, snippet } = describePosition(text, pos);
    const message = found ? found.msg : `JSON 문법 오류: ${e.message}`;
    throw new ContentError(path, message, { line, column, snippet });
  }
}

// ---------------------------------------------------------------------------
// JSON 오류 위치 찾기
// 브라우저마다(특히 iOS Safari) JSON.parse 오류에 위치가 없어서, 직접 한 번 훑어 첫 오류 지점을 찾는다.

function locateJsonError(s) {
  let i = 0;
  const fail = (msg, at = i) => { throw { pos: at, msg }; };
  const ws = () => { while (i < s.length && ' \t\n\r'.includes(s[i])) i++; };
  const SMART = '“”‘’';

  function value() {
    ws();
    const c = s[i];
    if (i >= s.length) fail('파일이 중간에 끝났습니다. 닫는 괄호 ] 또는 } 가 빠졌을 수 있습니다.');
    if (c === '{') return object();
    if (c === '[') return array();
    if (c === '"') return string();
    if (c === '-' || (c >= '0' && c <= '9')) return number();
    for (const word of ['true', 'false', 'null']) {
      if (s.startsWith(word, i)) { i += word.length; return; }
    }
    if (SMART.includes(c)) fail(`둥근 따옴표(${c})가 있습니다. 곧은 큰따옴표(")로 바꾸세요. 휴대폰 키보드에서 자주 생깁니다.`);
    if (c === "'") fail('작은따옴표(\')는 쓸 수 없습니다. 큰따옴표(")로 바꾸세요.');
    if (c === ',') fail('쉼표(,)가 두 번 연달아 있거나, 값이 비어 있습니다.');
    fail(`여기에 값이 와야 하는데 「${c}」 가 있습니다. 글자는 큰따옴표로 감싸야 합니다.`);
  }

  function object() {
    let lastComma = i;
    i++; ws();
    if (s[i] === '}') { i++; return; }
    for (;;) {
      ws();
      if (s[i] !== '"') {
        if (s[i] === '}') fail('마지막 항목 뒤에 쉼표(,)가 남아 있습니다. 그 쉼표를 지우세요.', lastComma);
        if (SMART.includes(s[i])) fail(`둥근 따옴표(${s[i]})가 있습니다. 곧은 큰따옴표(")로 바꾸세요.`);
        fail('항목 이름은 큰따옴표(")로 감싸야 합니다. 앞 줄 끝에 쉼표가 빠졌거나 남았을 수도 있습니다.');
      }
      string(); ws();
      if (s[i] !== ':') fail('항목 이름 뒤에 콜론(:)이 빠졌습니다.');
      i++;
      value(); ws();
      if (s[i] === ',') { lastComma = i; i++; continue; }
      if (s[i] === '}') { i++; return; }
      if (i >= s.length) fail('파일이 중간에 끝났습니다. 닫는 중괄호 } 가 빠졌습니다.');
      fail('항목 사이에 쉼표(,)가 빠졌거나 괄호 짝이 맞지 않습니다.');
    }
  }

  function array() {
    i++; ws();
    if (s[i] === ']') { i++; return; }
    for (;;) {
      value(); ws();
      if (s[i] === ',') {
        const comma = i;
        i++; ws();
        if (s[i] === ']') fail('마지막 항목 뒤에 쉼표(,)가 남아 있습니다. 그 쉼표를 지우세요.', comma);
        continue;
      }
      if (s[i] === ']') { i++; return; }
      if (i >= s.length) fail('파일이 중간에 끝났습니다. 닫는 대괄호 ] 가 빠졌습니다.');
      fail('항목 사이에 쉼표(,)가 빠졌거나 괄호 짝이 맞지 않습니다.');
    }
  }

  function string() {
    const start = i;
    i++;
    while (i < s.length) {
      const c = s[i];
      if (c === '"') { i++; return; }
      if (c === '\\') { i += 2; continue; }
      if (c === '\n') fail('따옴표가 닫히지 않은 채 줄이 바뀌었습니다. 문장 안에 큰따옴표를 쓰려면 \\" 로 쓰거나 「」를 쓰세요.', start);
      i++;
    }
    fail('따옴표가 닫히지 않았습니다.', start);
  }

  function number() {
    const re = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/y;
    re.lastIndex = i;
    const m = re.exec(s);
    if (!m) fail('숫자 모양이 잘못되었습니다.');
    i = re.lastIndex;
    if (s[i] === '%') fail('숫자 뒤에 %를 붙이지 마세요.');
  }

  try {
    value(); ws();
    if (i < s.length) fail('파일이 끝난 뒤에 내용이 더 있습니다. 맨 바깥 괄호가 일찍 닫혔을 수 있습니다.');
    return null;
  } catch (e) {
    if (e && typeof e.pos === 'number') return e;
    return null;
  }
}

function describePosition(text, pos) {
  const before = text.slice(0, pos);
  const line = before.split('\n').length;
  const column = pos - before.lastIndexOf('\n');
  const lines = text.split('\n');
  const from = Math.max(0, line - 3);
  const width = String(line + 1).length;
  const out = [];
  for (let n = from; n < Math.min(lines.length, line + 1); n++) {
    out.push(`${String(n + 1).padStart(width)} | ${lines[n].replace(/\r$/, '')}`);
    if (n + 1 === line) out.push(`${' '.repeat(width)} | ${' '.repeat(Math.max(0, column - 1))}^ 여기`);
  }
  return { line, column, snippet: out.join('\n') };
}

// ---------------------------------------------------------------------------
// 내용 점검·정리

function requireArray(raw, file) {
  if (!Array.isArray(raw)) {
    throw new ContentError(file, '파일 맨 바깥은 대괄호 [ ] 로 감싼 목록이어야 합니다.');
  }
  return raw;
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const strList = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x) : []);

function normalizeCharacters(raw, warnings) {
  const file = DATA_FILES.characters;
  const map = new Map();
  requireArray(raw, file).forEach((c, n) => {
    if (!isObj(c) || typeof c.id !== 'string' || !c.id) {
      warnings.push(`${file} ${n + 1}번째 인물: id가 없어 건너뜁니다.`);
      return;
    }
    if (map.has(c.id)) {
      warnings.push(`${file}: 인물 id "${c.id}"가 두 번 있습니다. 뒤엣것은 무시합니다.`);
      return;
    }
    const name = typeof c.name === 'string' && c.name ? c.name : c.id;
    map.set(c.id, {
      id: c.id,
      name,
      title: typeof c.title === 'string' ? c.title : '',
      portrait: typeof c.portrait === 'string' ? c.portrait : '',
      initials: typeof c.initials === 'string' && c.initials ? c.initials : [...name][0],
    });
  });
  return map;
}

function normalizeEndings(raw, warnings) {
  const file = DATA_FILES.endings;
  const map = new Map();
  requireArray(raw, file).forEach((e, n) => {
    if (!isObj(e)) return;
    if (!STAT_KEYS.includes(e.stat)) {
      warnings.push(`${file} ${n + 1}번째 엔딩: stat "${e.stat}"은 없는 수치입니다. (${STAT_KEYS.join(', ')} 중 하나)`);
      return;
    }
    if (e.at !== STAT_MIN && e.at !== STAT_MAX) {
      warnings.push(`${file} ${n + 1}번째 엔딩: at은 ${STAT_MIN} 또는 ${STAT_MAX}이어야 합니다.`);
      return;
    }
    map.set(`${e.stat}:${e.at}`, {
      stat: e.stat,
      at: e.at,
      title: typeof e.title === 'string' && e.title ? e.title : '임기 종료',
      text: typeof e.text === 'string' ? e.text : '',
      image: typeof e.image === 'string' ? e.image : '',
    });
  });
  for (const k of STAT_KEYS) {
    for (const at of [STAT_MIN, STAT_MAX]) {
      if (!map.has(`${k}:${at}`)) warnings.push(`${file}: "${k}" ${at} 엔딩이 없습니다. 기본 문구로 대신합니다.`);
    }
  }
  return map;
}

function normalizeSide(side, cardId, which, warnings) {
  const file = DATA_FILES.cards;
  const name = which === 'left' ? '왼쪽(left)' : '오른쪽(right)';
  if (!isObj(side)) {
    warnings.push(`${file} "${cardId}": ${name} 선택지가 없습니다.`);
    side = {};
  }
  const effects = {};
  if (isObj(side.effects)) {
    for (const [k, v] of Object.entries(side.effects)) {
      if (!STAT_KEYS.includes(k)) {
        warnings.push(`${file} "${cardId}" ${name}: 수치 이름 "${k}"이 잘못되었습니다. (${STAT_KEYS.join(', ')} 중 하나)`);
      } else if (typeof v !== 'number' || !Number.isFinite(v)) {
        warnings.push(`${file} "${cardId}" ${name}: "${k}" 값은 따옴표 없는 숫자여야 합니다.`);
      } else if (v !== 0) {
        effects[k] = v;
      }
    }
  }
  return {
    label: typeof side.label === 'string' && side.label ? side.label : which === 'left' ? '아니오' : '예',
    effects,
    setFlags: strList(side.setFlags),
    clearFlags: strList(side.clearFlags),
    next: typeof side.next === 'string' && side.next ? side.next : null,
  };
}

function normalizeCards(raw, characters, warnings) {
  const file = DATA_FILES.cards;
  const cards = [];
  const ids = new Set();
  requireArray(raw, file).forEach((c, n) => {
    if (!isObj(c) || typeof c.id !== 'string' || !c.id) {
      warnings.push(`${file} ${n + 1}번째 카드: id가 없어 건너뜁니다.`);
      return;
    }
    if (ids.has(c.id)) {
      warnings.push(`${file}: 카드 id "${c.id}"가 두 번 있습니다. 뒤엣것은 무시합니다.`);
      return;
    }
    ids.add(c.id);
    if (!characters.has(c.who)) {
      warnings.push(`${file} "${c.id}": who "${c.who}"는 characters.json에 없는 인물입니다.`);
    }
    let added = null;
    if (typeof c.added === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c.added)) added = c.added;
    else if (c.added !== undefined && c.added !== null && c.added !== '') {
      warnings.push(`${file} "${c.id}": added는 "2026-10-28" 같은 모양이어야 합니다.`);
    }
    let weight = 1;
    if (typeof c.weight === 'number' && Number.isFinite(c.weight) && c.weight >= 0) weight = c.weight;
    else if (c.weight !== undefined) warnings.push(`${file} "${c.id}": weight는 0 이상의 숫자여야 합니다. 1로 봅니다.`);
    cards.push({
      id: c.id,
      who: typeof c.who === 'string' ? c.who : '',
      text: typeof c.text === 'string' ? c.text : '',
      image: typeof c.image === 'string' ? c.image : '',
      left: normalizeSide(c.left, c.id, 'left', warnings),
      right: normalizeSide(c.right, c.id, 'right', warnings),
      requires: strList(c.requires),
      excludes: strList(c.excludes),
      weight,
      once: c.once === true,
      added,
    });
  });

  // 카드끼리 이어지는 부분 점검
  const settable = new Set();
  const nextTargets = new Set();
  for (const c of cards) {
    for (const side of [c.left, c.right]) {
      side.setFlags.forEach((f) => settable.add(f));
      if (side.next) {
        nextTargets.add(side.next);
        if (!ids.has(side.next)) warnings.push(`${file} "${c.id}": next "${side.next}"라는 카드가 없습니다. 무작위 카드로 넘어갑니다.`);
      }
    }
  }
  for (const c of cards) {
    const missing = c.requires.filter((f) => !settable.has(f));
    if (missing.length) warnings.push(`${file} "${c.id}": requires의 "${missing.join('", "')}" 플래그를 켜는 카드가 없어 이 카드는 나오지 않습니다.`);
    if (c.weight === 0 && !nextTargets.has(c.id)) warnings.push(`${file} "${c.id}": weight가 0인데 next로 이어 주는 카드가 없어 나오지 않습니다.`);
  }
  if (!cards.some((c) => c.weight > 0 && c.requires.length === 0)) {
    throw new ContentError(file, '처음부터 나올 수 있는 카드(requires가 비어 있고 weight가 0보다 큰 카드)가 하나도 없습니다.');
  }
  return cards;
}
