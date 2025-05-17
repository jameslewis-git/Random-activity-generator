"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ParticleProps {
  color: string
  angle: number
  delay: number
  duration: number
  distance: number
  size: number
  x: number
  y: number
  shape?: 'circle' | 'star' | 'square' | 'triangle'
  rotation?: number
}

const shapes = {
  star: "M12 0 L14 8 L22 8 L16 12 L18 20 L12 16 L6 20 L8 12 L2 8 L10 8 Z",
  triangle: "M10 0 L20 20 L0 20 Z",
}

const Particle = ({ color, angle, delay, duration, distance, size, x, y, shape = 'circle', rotation = 0 }: ParticleProps) => {
  const dx = Math.cos(angle) * distance
  const dy = Math.sin(angle) * distance

  if (shape === 'circle') {
    return (
      <motion.div
        className="absolute rounded-full"
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          x,
          y,
        }}
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{
          x: x + dx,
          y: y + dy,
          scale: [0, 1, 1, 0.5, 0],
          opacity: [0, 1, 1, 0.5, 0],
          rotate: rotation,
        }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeOut",
        }}
      />
    )
  }

  if (shape === 'square') {
    return (
      <motion.div
        className="absolute"
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          x,
          y,
        }}
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{
          x: x + dx,
          y: y + dy,
          scale: [0, 1, 1, 0.5, 0],
          opacity: [0, 1, 1, 0.5, 0],
          rotate: rotation,
        }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeOut",
        }}
      />
    )
  }

  // For star and triangle shapes
  return (
    <motion.svg
      className="absolute"
      style={{
        x,
        y,
        width: size * 1.5,
        height: size * 1.5,
      }}
      viewBox={shape === 'star' ? "0 0 24 24" : "0 0 20 20"}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{
        x: x + dx,
        y: y + dy,
        scale: [0, 1, 1, 0.5, 0],
        opacity: [0, 1, 1, 0.5, 0],
        rotate: rotation,
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
    >
      <path d={shapes[shape]} fill={color} />
    </motion.svg>
  )
}

interface FloatingElementProps {
  color: string
  x: number
  y: number
  size: number
  shape: 'circle' | 'star' | 'square' | 'triangle'
}

const FloatingElement = ({ color, x, y, size, shape }: FloatingElementProps) => {
  return (
    <motion.div
      className="absolute"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0.8, 1],
        opacity: [0, 0.8, 0.5, 0],
        y: y - 100,
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      style={{ x, y }}
    >
      <Particle
        color={color}
        angle={0}
        delay={0}
        duration={3}
        distance={0}
        size={size}
        x={0}
        y={0}
        shape={shape}
        rotation={360}
      />
    </motion.div>
  )
}

interface CornerPoppersProps {
  isActive: boolean
}

export function CornerPoppers({ isActive }: CornerPoppersProps) {
  const [particles, setParticles] = useState<Array<ParticleProps>>([])
  const [floatingElements, setFloatingElements] = useState<Array<FloatingElementProps>>([])
  const colors = ['#FF2A6D', '#05D9E8', '#D1F7FF', '#7700FF', '#01FFC3', '#FFD700', '#FF69B4']
  const shapes: Array<ParticleProps['shape']> = ['circle', 'star', 'square', 'triangle']

  useEffect(() => {
    if (!isActive) return

    const corners = [
      { x: 0, y: 0 }, // Top-left
      { x: window.innerWidth, y: 0 }, // Top-right
      { x: 0, y: window.innerHeight }, // Bottom-left
      { x: window.innerWidth, y: window.innerHeight }, // Bottom-right
    ]

    const newParticles: Array<ParticleProps> = []
    const newFloatingElements: Array<FloatingElementProps> = []

    // Create floating elements around the center
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180)
      const radius = 150 + Math.random() * 100
      newFloatingElements.push({
        color: colors[Math.floor(Math.random() * colors.length)],
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: 8 + Math.random() * 12,
        shape: shapes[Math.floor(Math.random() * shapes.length)] as 'circle' | 'star' | 'square' | 'triangle',
      })
    }

    corners.forEach((corner) => {
      // Create multiple particles for each corner
      for (let i = 0; i < 12; i++) {
        const angle = (corner.x === 0 ? -45 : -135) + (Math.random() * 90)
        const angleInRadians = (angle * Math.PI) / 180

        newParticles.push({
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: angleInRadians,
          delay: Math.random() * 0.5,
          duration: 1.5 + Math.random() * 1,
          distance: 300 + Math.random() * 400,
          size: 6 + Math.random() * 12,
          x: corner.x,
          y: corner.y,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          rotation: Math.random() * 720 - 360,
        })
      }
    })

    setParticles(newParticles)
    setFloatingElements(newFloatingElements)

    // Reset particles after animation
    const timer = setTimeout(() => {
      setParticles([])
      setFloatingElements([])
    }, 3000)

    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle, index) => (
        <Particle key={`particle-${index}`} {...particle} />
      ))}
      {floatingElements.map((element, index) => (
        <FloatingElement key={`floating-${index}`} {...element} />
      ))}
    </div>
  )
} 