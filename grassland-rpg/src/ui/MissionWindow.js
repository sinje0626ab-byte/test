import { itemIcon } from './icons.js';
import { uiImg } from './painted.js';

// 임무 창 (J, HUD 「임무」 알약): 출석 도장 7칸 + 매일 임무 3개 + 주간 임무 3개, 받을 보상이 있으면 알약에 빨간 점.
// 이어하기로 들어왔을 때 오늘 도장을 아직 안 찍었으면 저절로 열린다.
export class MissionWindow {
  constructor(ctx, ui) {
    this.ctx = ctx;
    this.ui = ui;
    this.data = null;
    const win = ui.createWindow({ id: 'missions', title: '임무 · 출석', key: 'KeyJ', hotkeyLabel: 'J' });
    win.el.classList.add('win-center');
    win.onOpen = () => this.render();
    this.body = win.body;
    this.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-m]');
      if (!b || b.disabled) return;
      const [act, kind, i] = b.dataset.m.split(':');
      if (act === 'claim') ctx.bus.emit('mission:claim', { kind, index: Number(i) });
      else if (act === 'bonus') ctx.bus.emit('mission:claim-bonus', { kind });
      else if (act === 'attend') ctx.bus.emit('mission:attend');
    });

    // HUD 알약 (퀘스트 한 줄 아래)
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'mission-pill';
    pill.innerHTML = `<span>${uiImg('ic_mission', '📋')} 임무</span><b class="m-count"></b><i class="m-dot" hidden></i>`;
    pill.addEventListener('click', () => ui.toggle('missions'));
    document.querySelector('.hud')?.appendChild(pill) ?? document.body.appendChild(pill);
    this.pill = pill;
    const place = () => {
      const tracker = document.querySelector('.quest-tracker');
      const panel = document.querySelector('.hud-tl');
      const ref = tracker && !tracker.hidden && getComputedStyle(tracker).display !== 'none' ? tracker : panel;
      const extra = ref === panel && document.body.classList.contains('touch') && window.innerWidth <= 600 ? 44 : 0;
      if (ref) pill.style.top = `${ref.getBoundingClientRect().bottom + 6 + extra}px`;
    };
    setInterval(place, 500);
    window.addEventListener('resize', place);

    ctx.bus.on('mission:changed', (d) => {
      this.data = d;
      const s = d.state;
      const done = s.daily.filter((m) => m.progress >= m.target).length;
      pill.querySelector('.m-count').textContent = `${done}/${s.daily.length}`;
      pill.querySelector('.m-dot').hidden = !d.ready;
      pill.classList.toggle('ready', !!d.ready);
      if (ui.isOpen('missions')) this.render();
    });
    ctx.bus.on('play:started', () => {
      setTimeout(() => { if (this.data?.canAttend && ctx.state === 'play') ui.open('missions'); }, 1200);
    });
    ctx.bus.on('mission:attended', ({ day }) => {
      this.stamped = day;
      setTimeout(() => { this.stamped = null; }, 1200);
    });
  }

  rewardHtml({ gold, item, count = 1 }) {
    const items = this.ctx.data.items.items;
    return `${gold ? `<span class="m-gold"><i class="coin"></i>${gold}</span>` : ''}${item ? `<span class="m-item" title="${items[item].name}">${itemIcon(items[item])}${count > 1 ? `<b>×${count}</b>` : ''}</span>` : ''}`;
  }

  list(kind, title, resetText) {
    const { state, rewards } = this.data;
    const cfg = this.ctx.data.config.missions;
    const bonus = kind === 'daily' ? cfg.dailyAllReward : cfg.weeklyAllReward;
    const rows = state[kind].map((m, i) => {
      const ok = m.progress >= m.target;
      const pct = Math.round((m.progress / m.target) * 100);
      return `<div class="m-row ${m.claimed ? 'claimed' : ok ? 'done' : ''}">
        <div class="m-main"><span class="m-text">${m.text}</span>
          <div class="m-bar"><i style="width:${pct}%"></i><small>${m.progress}/${m.target}</small></div></div>
        <div class="m-rew">${this.rewardHtml(rewards[kind])}</div>
        <button type="button" class="m-btn primary" data-m="claim:${kind}:${i}" ${ok && !m.claimed ? '' : 'disabled'}>${m.claimed ? `${uiImg('ic_claimed')}받음` : ok ? '받기' : '진행 중'}</button>
      </div>`;
    }).join('');
    const all = state[kind].length && state[kind].every((m) => m.claimed);
    const got = state[`${kind}Bonus`];
    return `<section class="m-sec">
      <h3><span class="sec-tag">${uiImg(kind === 'daily' ? 'ic_daily' : 'ic_calendar')}${title}</span> <small>${resetText}</small></h3>
      ${rows}
      <div class="m-row bonus ${got ? 'claimed' : all ? 'done' : ''}">
        <div class="m-main"><span class="m-text">${uiImg('ic_gift', uiImg('ic_bonus', '✨'))} 모두 완료 보너스</span></div>
        <div class="m-rew">${this.rewardHtml({ ...bonus, count: 1 })}</div>
        <button type="button" class="m-btn primary" data-m="bonus:${kind}" ${all && !got ? '' : 'disabled'}>${got ? `${uiImg('ic_claimed')}받음` : '받기'}</button>
      </div></section>`;
  }

  render() {
    if (!this.data) return;
    const { state, canAttend } = this.data;
    const att = this.ctx.data.config.missions.attendance;
    const n = att.length;
    // 지금 찍을(또는 마지막으로 찍은) 칸
    const stampedInCycle = state.att.count % n;
    const cycleDone = canAttend ? stampedInCycle : (stampedInCycle === 0 && state.att.count ? n : stampedInCycle);
    const stamps = att.map((r, i) => {
      const done = i < cycleDone;
      const today = canAttend && i === stampedInCycle;
      return `<div class="m-stamp ${done ? 'done' : ''} ${today ? 'today' : ''} ${this.stamped === i + 1 ? 'pop' : ''}">
        <small>${i + 1}일</small><div class="m-srew">${this.rewardHtml(r)}</div>${done ? uiImg('stamp_seal', '<i class="m-seal">✓</i>', 'm-seal-img') : ''}</div>`;
    }).join('');
    const now = new Date();
    const mid = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const left = Math.max(0, mid - now);
    const hh = Math.floor(left / 3600000);
    const mm = Math.floor((left % 3600000) / 60000);
    const wd = (8 - ((now.getDay() + 6) % 7) - 1) || 7;
    this.body.innerHTML = `
      <div class="missions">
        <section class="m-sec">
          <h3><span class="sec-tag">${uiImg('ic_attend')}출석 도장</span> <small>${state.att.count}일째 함께했어요</small></h3>
          <div class="m-stamps">${stamps}</div>
          <button type="button" class="m-attend primary" data-m="attend" ${canAttend ? '' : 'disabled'}>${canAttend ? '오늘 도장 찍기!' : '오늘 도장 완료 — 내일 또 만나요'}</button>
        </section>
        ${this.list('daily', '매일 임무', `${uiImg('ic_hourglass')}${hh}시간 ${mm}분 뒤 새 임무`)}
        ${this.list('weekly', '주간 임무', `${uiImg('ic_hourglass')}${wd}일 뒤 월요일에 새 임무`)}
      </div>`;
  }
}
