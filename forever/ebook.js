/* 「영원하라 추모공화국」 전자책 — 한 면씩 넘기기, 목차, 진행 막대 */
(function () {
  'use strict';

  var book = document.getElementById('book');
  if (!book) return;
  var spreads = [].slice.call(book.querySelectorAll('.eb-spread'));
  var total = +book.getAttribute('data-total');          // 본문 쪽 수 (표지·끝 제외)
  var prevBtn = document.querySelector('.eb-prev');
  var nextBtn = document.querySelector('.eb-next');
  var count = document.querySelector('.eb-count');
  var bar = document.querySelector('.eb-progress span');
  var toc = document.getElementById('toc');
  var tocBtn = document.querySelector('.eb-tocbtn');
  var narrow = window.matchMedia('(max-width: 760px)');
  var cur = 0;

  document.documentElement.classList.add('js');

  function label(i) {
    if (i === 0) return '표지';
    if (i > total) return '끝';
    return i + ' / ' + total + '쪽';
  }

  function show(i, dir) {
    i = Math.max(0, Math.min(spreads.length - 1, i));
    book.classList.toggle('back', dir < 0);
    cur = i;
    spreads.forEach(function (s, k) { s.classList.toggle('is-on', k === cur); });
    count.textContent = label(cur);
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === spreads.length - 1;
    bar.style.width = (cur / (spreads.length - 1) * 100) + '%';
    try { history.replaceState(null, '', '#p' + cur); } catch (e) {}
    [].forEach.call(toc.querySelectorAll('a[data-go]'), function (a) {
      var go = +a.getAttribute('data-go');
      var next = a.parentNode.nextElementSibling;
      while (next && !next.querySelector('a[data-go]')) next = next.nextElementSibling;
      var end = next ? +next.querySelector('a').getAttribute('data-go') : Infinity;
      if (cur >= go && cur < end && cur <= total) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    if (dir && narrow.matches) window.scrollTo({ top: 0, behavior: 'smooth' });
    // 다음 면 그림을 미리 불러 둔다
    var nx = spreads[cur + 1];
    if (nx) [].forEach.call(nx.querySelectorAll('img[loading="lazy"]'), function (im) { im.loading = 'eager'; });
  }

  function go(d) { show(cur + d, d); }

  function fromHash() {
    var m = /^#p(\d+)$/.exec(location.hash);
    return m ? +m[1] : 0;
  }

  show(fromHash(), 0);

  prevBtn.addEventListener('click', function () { go(-1); });
  nextBtn.addEventListener('click', function () { go(1); });

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest && ev.target.closest('[data-go]');
    if (t) {
      ev.preventDefault();
      var to = +t.getAttribute('data-go');
      show(to, to >= cur ? 1 : -1);
      closeToc();
      return;
    }
    if (!toc.hidden && !toc.contains(ev.target) && ev.target !== tocBtn) closeToc();
  });

  function closeToc() { toc.hidden = true; tocBtn.setAttribute('aria-expanded', 'false'); }
  tocBtn.addEventListener('click', function () {
    toc.hidden = !toc.hidden;
    tocBtn.setAttribute('aria-expanded', String(!toc.hidden));
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.key === 'Escape') { closeToc(); return; }
    if (ev.key === 'ArrowRight' || ev.key === 'PageDown') { ev.preventDefault(); go(1); }
    else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') { ev.preventDefault(); go(-1); }
    else if (ev.key === 'Home') { show(0, -1); }
  });

  // 휴대폰: 옆으로 밀어서 넘기기
  var sx = null, sy = null;
  book.addEventListener('touchstart', function (ev) {
    if (ev.touches.length !== 1) return;
    sx = ev.touches[0].clientX; sy = ev.touches[0].clientY;
  }, { passive: true });
  book.addEventListener('touchend', function (ev) {
    if (sx === null) return;
    var dx = ev.changedTouches[0].clientX - sx, dy = ev.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener('hashchange', function () {
    var i = fromHash();
    if (i !== cur) show(i, i > cur ? 1 : -1);
  });
})();
