import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Ring } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.2;
      orbRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4;
      ring1Ref.current.rotation.y = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.3;
      ring2Ref.current.rotation.z = t * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.6;
      ring3Ref.current.rotation.z = -t * 0.2;
    }
  });

  return (
    <group scale={1.2}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        {/* Core Pulsing Neural Orb */}
        <Sphere ref={orbRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#ff3b3f"
            emissive="#e62429"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
            distort={0.35}
            speed={2}
            wireframe={false}
          />
        </Sphere>

        {/* Inner Holographic Wireframe Core */}
        <Sphere args={[1.25, 32, 32]}>
          <meshBasicMaterial
            color="#2b6cff"
            wireframe
            transparent
            opacity={0.3}
          />
        </Sphere>

        {/* Outer Orbiting Holographic Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.0, 0.02, 16, 100]} />
          <meshBasicMaterial color="#e62429" transparent opacity={0.7} />
        </mesh>

        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.5, 0.015, 16, 100]} />
          <meshBasicMaterial color="#2b6cff" transparent opacity={0.6} />
        </mesh>

        <mesh ref={ring3Ref}>
          <torusGeometry args={[3.0, 0.01, 16, 100]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

export function AICore3D() {
  return (
    <div className="w-full h-full min-h-[450px] sm:min-h-[550px] relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#e62429" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#2b6cff" />
        <AnimatedOrb />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-cyber-dark/80 border border-cyber-cyan/30 text-[11px] font-mono text-cyber-cyan backdrop-blur-md shadow-[0_0_15px_rgba(230,36,41,0.3)] flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyber-blue animate-ping" />
        <span>INTERACTIVE 3D AI CORE — ROTATE WITH MOUSE</span>
      </div>
    </div>
  );
}
