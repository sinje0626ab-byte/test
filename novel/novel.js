/* 추모공화국 연재소설 — 실록 표시 말풍선과 켜고 끄기 */
(function () {
  'use strict';

  var KEY = 'nv-sil-off';
  var toggle = document.querySelector('.nv-toggle');

  function setOff(off) {
    document.body.classList.toggle('nv-off', off);
    if (toggle) {
      toggle.setAttribute('aria-pressed', off ? 'false' : 'true');
      toggle.textContent = off ? '🕯 실록 표시 꺼짐' : '🕯 실록 표시 켜짐';
    }
  }

  if (toggle) {
    var saved = false;
    try { saved = localStorage.getItem(KEY) === '1'; } catch (e) {}
    setOff(saved);
    toggle.addEventListener('click', function () {
      var off = !document.body.classList.contains('nv-off');
      setOff(off);
      try { localStorage.setItem(KEY, off ? '1' : '0'); } catch (e) {}
    });
  }

  var pop = null;
  function close() { if (pop) { pop.remove(); pop = null; } }

  document.addEventListener('click', function (ev) {
    var ref = ev.target.closest && ev.target.closest('.nv-body .sil-ref');
    if (!ref) {
      if (pop && !pop.contains(ev.target)) close();
      return;
    }
    var item = document.getElementById('sil-' + ref.getAttribute('data-n'));
    if (!item) return;
    ev.preventDefault();
    var was = pop && pop.getAttribute('data-n') === ref.getAttribute('data-n');
    close();
    if (was) return;

    pop = document.createElement('div');
    pop.className = 'sil-pop';
    pop.setAttribute('role', 'note');
    pop.setAttribute('data-n', ref.getAttribute('data-n'));
    ['sil-when', 'sil-what', 'sil-go'].forEach(function (c) {
      var el = item.querySelector('.' + c);
      if (el) { pop.appendChild(el.cloneNode(true)); if (c === 'sil-what') pop.appendChild(document.createElement('br')); }
    });
    document.body.appendChild(pop);

    var r = ref.getBoundingClientRect();
    var w = pop.offsetWidth;
    var left = Math.max(16, Math.min(r.left + window.scrollX - w / 2 + r.width / 2, window.scrollX + document.documentElement.clientWidth - w - 16));
    pop.style.left = left + 'px';
    pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
  });

  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); });

  /* ---------------- 펼친 책: 한 쪽씩 넘기기 ---------------- */
  var book = document.getElementById('book');
  var ctrl = document.querySelector('.bk-ctrl');
  if (!book || !ctrl) return;
  var spreads = [].slice.call(book.querySelectorAll('.bk-spread'));
  if (!spreads.length) return;
  var prevBtn = ctrl.querySelector('.bk-prev');
  var nextBtn = ctrl.querySelector('.bk-next');
  var count = ctrl.querySelector('.bk-count');
  var modeBtn = ctrl.querySelector('.bk-mode');
  var nextChapter = book.getAttribute('data-next');
  var MODE_KEY = 'nv-book-mode';
  var cur = 0;

  function paged() { return book.classList.contains('bk--paged'); }

  function show(i, scroll) {
    cur = Math.max(0, Math.min(spreads.length - 1, i));
    spreads.forEach(function (s, k) { s.classList.toggle('is-on', k === cur); });
    count.textContent = (cur + 1) + ' / ' + spreads.length + '쪽';
    prevBtn.disabled = cur === 0;
    var last = cur === spreads.length - 1;
    nextBtn.disabled = last && !nextChapter;
    nextBtn.setAttribute('aria-label', last && nextChapter ? '다음 장' : '다음 쪽');
    nextBtn.textContent = last && nextChapter ? '»' : '›';
    try { history.replaceState(null, '', '#p' + (cur + 1)); } catch (e) {}
    close();
    if (scroll) {
      var top = book.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * .5) spreads[cur].scrollIntoView({ block: 'start' });
    }
  }

  function setMode(isPaged) {
    book.classList.toggle('bk--paged', isPaged);
    prevBtn.hidden = nextBtn.hidden = count.hidden = !isPaged;
    modeBtn.textContent = isPaged ? '이어 보기' : '한 쪽씩 보기';
    try { localStorage.setItem(MODE_KEY, isPaged ? 'paged' : 'scroll'); } catch (e) {}
    if (isPaged) show(cur, false);
  }

  function go(d) {
    if (d > 0 && cur === spreads.length - 1) { if (nextChapter) location.href = nextChapter; return; }
    show(cur + d, true);
  }

  function indexOfHash() {
    var h = location.hash;
    if (!h) return -1;
    var el = document.getElementById(h.slice(1));
    if (!el) return -1;
    var s = el.closest ? el.closest('.bk-spread') : null;
    return s ? spreads.indexOf(s) : -1;
  }

  ctrl.hidden = false;
  var savedMode = 'paged';
  try { savedMode = localStorage.getItem(MODE_KEY) || 'paged'; } catch (e) {}
  var start = indexOfHash();
  cur = start < 0 ? 0 : start;
  setMode(savedMode !== 'scroll');

  prevBtn.addEventListener('click', function () { go(-1); });
  nextBtn.addEventListener('click', function () { go(1); });
  modeBtn.addEventListener('click', function () {
    setMode(!paged());
    spreads[cur].scrollIntoView({ block: 'start' });
  });

  document.addEventListener('keydown', function (ev) {
    if (!paged() || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    var t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); go(1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(-1); }
  });

  var sx = null, sy = null;
  book.addEventListener('touchstart', function (ev) {
    if (ev.touches.length !== 1) return;
    sx = ev.touches[0].clientX; sy = ev.touches[0].clientY;
  }, { passive: true });
  book.addEventListener('touchend', function (ev) {
    if (sx === null || !paged()) return;
    var dx = ev.changedTouches[0].clientX - sx, dy = ev.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* 실록 목록에서 본문으로 돌아가는 링크(#ref-n)가 다른 쪽에 있으면 그 쪽을 연다 */
  window.addEventListener('hashchange', function () {
    var i = indexOfHash();
    if (i >= 0 && paged() && i !== cur) {
      show(i, false);
      var el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView({ block: 'center' });
    }
  });
})();
