/* ==========================================================================
   대통령 공개일정 — 달력 월 전환 및 오늘 표시
   ========================================================================== */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var panels = [].slice.call(document.querySelectorAll('.cal-panel'));
    var label = document.getElementById('calLabel');
    var prev = document.getElementById('calPrev');
    var next = document.getElementById('calNext');
    if (!panels.length || !label || !prev || !next) return;

    /* --- 오늘 날짜 표시 (실제 오늘을 기준으로 한다) --- */
    var now = new Date();
    var today = now.getFullYear() + '-' +
                ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
                ('0' + now.getDate()).slice(-2);
    var cell = document.querySelector('.cal-day[data-date="' + today + '"]');
    if (cell) {
      cell.className += ' cal-day--today';
      cell.setAttribute('aria-current', 'date');
      var num = cell.querySelector('.cal-num');
      if (num) num.insertAdjacentHTML('afterend', '<span class="cal-today-tag">오늘</span>');
      var row = document.getElementById('d' + today);
      if (row) row.className += ' dt-row--today';
    }

    /* --- 월 전환 --- */
    var cur = 0;
    panels.forEach(function (p, i) {
      if (p.getAttribute('data-month') === today.slice(0, 7)) cur = i;   /* 오늘이 든 달부터 */
    });

    function show(i) {
      cur = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach(function (p, n) {
        p.className = 'cal-panel' + (n === cur ? '' : ' cal-panel--hidden');
      });
      var m = panels[cur].getAttribute('data-month').split('-');
      label.textContent = m[0] + '년 ' + parseInt(m[1], 10) + '월';
      prev.disabled = (cur === 0);
      next.disabled = (cur === panels.length - 1);
    }

    prev.addEventListener('click', function () { show(cur - 1); });
    next.addEventListener('click', function () { show(cur + 1); });

    /* 좌우 방향키로도 넘긴다 */
    document.addEventListener('keydown', function (e) {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });

    /* 날짜 칸을 누르면 아래 상세 일정으로 이동 */
    [].slice.call(document.querySelectorAll('.cal-day[data-date]')).forEach(function (c) {
      c.addEventListener('click', function () {
        var row = document.getElementById('d' + c.getAttribute('data-date'));
        if (!row) return;
        var v = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
        var off = (parseInt(v, 10) || 52) + 16;
        window.scrollTo({ top: row.getBoundingClientRect().top + window.pageYOffset - off, behavior: 'smooth' });
        row.className += ' dt-row--hit';
        setTimeout(function () { row.className = row.className.replace(' dt-row--hit', ''); }, 1400);
      });
    });

    show(cur);
  });
})();
