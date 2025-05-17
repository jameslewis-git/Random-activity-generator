"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Activity } from "../types"
import { Button } from "@/components/ui/button"
import { Share2, Star } from "lucide-react"

interface StackedCardsProps {
  activity: Activity | null
  isGenerating: boolean
  favorites: Activity[]
  onFavorite: (activity: Activity) => void
  onShare: (activity: Activity) => void
}

export function StackedCards({ activity, isGenerating, favorites, onFavorite, onShare }: StackedCardsProps) {
  // Animation variants for the cards
  const cardVariants = {
    initial: (custom: number) => ({
      opacity: 0,
      y: 50,
      scale: 1 - custom * 0.05,
      rotateZ: custom % 2 === 0 ? -5 : 5,
    }),
    animate: (custom: number) => ({
      opacity: 1,
      y: -custom * 15,
      scale: 1 - custom * 0.05,
      rotateZ: custom % 2 === 0 ? -3 : 3,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 1,
        delay: custom * 0.2,
        duration: 0.5 + custom * 0.1,
      },
    }),
    exit: (custom: number) => ({
      opacity: 0,
      y: -100,
      scale: 0.8,
      rotateZ: custom % 2 === 0 ? -8 : 8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.4,
        delay: (2 - custom) * 0.1,
      },
    }),
    hover: {
      y: -20,
      scale: 1.05,
      rotateZ: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        mass: 1.2,
      },
    },
  }

  // Generate dummy cards for the stack effect
  const dummyCards = [0, 1, 2]

  return (
    <div className="relative w-full max-w-lg mx-auto min-h-[280px] perspective-1000">
      <AnimatePresence mode="wait">
        {activity ? (
          <div className="relative w-full pt-8">
            {/* Background stack cards */}
            {dummyCards.map((index) => (
              <motion.div
                key={`stack-${index}`}
                custom={index + 1}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-x-0 top-0 pointer-events-none mx-auto"
                style={{
                  zIndex: 2 - index,
                  filter: `brightness(${1 - index * 0.1})`,
                  width: `${100 - index * 2}%`,
                  marginTop: index * 8,
                }}
              >
                <Card className="w-full border border-indigo-500/20 shadow-xl bg-gradient-to-br from-gray-900/80 to-indigo-900/80 backdrop-filter backdrop-blur-sm rounded-xl">
                  <CardContent className="p-6 opacity-50">
                    <div className="w-full h-4 bg-indigo-500/10 rounded animate-pulse" />
                    <div className="w-2/3 h-4 bg-indigo-500/10 rounded animate-pulse mt-2" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Main activity card */}
            <motion.div
              key={activity.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              custom={0}
              className="relative z-10 mx-auto"
              style={{
                filter: "brightness(1.1)",
              }}
            >
              <Card className="w-full overflow-hidden border border-indigo-500/30 shadow-xl bg-gradient-to-br from-gray-900/90 to-indigo-900/90 backdrop-filter backdrop-blur-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {activity.emoji}
                      </motion.div>
                      <div>
                        <motion.h3 
                          className="text-xl font-bold text-white"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          {activity.name}
                        </motion.h3>
                        <motion.p 
                          className="text-sm text-indigo-300 capitalize"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        >
                          {activity.category}
                        </motion.p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onFavorite(activity)}
                        className={cn(
                          "rounded-full hover:bg-indigo-800/50",
                          favorites.some((fav) => fav.id === activity.id) ? "text-pink-500" : "text-gray-400"
                        )}
                      >
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: 15 }} 
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Star className="h-5 w-5" />
                        </motion.div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onShare(activity)}
                        className="rounded-full hover:bg-indigo-800/50 text-gray-400"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: -15 }} 
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Share2 className="h-5 w-5" />
                        </motion.div>
                      </Button>
                    </div>
                  </div>
                  <motion.p 
                    className="mt-4 text-gray-300 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {activity.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Card className="w-full h-full overflow-hidden border border-dashed border-indigo-500/30 bg-gray-900/50 backdrop-filter backdrop-blur-lg rounded-xl">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="mb-3"
                >
                  <div className="h-12 w-12 text-indigo-400">🎲</div>
                </motion.div>
                <motion.p 
                  className="text-indigo-300"
                  animate={{ 
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {isGenerating ? "Finding an activity for you..." : "Click generate to discover your next activity"}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 