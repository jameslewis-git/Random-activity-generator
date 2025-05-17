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
        <motion.div 
          className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </motion.h1>
      <motion.p
        className="text-gray-400 mt-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Discover your next adventure
      </motion.p>
    </div>
  )
} 