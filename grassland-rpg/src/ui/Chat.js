import * as THREE from 'three';

const v = new THREE.Vector3();
const MAX_LEN = 60;
const HEAD = 2.1; // 머리 위 높이 (m)

// 채팅: 게임 중 Enter → 아래 가운데 유리 입력 칸, Enter 로 말하기 · Esc 로 취소.
// 말하면 플레이어 머리 위에 반투명 유리 말풍선 (글 길이만큼 떠 있다가 흐려진다). 새 말은 예전 말을 바꾼다.
// 글자를 치는 동안 게임 키는 먹지 않는다 (Input 이 입력 칸의 키를 무시).
export class Chat {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.bar = document.createElement('form');
    this.bar.className = 'chat-bar';
    this.bar.hidden = true;
    this.bar.innerHTML = `<input type="text" maxlength="${MAX_LEN}" autocomplete="off" enterkeyhint="send" placeholder="하고 싶은 말을 적어요" aria-label="채팅"><small>Enter 말하기 · Esc 닫기</small>`;
    root.appendChild(this.bar);
    this.input = this.bar.querySelector('input');

    this.bubble = document.createElement('div');
    this.bubble.className = 'chat-bubble';
    this.bubble.hidden = true;
    this.bubble.innerHTML = '<b class="cb-name"></b><span class="cb-text"></span>';
    root.appendChild(this.bubble);
    this.nameEl = this.bubble.querySelector('.cb-name');
    this.textEl = this.bubble.querySelector('.cb-text');
    this.life = 0;
    this.age = 0;
    this.name = '';
    this.closedAt = 0; // 한글 입력기는 Enter 를 두 번 보내기도 해서, 닫은 직전 Enter 로 다시 열리지 않게
    ctx.bus.on('player:named', ({ name }) => { this.name = name; });

    window.addEventListener('keydown', (e) => {
      if (e.code !== 'Enter' && e.code !== 'NumpadEnter') return;
      if (this.bar.hidden && performance.now() - this.closedAt > 250 && !e.isComposing && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName ?? '') && ctx.state === 'play' && ctx.player.alive) {
        e.preventDefault();
        this.open();
      }
    });
    this.bar.addEventListener('submit', (e) => {
      e.preventDefault();
      this.say(this.input.value);
      this.close();
    });
    this.input.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') { e.preventDefault(); this.close(); }
    });
    this.input.addEventListener('blur', () => this.close());
    ctx.bus.on('chat:say', ({ text }) => this.say(text));
  }

  open() {
    this.ctx.input.releaseAll();
    this.input.value = '';
    this.bar.hidden = false;
    this.input.focus();
  }

  close() {
    if (this.bar.hidden) return;
    this.bar.hidden = true;
    this.closedAt = performance.now();
    this.input.blur();
  }

  say(raw) {
    const text = String(raw ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_LEN);
    if (!text) return;
    this.nameEl.textContent = this.name || '개척자';
    this.textEl.textContent = text;
    this.life = Math.min(9, 3.2 + text.length * 0.12);
    this.age = 0;
    this.bubble.hidden = false;
    this.bubble.classList.remove('pop');
    void this.bubble.offsetWidth; // 다시 통통
    this.bubble.classList.add('pop');
    this.ctx.bus.emit('chat:said', { text });
  }

  update(dt) {
    if (this.bubble.hidden) return;
    const { player, camera } = this.ctx;
    this.age += dt;
    if (this.age > this.life || !player.alive || this.ctx.state === 'title') {
      this.bubble.hidden = true;
      return;
    }
    v.set(player.position.x, player.position.y + HEAD, player.position.z).project(camera);
    const x = (v.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-v.y * 0.5 + 0.5) * window.innerHeight;
    this.bubble.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    this.bubble.style.opacity = String(Math.min(1, (this.life - this.age) / 0.5));
  }
}
