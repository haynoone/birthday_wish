import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { sound } from '../../utils/sound';
import { Flame, Sparkles as SparklesIcon, Gamepad2, Cake } from 'lucide-react';
import { SplineLoveScene } from './SplineLoveScene';

interface Particle {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  color: string;
  size: number;
}

// Low-poly Mini Volcano Component ("Lil Valcano🌋")
const MiniVolcanoModel: React.FC<{
  isErupting: boolean;
  onInteract: () => void;
}> = ({ isErupting, onInteract }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lavaMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Auto rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isErupting ? 1.2 : 0.4);
    }
    // Lava pulsation
    if (lavaMaterialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * (isErupting ? 8 : 2.5)) * 0.3 + 0.7;
      lavaMaterialRef.current.emissiveIntensity = isErupting ? pulse * 2.5 : pulse * 1.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.6, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onInteract();
      }}
    >
      {/* Base Island / Mountain Foundation */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 2.2, 0.4, 7]} />
        <meshStandardMaterial color="#2d3748" roughness={0.9} flatShading />
      </mesh>

      {/* Main Volcano Cone */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 1.6, 1.4, 8]} />
        <meshStandardMaterial color="#332a24" roughness={0.85} flatShading />
      </mesh>

      {/* Top Crater Rim */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <torusGeometry args={[0.65, 0.15, 6, 8]} />
        <meshStandardMaterial color="#443428" roughness={0.8} flatShading />
      </mesh>

      {/* Glowing Lava inside Crater */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 8]} />
        <meshStandardMaterial
          ref={lavaMaterialRef}
          color="#ff3e00"
          emissive="#ff4500"
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>

      {/* Dripping Lava Trails */}
      <mesh position={[0.45, 1.1, 0.45]} rotation={[0.2, 0.4, -0.2]}>
        <coneGeometry args={[0.12, 0.7, 5]} />
        <meshStandardMaterial color="#ff5722" emissive="#ff6e40" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.5, 1.05, 0.3]} rotation={[0.2, -0.3, 0.2]}>
        <coneGeometry args={[0.1, 0.6, 5]} />
        <meshStandardMaterial color="#ff5722" emissive="#ff6e40" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.1, 1.15, -0.55]} rotation={[-0.2, 0, 0]}>
        <coneGeometry args={[0.11, 0.65, 5]} />
        <meshStandardMaterial color="#ff5722" emissive="#ff6e40" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
};

// Realistic Artisan Celebration Cake with rich details, tiered sponge, glazed ganache drip, piped frosting pearls, glossy strawberries, chocolate wafer straws, colorful sprinkles, and animated dynamic candle flames
const BirthdayCakeModel: React.FC<{
  isCelebrating?: boolean;
  onInteract: () => void;
}> = ({ isCelebrating = false, onInteract }) => {
  const groupRef = useRef<THREE.Group>(null);
  const flameLightsRef = useRef<THREE.PointLight[]>([]);

  // Slow, elegant auto-rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isCelebrating ? 0.8 : 0.35);
    }
    const t = state.clock.elapsedTime;
    // Flickering candle lights
    flameLightsRef.current.forEach((light, i) => {
      if (light) {
        const flicker = Math.sin(t * 16 + i * 2) * 0.25 + Math.cos(t * 26 + i) * 0.15;
        light.intensity = (isCelebrating ? 3.5 : 1.8) + flicker;
      }
    });
  });

  // Precomputed geometry positions
  const tier1Pearls = useMemo(() => {
    const count = 22;
    const r = 1.34;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return [Math.cos(angle) * r, 0.32, Math.sin(angle) * r] as [number, number, number];
    });
  }, []);

  const tier2Pearls = useMemo(() => {
    const count = 16;
    const r = 0.9;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return [Math.cos(angle) * r, 1.06, Math.sin(angle) * r] as [number, number, number];
    });
  }, []);

  // Cascading glaze drip drops along Tier 1 edge
  const glazeDrips = useMemo(() => {
    const count = 12;
    const r = 1.33;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const dripLen = 0.12 + ((i * 7) % 5) * 0.035;
      return {
        pos: [Math.cos(angle) * r, 0.98 - dripLen / 2, Math.sin(angle) * r] as [number, number, number],
        len: dripLen,
      };
    });
  }, []);

  // Realistic Strawberries on top of Tier 2
  const strawberries = useMemo(() => {
    const count = 5;
    const r = 0.52;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + 0.3;
      return {
        pos: [Math.cos(angle) * r, 1.82, Math.sin(angle) * r] as [number, number, number],
        rot: [0.1, angle, 0.15] as [number, number, number],
      };
    });
  }, []);

  // Edible rainbow sprinkles scattered on glaze
  const sprinkles = useMemo(() => {
    const colors = ['#f59e0b', '#fb7185', '#38bdf8', '#34d399', '#fef08a', '#ffffff'];
    return Array.from({ length: 24 }, (_, i) => {
      const r = 0.2 + (i % 5) * 0.11;
      const angle = (i / 24) * Math.PI * 2 + (i % 3) * 0.4;
      return {
        pos: [Math.cos(angle) * r, 1.76, Math.sin(angle) * r] as [number, number, number],
        rot: [Math.PI / 2, 0, (i * 0.4)] as [number, number, number],
        color: colors[i % colors.length],
      };
    });
  }, []);

  // Candle setups
  const candleConfigs = [
    { pos: [-0.3, 1.76, 0.08] as [number, number, number], waxColor: '#fbcfe8', stripeColor: '#f43f5e' },
    { pos: [0.0, 1.76, -0.22] as [number, number, number], waxColor: '#bae6fd', stripeColor: '#0284c7' },
    { pos: [0.3, 1.76, 0.08] as [number, number, number], waxColor: '#fef08a', stripeColor: '#eab308' },
  ];

  return (
    <group
      ref={groupRef}
      position={[0, -0.75, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onInteract();
      }}
    >
      {/* --- ELEGANT CERAMIC CAKE STAND --- */}
      {/* Stand Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.18, 0.08, 36]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
      </mesh>
      {/* Stand Stem */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.32, 0.48, 0.22, 32]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.15} />
      </mesh>
      {/* Stand Platter Surface */}
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <cylinderGeometry args={[1.62, 1.62, 0.07, 36]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.12} />
      </mesh>
      {/* Gold Trim Ring around Platter */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.62, 0.028, 16, 48]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* --- TIER 1 (BOTTOM SPONGE & FROSTING) --- */}
      {/* Bottom Vanilla Sponge & Velvet Cream */}
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.32, 1.32, 0.74, 36]} />
        <meshStandardMaterial color="#fff1f2" roughness={0.4} />
      </mesh>
      {/* Middle Strawberry Jam Layer */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[1.33, 1.33, 0.06, 36]} />
        <meshStandardMaterial color="#e11d48" roughness={0.2} />
      </mesh>
      {/* Top Frosting Glaze on Tier 1 */}
      <mesh position={[0, 1.04, 0]}>
        <cylinderGeometry args={[1.33, 1.33, 0.06, 36]} />
        <meshStandardMaterial color="#fb7185" roughness={0.25} />
      </mesh>

      {/* Base Frosting Pearls (Tier 1) */}
      {tier1Pearls.map((pos, idx) => (
        <mesh key={`t1-pearl-${idx}`} position={pos}>
          <sphereGeometry args={[0.072, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      ))}

      {/* Cascading Glaze Drips (Tier 1) */}
      {glazeDrips.map((drip, idx) => (
        <mesh key={`drip-${idx}`} position={drip.pos}>
          <capsuleGeometry args={[0.038, drip.len, 8, 8]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.15} metalness={0.08} />
        </mesh>
      ))}

      {/* --- TIER 2 (TOP TIER) --- */}
      {/* Top Sponge Body */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.88, 0.66, 36]} />
        <meshStandardMaterial color="#fff7ed" roughness={0.38} />
      </mesh>
      {/* Glossy Top Strawberry Mirror Glaze */}
      <mesh position={[0, 1.74, 0]}>
        <cylinderGeometry args={[0.895, 0.895, 0.05, 36]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.12} metalness={0.08} />
      </mesh>

      {/* Tier 2 Base Cream Pearls */}
      {tier2Pearls.map((pos, idx) => (
        <mesh key={`t2-pearl-${idx}`} position={pos}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      ))}

      {/* --- FRESH REALISTIC TOPPINGS (STRAWBERRIES & WAFER STICKS) --- */}
      {strawberries.map((sb, idx) => (
        <group key={`sb-${idx}`} position={sb.pos} rotation={sb.rot}>
          {/* Berry Body */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <coneGeometry args={[0.11, 0.22, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.22} metalness={0.05} />
          </mesh>
          {/* Berry Base Curve */}
          <mesh position={[0, -0.01, 0]}>
            <sphereGeometry args={[0.105, 12, 12]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.25} />
          </mesh>
          {/* Green Calyx Leaves */}
          <mesh position={[0, 0.19, 0]} rotation={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.09, 0.02, 0.02, 6]} />
            <meshStandardMaterial color="#16a34a" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Rolled Chocolate Wafer Sticks */}
      <mesh position={[0.12, 1.83, 0.12]} rotation={[0.2, 0.6, 1.3]}>
        <cylinderGeometry args={[0.032, 0.032, 0.55, 12]} />
        <meshStandardMaterial color="#78350f" roughness={0.35} />
      </mesh>
      <mesh position={[-0.1, 1.84, -0.05]} rotation={[-0.2, -0.7, 1.25]}>
        <cylinderGeometry args={[0.032, 0.032, 0.5, 12]} />
        <meshStandardMaterial color="#78350f" roughness={0.35} />
      </mesh>

      {/* Rainbow Sprinkles on Glaze */}
      {sprinkles.map((sp, idx) => (
        <mesh key={`sp-${idx}`} position={sp.pos} rotation={sp.rot}>
          <capsuleGeometry args={[0.014, 0.045, 6, 6]} />
          <meshStandardMaterial color={sp.color} roughness={0.3} />
        </mesh>
      ))}

      {/* --- DETAILED CANDLES WITH DYNAMIC FLICKERING FLAMES --- */}
      {candleConfigs.map((candle, idx) => (
        <group key={`candle-${idx}`} position={candle.pos}>
          {/* Candle Wax Body */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.52, 16]} />
            <meshStandardMaterial color={candle.waxColor} roughness={0.35} />
          </mesh>
          {/* Candle Gold Accent Ring */}
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.039, 0.039, 0.08, 16]} />
            <meshStandardMaterial color={candle.stripeColor} roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Cotton Wick */}
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.07, 8]} />
            <meshStandardMaterial color="#27272a" roughness={0.8} />
          </mesh>
          {/* Dynamic Flickering Flame: Outer Corona */}
          <mesh position={[0, 0.64, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={2.5}
              roughness={0.1}
            />
          </mesh>
          {/* Flame: Inner Hot Yellow Core */}
          <mesh position={[0, 0.63, 0]}>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={4}
              roughness={0.1}
            />
          </mesh>
          {/* Dynamic Light Cast by Candle */}
          <pointLight
            ref={(el) => {
              if (el) flameLightsRef.current[idx] = el;
            }}
            position={[0, 0.68, 0]}
            color="#f59e0b"
            distance={2.5}
            intensity={isCelebrating ? 3.5 : 1.8}
          />
        </group>
      ))}
    </group>
  );
};

// Alternative Model: Floating Heart
const FloatingHeartModel: React.FC<{ onInteract: () => void }> = ({ onInteract }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onInteract();
      }}
    >
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[-0.4, 0.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.2} />
      </mesh>
      <mesh position={[0.4, 0.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.2} />
      </mesh>
    </group>
  );
};

// Dynamic Floating 3D Eruption Particles
const EruptionParticles: React.FC<{ isErupting: boolean }> = ({ isErupting }) => {
  const count = isErupting ? 40 : 15;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      x: (Math.random() - 0.5) * 0.6,
      y: 1.6 + Math.random() * 0.4,
      z: (Math.random() - 0.5) * 0.6,
      vx: (Math.random() - 0.5) * 0.03,
      vy: 0.02 + Math.random() * 0.04,
      vz: (Math.random() - 0.5) * 0.03,
      scale: 0.06 + Math.random() * 0.08,
      color: ['#ff4500', '#ff9800', '#ffeb3b', '#f43f5e'][Math.floor(Math.random() * 4)],
    }));
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.x += p.vx * (isErupting ? 2.5 : 1);
      p.y += p.vy * (isErupting ? 3 : 1);
      p.z += p.vz * (isErupting ? 2.5 : 1);

      if (p.y > 3.8) {
        p.y = 1.5;
        p.x = (Math.random() - 0.5) * 0.4;
        p.z = (Math.random() - 0.5) * 0.4;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale * (isErupting ? 1.5 : 1));
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ff7043" />
    </instancedMesh>
  );
};

export const Interactive3DPanel: React.FC = () => {
  const [modelType, setModelType] = useState<'heart' | 'volcano' | 'cake'>('cake');
  const [isErupting, setIsErupting] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  const handleErupt = () => {
    if (modelType === 'cake') {
      sound.playCelebrationSoftSound();
    } else if (modelType === 'heart') {
      sound.playPop();
    } else {
      sound.playVolcanoEruption();
    }
    setIsErupting(true);
    setBurstCount((prev) => prev + 1);
    setTimeout(() => {
      setIsErupting(false);
    }, 1200);
  };

  return (
    <div
      id="interactive-3d-panel"
      className="relative w-full h-[380px] sm:h-[460px] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header controls & title */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 pointer-events-auto shadow-sm">
          {modelType === 'heart' && (
            <>
              <Gamepad2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Interactive 3D Wonder ✨</span>
            </>
          )}
          {modelType === 'volcano' && (
            <>
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Lil Valcano 3D Playground 🌋</span>
            </>
          )}
          {modelType === 'cake' && (
            <>
              <Cake className="w-3.5 h-3.5 text-pink-400" />
              <span>Celebration Cake 3D Model 🎂</span>
            </>
          )}
        </div>

        {/* Model switcher tabs */}
        <div className="flex items-center gap-1 bg-zinc-800/80 backdrop-blur-md p-1 rounded-xl border border-zinc-700 pointer-events-auto shadow-sm">
          <button
            onClick={() => {
              sound.playPop();
              setModelType('heart');
            }}
            title="Interactive 3D Wonder (Default)"
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              modelType === 'heart'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setModelType('volcano');
            }}
            title="Lil Valcano"
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              modelType === 'volcano'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setModelType('cake');
            }}
            title="Birthday Cake"
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              modelType === 'cake'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cake className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport */}
      <div className="flex-1 w-full h-full relative">
        {modelType === 'heart' ? (
          <SplineLoveScene />
        ) : (
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas
              camera={{ position: [0, 2.0, 4.4], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.75} />
              <directionalLight position={[4, 6, 3]} intensity={1.5} castShadow />
              <pointLight position={[0, 2.2, 0]} color="#ffedd5" intensity={isErupting ? 3.5 : 1.8} />
              <pointLight position={[-3, -1, -2]} color="#6366f1" intensity={0.6} />

              <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
                {modelType === 'volcano' && (
                  <>
                    <MiniVolcanoModel isErupting={isErupting} onInteract={handleErupt} />
                    <EruptionParticles isErupting={isErupting} />
                  </>
                )}
                {modelType === 'cake' && (
                  <BirthdayCakeModel isCelebrating={isErupting} onInteract={handleErupt} />
                )}
              </Float>

              <Sparkles count={35} scale={4} size={2.5} speed={0.4} color="#f59e0b" opacity={0.6} />

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.9}
              />
            </Canvas>
          </div>
        )}
      </div>

      {/* Bottom interactive CTA banner */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center pointer-events-none">
        <button
          onClick={handleErupt}
          className="pointer-events-auto px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {modelType === 'heart' ? (
            <>
              <SparklesIcon className="w-3.5 h-3.5 fill-white/60" />
              <span>Tap to Trigger Magic Sparks! ✨ {burstCount > 0 ? `(${burstCount})` : ''}</span>
            </>
          ) : modelType === 'volcano' ? (
            <>
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Click to Erupt Joyful Sparks! ✨ {burstCount > 0 ? `(${burstCount})` : ''}</span>
            </>
          ) : (
            <>
              <Cake className="w-3.5 h-3.5" />
              <span>Make a Birthday Wish! 🎂 {burstCount > 0 ? `(${burstCount})` : ''}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Interactive3DPanel;
