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
})();
