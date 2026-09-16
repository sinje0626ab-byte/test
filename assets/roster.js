/* 추모꾼 명부 — 조회 / 전체 순위 펼치기
   바닐라 자바스크립트만 쓴다. 자료는 assets/data/chumokkun.json 하나뿐이다. */
(function () {
  'use strict';

  var out = document.getElementById('lkOut');
  var input = document.getElementById('lkIn');
  var go = document.getElementById('lkGo');
  var more = document.getElementById('rankMore');
  var body = document.getElementById('rankBody');
  if (!out || !input) return;

  /* 자료 위치는 스타일시트 경로에서 끌어온다 — 페이지 깊이에 상관없이 맞는다 */
  var base = (function () {
    var link = document.querySelector('link[rel="stylesheet"]');
    var href = link ? (link.getAttribute('href') || '') : '';
    var i = href.lastIndexOf('assets/');
    return (i >= 0 ? href.slice(0, i) : '') + 'assets/';
  }());

  var DATA = null, INDEX = null, loading = null;

  function num(n) { return (n || 0).toLocaleString('ko-KR'); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function ymd(s) {
    var p = String(s).split('-');
    return p.length === 3 ? p[0] + '년 ' + (+p[1]) + '월 ' + (+p[2]) + '일' : s;
  }

  function load() {
    if (DATA) return Promise.resolve(DATA);
    if (loading) return loading;
    loading = fetch(base + 'data/chumokkun.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(function (j) {
        DATA = j;
        INDEX = {};
        j.people.forEach(function (p) { INDEX[p.n] = p; });
        return j;
      });
    return loading;
  }

  function fail(msg) {
    out.innerHTML = '<div class="lk-empty">' + esc(msg) + '</div>';
  }

  /* 이름으로 찾기 — 완전 일치 > 앞부분 일치 > 부분 일치 순 */
  function find(q) {
    q = q.trim();
    if (!q) return [];
    var lo = q.toLowerCase(), exact = [], starts = [], has = [];
    DATA.people.forEach(function (p) {
      var n = p.n.toLowerCase();
      if (n === lo) exact.push(p);
      else if (n.indexOf(lo) === 0) starts.push(p);
      else if (n.indexOf(lo) !== -1) has.push(p);
    });
    return exact.concat(starts, has);
  }

  function card(p) {
    var B = DATA.buckets, w = DATA.weights;
    var max = 0;
    p.bm.forEach(function (v) { if (v > max) max = v; });
    var bars = p.b.map(function (bi, k) {
      var b = B[bi], v = p.bm[k];
      var pct = max ? Math.max(3, Math.round(v / max * 100)) : 0;
      return '<li class="pb"><span class="pb-name">' + esc(b.n) + '</span>' +
        '<span class="pb-bar"><i style="width:' + pct + '%"></i></span>' +
        '<span class="pb-num">' + num(v) + '<small>개</small></span></li>';
    }).join('');

    var scoreLine = num(p.m) + ' <span class="pc-op">+</span> ' + num(p.a) + '×' + w.news +
      ' <span class="pc-op">+</span> ' + p.b.length + '×' + w.bucket;

    return '<article class="pcard">' +
      '<header class="pc-head">' +
        '<span class="pc-rank">' + num(p.r) + '<small>위</small></span>' +
        '<h3 class="pc-name">' + esc(p.n) + '</h3>' +
        '<span class="pc-score">' + num(p.s) + '<small>점</small></span>' +
      '</header>' +
      '<div class="pc-formula">' + scoreLine + ' <span class="pc-op">=</span> <b>' + num(p.s) + '</b></div>' +
      '<div class="mm-stats">' +
        '<span><i>발화</i><b>' + num(p.m) + '</b>개</span>' +
        '<span><i>추모 기사</i><b>' + num(p.a) + '</b>건</span>' +
        '<span><i>그 밖의 링크</i><b>' + num(p.l) + '</b>건</span>' +
        '<span><i>참여 추모건</i><b>' + p.b.length + '</b>건</span>' +
        '<span><i>활동일</i><b>' + num(p.d) + '</b>일</span>' +
      '</div>' +
      '<p class="pc-span">' + ymd(p.f) + ' 첫 발화 &mdash; ' + ymd(p.t) + ' 마지막 발화</p>' +
      (bars ? '<ul class="pbs">' + bars + '</ul>' : '') +
      '<div class="pc-share noprint">이 기록의 주소를 그대로 추모방에 붙일 수 있다.' +
        '<button type="button" class="pc-copy" data-copy="' + esc(p.n) + '">주소 복사</button></div>' +
      '</article>';
  }

  function show(q) {
    load().then(function () {
      var hits = find(q);
      if (!hits.length) { fail('「' + q + '」(으)로 찾은 추모꾼이 없다. 이름의 일부만 넣어도 된다.'); return; }
      var html = card(hits[0]);
      if (hits.length > 1) {
        html += '<div class="lk-also">같은 글자가 든 이름 ' + (hits.length - 1) + '명 &mdash; ' +
          hits.slice(1, 13).map(function (p) {
            return '<button type="button" class="pr-link" data-who="' + esc(p.n) + '">' + esc(p.n) + '</button>';
          }).join(' · ') + (hits.length > 13 ? ' …' : '') + '</div>';
      }
      out.innerHTML = html;
    }).catch(function () {
      fail('명부 자료를 불러오지 못했다. 잠시 뒤 다시 조회해 주기 바란다.');
    });
  }

  function open(name) {
    input.value = name;
    show(name);
    out.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  go && go.addEventListener('click', function () { show(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); show(input.value); }
  });

  /* 순위표의 이름을 눌러도 같은 기록이 열린다 */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('pr-link')) {
      open(t.getAttribute('data-who') || t.textContent);
      return;
    }
    if (t && t.classList && t.classList.contains('pc-copy')) {
      var url = location.origin + location.pathname + '?n=' + encodeURIComponent(t.getAttribute('data-copy'));
      var done = function () { t.textContent = '복사했다'; setTimeout(function () { t.textContent = '주소 복사'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt('주소를 복사해 주기 바란다.', url); });
      } else {
        window.prompt('주소를 복사해 주기 바란다.', url);
      }
    }
  });

  /* 전체 보기 — 101위부터 끝까지 붙인다 */
  more && more.addEventListener('click', function () {
    more.disabled = true;
    more.textContent = '불러오는 중…';
    load().then(function (j) {
      var rest = j.people.slice(body.rows.length);
      var html = rest.map(function (p) {
        return '<tr class="pr"><td class="pr-rank">' + p.r + '</td>' +
          '<td class="pr-name"><button type="button" class="pr-link" data-who="' + esc(p.n) + '">' + esc(p.n) + '</button></td>' +
          '<td class="pr-num">' + num(p.s) + '</td><td class="pr-num">' + num(p.m) + '</td>' +
          '<td class="pr-num">' + num(p.a) + '</td><td class="pr-num">' + p.b.length + '</td>' +
          '<td class="pr-num">' + num(p.d) + '</td></tr>';
      }).join('');
      body.insertAdjacentHTML('beforeend', html);
      more.parentNode.removeChild(more);
    }).catch(function () {
      more.disabled = false;
      more.textContent = '불러오지 못했다. 다시 시도 →';
    });
  });

  /* 주소에 ?n=이름 이 붙어 있으면 바로 연다 — 카카오톡에 공유하기 좋다 */
  var qs = new URLSearchParams(location.search).get('n');
  if (qs) open(qs);
}());
