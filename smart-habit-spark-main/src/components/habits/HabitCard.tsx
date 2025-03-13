// src/components/habits/HabitCard.tsx
import React from "react";
import { CheckCircle2, XCircle, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import GlassMorphism from "../ui/GlassMorphism";
import StreakCounter from "./StreakCounter";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    streak: number;
    completionRate: number;
    time?: string;
    completed?: boolean;
  };
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
  className?: string;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onComplete,
  onSkip,
  className,
}) => {
  const handleSwipe = (direction: "left" | "right") => {
    if (habit.completed) return; // Prevent action if already completed
    if (direction === "right" && onComplete) {
      onComplete(habit.id);
    } else if (direction === "left" && onSkip) {
      onSkip(habit.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn("w-full", className)}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          handleSwipe("right");
        } else if (info.offset.x < -100) {
          handleSwipe("left");
        }
      }}
    >
      <GlassMorphism
        className={cn(
          "p-4 glass-card transition-opacity",
          habit.completed ? "opacity-70" : "opacity-100"
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{habit.name}</h3>
          <StreakCounter count={habit.streak} />
        </div>

        <div className="mt-3 flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1.5 h-4 w-4" />
          <span>Completion: {habit.completionRate}%</span>

          {habit.time && (
            <>
              <span className="mx-2">•</span>
              <Clock className="mr-1.5 h-4 w-4" />
              <span>{habit.time}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center rounded-full px-3 py-1.5 text-sm font-medium",
              habit.completed
                ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            )}
            onClick={() => !habit.completed && onSkip && onSkip(habit.id)}
            disabled={habit.completed}
          >
            <XCircle className="mr-1.5 h-4 w-4" />
            Skip
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center rounded-full px-3 py-1.5 text-sm font-medium",
              habit.completed
                ? "bg-green-200 text-green-700 dark:bg-green-700/30 dark:text-green-500"
                : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            )}
            onClick={() => !habit.completed && onComplete && onComplete(habit.id)}
            disabled={habit.completed}
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            {habit.completed ? "Completed" : "Complete"}
          </motion.button>
        </div>
      </GlassMorphism>
    </motion.div>
  );
};

export default HabitCard;