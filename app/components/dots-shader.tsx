"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type DotsShaderProps = {
  colors: number[][]
  opacities: number[]
  totalSize?: number
  dotSize?: number
}

function DotField({ colors, opacities, totalSize = 5, dotSize = 1 }) {
  const meshRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * totalSize - totalSize / 2
      const y = Math.random() * totalSize - totalSize / 2
      const z = Math.random() * totalSize - totalSize / 2
      
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [totalSize])

  const colorArray = useMemo(() => {
    const temp = []
    const color = new THREE.Color()
    
    for (let i = 0; i < 2000; i++) {
      const colorSet = colors[Math.floor(Math.random() * colors.length)]
      color.setRGB(colorSet[0] / 255, colorSet[1] / 255, colorSet[2] / 255)
      temp.push(color.r, color.g, color.b)
    }
    
    return new Float32Array(temp)
  }, [colors])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
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
        <bufferAttribute
          attach="attributes-color"
          count={colorArray.length / 3}
          array={colorArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={dotSize * 0.015}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  )
}

export function DotsShader({ colors, opacities, totalSize = 5, dotSize = 1 }: DotsShaderProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      gl={{ alpha: false }}
    >
      <color attach="background" args={['#000000']} />
      <DotField
        colors={colors}
        opacities={opacities}
        totalSize={totalSize}
        dotSize={dotSize}
      />
    </Canvas>
  )
} 