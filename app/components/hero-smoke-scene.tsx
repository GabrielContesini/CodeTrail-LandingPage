"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function seededNoise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function OrbitScene() {
  const rings = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Group>(null);
  const sparks = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => ({
        position: [
          (seededNoise(index + 1) - 0.5) * 9,
          (seededNoise(index + 17) - 0.5) * 6,
          (seededNoise(index + 31) - 0.5) * 5,
        ] as [number, number, number],
      })),
    [],
  );
  const sparkPositions = useMemo(
    () => new Float32Array(sparks.flatMap((spark) => spark.position)),
    [sparks],
  );

  useFrame((state, delta) => {
    if (rings.current) {
      rings.current.rotation.z += delta * 0.08;
      rings.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.1;
    }

    if (clouds.current) {
      clouds.current.rotation.y -= delta * 0.06;
      clouds.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.18) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={1.15} />
      <pointLight position={[0, 0, 6]} intensity={22} color="#1debe3" />
      <pointLight position={[2, -1, 4]} intensity={10} color="#83ffd6" />

      <group ref={rings}>
        {[2.4, 3.2, 4.1].map((radius, index) => (
          <mesh
            key={radius}
            rotation={[
              Math.PI / 2.5 + index * 0.16,
              0.12 * index,
              index * 0.42,
            ]}
          >
            <torusGeometry args={[radius, 0.03, 16, 220]} />
            <meshBasicMaterial
              color={index === 1 ? "#83ffd6" : "#1debe3"}
              transparent
              opacity={0.42 - index * 0.08}
            />
          </mesh>
        ))}
      </group>

      <group ref={clouds}>
        {[
          { position: [-2.4, 0.4, -1.8], scale: 2.2, color: "#1debe3" },
          { position: [1.8, -1.2, -1.4], scale: 1.8, color: "#83ffd6" },
          { position: [0.4, 1.8, -2.2], scale: 2.6, color: "#6fe9ff" },
          { position: [-0.6, -2.0, -1.1], scale: 1.5, color: "#1debe3" },
        ].map((cloud) => (
          <mesh
            key={`${cloud.position.join("-")}`}
            position={cloud.position as [number, number, number]}
            scale={cloud.scale}
          >
            <sphereGeometry args={[1, 24, 24]} />
            <meshBasicMaterial
              color={cloud.color}
              transparent
              opacity={0.07}
            />
          </mesh>
        ))}
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#b9fff7"
          size={0.045}
          transparent
          opacity={0.78}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export function HeroSmokeScene() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-95">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 48 }}
        gl={{ alpha: true, antialias: true }}
      >
        <OrbitScene />
      </Canvas>
      <div className="hero-scene-vignette" />
    </div>
  );
}
