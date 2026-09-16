/* ==========================================================================
   추모방 재생목록 — 대화 기록에서 공유된 곡·무대·추모 영상
   썸네일만 먼저 띄우고, 선택한 항목만 재생기를 붙인다.
   유튜브에는 선택하기 전까지 아무것도 요청하지 않는다(썸네일은 예외).
   영상이 사라졌으면 썸네일이 실패하므로 그 항목은 스스로 숨는다.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.getElementById('rvRoot');
  if (!root) return;
  var count = document.getElementById('rvCount');

  var base = (function () {
    var link = document.querySelector('link[rel="stylesheet"]');
    var href = link ? (link.getAttribute('href') || '') : '';
    var i = href.lastIndexOf('assets/');
    return (i >= 0 ? href.slice(0, i) : '') + 'assets/';
  }());

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function ymd(s) {
    var p = String(s).split('-');
    return p.length === 3 ? p[0].slice(2) + '. ' + (+p[1]) + '. ' + (+p[2]) + '.' : s;
  }
  function kindClass(k) {
    return k === '곡' ? 'rv--song' : k === '무대' ? 'rv--stage' : 'rv--tribute';
  }

  function card(it) {
    return '<li class="rv" data-v="' + esc(it.v) + '">' +
      '<button type="button" class="rv-thumb" aria-label="' + esc(it.as) + ' 재생">' +
        '<img src="https://i.ytimg.com/vi/' + esc(it.v) + '/mqdefault.jpg" alt="" loading="lazy" width="320" height="180">' +
        '<span class="rv-play" aria-hidden="true">▶</span>' +
        '<span class="rv-kind ' + kindClass(it.kind) + '">' + esc(it.kind) + '</span>' +
      '</button>' +
      '<div class="rv-body">' +
        '<p class="rv-as">' + esc(it.as) + '</p>' +
        '<p class="rv-by">' + ymd(it.on) + ' · ' + esc(it.by) + ' 공유</p>' +
      '</div></li>';
  }

  function group(g) {
    return '<section class="rvg" id="rv-' + esc(g.id) + '">' +
      '<h3 class="rvg-title">' + esc(g.title) + '<span class="rvg-when">' + esc(g.when) + '</span>' +
        '<span class="rvg-n">' + g.items.length + '건</span></h3>' +
      '<p class="rvg-desc">' + esc(g.desc) + '</p>' +
      '<ul class="rvs">' + g.items.map(card).join('') + '</ul>' +
      '</section>';
  }

  /* 썸네일이 오지 않는 이유는 두 가지다 — 영상이 내려갔거나, 보는 쪽 망이
     썸네일 주소를 막았거나. 둘을 구별할 수 없으므로 항목을 지우지 아니하고
     문구만으로 된 자리로 바꾼다. 선택하면 그대로 재생을 시도한다. */
  root.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var li = img.closest ? img.closest('.rv') : null;
    if (li) li.classList.add('rv--nothumb');
  }, true);

  function tally() {
    if (count) count.textContent = root.querySelectorAll('.rv').length + '건';
  }

  /* 선택하면 그 자리에 재생기를 붙인다. 쿠키를 쓰지 않는 주소를 쓴다. */
  root.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.rv-thumb') : null;
    if (!btn) return;
    var li = btn.closest('.rv');
    var v = li.getAttribute('data-v');
    var box = document.createElement('div');
    box.className = 'rv-frame';
    box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v +
      '?autoplay=1&rel=0" title="영상 재생" loading="lazy" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    btn.parentNode.replaceChild(box, btn);
  });

  fetch(base + 'data/roomlist.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) {
      var gs = (j.groups || []).filter(function (g) { return g.items && g.items.length; });
      if (!gs.length) throw new Error('empty');
      root.innerHTML = gs.map(group).join('');
      tally();
    })
    .catch(function () {
      root.innerHTML = '<div class="lk-empty">재생목록을 불러오지 못했다. 잠시 후 다시 시도하기 바란다.</div>';
    });
}());
