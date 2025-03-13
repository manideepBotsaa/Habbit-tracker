
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import GlassMorphism from "@/components/ui/GlassMorphism";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from "date-fns";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample data - in a real app, this would come from your database
  const completedDates = [
    new Date(2023, 5, 3),
    new Date(2023, 5, 4),
    new Date(2023, 5, 5),
    new Date(2023, 5, 8),
    new Date(2023, 5, 9),
    new Date(2023, 5, 10),
    new Date(2023, 5, 14),
    new Date(2023, 5, 15),
    new Date(2023, 5, 20),
    new Date(2023, 5, 21),
    new Date(2023, 5, 22),
    new Date(2023, 5, 23),
  ];
  
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get frequency of completions for heatmap
  const getCompletionIntensity = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const completions = completedDates.filter(
      (d) => format(d, "yyyy-MM-dd") === dateStr
    ).length;
    
    if (completions === 0) return "bg-secondary/50";
    if (completions === 1) return "bg-green-200 dark:bg-green-900/50";
    if (completions === 2) return "bg-green-300 dark:bg-green-800/60";
    return "bg-green-400 dark:bg-green-700/70";
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <PageTransition>
      <div className="container mx-auto max-w-3xl px-4 pb-24 pt-6 md:pb-16 md:pt-24">
        <div className="mb-8 space-y-2 text-center md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            Habit <span className="text-gradient">Calendar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Track your progress and consistency
          </motion.p>
        </div>
        
        <GlassMorphism className="mb-8 overflow-hidden p-6">
          <div className="mb-4 flex items-center justify-between">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold"
            >
              {format(currentDate, "MMMM yyyy")}
            </motion.h2>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full p-2 hover:bg-secondary"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full p-2 hover:bg-secondary"
                onClick={goToNextMonth}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-1 grid grid-cols-7 gap-1"
          >
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {days.map((day) => (
              <motion.div
                key={day.toISOString()}
                variants={itemVariants}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-sm
                  ${isToday(day) ? "border-2 border-primary" : ""}
                  ${!isSameMonth(day, currentDate) ? "text-muted-foreground/50" : ""}
                  ${getCompletionIntensity(day)}
                `}
              >
                {day.getDate()}
              </motion.div>
            ))}
          </motion.div>
        </GlassMorphism>
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Monthly Stats</h2>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" /> June 2023
          </span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassMorphism className="p-4">
              <h3 className="mb-2 text-lg font-medium">Completion Rate</h3>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">78%</div>
                <div className="text-sm text-green-500">+12% from last month</div>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="h-full bg-primary" 
                />
              </div>
            </GlassMorphism>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassMorphism className="p-4">
              <h3 className="mb-2 text-lg font-medium">Streak Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-2xl font-bold">12 days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">5 days</p>
                </div>
              </div>
            </GlassMorphism>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Calendar;
