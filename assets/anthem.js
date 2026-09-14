/* ==========================================================================
   추모공화국 국가 플레이어
   .anthem 컨테이너 단위로 동작하므로 한 페이지에 여러 개 있어도 된다.
   ========================================================================== */
(function () {
  'use strict';

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function initPlayer(root) {
    var audio = root.querySelector('audio');
    var playBtn = root.querySelector('.anthem-play');
    var seek = root.querySelector('.anthem-seek');
    var times = root.querySelectorAll('.anthem-time');
    var cur = times[0], dur = times[1];
    var lyricsBtn = root.querySelector('.anthem-lyrics-btn');
    var lyricsPanel = root.querySelector('.anthem-lyrics');
    if (!audio) return;

    var seeking = false;

    if (dur) {
      audio.addEventListener('loadedmetadata', function () {
        dur.textContent = fmt(audio.duration);
      });
    }

    audio.addEventListener('timeupdate', function () {
      if (seeking) return;
      if (cur) cur.textContent = fmt(audio.currentTime);
      if (seek && audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
    });

    function setPlaying(on) {
      root.classList.toggle('playing', on);
      if (!playBtn) return;
      playBtn.textContent = on ? '❚❚' : '▶';
      playBtn.setAttribute('aria-label', on ? '정지' : '재생');
    }
    audio.addEventListener('play', function () { setPlaying(true); });
    audio.addEventListener('pause', function () { setPlaying(false); });
    audio.addEventListener('ended', function () { setPlaying(false); });

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (audio.paused) audio.play(); else audio.pause();
      });
    }

    if (seek) {
      seek.addEventListener('input', function () {
        seeking = true;
        if (audio.duration && cur) cur.textContent = fmt(audio.duration * (seek.value / 100));
      });
      seek.addEventListener('change', function () {
        if (audio.duration) audio.currentTime = audio.duration * (seek.value / 100);
        seeking = false;
      });
    }

    if (lyricsBtn && lyricsPanel) {
      lyricsBtn.addEventListener('click', function () {
        var show = lyricsPanel.hasAttribute('hidden');
        if (show) lyricsPanel.removeAttribute('hidden');
        else lyricsPanel.setAttribute('hidden', '');
        lyricsBtn.classList.toggle('active', show);
        lyricsBtn.setAttribute('aria-expanded', show ? 'true' : 'false');
      });
    }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    [].slice.call(document.querySelectorAll('.anthem')).forEach(initPlayer);
  });
})();
