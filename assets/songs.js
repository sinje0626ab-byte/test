/* ==========================================================================
   추모가요 — 음원 목록 재생기
   자료는 assets/data/songs.json 하나이며, 목록에 한 줄을 더하면 곡이 늘어난다.
   바닐라 자바스크립트만 쓴다.
   ========================================================================== */
(function () {
  'use strict';

  var list = document.getElementById('plList');
  var audio = document.getElementById('plAudio');
  if (!list || !audio) return;

  var nowTitle = document.getElementById('plTitle');
  var nowMeta  = document.getElementById('plMeta');
  var nowDesc  = document.getElementById('plDesc');
  var playBtn  = document.getElementById('plPlay');
  var prevBtn  = document.getElementById('plPrev');
  var nextBtn  = document.getElementById('plNext');
  var seek     = document.getElementById('plSeek');
  var tCur     = document.getElementById('plCur');
  var tDur     = document.getElementById('plDur');
  var autoBox  = document.getElementById('plAuto');
  var empty    = document.getElementById('plEmpty');

  /* 자료 위치는 스타일시트 경로에서 끌어온다 — 페이지 깊이에 상관없이 맞는다 */
  var base = (function () {
    var link = document.querySelector('link[rel="stylesheet"]');
    var href = link ? (link.getAttribute('href') || '') : '';
    var i = href.lastIndexOf('assets/');
    return (i >= 0 ? href.slice(0, i) : '') + 'assets/';
  }());

  var tracks = [], idx = -1, seeking = false;

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render() {
    list.innerHTML = tracks.map(function (t, i) {
      return '<li class="tr" data-i="' + i + '">' +
        '<button type="button" class="tr-btn">' +
          '<span class="tr-no">' + (i + 1) + '</span>' +
          '<span class="tr-main">' +
            '<span class="tr-title">' + esc(t.title) + '</span>' +
            '<span class="tr-sub">' + esc(t.kind) + ' · 작사·작곡 ' + esc(t.by) + '</span>' +
          '</span>' +
          '<span class="tr-len">' + fmt(t.sec) + '</span>' +
          '<span class="tr-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '</button></li>';
    }).join('');
  }

  function mark() {
    [].slice.call(list.querySelectorAll('.tr')).forEach(function (li, i) {
      li.classList.toggle('on', i === idx);
      var b = li.querySelector('.tr-btn');
      if (b) b.setAttribute('aria-current', i === idx ? 'true' : 'false');
    });
  }

  function load(i, play) {
    if (i < 0 || i >= tracks.length) return;
    idx = i;
    var t = tracks[i];
    audio.src = base + t.src;
    if (nowTitle) nowTitle.textContent = t.title;
    if (nowMeta) {
      nowMeta.innerHTML = esc(t.kind) + ' · 작사·작곡 <b>' + esc(t.by) + '</b> · ' + esc(t.on) +
        (t.link ? ' · <a href="' + esc(t.link) + '">' + esc(t.linkText || '자세히') + ' &rarr;</a>' : '');
    }
    if (nowDesc) nowDesc.textContent = t.desc || '';
    if (tDur) tDur.textContent = fmt(t.sec);
    if (tCur) tCur.textContent = '0:00';
    if (seek) seek.value = 0;
    mark();
    if (play) audio.play().catch(function () { /* 자동 재생이 막힌 경우 */ });
  }

  function setPlaying(on) {
    document.body.classList.toggle('pl-playing', on);
    if (!playBtn) return;
    playBtn.textContent = on ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', on ? '정지' : '재생');
  }

  function step(d) {
    if (!tracks.length) return;
    load((idx + d + tracks.length) % tracks.length, true);
  }

  /* --- 이벤트 --- */
  list.addEventListener('click', function (e) {
    var li = e.target.closest ? e.target.closest('.tr') : null;
    if (!li) return;
    var i = +li.getAttribute('data-i');
    if (i === idx && !audio.paused) { audio.pause(); return; }
    if (i === idx) { audio.play().catch(function () {}); return; }
    load(i, true);
  });

  playBtn && playBtn.addEventListener('click', function () {
    if (idx < 0) { load(0, true); return; }
    if (audio.paused) audio.play().catch(function () {}); else audio.pause();
  });
  prevBtn && prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn && nextBtn.addEventListener('click', function () { step(1); });

  audio.addEventListener('play', function () { setPlaying(true); });
  audio.addEventListener('pause', function () { setPlaying(false); });
  audio.addEventListener('ended', function () {
    setPlaying(false);
    if (autoBox && autoBox.checked) step(1);
  });

  function showDur() {
    if (tDur && isFinite(audio.duration) && audio.duration > 0) tDur.textContent = fmt(audio.duration);
  }
  audio.addEventListener('loadedmetadata', showDur);
  audio.addEventListener('durationchange', showDur);

  audio.addEventListener('timeupdate', function () {
    if (seeking) return;
    if (tCur) tCur.textContent = fmt(audio.currentTime);
    if (seek && audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  });
  if (seek) {
    seek.addEventListener('input', function () {
      seeking = true;
      if (audio.duration && tCur) tCur.textContent = fmt(audio.duration * (seek.value / 100));
    });
    seek.addEventListener('change', function () {
      if (audio.duration) audio.currentTime = audio.duration * (seek.value / 100);
      seeking = false;
    });
  }

  /* 좌우 방향키로 15초 이동, 스페이스로 재생·정지 (입력 칸에서는 동작하지 않는다) */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === ' ') { e.preventDefault(); playBtn && playBtn.click(); }
    else if (e.key === 'ArrowRight' && audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
    else if (e.key === 'ArrowLeft' && audio.duration) audio.currentTime = Math.max(0, audio.currentTime - 15);
  });

  /* --- 목록 불러오기 --- */
  fetch(base + 'data/songs.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) {
      tracks = (j.tracks || []).filter(function (t) { return t && t.src; });
      if (!tracks.length) throw new Error('empty');
      render();
      load(0, false);
      if (empty) empty.hidden = true;
      /* 주소에 #곡아이디 가 붙어 있으면 그 곡을 고른다 */
      var h = (location.hash || '').replace('#', '');
      if (h) {
        for (var i = 0; i < tracks.length; i++) {
          if (tracks[i].id === h) { load(i, false); break; }
        }
      }
    })
    .catch(function () {
      if (empty) {
        empty.hidden = false;
        empty.textContent = '음원 목록을 불러오지 못했다. 잠시 후 다시 시도하기 바란다.';
      }
    });
}());
