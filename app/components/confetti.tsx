"use client"

import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    })

    // Fire confetti with enhanced animation
    const duration = 4 * 1000
    const end = Date.now() + duration

    // Modern futuristic color palette
    const colors = ["#FF2A6D", "#05D9E8", "#D1F7FF", "#7700FF", "#01FFC3"]
    
    // Initial burst
    myConfetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
    })

    // Continuous side bursts
    ;(function frame() {
      myConfetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        decay: 0.94,
        startVelocity: 30,
      })
      myConfetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        decay: 0.94,
        startVelocity: 30,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()

    return () => {
      myConfetti.reset()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  )
}
