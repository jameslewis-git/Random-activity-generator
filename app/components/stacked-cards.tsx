"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Activity } from "../types"
import { Button } from "@/components/ui/button"
import { Share2, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { CornerPoppers } from "./corner-poppers"

interface StackedCardsProps {
  activity: Activity | null
  isGenerating: boolean
  favorites: Activity[]
  onFavorite: (activity: Activity) => void
  onShare: (activity: Activity) => void
}

export function StackedCards({ activity, isGenerating, favorites, onFavorite, onShare }: StackedCardsProps) {
  const [showPoppers, setShowPoppers] = useState(false)
  const [shuffleCards, setShuffleCards] = useState(false)

  // Trigger animations when activity changes
  useEffect(() => {
    if (activity) {
      setShowPoppers(true)
      setShuffleCards(true)
      const timer = setTimeout(() => {
        setShowPoppers(false)
        setShuffleCards(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [activity?.id])

  const cardVariants = {
    initial: (custom: number) => ({
      opacity: 0,
      y: -200,
      x: custom % 2 === 0 ? 50 : -50,
      scale: 1.5,
      rotateY: 180,
      rotateX: -45,
      rotateZ: custom % 2 === 0 ? -15 : 15,
      transformPerspective: 2000,
      transformStyle: "preserve-3d",
      transformOrigin: "center center",
    }),
    animate: (custom: number) => ({
      opacity: 1,
      y: custom * -8,
      x: Math.sin(custom) * 5,
      scale: 1 - custom * 0.03,
      rotateY: 0,
      rotateX: custom * -1.5,
      rotateZ: Math.sin(custom) * 2,
      transformPerspective: 2000,
      transformStyle: "preserve-3d",
      transformOrigin: "center center",
      transition: {
        opacity: { duration: 0.5, delay: custom * 0.2 },
        y: { 
          type: "spring",
          stiffness: 30,
          damping: 12,
          mass: 1,
          delay: custom * 0.3,
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: 0.5 + (custom * 0.2),
        },
        x: {
          type: "spring",
          stiffness: 40,
          damping: 12,
          mass: 1,
          delay: custom * 0.3,
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: 0.3 + (custom * 0.2),
        },
        rotateY: { 
          type: "spring",
          stiffness: 30,
          damping: 12,
          mass: 1,
          delay: custom * 0.3,
          duration: 1.5
        },
        rotateX: {
          type: "spring",
          stiffness: 30,
          damping: 12,
          mass: 1,
          delay: custom * 0.3,
          duration: 1.5
        },
        rotateZ: {
          type: "spring",
          stiffness: 30,
          damping: 12,
          mass: 1,
          delay: custom * 0.3,
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: 0.4 + (custom * 0.2),
        },
        scale: {
          type: "spring",
          stiffness: 30,
          damping: 15,
          mass: 1,
          delay: custom * 0.3,
          duration: 1.5
        }
      },
    }),
    exit: (custom: number) => ({
      opacity: 0,
      y: 200,
      x: custom % 2 === 0 ? 100 : -100,
      scale: 0.8,
      rotateY: -180,
      rotateX: 45,
      rotateZ: custom % 2 === 0 ? 15 : -15,
      transition: {
        duration: 0.8,
        delay: (5 - custom) * 0.1,
        ease: "easeInOut"
      },
    }),
    hover: {
      y: -15,
      scale: 1.02,
      rotateY: [0, -5, 5, 0],
      rotateX: [0, 3, -3, 0],
      rotateZ: [0, -2, 2, 0],
      transition: {
        rotateY: {
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        },
        rotateX: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        },
        rotateZ: {
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.5,
        },
        y: {
          duration: 0.5,
        },
      },
    },
  }

  // Generate dummy cards for the stack effect with different z-indexes and positions
  const dummyCards = [
    { index: 0, z: 5, offset: 0, scale: 1 },
    { index: 1, z: 4, offset: 8, scale: 0.98 },
    { index: 2, z: 3, offset: 16, scale: 0.96 },
    { index: 3, z: 2, offset: 24, scale: 0.94 },
    { index: 4, z: 1, offset: 32, scale: 0.92 },
  ]

  // Celebration animation variants
  const celebrationVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [1, 1.2, 1],
      opacity: [0, 1, 0],
      transition: {
        duration: 1.2,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      }
    }
  }

  return (
    <>
      <CornerPoppers isActive={showPoppers} />
      <div className="relative w-full max-w-lg mx-auto min-h-[240px] perspective-1000 mt-8 mb-4">
        {/* Celebration effects */}
        {activity && (
          <>
            <motion.div
              key={`celebration-1-${activity.id}`}
              variants={celebrationVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl z-0"
            />
            <motion.div
              key={`celebration-2-${activity.id}`}
              variants={celebrationVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
              className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-3xl z-0"
            />
          </>
        )}
        
        <AnimatePresence mode="wait" initial={false} presenceAffectsLayout>
          {activity ? (
            <div className="relative w-full pt-4" key={`stack-${activity.id}-${Date.now()}`}>
              <AnimatePresence mode="sync" initial={false}>
                {/* Background stack cards */}
                {dummyCards.map((card) => (
                  <motion.div
                    key={`stack-${activity.id}-${card.index}-${Date.now()}`}
                    custom={card.index + 1}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-x-0 top-0 pointer-events-none mx-auto will-change-transform"
                    style={{
                      zIndex: card.z,
                      filter: `brightness(${1 - card.index * 0.05})`,
                      width: `${100 - card.index * 1}%`,
                      marginTop: card.offset,
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      transform: `scale(${card.scale})`,
                    }}
                  >
                    <Card className="w-full border-2 border-indigo-500/50 shadow-xl bg-gradient-to-br from-gray-700/95 to-indigo-700/95 backdrop-filter backdrop-blur-sm rounded-xl">
                      <CardContent className="p-6 opacity-80">
                        <div className="w-full h-4 bg-indigo-500/30 rounded animate-pulse" />
                        <div className="w-2/3 h-4 bg-indigo-500/30 rounded animate-pulse mt-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Main activity card */}
                <motion.div
                  key={`main-${activity.id}-${Date.now()}`}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  custom={0}
                  className="relative z-10 mx-auto will-change-transform"
                  style={{
                    filter: "brightness(1.1)",
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Card className="w-full overflow-hidden border border-indigo-500/30 shadow-xl bg-gradient-to-br from-gray-900/90 to-indigo-900/90 backdrop-filter backdrop-blur-lg rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg will-change-transform"
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ 
                              rotate: 0, 
                              scale: 1,
                              transition: {
                                type: "spring",
                                stiffness: 80,
                                damping: 15,
                                duration: 1,
                                delay: 0.6
                              }
                            }}
                            whileHover={{ 
                              scale: 1.1, 
                              rotate: 5,
                              transition: {
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                duration: 0.5
                              }
                            }}
                          >
                            {activity.emoji}
                          </motion.div>
                          <div>
                            <motion.h3 
                              className="text-xl font-bold text-white"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8, duration: 0.8 }}
                            >
                              {activity.name}
                            </motion.h3>
                            <motion.p 
                              className="text-sm text-indigo-300 capitalize"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1, duration: 0.8 }}
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
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                delay: 1.2, 
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                                duration: 0.8
                              }}
                              whileHover={{ 
                                scale: 1.2, 
                                rotate: 15,
                                transition: {
                                  duration: 0.4
                                }
                              }} 
                              whileTap={{ scale: 0.9 }}
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
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ 
                                delay: 1.4, 
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                                duration: 0.8
                              }}
                              whileHover={{ 
                                scale: 1.2, 
                                rotate: -15,
                                transition: {
                                  duration: 0.4
                                }
                              }} 
                              whileTap={{ scale: 0.9 }}
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
                        transition={{ delay: 1.1, duration: 0.8 }}
                      >
                        {activity.description}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              key="empty-state"
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
    </>
  )
} 