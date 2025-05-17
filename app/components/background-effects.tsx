"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DotsShader } from "./dots-shader"
import { ParticleVortex } from "./particle-vortex"

type Particle = {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

export function BackgroundEffects() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Generate particles on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Handle window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    // Generate particles
    const newParticles: Particle[] = []
    const colors = ["#8b5cf6", "#6366f1", "#ec4899", "#8b5cf6", "#6366f1"]

    for (let i = 0; i < 25; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })
    }

    setParticles(newParticles)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />

      {/* DotsShader */}
      <div className="absolute inset-0 opacity-50">
        <DotsShader
          colors={[
            [255, 99, 71],  // Tomato
            [255, 165, 0],  // Orange
            [255, 215, 0],  // Gold
          ]}
          opacities={[0.4, 0.4, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 1]}
          totalSize={5}
          dotSize={1.5}
        />
      </div>

      {/* ParticleVortex */}
      <div className="absolute inset-0 opacity-30">
        <ParticleVortex
          centerSize={128}
          particleCount={2000}
          particleSpeed={0.001}
          color="#6b7280"
        />
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 via-indigo-800/5 to-purple-900/5 animate-pulse" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-5 animate-blob" />
      <div className="absolute top-3/4 -right-20 w-60 h-60 bg-indigo-600 rounded-full filter blur-3xl opacity-5 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-600 rounded-full filter blur-3xl opacity-5 animate-blob animation-delay-4000" />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-10"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTIgMGgydjJoLTJ2LTJ6bS0yLTRoMnYyaC0ydi0yek0zNCAyMHYyaC0ydi0yaDJ6bTAgNGgydjJoLTJ2LTJ6bS00LTRoMnYyaC0ydi0yek0zMCAyMGgydjJoLTJ2LTJ6bS0yLTRoMnYyaC0ydi0yek0yMiAyNGgydjJoLTJ2LTJ6bTAgNGgydjJoLTJ2LTJ6bS00LTRoMnYyaC0ydi0yek0xOCAyMGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5" />
    </div>
  )
}