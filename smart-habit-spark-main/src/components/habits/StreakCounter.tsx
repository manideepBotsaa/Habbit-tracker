// src/components/habits/StreakCounter.tsx
import React from "react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  count: number | undefined; // Allow undefined for safety
  className?: string;
  size?: "sm" | "md" | "lg";
}

const StreakCounter: React.FC<StreakCounterProps> = ({
  count = 0, // Default to 0 if undefined
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-base gap-1.5",
    lg: "text-lg gap-2",
  };

  const flameSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={cn(
        "flex items-center font-semibold text-orange-500 dark:text-orange-400",
        sizeClasses[size],
        className
      )}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Flame
          size={flameSize[size]}
          className="fill-orange-500/30 dark:fill-orange-400/30"
        />
      </motion.div>
      <span>{count || 0} day{(count || 0) !== 1 ? "s" : ""}</span>
    </div>
  );
};

export default StreakCounter;