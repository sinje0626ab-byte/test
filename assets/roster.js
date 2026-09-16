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
  /* 재적 구분 — 0 체류중 / 1 자진 퇴거 / 2 강제 퇴거 */
  function badge(p) {
    if (p.g === 2) return '<span class="pg pg--kick">강제 퇴거</span>';
    if (p.g === 1) return '<span class="pg pg--out">퇴거</span>';
    return '';
  }
  function standing(p) {
    if (!p.g) return '<span class="pc-stand pc-stand--in">재적 구분 · 체류중</span>';
    var when = p.gd ? ymd(p.gd) + ' ' : '';
    return '<span class="pc-stand pc-stand--out">재적 구분 · ' + when +
      (p.g === 2 ? '강제 퇴거' : '자진 퇴거') + '</span>';
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

  /* 성명 조회 — 완전 일치 · 전방 일치 · 부분 일치 순으로 배열한다 */
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
        '<h3 class="pc-name">' + esc(p.n) + badge(p) + '</h3>' +
        '<span class="pc-score">' + num(p.s) + '<small>점</small></span>' +
      '</header>' +
      '<div class="pc-formula">' + scoreLine + ' <span class="pc-op">=</span> <b>' + num(p.s) + '</b></div>' +
      '<div class="mm-stats">' +
        '<span><i>발화</i><b>' + num(p.m) + '</b>개</span>' +
        '<span><i>추모 기사</i><b>' + num(p.a) + '</b>건</span>' +
        '<span><i>기타 링크</i><b>' + num(p.l) + '</b>건</span>' +
        '<span><i>참여 추모건</i><b>' + p.b.length + '</b>건</span>' +
        '<span><i>활동일</i><b>' + num(p.d) + '</b>일</span>' +
      '</div>' +
      '<p class="pc-span">최초 발화 ' + ymd(p.f) + ' &mdash; 최종 발화 ' + ymd(p.t) + '<br>' + standing(p) + '</p>' +
      (bars ? '<ul class="pbs">' + bars + '</ul>' : '') +
      '<div class="pc-share noprint">본 기록의 주소는 그대로 인용·배포할 수 있다.' +
        '<button type="button" class="pc-copy" data-copy="' + esc(p.n) + '">주소 복사</button></div>' +
      '</article>';
  }

  /* 결과가 그려진 뒤에 그 자리로 옮긴다 — 조회하면 바로 보이도록 */
  function focusOut(smooth) {
    var el = out.querySelector('.pcard') || out.firstElementChild;
    if (!el) return;
    requestAnimationFrame(function () {
      try { el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' }); }
      catch (e) { el.scrollIntoView(); }
    });
  }

  function show(q, smooth) {
    load().then(function () {
      var hits = find(q);
      if (!hits.length) {
        fail('「' + q + '」(으)로 조회된 등재자가 없다. 성명의 일부만 입력하여도 조회된다.');
        focusOut(smooth); return;
      }
      var html = card(hits[0]);
      if (hits.length > 1) {
        html += '<div class="lk-also">동일 문자열이 포함된 성명 ' + (hits.length - 1) + '건 &mdash; ' +
          hits.slice(1, 13).map(function (p) {
            return '<button type="button" class="pr-link" data-who="' + esc(p.n) + '">' + esc(p.n) + '</button>';
          }).join(' · ') + (hits.length > 13 ? ' …' : '') + '</div>';
      }
      out.innerHTML = html;
      focusOut(smooth);
    }).catch(function () {
      fail('명부 자료를 조회할 수 없다. 잠시 후 재조회하기 바란다.');
    });
  }

  function open(name, smooth) {
    input.value = name;
    show(name, smooth);
  }

  go && go.addEventListener('click', function () { show(input.value, true); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); show(input.value, true); }
  });

  /* 순위표의 성명을 선택하여도 동일한 기록이 표시된다 */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('pr-link')) {
      open(t.getAttribute('data-who') || t.textContent, true);
      return;
    }
    if (t && t.classList && t.classList.contains('pc-copy')) {
      var url = location.origin + location.pathname + '?n=' + encodeURIComponent(t.getAttribute('data-copy'));
      var done = function () { t.textContent = '복사 완료'; setTimeout(function () { t.textContent = '주소 복사'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt('아래 주소를 복사하기 바란다.', url); });
      } else {
        window.prompt('아래 주소를 복사하기 바란다.', url);
      }
    }
  });

  /* 전체 보기 — 101위부터 끝까지 붙인다 */
  more && more.addEventListener('click', function () {
    more.disabled = true;
    more.textContent = '조회 중';
    load().then(function (j) {
      var rest = j.people.slice(body.rows.length);
      var html = rest.map(function (p) {
        return '<tr class="pr" data-gone="' + p.g + '"><td class="pr-rank">' + p.r + '</td>' +
          '<td class="pr-name"><button type="button" class="pr-link" data-who="' + esc(p.n) + '">' + esc(p.n) + '</button>' + badge(p) + '</td>' +
          '<td class="pr-num">' + num(p.s) + '</td><td class="pr-num">' + num(p.m) + '</td>' +
          '<td class="pr-num">' + num(p.a) + '</td><td class="pr-num">' + p.b.length + '</td>' +
          '<td class="pr-num">' + num(p.d) + '</td></tr>';
      }).join('');
      body.insertAdjacentHTML('beforeend', html);
      more.parentNode.removeChild(more);
    }).catch(function () {
      more.disabled = false;
      more.textContent = '조회할 수 없다. 재시도 →';
    });
  });

  /* 체류자만 표시 */
  var only = document.getElementById('onlyStay');
  only && only.addEventListener('change', function () {
    body.classList.toggle('only-stay', only.checked);
  });

  /* 주소에 ?n=성명 이 붙어 있으면 해당 기록을 즉시 표시한다 */
  var qs = new URLSearchParams(location.search).get('n');
  if (qs) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    open(qs, false);
  }
}());
