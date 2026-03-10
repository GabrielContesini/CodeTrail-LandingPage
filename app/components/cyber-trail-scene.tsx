"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

function pseudoRandom(seed: number) {
 const x = Math.sin(seed * 9999.123) * 43758.5453;
 return x - Math.floor(x);
}

function TrailParticles() {
 const instancesRef = useRef<THREE.InstancedMesh>(null);
 const particleCount = 2500;

 const curve = useMemo(() => {
  return new THREE.CatmullRomCurve3([
   new THREE.Vector3(0, 0, 0),
   new THREE.Vector3(4, 2, -15),
   new THREE.Vector3(-4, -2, -30),
   new THREE.Vector3(6, 4, -45),
   new THREE.Vector3(-6, -4, -60),
   new THREE.Vector3(0, 0, -80),
  ]);
 }, []);

 const dummy = useMemo(() => new THREE.Object3D(), []);

 const particles = useMemo(() => {
  const temp = [];
  for (let i = 0; i < particleCount; i++) {
   const t = pseudoRandom(i + 1);
   const pos = curve.getPointAt(t);
   const spreadX = pseudoRandom(i + 101) - 0.5;
   const spreadY = pseudoRandom(i + 202) - 0.5;
   const spreadZ = pseudoRandom(i + 303) - 0.5;

   pos.x += spreadX * 16;
   pos.y += spreadY * 16;
   pos.z += spreadZ * 6;

   temp.push({
    t,
    position: pos,
    scale: pseudoRandom(i + 404) * 0.05 + 0.01,
    speed: pseudoRandom(i + 505) * 0.02 + 0.01,
   });
  }
  return temp;
 }, [curve]);

 useFrame((state) => {
  if (!instancesRef.current) return;
  const time = state.clock.elapsedTime;

  // animate particles
  particles.forEach((p, i) => {
   const s = p.scale + Math.sin(time * 3 + i) * 0.02;
   dummy.position.copy(p.position);
   // slight flow forward
   dummy.position.z += Math.sin(time + p.t * 5) * 0.2;
   dummy.scale.set(s, s, s);
   dummy.updateMatrix();
   instancesRef.current!.setMatrixAt(i, dummy.matrix);
  });
  instancesRef.current.instanceMatrix.needsUpdate = true;

  // camera path based on scroll
  const scrollY = window.scrollY || 0;
  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  const scrollProgress = scrollY / maxScroll;

  const targetT = Math.min(scrollProgress * 0.95, 0.95);
  const camPos = curve.getPointAt(targetT);
  const lookAtPos = curve.getPointAt(Math.min(targetT + 0.05, 1.0));

  state.camera.position.lerp(new THREE.Vector3(camPos.x, camPos.y, camPos.z + 5), 0.05);

  const targetQ = new THREE.Quaternion().setFromRotationMatrix(
   new THREE.Matrix4().lookAt(state.camera.position, lookAtPos, state.camera.up)
  );
  state.camera.quaternion.slerp(targetQ, 0.05);
 });

 return (
  <instancedMesh ref={instancesRef} args={[undefined, undefined, particleCount]}>
   <sphereGeometry args={[1, 8, 8]} />
   <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
  </instancedMesh>
 );
}

export function CyberTrailScene() {
 const mounted = useSyncExternalStore(
  () => () => {},
  () => true,
  () => false,
 );

 if (!mounted) return null;

 return (
  <div className="canvas-container">
   <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: false }}>
    <fog attach="fog" args={["#000000", 5, 30]} />
    <TrailParticles />
   </Canvas>
  </div>
 );
}
