import * as THREE from 'three';
import { markCircle, markLine } from './behaviors/common.js';

const tmp = new THREE.Vector3();

// 보스 패턴. 각 패턴은
//   ready(boss, p, dist) — 지금 쓸 수 있나
//   start(boss, p, cast) — 예고 표시 (cast.target = 플레이어 자리)
//   during(boss, p, cast, t) — 예고 중 (t = 0~1)
//   fire(boss, p, cast) — 발동
// 예고 표시(p.marks)는 처음 쓸 때 만들어 보스가 치울 때까지 재사용한다.

function sceneMark(boss, mesh) {
  boss.ctx.scene.add(mesh);
  boss.sceneMarks.push(mesh);
  return mesh;
}

function fade(marks, t) {
  for (const m of marks) m.material.opacity = 0.15 + 0.35 * t;
}

function hide(marks) {
  for (const m of marks) m.visible = false;
}

export const PATTERNS = {
  // 내려찍기: 보스 둘레 원
  slam: {
    ready: (b, p, dist) => dist < p.radius * 0.8,
    start(b, p) {
      p.marks ??= [(() => { const m = markCircle(p.radius); b.mesh.add(m); return m; })()];
      p.marks[0].visible = true;
    },
    during: (b, p, c, t) => fade(p.marks, t),
    fire(b, p) {
      hide(p.marks);
      b.ctx.bus.emit('boss:aoe', { position: b.position.clone(), radius: p.radius, damage: p.damage, boss: b });
    },
  },

  // 점프: 플레이어 자리로 포물선을 그리며 날아가 내려찍는다
  jump: {
    ready: (b, p, dist) => dist < p.range,
    start(b, p, c) {
      p.marks ??= [sceneMark(b, markCircle(p.radius))];
      p.marks[0].position.set(c.target.x, 0.05, c.target.z);
      p.marks[0].visible = true;
      c.from = b.position.clone();
    },
    during(b, p, c, t) {
      fade(p.marks, t);
      // 처음 30%는 웅크리고, 나머지 동안 날아간다
      const k = Math.max(0, (t - 0.3) / 0.7);
      b.position.lerpVectors(c.from, c.target, k);
      b.jumpHeight = Math.sin(k * Math.PI) * 3;
    },
    fire(b, p, c) {
      hide(p.marks);
      b.jumpHeight = 0;
      b.position.copy(c.target);
      b.ctx.bus.emit('boss:aoe', { position: c.target.clone(), radius: p.radius, damage: p.damage, boss: b });
    },
  },

  // 가시 난사: 사방으로
  volley: {
    ready: (b, p, dist) => dist < p.range,
    fire(b, p) {
      b.ctx.bus.emit('boss:volley', { origin: b.position.clone(), count: p.count, speed: p.speed, damage: p.damage, range: p.range });
    },
  },

  // 얼음덩이: 예고한 자리에 포물선으로 떨어진다 (착지는 BossSystem)
  boulder: {
    ready: (b, p, dist) => dist < p.range,
    start(b, p, c) {
      p.marks ??= [sceneMark(b, markCircle(p.radius))];
      p.marks[0].position.set(c.target.x, 0.05, c.target.z);
      p.marks[0].visible = true;
    },
    during: (b, p, c, t) => fade(p.marks, t),
    fire(b, p, c) {
      b.ctx.bus.emit('boss:boulder', { from: b.position.clone().setY(b.radius * 2), target: c.target.clone(), speed: p.speed, radius: p.radius, damage: p.damage, mark: p.marks[0] });
    },
  },

  // 부하 소환
  summon: {
    ready: (b, p, dist) => dist < p.range,
    fire(b, p) {
      b.ctx.bus.emit('monster:spawn', { type: p.monster, count: p.count, position: b.position.clone(), spread: b.radius + 1.5, summoned: true });
    },
  },

  // 뿌리 줄기: 플레이어 쪽으로 부채처럼 3갈래 직선
  roots: {
    ready: (b, p, dist) => dist < p.range,
    start(b, p, c) {
      p.marks ??= Array.from({ length: p.count }, () => sceneMark(b, markLine(p.length, p.width)));
      tmp.set(c.target.x - b.position.x, 0, c.target.z - b.position.z);
      const base = Math.atan2(tmp.x, tmp.z);
      const spread = THREE.MathUtils.degToRad(p.spreadDeg);
      c.lines = p.marks.map((m, i) => {
        const yaw = base + (i - (p.count - 1) / 2) * spread;
        m.position.set(b.position.x, 0.05, b.position.z);
        m.rotation.y = yaw;
        m.visible = true;
        return { origin: b.position.clone(), dir: new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)) };
      });
    },
    during: (b, p, c, t) => fade(p.marks, t),
    fire(b, p, c) {
      hide(p.marks);
      for (const l of c.lines) {
        b.ctx.bus.emit('boss:line', { origin: l.origin, dir: l.dir, length: p.length, width: p.width, damage: p.damage, boss: b });
      }
    },
  },

  // 잎 폭풍: 몸 주변을 돌며 퍼지는 잎 (EnemyShotSystem)
  leafstorm: {
    ready: (b, p, dist) => dist < p.range,
    fire(b, p) {
      b.ctx.bus.emit('boss:leafstorm', { boss: b, count: p.count, damage: p.damage, duration: p.duration, maxRadius: p.maxRadius });
    },
  },

  // 밤의 군주 2페이즈: 포탑 하나를 잠재운다 (TurretSystem)
  sleep: {
    ready: (b, p, dist) => dist < p.range,
    fire(b, p) {
      b.ctx.bus.emit('turret:sleep', { position: b.position.clone(), radius: p.radius, duration: p.duration });
    },
  },

  // 순간이동 후 내려찍기: 예고 원 → 흐려졌다가 그 자리에 나타난다
  blink: {
    ready: (b, p, dist) => dist < p.range,
    start(b, p, c) {
      p.marks ??= [sceneMark(b, markCircle(p.radius))];
      p.marks[0].position.set(c.target.x, 0.05, c.target.z);
      p.marks[0].visible = true;
    },
    during(b, p, c, t) {
      fade(p.marks, t);
      b.setOpacity(0.95 * (1 - t * 0.9));
    },
    fire(b, p, c) {
      hide(p.marks);
      b.position.copy(c.target);
      b.setOpacity(0.95);
      b.ctx.bus.emit('boss:aoe', { position: c.target.clone(), radius: p.radius, damage: p.damage, boss: b });
    },
  },

  // 3페이즈: 원형 파도가 차례로 퍼진다 (NightLordSystem)
  wave: {
    ready: (b, p, dist) => dist < p.range,
    fire(b, p) {
      b.ctx.bus.emit('boss:wave', { origin: b.position.clone(), rings: p.rings, spacing: p.spacing, interval: p.interval, width: p.width, damage: p.damage });
    },
  },
};
