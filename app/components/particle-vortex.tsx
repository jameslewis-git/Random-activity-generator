"use client"

import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'

type ParticleVortexProps = {
  centerSize?: number
  particleCount?: number
  particleSpeed?: number
  color?: string
}

function VortexField({ centerSize = 128, particleCount = 500, particleSpeed = 0.005, color = '#2e2e2e' }) {
  const meshRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = []
    const radius = 5 // Increased radius for wider spread
    
    for (let i = 0; i < particleCount; i++) {
      // Scatter particles across the entire space
      const x = (Math.random() - 0.5) * radius * 2
      const y = (Math.random() - 0.5) * radius * 2
      const z = (Math.random() - 0.5) * 2
      
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [particleCount])

  // Store initial positions for oscillation
  const initialPositions = useMemo(() => new Float32Array(particles), [particles])
  const time = useRef(0)

  useFrame((state) => {
    if (!meshRef.current) return
    
    time.current += particleSpeed
    
    // Update individual particle positions
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      const ix = initialPositions[i]
      const iy = initialPositions[i + 1]
      
      // Add subtle oscillating movement
      positions[i] = ix + Math.sin(time.current + ix) * 0.3
      positions[i + 1] = iy + Math.cos(time.current + iy) * 0.3
      positions[i + 2] = initialPositions[i + 2] + Math.sin(time.current * 0.5 + ix) * 0.2
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
    
    // Slow rotation of the entire field
    meshRef.current.rotation.z += particleSpeed * 0.1
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  )
}

export function ParticleVortex({ 
  centerSize = 128, 
  particleCount = 500, 
  particleSpeed = 0.005, 
  color = '#2e2e2e' 
}: ParticleVortexProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <VortexField
        centerSize={centerSize}
        particleCount={particleCount}
        particleSpeed={particleSpeed}
        color={color}
      />
    </Canvas>
  )
} 