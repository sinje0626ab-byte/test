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
    /* 정확히 일치하는 항목이 없으면 하위 경로까지 포함해 최장 일치로 판정한다.
       data-match 는 메뉴 항목과 경로가 다른 하위 페이지를 묶어 주기 위한 것으로,
       공백으로 구분한 상대 경로를 적으면 그 경로도 같은 항목으로 본다. */
    if (!match) {
      var best = 0;
      function consider(a, raw) {
        var p;
        try { p = norm(new URL(raw, location.href).pathname); } catch (e) { return; }
        if (here.indexOf(p) === 0 && p.length > best) { best = p.length; match = a; }
      }
      links.forEach(function (a) {
        if (!a.hasAttribute('data-home')) consider(a, a.getAttribute('href'));  /* 홈은 모든 경로의 접두사이므로 제외 */
        (a.getAttribute('data-match') || '').split(/\s+/).forEach(function (seg) {
          if (seg) consider(a, seg);
        });
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

  /* ------------------------------------------------------------------
     3) 국무위원 초상 — 확장자를 차례로 시도하고, 끝내 없으면 이모지로 되돌린다
     ------------------------------------------------------------------ */
  function initPortraits() {
    var NEXT = { '.png': '.jpg', '.jpg': '.jpeg', '.jpeg': '.webp' };
    [].slice.call(document.querySelectorAll('.oc-photo, .inaug-img')).forEach(function (img) {
      function fallback() {
        var src = img.getAttribute('src') || '';
        var ext = (src.match(/\.[a-z]+$/i) || [''])[0].toLowerCase();
        if (NEXT[ext]) { img.setAttribute('src', src.slice(0, -ext.length) + NEXT[ext]); return; }
        /* 파일이 없으면 이모지 또는 안내 상자가 대신 드러난다.
           inaug 컨테이너를 찾아 올라가되, 문서 끝까지 올라가지 않도록 막는다 —
           document 에는 className 이 없어 그대로 두면 예외가 난다. */
        var fig = img.parentNode;
        while (fig && fig !== document.body && typeof fig.className === 'string') {
          if (fig.className.indexOf('inaug') !== -1) break;
          fig = fig.parentNode;
        }
        if (fig && fig !== document.body && typeof fig.className === 'string' &&
            fig.className.indexOf('inaug') !== -1) {
          fig.className += ' inaug--missing';
        }
        if (img.parentNode) img.parentNode.removeChild(img);
      }
      img.addEventListener('error', fallback);
      /* defer 스크립트라 이미 실패했을 수 있으므로 한 번 확인한다 */
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

  /* ------------------------------------------------------------------ */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  /* 건국일로부터 지난 날수를 매일 다시 센다 */
  function initCounters() {
    [].slice.call(document.querySelectorAll('[data-since]')).forEach(function (el) {
      var p = (el.getAttribute('data-since') || '').split('-');
      if (p.length !== 3) return;
      var from = new Date(+p[0], +p[1] - 1, +p[2]);
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var days = Math.round((today - from) / 86400000);
      if (days < 0 || !isFinite(days)) return;
      el.innerHTML = days.toLocaleString('ko-KR') + '<small>일째</small>';
    });
  }

  /* 국기 로고와 소개 상단 이미지는 파일이 있을 때만 쓴다.
     없으면 로고는 기존 촛불 이모지가, 소개 이미지는 아무것도 남지 않는다. */
  function initBrandArt() {
    /* 자산 경로는 스타일시트 href 에서 얻는다 — 페이지 깊이마다 ../ 수가 다르다 */
    var base = (function () {
      var link = document.querySelector('link[rel="stylesheet"]');
      var href = link ? (link.getAttribute('href') || '') : '';
      var i = href.lastIndexOf('assets/');
      return (i >= 0 ? href.slice(0, i) : '') + 'assets/';
    }());
    var FLAG = base + 'brand/flag.webp';

    function flagImg(cls, alt) {
      var im = document.createElement('img');
      im.className = cls; im.src = FLAG; im.alt = alt;
      return im;
    }
    function fallbackSpan(cls, text) {
      var sp = document.createElement('span');
      sp.className = cls; sp.setAttribute('aria-hidden', 'true');
      sp.textContent = text;
      return sp;
    }

    /* 브라우저에 옛 HTML 이 캐시된 채 CSS·JS 만 새로 받은 경우에도 국기가 보이도록,
       이모지로 남아 있는 표지·워터마크·브랜드 로고를 실행 시점에 올려 준다.
       이미 국기 마크업인 페이지에서는 아무 일도 하지 않는다. */
    [].slice.call(document.querySelectorAll('.cover .emblem')).forEach(function (el) {
      var hero = /(^|\s)hero(\s|$)/.test(el.parentNode.className || '');
      var fig = document.createElement('figure');
      fig.className = 'natflag' + (hero ? ' natflag--hero' : '');
      fig.appendChild(flagImg('natflag-img', '추모공화국 국기'));
      fig.appendChild(fallbackSpan('natflag-fallback', (el.textContent || '').trim()));
      el.parentNode.replaceChild(fig, el);
    });
    [].slice.call(document.querySelectorAll('.watermark')).forEach(function (el) {
      if (el.querySelector('.watermark-img')) return;
      var mark = (el.textContent || '').trim();
      el.textContent = '';
      el.appendChild(flagImg('watermark-img', ''));
      el.appendChild(fallbackSpan('watermark-fallback', mark));
    });
    var brand = document.querySelector('.gnb-brand');
    if (brand && !brand.querySelector('.gnb-logo')) {
      var old = brand.querySelector('span[aria-hidden="true"]');
      if (old && !old.className) old.className = 'gnb-candle';
      brand.insertBefore(flagImg('gnb-logo', ''), brand.firstChild);
    }

    var logo = document.querySelector('.gnb-logo');
    if (logo) {
      var candle = document.querySelector('.gnb-candle');
      var show = function () { logo.className += ' is-on'; if (candle) candle.hidden = true; };
      var drop = function () { if (logo.parentNode) logo.parentNode.removeChild(logo); };
      if (logo.complete) { if (logo.naturalWidth) show(); else drop(); }
      else { logo.addEventListener('load', show); logo.addEventListener('error', drop); }
    }
    /* 표지와 워터마크의 국기 — 실패하면 각 페이지의 원래 이모지로 되돌린다 */
    [['.natflag', '.natflag-img', 'natflag--missing'],
     ['.watermark', '.watermark-img', 'watermark--missing']].forEach(function (spec) {
      [].slice.call(document.querySelectorAll(spec[0])).forEach(function (box) {
        var img = box.querySelector(spec[1]);
        var miss = function () { box.className += ' ' + spec[2]; };
        if (!img) { miss(); return; }
        if (img.complete) { if (!img.naturalWidth) miss(); }
        else img.addEventListener('error', miss);
      });
    });
    var hero = document.querySelector('.hero-board');
    if (hero) {
      var img = hero.querySelector('.hero-img');
      var hide = function () { hero.hidden = true; };
      if (!img) hide();
      else if (img.complete) { if (!img.naturalWidth) hide(); }
      else img.addEventListener('error', hide);
    }
  }


  /* ------------------------------------------------------------------
     6) 상단 메뉴의 추모꾼 조회 칸
     명부 자료는 조회 칸을 최초로 선택하였을 때 한 번만 내려받는다.
     자바스크립트가 없거나 자료를 내려받지 못하여도 폼 제출은 정상 동작한다.
     ------------------------------------------------------------------ */
  function initFind() {
    var form = document.querySelector('.gnb-find');
    if (!form) return;
    var input = form.querySelector('.gnb-find-in');
    var list = form.querySelector('.gnb-find-list');
    if (!input || !list) return;

    var base = (function () {
      var link = document.querySelector('link[rel="stylesheet"]');
      var href = link ? (link.getAttribute('href') || '') : '';
      var i = href.lastIndexOf('assets/');
      return (i >= 0 ? href.slice(0, i) : '') + 'assets/';
    }());

    var people = null, loading = null, cur = -1, opts = [];

    /* 폼 제출에 기대지 않고 직접 옮긴다 — 어느 브라우저에서나 같게 동작한다 */
    function goTo(name) {
      var act = form.getAttribute('action') || '';
      location.href = act + '?n=' + encodeURIComponent(name);
    }

    function load() {
      if (people) return Promise.resolve(people);
      if (loading) return loading;
      loading = fetch(base + 'data/chumokkun.json', { cache: 'force-cache' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) { people = j.people; return people; });
      return loading;
    }

    function esc(t) {
      return String(t).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    function close() { list.hidden = true; list.innerHTML = ''; opts = []; cur = -1; }

    /* 완전 일치 · 전방 일치 · 부분 일치 순으로 8인까지 제시한다 */
    function match(q) {
      var lo = q.toLowerCase(), a = [], b = [], c = [];
      for (var i = 0; i < people.length && a.length + b.length + c.length < 60; i++) {
        var n = people[i].n.toLowerCase();
        if (n === lo) a.push(people[i]);
        else if (n.indexOf(lo) === 0) b.push(people[i]);
        else if (n.indexOf(lo) !== -1) c.push(people[i]);
      }
      return a.concat(b, c).slice(0, 8);
    }

    function render(q) {
      var hits = match(q);
      if (!hits.length) {
        list.innerHTML = '<li class="gnb-find-none">조회 결과 없음</li>';
        list.hidden = false; opts = []; cur = -1; return;
      }
      list.innerHTML = hits.map(function (p) {
        var mark = p.g === 2 ? '<span class="pg pg--kick">강제 퇴거</span>'
                : p.g === 1 ? '<span class="pg pg--out">퇴거</span>' : '';
        return '<li><button type="button" class="gnb-find-opt" data-who="' + esc(p.n) + '">' +
          '<span class="gfo-rank">' + p.r + '위</span>' +
          '<span class="gfo-name">' + esc(p.n) + mark + '</span>' +
          '<span class="gfo-num">' + p.s.toLocaleString('ko-KR') + '점</span></button></li>';
      }).join('');
      list.hidden = false;
      opts = [].slice.call(list.querySelectorAll('.gnb-find-opt'));
      cur = -1;
    }

    function update() {
      var q = input.value.trim();
      if (!q) { close(); return; }
      load().then(function () { if (input.value.trim() === q) render(q); })
            .catch(function () { close(); });   /* 자료를 못 받으면 폼 제출로 넘긴다 */
    }

    function move(d) {
      if (!opts.length) return;
      if (cur >= 0) opts[cur].classList.remove('on');
      cur = (cur + d + opts.length) % opts.length;
      opts[cur].classList.add('on');
      opts[cur].scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('focus', function () { load(); });
    input.addEventListener('input', update);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Escape') { close(); }
      else if (e.key === 'Enter' && cur >= 0 && opts[cur]) {
        e.preventDefault();
        goTo(opts[cur].getAttribute('data-who'));
      }
    });

    list.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.gnb-find-opt') : null;
      if (!btn) return;
      e.preventDefault();
      goTo(btn.getAttribute('data-who'));
    });

    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) close();
    });
  }

  ready(function () { initGnb(); initChapnav(); initPortraits(); initCounters(); initBrandArt(); initFind(); });
})();
