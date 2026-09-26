/**
 * Neural Mind Map — World Engine
 * ---------------------------------
 * Module-level neural world state shared across the 3D scene:
 * - Adaptive quality tiers (high / medium / low)
 * - Layered "brain" node distribution with orbit + depth layers
 * - Precomputed connection topology (nearest-neighbor + long-range)
 * - Global interaction store (mouse, clicks, scroll) attached to window
 * - Canvas-generated radial glow texture for pulses / halos
 */

import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface NeuralNode {
  /** Base home position (orbit center offset) */
  home: THREE.Vector3;
  /** Current animated position */
  pos: THREE.Vector3;
  /** Orbit axis (normalized) */
  axis: THREE.Vector3;
  /** Distance from the AI Core */
  radius: number;
  /** Angular phase along the orbit */
  phase: number;
  /** Orbit speed (rad/s) */
  speed: number;
  /** Base scale of the node */
  scale: number;
  /** Color index into palette */
  color: number;
  /** Depth layer index (0 = deepest) */
  layer: number;
  /** Per-node shimmer offset */
  twinkle: number;
  /** Base alpha / opacity */
  alpha: number;
  /** Attraction velocity for cursor force */
  vel: THREE.Vector3;
}

export interface NeuralLink {
  a: number;
  b: number;
  /** Rest length (precomputed) */
  length: number;
  /** Line weight */
  width: number;
  /** Color index (cyan / blue / purple / white) */
  color: number;
}

export interface PulseParticle {
  /** Index of the link this pulse travels along */
  link: number;
  /** 0..1 progress along the link */
  t: number;
  /** Speed along link */
  speed: number;
  /** Color index */
  color: number;
  /** Lifetime */
  life: number;
}

export interface RippleWave {
  center: THREE.Vector3;
  radius: number;
  maxRadius: number;
  life: number;
  duration: number;
  color: THREE.Color;
}

export interface InteractionState {
  /** Normalized mouse coords (-1..1) */
  mouse: THREE.Vector2;
  /** Smooth-followed mouse (used for group rotation) */
  smooth: THREE.Vector2;
  /** World-space cursor position (unprojected onto z=0 plane) */
  cursor: THREE.Vector3;
  /** Whether cursor is inside the viewport */
  active: boolean;
  /** Ripple queue (consumed by scene) */
  ripples: RippleWave[];
  /** Normalized scroll 0..1 */
  scroll: number;
  /** Smooth-followed scroll */
  smoothScroll: number;
  /** Device quality tier */
  quality: 'high' | 'medium' | 'low';
}

export interface WorldConfig {
  nodeCount: number;
  linkCount: number;
  pulseCount: number;
  coreDensity: number;
  rippleCount: number;
  dpr: [number, number];
  bloom: boolean;
}

/* ------------------------------------------------------------------ */
/*  Adaptive quality detection                                        */
/* ------------------------------------------------------------------ */

export function detectQuality(): 'high' | 'medium' | 'low' {
  try {
    const cores = navigator.hardwareConcurrency || 4;
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

    if (mobile || cores <= 2 || memory <= 2) return 'low';
    if (cores <= 4 || memory <= 4) return 'medium';
    return 'high';
  } catch {
    return 'medium';
  }
}

export function buildConfig(quality: 'high' | 'medium' | 'low'): WorldConfig {
  switch (quality) {
    case 'high':
      return {
        nodeCount: 450,
        linkCount: 1300,
        pulseCount: 320,
        coreDensity: 90,
        rippleCount: 8,
        dpr: [1, 2],
        bloom: true,
      };
    case 'medium':
      return {
        nodeCount: 300,
        linkCount: 750,
        pulseCount: 180,
        coreDensity: 55,
        rippleCount: 6,
        dpr: [1, 1.5],
        bloom: true,
      };
    default:
      return {
        nodeCount: 160,
        linkCount: 320,
        pulseCount: 90,
        coreDensity: 30,
        rippleCount: 4,
        dpr: [1, 1],
        bloom: false,
      };
  }
}

/* ------------------------------------------------------------------ */
/*  World state                                                       */
/* ------------------------------------------------------------------ */

export interface NeuralWorld {
  quality: 'high' | 'medium' | 'low';
  config: WorldConfig;
  nodes: NeuralNode[];
  links: NeuralLink[];
  pulses: PulseParticle[];
  interaction: InteractionState;
  /** Total time accumulator */
  time: number;
  /** Called when nodes were recreated (resize / quality) */
  version: number;
}

/* ------------------------------------------------------------------ */
/*  Colors & palette                                                  */
/* ------------------------------------------------------------------ */

export const PALETTE: THREE.Color[] = [
  new THREE.Color('#e62429'), // cyan
  new THREE.Color('#ff3b3f'), // cyan-blue
  new THREE.Color('#3b82f6'), // blue
  new THREE.Color('#2b6cff'), // purple
  new THREE.Color('#ffffff'), // white
];

export function nodeColor(node: NeuralNode): THREE.Color {
  return PALETTE[node.color % PALETTE.length];
}

/* ------------------------------------------------------------------ */
/*  Glow texture (radial gradient sprite)                             */
/* ------------------------------------------------------------------ */

let _glowTexture: THREE.Texture | null = null;

export function getGlowTexture(): THREE.Texture {
  if (_glowTexture) return _glowTexture;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  _glowTexture = texture;
  return texture;
}

/* ------------------------------------------------------------------ */
/*  Random helpers                                                    */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Build the brain node distribution                                 */
/* ------------------------------------------------------------------ */

function buildNodes(config: WorldConfig, seed = 1337): NeuralNode[] {
  const rand = mulberry32(seed);
  const nodes: NeuralNode[] = [];

  /**
   * Layered "brain" distribution:
   *   layer 0 — outer faint halo (infinite depth, far)
   *   layer 1 — mid shell (thin client / cortex)
   *   layer 2 — inner dense region
   *   layer 3 — central core cluster (dense, bright)
   */
  const layers = [
    { count: Math.floor(config.nodeCount * 0.28), rMin: 5.5, rMax: 9.5, scale: 0.35, alpha: 0.35, speed: 0.05, colors: [1, 3] },
    { count: Math.floor(config.nodeCount * 0.3), rMin: 3.2, rMax: 6.0, scale: 0.55, alpha: 0.6, speed: 0.09, colors: [0, 1, 3] },
    { count: Math.floor(config.nodeCount * 0.26), rMin: 1.4, rMax: 3.4, scale: 0.8, alpha: 0.85, speed: 0.14, colors: [0, 1, 2, 4] },
    { count: config.coreDensity, rMin: 0.15, rMax: 1.35, scale: 1.0, alpha: 1.0, speed: 0.2, colors: [0, 4] },
  ];

  for (let li = 0; li < layers.length; li++) {
    const layer = layers[li];
    for (let i = 0; i < layer.count; i++) {
      // Spherical shell distribution
      const r = layer.rMin + rand() * (layer.rMax - layer.rMin);
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);

      const home = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.75,
        r * Math.cos(phi),
      );

      // Orbit axis (slightly tilted)
      const axis = new THREE.Vector3(
        rand() - 0.5,
        rand() - 0.5,
        rand() - 0.5,
      ).normalize();

      const colorIdx = layer.colors[Math.floor(rand() * layer.colors.length)];

      nodes.push({
        home,
        pos: home.clone(),
        axis,
        radius: r,
        phase: rand() * Math.PI * 2,
        speed: layer.speed * (0.6 + rand() * 0.8),
        scale: layer.scale * (0.6 + rand() * 0.9),
        color: colorIdx,
        layer: li,
        twinkle: rand() * Math.PI * 2,
        alpha: layer.alpha * (0.6 + rand() * 0.4),
        vel: new THREE.Vector3(),
      });
    }
  }

  return nodes;
}

/* ------------------------------------------------------------------ */
/*  Build connection topology                                         */
/* ------------------------------------------------------------------ */

function buildLinks(nodes: NeuralNode[], config: WorldConfig): NeuralLink[] {
  const links: NeuralLink[] = [];
  const n = nodes.length;

  // Spatial hash grid for fast nearest-neighbor queries
  const cellSize = 1.6;
  const grid = new Map<string, number[]>();
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;

  for (let i = 0; i < n; i++) {
    const p = nodes[i].pos;
    const k = key(
      Math.floor(p.x / cellSize),
      Math.floor(p.y / cellSize),
      Math.floor(p.z / cellSize),
    );
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k)!.push(i);
  }

  const neighborCells = [
    [0, 0, 0], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
    [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],
    [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
    [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1],
  ];

  const used = new Set<string>();
  const linkKey = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`);

  // 1) Nearest neighbors (dense local web)
  const localBudget = Math.floor(config.linkCount * 0.7);
  for (let i = 0; i < n && links.length < localBudget; i++) {
    const p = nodes[i].pos;
    const cx = Math.floor(p.x / cellSize);
    const cy = Math.floor(p.y / cellSize);
    const cz = Math.floor(p.z / cellSize);

    const candidates: number[] = [];
    for (const [ox, oy, oz] of neighborCells) {
      const cell = grid.get(key(cx + ox, cy + oy, cz + oz));
      if (cell) candidates.push(...cell);
    }

    // Sort candidates by distance, take closest few
    const dists = candidates
      .filter((j) => j !== i)
      .map((j) => ({ j, d: p.distanceToSquared(nodes[j].pos) }))
      .sort((a, b) => a.d - b.d);

    const perNode = Math.max(2, Math.floor((localBudget / n) * 1.6));
    let added = 0;
    for (const { j, d } of dists) {
      if (added >= perNode) break;
      if (links.length >= localBudget) break;
      const kk = linkKey(i, j);
      if (used.has(kk)) continue;
      if (d > 14) continue; // max local distance ~3.7
      used.add(kk);
      const dist = Math.sqrt(d);
      links.push({
        a: i,
        b: j,
        length: dist,
        width: 0.6 + Math.random() * 0.8,
        color: Math.random() < 0.5 ? 0 : Math.random() < 0.7 ? 1 : 3,
      });
      added++;
    }
  }

  // 2) Long-range "synapse" connections (bridge distant regions)
  const bridgeBudget = config.linkCount - links.length;
  const layerBands = [0, 1, 2, 3];
  for (let k = 0; k < bridgeBudget; k++) {
    const la = layerBands[Math.floor(Math.random() * layerBands.length)];
    const lb = la === 0 ? 3 : la === 3 ? 0 : la + (Math.random() < 0.5 ? -1 : 1);
    const poolA: number[] = [];
    const poolB: number[] = [];
    nodes.forEach((node, idx) => {
      if (node.layer === la) poolA.push(idx);
      if (node.layer === Math.max(0, Math.min(3, lb))) poolB.push(idx);
    });
    if (!poolA.length || !poolB.length) continue;

    const a = poolA[Math.floor(Math.random() * poolA.length)];
    const b = poolB[Math.floor(Math.random() * poolB.length)];
    const kk = linkKey(a, b);
    if (used.has(kk)) { k--; continue; }
    used.add(kk);
    const dist = nodes[a].pos.distanceTo(nodes[b].pos);
    links.push({
      a,
      b,
      length: dist,
      width: 0.3 + Math.random() * 0.5,
      color: Math.random() < 0.4 ? 0 : Math.random() < 0.8 ? 1 : 3,
    });
  }

  return links;
}

/* ------------------------------------------------------------------ */
/*  Build pulses                                                      */
/* ------------------------------------------------------------------ */

function buildPulses(config: WorldConfig, links: NeuralLink[]): PulseParticle[] {
  const pulses: PulseParticle[] = [];
  for (let i = 0; i < config.pulseCount; i++) {
    const link = Math.floor(Math.random() * links.length);
    pulses.push({
      link,
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.35,
      color: Math.random() < 0.6 ? 0 : Math.random() < 0.8 ? 1 : 3,
      life: 0,
    });
  }
  return pulses;
}

/* ------------------------------------------------------------------ */
/*  Interaction store & listeners                                     */
/* ------------------------------------------------------------------ */

function createInteraction(): InteractionState {
  return {
    mouse: new THREE.Vector2(),
    smooth: new THREE.Vector2(),
    cursor: new THREE.Vector3(999, 999, 0),
    active: false,
    ripples: [],
    scroll: 0,
    smoothScroll: 0,
    quality: detectQuality(),
  };
}

let _attached = false;
let _currentWorld: NeuralWorld | null = null;

function attachListeners() {
  if (_attached) return;
  _attached = true;

  const onMouseMove = (e: MouseEvent) => {
    const world = _currentWorld;
    if (!world) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    world.interaction.mouse.set(x, y);
    world.interaction.cursor.set(
      (e.clientX / window.innerWidth) * 16 - 8,
      -(e.clientY / window.innerHeight) * 10 + 5,
      0,
    );
    world.interaction.active = true;
  };

  const onMouseLeave = () => {
    const world = _currentWorld;
    if (!world) return;
    world.interaction.active = false;
    world.interaction.cursor.set(999, 999, 0);
  };

  const onMouseDown = (e: MouseEvent) => {
    const world = _currentWorld;
    if (!world) return;
    const ripple: RippleWave = {
      center: new THREE.Vector3(
        (e.clientX / window.innerWidth) * 16 - 8,
        -(e.clientY / window.innerHeight) * 10 + 5,
        0,
      ),
      radius: 0,
      maxRadius: 5 + Math.random() * 2,
      life: 0,
      duration: 1.6 + Math.random() * 0.6,
      color: new THREE.Color(Math.random() < 0.5 ? '#e62429' : '#2b6cff'),
    };
    if (world.interaction.ripples.length < world.config.rippleCount) {
      world.interaction.ripples.push(ripple);
    }
  };

  const onScroll = () => {
    const world = _currentWorld;
    if (!world) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    world.interaction.scroll = Math.min(1, Math.max(0, window.scrollY / max));
  };

  const onResize = () => {
    const world = _currentWorld;
    if (!world) return;
    // Rebuild world with new quality (nodes/links adapt)
    const q = detectQuality();
    if (q !== world.quality) {
      world.quality = q;
      world.config = buildConfig(q);
      world.nodes = buildNodes(world.config, Math.floor(Math.random() * 100000) + 1);
      world.links = buildLinks(world.nodes, world.config);
      world.pulses = buildPulses(world.config, world.links);
      world.version++;
    }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('mousedown', onMouseDown, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
}

/* ------------------------------------------------------------------ */
/*  World creation / teardown                                         */
/* ------------------------------------------------------------------ */

export function createWorld(el: HTMLElement): NeuralWorld {
  const quality = detectQuality();
  const config = buildConfig(quality);

  const nodes = buildNodes(config);
  const links = buildLinks(nodes, config);
  const pulses = buildPulses(config, links);

  const world: NeuralWorld = {
    quality,
    config,
    nodes,
    links,
    pulses,
    interaction: createInteraction(),
    time: 0,
    version: 0,
  };

  _currentWorld = world;
  attachListeners();

  return world;
}

export function destroyWorld(world: NeuralWorld) {
  if (_currentWorld === world) _currentWorld = null;
  world.interaction.ripples.length = 0;
}

