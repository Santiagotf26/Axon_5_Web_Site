import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

export function Brain3D() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#10b981" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#059669" />
      
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      <Float
        speed={2} // Animation speed, defaults to 1
        rotationIntensity={1} // XYZ rotation intensity, defaults to 1
        floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      >
        <Sphere ref={sphereRef} args={[1.5, 64, 64]} scale={1.2}>
          <MeshDistortMaterial
            color="#059669"
            attach="material"
            distort={0.4} // Amount of distortion
            speed={2} // Speed of distortion
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
          />
        </Sphere>
        
        {/* Inner solid core */}
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color="#10b981"
            roughness={0.1}
            metalness={0.9}
            emissive="#059669"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
    </>
  );
}
