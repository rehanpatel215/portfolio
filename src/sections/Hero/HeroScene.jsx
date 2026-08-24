import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural wave component
function OceanWaves() {
  const meshRef = useRef();

  // Create a grid of points on the plane
  const planeSize = 16;
  const segments = 40;

  // We displace the vertices in the useFrame loop for real-time motion
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    const posAttr = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < posAttr.count; i++) {
      // Get current x and y coordinate of the vertex
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      
      // Wave equation: layered sine/cosine waves for fluid movement
      const zOffset = 
        Math.sin(x * 0.6 + time * 1.0) * 0.25 + 
        Math.cos(y * 0.5 + time * 0.8) * 0.2 +
        Math.sin((x + y) * 0.3 + time * 0.5) * 0.1;
      
      posAttr.setZ(i, zOffset);
    }
    
    posAttr.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2.2, 0, 0]} 
      position={[0, -1.2, 0]}
      receiveShadow
    >
      <planeGeometry args={[planeSize, planeSize, segments, segments]} />
      <meshStandardMaterial
        color="#1b5a75" // Lagoon Blue base
        roughness={0.15}
        metalness={0.8}
        flatShading={true} // Low-poly water styling
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Glowing Sun Halo component
function GoldenSun() {
  const sunRef = useRef();

  useFrame(({ clock }) => {
    if (!sunRef.current) return;
    const time = clock.getElapsedTime();
    // Soft breathing scale animation
    const scale = 1 + Math.sin(time * 1.5) * 0.04;
    sunRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={[0, 1.5, -3]}>
      {/* Dynamic light representing the sun */}
      <pointLight 
        color="#F4C87A" 
        intensity={2.5} 
        distance={20} 
        decay={1.5}
        castShadow
      />
      {/* Sun Mesh */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial color="#F4C87A" />
      </mesh>
      
      {/* Glow Halo Ring */}
      <mesh scale={[1.4, 1.4, 1.4]}>
        <torusGeometry args={[0.9, 0.08, 16, 100]} />
        <meshBasicMaterial 
          color="#FF7F5C" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Floating sand motes / bubbles component
function SandParticles({ count = 120 }) {
  const pointsRef = useRef();
  
  // Initialize particles in a bounding box
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8; // z
      sp[i] = 0.005 + Math.random() * 0.01;
    }
    return [pos, sp];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y += speeds[i];
      // Reset position when it floats out of screen
      if (y > 4) {
        y = -4;
      }
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8FD6E1" // Shallow Water color glow
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} color="#8FD6E1" />
        
        {/* Soft fill light from the bottom representing reflected beach glow */}
        <directionalLight 
          position={[0, -2, 1]} 
          intensity={0.4} 
          color="#123B4F" 
        />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <OceanWaves />
          <GoldenSun />
        </Float>

        <SandParticles count={150} />
      </Canvas>
    </div>
  );
}
