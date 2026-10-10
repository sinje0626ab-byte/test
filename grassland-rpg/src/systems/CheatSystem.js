// 운영자 치트키 (스타크래프트 치트처럼 채팅 창에 친다). 화면 어디에도 목록을 보여 주지 않는다.
// 채팅(Chat.say)이 말풍선을 띄우기 전에 chat:command 로 물어보고, 치트면 말풍선 없이 알림 한 줄만.
// 대소문자·띄어쓰기는 가리지 않는다 ("Show me the money" = "showmethemoney")
const CODES = {
  showmethemoney: { text: '골드 +10,000', run: (bus) => bus.emit('economy:reward', { amount: 10000 }) },
  somethingfornothing: { text: '스킬 포인트 +1', run: (bus) => bus.emit('stats:refund-points', { count: 1 }) },
  thereisnocowlevel: { text: '레벨 +1', run: (bus) => bus.emit('stats:cheat-level') },
  poweroverwhelming: { text: null, run: (bus, ctx) => { ctx.godMode = !ctx.godMode; return ctx.godMode ? '무적 켜짐' : '무적 꺼짐'; } },
  thegathering: { text: '궁극기 게이지 가득', run: (bus, ctx) => (ctx.ultimate?.equipped ? bus.emit('ult:fill') : '아직 궁극기가 없어요 (레벨 5)') },
  blacksheepwall: { text: '지도 모두 밝히기', run: (bus) => bus.emit('map:reveal-all') },
  modifythephasevariance: { text: '각인 하나 얻기', run: (bus) => bus.emit('rune:cheat') },
};

export class CheatSystem {
  constructor(ctx) {
    this.ctx = ctx;
    ctx.godMode = false;
    ctx.bus.on('chat:command', (e) => {
      const key = e.text.toLowerCase().replace(/[^a-z]/g, '');
      const c = CODES[key];
      if (!c || e.handled) return;
      e.handled = true;
      const msg = c.run(ctx.bus, ctx) ?? c.text;
      ctx.bus.emit('notify', { text: `치트: ${msg}`, kind: 'item', color: '#b48cf0' });
    });
  }
}
