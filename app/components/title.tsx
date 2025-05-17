"use client"

import { motion } from "framer-motion"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

export function Title() {
  return (
    <div className="relative w-full flex flex-col justify-center items-center py-8">
      <motion.h1 
        className={`${orbitron.className} text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-tight`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Activity Generator
      </motion.h1>
      
      {/* Animated gradient divider */}
      <motion.div 
        className="w-full max-w-[400px] mt-6 mb-5 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="gradient-divider">
          <div className="glow-dot" style={{ animationDelay: "0s" }}></div>
          <div className="glow-dot" style={{ animationDelay: "1s" }}></div>
          <div className="glow-dot" style={{ animationDelay: "2s" }}></div>
        </div>
      </motion.div>
      
      <motion.p
        className="text-gray-400 text-lg mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Discover your next adventure
      </motion.p>
    </div>
  )
} 