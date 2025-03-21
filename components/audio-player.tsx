"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Pause, Play } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  title: string
  audioUrl: string
  icon?: React.ReactNode
  className?: string
}

export function AudioPlayer({ title, audioUrl, icon, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current) return

    audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 glass-card p-3 rounded-lg transition-all duration-300 hover-lift",
        isPlaying ? "border-primary/30 dark:border-primary/40 neon-glow" : "",
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant={isPlaying ? "premium" : "outline"}
          size="icon"
          className={cn(
            "h-8 w-8 shrink-0 relative overflow-hidden",
            isPlaying ? "shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "",
          )}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Pause size={16} />
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
              <Play size={16} />
            </motion.div>
          )}

          {isPlaying && <span className="absolute inset-0 rounded-full animate-pulse-glow opacity-50"></span>}
        </Button>
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className={cn("text-muted-foreground", isPlaying ? "text-primary" : "")}>{icon}</span>}
          <span className={cn("font-medium text-sm truncate", isPlaying ? "text-primary" : "")}>{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.01}
            onValueChange={handleTimeChange}
            className="flex-1"
          />
          <motion.span
            className="text-xs text-muted-foreground whitespace-nowrap"
            animate={{ opacity: isHovering || isPlaying ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </motion.span>
        </div>
      </div>
    </div>
  )
}

