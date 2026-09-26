# TODO - 3D AI Neural Mind Map Background

## Status: ✅ COMPLETE

## Steps

- [x] Understand the task & read relevant files (layout.tsx, ParticleField.tsx, AICore3D.tsx, styles, configs)
- [x] Get plan approval from user
- [x] Install `@react-three/postprocessing` + `postprocessing` dependencies
- [x] Create `src/components/effects/neural/world.ts` (adaptive quality, brain node distribution, connections, interaction store, glow texture)
- [x] Create `src/components/effects/neural/NeuralScene.tsx` (AI Core hub, instanced nodes, shader links, energy pulses, ripple waves, orchestrator)
- [x] Create `src/components/effects/NeuralNetwork3D.tsx` (Canvas wrapper, fog, Bloom postprocessing)
- [x] Update `src/app/layout.tsx` to use NeuralNetwork3D (remove ParticleField + AnimatedGrid)
- [x] Verify with `npm run build` ✅ (Compiled successfully, all pages generated)
- [x] Tune brightness: softer central nucleus (cyan not white), dimmer glow sprite, dimmer connection lines
- [x] Fix framer-motion `backgroundColor`/`borderColor` warning in CustomCursor (moved to `style` prop)
- [x] Verify dev server compiles cleanly (GET / 200)
