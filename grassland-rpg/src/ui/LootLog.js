// 아이템 획득 로그: 화면 왼쪽 아래에 "+3 나무 토막" 줄이 쌓였다가 사라진다. 같은 아이템은 합친다.
export class LootLog {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.cfg = ctx.data.config.lootLog;
    const el = document.createElement('div');
    el.className = 'loot-log';
    root.appendChild(el);
    this.el = el;
    this.rows = new Map(); // item → { el, count, time }
    ctx.bus.on('loot:gained', ({ item, count }) => this.add(item, count));
  }

  add(item, count) {
    const { items } = this.ctx.data.items;
    const def = items[item];
    let row = this.rows.get(item);
    if (!row) {
      const el = document.createElement('div');
      el.className = 'loot-row';
      el.style.setProperty('--c', def.color ?? '#ffcf5c');
      this.el.appendChild(el);
      row = { el, count: 0 };
      this.rows.set(item, row);
      while (this.rows.size > this.cfg.max) this.drop(this.rows.keys().next().value);
    } else {
      this.el.appendChild(row.el); // 맨 아래로
      row.el.classList.remove('bump');
      void row.el.offsetWidth;
      row.el.classList.add('bump');
    }
    row.count += count;
    row.time = this.cfg.life;
    row.el.innerHTML = `<i class="item-icon"></i><b>+${row.count}</b> ${def.name}`;
  }

  drop(item) {
    this.rows.get(item)?.el.remove();
    this.rows.delete(item);
  }

  update(dt) {
    for (const [item, row] of this.rows) {
      row.time -= dt;
      row.el.style.opacity = String(Math.min(1, row.time / 0.6));
      if (row.time <= 0) this.drop(item);
    }
  }
}
