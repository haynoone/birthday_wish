import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { sound } from '../../utils/sound';
import { Flame, Sparkles as SparklesIcon, Heart, Cake } from 'lucide-react';
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

// Alternative Model: Birthday Cake with candles
const BirthdayCakeModel: React.FC<{ onInteract: () => void }> = ({ onInteract }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
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
      {/* Cake Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.8, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.4} />
      </mesh>
      {/* Frosting layer */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[1.52, 1.52, 0.1, 16]} />
        <meshStandardMaterial color="#fb7185" roughness={0.3} />
      </mesh>
      {/* Top Tier */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.75, 16]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.64, 0]}>
        <cylinderGeometry args={[1.02, 1.02, 0.08, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.3} />
      </mesh>

      {/* 3 Candles */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <group key={i} position={[x, 1.9, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.45, 8]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          {/* Flame */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} />
          </mesh>
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
  const [modelType, setModelType] = useState<'heart' | 'volcano' | 'cake'>('heart');
  const [isErupting, setIsErupting] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  const handleErupt = () => {
    if (modelType === 'heart') {
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
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40 animate-pulse" />
              <span>Interactive 3D Love ✨</span>
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
              <span>Birthday Cake 3D Model 🎂</span>
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
            title="Interactive 3D Love (Default)"
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              modelType === 'heart'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
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
              camera={{ position: [0, 1.8, 3.8], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[4, 5, 3]} intensity={1.4} castShadow />
              <pointLight position={[0, 2, 0]} color="#ff5722" intensity={isErupting ? 4 : 2} />
              <pointLight position={[-3, -1, -2]} color="#6366f1" intensity={0.8} />

              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                {modelType === 'volcano' && (
                  <>
                    <MiniVolcanoModel isErupting={isErupting} onInteract={handleErupt} />
                    <EruptionParticles isErupting={isErupting} />
                  </>
                )}
                {modelType === 'cake' && <BirthdayCakeModel onInteract={handleErupt} />}
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
              <Heart className="w-3.5 h-3.5 fill-white/60" />
              <span>Tap to Send Joyful Love! 💖 {burstCount > 0 ? `(${burstCount})` : ''}</span>
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
