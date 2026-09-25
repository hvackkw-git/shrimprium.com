// 작은 우주: 스크롤에 따라 흩어진 별 → 새우 별 하나 → 질소 순환 별자리 → 성운 → 새우 별자리.
// 섹션마다 data-scene 이 있고, 각 섹션을 지나가는 정도로 장면 사이를 보간한다.

const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

const hexCache = new Map();
function hexRgb(hex) {
  if (!hexCache.has(hex)) hexCache.set(hex, [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  return hexCache.get(hex);
}

// 결정론적 난수 — 새로고침해도 같은 하늘.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LINK = '#7FDDEB';
const WARM = '#FFB38A';

// 수조 안의 질소 순환. 새우의 배설물이 박테리아를 거쳐 수초의 양분이 되고, 수초의 산소가 다시 새우에게.
const CYCLE = [
  { label: 'Shrimp', color: WARM, size: 1.5 },
  { label: 'NH₄⁺', color: '#F6E5B8' },
  { label: 'AOB', color: '#8FE3B0' },
  { label: 'NO₂⁻', color: '#FFD098' },
  { label: 'NOB', color: '#B8C8FF' },
  { label: 'NO₃⁻', color: '#A3E8C7' },
  { label: 'Plants', color: '#9BE38A', size: 1.2 },
  { label: 'O₂', color: '#7FD4FF' },
];

// 옆에서 본 새우 별자리 (왼쪽을 바라봄). 단위 좌표 -1…1.
const SHRIMP = [
  [-1.02, -0.78], // 0 더듬이 끝
  [-0.98, -0.42], // 1 더듬이 끝
  [-0.64, -0.16], // 2 머리
  [-0.5, -0.3],   // 3 눈
  [-0.22, -0.4],  // 4 등
  [0.1, -0.4],    // 5 등
  [0.38, -0.27],  // 6 허리
  [0.58, -0.04],  // 7 배
  [0.64, 0.22],   // 8 배
  [0.5, 0.44],    // 9 꼬리 시작
  [0.24, 0.62],   // 10 꼬리 부채
  [0.42, 0.72],   // 11 꼬리 부채
  [0.62, 0.66],   // 12 꼬리 부채
  [0.3, 0.26],    // 13 배 아래
  [0.0, 0.14],    // 14 배 아래
  [-0.34, 0.06],  // 15 가슴
  [-0.3, 0.36],   // 16 다리
  [-0.04, 0.42],  // 17 다리
  [0.2, 0.48],    // 18 다리
];
const SHRIMP_EDGES = [
  [0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
  [9, 10], [9, 11], [9, 12], [9, 13], [13, 14], [14, 15], [15, 2],
  [15, 16], [14, 17], [13, 18],
];

// 별 스프라이트: 계단식 코로나와 십자 광선을 가진 픽셀 별. 밝기 8단계로 미리 굽는다.
const FRAMES = 8;
const spriteCache = new Map();
function starSprite(color, half) {
  const key = color + half;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const size = half * 2 + 1;
  const c = document.createElement('canvas');
  c.width = size * FRAMES;
  c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(c.width, size);
  const rgb = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
  for (let f = 0; f < FRAMES; f++) {
    const energy = 0.4 + 0.6 * (f / (FRAMES - 1));
    const reach = half * (0.6 + 0.4 * energy);
    for (let y = -half; y <= half; y++) {
      for (let x = -half; x <= half; x++) {
        const ax = Math.abs(x), ay = Math.abs(y);
        const d = Math.hypot(x, y);
        let a = Math.round(Math.max(0, 1 - d / (reach * 0.85)) ** 2 * 6) / 20;
        if (Math.min(ax, ay) === 0) a = Math.max(a, 0.08 + 0.7 * (1 - Math.max(ax, ay) / (reach + 1)) ** 2);
        const core = ax + ay === 0;
        const inner = ax + ay === 1;
        if (core) a = 1;
        else if (inner) a = Math.max(a, 0.65 + 0.3 * energy);
        if (a <= 0) continue;
        const w = core ? 1 : inner ? 0.55 * energy : 0;
        const o = ((y + half) * c.width + f * size + x + half) * 4;
        for (let k = 0; k < 3; k++) img.data[o + k] = Math.round(rgb[k] * (1 - w) + 255 * w);
        img.data[o + 3] = Math.round(clamp(a) * 255);
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  const sprite = { c, size };
  spriteCache.set(key, sprite);
  return sprite;
}

function drawStar(ctx, x, y, color, half, px, light) {
  if (light <= 0.01) return;
  if (half >= 5) {
    // 큰 별은 부드러운 빛무리를 한 겹 두른다.
    const r = half * px * 3.2;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color + '55');
    g.addColorStop(1, color + '00');
    ctx.globalAlpha = clamp(light);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const { c, size } = starSprite(color, half);
  const frame = Math.round(clamp(light) * (FRAMES - 1));
  const ext = size * px;
  ctx.globalAlpha = clamp(light * 1.2);
  ctx.drawImage(c, frame * size, 0, size, size, Math.round(x - ext / 2), Math.round(y - ext / 2), ext, ext);
}

// 성운: 작은 반투명 점을 흩뿌려 만든 구름을 한 번 굽는다.
function bakeNebula(color, radius, seed) {
  const r = rng(seed);
  const size = Math.ceil(radius * 2.4);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  const lobes = Array.from({ length: 4 }, () => [(r() - 0.5) * radius, (r() - 0.5) * radius * 0.7, radius * (0.35 + r() * 0.3)]);
  for (let i = 0; i < 4200; i++) {
    const [lx, ly, lr] = lobes[i % lobes.length];
    const ang = r() * TAU;
    const dist = Math.sqrt(r()) * lr;
    const x = size / 2 + lx + Math.cos(ang) * dist;
    const y = size / 2 + ly + Math.sin(ang) * dist * 0.8;
    ctx.globalAlpha = 0.07 * (1 - dist / lr) + 0.012;
    const s = r() < 0.9 ? 2 : 3;
    ctx.fillRect(Math.round(x), Math.round(y), s, s);
  }
  return c;
}

export function startCosmos(canvas) {
  const ctx = canvas.getContext('2d');
  const ambient = canvas.dataset.mode === 'ambient';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = ambient ? [] : [...document.querySelectorAll('[data-scene]')];
  const rand = rng(7);

  let W = 0, H = 0, dpr = 1, px = 2, lightScale = 1;
  let stage = { x: 0, y: 0, r: 1 };
  let pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  // 배경 먼지 별
  const dust = Array.from({ length: ambient ? 160 : 260 }, () => ({
    x: rand(), y: rand(),
    depth: 0.2 + rand() * 0.8,
    size: rand() < 0.85 ? 1 : 2,
    phase: rand() * TAU,
    speed: 0.4 + rand() * 1.4,
    tint: rand() < 0.2 ? '#FFD9C2' : rand() < 0.4 ? '#C9E8FF' : '#F2F6FF',
  }));

  // 주인공 별들: 장면마다 다른 자리로 이동한다.
  const ACTORS = Math.max(CYCLE.length + 12, SHRIMP.length);
  const actors = Array.from({ length: ACTORS }, (_, i) => ({
    scatter: [rand() * 2 - 1, rand() * 2 - 1],
    orbit: { node: i % CYCLE.length, ang: rand() * TAU, dist: 0.16 + rand() * 0.1, spin: (rand() - 0.5) * 0.4 },
    phase: rand() * TAU,
    color: i < CYCLE.length ? CYCLE[i].color : ['#F6E5B8', '#A3E8C7', '#B8C8FF', '#FFD098'][i % 4],
  }));

  // 정다각형 대신 살짝 어긋난 고리 — 진짜 별자리처럼.
  const RING = [0.84, 0.76, 0.9, 0.78, 0.88, 0.74, 0.86, 0.8];
  const TWIST = [0, 0.03, -0.02, 0.025, -0.03, 0.02, -0.025, 0.015];
  let spin = 0; // 순환 고리가 천천히 도는 각도
  const ringPos = (i) => {
    const a = -Math.PI / 2 + (i / CYCLE.length + TWIST[i]) * TAU + spin;
    return [Math.cos(a) * RING[i] * 1.05, Math.sin(a) * RING[i]];
  };

  // 03: 고리가 풀리며 허브들이 수조 곳곳으로 흩어진다.
  const HUBS = [[-0.1, -0.12], [0.62, -0.78], [1.05, -0.1], [0.55, 0.62], [-0.2, 0.92], [-0.95, 0.5], [-1.08, -0.35], [-0.45, -0.9]];

  const nebulae = CYCLE.map((n, i) => ({ node: i, color: n.color, seed: 11 + i, img: null }));

  // 04: 새우 별자리의 선을 따라 몸을 감싸는 자리 (선 위의 한 점 + 수직으로 살짝 벗어남).
  function bodySpot() {
    const [a, b] = SHRIMP_EDGES[Math.floor(rand() * SHRIMP_EDGES.length)];
    const [ax, ay] = SHRIMP[a], [bx, by] = SHRIMP[b];
    const f = rand(), len = Math.hypot(bx - ax, by - ay) || 1;
    const off = (rand() + rand() - 1) * 0.16;
    return [(ax + (bx - ax) * f - ((by - ay) / len) * off) * 1.05, (ay + (by - ay) * f + ((bx - ax) / len) * off) * 1.05];
  }

  // 03에서 피어나는 작은 입자 별들. 종마다 다음 단계의 종과 이어진다.
  const WEB_COUNT = matchMedia('(max-width: 640px)').matches ? 110 : 170;
  const web = Array.from({ length: WEB_COUNT }, () => {
    const ang = rand() * TAU;
    const dist = Math.sqrt(rand()) * 1.2;
    const species = Math.floor(rand() * CYCLE.length);
    return {
      ang, dist, species,
      color: CYCLE[species].color,
      phase: rand() * TAU,
      half: rand() < 0.25 ? (rand() < 0.35 ? 4 : 3) : 0, // 0 = 작은 색 점
      body: bodySpot(),
    };
  });
  // 연결되지 않고 흩날리는 성간 먼지 (인게임처럼 촘촘하게)
  const motes = Array.from({ length: WEB_COUNT * 2 }, () => ({
    ang: rand() * TAU, dist: Math.sqrt(rand()) * 1.45, phase: rand() * TAU,
    color: CYCLE[Math.floor(rand() * CYCLE.length)].color, size: rand() < 0.8 ? 1 : 2,
  }));

  // 장면별 주인공 위치 (stage 기준 단위 좌표)와 밝기.
  function layout(scene, i, t) {
    const a = actors[i];
    const isNode = i < CYCLE.length;
    const drift = reduced ? 0 : Math.sin(t * 0.3 + a.phase) * 0.02;
    switch (scene) {
      case 0: // 흩어진 별
        return { x: a.scatter[0] * 1.9 + drift, y: a.scatter[1] * 1.3, light: 0.6, half: 3 };
      case 1: // 새우 별 하나
        if (i === 0) return { x: 0, y: 0, light: 1, half: 11 };
        return { x: a.scatter[0] * 2.4, y: a.scatter[1] * 1.6, light: 0.25, half: 3 };
      case 2: // 질소 순환
      case 3: { // 성운과 얽힌 연결
        const hub = (n) => (scene === 2 ? ringPos(n) : [HUBS[n][0] * stage.sx, HUBS[n][1]]);
        if (isNode) {
          const [x, y] = hub(i);
          const wob = scene === 3 && !reduced ? Math.sin(t * 0.4 + a.phase * 3) * 0.05 : 0;
          return { x: x + drift + wob, y: y + drift - wob, light: 1, half: i === 0 ? 8 : 6 };
        }
        const [nx, ny] = hub(a.orbit.node);
        const ang = a.orbit.ang + (reduced ? 0 : t * a.orbit.spin);
        return { x: nx + Math.cos(ang) * a.orbit.dist, y: ny + Math.sin(ang) * a.orbit.dist, light: scene === 3 ? 0.8 : 0.5, half: 3 };
      }
      default: { // 새우 별자리
        if (i < SHRIMP.length) {
          const [x, y] = SHRIMP[i];
          return { x: x * 1.05 + drift * 0.5, y: y * 1.05, light: i === 3 ? 1 : 0.9, half: i === 3 ? 7 : 4 };
        }
        return { x: a.scatter[0] * 2.2, y: a.scatter[1] * 1.5, light: 0.3, half: 3 };
      }
    }
  }

  function linksFor(scene) {
    if (scene === 2 || scene === 3) return CYCLE.map((_, i) => [i, (i + 1) % CYCLE.length]);
    if (scene === 4) return SHRIMP_EDGES;
    return [];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    px = 2;
    const wide = W >= 900;
    stage = wide
      ? { x: W * 0.66, y: H * 0.5, r: Math.min(W * 0.2, H * 0.34), sx: 1.1 }
      : { x: W * 0.5, y: H * 0.36, r: Math.min(W * 0.36, H * 0.24), sx: 0.82 };
    lightScale = clamp(stage.r / 260, 0.55, 1.2);
    for (const n of nebulae) n.img = bakeNebula(n.color, stage.r * 0.7, n.seed);
  }

  // 각 섹션이 화면 중앙을 지나는 정도 → 연속 장면 값
  function sceneValue() {
    if (!scenes.length) return 0;
    const mid = H * 0.5;
    let s = 0;
    for (let i = 1; i < scenes.length; i++) {
      const r = scenes[i].getBoundingClientRect();
      s += clamp((mid - r.top) / (H * 0.6));
    }
    return s;
  }

  // 인게임처럼 선은 양 끝 별 근처에서 밝고, 멀어질수록 바닥 밝기(32%)까지 은은해진다.
  // 선마다 그라데이션을 만들면 느려서, 밝기 단계별로 묶어 한 번에 긋는다.
  const LIGHT_FLOOR = 0.32;
  const NEAR = [[0, 0.25, 0.96], [0.25, 0.5, 0.72], [0.5, 0.75, 0.36], [0.75, 1, 0.08]]; // 끝에서의 거리 구간 → 추가 밝기
  const batch = new Map();
  function addSeg(color, width, m, x1, y1, x2, y2) {
    m = Math.round(m * 20) / 20;
    if (m <= 0) return;
    const key = color + width + m;
    let b = batch.get(key);
    if (!b) batch.set(key, (b = { color, width, m, segs: [] }));
    b.segs.push(x1, y1, x2, y2);
  }
  function linkLine(x1, y1, x2, y2, { alpha = 1, drawn = 1, color = LINK, ra = 60, rb = 60, width = 1 } = {}) {
    alpha = Math.round(clamp(alpha) * 4) / 4;
    if (alpha <= 0 || drawn <= 0) return;
    const ex = lerp(x1, x2, drawn), ey = lerp(y1, y2, drawn);
    const len = Math.hypot(ex - x1, ey - y1);
    if (len < 0.5) return;
    const ux = (ex - x1) / len, uy = (ey - y1) / len;
    addSeg(color, width, alpha * LIGHT_FLOOR, x1, y1, ex, ey);
    const glow = (ox, oy, dx, dy, r) => {
      for (const [a, b, v] of NEAR) {
        const d0 = a * r, d1 = Math.min(b * r, len);
        if (d0 >= len) break;
        addSeg(color, width, alpha * (1 - LIGHT_FLOOR) * v, ox + dx * d0, oy + dy * d0, ox + dx * d1, oy + dy * d1);
      }
    };
    glow(x1, y1, ux, uy, ra);
    if (drawn >= 1) glow(ex, ey, -ux, -uy, rb);
  }
  function flushLinks() {
    ctx.globalAlpha = 1;
    ctx.lineCap = 'round';
    for (const { color, width, m, segs } of batch.values()) {
      const rgb = hexRgb(color);
      ctx.beginPath();
      for (let i = 0; i < segs.length; i += 4) { ctx.moveTo(segs[i], segs[i + 1]); ctx.lineTo(segs[i + 2], segs[i + 3]); }
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.16 * m})`;
      ctx.lineWidth = width * 4;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${rgb.map((c) => Math.round(c * 0.25 + 191)).join(',')},${0.9 * m})`;
      ctx.lineWidth = width;
      ctx.stroke();
    }
    batch.clear();
  }

  function frame(now) {
    const t = now / 1000;
    spin = reduced ? 0 : t * 0.12;
    const s = sceneValue();
    const lo = Math.floor(s), hi = Math.min(lo + 1, 4), k = ease(s - lo);
    const sceneLo = Math.min(lo, 4);

    pointer.x = lerp(pointer.x, pointer.tx, 0.05);
    pointer.y = lerp(pointer.y, pointer.ty, 0.05);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = false;

    // 먼지 별
    for (const d of dust) {
      const tw = reduced ? 0.7 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * d.speed + d.phase));
      const x = (d.x * W + pointer.x * d.depth * 14 + W) % W;
      const y = (d.y * H + pointer.y * d.depth * 14 - (reduced ? 0 : t * 2 * d.depth) + H * 10) % H;
      ctx.globalAlpha = tw * (0.25 + d.depth * 0.5);
      ctx.fillStyle = d.tint;
      ctx.fillRect(Math.round(x), Math.round(y), d.size, d.size);
    }
    if (ambient) { ctx.globalAlpha = 1; requestAnimationFrame(frame); return; }

    // 주인공 별 위치
    const pos = actors.map((_, i) => {
      const a = layout(sceneLo, i, t), b = layout(hi, i, t);
      return {
        x: stage.x + lerp(a.x, b.x, k) * stage.r + pointer.x * 6,
        y: stage.y + lerp(a.y, b.y, k) * stage.r + pointer.y * 6,
        light: lerp(a.light, b.light, k) * (0.85 + (reduced ? 0.15 : 0.15 * Math.sin(t * 1.3 + actors[i].phase))),
        half: Math.round(lerp(a.half, b.half, k)),
      };
    });

    // 성운 (장면 3에서 가장 짙음)
    const neb = clamp(1 - Math.abs(s - 3) * 1.1);
    if (neb > 0) {
      for (const n of nebulae) {
        const p = pos[n.node];
        const pulse = reduced ? 1 : 0.9 + 0.1 * Math.sin(t * 0.5 + n.seed);
        const size = n.img.width * pulse;
        ctx.globalAlpha = neb;
        ctx.drawImage(n.img, p.x - size / 2, p.y - size / 2, size, size);
        ctx.drawImage(n.img, p.x - size / 2, p.y - size / 2, size, size);
      }
    }

    // 연결선: 현재 장면의 선은 스크롤 진행에 따라 하나씩 그어지고, 다음 장면으로 넘어가며 사라진다.
    const drawLinks = (scene, weight, progress) => {
      const links = linksFor(scene);
      links.forEach(([a, b], i) => {
        const start = i / links.length;
        const drawn = clamp((progress - start) * links.length * 0.9);
        linkLine(pos[a].x, pos[a].y, pos[b].x, pos[b].y, { alpha: weight, drawn: ease(drawn), ra: hubR, rb: hubR });
      });
    };
    const hubR = 84 * lightScale, dotR = 40 * lightScale;
    if (s > 1 && s < 3.2) drawLinks(2, s < 2.5 ? 1 : 1 - clamp((s - 2.5) / 0.6), s < 2 ? clamp(s - 1) : 1);
    if (s > 3) drawLinks(4, 1, clamp(s - 3));

    // 03: 흐르며 섞이는 입자들과 얽힌 연결
    // 04로 넘어가면 입자들이 새우 몸으로 모여든다 (k4). 새우 윤곽이 묻히지 않게 조금 흐리게.
    const k4 = ease(clamp(s - 3));
    const webW = s <= 3 ? clamp(1 - (3 - s) * 1.25) : lerp(1, 0.6, k4);
    if (webW > 0) {
      const bloom = s <= 3 ? 0.55 + 0.45 * ease(webW) : 1;
      const pts = web.map((w) => {
        // 안쪽이 더 빨리 도는 차등 회전 + 작은 소용돌이 → 입자들이 계속 섞인다.
        const a = w.ang + (reduced ? 0 : t * 0.05 / (0.35 + w.dist));
        const wx = reduced ? 0 : Math.sin(t * 0.35 + w.phase) * 0.06;
        const wy = reduced ? 0 : Math.cos(t * 0.29 + w.phase * 1.7) * 0.06;
        const fx = (Math.cos(a) * w.dist * stage.sx * 1.1 + wx) * bloom;
        const fy = (Math.sin(a) * w.dist + wy) * bloom;
        const bx = w.body[0] + wx * 0.25, by = w.body[1] + wy * 0.25;
        return {
          x: stage.x + lerp(fx, bx, k4) * stage.r + pointer.x * lerp(8, 6, k4),
          y: stage.y + lerp(fy, by, k4) * stage.r + pointer.y * lerp(8, 6, k4),
          w,
        };
      });
      // 입자 ↔ 다음 단계 입자
      const near = 0.34 * stage.r;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], next = (a.w.species + 1) % CYCLE.length;
        for (let j = 0; j < pts.length; j++) {
          const b = pts[j];
          if (b.w.species !== next) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < near) linkLine(a.x, a.y, b.x, b.y, { alpha: webW * lerp(0.7, 0.45, k4) * (1 - d / near), color: a.w.color, ra: dotR, rb: dotR, width: 0.8 });
        }
      }
      // 허브 ↔ 다음 단계 입자 (멀리까지 부채꼴로 뻗는다)
      const reach = 1.25 * stage.r;
      for (let h = 0; h < CYCLE.length; h++) {
        const hp = pos[h], next = (h + 1) % CYCLE.length;
        const color = h === 0 ? '#C9A6FF' : CYCLE[h].color;
        for (const b of pts) {
          if (b.w.species !== next && !(h === 0 && b.w.species === 3)) continue;
          const d = Math.hypot(hp.x - b.x, hp.y - b.y);
          if (d < reach) linkLine(hp.x, hp.y, b.x, b.y, { alpha: webW * (1 - k4) * Math.sqrt(1 - d / reach), color, ra: hubR, rb: dotR });
        }
      }
      // 04: 입자 ↔ 가장 가까운 새우 별
      if (k4 > 0) {
        const grab = 0.42 * stage.r;
        for (const b of pts) {
          let best = -1, bd = grab;
          for (let i = 0; i < SHRIMP.length; i++) {
            const d = Math.hypot(pos[i].x - b.x, pos[i].y - b.y);
            if (d < bd) { bd = d; best = i; }
          }
          if (best >= 0) linkLine(pos[best].x, pos[best].y, b.x, b.y, { alpha: k4 * 0.5 * (1 - bd / grab), color: b.w.color, ra: hubR * 0.6, rb: dotR, width: 0.8 });
        }
      }
      flushLinks();
      for (const m of motes) {
        const a = m.ang + (reduced ? 0 : t * 0.04 / (0.35 + m.dist));
        ctx.globalAlpha = webW * (1 - 0.7 * k4) * (reduced ? 0.6 : 0.35 + 0.35 * Math.sin(t * 1.3 + m.phase));
        ctx.fillStyle = m.color;
        ctx.fillRect(Math.round(stage.x + Math.cos(a) * m.dist * stage.sx * 1.1 * bloom * stage.r), Math.round(stage.y + Math.sin(a) * m.dist * bloom * stage.r), m.size, m.size);
      }
      for (const p of pts) {
        const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * 1.7 + p.w.phase);
        if (p.w.half) drawStar(ctx, p.x, p.y, p.w.color, p.w.half, px, webW * tw);
        else {
          ctx.globalAlpha = webW * (0.6 + 0.4 * tw);
          ctx.fillStyle = p.w.color;
          ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 3, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
        }
      }
    }

    flushLinks();
    // 별
    pos.forEach((p, i) => drawStar(ctx, p.x, p.y, actors[i].color, p.half, px, p.light));

    // 순환 이름표
    const labels = clamp(1 - Math.abs(s - 2.5) * 1.1);
    if (labels > 0) {
      ctx.globalAlpha = labels * 0.85;
      ctx.fillStyle = '#DCE7F5';
      ctx.font = `500 ${W < 640 ? 11 : 13}px 'Pretendard Variable', Pretendard, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      CYCLE.forEach((n, i) => {
        const p = pos[i];
        const [ux, uy] = ringPos(i);
        ctx.fillText(n.label, p.x + ux * 34, p.y + uy * 34 + 4);
      });
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / W - 0.5) * 2;
    pointer.ty = (e.clientY / H - 0.5) * 2;
  });
  requestAnimationFrame(frame);
}
