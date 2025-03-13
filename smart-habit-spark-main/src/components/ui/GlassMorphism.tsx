
import React from "react";
import { cn } from "@/lib/utils";

interface GlassMorphismProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "light" | "medium" | "heavy";
  className?: string;
  hover?: boolean;
}

const GlassMorphism: React.FC<GlassMorphismProps> = ({ 
  children, 
  intensity = "medium", 
  className,
  hover = true,
  ...props 
}) => {
  const intensityMap = {
    light: "bg-white/40 dark:bg-black/20 backdrop-blur-sm",
    medium: "bg-white/60 dark:bg-black/40 backdrop-blur-md",
    heavy: "bg-white/80 dark:bg-black/60 backdrop-blur-xl",
  };

  return (
    <div
      className={cn(
        intensityMap[intensity],
        "border border-white/20 dark:border-white/10 rounded-2xl shadow-lg",
        hover && "transition-all duration-300 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassMorphism;
