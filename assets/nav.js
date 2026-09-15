/* ==========================================================================
   추모공화국 공통 스크립트
   1) 글로벌 네비게이션 — 현재 페이지 자동 활성화 + 모바일 햄버거
   2) 우측 장 목차 레일 — 현재 장 하이라이트 + 현재 조·항 표시 + 클릭 이동
   ========================================================================== */
(function () {
  'use strict';

  /* 네비바 높이만큼의 스크롤 보정값 */
  function navOffset() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
    var n = parseInt(v, 10);
    return (isNaN(n) ? 52 : n) + 16;
  }

  /* ------------------------------------------------------------------
     1) 글로벌 네비게이션
     ------------------------------------------------------------------ */
  function initGnb() {
    var gnb = document.querySelector('.gnb');
    if (!gnb) return;

    /* --- 현재 페이지 활성 표시 (location.pathname 기준 자동 판별) --- */
    function norm(p) {
      p = p.replace(/index\.html$/, '');
      if (p.charAt(p.length - 1) !== '/') p += '/';
      return p;
    }
    var here = norm(location.pathname);
    var links = [].slice.call(gnb.querySelectorAll('.gnb-link'));
    var match = null;

    links.forEach(function (a) {
      if (norm(a.pathname) === here) match = a;
    });
    /* 정확히 일치하는 항목이 없으면 하위 경로까지 포함해 최장 일치로 판정 */
    if (!match) {
      var best = 0;
      links.forEach(function (a) {
        if (a.hasAttribute('data-home')) return;   /* 홈은 모든 경로의 접두사이므로 제외 */
        var p = norm(a.pathname);
        if (here.indexOf(p) === 0 && p.length > best) { best = p.length; match = a; }
      });
    }
    if (match) {
      match.setAttribute('aria-current', 'page');
      match.classList.add('active');
    }

    /* --- 모바일 햄버거 --- */
    var toggle = gnb.querySelector('.gnb-toggle');
    var panel = gnb.querySelector('.gnb-nav');
    if (!toggle || !panel) return;

    function setOpen(open) {
      gnb.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      toggle.textContent = open ? '✕' : '☰';
      document.body.style.overflow = open ? 'hidden' : '';   /* 스크롤 잠금 */
    }

    toggle.addEventListener('click', function () {
      setOpen(!gnb.classList.contains('open'));
    });

    /* 배경(패널 여백) 탭 또는 메뉴 항목 선택 시 닫기 */
    panel.addEventListener('click', function (e) {
      if (e.target === panel || e.target.classList.contains('gnb-link')) setOpen(false);
    });

    /* ESC 로 닫기 */
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && gnb.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* 데스크톱 폭으로 넓어지면 오버레이 상태 해제 */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && gnb.classList.contains('open')) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     2) 우측 장 목차 레일
     ------------------------------------------------------------------ */
  function initChapnav() {
    var nav = document.getElementById('chapnav');
    var paper = document.querySelector('.paper');
    if (!nav || !paper) return;

    var chaps = [].slice.call(paper.querySelectorAll('h2'));
    var articles = [].slice.call(paper.querySelectorAll('.article'));
    if (!chaps.length) { nav.style.display = 'none'; return; }

    var reArt = /제\s*\d+\s*조(?:의\s*\d+)?/;
    var reHead = /^(제\d+편|제\d+장|부칙)\s*(.*)$/;

    /* 좁은 화면 전용 요약 버튼 — 평소에는 현재 장·조만 알약 형태로 떠 있고,
       누를 때만 전체 목차가 펼쳐진다. 데스크톱에서는 CSS로 숨긴다. */
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'chapnav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'chapnavList');
    toggle.setAttribute('aria-label', '장 목차 열기');
    toggle.innerHTML = '<span class="ct-text"><b class="ct-chap"></b><em class="ct-cur"></em></span>' +
                       '<span class="ct-caret" aria-hidden="true">\u25BE</span>';
    nav.appendChild(toggle);

    var list = document.createElement('div');
    list.className = 'chapnav-list';
    list.id = 'chapnavList';
    nav.appendChild(list);

    var ctChap = toggle.querySelector('.ct-chap');
    var ctCur = toggle.querySelector('.ct-cur');

    function setOpen(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '장 목차 닫기' : '장 목차 열기');
    }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!nav.classList.contains('open'));
    });
    /* 목차 바깥을 누르거나 ESC 를 누르면 닫는다 */
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* 제목(h2)에서 항목 생성 */
    var items = [];
    chaps.forEach(function (h, i) {
      if (!h.id) h.id = 'chap-' + i;
      var t = h.textContent.trim();
      var m = t.match(reHead);
      var numPart = m ? m[1] : t;
      var namePart = m ? m[2].replace(/^[·・\-\u2013\u2014\s]+/, '') : '';

      var a = document.createElement('a');
      a.className = 'chapnav-item';
      a.href = '#' + h.id;
      a.setAttribute('data-target', h.id);
      a.innerHTML = '<b>' + numPart + '</b>' +
                    (namePart ? '<span>' + namePart.replace(/</g, '&lt;') + '</span>' : '') +
                    '<em class="cur"></em>';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        setOpen(false);
        var el = document.getElementById(this.getAttribute('data-target'));
        if (!el) return;
        var y = el.getBoundingClientRect().top + window.pageYOffset - navOffset();
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
      list.appendChild(a);
      items.push({ h: h, a: a, cur: a.querySelector('.cur'), num: numPart });
    });

    function artLabel(a) {
      var num = a.querySelector('.num');
      if (!num) return '';
      var mm = num.textContent.match(reArt);
      return mm ? mm[0].replace(/\s+/g, '') : '';
    }

    var ticking = false, lastActive = -1;
    function update() {
      ticking = false;
      var ref = navOffset() + 82;          /* 네비바 아래 기준선 */
      var idx = 0;
      for (var i = 0; i < chaps.length; i++) {
        if (chaps[i].getBoundingClientRect().top <= ref) idx = i; else break;
      }

      /* 현재 조·항 라벨 */
      var cur = null;
      for (var j = 0; j < articles.length; j++) {
        if (articles[j].getBoundingClientRect().top <= ref) cur = articles[j]; else break;
      }
      var label = '';
      if (cur) {
        var art = artLabel(cur);
        var clause = '';
        var cls = cur.querySelectorAll('.clause');
        for (var k = 0; k < cls.length; k++) {
          var cn = cls[k].querySelector('.cn');
          if (cn && cls[k].getBoundingClientRect().top <= ref) clause = cn.textContent.trim();
        }
        label = art ? (art + (clause ? ' ' + clause : '')) : '';
      }

      if (idx !== lastActive) {
        items.forEach(function (it, n) {
          it.a.classList.toggle('active', n === idx);
          if (n !== idx) it.cur.textContent = '';
        });
        var act = items[idx].a;
        var r = act.getBoundingClientRect(), nr = list.getBoundingClientRect();
        if (r.top < nr.top || r.bottom > nr.bottom) {
          list.scrollTop += (r.top - nr.top) - (nr.height / 2 - r.height / 2);
        }
        ctChap.textContent = items[idx].num;
        lastActive = idx;
      }
      items[idx].cur.textContent = label;
      ctCur.textContent = label;
    }

    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ------------------------------------------------------------------ */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () { initGnb(); initChapnav(); });
})();
