import { Canvas } from '@react-three/fiber';

export function NeuralNetwork3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{
          position: [0, 0, 8],
          fov: 60,
          near: 0.1,
          far: 30,
        }}
      >
        {/* Content removed per user request */}
      </Canvas>
    </div>
  );
}
