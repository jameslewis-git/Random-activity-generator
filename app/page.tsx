"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import {
  Bike,
  Book,
  Coffee,
  Dices,
  Heart,
  Lightbulb,
  Palette,
  Plus,
  Share2,
  Sparkles,
  Star,
  Trash2,
  X,
  Gamepad2,
  Laptop2,
  Leaf,
  Zap,
  Headphones,
} from "lucide-react"
import Confetti from "./components/confetti"
import { BackgroundEffects } from "./components/background-effects"
import { Title } from "./components/title"
import { StackedCards } from "./components/stacked-cards"

// Activity type definition
type StoredActivity = Omit<Activity, 'emoji'> & {
  category: string;
}

type Activity = {
  id: string
  name: string
  description: string
  category: string
  emoji: React.ReactNode
  custom?: boolean
}

// Initial activities data
const initialActivities: Activity[] = [
  {
    id: "1",
    name: "Go for a hike",
    description: "Find a local trail and enjoy nature",
    category: "outdoor",
    emoji: <Bike className="h-6 w-6 text-green-500" />,
  },
  {
    id: "2",
    name: "Learn a new language",
    description: "Try a free lesson on Duolingo or another language app",
    category: "learn",
    emoji: <Book className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "3",
    name: "Meditate for 10 minutes",
    description: "Find a quiet spot and focus on your breathing",
    category: "relax",
    emoji: <Coffee className="h-6 w-6 text-amber-500" />,
  },
  {
    id: "4",
    name: "Draw a self-portrait",
    description: "Grab some paper and pencils and get creative",
    category: "creative",
    emoji: <Palette className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "5",
    name: "Cook a new recipe",
    description: "Find something you've never made before and give it a try",
    category: "creative",
    emoji: <Palette className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "6",
    name: "Start a journal",
    description: "Write about your day or your thoughts",
    category: "relax",
    emoji: <Coffee className="h-6 w-6 text-amber-500" />,
  },
  {
    id: "7",
    name: "Watch a documentary",
    description: "Learn something new from a documentary on a topic you're curious about",
    category: "learn",
    emoji: <Book className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "8",
    name: "Go for a bike ride",
    description: "Explore your neighborhood or a local bike path",
    category: "outdoor",
    emoji: <Bike className="h-6 w-6 text-green-500" />,
  },
  {
    id: "9",
    name: "Create a vision board",
    description: "Collect images and quotes that inspire you",
    category: "creative",
    emoji: <Palette className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "10",
    name: "Take a power nap",
    description: "Recharge with a short 20-minute nap",
    category: "relax",
    emoji: <Coffee className="h-6 w-6 text-amber-500" />,
  },
  {
    id: "11",
    name: "Listen to a podcast",
    description: "Find a podcast on a topic you're interested in",
    category: "learn",
    emoji: <Book className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "12",
    name: "Go stargazing",
    description: "Find a dark spot and look up at the night sky",
    category: "outdoor",
    emoji: <Bike className="h-6 w-6 text-green-500" />,
  },
  {
    id: "13",
    name: "Try a VR experience",
    description: "Visit a VR arcade or use a friend's headset to explore virtual worlds",
    category: "creative",
    emoji: <Headphones className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "14",
    name: "Attend a tech workshop",
    description: "Find a local coding or technology workshop to learn new skills",
    category: "learn",
    emoji: <Laptop2 className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "15",
    name: "Start a sustainable project",
    description: "Begin composting, create a small garden, or upcycle something old",
    category: "creative",
    emoji: <Leaf className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "16",
    name: "Try a fitness app workout",
    description: "Download a fitness app and follow a guided workout routine",
    category: "outdoor",
    emoji: <Zap className="h-6 w-6 text-green-500" />,
  },
  {
    id: "17",
    name: "Play a modern board game",
    description: "Try a strategy board game like Catan, Ticket to Ride, or Pandemic",
    category: "relax",
    emoji: <Gamepad2 className="h-6 w-6 text-amber-500" />,
  },
  {
    id: "18",
    name: "Take an online course",
    description: "Sign up for a free course on platforms like Coursera or edX",
    category: "learn",
    emoji: <Laptop2 className="h-6 w-6 text-blue-500" />,
  },
]

export default function ActivityGenerator() {
  // State management
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [history, setHistory] = useState<Activity[]>([])
  const [favorites, setFavorites] = useState<Activity[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    category: "outdoor",
  })
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedActivities = localStorage.getItem("activities")
    const savedFavorites = localStorage.getItem("favorites")
    const savedHistory = localStorage.getItem("history")

    if (savedActivities) {
      const parsedActivities = JSON.parse(savedActivities) as StoredActivity[];
      const reconstitutedActivities = parsedActivities.map((activity) => ({
        ...activity,
        emoji: getCategoryIcon(activity.category)
      }));
      setActivities([...initialActivities, ...reconstitutedActivities])
    } else {
      setActivities(initialActivities)
    }

    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites) as StoredActivity[];
      const reconstitutedFavorites = parsedFavorites.map((activity) => ({
        ...activity,
        emoji: getCategoryIcon(activity.category)
      }));
      setFavorites(reconstitutedFavorites)
    }

    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as StoredActivity[];
      const reconstitutedHistory = parsedHistory.map((activity) => ({
        ...activity,
        emoji: getCategoryIcon(activity.category)
      }));
      setHistory(reconstitutedHistory)
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    const customActivities = activities
      .filter((activity) => activity.custom)
      .map(({ emoji, ...rest }) => rest);
    if (customActivities.length > 0) {
      localStorage.setItem("activities", JSON.stringify(customActivities))
    }

    const storedFavorites = favorites.map(({ emoji, ...rest }) => rest);
    if (storedFavorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(storedFavorites))
    }

    const storedHistory = history.map(({ emoji, ...rest }) => rest);
    if (storedHistory.length > 0) {
      localStorage.setItem("history", JSON.stringify(storedHistory))
    }
  }, [activities, favorites, history])

  // Generate a random activity
  const generateActivity = () => {
    setIsGenerating(true)

    // Filter activities by selected category
    const filteredActivities =
      selectedCategory === "all" ? activities : activities.filter((activity) => activity.category === selectedCategory)

    if (filteredActivities.length === 0) {
      toast({
        title: "No activities found",
        description: "Try selecting a different category or adding your own activities.",
        variant: "destructive",
      })
      setIsGenerating(false)
      return
    }

    // Simulate a loading effect with activity roulette
    let counter = 0
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredActivities.length)
      setCurrentActivity(filteredActivities[randomIndex])
      counter++

      if (counter >= 10) {
        clearInterval(interval)
        const finalActivity = filteredActivities[Math.floor(Math.random() * filteredActivities.length)]
        setCurrentActivity(finalActivity)

        // Add to history
        setHistory((prev) => {
          const newHistory = [finalActivity, ...prev]
          return newHistory.slice(0, 10) // Keep only the last 10 activities
        })

        // Show confetti
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)

        setIsGenerating(false)
      }
    }, 100)
  }

  // Generate a random activity from any category
  const feelingLucky = () => {
    setSelectedCategory("all")
    generateActivity()
  }

  // Add a custom activity
  const addCustomActivity = () => {
    if (!newActivity.name || !newActivity.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const customActivity: Activity = {
      id: Date.now().toString(),
      name: newActivity.name,
      description: newActivity.description,
      category: newActivity.category,
      emoji: getCategoryIcon(newActivity.category),
      custom: true,
    }

    setActivities((prev) => [...prev, customActivity])
    setNewActivity({ name: "", description: "", category: "outdoor" })
    setIsAddActivityOpen(false)

    toast({
      title: "Activity added",
      description: "Your custom activity has been added to the list.",
    })
  }

  // Toggle favorite status
  const toggleFavorite = (activity: Activity) => {
    const isFavorite = favorites.some((fav) => fav.id === activity.id)

    if (isFavorite) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== activity.id))
      toast({ description: "Removed from favorites" })
    } else {
      setFavorites((prev) => [...prev, activity])
      toast({ description: "Added to favorites" })
    }
  }

  // Delete a custom activity
  const deleteCustomActivity = (id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id))
    setFavorites((prev) => prev.filter((activity) => activity.id !== id))
    setHistory((prev) => prev.filter((activity) => activity.id !== id))

    toast({ description: "Activity deleted" })
  }

  // Share activity
  const shareActivity = (activity: Activity) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this activity!",
          text: `${activity.name}: ${activity.description}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      navigator.clipboard.writeText(`${activity.name}: ${activity.description}`)
      toast({ description: "Copied to clipboard!" })
    }
  }

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "outdoor":
        return <Bike className="h-6 w-6 text-green-500" />
      case "learn":
        return <Laptop2 className="h-6 w-6 text-blue-500" />
      case "relax":
        return <Coffee className="h-6 w-6 text-amber-500" />
      case "creative":
        return <Palette className="h-6 w-6 text-purple-500" />
      default:
        return <Lightbulb className="h-6 w-6 text-yellow-500" />
    }
  }

  // Animation controls for UI elements
  const controls = useAnimation();
  
  // Trigger animations when activity is generated
  useEffect(() => {
    if (currentActivity) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
    }
  }, [currentActivity, controls]);

  return (
    <main className="min-h-screen relative">
      <BackgroundEffects />
      <div className="relative z-10">
        <Title />
        <div className="container mx-auto px-4 md:px-8 pt-4">
          <div className="max-w-md mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="grid grid-cols-5 mb-2 bg-opacity-20 backdrop-filter backdrop-blur-lg bg-gray-800/50 rounded-xl border border-gray-700">
                  <TabsTrigger value="all" className="data-[state=active]:bg-indigo-900 data-[state=active]:text-white text-gray-300">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="outdoor" className="data-[state=active]:bg-green-900 data-[state=active]:text-white text-gray-300">
                    <Bike className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Outdoor</span>
                  </TabsTrigger>
                  <TabsTrigger value="learn" className="data-[state=active]:bg-blue-900 data-[state=active]:text-white text-gray-300">
                    <Laptop2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Learn</span>
                  </TabsTrigger>
                  <TabsTrigger value="relax" className="data-[state=active]:bg-amber-900 data-[state=active]:text-white text-gray-300">
                    <Coffee className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Relax</span>
                  </TabsTrigger>
                  <TabsTrigger value="creative" className="data-[state=active]:bg-purple-900 data-[state=active]:text-white text-gray-300">
                    <Palette className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Create</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            <motion.div
              className="flex gap-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={generateActivity}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-indigo-500/30 backdrop-filter backdrop-blur-sm button-glow"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <Dices className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Dices className="mr-2 h-4 w-4" />
                    Generate Activity
                  </div>
                )}
              </Button>

              <Button
                onClick={feelingLucky}
                disabled={isGenerating}
                variant="outline"
                className="bg-transparent hover:bg-indigo-900/30 border border-indigo-500/50 text-indigo-300 font-medium py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg backdrop-filter backdrop-blur-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Lucky</span>
              </Button>
            </motion.div>

            <div className="mb-8">
              <AnimatePresence mode="wait">
                <StackedCards
                  activity={currentActivity}
                  isGenerating={isGenerating}
                  favorites={favorites}
                  onFavorite={toggleFavorite}
                  onShare={shareActivity}
                />
              </AnimatePresence>
            </div>

            <div className="flex justify-between mt-2">
              <div className="flex gap-2">
                <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent hover:bg-indigo-900/30 border border-indigo-500/50 text-indigo-300 button-glow">
                      <motion.span whileHover={{ scale: 1.05 }}>
                        History
                      </motion.span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gradient-to-br from-gray-900 to-indigo-900 border border-indigo-500/30 backdrop-filter backdrop-blur-lg text-white">
                    <DialogHeader>
                      <DialogTitle className="text-indigo-300">Recent Activities</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] rounded-md border border-indigo-500/30 bg-gray-900/50 p-4">
                      {history.length > 0 ? (
                        <div className="space-y-4">
                          {history.map((activity) => (
                            <motion.div
                              key={`history-${activity.id}`}
                              className="flex items-start gap-3 p-3 hover:bg-indigo-900/40 rounded-lg border border-indigo-500/20"
                              whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.4)" }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">{activity.emoji}</div>
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{activity.name}</h4>
                                <p className="text-sm text-indigo-300">{activity.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(activity)}
                                className={cn(
                                  "rounded-full hover:bg-indigo-800/50",
                                  favorites.some((fav) => fav.id === activity.id) ? "text-pink-500" : "text-gray-400",
                                )}
                              >
                                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                  <Star className="h-4 w-4" />
                                </motion.div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-indigo-300">
                          <p>No activity history yet</p>
                        </div>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>

                <Dialog open={isFavoritesOpen} onOpenChange={setIsFavoritesOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent hover:bg-indigo-900/30 border border-indigo-500/50 text-indigo-300 button-glow">
                      <motion.span whileHover={{ scale: 1.05 }}>
                        <Heart className="h-3 w-3 mr-1" />
                        Favorites
                      </motion.span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gradient-to-br from-gray-900 to-indigo-900 border border-indigo-500/30 backdrop-filter backdrop-blur-lg text-white">
                    <DialogHeader>
                      <DialogTitle className="text-indigo-300">Favorite Activities</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] rounded-md border border-indigo-500/30 bg-gray-900/50 p-4">
                      {favorites.length > 0 ? (
                        <div className="space-y-4">
                          {favorites.map((activity) => (
                            <motion.div
                              key={`favorite-${activity.id}`}
                              className="flex items-start gap-3 p-3 hover:bg-indigo-900/40 rounded-lg border border-indigo-500/20"
                              whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.4)" }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">{activity.emoji}</div>
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{activity.name}</h4>
                                <p className="text-sm text-indigo-300">{activity.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(activity)}
                                className="rounded-full hover:bg-indigo-800/50 text-pink-500"
                              >
                                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                  <X className="h-4 w-4" />
                                </motion.div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-indigo-300">
                          <p>No favorite activities yet</p>
                        </div>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 rounded-xl border border-indigo-500/30 shadow-md hover:shadow-lg">
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                    </motion.div>
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Activity</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Activity Name</Label>
                      <Input
                        id="name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        placeholder="Go for a run"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        placeholder="Run for 30 minutes in your neighborhood"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Tabs
                        value={newActivity.category}
                        onValueChange={(value) => setNewActivity({ ...newActivity, category: value })}
                      >
                        <TabsList className="grid grid-cols-4">
                          <TabsTrigger value="outdoor" className="data-[state=active]:bg-green-100">
                            <Bike className="h-4 w-4 mr-1" />
                            Outdoor
                          </TabsTrigger>
                          <TabsTrigger value="learn" className="data-[state=active]:bg-blue-100">
                            <Book className="h-4 w-4 mr-1" />
                            Learn
                          </TabsTrigger>
                          <TabsTrigger value="relax" className="data-[state=active]:bg-amber-100">
                            <Coffee className="h-4 w-4 mr-1" />
                            Relax
                          </TabsTrigger>
                          <TabsTrigger value="creative" className="data-[state=active]:bg-purple-100">
                            <Palette className="h-4 w-4 mr-1" />
                            Create
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                  <Button onClick={addCustomActivity}>Add Activity</Button>
                </DialogContent>
              </Dialog>
            </div>

            {activities.filter((a) => a.custom).length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-indigo-300 mb-2">Your Custom Activities</h3>
                <Card className="border border-indigo-500/30 shadow-lg bg-gradient-to-br from-gray-900/90 to-indigo-900/90 backdrop-filter backdrop-blur-lg">
                  <CardContent className="p-4">
                    <ScrollArea className="h-[150px]">
                      <div className="space-y-2">
                        {activities
                          .filter((a) => a.custom)
                          .map((activity) => (
                            <motion.div
                              key={activity.id}
                              className="flex items-center justify-between p-2 hover:bg-indigo-900/40 rounded-lg border border-indigo-500/20"
                              whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.4)" }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">{activity.emoji}</div>
                                <div>
                                  <h4 className="text-sm font-medium text-white">{activity.name}</h4>
                                  <p className="text-xs text-indigo-300 capitalize">{activity.category}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteCustomActivity(activity.id)}
                                className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-indigo-800/50"
                              >
                                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                  <Trash2 className="h-4 w-4" />
                                </motion.div>
                              </Button>
                            </motion.div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <Toaster />
        </div>
      </div>
    </main>
  )
}
