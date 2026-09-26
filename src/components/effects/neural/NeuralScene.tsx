import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createWorld,
  getGlowTexture,
  PALETTE,
  type NeuralWorld,
  type RippleWave,
} from './world';

/* ================================================================== */
/*  Shared world reference (module-level, survives StrictMode)        */
/* ================================================================== */

let sceneWorld: NeuralWorld | null = null;

/* ================================================================== */
/*  Temp vectors                                                      */
/* ================================================================== */

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _c = new THREE.Color();

/* ================================================================== */
/*  AI CORE HUB — central glowing brain cluster                       */
/* ================================================================== */

function AICoreHub({ world }: { world: NeuralWorld }) {
  const coreRef = useRef<THREE.Group>(null);
  const pulseLight = useRef<THREE.PointLight>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Sprite>(null);

  const coreNodes = useMemo(() => {
    const count = world.config.coreDensity;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const rand = mulberry32(999);
    for (let i = 0; i < count; i++) {
      const r = 0.1 + Math.pow(rand(), 1.6) * 1.05;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const col = rand() < 0.7 ? PALETTE[0] : rand() < 0.85 ? PALETTE[1] : PALETTE[4];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, colors };
  }, [world.config.coreDensity]);

  const glowTexture = useMemo(() => getGlowTexture(), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);
    }
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.35;
      ring1.current.rotation.y = t * 0.18;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.26;
      ring2.current.rotation.z = t * 0.4;
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.5;
      ring3.current.rotation.z = -t * 0.15;
    }
    if (pulseLight.current) {
      pulseLight.current.intensity = 2.2 + Math.sin(t * 1.6) * 0.7;
    }
    if (shell.current) {
      const mat = shell.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 + Math.sin(t * 2.1) * 0.06 + Math.sin(t * 0.7) * 0.04;
    }
    if (glowRef.current) {
      const s = 5.5 + Math.sin(t * 1.4) * 0.6;
      glowRef.current.scale.set(s, s, 1);
      const mat = glowRef.current.material as THREE.SpriteMaterial;
      mat.opacity = 0.45 + Math.sin(t * 1.8) * 0.15;
    }
  });

  return (
    <group ref={coreRef}>
      <pointLight ref={pulseLight} color="#ff3b3f" intensity={2.4} distance={14} decay={2} />

      {/* Dense core node cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[coreNodes.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[coreNodes.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={glowTexture}
          sizeAttenuation
        />
      </points>

      {/* Central nucleus (soft cyan, not white-hot) */}
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color="#66e6ff" toneMapped={false} />
      </mesh>
      <mesh scale={1.6}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial
          color="#ff3b3f"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Holographic wireframe shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial color="#ff3b3f" wireframe transparent opacity={0.14} depthWrite={false} />
      </mesh>

      {/* Orbiting holographic rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.9, 0.015, 16, 100]} />
        <meshBasicMaterial color="#e62429" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.4, 0.012, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[2.9, 0.009, 16, 100]} />
        <meshBasicMaterial color="#2b6cff" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Big holographic glow sprite */}
      <sprite ref={glowRef} scale={[4.5, 4.5, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#0088cc"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/* ================================================================== */
/*  NEURAL NODES — instanced glowing brain cells                      */
/* ================================================================== */

function NeuralNodes({ world }: { world: NeuralWorld }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    const count = world.nodes.length;
    return {
      count,
      matrices: new Float32Array(count * 16),
      colors: new Float32Array(count * 3),
    };
  }, [world.nodes.length]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Attach the instance color attribute once.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const attr = new THREE.InstancedBufferAttribute(data.colors, 3);
    mesh.instanceColor = attr;
  }, [data.colors]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const w = sceneWorld;
    if (!mesh || !w) return;

    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    const nodes = w.nodes;
    const cursor = w.interaction.cursor;
    const active = w.interaction.active;

    w.interaction.smooth.lerp(w.interaction.mouse, 0.035);

    const cursorRange = 3.2;
    const cursorRangeSq = cursorRange * cursorRange;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // --- Orbit: rotate home position around node axis ---
      node.phase += node.speed * dt;
      _q.setFromAxisAngle(node.axis, node.phase);
      node.pos.copy(node.home).applyQuaternion(_q);

      // --- Cursor attraction ---
      if (active) {
        _v1.copy(cursor).sub(node.pos);
        const dSq = _v1.lengthSq();
        if (dSq < cursorRangeSq) {
          const d = Math.sqrt(dSq) + 0.001;
          const strength = (1 - d / cursorRange) * 0.9;
          node.vel.addScaledVector(_v1.normalize(), strength * dt * 4);
        }
      }
      node.vel.multiplyScalar(0.92);
      node.pos.addScaledVector(node.vel, dt * 4);

      // --- Hover glow boost ---
      let hoverBoost = 0;
      if (active) {
        _v2.copy(cursor).sub(node.pos);
        const d = _v2.length();
        if (d < cursorRange) hoverBoost = (1 - d / cursorRange) * 1.4;
      }

      // --- Scale: twinkle + pulse + hover ---
      const twinkle = 0.75 + 0.25 * Math.sin(t * 2.4 + node.twinkle);
      const pulse = 1 + Math.sin(t * 3 + node.phase * 4) * 0.12;
      const scale = node.scale * twinkle * pulse * (1 + hoverBoost * 0.4);

      dummy.position.copy(node.pos);
      dummy.scale.setScalar(scale);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();

      const m = data.matrices;
      const o = i * 16;
      const e = dummy.matrix.elements;
      for (let k = 0; k < 16; k++) m[o + k] = e[k];

      // --- Color: base * brightness * hover ---
const base = nodeColorLocal(node);
      const bright = node.alpha * (0.5 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.4 + node.twinkle))) * (1 + hoverBoost * 0.4);
      _c.copy(base).multiplyScalar(Math.min(1.1, bright * 0.9));
      const cc = data.colors;
      cc[i * 3] = _c.r;
      cc[i * 3 + 1] = _c.g;
      cc[i * 3 + 2] = _c.b;
    }

    mesh.count = nodes.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, data.count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 10, 10]} />
<meshBasicMaterial
        color="#ffffff"
        toneMapped={false}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function nodeColorLocal(node: { color: number }): THREE.Color {
  return PALETTE[node.color % PALETTE.length];
}

/* ================================================================== */
/*  NEURAL LINKS — GPU connection lines                               */
/* ================================================================== */

const LINKS_VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aColor;
  attribute float aEnergy;

  uniform float uTime;
  uniform vec3 uCursor;
  uniform float uCursorStrength;
  uniform float uScroll;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    vec3 mid = (aFrom + aTo) * 0.5;

    // Cursor energy field
    float dToCursor = distance(mid, uCursor);
    float field = 1.0 - smoothstep(0.0, 3.0, dToCursor);
    float energy = aEnergy * (0.35 + 0.65 * uCursorStrength * (0.25 + 0.75 * field));

    // Traveling wave
    float wave = 0.5 + 0.5 * sin(uTime * 2.2 + aEnergy * 12.0);
    energy *= 0.6 + 0.5 * wave;

    // Scroll fade for readability
    float scrollFade = 1.0 - uScroll * 0.4;

    // Depth fade
    float depthFade = 1.0 - smoothstep(6.0, 11.0, length(mid));
    depthFade = clamp(depthFade, 0.08, 1.0);

    vColor = aColor;
    vAlpha = clamp(energy * depthFade * scrollFade, 0.0, 1.0);
    vEnergy = energy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LINKS_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;

  void main() {
    float pulse = 0.7 + 0.3 * sin(uTime * 3.0 + vEnergy * 40.0);
    vec3 col = vColor * (0.5 + 0.3 * pulse);
    float alpha = vAlpha * (0.25 + 0.35 * pulse);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function NeuralLinks({ world }: { world: NeuralWorld }) {
  const segRef = useRef<THREE.LineSegments>(null);

  const buffers = useMemo(() => {
    const links = world.links;
    const count = links.length;
    const verts = new Float32Array(count * 6);
    const from = new Float32Array(count * 6);
    const to = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);
    const energies = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      const l = links[i];
      const na = world.nodes[l.a];
      const nb = world.nodes[l.b];
      const c = PALETTE[l.color];

      const v0 = i * 6;
      const v1 = i * 6 + 3;
      verts[v0] = na.pos.x; verts[v0 + 1] = na.pos.y; verts[v0 + 2] = na.pos.z;
      verts[v1] = nb.pos.x; verts[v1 + 1] = nb.pos.y; verts[v1 + 2] = nb.pos.z;

      from[v0] = na.pos.x; from[v0 + 1] = na.pos.y; from[v0 + 2] = na.pos.z;
      to[v0] = nb.pos.x; to[v0 + 1] = nb.pos.y; to[v0 + 2] = nb.pos.z;
      from[v1] = na.pos.x; from[v1 + 1] = na.pos.y; from[v1 + 2] = na.pos.z;
      to[v1] = nb.pos.x; to[v1 + 1] = nb.pos.y; to[v1 + 2] = nb.pos.z;

      colors[v0] = c.r; colors[v0 + 1] = c.g; colors[v0 + 2] = c.b;
      colors[v1] = c.r; colors[v1 + 1] = c.g; colors[v1 + 2] = c.b;

      const e = 0.3 + Math.random() * 0.7;
      energies[i * 2] = e;
      energies[i * 2 + 1] = e;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geometry.setAttribute('aFrom', new THREE.BufferAttribute(from, 3));
    geometry.setAttribute('aTo', new THREE.BufferAttribute(to, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aEnergy', new THREE.BufferAttribute(energies, 1));
    return geometry;
  }, [world.links, world.nodes]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: LINKS_VERT,
        fragmentShader: LINKS_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uCursor: { value: new THREE.Vector3(999, 999, 0) },
          uCursorStrength: { value: 0 },
          uScroll: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

useFrame((state) => {
    const w = sceneWorld;
    const geo = segRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (!w || !geo) return;
    const t = state.clock.getElapsedTime();

    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    const from = geo.getAttribute('aFrom') as THREE.BufferAttribute;
    const to = geo.getAttribute('aTo') as THREE.BufferAttribute;

    for (let i = 0; i < w.links.length; i++) {
      const l = w.links[i];
      const na = w.nodes[l.a].pos;
      const nb = w.nodes[l.b].pos;
      const v0 = i * 6;
      const v1 = i * 6 + 3;
      pos.array[v0] = na.x; pos.array[v0 + 1] = na.y; pos.array[v0 + 2] = na.z;
      pos.array[v1] = nb.x; pos.array[v1 + 1] = nb.y; pos.array[v1 + 2] = nb.z;
      from.array[v0] = na.x; from.array[v0 + 1] = na.y; from.array[v0 + 2] = na.z;
      to.array[v0] = nb.x; to.array[v0 + 1] = nb.y; to.array[v0 + 2] = nb.z;
      from.array[v1] = na.x; from.array[v1 + 1] = na.y; from.array[v1 + 2] = na.z;
      to.array[v1] = nb.x; to.array[v1 + 1] = nb.y; to.array[v1 + 2] = nb.z;
    }

    pos.needsUpdate = true;
    from.needsUpdate = true;
    to.needsUpdate = true;

    const mat = material;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uCursor.value.copy(w.interaction.cursor);
    mat.uniforms.uCursorStrength.value = w.interaction.active ? 1 : 0;
    mat.uniforms.uScroll.value = w.interaction.smoothScroll;
  });

  return (
<lineSegments ref={segRef} geometry={buffers} material={material} frustumCulled={false} />
  );
}

/* ================================================================== */
/*  ENERGY PULSES — traveling data packets along links                */
/* ================================================================== */

function EnergyPulses({ world }: { world: NeuralWorld }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = world.config.pulseCount;

  const [positions, colors, alphas] = useMemo(() => {
    return [
      new Float32Array(count * 3),
      new Float32Array(count * 3),
      new Float32Array(count),
    ];
  }, [count]);

  const geo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    return geometry;
  }, [positions, colors, alphas]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          attribute vec3 aColor;
          attribute float aAlpha;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = aColor;
            vAlpha = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 6.0 * (1.5 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec4 tex = texture2D(uMap, gl_PointCoord);
            gl_FragColor = vec4(vColor, vAlpha * tex.a);
          }
        `,
        uniforms: { uMap: { value: getGlowTexture() } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((state, delta) => {
    const w = sceneWorld;
    const geoRef = pointsRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (!w || !geoRef) return;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < w.pulses.length; i++) {
      const p = w.pulses[i];
      const link = w.links[p.link];
      if (!link) continue;

      p.t += p.speed * dt * 1.4;
      if (p.t > 1) {
        p.t = 0;
        p.link = Math.floor(Math.random() * w.links.length);
        continue;
      }

      const na = w.nodes[link.a].pos;
      const nb = w.nodes[link.b].pos;
      _v1.lerpVectors(na, nb, p.t);

      positions[i * 3] = _v1.x;
      positions[i * 3 + 1] = _v1.y;
      positions[i * 3 + 2] = _v1.z;

      const c = PALETTE[p.color];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      alphas[i] = Math.sin(p.t * Math.PI) * 0.9;
    }

    const pa = geoRef.getAttribute('position') as THREE.BufferAttribute;
    const ca = geoRef.getAttribute('aColor') as THREE.BufferAttribute;
    const aa = geoRef.getAttribute('aAlpha') as THREE.BufferAttribute;
    pa.needsUpdate = true;
    ca.needsUpdate = true;
    aa.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geo} material={material} frustumCulled={false} />;
}

/* ================================================================== */
/*  RIPPLE WAVES — click shockwaves                                   */
/* ================================================================== */

function RippleWaves({ world }: { world: NeuralWorld }) {
  const groupRef = useRef<THREE.Group>(null);
  const MAX = 12;

  const waves = useMemo(
    () =>
      Array.from({ length: MAX }, () => ({
        mesh: null as THREE.Mesh | null,
        active: false,
        radius: 0,
        maxRadius: 5,
        life: 0,
        duration: 1.6,
        color: new THREE.Color('#e62429'),
      })),
    [],
  );

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts: number[] = [];
    const idx: number[] = [];
    const N = 48;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      verts.push(Math.cos(a), 0, Math.sin(a));
    }
    for (let i = 0; i < N; i++) {
      const next = (i + 1) % N;
      idx.push(N, i, next);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(idx);
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#e62429',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        wireframe: true,
      }),
    [],
  );

  useFrame((state, delta) => {
    const w = sceneWorld;
    if (!w) return;
    const dt = Math.min(delta, 0.05);

    if (w.interaction.ripples.length > 0) {
      const ripple = w.interaction.ripples.shift() as RippleWave;
      const slot = waves.find((x) => !x.active) || waves[0];
      slot.active = true;
      slot.radius = 0;
      slot.maxRadius = ripple.maxRadius;
      slot.life = 0;
      slot.duration = ripple.duration;
      slot.color.copy(ripple.color);
      if (slot.mesh) slot.mesh.position.copy(ripple.center);
    }

    for (const wave of waves) {
      if (!wave.active || !wave.mesh) continue;
      wave.life += dt;
      const p = wave.life / wave.duration;
      if (p >= 1) {
        wave.active = false;
        wave.mesh.visible = false;
        continue;
      }
      wave.radius = wave.maxRadius * (1 - Math.pow(1 - p, 2.2));
      wave.mesh.scale.setScalar(wave.radius);
      wave.mesh.visible = true;
      const m = wave.mesh.material as THREE.MeshBasicMaterial;
      m.opacity = (1 - p) * 0.7;
      m.color.copy(wave.color);
    }
  });

  return (
    <group ref={groupRef}>
      {waves.map((wave, i) => (
        <mesh
          key={i}
          ref={(el) => {
            wave.mesh = el;
          }}
          geometry={geo}
          material={mat}
          visible={false}
        />
      ))}
    </group>
  );
}

/* ================================================================== */
/*  ORCHESTRATOR — global motion, parallax, scroll                    */
/* ================================================================== */

function Orchestrator({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);

  useEffect(() => {
    const w = sceneWorld;
    if (w) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      w.interaction.scroll = Math.min(1, Math.max(0, window.scrollY / max));
    }
  }, []);

  useFrame((state, delta) => {
    const w = sceneWorld;
    if (!w || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    const cam = cameraRef.current || state.camera;

    w.interaction.smooth.lerp(w.interaction.mouse, 0.03);
    w.interaction.smoothScroll += (w.interaction.scroll - w.interaction.smoothScroll) * 0.06;

    // Jarvis-style mouse rotation
    const targetRotX = w.interaction.smooth.y * 0.18;
    const targetRotY = w.interaction.smooth.x * 0.28;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.y += Math.sin(t * 0.1) * 0.0012 * dt * 60;

    // Breathing scale
    groupRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.015);

    // Scroll parallax
    const ss = w.interaction.smoothScroll;
    groupRef.current.position.y = ss * 2.2;
    groupRef.current.position.z = -ss * 1.5;

    // Camera subtle parallax
    cam.position.x += (w.interaction.smooth.x * 0.3 - cam.position.x) * 0.02;
    cam.position.y += (-w.interaction.smooth.y * 0.2 - cam.position.y) * 0.02;
    cam.lookAt(0, 0, 0);
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ================================================================== */
/*  Scene root                                                        */
/* ================================================================== */

export function NeuralScene() {
  // This background lives for the entire app lifetime.
  // The world is created once and NEVER destroyed — this avoids the React
  // StrictMode double-mount (mount -> cleanup -> mount) killing the world
  // reference, which would leave every useFrame early-returning (= invisible).
  const world = useMemo(() => {
    if (!sceneWorld) {
      sceneWorld = createWorld(document.body);
    }
    return sceneWorld;
  }, []);

  return (
    <Orchestrator>
      <AICoreHub world={world} />
      <NeuralNodes world={world} />
      <NeuralLinks world={world} />
      <EnergyPulses world={world} />
      <RippleWaves world={world} />
    </Orchestrator>
  );
}

/* ================================================================== */
/*  tiny mulberry32 (deterministic for core cluster)                  */
/* ================================================================== */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
